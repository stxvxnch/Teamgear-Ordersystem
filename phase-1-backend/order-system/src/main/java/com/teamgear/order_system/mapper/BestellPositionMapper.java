package com.teamgear.order_system.mapper;

import com.teamgear.order_system.dto.BestellPositionDTO;
import com.teamgear.order_system.entity.BestellPosition;

public class BestellPositionMapper {
    public static BestellPositionDTO toDTO(BestellPosition bestellPosition) {
        return new BestellPositionDTO(
            bestellPosition.getProduct().getId(),
            bestellPosition.getProduct().getName(),
            bestellPosition.getQuantity(),
            bestellPosition.getSize(),
            bestellPosition.getProduct().getPrice()
        );
    }
}
