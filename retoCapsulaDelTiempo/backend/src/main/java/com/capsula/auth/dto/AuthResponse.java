package com.capsula.auth.dto;

import lombok.*;

@Getter @Setter @AllArgsConstructor @Builder
public class AuthResponse {
    private String token;
    private Long id;
    private String nombre;
    private String email;
}
