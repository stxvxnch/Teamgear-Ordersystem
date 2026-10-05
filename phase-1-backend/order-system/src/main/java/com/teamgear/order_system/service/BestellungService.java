package com.teamgear.order_system.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.teamgear.order_system.dto.BestellPositionDTO;
import com.teamgear.order_system.dto.BestellungDTO;
import com.teamgear.order_system.dto.CreateBestellPositionDTO;
import com.teamgear.order_system.dto.CreateBestellungDTO;
import com.teamgear.order_system.entity.BestellPosition;
import com.teamgear.order_system.entity.Bestellung;
import com.teamgear.order_system.mapper.BestellungMapper;
import com.teamgear.order_system.model.BestellStatus;
import com.teamgear.order_system.repository.BestellungRepository;
import com.teamgear.order_system.repository.ProductRepository;

@Service
public class BestellungService {
    private final BestellungRepository bestellungRepository;
    private final ProductRepository productRepository;

    public BestellungService(BestellungRepository bestellungRepository, ProductRepository productRepository) {
        this.bestellungRepository = bestellungRepository;
        this.productRepository = productRepository;
    }

    public BestellungDTO createBestellung(CreateBestellungDTO dto) {
        Bestellung bestellung = new Bestellung();
        bestellung.setCustomerName(dto.customerName());
        bestellung.setOrderDate(LocalDateTime.now());
        bestellung.setZahlungsart(dto.zahlungsart());
        bestellung.setStatus(BestellStatus.OFFEN);

        for(CreateBestellPositionDTO inputDTO : dto.bestellPositionen()){
            var product = productRepository.findById(inputDTO.productId()).orElseThrow(() -> new RuntimeException("Product not found"));
            BestellPosition bestellPosition = new BestellPosition(null, bestellung, product, inputDTO.quantity(), inputDTO.size());
            bestellung.getBestellPositionen().add(bestellPosition);
        }  

        Bestellung saved = bestellungRepository.save(bestellung);
        return BestellungMapper.toDTO(saved);
    }
}
