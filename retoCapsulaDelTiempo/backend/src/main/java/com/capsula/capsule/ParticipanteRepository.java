package com.capsula.capsule;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipanteRepository extends JpaRepository<Participante, Long> {
    List<Participante> findByCapsulaId(Long capsulaId);
    List<Participante> findByUsuarioId(Long usuarioId);
    Optional<Participante> findByCapsulaIdAndUsuarioId(Long capsulaId, Long usuarioId);
    boolean existsByCapsulaIdAndUsuarioId(Long capsulaId, Long usuarioId);
}
