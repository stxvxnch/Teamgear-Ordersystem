package com.teamgear.order_system.repository;

import com.teamgear.order_system.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    // Custom Query Methods
    // Spring generiert die Query automatisch aus dem Method Namen!

    Optional<Player> findByEmail(String email);

    boolean existsByEmail(String email);
}
