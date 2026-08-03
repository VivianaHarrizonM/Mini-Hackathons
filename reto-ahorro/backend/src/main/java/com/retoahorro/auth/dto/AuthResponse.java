package com.retoahorro.auth.dto;

import com.retoahorro.user.UserResponse;

public record AuthResponse(String token, UserResponse user) {}
