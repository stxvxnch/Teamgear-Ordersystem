# 📘 Phase 1: Backend Development

**Dauer:** 1-2 Wochen | **Aufwand:** 8-12 Stunden

---

## 🎯 Lernziele

Nach dieser Phase kannst du:
- ✅ Spring Boot Projekt von Grund auf aufsetzen
- ✅ PostgreSQL Datenbank anbinden
- ✅ JPA/Hibernate Entities erstellen
- ✅ REST API Endpoints programmieren
- ✅ CRUD Operations implementieren
- ✅ Mit Postman testen
- ✅ Grundlegende Tests schreiben

---

## 📚 Module Overview

### Module 1.1: Project Setup (2-3 Stunden)
**Was du baust:** Spring Boot Projekt mit Datenbank-Verbindung

**Lernst du:**
- Spring Initializr nutzen
- Maven Dependencies verstehen
- application.properties konfigurieren
- Erste Application starten

**Output:** Laufendes Spring Boot Backend

---

### Module 1.2: Database & Models (3-4 Stunden)
**Was du baust:** Datenbank-Tabellen (Player, Product, Order)

**Lernst du:**
- JPA Entities erstellen
- Relationships definieren (OneToMany, ManyToOne)
- Repository Pattern
- Hibernate verstehen

**Output:** Funktionierende Datenbank mit Tabellen

---

### Module 1.3: REST API (3-4 Stunden)
**Was du baust:** Komplette REST API für alle Entities

**Lernst du:**
- REST Controller schreiben
- HTTP Methods (GET, POST, PUT, DELETE)
- Request/Response DTOs
- Error Handling

**Output:** Vollständige CRUD API

---

### Module 1.4: Testing (2-3 Stunden)
**Was du baust:** Unit und Integration Tests

**Lernst du:**
- JUnit 5
- MockMvc für Controller Tests
- Repository Tests
- Test-driven Development

**Output:** Getestete, robuste API

---

## 🚀 Quick Start

### Schritt 1: Prerequisites Check
```bash
# Java
java -version
# Sollte zeigen: openjdk version "17" oder höher

# Maven  
mvn -version
# Sollte zeigen: Apache Maven 3.6 oder höher

# PostgreSQL (oder Docker)
psql --version
# Oder: docker --version
```

---

### Schritt 2: Spring Boot Projekt erstellen

**Option A: Spring Initializr (Empfohlen für Anfänger)**

1. Gehe zu: https://start.spring.io/
2. Konfiguration:
   ```
   Project:        Maven
   Language:       Java
   Spring Boot:    3.2.x (latest stable)
   
   Project Metadata:
   Group:          com.teamgear
   Artifact:       order-system
   Name:           order-system
   Package name:   com.teamgear.ordersystem
   Packaging:      Jar
   Java:           17
   ```

3. Dependencies hinzufügen (ADD DEPENDENCIES):
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Lombok (optional)
   - Spring Boot DevTools
   - Validation

4. Click **GENERATE** → Download ZIP → Entpacken

**Option B: Mit Maven direkt**
```bash
mvn archetype:generate \
  -DgroupId=com.teamgear \
  -DartifactId=order-system \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DinteractiveMode=false
```

---

### Schritt 3: Projekt in IDE öffnen

**IntelliJ IDEA:**
```
File → Open → Wähle den Ordner mit pom.xml
Warte bis Maven Dependencies geladen sind (rechts unten)
```

**VS Code:**
```
File → Open Folder → Wähle Projekt-Ordner
Java Extension Pack installieren (falls nicht vorhanden)
```

---

### Schritt 4: PostgreSQL Setup

**Option A: Mit Docker (Einfacher!)**
```bash
docker run --name teamgear-db \
  -e POSTGRES_DB=teamgear \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -p 5432:5432 \
  -d postgres:15

# Prüfen ob läuft:
docker ps
```

**Option B: Lokal installiert**
```bash
# Nach Installation von PostgreSQL
psql -U postgres

# In psql:
CREATE DATABASE teamgear;
CREATE USER admin WITH PASSWORD 'admin123';
GRANT ALL PRIVILEGES ON DATABASE teamgear TO admin;
\q
```

---

## 📝 Module 1.1: Dein erstes Spring Boot Backend

### Projekt-Struktur verstehen

```
order-system/
├── pom.xml                          ← Maven Dependencies
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/teamgear/ordersystem/
│   │   │       ├── OrderSystemApplication.java  ← Main
│   │   │       ├── controller/     ← REST Endpoints
│   │   │       ├── service/        ← Business Logic
│   │   │       ├── repository/     ← DB Access
│   │   │       ├── model/          ← Entities
│   │   │       └── dto/            ← DTOs
│   │   └── resources/
│   │       └── application.properties  ← Config
│   └── test/                        ← Tests
└── target/                          ← Build output
```

### application.properties konfigurieren

