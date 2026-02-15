# 📋 Cheatsheet - Quick Reference

**Deine Schnellreferenz für alle wichtigen Commands, Konzepte und Code-Snippets!**

---

## 🔧 Maven Commands

```bash
# Projekt bauen
mvn clean install          # Vollständiger Build
mvn clean package          # JAR erstellen
mvn spring-boot:run        # App starten

# Tests
mvn test                   # Alle Tests
mvn test -Dtest=ClassName  # Spezifischer Test
mvn clean install -DskipTests  # Ohne Tests

# Dependencies
mvn dependency:tree        # Dependency-Baum zeigen
mvn clean install -U       # Dependencies updaten
```

---

## 🐘 PostgreSQL Commands

```bash
# Docker starten
docker run --name teamgear-db \
  -e POSTGRES_DB=teamgear \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -p 5432:5432 -d postgres:15

# Verbinden
psql -h localhost -U admin -d teamgear

# Häufige SQL Commands
\dt                        # Tabellen zeigen
\d table_name              # Tabelle beschreiben
SELECT * FROM players;     # Daten ansehen
DROP TABLE table_name;     # Tabelle löschen
```

---

## 🌐 HTTP Status Codes

```
2xx Success
200 OK                  → Erfolgreiche Anfrage
201 Created             → Ressource erstellt
204 No Content          → Erfolgreich, kein Body

4xx Client Errors
400 Bad Request         → Fehlerhafte Anfrage
401 Unauthorized        → Nicht authentifiziert
403 Forbidden           → Keine Berechtigung
404 Not Found           → Ressource nicht gefunden

5xx Server Errors
500 Internal Error      → Server-Fehler
502 Bad Gateway         → Upstream-Fehler
503 Service Unavailable → Service nicht verfügbar
```

---

## 📝 Spring Boot Annotations

### Controller
```java
@RestController           // REST Controller
@RequestMapping("/api")   // Basis-URL
@GetMapping              // GET Request
@PostMapping             // POST Request
@PutMapping              // PUT Request
@DeleteMapping           // DELETE Request
@PathVariable            // URL Parameter: /users/{id}
@RequestParam            // Query Parameter: /users?name=Max
@RequestBody             // Request Body (JSON)
@Valid                   // Input Validation
```

### Entity & Database
```java
@Entity                  // JPA Entity
@Table(name = "users")   // Tabellenname
@Id                      // Primary Key
@GeneratedValue          // Auto-increment
@Column                  // Spalten-Config
@OneToMany               // 1:N Beziehung
@ManyToOne               // N:1 Beziehung
@ManyToMany              // N:N Beziehung
@JoinColumn              // Foreign Key
@PrePersist              // Vor INSERT
@PreUpdate               // Vor UPDATE
```

### Service & Repository
```java
@Service                 // Service Layer
@Repository              // Repository Layer
@Autowired               // Dependency Injection (alt)
@Component               // Spring Component
@Configuration           // Configuration Class
@Value("${prop}")        // Property Value
```

---

## 🗄️ JPA Repository Methods

### Standard Methods (automatisch)
```java
save(entity)             // INSERT oder UPDATE
findById(id)             // SELECT BY ID
findAll()                // SELECT ALL
deleteById(id)           // DELETE BY ID
existsById(id)           // EXISTS CHECK
count()                  // COUNT
```

### Custom Query Methods (Name = Query!)
```java
findByEmail(String email)
findByFirstNameAndLastName(String first, String last)
findByAgeGreaterThan(int age)
findByActiveTrue()
findByNameContaining(String part)
findByCreatedAtBefore(LocalDateTime date)
```

### Query Annotations
```java
@Query("SELECT u FROM User u WHERE u.email = ?1")
User findByCustomQuery(String email);

@Query(value = "SELECT * FROM users WHERE email = ?1", nativeQuery = true)
User findByNativeQuery(String email);
```

---

## 🔐 Security Concepts

### JWT Token Structure
```
Header.Payload.Signature

eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.signature
```

### Password Encoding
```java
// NIEMALS Plain-Text!
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hashed = encoder.encode("password123");
boolean matches = encoder.matches("password123", hashed);
```

### Authorization
```java
@PreAuthorize("hasRole('ADMIN')")  // Nur für Admins
@PreAuthorize("hasRole('USER')")   // Nur für Users
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")  // Beide
```

---

## 🐳 Docker Commands

### Images
```bash
docker build -t image-name .       # Image bauen
docker images                      # Images listen
docker rmi image-id                # Image löschen
```

### Container
```bash
docker run -d -p 8080:8080 image   # Container starten
docker ps                          # Laufende Container
docker ps -a                       # Alle Container
docker stop container-id           # Stoppen
docker start container-id          # Starten
docker restart container-id        # Neu starten
docker logs container-id           # Logs ansehen
docker logs -f container-id        # Logs folgen
docker exec -it container-id bash  # Shell öffnen
docker rm container-id             # Container löschen
```

### Docker Compose
```bash
docker-compose up                  # Alle starten
docker-compose up -d               # Im Hintergrund
docker-compose down                # Alle stoppen
docker-compose logs -f             # Logs ansehen
docker-compose restart service     # Service neu starten
docker-compose build               # Images neu bauen
```

---

## 📦 JSON Examples

### Player
```json
{
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@team.de",
  "phoneNumber": "0123456789"
}
```

### Product
```json
{
  "name": "Heimtrikot 2024",
  "description": "Offizielles Heimtrikot",
  "category": "JERSEY",
  "price": 49.99,
  "availableSizes": "S,M,L,XL,XXL",
  "active": true
}
```

