package com.teamgear.order_system.dto;

import com.teamgear.order_system.model.Category;

import java.math.BigDecimal;

public record CreateProductDTO(
        String name,
        BigDecimal price,
        Category category
) {
}
