package com.retoahorro.auth;

import com.retoahorro.auth.dto.AuthResponse;
import com.retoahorro.auth.dto.LoginRequest;
import com.retoahorro.auth.dto.RegisterRequest;
import com.retoahorro.security.JwtService;
import com.retoahorro.user.User;
import com.retoahorro.user.UserRepository;
import com.retoahorro.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByCorreo(request.correo())) {
            throw new IllegalArgumentException("Ya existe una cuenta con ese correo");
        }

        User user = User.builder()
                .nombre(request.nombre())
                .correo(request.correo())
                .password(passwordEncoder.encode(request.password()))
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserResponse.fromEntity(user));
    }

    public AuthResponse login(LoginRequest request) {
        // Si las credenciales son incorrectas, lanza BadCredentialsException (401).
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.correo(), request.password())
        );

        User user = userRepository.findByCorreo(request.correo())
                .orElseThrow(() -> new IllegalStateException("Usuario no encontrado tras autenticar"));

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserResponse.fromEntity(user));
    }
}