### Order
```json
{
  "playerId": 1,
  "items": [
    {
      "productId": 5,
      "size": "L",
      "jerseyNumber": 10,
      "quantity": 1
    }
  ]
}
```

---

## 🧪 Postman Testing

### GET Request
```
GET http://localhost:8080/api/players
```

### POST Request
```
POST http://localhost:8080/api/players
Headers: Content-Type: application/json
Body:
{
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@test.de"
}
```

### With Authorization
```
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---

## ⚛️ React Basics

### Component
```javascript
function MyComponent() {
  return <div>Hello World</div>;
}
```

### State
```javascript
const [count, setCount] = useState(0);
setCount(count + 1);
```

### Effect
```javascript
useEffect(() => {
  // Runs on mount
  fetchData();
}, []); // Empty array = nur beim Mount
```

### API Call
```javascript
const response = await fetch('http://localhost:8080/api/players');
const data = await response.json();
```

---

## 📧 application.properties

### Häufige Properties
```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/teamgear
spring.datasource.username=admin
spring.datasource.password=admin123

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Logging
logging.level.root=INFO
logging.level.com.teamgear=DEBUG

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

---

## 🔍 Git Commands

```bash
# Basic Workflow
git status                    # Status prüfen
git add .                     # Alle Änderungen stagen
git commit -m "message"       # Commit
git push                      # Zu Remote pushen

# Branches
git branch                    # Branches listen
git branch feature-name       # Branch erstellen
git checkout feature-name     # Branch wechseln
git checkout -b feature-name  # Erstellen und wechseln

# Remote
git clone url                 # Repository klonen
git pull                      # Änderungen holen
git fetch                     # Nur holen, nicht mergen
```

---

## 🐛 Debugging Tipps

### IntelliJ Shortcuts
```
Shift + F10       → Run
Shift + F9        → Debug
F8                → Step Over
F7                → Step Into
Ctrl + F2         → Stop
```

### Logs richtig lesen
```java
// Structured Logging
log.info("Processing order [orderId={}, playerId={}]", orderId, playerId);

// NICHT so:
log.info("Processing order " + orderId + " for player " + playerId);
```

---

## ❗ Häufige Fehler

### Port already in use
```bash
# Linux/Mac
lsof -i :8080
kill -9 <PID>

# Oder Port ändern
server.port=8081
```

### NullPointerException
```java
// Immer prüfen!
if (user != null) {
    user.getName();
}

// Oder Optional
Optional<User> user = repository.findById(id);
user.ifPresent(u -> System.out.println(u.getName()));
```

### Database Connection Error
```bash
# PostgreSQL läuft?
docker ps

# Connection String korrekt?
jdbc:postgresql://localhost:5432/databasename
```

---

## 📊 SQL Quick Reference

### Basic Queries
```sql
-- SELECT
SELECT * FROM players;
SELECT first_name, email FROM players WHERE active = true;

-- INSERT
INSERT INTO players (first_name, last_name, email) 
VALUES ('Max', 'Mustermann', 'max@test.de');

-- UPDATE
UPDATE players SET phone_number = '0123456789' WHERE id = 1;

-- DELETE
DELETE FROM players WHERE id = 1;

-- JOIN
SELECT o.*, p.first_name 
FROM orders o 
JOIN players p ON o.player_id = p.id;
```

---

## 🎨 CSS Quick Tips

### Flexbox
```css
.container {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;      /* vertical */
  gap: 20px;
}
```

### Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

---

## 💡 Best Practices

### REST API Design
```
GET    /api/users           # Alle
GET    /api/users/1         # Einer
POST   /api/users           # Neu
PUT    /api/users/1         # Update
DELETE /api/users/1         # Löschen
```

### Error Handling
```java
try {
    // Code
} catch (SpecificException e) {
    log.error("Specific error", e);
    throw new CustomException("User-friendly message");
} catch (Exception e) {
    log.error("Unexpected error", e);
    throw new RuntimeException("Something went wrong");
}
```

### Testing Pattern
```java
// Arrange
User user = new User("Max", "max@test.de");

// Act
User saved = userService.save(user);

// Assert
assertNotNull(saved.getId());
assertEquals("Max", saved.getName());
```

---

## 🚀 Performance Tipps

### N+1 Problem vermeiden
```java
// BAD - N+1 Queries
List<Order> orders = orderRepository.findAll();
for (Order order : orders) {
    order.getPlayer().getName(); // Extra Query!
}

// GOOD - Join Fetch
@Query("SELECT o FROM Order o JOIN FETCH o.player")
List<Order> findAllWithPlayer();
```

### Index nutzen
```java
@Table(indexes = @Index(name = "idx_email", columnList = "email"))
public class Player { ... }
```

---

## 📱 Nützliche Links

**Dokumentation:**
- Spring Boot: https://spring.io/projects/spring-boot
- Spring Data JPA: https://spring.io/projects/spring-data-jpa
- PostgreSQL: https://www.postgresql.org/docs/
- React: https://react.dev/

**Learning:**
- Baeldung: https://www.baeldung.com/
- Stack Overflow: https://stackoverflow.com/
- GitHub: https://github.com/

**Tools:**
- Postman: https://www.postman.com/
- Docker Hub: https://hub.docker.com/
- Maven Central: https://search.maven.org/

---

**Speichere dieses Cheatsheet! Du wirst es oft brauchen! 📌**
