# 🚀 Getting Started - Dein erster Tag

**Willkommen! Lass uns zusammen dein TeamGear System bauen!**

---

## ⏱️ Was passiert heute (2-3 Stunden)

Heute baust du:
1. ✅ Ein Spring Boot Backend Projekt
2. ✅ Deine erste REST API
3. ✅ Verbindung zur Datenbank
4. ✅ Deinen ersten API Call

**Am Ende hast du:** Eine funktionierende API die Bestellungen speichern kann!

---

## 🎯 Das Gesamtbild verstehen

### Was wir bauen:

```
┌──────────────────────────────────────────────────────────┐
│                    TEAMGEAR SYSTEM                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  👥 Spieler                                              │
│   └─> Öffnet Website                                     │
│   └─> Füllt Bestellformular aus                         │
│   └─> Klickt "Bestellen"                                │
│        │                                                  │
│        ▼                                                  │
│  🌐 FRONTEND (React/HTML)                                │
│   └─> Zeigt Formular an                                 │
│   └─> Validiert Eingaben                                │
│   └─> Sendet HTTP POST Request ──────────┐              │
│                                            │              │
│                                            ▼              │
│  🔧 REST API (Spring Boot) ◄──── DU BAUST DAS!          │
│   └─> Empfängt Request                                  │
│   └─> Validiert Daten                                   │
│   └─> Speichert in Datenbank ───────┐                   │
│   └─> Sendet Response zurück         │                   │
│                                       ▼                   │
│  💾 DATENBANK (PostgreSQL)                               │
│   └─> Speichert Bestellungen                            │
│   └─> Speichert Spieler                                 │
│   └─> Speichert Produkte                                │
│                                                           │
│  👨‍💼 DU (Admin)                                           │
│   └─> Siehst alle Bestellungen                          │
│   └─> Exportierst Excel                                 │
│   └─> Sendet PDF an Lieferant                           │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Setup (30 Minuten)

### 1. Software Check

**Java installiert?**
```bash
java -version
# Sollte zeigen: java version "17" oder höher
```

Nicht installiert? → https://adoptium.net/

**Maven installiert?**
```bash
mvn -version
# Sollte zeigen: Apache Maven 3.x
```

Nicht installiert? → https://maven.apache.org/install.html

**IDE installiert?**
- IntelliJ IDEA Community: https://www.jetbrains.com/idea/download/
- Oder VS Code mit Java Extension Pack

---

### 2. Projekt Setup

**Option A: Mit Spring Initializr (Empfohlen)**

1. Gehe zu: https://start.spring.io/
2. Wähle:
   - Project: **Maven**
   - Language: **Java**
   - Spring Boot: **3.2.x** (latest stable)
   - Group: `com.teamgear`
   - Artifact: `order-system`
   - Package name: `com.teamgear.ordersystem`
   - Java: **17**
3. Dependencies hinzufügen:
   - **Spring Web**
   - **Spring Data JPA**
   - **PostgreSQL Driver**
   - **Lombok** (optional, macht Code kürzer)
   - **Spring Boot DevTools**
   - **Validation**
4. Click "Generate" → Download → Entpacken

**Option B: Mit dem bereitgestellten Code**
```bash
# Nutze das Projekt aus phase-1-backend/01-setup/
cd phase-1-backend/01-setup/teamgear-backend
```

---

### 3. IDE öffnen

**IntelliJ IDEA:**
```
File → Open → Wähle den Ordner mit pom.xml
Maven Dependencies werden automatisch geladen (dauert beim ersten Mal)
```

**VS Code:**
```
File → Open Folder
Java Extension Pack sollte Maven erkennen
```

---

### 4. Datenbank Setup

**Option A: Docker (Einfacher)**
```bash
docker run --name teamgear-db \
  -e POSTGRES_DB=teamgear \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -p 5432:5432 \
  -d postgres:15
