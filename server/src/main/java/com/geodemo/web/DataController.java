package com.geodemo.web;

import com.geodemo.domain.Article;
import com.geodemo.domain.Brand;
import com.geodemo.domain.Channel;
import com.geodemo.domain.MonitorQuestion;
import com.geodemo.repo.ArticleRepository;
import com.geodemo.repo.BrandRepository;
import com.geodemo.repo.ChannelRepository;
import com.geodemo.repo.QuestionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DataController {

    private final BrandRepository brands;
    private final QuestionRepository questions;
    private final ChannelRepository channels;
    private final ArticleRepository articles;

    public DataController(BrandRepository brands, QuestionRepository questions,
                          ChannelRepository channels, ArticleRepository articles) {
        this.brands = brands;
        this.questions = questions;
        this.channels = channels;
        this.articles = articles;
    }

    /** 前端启动时一次性拉取基础数据，减少请求数。 */
    @GetMapping("/bootstrap")
    public Map<String, Object> bootstrap() {
        List<Brand> brandList = brands.findAll();
        Long firstBrandId = brandList.isEmpty() ? 0L : brandList.get(0).id;
        return Map.of(
                "brands", brandList,
                "channels", channels.findAll(),
                "articles", articles.findByBrandIdOrderByIdAsc(firstBrandId),
                "questions", questions.findByBrandIdOrderByIdAsc(firstBrandId)
        );
    }

    @GetMapping("/brands")
    public List<Brand> brands() {
        return brands.findAll();
    }

    @GetMapping("/channels")
    public List<Channel> channels() {
        return channels.findAll();
    }

    @GetMapping("/articles")
    public List<Article> articles(@RequestParam Long brandId) {
        return articles.findByBrandIdOrderByIdAsc(brandId);
    }

    @GetMapping("/questions")
    public List<MonitorQuestion> questions(@RequestParam Long brandId) {
        return questions.findByBrandIdOrderByIdAsc(brandId);
    }

    /** 保存监控配置：整组替换该品牌的问题集。 */
    @PutMapping("/questions")
    @Transactional
    public Map<String, Object> saveQuestions(@RequestBody SaveQuestionsRequest request) {
        questions.deleteByBrandId(request.brandId());
        List<String> texts = request.texts() == null ? List.of() : request.texts();
        List<MonitorQuestion> saved = texts.stream()
                .map(String::trim)
                .filter(t -> !t.isEmpty())
                .map(t -> new MonitorQuestion(request.brandId(), t, "自定义", 3.5, 60.0, 35.0, 0))
                .toList();
        questions.saveAll(saved);
        return Map.of("saved", saved.size());
    }

    /** 新建稿件。 */
    @PostMapping("/articles")
    public Article createArticle(@RequestBody CreateArticleRequest request) {
        Article article = new Article(request.brandId(), request.title(), "草稿", "刚刚创建",
                "<p>这是由后端创建的演示稿件，可在编辑器中继续完善。</p>");
        return articles.save(article);
    }

    /** 保存稿件正文。 */
    @PutMapping("/articles")
    @Transactional
    public ResponseEntity<Map<String, Object>> updateArticle(@RequestBody UpdateArticleRequest request) {
        Article article = articles.findById(request.id()).orElse(null);
        if (article == null) {
            return ResponseEntity.notFound().build();
        }
        article.title = request.title() == null ? article.title : request.title();
        article.content = request.content() == null ? article.content : request.content();
        article.status = request.status() == null ? article.status : request.status();
        article.updatedAt = "刚刚保存";
        articles.save(article);

        Map<String, Object> body = Map.of("updated", true, "id", article.id);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "ok",
                "brands", brands.count(),
                "questions", questions.count(),
                "channels", channels.count(),
                "articles", articles.count()
        );
    }

    public record SaveQuestionsRequest(Long brandId, List<String> texts) {
    }

    public record CreateArticleRequest(Long brandId, String title) {
    }

    public record UpdateArticleRequest(Long id, String title, String content, String status) {
    }
}
