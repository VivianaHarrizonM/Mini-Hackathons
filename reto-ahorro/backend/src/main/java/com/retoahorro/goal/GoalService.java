package com.retoahorro.goal;

import com.retoahorro.exception.ResourceNotFoundException;
import com.retoahorro.goal.dto.*;
import com.retoahorro.user.User;
import com.retoahorro.user.UserRepository;
import com.retoahorro.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final MetaRepository metaRepository;
    private final ParticipanteRepository participanteRepository;
    private final AportacionRepository aportacionRepository;
    private final UserRepository userRepository;

    public List<GoalResponse> listGoals(User usuario) {
        return participanteRepository.findByUsuario(usuario).stream()
                .map(Participante::getMeta)
                .map(GoalResponse::fromEntity)
                .toList();
    }

    @Transactional
    public GoalResponse createGoal(CreateGoalRequest request, User creador) {
        Meta meta = Meta.builder()
                .nombre(request.nombre())
                .objetivo(request.objetivo())
                .fechaLimite(request.fechaLimite())
                .creador(creador)
                .build();
        metaRepository.save(meta);

        // El creador queda automáticamente como el primer participante.
        Participante participante = Participante.builder()
                .usuario(creador)
                .meta(meta)
                .build();
        participanteRepository.save(participante);

        return GoalResponse.fromEntity(meta);
    }

    public GoalResponse getGoal(Long id, User usuario) {
        Meta meta = obtenerMetaSiParticipante(id, usuario);
        return GoalResponse.fromEntity(meta);
    }

    public List<ContributionResponse> listContributions(Long metaId, User usuario) {
        Meta meta = obtenerMetaSiParticipante(metaId, usuario);
        return aportacionRepository.findByMetaOrderByFechaDesc(meta).stream()
                .map(ContributionResponse::fromEntity)
                .toList();
    }

    @Transactional
    public ContributionResponse addContribution(Long metaId, CreateContributionRequest request, User usuario) {
        Meta meta = obtenerMetaSiParticipante(metaId, usuario);

        Aportacion aportacion = Aportacion.builder()
                .cantidad(request.cantidad())
                .usuario(usuario)
                .meta(meta)
                .build();
        aportacionRepository.save(aportacion);

        meta.setMontoActual(meta.getMontoActual().add(request.cantidad()));
        metaRepository.save(meta);

        return ContributionResponse.fromEntity(aportacion);
    }

    // Centraliza la regla: solo un participante de la meta puede verla/aportar.
    private Meta obtenerMetaSiParticipante(Long metaId, User usuario) {
        Meta meta = metaRepository.findById(metaId)
                .orElseThrow(() -> new ResourceNotFoundException("Meta no encontrada"));

        if (!participanteRepository.existsByUsuarioAndMeta(usuario, meta)) {
            throw new AccessDeniedException("No perteneces a esta meta");
        }

        return meta;
    }

    public List<UserResponse> listParticipants(Long metaId, User usuario) {
        Meta meta = obtenerMetaSiParticipante(metaId, usuario);
        return participanteRepository.findByMeta(meta).stream()
                .map(Participante::getUsuario)
                .map(UserResponse::fromEntity)
                .toList();
    }

    @Transactional
    public UserResponse addParticipant(Long metaId, AddParticipantRequest request, User usuario) {
        // Solo alguien que ya está en la meta puede invitar a alguien más.
        Meta meta = obtenerMetaSiParticipante(metaId, usuario);

        User invitado = userRepository.findByCorreo(request.correo())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No existe ninguna cuenta con ese correo. Debe registrarse primero."
                ));

        if (participanteRepository.existsByUsuarioAndMeta(invitado, meta)) {
            throw new IllegalArgumentException("Esa persona ya participa en esta meta");
        }

        Participante participante = Participante.builder()
                .usuario(invitado)
                .meta(meta)
                .build();
        participanteRepository.save(participante);

        return UserResponse.fromEntity(invitado);
    }
}