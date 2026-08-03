package com.capsula.auth.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
public class RegisterRequest {
    @NotBlank
    private String nombre;
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 6, message = "La contrasena debe tener al menos 6 caracteres")
    private String password;
}
