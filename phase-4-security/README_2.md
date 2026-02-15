# 🔐 Phase 4: Security & Authentication - Übungsblatt

**Dauer:** 1 Woche | **Level:** Mittel-Fortgeschritten

---

## 🎯 Lernziele

- ✅ JWT Token Authentication
- ✅ Login/Register System
- ✅ Password Encryption
- ✅ Protected Endpoints
- ✅ Role-based Access Control

---

## ✏️ Aufgabe 1: Security Setup (30 Min)

### Schritt 1.1: Dependencies

**📝 DEINE AUFGABE:** Füge zu pom.xml hinzu:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

### Schritt 1.2: User Entity

**📝 DEINE AUFGABE:**
Erstelle `model/User.java`

**Felder:**
- id (Long, PK)
- username (String, unique)
- password (String, encrypted!)
- email (String, unique)
- role (Enum: USER, ADMIN)
- active (boolean)
- createdAt (LocalDateTime)

**💡 Wichtig:** Password wird NIEMALS plain gespeichert!

---

## ✏️ Aufgabe 2: JWT Utility (60 Min)

### Theorie: Was ist JWT?

JWT = JSON Web Token
```
Header.Payload.Signature
eyJhbGc...  .  eyJzdWI...  .  SflKxw...
```

**Payload enthält:**
- username
- role
- expiration date

### Schritt 2.1: JwtUtil Class

**📝 DEINE AUFGABE:**
Erstelle `security/JwtUtil.java`

**Methoden die du brauchst:**
1. `generateToken(username, role)` → returns String
   - Erstellt JWT mit username und role
   - Gültig für 24h
   - Signiert mit Secret Key

2. `extractUsername(token)` → returns String
   - Liest username aus Token

3. `extractRole(token)` → returns String
   - Liest role aus Token

4. `validateToken(token)` → returns boolean
   - Prüft ob Token gültig
   - Nicht abgelaufen?
   - Signature korrekt?

**💡 Tipps:**
```java
Jwts.builder()
    .setSubject(username)
    .claim("role", role)
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + expiration))
    .signWith(key, SignatureAlgorithm.HS256)
    .compact();
```

**application.properties:**
```properties
jwt.secret=myVerySecretKeyThatIsAtLeast32CharactersLong!
jwt.expiration=86400000
```

---

## ✏️ Aufgabe 3: Authentication Filter (60 Min)

### Schritt 3.1: JwtAuthenticationFilter

**📝 DEINE AUFGABE:**
Erstelle `security/JwtAuthenticationFilter.java`

**Was der Filter macht:**
1. Checkt jeden Request nach "Authorization" Header
2. Wenn Token vorhanden:
   - Validate Token
   - Extrahiere Username & Role
   - Setze Authentication in SecurityContext
3. Filter Chain weiterlaufen lassen

