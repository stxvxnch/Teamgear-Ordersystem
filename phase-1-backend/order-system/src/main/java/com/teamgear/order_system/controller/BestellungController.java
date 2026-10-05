package com.teamgear.order_system.controller;

import com.teamgear.order_system.dto.BestellungDTO;
import com.teamgear.order_system.dto.CreateBestellungDTO;
import com.teamgear.order_system.service.BestellungService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bestellungen")
public class BestellungController {

    private final BestellungService bestellungService;

    public BestellungController(BestellungService bestellungService) {
        this.bestellungService = bestellungService;
    }

    @GetMapping
    public ResponseEntity<List<BestellungDTO>> getAllOrders() {
        return ResponseEntity.ok(bestellungService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BestellungDTO> getOrderById(@PathVariable Long id) {
        return bestellungService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BestellungDTO> createOrder(@RequestBody CreateBestellungDTO dto){
        BestellungDTO created = bestellungService.createBestellung(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}

