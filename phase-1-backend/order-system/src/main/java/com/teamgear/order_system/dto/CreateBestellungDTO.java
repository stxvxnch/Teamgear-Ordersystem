package com.teamgear.order_system.dto;

import java.util.List;

import com.teamgear.order_system.model.Zahlungsart;

public record CreateBestellungDTO(
    String customerName,
    Zahlungsart zahlungsart,
    List<CreateBestellPositionDTO> bestellPositionen
) {}
