package com.teamgear.order_system.dto;

import java.util.List;

import com.teamgear.order_system.model.Zahlungsart;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateBestellungDTO(
    @NotBlank(message = "Bitte gib deinen Namen ein.")
    String customerName,

    @NotNull(message = "Bitte wähle eine Zahlungsart.")
    Zahlungsart zahlungsart,

    @NotEmpty(message = "Eine Bestellung braucht mindestens eine Position.")
    @Valid
    List<CreateBestellPositionDTO> bestellPositionen
) {}
