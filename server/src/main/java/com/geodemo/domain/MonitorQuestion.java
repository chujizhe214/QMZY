package com.geodemo.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "monitor_question")
public class MonitorQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public Long brandId;
    public String text;
    public String category;
    public double avgRank;
    public double mentionRate;
    public double top3Rate;
    public int delta;
    public String engines = "豆包,DeepSeek,元宝";

    public MonitorQuestion() {
    }

    public MonitorQuestion(Long brandId, String text, String category, double avgRank,
                           double mentionRate, double top3Rate, int delta) {
        this.brandId = brandId;
        this.text = text;
        this.category = category;
        this.avgRank = avgRank;
        this.mentionRate = mentionRate;
        this.top3Rate = top3Rate;
        this.delta = delta;
    }
}
