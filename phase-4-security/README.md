# 🔐 Phase 4: Security & Authentication

**Dauer:** 1 Woche | **Aufwand:** 6-8 Stunden

---

## 🎯 Was du baust

Ein **sicheres Login-System** mit:
- 🔑 JWT Token Authentication
- 👤 User Registration & Login
- 🛡️ Protected Endpoints
- 👨‍💼 Role-based Access (Admin vs. User)
- 🔒 Password Encryption

---

## 🔐 Module 4.1: Spring Security Setup

### Dependencies

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

### User Entity

```java
package com.teamgear.ordersystem.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password; // BCrypt encrypted
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
    
    private boolean active = true;
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Getters & Setters
    public enum Role {
        USER, ADMIN
    }
}
```

### JWT Utility Class

```java
package com.teamgear.ordersystem.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret:mySecretKeyThatIsAtLeast32CharactersLong123456}")
    private String secret;
    
    @Value("${jwt.expiration:86400000}") // 24 hours
    private Long expiration;
    
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }
    
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }
    
    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
```

### JWT Authentication Filter

```java
package com.teamgear.ordersystem.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    
    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        String header = request.getHeader("Authorization");
        
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractUsername(token);
                String role = jwtUtil.extractRole(token);
                
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                );
                
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### Security Configuration

```java
package com.teamgear.ordersystem.config;

import com.teamgear.ordersystem.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            .and()
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## 👤 Module 4.2: Login & Registration

### Auth Controller

```java
package com.teamgear.ordersystem.controller;

import com.teamgear.ordersystem.dto.LoginRequest;
import com.teamgear.ordersystem.dto.LoginResponse;
import com.teamgear.ordersystem.dto.RegisterRequest;
import com.teamgear.ordersystem.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
```

### Auth Service

```java
package com.teamgear.ordersystem.service;

import com.teamgear.ordersystem.dto.*;
import com.teamgear.ordersystem.model.User;
import com.teamgear.ordersystem.repository.UserRepository;
import com.teamgear.ordersystem.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public AuthService(UserRepository userRepository, 
                      PasswordEncoder passwordEncoder,
                      JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.USER);
        
        userRepository.save(user);
    }
    
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }
        
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        
        return new LoginResponse(token, user.getUsername(), user.getRole().name());
    }
}
```

---

## 🛡️ Module 4.3: Protected Endpoints

### Protecting Admin Routes

```java
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")  // Nur für Admins
public class AdminController {
    
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        // Nur Admins können alle Bestellungen sehen
        return ResponseEntity.ok(orderRepository.findAll());
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Statistics> getStatistics() {
        // Nur Admins können Stats sehen
        return ResponseEntity.ok(statsService.calculate());
    }
}
```

### Getting Current User

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow();
        
        List<Order> orders = orderRepository.findByUserId(user.getId());
        return ResponseEntity.ok(orders);
    }
}
```

---

## 🧪 Testing Authentication

### With Postman

**1. Register**
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@teamgear.com",
  "password": "admin123"
}
```

**2. Login**
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "role": "ADMIN"
}
```

**3. Use Token**
```
GET http://localhost:8080/api/admin/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---

## ✏️ Übungen

### Übung 4.1: Password Reset
Implementiere Password Reset:
- Forgot Password Endpoint
- Reset Token Generation
- Email mit Reset Link
- Set New Password

### Übung 4.2: Refresh Token
Füge Refresh Tokens hinzu:
- Access Token (15 Min)
- Refresh Token (7 Tage)
- Token Refresh Endpoint

### Übung 4.3: Account Activation
Email-basierte Aktivierung:
- Activation Token bei Registration
- Email mit Activation Link
- Activate Account Endpoint

---

## 🎓 Was du gelernt hast

- ✅ Spring Security Configuration
- ✅ JWT Token Generation & Validation
- ✅ Password Encryption (BCrypt)
- ✅ Authentication vs. Authorization
- ✅ Role-based Access Control
- ✅ Security Best Practices

---

## 🚀 Nächste Schritte

→ **Phase 5: Deployment & Production**

---

**Glückwunsch! Dein System ist jetzt sicher! 🔒**