```

**Option B: PostgreSQL lokal installieren**
- Download: https://www.postgresql.org/download/
- Nach Installation:
```sql
CREATE DATABASE teamgear;
CREATE USER admin WITH PASSWORD 'admin123';
GRANT ALL PRIVILEGES ON DATABASE teamgear TO admin;
```

---

## 📝 Dein erstes Backend bauen (Phase 1.1)

### Schritt 1: Project Structure verstehen

```
teamgear-backend/
├── pom.xml                    ← Maven Configuration
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/teamgear/ordersystem/
│   │   │       ├── OrderSystemApplication.java   ← Main Class
│   │   │       ├── controller/                   ← REST Endpoints
│   │   │       ├── service/                      ← Business Logic
│   │   │       ├── repository/                   ← Database Access
│   │   │       ├── model/                        ← Data Models
│   │   │       └── dto/                          ← Data Transfer Objects
│   │   └── resources/
│   │       ├── application.properties            ← Configuration
│   │       └── application-dev.properties
│   └── test/                                     ← Tests
└── target/                                       ← Build Output
```

**Was bedeutet was?**

| Ordner | Zweck | Beispiel |
|--------|-------|----------|
| `controller` | REST Endpoints | `@GetMapping("/api/orders")` |
| `service` | Business Logic | Bestellung validieren |
| `repository` | Datenbank | Bestellung speichern |
| `model` | Datenbank Tabellen | Order, Player, Product |
| `dto` | API Request/Response | OrderRequest, OrderResponse |

---

### Schritt 2: Application Properties konfigurieren

**Erstelle:** `src/main/resources/application.properties`

```properties
# Application Name
spring.application.name=teamgear-order-system

# Server Port
server.port=8080

# Database Connection
spring.datasource.url=jdbc:postgresql://localhost:5432/teamgear
spring.datasource.username=admin
spring.datasource.password=admin123
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.root=INFO
logging.level.com.teamgear=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

**Was bedeutet das?**
- `datasource.url` → Wo ist die Datenbank?
- `jpa.hibernate.ddl-auto=update` → Tabellen automatisch erstellen/updaten
- `jpa.show-sql=true` → SQL Queries in Console anzeigen
- `logging.level` → Wie viel loggen?

---

### Schritt 3: Dein erstes Model (Datenbank Tabelle)

**Erstelle:** `src/main/java/com/teamgear/ordersystem/model/Player.java`

```java
package com.teamgear.ordersystem.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Player Entity
 * 
 * Repräsentiert einen Spieler in der Datenbank
 * @Entity = Das wird eine Tabelle
 */
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
    
    // Wird vor dem Speichern ausgeführt
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    // Wird vor jedem Update ausgeführt
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Default Constructor (wichtig für JPA!)
    public Player() {
    }
    
    // Constructor mit Parametern
    public Player(String firstName, String lastName, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
    
    // Getters und Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
```

**Was passiert hier?**
- `@Entity` → Spring erstellt eine Datenbank-Tabelle "players"
- `@Id` → Primary Key
- `@GeneratedValue` → Auto-increment ID
- `@Column` → Spalten-Eigenschaften (nullable, unique)
- `@PrePersist` → Wird vor INSERT ausgeführt
- `@PreUpdate` → Wird vor UPDATE ausgeführt

---

### Schritt 4: Repository (Datenbank-Zugriff)

**Erstelle:** `src/main/java/com/teamgear/ordersystem/repository/PlayerRepository.java`

```java
package com.teamgear.ordersystem.repository;

import com.teamgear.ordersystem.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Player Repository
 * 
 * Interface für Datenbank-Operations
 * JpaRepository gibt uns automatisch:
 * - save(player)
 * - findById(id)
 * - findAll()
 * - deleteById(id)
 * - und viele mehr!
 */
@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    
    // Custom Query Methods
    // Spring generiert die Query automatisch aus dem Method Namen!
    
    Optional<Player> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
```

**Magic hier:**
- `JpaRepository<Player, Long>` → Gibt uns CRUD Methods gratis!
- `findByEmail` → Spring erstellt automatisch: `SELECT * FROM players WHERE email = ?`
- `existsByEmail` → `SELECT COUNT(*) FROM players WHERE email = ?`

---

### Schritt 5: Dein erster REST Controller

**Erstelle:** `src/main/java/com/teamgear/ordersystem/controller/PlayerController.java`

```java
package com.teamgear.ordersystem.controller;

import com.teamgear.ordersystem.model.Player;
import com.teamgear.ordersystem.repository.PlayerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Player REST Controller
 * 
 * Hier kommen die HTTP Requests rein!
 */
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
```

---

### Schritt 6: Application starten! 🚀

```bash
mvn spring-boot:run
```

