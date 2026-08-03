package com.retoahorro.goal.dto;

import com.retoahorro.goal.Meta;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalResponse(
        Long id,
        String nombre,
        BigDecimal objetivo,
        BigDecimal montoActual,
        LocalDate fechaLimite,
        String creadorNombre
) {
    public static GoalResponse fromEntity(Meta meta) {
        return new GoalResponse(
                meta.getId(),
                meta.getNombre(),
                meta.getObjetivo(),
                meta.getMontoActual(),
                meta.getFechaLimite(),
                meta.getCreador().getNombre()
        );
    }
}
