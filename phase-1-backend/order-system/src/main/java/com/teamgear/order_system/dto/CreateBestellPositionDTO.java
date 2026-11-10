package com.teamgear.order_system.dto;

import com.teamgear.order_system.model.Size;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateBestellPositionDTO(
    @NotNull(message = "Bitte wähle ein Produkt.")
    Long productId,

    @Min(value = 1, message = "Die Menge muss mindestens 1 sein.")
    int quantity,

    @NotNull(message = "Bitte wähle eine Größe.")
    Size size
) {
}
