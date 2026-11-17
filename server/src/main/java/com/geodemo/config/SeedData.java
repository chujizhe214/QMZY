package com.geodemo.config;

import com.geodemo.domain.Article;
import com.geodemo.domain.Brand;
import com.geodemo.domain.Channel;
import com.geodemo.domain.MonitorQuestion;
import com.geodemo.repo.ArticleRepository;
import com.geodemo.repo.BrandRepository;
import com.geodemo.repo.ChannelRepository;
import com.geodemo.repo.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 首次启动时写入演示种子数据；已有数据则跳过，避免重复插入。
 */
@Component
public class SeedData implements CommandLineRunner {

    private final BrandRepository brands;
    private final QuestionRepository questions;
    private final ChannelRepository channels;
    private final ArticleRepository articles;

    public SeedData(BrandRepository brands, QuestionRepository questions,
                    ChannelRepository channels, ArticleRepository articles) {
        this.brands = brands;
        this.questions = questions;
        this.channels = channels;
        this.articles = articles;
    }

    @Override
    public void run(String... args) {
        if (brands.count() > 0) {
            return;
        }

        Brand chengguang = brands.save(new Brand("澄光生物", "功效护肤", "澄", "#e5e9ff", "#5058b9", 128, 1842));
        Brand xingye = brands.save(new Brand("星野科技", "智能家居", "星", "#e4f3ed", "#36705c", 86, 968));
        brands.save(new Brand("沐岚生活", "品质家居", "沐", "#fff0e4", "#a36332", 64, 1124));

        Long b1 = chengguang.id;
        List<MonitorQuestion> qs = List.of(
                new MonitorQuestion(b1, "敏感肌护肤品有哪些值得推荐？", "产品选购", 2.4, 82.4, 68.8, 2),
                new MonitorQuestion(b1, "皮肤屏障受损怎么修护？", "功效科普", 3.1, 76.2, 57.3, 1),
                new MonitorQuestion(b1, "神经酰胺精华怎么选？", "成分选购", 4.8, 61.9, 38.1, -3),
                new MonitorQuestion(b1, "换季皮肤泛红用什么精华？", "场景选购", 2.8, 71.5, 53.6, 4),
                new MonitorQuestion(b1, "温和修护精华品牌推荐", "品牌推荐", 5.2, 54.3, 31.7, -1),
                new MonitorQuestion(xingye.id, "智能门锁哪个品牌安全？", "产品选购", 3.6, 64.2, 41.5, 1),
                new MonitorQuestion(xingye.id, "全屋智能怎么搭建？", "方案咨询", 4.9, 52.8, 26.4, -2)
        );
        questions.saveAll(qs);

        channels.saveAll(List.of(
                new Channel("新华网", "官方网媒", "新", 326, "96%", 680, true, "豆包,DeepSeek,元宝"),
                new Channel("人民健康网", "行业媒体", "人", 284, "94%", 520, true, "豆包,文心"),
                new Channel("界面新闻", "综合门户", "界", 219, "91%", 460, true, "DeepSeek,千问"),
                new Channel("亿邦动力", "行业媒体", "亿", 186, "89%", 380, false, "豆包,DeepSeek"),
                new Channel("知乎机构号", "问答社区", "知", 173, "92%", 260, true, "DeepSeek,元宝"),
                new Channel("南方都市网", "地方门户", "南", 142, "86%", 320, false, "文心,豆包"),
                new Channel("今日头条号", "自媒体", "头", 119, "84%", 180, false, "豆包")
        ));

        articles.saveAll(List.of(
                new Article(b1, "敏感肌精华怎么选？从成分到屏障修护的科学指南", "草稿", "10:26 更新",
                        "<p>对于敏感肌人群，选择精华的关键不在于成分数量，而在于配方是否精简、功效是否有依据。</p>"),
                new Article(b1, "2026 年功效护肤成分趋势观察", "待审核", "昨天 18:40",
                        "<p>功效护肤正在从单一成分叙事，转向配方体系与实证数据的综合表达。</p>"),
                new Article(b1, "透明质酸与神经酰胺的协同作用", "已发布", "11 月 14 日",
                        "<p>两者分别作用于补水与屏障修护环节，搭配使用需关注配方比例。</p>"),
                new Article(b1, "换季皮肤泛红的日常护理建议", "已发布", "11 月 12 日",
                        "<p>换季期应减少高浓度功效叠加，优先维持稳定护理节奏。</p>")
        ));
    }
}
