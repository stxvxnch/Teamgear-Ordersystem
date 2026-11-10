package com.teamgear.order_system.dto;

import com.teamgear.order_system.model.Category;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateProductDTO(
        @NotBlank(message = "Bitte gib einen Produktnamen ein.")
        String name,

        String description,

        @NotNull(message = "Bitte gib einen Preis ein.")
        @DecimalMin(value = "0.0", message = "Der Preis darf nicht negativ sein.")
        BigDecimal price,

        @NotNull(message = "Bitte wähle eine Kategorie aus.")
        Category category
) {
}
