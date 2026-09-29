package com.retotiendaartesanal.payment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    private final WebhookService webhookService;
    private final ObjectMapper objectMapper;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @PostMapping("/stripe")
    public ResponseEntity<String> recibirWebhook(
            HttpServletRequest request,
            @RequestHeader("Stripe-Signature") String signature) throws IOException {

        String payload = new String(request.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

        try {
            Webhook.constructEvent(payload, signature, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.warn("Firma de webhook inválida: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Firma inválida");
        }

        JsonNode root = objectMapper.readTree(payload);
        String tipoEvento = root.path("type").asString("");
        log.info("Webhook recibido: tipo={}", tipoEvento);

        if ("checkout.session.completed".equals(tipoEvento)) {
            JsonNode sessionNode = root.path("data").path("object");
            String sessionId = sessionNode.path("id").asString(null);

            log.info("Sesion de checkout extraida del JSON: {}", sessionId);

            if (sessionId != null) {
                webhookService.confirmarPagoPorSessionId(sessionId);
            } else {
                log.warn("No se pudo extraer el session id del payload del webhook");
            }
        }

        return ResponseEntity.ok("recibido");
    }
}