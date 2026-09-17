package com.teamgear.order_system.mapper;

import com.teamgear.order_system.dto.BestellungDTO;
import com.teamgear.order_system.entity.Bestellung;

public class BestellungMapper {
    
    public static BestellungDTO toDTO(Bestellung bestellung) {
        return new BestellungDTO(
            bestellung.getId(),
            bestellung.getCustomerName(),
            bestellung.getOrderDate(),
            bestellung.getZahlungsart(),
            bestellung.getStatus(),
            bestellung.getBestellPositionen().stream()
                .map(BestellPositionMapper::toDTO)
                .toList()
        );
    }
}
