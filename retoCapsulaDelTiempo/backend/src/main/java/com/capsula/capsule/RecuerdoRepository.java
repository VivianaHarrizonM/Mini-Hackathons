package com.capsula.capsule;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecuerdoRepository extends JpaRepository<Recuerdo, Long> {
    List<Recuerdo> findByCapsulaIdOrderByFechaCreacionAsc(Long capsulaId);
    long countByCapsulaId(Long capsulaId);
}
