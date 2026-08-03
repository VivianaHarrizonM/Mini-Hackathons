package com.retoahorro.goal;

import com.retoahorro.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipanteRepository extends JpaRepository<Participante, Long> {
    List<Participante> findByUsuario(User usuario);
    List<Participante> findByMeta(Meta meta);
    boolean existsByUsuarioAndMeta(User usuario, Meta meta);
}
