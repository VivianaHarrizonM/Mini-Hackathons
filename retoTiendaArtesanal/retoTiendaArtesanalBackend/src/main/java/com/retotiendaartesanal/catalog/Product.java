package com.retotiendaartesanal.catalog;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "productos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String nombre;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Category categoria;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    private String foto;

    @Column(length = 500)
    private String descripcionCorta;

    @Column(length = 3000)
    private String descripcionLarga;

    @ElementCollection
    @CollectionTable(name = "producto_materiales", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "material")
    @Builder.Default
    private List<String> materiales = new java.util.ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "producto_imagenes", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "imagen")
    @Builder.Default
    private List<String> imagenes = new java.util.ArrayList<>();

    @Column(nullable = false)
    private Integer stock;

    private String artesano;

    private Integer envioDias;

    private Double calificacion;

    private Integer numResenas;

    @Column(nullable = false)
    @Builder.Default
    private boolean destacado = false;

    @ElementCollection
    @CollectionTable(name = "producto_tags", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new java.util.ArrayList<>();
}