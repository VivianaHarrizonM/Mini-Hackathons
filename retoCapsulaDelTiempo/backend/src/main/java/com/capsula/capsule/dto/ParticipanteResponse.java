package com.capsula.capsule.dto;

import lombok.*;

@Getter @Setter @AllArgsConstructor @Builder
public class ParticipanteResponse {
    private Long usuarioId;
    private String nombre;
    private String email;
}
