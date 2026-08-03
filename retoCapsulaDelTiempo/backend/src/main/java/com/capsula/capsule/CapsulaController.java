package com.capsula.capsule;

import com.capsula.auth.User;
import com.capsula.capsule.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/capsulas")
public class CapsulaController {

    private final CapsulaService capsulaService;

    public CapsulaController(CapsulaService capsulaService) {
        this.capsulaService = capsulaService;
    }

    @PostMapping
    public ResponseEntity<CapsulaResponse> crear(@AuthenticationPrincipal User user,
                                                   @Valid @RequestBody CreateCapsulaRequest req) {
        return ResponseEntity.ok(capsulaService.crearCapsula(user.getId(), req));
    }

    @GetMapping
    public ResponseEntity<List<CapsulaResponse>> misCapsulas(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(capsulaService.misCapsulas(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CapsulaResponse> ver(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return ResponseEntity.ok(capsulaService.getCapsula(id, user.getId()));
    }

    @GetMapping("/{id}/participantes")
    public ResponseEntity<List<ParticipanteResponse>> participantes(@AuthenticationPrincipal User user,
                                                                      @PathVariable Long id) {
        return ResponseEntity.ok(capsulaService.listarParticipantes(id, user.getId()));
    }

    @PostMapping("/{id}/participantes")
    public ResponseEntity<ParticipanteResponse> invitar(@AuthenticationPrincipal User user,
                                                          @PathVariable Long id,
                                                          @Valid @RequestBody AddParticipantRequest req) {
        return ResponseEntity.ok(capsulaService.agregarParticipante(id, user.getId(), req));
    }

    @GetMapping("/{id}/recuerdos")
    public ResponseEntity<List<RecuerdoResponse>> recuerdos(@AuthenticationPrincipal User user,
                                                              @PathVariable Long id) {
        return ResponseEntity.ok(capsulaService.listarRecuerdos(id, user.getId()));
    }

    @PostMapping("/{id}/recuerdos")
    public ResponseEntity<RecuerdoResponse> agregarRecuerdo(@AuthenticationPrincipal User user,
                                                              @PathVariable Long id,
                                                              @Valid @RequestBody CreateRecuerdoRequest req) {
        return ResponseEntity.ok(capsulaService.agregarRecuerdo(id, user.getId(), req));
    }
}
