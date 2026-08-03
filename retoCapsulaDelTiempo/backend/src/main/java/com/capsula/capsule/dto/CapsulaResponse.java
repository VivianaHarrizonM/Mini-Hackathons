package com.capsula.capsule.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @AllArgsConstructor @Builder
public class CapsulaResponse {
    private Long id;
    private String titulo;
    private String descripcion;
    private LocalDate fechaApertura;
    private LocalDateTime fechaCreacion;
    private Long creadorId;
    private boolean abierta;
    private long totalRecuerdos;
    private long diasRestantes;
}
