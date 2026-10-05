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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private CustomUserDetailsService userDetailsService;

    @InjectMocks private AuthService authService;

    private RegisterRequest registro(String email) {
        RegisterRequest request = new RegisterRequest();
        request.setNombre("Ana");
        request.setEmail(email);
        request.setPassword("123456");
        return request;
    }

    private LoginRequest login(String email, String password) {
        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    @Test
    @DisplayName("register: guarda el usuario con la contraseña encriptada y devuelve un token")
    void registerExitoso() {
        UserDetails userDetails = mock(UserDetails.class);

        when(userRepository.existsByEmail("ana@test.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("hash-bcrypt");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(7L);
            return u;
        });
        when(userDetailsService.loadUserByUsername("ana@test.com")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("jwt-token");

        AuthResponse response = authService.register(registro("ana@test.com"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().getPassword()).isEqualTo("hash-bcrypt").isNotEqualTo("123456");
        assertThat(response).extracting("token").isEqualTo("jwt-token");
        assertThat(response).extracting("email").isEqualTo("ana@test.com");
    }

    @Test
    @DisplayName("register: rechaza un email que ya existe y no guarda nada")
    void registerEmailDuplicado() {
        when(userRepository.existsByEmail("ana@test.com")).thenReturn(true);

        assertThrows(EmailYaRegistradoException.class,
                () -> authService.register(registro("ana@test.com")));

        verify(userRepository, never()).save(any());
        verifyNoInteractions(passwordEncoder, jwtService);
    }

    @Test
    @DisplayName("login: con credenciales correctas devuelve un token")
    void loginExitoso() {
        User user = User.builder().id(1L).nombre("Ana").email("ana@test.com").password("hash").build();
        UserDetails userDetails = mock(UserDetails.class);

        when(userRepository.findByEmail("ana@test.com")).thenReturn(Optional.of(user));
        when(userDetailsService.loadUserByUsername("ana@test.com")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("jwt-token");

        AuthResponse response = authService.login(login("ana@test.com", "123456"));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        assertThat(response).extracting("token").isEqualTo("jwt-token");
        assertThat(response).extracting("email").isEqualTo("ana@test.com");
    }

    @Test
    @DisplayName("login: con contraseña incorrecta lanza CredencialesInvalidas y no genera token")
    void loginContrasenaIncorrecta() {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("bad credentials"));

        assertThrows(CredencialesInvalidasException.class,
                () -> authService.login(login("ana@test.com", "mala")));

        verify(userRepository, never()).findByEmail(any());
        verifyNoInteractions(jwtService);
    }

    @Test
    @DisplayName("login: si el usuario autenticado no existe en BD lanza CredencialesInvalidas")
    void loginUsuarioNoEncontrado() {
        when(userRepository.findByEmail("ana@test.com")).thenReturn(Optional.empty());

        assertThrows(CredencialesInvalidasException.class,
                () -> authService.login(login("ana@test.com", "123456")));

        verifyNoInteractions(jwtService);
    }
}