package com.teamgear.order_system.repository;

import com.teamgear.order_system.dto.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
