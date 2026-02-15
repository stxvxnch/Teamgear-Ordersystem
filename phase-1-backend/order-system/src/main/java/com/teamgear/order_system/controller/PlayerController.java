package com.teamgear.order_system.controller;

import com.teamgear.order_system.dto.BasisPlayerDTO;
import com.teamgear.order_system.dto.UpdatePlayerDTO;
import com.teamgear.order_system.model.Player;
import com.teamgear.order_system.repository.PlayerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    public PlayerRepository playerRepository;

    public PlayerController(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @GetMapping()
    public ResponseEntity<List<Player>> getAllPlayers() {
        return ResponseEntity.ok(playerRepository.findAll());
    }

    @PostMapping()
    public ResponseEntity<Player> addPlayer(@RequestBody BasisPlayerDTO dto) {
        Player player = new Player();
        player.setFirstName(dto.getFirstName());
        player.setLastName(dto.getLastName());
        player.setEmail(dto.getEmail());
        player.setPhoneNumber(dto.getPhoneNumber());
        return ResponseEntity.ok(player);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlayer(@PathVariable long id, @RequestBody UpdatePlayerDTO player) {
        return playerRepository.findById(id).map(updatePlayer -> {
            updatePlayer.setFirstName(player.getFirstName());
            updatePlayer.setLastName(player.getLastName());
            updatePlayer.setEmail(player.getEmail());
            updatePlayer.setPhoneNumber(player.getPhoneNumber());
            playerRepository.save(updatePlayer);

            return ResponseEntity.ok(updatePlayer);
        }).orElseGet(() -> ResponseEntity.notFound().build());

    }
}
