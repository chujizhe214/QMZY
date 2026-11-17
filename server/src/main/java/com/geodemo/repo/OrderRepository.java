package com.geodemo.repo;

import com.geodemo.domain.PublishOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<PublishOrder, Long> {

    List<PublishOrder> findAllByOrderByIdDesc();
}
