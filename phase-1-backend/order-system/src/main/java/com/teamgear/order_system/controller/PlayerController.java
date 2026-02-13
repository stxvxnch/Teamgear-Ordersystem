package com.teamgear.order_system.controller;

import com.teamgear.order_system.model.Player;
import com.teamgear.order_system.repository.PlayerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerRepository playerRepository;

    // Constructor Injection (Best Practice!)
    public PlayerController(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    /**
     * GET /api/players
     * Gibt alle Spieler zurück
     */
    @GetMapping
    public ResponseEntity<List<Player>> getAllPlayers() {
        List<Player> players = playerRepository.findAll();
        return ResponseEntity.ok(players);
    }

    /**
     * GET /api/players/{id}
     * Gibt einen spezifischen Spieler zurück
     */
    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        return playerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/players
     * Erstellt einen neuen Spieler
     */
    @PostMapping
    public ResponseEntity<Player> createPlayer(@RequestBody Player player) {
        // Prüfe ob Email schon existiert
        if (playerRepository.existsByEmail(player.getEmail())) {
            return ResponseEntity.badRequest().build();
        }

        Player savedPlayer = playerRepository.save(player);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPlayer);
    }

    /**
     * PUT /api/players/{id}
     * Aktualisiert einen Spieler
     */
    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(
            @PathVariable Long id,
            @RequestBody Player playerDetails) {

        return playerRepository.findById(id)
                .map(player -> {
                    player.setFirstName(playerDetails.getFirstName());
                    player.setLastName(playerDetails.getLastName());
                    player.setPhoneNumber(playerDetails.getPhoneNumber());
                    return ResponseEntity.ok(playerRepository.save(player));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/players/{id}
     * Löscht einen Spieler
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        if (!playerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        playerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
