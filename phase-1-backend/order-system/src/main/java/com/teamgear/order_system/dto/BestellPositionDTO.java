package com.teamgear.order_system.dto;

import java.math.BigDecimal;

import com.teamgear.order_system.model.Size;

public record BestellPositionDTO(
    Long productId,
    String productName,
    int quantity,
    Size size,
    BigDecimal unitPrice
) {}
