# 📘 Phase 1: Backend Development - Übungsblatt

**Dauer:** 1-2 Wochen | **Level:** Anfänger

---

## 🎯 Lernziele

In dieser Phase lernst du:
- ✅ Spring Boot Projekt aufsetzen
- ✅ PostgreSQL Datenbank anbinden
- ✅ JPA Entities erstellen
- ✅ REST API Endpoints programmieren
- ✅ CRUD Operations implementieren

**Am Ende hast du:** Eine funktionierende REST API mit Datenbank!

---

## 📚 Voraussetzungen

### Software installiert?
- [ ] Java 17+ (`java -version`)
- [ ] Maven 3.6+ (`mvn -version`)
- [ ] PostgreSQL oder Docker
- [ ] IDE (IntelliJ IDEA oder VS Code)
- [ ] Postman (für Testing)

### Wissen (kurz auffrischen wenn nötig):
- Java Basics (Klassen, Methoden, Getters/Setters)
- Grundlegende HTTP Konzepte (GET, POST, PUT, DELETE)

---

## 📖 Theorie: Was ist eine REST API?

### REST = Representational State Transfer

**Einfach erklärt:**
Eine REST API ist wie eine Speisekarte in einem Restaurant:
- Du (Frontend) schaust die Karte an und bestellst
- Der Kellner (API) nimmt die Bestellung entgegen
- Die Küche (Backend/Database) bereitet zu
- Der Kellner bringt das Essen (Response)

### HTTP Methods
```
GET    → Daten LESEN      (wie "Was habt ihr?")
POST   → Daten ERSTELLEN  (wie "Ich möchte bestellen")
PUT    → Daten ÄNDERN     (wie "Ändere meine Bestellung")
DELETE → Daten LÖSCHEN    (wie "Storniere Bestellung")
```

### Beispiel URLs
```
GET    /api/players           → Alle Spieler
GET    /api/players/1         → Spieler mit ID 1
POST   /api/players           → Neuen Spieler erstellen
PUT    /api/players/1         → Spieler 1 aktualisieren
DELETE /api/players/1         → Spieler 1 löschen
```

---

## 🏗️ Projekt-Architektur

```
┌──────────────────────────────────────┐
│         DEIN BACKEND                  │
├──────────────────────────────────────┤
│                                       │
│  Controller (REST Endpoints)          │
│      ↓                                │
│  Service (Business Logic)             │
│      ↓                                │
│  Repository (Database Access)         │
│      ↓                                │
│  PostgreSQL Database                  │
│                                       │
└──────────────────────────────────────┘
```

---

## ✏️ Aufgabe 1: Projekt Setup (30 Min)

### Schritt 1.1: Spring Boot Projekt erstellen

**Option A: Mit Spring Initializr (Empfohlen)**
1. Gehe zu: https://start.spring.io/
2. Konfiguration:
   - Project: Maven
   - Language: Java
   - Spring Boot: 3.2.x
   - Group: `com.teamgear`
   - Artifact: `ordersystem`
   - Java: 17
3. Dependencies hinzufügen:
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Validation
   - Spring Boot DevTools
4. Generate → Download → Entpacken

**Option B: Nutze den Starter-Code**
```bash
cd starter-code/
# Bereits vorbereitet mit pom.xml
```

### Schritt 1.2: PostgreSQL starten

**Mit Docker:**
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

### Schritt 1.3: application.properties konfigurieren

**📝 DEINE AUFGABE:**
Erstelle/Editiere `src/main/resources/application.properties`

**Was du eintragen musst:**
1. Application Name: `teamgear-order-system`
2. Server Port: `8080`
3. Datenbank URL: `jdbc:postgresql://localhost:5432/teamgear`
4. Username: `admin`
5. Password: `admin123`
6. Hibernate DDL: `update` (erstellt Tabellen automatisch)
7. Show SQL: `true` (zeigt SQL Queries)

**💡 Tipp:** Schau im CHEATSHEET.md unter "application.properties"

**✅ Check:** Starte die App mit `mvn spring-boot:run` - keine Fehler? Gut!

---

## ✏️ Aufgabe 2: Dein erstes Entity (45 Min)

### Theorie: Was ist ein Entity?

Ein Entity ist eine Java-Klasse die eine Datenbank-Tabelle repräsentiert:
```
Java Klasse "Player"  →  Datenbank Tabelle "players"
```

