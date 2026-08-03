package com.capsula.capsule;

import com.capsula.auth.User;
import com.capsula.auth.UserRepository;
import com.capsula.capsule.dto.*;
import com.capsula.exception.ForbiddenException;
import com.capsula.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class CapsulaService {

    private final CapsulaRepository capsulaRepository;
    private final ParticipanteRepository participanteRepository;
    private final RecuerdoRepository recuerdoRepository;
    private final UserRepository userRepository;

    public CapsulaService(CapsulaRepository capsulaRepository,
                           ParticipanteRepository participanteRepository,
                           RecuerdoRepository recuerdoRepository,
                           UserRepository userRepository) {
        this.capsulaRepository = capsulaRepository;
        this.participanteRepository = participanteRepository;
        this.recuerdoRepository = recuerdoRepository;
        this.userRepository = userRepository;
    }

    public CapsulaResponse crearCapsula(Long userId, CreateCapsulaRequest req) {
        Capsula capsula = Capsula.builder()
                .titulo(req.getTitulo())
                .descripcion(req.getDescripcion())
                .fechaApertura(req.getFechaApertura())
                .fechaCreacion(LocalDateTime.now())
                .creadorId(userId)
                .build();
        capsula = capsulaRepository.save(capsula);

        participanteRepository.save(Participante.builder()
                .capsulaId(capsula.getId())
                .usuarioId(userId)
                .build());

        return toResponse(capsula);
    }

    public List<CapsulaResponse> misCapsulas(Long userId) {
        return participanteRepository.findByUsuarioId(userId).stream()
                .map(p -> capsulaRepository.findById(p.getCapsulaId()).orElse(null))
                .filter(c -> c != null)
                .map(this::toResponse)
                .toList();
    }

    public CapsulaResponse getCapsula(Long capsulaId, Long userId) {
        Capsula capsula = obtenerCapsulaConAcceso(capsulaId, userId);
        return toResponse(capsula);
    }

    public List<ParticipanteResponse> listarParticipantes(Long capsulaId, Long userId) {
        obtenerCapsulaConAcceso(capsulaId, userId);
        return participanteRepository.findByCapsulaId(capsulaId).stream()
                .map(p -> {
                    User u = userRepository.findById(p.getUsuarioId())
                            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
                    return ParticipanteResponse.builder()
                            .usuarioId(u.getId()).nombre(u.getNombre()).email(u.getEmail())
                            .build();
                })
                .toList();
    }

    public ParticipanteResponse agregarParticipante(Long capsulaId, Long userId, AddParticipantRequest req) {
        obtenerCapsulaConAcceso(capsulaId, userId);

        User invitado = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No existe una cuenta con ese correo. Debe registrarse primero."));

        if (participanteRepository.existsByCapsulaIdAndUsuarioId(capsulaId, invitado.getId())) {
            throw new ResourceNotFoundException("Esa persona ya es participante de esta capsula");
        }

        participanteRepository.save(Participante.builder()
                .capsulaId(capsulaId).usuarioId(invitado.getId()).build());

        return ParticipanteResponse.builder()
                .usuarioId(invitado.getId()).nombre(invitado.getNombre()).email(invitado.getEmail())
                .build();
    }

    public RecuerdoResponse agregarRecuerdo(Long capsulaId, Long userId, CreateRecuerdoRequest req) {
        Capsula capsula = obtenerCapsulaConAcceso(capsulaId, userId);

        if (capsula.isAbierta()) {
            throw new ForbiddenException("Esta capsula ya se abrio, ya no se pueden agregar recuerdos");
        }

        if (!req.getTipo().equals("texto") && !req.getTipo().equals("foto")) {
            throw new ForbiddenException("El tipo debe ser 'texto' o 'foto'");
        }

        Recuerdo recuerdo = Recuerdo.builder()
                .capsulaId(capsulaId)
                .usuarioId(userId)
                .tipo(req.getTipo())
                .contenido(req.getContenido())
                .titulo(req.getTitulo())
                .fechaCreacion(LocalDateTime.now())
                .build();
        recuerdo = recuerdoRepository.save(recuerdo);

        User autor = userRepository.findById(userId).orElseThrow();
        return toRecuerdoResponse(recuerdo, autor.getNombre());
    }

    /**
     * Si la capsula sigue cerrada: no se revela el contenido de nadie (ni siquiera al propio autor),
     * solo se informa cuantos recuerdos hay. Si ya abrio: se entrega la linea de tiempo completa.
     */
    public List<RecuerdoResponse> listarRecuerdos(Long capsulaId, Long userId) {
        Capsula capsula = obtenerCapsulaConAcceso(capsulaId, userId);

        if (!capsula.isAbierta()) {
            return List.of();
        }

        return recuerdoRepository.findByCapsulaIdOrderByFechaCreacionAsc(capsulaId).stream()
                .map(r -> {
                    User autor = userRepository.findById(r.getUsuarioId()).orElse(null);
                    return toRecuerdoResponse(r, autor != null ? autor.getNombre() : "?");
                })
                .toList();
    }

    private Capsula obtenerCapsulaConAcceso(Long capsulaId, Long userId) {
        Capsula capsula = capsulaRepository.findById(capsulaId)
                .orElseThrow(() -> new ResourceNotFoundException("Capsula no encontrada"));

        if (!participanteRepository.existsByCapsulaIdAndUsuarioId(capsulaId, userId)) {
            throw new ForbiddenException("No eres participante de esta capsula");
        }
        return capsula;
    }

    private CapsulaResponse toResponse(Capsula capsula) {
        long total = recuerdoRepository.countByCapsulaId(capsula.getId());
        long dias = ChronoUnit.DAYS.between(LocalDate.now(), capsula.getFechaApertura());
        return CapsulaResponse.builder()
                .id(capsula.getId())
                .titulo(capsula.getTitulo())
                .descripcion(capsula.getDescripcion())
                .fechaApertura(capsula.getFechaApertura())
                .fechaCreacion(capsula.getFechaCreacion())
                .creadorId(capsula.getCreadorId())
                .abierta(capsula.isAbierta())
                .totalRecuerdos(total)
                .diasRestantes(Math.max(dias, 0))
                .build();
    }

    private RecuerdoResponse toRecuerdoResponse(Recuerdo r, String autorNombre) {
        return RecuerdoResponse.builder()
                .id(r.getId())
                .usuarioId(r.getUsuarioId())
                .autorNombre(autorNombre)
                .tipo(r.getTipo())
                .contenido(r.getContenido())
                .titulo(r.getTitulo())
                .fechaCreacion(r.getFechaCreacion())
                .build();
    }
}
