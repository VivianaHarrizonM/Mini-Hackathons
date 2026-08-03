package com.capsula.capsule.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
public class CreateRecuerdoRequest {
    @NotBlank(message = "El tipo debe ser 'texto' o 'foto'")
    private String tipo;

    @NotBlank
    private String contenido;

    private String titulo;
}
