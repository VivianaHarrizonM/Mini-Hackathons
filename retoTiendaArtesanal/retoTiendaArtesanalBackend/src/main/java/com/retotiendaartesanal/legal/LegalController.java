package com.retotiendaartesanal.legal;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/legal")
public class LegalController {

    @Data
    @AllArgsConstructor
    static class LegalResponse {
        private String version;
        private String contenido;
    }

    @GetMapping("/terminos")
    public LegalResponse terminos() {
        return new LegalResponse(LegalContent.VERSION_VIGENTE, LegalContent.TERMINOS_Y_CONDICIONES);
    }

    @GetMapping("/privacidad")
    public LegalResponse privacidad() {
        return new LegalResponse(LegalContent.VERSION_VIGENTE, LegalContent.AVISO_DE_PRIVACIDAD);
    }

    @GetMapping("/devoluciones")
    public LegalResponse devoluciones() {
        return new LegalResponse(LegalContent.VERSION_VIGENTE, LegalContent.POLITICA_DE_DEVOLUCIONES);
    }
}