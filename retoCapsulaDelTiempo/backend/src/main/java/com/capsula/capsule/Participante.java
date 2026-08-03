package com.capsula.capsule;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "capsula_participantes", uniqueConstraints = @UniqueConstraint(columnNames = {"capsula_id", "usuario_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Participante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "capsula_id", nullable = false)
    private Long capsulaId;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
}
