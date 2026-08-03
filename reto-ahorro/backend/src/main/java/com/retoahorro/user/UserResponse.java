package com.retoahorro.user;

// DTO de salida: nunca exponemos el password hasheado al frontend.
public record UserResponse(Long id, String nombre, String correo) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(user.getId(), user.getNombre(), user.getCorreo());
    }
}
