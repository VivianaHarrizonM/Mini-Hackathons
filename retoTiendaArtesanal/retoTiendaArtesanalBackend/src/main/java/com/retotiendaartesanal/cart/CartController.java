package com.retotiendaartesanal.cart;

import com.retotiendaartesanal.cart.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse obtenerCarrito() {
        return cartService.obtenerCarritoActual();
    }

    @PostMapping("/items")
    public CartResponse agregarItem(@Valid @RequestBody AddItemRequest request) {
        return cartService.agregarItem(request);
    }

    @PutMapping("/items/{itemId}")
    public CartResponse actualizarItem(@PathVariable Long itemId, @Valid @RequestBody UpdateItemRequest request) {
        return cartService.actualizarItem(itemId, request);
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponse eliminarItem(@PathVariable Long itemId) {
        return cartService.eliminarItem(itemId);
    }
}