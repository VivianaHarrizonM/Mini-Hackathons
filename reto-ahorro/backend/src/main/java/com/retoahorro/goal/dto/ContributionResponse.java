package com.retoahorro.goal.dto;

import com.retoahorro.goal.Aportacion;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ContributionResponse(
        Long id,
        String usuarioNombre,
        BigDecimal cantidad,
        LocalDateTime fecha
) {
    public static ContributionResponse fromEntity(Aportacion aportacion) {
        return new ContributionResponse(
                aportacion.getId(),
                aportacion.getUsuario().getNombre(),
                aportacion.getCantidad(),
                aportacion.getFecha()
        );
    }
}
