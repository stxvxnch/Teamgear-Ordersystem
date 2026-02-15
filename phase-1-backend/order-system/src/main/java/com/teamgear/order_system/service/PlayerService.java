package com.teamgear.order_system.service;

import com.teamgear.order_system.repository.PlayerRepository;
import org.springframework.stereotype.Service;

@Service
public class PlayerService {
    PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }


}
