package com.retoahorro.goal.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateGoalRequest(
        @NotBlank(message = "El nombre de la meta es obligatorio")
        String nombre,

        @NotNull(message = "El objetivo es obligatorio")
        @DecimalMin(value = "0.01", message = "El objetivo debe ser mayor a 0")
        BigDecimal objetivo,

        @NotNull(message = "La fecha límite es obligatoria")
        @FutureOrPresent(message = "La fecha límite no puede ser en el pasado")
        LocalDate fechaLimite
) {}