### Schritt 2.1: Player Entity erstellen

**📝 DEINE AUFGABE:**
Erstelle `src/main/java/com/teamgear/ordersystem/model/Player.java`

**Anforderungen:**
1. Klasse mit Annotation `@Entity`
2. Tabelle soll "players" heißen (`@Table`)
3. Felder:
   - `id` (Long, Primary Key, Auto-increment)
   - `firstName` (String, nicht null)
   - `lastName` (String, nicht null)
   - `email` (String, unique, nicht null)
   - `phoneNumber` (String, optional)
   - `createdAt` (LocalDateTime, automatisch beim Erstellen)
   - `updatedAt` (LocalDateTime, automatisch beim Update)
4. Default Constructor (wichtig für JPA!)
5. Constructor mit firstName, lastName, email
6. Alle Getters und Setters
7. `@PrePersist` Methode für createdAt
8. `@PreUpdate` Methode für updatedAt

**💡 Tipps:**
- `@Entity` macht die Klasse zu einer Tabelle
- `@Id` + `@GeneratedValue` für Primary Key
- `@Column(nullable = false)` für Pflichtfelder
- `@Column(unique = true)` für eindeutige Werte
- Schau im CHEATSHEET unter "Entity & Database"

**✅ Check:** 
```bash
mvn spring-boot:run
# Schau in die Console - siehst du SQL CREATE TABLE?
```

---

## ✏️ Aufgabe 3: Repository erstellen (15 Min)

### Theorie: Repository Pattern

Repository = Dein Zugang zur Datenbank
- Automatische Methoden: `save()`, `findAll()`, `findById()`, etc.
- Custom Queries durch Method-Namen

### Schritt 3.1: PlayerRepository

**📝 DEINE AUFGABE:**
Erstelle `src/main/java/com/teamgear/ordersystem/repository/PlayerRepository.java`

**Anforderungen:**
1. Interface (nicht Klasse!)
2. Extends `JpaRepository<Player, Long>`
3. Annotation `@Repository`
4. Custom Methods hinzufügen:
   - `Optional<Player> findByEmail(String email)`
   - `boolean existsByEmail(String email)`

**💡 Tipp:** JpaRepository gibt dir automatisch alle CRUD Methoden!

**🤔 Denkaufgabe:**
- Warum `Optional<Player>` statt nur `Player`?
- Was macht `existsByEmail` automatisch?

---

## ✏️ Aufgabe 4: REST Controller (60 Min)

### Theorie: Controller = REST Endpoints

Der Controller empfängt HTTP Requests und gibt Responses zurück.

### Schritt 4.1: PlayerController erstellen

**📝 DEINE AUFGABE:**
Erstelle `src/main/java/com/teamgear/ordersystem/controller/PlayerController.java`

**Anforderungen:**

**1. Klassen-Setup:**
- `@RestController` Annotation
- `@RequestMapping("/api/players")`
- PlayerRepository per Constructor Injection

**2. GET alle Spieler:**
```
GET /api/players
→ Gibt Liste aller Spieler zurück
→ Status: 200 OK
```

**3. GET ein Spieler:**
```
GET /api/players/{id}
→ Gibt Spieler mit ID zurück
→ Status: 200 OK wenn gefunden
→ Status: 404 Not Found wenn nicht gefunden
```

**4. POST neuer Spieler:**
```
POST /api/players
Body: { "firstName": "Max", "lastName": "Mustermann", "email": "max@test.de" }
→ Erstellt neuen Spieler
→ Prüft ob Email schon existiert
→ Status: 201 Created
→ Status: 400 Bad Request wenn Email existiert
```

**5. PUT Spieler aktualisieren:**
```
PUT /api/players/{id}
Body: { "firstName": "...", "lastName": "...", "phoneNumber": "..." }
→ Aktualisiert Spieler
→ Status: 200 OK
→ Status: 404 Not Found wenn nicht gefunden
```

**6. DELETE Spieler:**
```
DELETE /api/players/{id}
→ Löscht Spieler
→ Status: 204 No Content
→ Status: 404 Not Found wenn nicht gefunden
```

**💡 Tipps:**
- `@GetMapping` für GET
- `@PostMapping` für POST
- `@PathVariable` für URL Parameter ({id})
- `@RequestBody` für JSON Body
- `ResponseEntity` für Status Codes
- Schau im CHEATSHEET unter "Controller"

