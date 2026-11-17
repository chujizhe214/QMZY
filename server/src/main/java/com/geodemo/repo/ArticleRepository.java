package com.geodemo.repo;

import com.geodemo.domain.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findByBrandIdOrderByIdAsc(Long brandId);
}
