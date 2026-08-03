package com.capsula.capsule.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter
public class CreateCapsulaRequest {
    @NotBlank
    private String titulo;

    private String descripcion;

    @NotNull
    @Future(message = "La fecha de apertura debe ser en el futuro")
    private LocalDate fechaApertura;
}
