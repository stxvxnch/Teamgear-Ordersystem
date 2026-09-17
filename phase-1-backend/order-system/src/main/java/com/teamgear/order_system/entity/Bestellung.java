package com.teamgear.order_system.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.teamgear.order_system.model.BestellStatus;
import com.teamgear.order_system.model.Zahlungsart;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "bestellung")
public class Bestellung {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    private BestellStatus status;

    @Enumerated(EnumType.STRING)
    private Zahlungsart zahlungsart;

    @OneToMany(mappedBy = "bestellung", cascade = CascadeType.ALL)
    private List<BestellPosition> bestellPositionen = new ArrayList<>();

}
