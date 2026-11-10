package com.teamgear.order_system.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.teamgear.order_system.model.BestellStatus;
import com.teamgear.order_system.model.Zahlungsart;

public record BestellungDTO(
    Long id,
    String customerName,
    LocalDateTime orderDate,
    Zahlungsart zahlungsart,
    BestellStatus bestellStatus,
    List<BestellPositionDTO> bestellPositionen
) {}
