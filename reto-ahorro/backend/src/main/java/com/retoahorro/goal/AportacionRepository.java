package com.retoahorro.goal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AportacionRepository extends JpaRepository<Aportacion, Long> {
    List<Aportacion> findByMetaOrderByFechaDesc(Meta meta);
}
