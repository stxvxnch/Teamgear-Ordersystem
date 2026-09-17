package com.teamgear.order_system.dto;

import com.teamgear.order_system.model.Size;

public record CreateBestellPositionDTO(
    Long productId,
    int quantity,
    Size size
) {
}
