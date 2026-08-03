package com.retoahorro.goal;

import com.retoahorro.user.User;
import jakarta.persistence.*;
import lombok.*;

// Tabla puente: qué usuarios pertenecen a qué meta compartida.
@Entity
@Table(name = "participantes", uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "meta_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meta_id", nullable = false)
    private Meta meta;
}
