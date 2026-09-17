package com.retotiendaartesanal.order;

import com.retotiendaartesanal.order.dto.CrearPedidoRequest;
import com.retotiendaartesanal.order.dto.PedidoResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public PedidoResponse crearPedido(@Valid @RequestBody CrearPedidoRequest request) {
        return orderService.crearPedido(request);
    }

    @GetMapping
    public List<PedidoResponse> listarPedidos() {
        return orderService.listarPedidosDelUsuario();
    }

    @GetMapping("/{id}")
    public PedidoResponse obtenerPedido(@PathVariable Long id) {
        return orderService.obtenerPedido(id);
    }
}