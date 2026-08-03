package com.capsula.capsule.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
public class AddParticipantRequest {
    @NotBlank @Email
    private String email;
}