---

## 🧪 Aufgabe 5: Mit Postman testen (30 Min)

### Test-Szenario durchspielen

**Test 1: Spieler erstellen**
```
POST http://localhost:8080/api/players
Content-Type: application/json

{
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@team.de",
  "phoneNumber": "0123456789"
}

Erwartet: 201 Created + Player mit ID
```

**Test 2: Alle Spieler abrufen**
```
GET http://localhost:8080/api/players

Erwartet: 200 OK + Array mit Spielern
```

**Test 3: Einen Spieler abrufen**
```
GET http://localhost:8080/api/players/1

Erwartet: 200 OK + Player Objekt
```

**Test 4: Spieler updaten**
```
PUT http://localhost:8080/api/players/1
Content-Type: application/json

{
  "firstName": "Maximilian",
  "lastName": "Mustermann",
  "phoneNumber": "0987654321"
}

Erwartet: 200 OK + Aktualisierter Player
```

**Test 5: Spieler löschen**
```
DELETE http://localhost:8080/api/players/1

Erwartet: 204 No Content
```

**Test 6: Error Cases**
- Doppelte Email → 400 Bad Request
- Nicht existierende ID → 404 Not Found

**📝 DEINE AUFGABE:**
Teste alle Szenarien und dokumentiere die Ergebnisse!

---

## 💪 Bonus-Aufgaben (Wenn du Zeit hast)

### Bonus 1: Product Entity & API
Erstelle komplett analog zu Player:
- Product Entity mit: id, name, description, category, price, availableSizes
- ProductRepository
- ProductController mit allen CRUD Operations
- Tests mit Postman

### Bonus 2: Custom Query
Füge im PlayerRepository hinzu:
```java
List<Player> findByLastNameContaining(String lastName);
```
Teste es mit Postman: `GET /api/players/search?lastName=Muster`

### Bonus 3: Validation
Füge Validation hinzu:
- `@NotBlank` für firstName, lastName
- `@Email` für email
- `@Valid` im Controller
- Teste mit ungültigen Daten

---

## 🎓 Reflexionsfragen (Beantworte für dich)

1. **Was macht `@RestController`?**
   - [ ] Ich kann es erklären

2. **Warum brauchen wir ein Repository?**
   - [ ] Ich verstehe das Pattern

3. **Was ist der Unterschied zwischen POST und PUT?**
   - [ ] Ich weiß es

4. **Wie werden Java Objekte zu JSON?**
   - [ ] Ich verstehe den Prozess

5. **Was passiert bei einem Request?**
   - [ ] Ich kann den Flow beschreiben: HTTP → Controller → Service → Repository → DB

---

## ✅ Checkliste: Habe ich alles?

- [ ] Spring Boot Projekt läuft
- [ ] PostgreSQL läuft und verbunden
- [ ] Player Entity erstellt
- [ ] PlayerRepository erstellt
- [ ] PlayerController mit allen 5 CRUD Operations
- [ ] Alle Tests mit Postman erfolgreich
- [ ] Ich verstehe was ich gebaut habe!

---

## 🆘 Troubleshooting

### "Port 8080 already in use"
```properties
# In application.properties
server.port=8081
```

### "Table 'players' doesn't exist"
```properties
# In application.properties
spring.jpa.hibernate.ddl-auto=update
```

### "Cannot autowire PlayerRepository"
- Ist `@Repository` Annotation da?
- Ist Klasse im richtigen Package?

### "No serializer found for class"
- Fehlen Getters/Setters?

---

## 📂 Wo finde ich Hilfe?

1. **CHEATSHEET.md** - Alle wichtigen Commands
2. **solution/** - Komplette Lösung (nur wenn stuck!)
3. **Internet:**
   - Google: "spring boot rest api"
   - Stack Overflow
   - Baeldung.com
4. **Mich fragen!**

---

## 🚀 Nächste Schritte

Wenn du ALLE Aufgaben gemacht hast:
→ **Phase 2: Frontend Development**

Dort baust du das Web-Interface für dein Backend!

---

**Viel Erfolg! Du schaffst das! 💪**

*Vergiss nicht: Es ist OK wenn es dauert. Lieber richtig verstehen als schnell durchrushen!*
