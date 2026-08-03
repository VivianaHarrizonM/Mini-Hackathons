package com.retoahorro.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    // Gracias al JwtAuthFilter, Spring Security ya "sabe" quién es el usuario
    // autenticado; @AuthenticationPrincipal lo inyecta directo aquí.
    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal User user) {
        return UserResponse.fromEntity(user);
    }
}
