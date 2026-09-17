package com.retotiendaartesanal.order;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "pedido_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private Long productoId;

    @Column(nullable = false)
    private String nombreProducto; // snapshot: el nombre al momento de comprar

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario; // snapshot: el precio al momento de comprar

    @Column(nullable = false)
    private Integer cantidad;
}