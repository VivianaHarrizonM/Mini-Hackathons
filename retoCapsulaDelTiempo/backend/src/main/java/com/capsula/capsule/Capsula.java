package com.capsula.capsule;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "capsulas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Capsula {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(length = 1000)
    private String descripcion;

    @Column(nullable = false)
    private LocalDate fechaApertura;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private Long creadorId;

    /** No se persiste como estado fijo: se calcula contra la fecha actual */
    @Transient
    public boolean isAbierta() {
        return !LocalDate.now().isBefore(fechaApertura);
    }
}
