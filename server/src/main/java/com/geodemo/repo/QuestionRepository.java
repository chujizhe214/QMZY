package com.geodemo.repo;

import com.geodemo.domain.MonitorQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<MonitorQuestion, Long> {

    List<MonitorQuestion> findByBrandIdOrderByIdAsc(Long brandId);

    long deleteByBrandId(Long brandId);
}