**Struktur:**
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ... {
        
        String header = request.getHeader("Authorization");
        
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            
            if (jwtUtil.validateToken(token)) {
                // Extract user info
                // Set Authentication
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

---

## ✏️ Aufgabe 4: Security Configuration (45 Min)

### Schritt 4.1: SecurityConfig

**📝 DEINE AUFGABE:**
Erstelle `config/SecurityConfig.java`

**Anforderungen:**
1. CSRF disable (für APIs)
2. Session Management: STATELESS
3. URL Authorization:
   - `/api/auth/**` → permitAll
   - `/api/admin/**` → hasRole('ADMIN')
   - Rest → authenticated
4. Add JwtAuthenticationFilter
5. PasswordEncoder Bean (BCrypt)

**Struktur:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http
            .csrf().disable()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()
                // ... more rules
            .and()
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## ✏️ Aufgabe 5: Login & Register (90 Min)

### Schritt 5.1: DTOs

**📝 DEINE AUFGABE:**
Erstelle:
1. `dto/LoginRequest.java` - username, password
2. `dto/LoginResponse.java` - token, username, role
3. `dto/RegisterRequest.java` - username, email, password

### Schritt 5.2: AuthService

**📝 DEINE AUFGABE:**
Erstelle `service/AuthService.java`

**Methoden:**
1. `register(RegisterRequest)`:
   - Check: Username existiert?
   - Check: Email existiert?
   - Encrypt Password (BCrypt!)
   - Save User
   
2. `login(LoginRequest)` → returns LoginResponse:
   - Find User by username
   - Check: Password matches?
   - Check: User active?
   - Generate JWT Token
   - Return Response mit Token

**💡 Wichtig:**
```java
// Password encrypten:
String hashed = passwordEncoder.encode(plainPassword);

// Password prüfen:
boolean matches = passwordEncoder.matches(plainPassword, hashedPassword);
```

### Schritt 5.3: AuthController

**📝 DEINE AUFGABE:**
Erstelle `controller/AuthController.java`

**Endpoints:**
```java
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request)

@PostMapping("/login")
public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request)
```

---

## ✏️ Aufgabe 6: Protected Endpoints (30 Min)

### Schritt 6.1: Admin Only Endpoints

**📝 DEINE AUFGABE:**
Markiere AdminController:
```java
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")  // Nur für Admins!
public class AdminController {
    // ...
}
```

### Schritt 6.2: Get Current User

**📝 DEINE AUFGABE:**
Im OrderController:
```java
@GetMapping("/my")
public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
    String username = authentication.getName();
    // Finde Orders für diesen User
}
```

---

## 🧪 Test-Szenarien

### Test 1: Register
```
POST /api/auth/register
{
  "username": "testuser",
  "email": "test@test.de",
  "password": "password123"
}

Erwartet: 200 OK, "User registered"
```

### Test 2: Login
```
POST /api/auth/login
{
  "username": "testuser",
  "password": "password123"
}

Erwartet: 200 OK + Token
{
  "token": "eyJhbGc...",
  "username": "testuser",
  "role": "USER"
}
```

### Test 3: Protected Endpoint ohne Token
```
GET /api/admin/orders

Erwartet: 401 Unauthorized
```

### Test 4: Protected Endpoint mit Token
```
GET /api/admin/orders
Authorization: Bearer eyJhbGc...

Erwartet: 200 OK + Data (wenn ADMIN)
Erwartet: 403 Forbidden (wenn USER)
```

### Test 5: Admin erstellen
Manuell in DB:
```sql
INSERT INTO users (username, password, email, role, active)
VALUES ('admin', '$2a$10$...', 'admin@test.de', 'ADMIN', true);
```
(Password hashen mit BCrypt Online Tool!)

---

## 💪 Bonus-Aufgaben

### Bonus 1: Refresh Token
- Access Token (15 Min)
- Refresh Token (7 Tage)
- Endpoint: POST /auth/refresh

### Bonus 2: Password Reset
- Forgot Password Endpoint
- Email mit Reset Token
- Reset Password Endpoint

### Bonus 3: Account Activation
- Email Verification nach Register
- Activation Token
- Activate Endpoint

### Bonus 4: User Profile
- GET /api/profile
- PUT /api/profile
- Change Password

---

## 🎓 Reflexionsfragen

1. **Warum JWT statt Sessions?**
2. **Was ist der Unterschied zwischen Authentication und Authorization?**
3. **Warum BCrypt für Passwords?**
4. **Was steht im JWT Token?**
5. **Wie funktioniert der Auth Flow genau?**

---

## ✅ Checkliste

- [ ] User Entity erstellt
- [ ] JWT Utility funktioniert
- [ ] Auth Filter implementiert
- [ ] Security Config korrekt
- [ ] Register funktioniert
- [ ] Login gibt Token zurück
- [ ] Protected Endpoints gesichert
- [ ] Roles funktionieren
- [ ] Alles getestet!

---

## 🚀 Nächste Schritte

→ **Phase 5: Deployment & Production**

---

**Glückwunsch! Dein System ist sicher! 🔒**
