package com.teamgear.order_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamgear.order_system.entity.Bestellung;

public interface BestellungRepository extends JpaRepository<Bestellung, Long> {
}
