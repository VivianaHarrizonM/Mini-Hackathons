package com.capsula.capsule;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recuerdos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Recuerdo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "capsula_id", nullable = false)
    private Long capsulaId;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(nullable = false)
    private String tipo; // "texto" o "foto"

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String contenido; // texto plano, o imagen en base64 (data URL)

    @Column(length = 200)
    private String titulo;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;
}
