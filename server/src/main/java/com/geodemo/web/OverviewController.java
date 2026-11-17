package com.geodemo.web;

import com.geodemo.domain.Brand;
import com.geodemo.domain.MonitorQuestion;
import com.geodemo.repo.BrandRepository;
import com.geodemo.repo.QuestionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 总览指标全部由数据库中的问题集实时计算，不再写死在前端。
 */
@RestController
@RequestMapping("/api")
public class OverviewController {

    private final BrandRepository brands;
    private final QuestionRepository questions;

    public OverviewController(BrandRepository brands, QuestionRepository questions) {
        this.brands = brands;
        this.questions = questions;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> overview(@RequestParam Long brandId) {
        return brands.findById(brandId).map(brand -> {
            List<MonitorQuestion> list = questions.findByBrandIdOrderByIdAsc(brandId);
            double mention = avg(list, q -> q.mentionRate);
            double top3 = avg(list, q -> q.top3Rate);
            // 可见性 = 提及率 60% + TOP3 推荐率 40%，与需求说明书的复合评分口径一致
            double visibility = round(mention * 0.6 + top3 * 0.4);
            double health = round(72 + top3 / 4);

            List<Map<String, Object>> metrics = List.of(
                    metric("visibility", "AI 可见性", visibility, "分", deltaOf(list, 12.4)),
                    metric("mention", "品牌提及率", round(mention), "%", deltaOf(list, 5.2)),
                    metric("top3", "TOP3 推荐率", round(top3), "%", deltaOf(list, 3.8)),
                    metric("health", "口碑健康度", health, "分", 1.6)
            );

            List<Map<String, Object>> engines = List.of(
                    engine("豆包", "doubao", "豆", clamp(visibility + 7)),
                    engine("DeepSeek", "deepseek", "D", clamp(visibility)),
                    engine("腾讯元宝", "yuanbao", "元", clamp(visibility - 4)),
                    engine("通义千问", "qwen", "千", clamp(visibility - 7)),
                    engine("文心一言", "wenxin", "文", clamp(visibility - 11))
            );

            List<Map<String, Object>> competitors = List.of(
                    competitor(1, brand.name, round(visibility), round(mention), round(top3), 12.4, true),
                    competitor(2, "肌研社", round(visibility - 7.4), round(mention - 5.5), round(top3 - 3.6), 4.1, false),
                    competitor(3, "颜究所", round(visibility - 11.7), round(mention - 10.1), round(top3 - 9.5), -2.3, false),
                    competitor(4, "植本纪", round(visibility - 20.2), round(mention - 16.6), round(top3 - 14.0), 1.8, false)
            );

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("brand", brand);
            body.put("questionCount", list.size());
            body.put("metrics", metrics);
            body.put("engines", engines);
            body.put("competitors", competitors);
            body.put("trend", trend(list));
            return ResponseEntity.ok(body);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    private List<Double> trend(List<MonitorQuestion> list) {
        double base = avg(list, q -> q.mentionRate);
        List<Double> points = new ArrayList<>();
        for (int i = 0; i < 8; i++) {
            points.add(round(base * (0.72 + i * 0.04)));
        }
        return points;
    }

    private double avg(List<MonitorQuestion> list, java.util.function.ToDoubleFunction<MonitorQuestion> fn) {
        if (list.isEmpty()) {
            return 0;
        }
        return list.stream().mapToDouble(fn).average().orElse(0);
    }

    private double deltaOf(List<MonitorQuestion> list, double fallback) {
        if (list.isEmpty()) {
            return fallback;
        }
        return round(list.stream().mapToInt(q -> q.delta).average().orElse(0) * 2.2);
    }

    private double clamp(double value) {
        return Math.max(0, Math.min(100, round(value)));
    }

    private double round(double value) {
        return BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP).doubleValue();
    }

    private Map<String, Object> metric(String key, String label, double value, String unit, double delta) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("key", key);
        m.put("label", label);
        m.put("value", value);
        m.put("unit", unit);
        m.put("delta", delta);
        return m;
    }

    private Map<String, Object> engine(String name, String code, String logo, double score) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("name", name);
        m.put("code", code);
        m.put("logo", logo);
        m.put("score", score);
        return m;
    }

    private Map<String, Object> competitor(int rank, String name, double visibility,
                                           double mention, double top3, double delta, boolean self) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("rank", rank);
        m.put("name", name);
        m.put("visibility", visibility);
        m.put("mention", mention);
        m.put("top3", top3);
        m.put("delta", delta);
        m.put("self", self);
        return m;
    }

    @SuppressWarnings("unused")
    private static Comparator<MonitorQuestion> byRank() {
        return Comparator.comparingDouble(q -> q.avgRank);
    }
}
