package com.geodemo.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "brand")
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String name;
    public String industry;
    public String avatar;
    public String color;
    public String ink;
    public int questions;
    public int sources;

    public Brand() {
    }

    public Brand(String name, String industry, String avatar, String color, String ink, int questions, int sources) {
        this.name = name;
        this.industry = industry;
        this.avatar = avatar;
        this.color = color;
        this.ink = ink;
        this.questions = questions;
        this.sources = sources;
    }
}
