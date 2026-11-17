package com.geodemo.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "article")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public Long brandId;

    public String title;
    public String status;

    @Column(name = "updated_at")
    public String updatedAt;

    @Column(length = 8000)
    public String content;

    public Article() {
    }

    public Article(Long brandId, String title, String status, String updatedAt, String content) {
        this.brandId = brandId;
        this.title = title;
        this.status = status;
        this.updatedAt = updatedAt;
        this.content = content;
    }
}