**Oder in IntelliJ:**
- Rechtsklick auf `OrderSystemApplication.java`
- Run 'OrderSystemApplication'

**Du solltest sehen:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.x)

... Started OrderSystemApplication in 3.456 seconds
```

---

## 🧪 Testen mit Postman (15 Minuten)

### 1. Postman installieren
- Download: https://www.postman.com/downloads/

### 2. Teste deine API!

**Test 1: Neuen Spieler erstellen**
```
Method: POST
URL: http://localhost:8080/api/players
Headers: Content-Type: application/json
Body (raw JSON):
{
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@team.de",
  "phoneNumber": "0123456789"
}
```

**Erwartete Response:**
```json
{
  "id": 1,
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@team.de",
  "phoneNumber": "0123456789",
  "createdAt": "2024-02-13T10:30:00",
  "updatedAt": "2024-02-13T10:30:00"
}
```

**Test 2: Alle Spieler abrufen**
```
Method: GET
URL: http://localhost:8080/api/players
```

**Test 3: Spieler updaten**
```
Method: PUT
URL: http://localhost:8080/api/players/1
Body:
{
  "firstName": "Maximilian",
  "lastName": "Mustermann",
  "phoneNumber": "0987654321"
}
```

---

## 🎉 Geschafft!

**Du hast gerade:**
- ✅ Ein Spring Boot Backend aufgesetzt
- ✅ Eine Datenbank-Verbindung hergestellt
- ✅ Dein erstes Model/Entity erstellt
- ✅ Ein Repository für DB-Zugriff gebaut
- ✅ Deine erste REST API programmiert
- ✅ CRUD Operations implementiert
- ✅ Die API erfolgreich getestet

---

## 🔍 Was du gelernt hast

### REST API Konzepte:
- **HTTP Methods:** GET, POST, PUT, DELETE
- **Path Variables:** `/api/players/{id}`
- **Request Body:** JSON Daten empfangen
- **Response Status:** 200 OK, 201 Created, 404 Not Found
- **API Design:** RESTful Endpoints

### Spring Boot Konzepte:
- **@RestController:** REST API Endpoints
- **@RequestMapping:** URL Routing
- **@GetMapping, @PostMapping, etc.:** HTTP Method Mapping
- **@PathVariable:** URL Parameter
- **@RequestBody:** JSON → Java Object
- **ResponseEntity:** Response mit Status Code

### Datenbank Konzepte:
- **@Entity:** Java Class → DB Table
- **@Id:** Primary Key
- **@Column:** Spalten-Konfiguration
- **JpaRepository:** CRUD Operations
- **Custom Queries:** findByEmail, existsByEmail

---

## 🚀 Nächste Schritte

Du bist jetzt bereit für **Phase 1.2: Products & Orders!**

```bash
cd ../02-database
cat README.md
```

Dort baust du:
- Product Model (Trikots, Hosen, etc.)
- Order Model (die Bestellungen!)
- Relationships (Order hat mehrere Items)

---

## 💡 Verstehe das Big Picture

**Was du gerade gebaut hast:**

```
HTTP Request (Postman)
    ↓
PlayerController (@RestController)
    ↓
PlayerRepository (Interface)
    ↓
JPA/Hibernate (ORM)
    ↓
PostgreSQL Database
```

**Für die Arbeit bedeutet das:**

```
Frontend-Verfahren (FV)  →  Dein Postman
    ↓                           ↓
Deine REST API          →  PlayerController
    ↓                           ↓
Business Logic          →  Dein Service
    ↓                           ↓
eAkte Datenbank         →  PostgreSQL
```

**Du siehst jetzt beide Seiten:**
- Frontend-Seite (Postman = FV)
- Backend-Seite (Dein Code = deine Arbeit)
- Datenbank (PostgreSQL = eAkte)

---

## 🆘 Troubleshooting

### Port 8080 already in use
```bash
# Ändere Port in application.properties
server.port=8081
```

### Database connection refused
```bash
# Prüfe ob PostgreSQL läuft
docker ps
# Oder
pg_isready
```

### Maven dependencies not loading
```bash
mvn clean install -U
# In IntelliJ: Maven → Reload
```

---

**Super! Du bist bereit für mehr! 💪**

*Weiter geht's mit Products und Orders!*
