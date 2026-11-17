package com.geodemo.service;

import com.geodemo.domain.Channel;
import com.geodemo.domain.MonitorQuestion;
import com.geodemo.repo.BrandRepository;
import com.geodemo.repo.ChannelRepository;
import com.geodemo.repo.QuestionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

/**
 * Agent 对话：配置了 DEEPSEEK_API_KEY 时调用大模型，
 * 未配置时用数据库中的真实指标做规则化回答，保证原型始终可用。
 */
@Service
public class AgentService {

    private static final Logger log = LoggerFactory.getLogger(AgentService.class);

    private final BrandRepository brands;
    private final QuestionRepository questions;
    private final ChannelRepository channels;
    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public AgentService(BrandRepository brands, QuestionRepository questions,
                        ChannelRepository channels,
                        @Value("${geodemo.deepseek.base-url}") String baseUrl,
                        @Value("${geodemo.deepseek.model}") String model,
                        @Value("${geodemo.deepseek.api-key:}") String apiKey) {
        this.brands = brands;
        this.questions = questions;
        this.channels = channels;
        this.model = model;
        this.apiKey = apiKey;
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public record Answer(String reply, String source, long latencyMs) {
    }

    public Answer chat(Long brandId, String message) {
        long start = System.currentTimeMillis();
        String context = buildContext(brandId);

        if (apiKey == null || apiKey.isBlank()) {
            return new Answer(localAnswer(brandId, message, context), "local-rule", System.currentTimeMillis() - start);
        }

        try {
            Map<String, Object> body = Map.of(
                    "model", model,
                    "temperature", 0.3,
                    "messages", List.of(
                            Map.of("role", "system", "content",
                                    "你是 GEO（生成式引擎优化）分析助手。只依据给定的品牌数据回答，"
                                            + "用中文输出，结论先行，给出 2 到 4 条可执行建议。不要编造未提供的数据。"),
                            Map.of("role", "user", "content", "品牌数据：\n" + context + "\n\n任务：" + message)
                    )
            );
            Map<?, ?> response = restClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            String reply = extractContent(response);
            if (reply == null || reply.isBlank()) {
                return new Answer(localAnswer(brandId, message, context), "local-fallback",
                        System.currentTimeMillis() - start);
            }
            return new Answer(reply, "deepseek", System.currentTimeMillis() - start);
        } catch (Exception e) {
            log.warn("调用大模型失败，回退到规则回答：{}", e.getMessage());
            return new Answer(localAnswer(brandId, message, context), "local-fallback",
                    System.currentTimeMillis() - start);
        }
    }

    @SuppressWarnings("unchecked")
    private String extractContent(Map<?, ?> response) {
        if (response == null) {
            return null;
        }
        Object choices = response.get("choices");
        if (!(choices instanceof List<?> list) || list.isEmpty()) {
            return null;
        }
        Object first = list.get(0);
        if (!(first instanceof Map<?, ?> choice)) {
            return null;
        }
        Object msg = choice.get("message");
        if (!(msg instanceof Map<?, ?> message)) {
            return null;
        }
        Object content = message.get("content");
        return content == null ? null : content.toString();
    }

    /** 把数据库中的真实指标组织成模型可读的上下文。 */
    private String buildContext(Long brandId) {
        List<MonitorQuestion> list = questions.findByBrandIdOrderByIdAsc(brandId);
        StringBuilder sb = new StringBuilder();
        brands.findById(brandId).ifPresent(b -> sb.append("品牌：").append(b.name)
                .append("，行业：").append(b.industry).append('\n'));

        if (list.isEmpty()) {
            sb.append("当前没有监控问题数据。\n");
        } else {
            double mention = list.stream().mapToDouble(q -> q.mentionRate).average().orElse(0);
            double top3 = list.stream().mapToDouble(q -> q.top3Rate).average().orElse(0);
            sb.append("监控问题数：").append(list.size()).append('\n');
            sb.append("平均提及率：").append(String.format("%.1f", mention)).append("%\n");
            sb.append("平均TOP3推荐率：").append(String.format("%.1f", top3)).append("%\n");
            sb.append("问题明细：\n");
            list.stream()
                    .sorted(Comparator.comparingDouble(q -> q.mentionRate))
                    .forEach(q -> sb.append("- ").append(q.text)
                            .append("：平均排名第 ").append(q.avgRank)
                            .append(" 位，提及率 ").append(q.mentionRate)
                            .append("%，TOP3 ").append(q.top3Rate)
                            .append("%，环比 ").append(q.delta > 0 ? "+" : "").append(q.delta).append('\n'));
        }

        List<Channel> topChannels = channels.findAll().stream()
                .sorted(Comparator.comparingInt((Channel c) -> c.citations).reversed())
                .limit(3)
                .toList();
        sb.append("高引用渠道：").append(topChannels.stream()
                .map(c -> c.name + "（被引 " + c.citations + " 次，单价 " + c.price + " 元）")
                .reduce((a, b) -> a + "、" + b).orElse("暂无")).append('\n');
        return sb.toString();
    }

    /** 无密钥时的规则化回答：结论全部来自上面的真实统计。 */
    private String localAnswer(Long brandId, String message, String context) {
        List<MonitorQuestion> list = questions.findByBrandIdOrderByIdAsc(brandId);
        if (list.isEmpty()) {
            return "当前品牌还没有监控问题数据。请先在「中立监测 → 配置监控」中录入问题集，我再基于数据给出分析。";
        }
        MonitorQuestion weakest = list.stream()
                .min(Comparator.comparingDouble(q -> q.mentionRate))
                .orElse(list.get(0));
        MonitorQuestion fastestRising = list.stream()
                .max(Comparator.comparingInt(q -> q.delta))
                .orElse(list.get(0));
        double mention = list.stream().mapToDouble(q -> q.mentionRate).average().orElse(0);
        double top3 = list.stream().mapToDouble(q -> q.top3Rate).average().orElse(0);

        StringBuilder sb = new StringBuilder();
        sb.append("基于库里 ").append(list.size()).append(" 个监控问题的实时统计：平均提及率 ")
                .append(String.format("%.1f", mention)).append("%，TOP3 推荐率 ")
                .append(String.format("%.1f", top3)).append("%。\n\n");
        sb.append("最薄弱的问题：「").append(weakest.text).append("」，提及率仅 ")
                .append(weakest.mentionRate).append("%，平均排名第 ").append(weakest.avgRank).append(" 位。\n");
        sb.append("改善最快的问题：「").append(fastestRising.text).append("」，环比 +")
                .append(fastestRising.delta).append(" 位。\n\n");
        sb.append("建议按以下顺序处理：\n");
        sb.append("1. 针对「").append(weakest.text).append("」补一篇结论前置的循证稿件，优先标注可核验来源；\n");
        sb.append("2. 把该问题加入下一期发稿计划，选择被引次数最高的两个渠道；\n");
        sb.append("3. 7 天后复测该问题的排名与提及率，确认是否真实改善。\n\n");
        sb.append("说明：当前未配置大模型密钥，以上回答由后端根据数据库指标按规则生成。");
        return sb.toString();
    }
}
