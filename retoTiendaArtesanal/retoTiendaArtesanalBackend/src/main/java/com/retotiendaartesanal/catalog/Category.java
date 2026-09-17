package com.retotiendaartesanal.catalog;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categorias")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {

    @Id
    private String id; 

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String slug;
}