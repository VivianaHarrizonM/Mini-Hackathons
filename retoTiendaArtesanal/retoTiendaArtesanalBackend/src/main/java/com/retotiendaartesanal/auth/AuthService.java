package com.retotiendaartesanal.auth;


import com.retotiendaartesanal.auth.dto.AuthResponse;
import com.retotiendaartesanal.auth.dto.LoginRequest;
import com.retotiendaartesanal.auth.dto.RegisterRequest;
import com.retotiendaartesanal.exception.CredencialesInvalidasException;
import com.retotiendaartesanal.exception.EmailYaRegistradoException;
import com.retotiendaartesanal.security.CustomUserDetailsService;
import com.retotiendaartesanal.security.JwtService;
import com.retotiendaartesanal.user.User;
import com.retotiendaartesanal.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Intento de registro con email ya existente: {}", request.getEmail());
            throw new EmailYaRegistradoException("Ya existe una cuenta con ese email");
        }

        User user = User.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        log.info("Nuevo usuario registrado: id={}, email={}", user.getId(), user.getEmail());

        return new AuthResponse(token, user.getId(), user.getNombre(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            log.warn("Intento de login fallido para email: {}", request.getEmail());
            throw new CredencialesInvalidasException("Email o contraseña incorrectos");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login autenticado pero usuario no encontrado en BD: {}", request.getEmail());
                    return new CredencialesInvalidasException("Email o contraseña incorrectos");
                });

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        log.info("Login exitoso: id={}, email={}", user.getId(), user.getEmail());

        return new AuthResponse(token, user.getId(), user.getNombre(), user.getEmail());
    }
}