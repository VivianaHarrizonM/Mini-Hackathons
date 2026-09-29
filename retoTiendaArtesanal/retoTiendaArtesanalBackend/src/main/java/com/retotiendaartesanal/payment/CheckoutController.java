package com.retotiendaartesanal.payment;

import com.retotiendaartesanal.payment.dto.CheckoutResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping("/{id}/checkout")
    public CheckoutResponse crearCheckout(@PathVariable Long id) {
        return checkoutService.crearSesionCheckout(id);
    }
}