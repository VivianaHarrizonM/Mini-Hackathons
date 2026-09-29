package com.retotiendaartesanal.payment;

import com.retotiendaartesanal.catalog.Product;
import com.retotiendaartesanal.catalog.ProductRepository;
import com.retotiendaartesanal.order.Order;
import com.retotiendaartesanal.order.OrderItem;
import com.retotiendaartesanal.order.OrderRepository;
import com.retotiendaartesanal.order.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebhookService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public void confirmarPagoPorSessionId(String stripeSessionId) {
        Order order = orderRepository.findAll().stream()
                .filter(o -> stripeSessionId.equals(o.getStripeSessionId()))
                .findFirst()
                .orElse(null);

        if (order == null) {
            log.warn("Webhook recibido para una sesión de Stripe sin pedido asociado: {}", stripeSessionId);
            return;
        }

        if (order.getEstado() != OrderStatus.PENDIENTE_PAGO) {
            log.info("Pedido {} ya estaba en estado {}, se ignora webhook duplicado", order.getId(), order.getEstado());
            return;
        }

        for (OrderItem item : order.getItems()) {
            Product producto = productRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new IllegalStateException("Producto no encontrado al confirmar pago: " + item.getProductoId()));

            int nuevoStock = producto.getStock() - item.getCantidad();
            if (nuevoStock < 0) {
                log.error("Stock quedaría negativo para producto {} en pedido {}. Revisar manualmente.",
                        producto.getId(), order.getId());
                nuevoStock = 0;
            }
            producto.setStock(nuevoStock);
            productRepository.save(producto);
        }

        order.setEstado(OrderStatus.PAGADO);
        orderRepository.save(order);

        log.info("Pedido {} confirmado como PAGADO vía webhook de Stripe", order.getId());
    }
}