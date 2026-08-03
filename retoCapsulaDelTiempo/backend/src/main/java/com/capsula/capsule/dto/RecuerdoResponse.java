package com.capsula.capsule.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @AllArgsConstructor @Builder
public class RecuerdoResponse {
    private Long id;
    private Long usuarioId;
    private String autorNombre;
    private String tipo;
    private String contenido;
    private String titulo;
    private LocalDateTime fechaCreacion;
}
