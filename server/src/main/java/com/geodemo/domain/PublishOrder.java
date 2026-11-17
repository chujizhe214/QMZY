package com.geodemo.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "publish_order")
public class PublishOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(unique = true)
    public String code;

    public String articleTitle;
    public String channelName;
    public String status;
    public int cost;
    public LocalDateTime createdAt = LocalDateTime.now();

    public PublishOrder() {
    }

    public PublishOrder(String code, String articleTitle, String channelName, String status, int cost) {
        this.code = code;
        this.articleTitle = articleTitle;
        this.channelName = channelName;
        this.status = status;
        this.cost = cost;
    }
}