Erstelle/Editiere: `src/main/resources/application.properties`

```properties
# Application Name
spring.application.name=teamgear-order-system

# Server Port
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/teamgear
spring.datasource.username=admin
spring.datasource.password=admin123
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.root=INFO
logging.level.com.teamgear=DEBUG
```

**Was bedeutet das?**
- `ddl-auto=update` → Hibernate erstellt/updatet Tabellen automatisch
- `show-sql=true` → SQL Queries werden in Console angezeigt
- `format_sql=true` → SQL wird schön formatiert

### Application starten

```bash
# Mit Maven
mvn spring-boot:run

# Oder in IDE
Rechtsklick auf OrderSystemApplication.java → Run
```

**Erwartete Ausgabe:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.x)

2024-02-13 11:00:00 INFO  OrderSystemApplication - Starting...
2024-02-13 11:00:02 INFO  OrderSystemApplication - Started in 2.345 seconds
```

---

## 📝 Module 1.2: Database Models

### Player Entity

Erstelle: `src/main/java/com/teamgear/ordersystem/model/Player.java`

```java
package com.teamgear.ordersystem.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "players")
public class Player {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String phoneNumber;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Player() {}
    
    public Player(String firstName, String lastName, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
```

### Player Repository

Erstelle: `src/main/java/com/teamgear/ordersystem/repository/PlayerRepository.java`

```java
package com.teamgear.ordersystem.repository;

import com.teamgear.ordersystem.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    Optional<Player> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

### Player Controller (Erste Version)

Erstelle: `src/main/java/com/teamgear/ordersystem/controller/PlayerController.java`

```java
package com.teamgear.ordersystem.controller;

import com.teamgear.ordersystem.model.Player;
import com.teamgear.ordersystem.repository.PlayerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {
    
    private final PlayerRepository playerRepository;
    
    public PlayerController(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<Player>> getAllPlayers() {
        return ResponseEntity.ok(playerRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        return playerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Player> createPlayer(@RequestBody Player player) {
        if (playerRepository.existsByEmail(player.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        Player saved = playerRepository.save(player);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable Long id, @RequestBody Player details) {
        return playerRepository.findById(id)
                .map(player -> {
                    player.setFirstName(details.getFirstName());
                    player.setLastName(details.getLastName());
                    player.setPhoneNumber(details.getPhoneNumber());
                    return ResponseEntity.ok(playerRepository.save(player));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        if (!playerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        playerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 🧪 Testen mit Postman

### Test 1: Spieler erstellen
```
POST http://localhost:8080/api/players
Content-Type: application/json

{
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@team.de",
  "phoneNumber": "0123456789"
}
```

### Test 2: Alle Spieler abrufen
```
GET http://localhost:8080/api/players
```

### Test 3: Einen Spieler abrufen
```
GET http://localhost:8080/api/players/1
```

### Test 4: Spieler aktualisieren
```
PUT http://localhost:8080/api/players/1
Content-Type: application/json

{
  "firstName": "Maximilian",
  "lastName": "Mustermann",
  "phoneNumber": "0987654321"
}
```

### Test 5: Spieler löschen
```
DELETE http://localhost:8080/api/players/1
```

---

## ✏️ Übungen

### Übung 1.1: Product Entity
Erstelle ein Product Model mit:
- id
- name  
- description
- category (JERSEY, SHORTS, SOCKS)
- price
- availableSizes (String: "S,M,L,XL")
- active (boolean)

Implementiere Repository und Controller!

### Übung 1.2: Relationships
Erstelle Order und OrderItem Entities mit Relationships:
- Order hat viele OrderItems (OneToMany)
- OrderItem gehört zu einem Order (ManyToOne)
- OrderItem referenziert ein Product (ManyToOne)

### Übung 1.3: Custom Queries
Im PlayerRepository, füge hinzu:
- `List<Player> findByLastNameContaining(String lastName)`
- `List<Player> findByFirstNameAndLastName(String first, String last)`

Teste diese mit Postman!

---

## 🎓 Was du gelernt hast

- ✅ Spring Boot Projekt Setup
- ✅ PostgreSQL Datenbank Anbindung
- ✅ JPA Entities & Annotations
- ✅ Repository Pattern
- ✅ REST Controller Basics
- ✅ CRUD Operations
- ✅ HTTP Status Codes
- ✅ Postman Testing

---

## 🚀 Nächste Schritte

Wenn du alle Übungen gemacht hast:
→ **Phase 2: Frontend Development**

Dort baust du das Web-Interface für dein System!

---

## 🆘 Troubleshooting

**Port 8080 already in use:**
```properties
server.port=8081
```

**Database connection error:**
```bash
docker ps  # Läuft Container?
docker logs teamgear-db  # Zeige Logs
```

**Maven dependencies not loading:**
```bash
mvn clean install -U
```

---

**Gut gemacht! Du hast ein funktionierendes Backend! 🎉**
