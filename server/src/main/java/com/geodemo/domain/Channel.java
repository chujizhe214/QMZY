package com.geodemo.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "channel")
public class Channel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String name;
    public String type;
    public String logo;
    public int citations;
    public String publishRate;
    public int price;
    public boolean recommended;
    public String engines = "豆包,DeepSeek";

    public Channel() {
    }

    public Channel(String name, String type, String logo, int citations, String publishRate,
                   int price, boolean recommended, String engines) {
        this.name = name;
        this.type = type;
        this.logo = logo;
        this.citations = citations;
        this.publishRate = publishRate;
        this.price = price;
        this.recommended = recommended;
        this.engines = engines;
    }
}
