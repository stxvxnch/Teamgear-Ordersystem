package com.teamgear.order_system.dto;

import com.teamgear.order_system.model.Category;
import com.teamgear.order_system.model.Size;

import java.math.BigDecimal;

public record CreateProductDTO(
        String name,
        BigDecimal price,
        Category category,
        Size size
) {
}
