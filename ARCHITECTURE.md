# 🏗️ System Architektur - TeamGear Order System

## 📐 Übersicht

```
┌────────────────────────────────────────────────────────────────┐
│                      TEAMGEAR SYSTEM                            │
│                   Fullstack Web Application                     │
└────────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌──────────────┐        ┌──────────────┐
│             │         │              │        │              │
│  FRONTEND   │ HTTP    │   BACKEND    │  JDBC  │   DATABASE   │
│  (React)    │────────>│ (Spring Boot)│───────>│ (PostgreSQL) │
│             │<────────│              │<───────│              │
│             │  JSON   │              │        │              │
└─────────────┘         └──────────────┘        └──────────────┘
      │                        │                       │
      │                        │                       │
      ▼                        ▼                       ▼
  - UI/UX              - REST API             - players
  - Forms              - Business Logic       - products
  - Validation         - Authentication       - orders
  - State Mgmt         - File Generation      - order_items
```

---

## 🔄 Request Flow (Wie alles funktioniert)

### Beispiel: Spieler bestellt ein Trikot

```
1. USER ACTION (Frontend)
   Spieler füllt Formular aus:
   - Vorname: Max
   - Nachname: Mustermann  
   - Produkt: Trikot
   - Größe: L
   - Nummer: 10
   
   ↓ Click "Bestellen"

2. FRONTEND PROCESSING
   - Validiert Eingaben (nicht leer, gültige Email, etc.)
   - Erstellt JSON Request:
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
   
   ↓ HTTP POST /api/orders

3. BACKEND - CONTROLLER LAYER
   @PostMapping("/api/orders")
   OrderController.createOrder(request)
   - Empfängt Request
   - Validiert JSON Format
   - Ruft Service auf
   
   ↓

4. BACKEND - SERVICE LAYER  
   OrderService.createOrder(request)
   - Prüft ob Player existiert
   - Prüft ob Product verfügbar ist
   - Berechnet Gesamtpreis
   - Erstellt Order Entity
   
   ↓

5. BACKEND - REPOSITORY LAYER
   OrderRepository.save(order)
   - JPA konvertiert Object zu SQL
   - SQL: INSERT INTO orders ...
   
   ↓

6. DATABASE
   PostgreSQL speichert:
   - Order in 'orders' Tabelle
   - Items in 'order_items' Tabelle
   - Gibt generierte ID zurück
   
   ↓ Response back

7. BACKEND - SERVICE LAYER
   - Lädt gespeicherte Order aus DB
   - Konvertiert zu Response DTO
   - (Optional) Sendet Email
   
   ↓

8. BACKEND - CONTROLLER LAYER
   - Gibt Response zurück
   - HTTP Status: 201 Created
   - Body: JSON mit Order Details
   
   ↓ HTTP Response

9. FRONTEND PROCESSING
   - Empfängt Response
   - Zeigt Success Message
   - Updated Order Liste
   - Leert Formular

10. USER SEES
    "✅ Bestellung erfolgreich!"
```

---

## 🗄️ Datenbank Schema

```sql
-- PLAYERS Table
CREATE TABLE players (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS Table  
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),  -- JERSEY, SHORTS, SOCKS, etc.
    price DECIMAL(10,2) NOT NULL,
    available_sizes VARCHAR(50),  -- S,M,L,XL,XXL
    image_url VARCHAR(500),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDERS Table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    player_id BIGINT REFERENCES players(id),
    order_number VARCHAR(50) UNIQUE,
    status VARCHAR(20),  -- PENDING, CONFIRMED, DELIVERED, CANCELLED
    total_price DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDER_ITEMS Table
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id),
    size VARCHAR(10),
    jersey_number INTEGER,  -- Nur für Trikots
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2),
    subtotal DECIMAL(10,2)
);

-- USERS Table (für Admin Login)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- BCrypt encrypted
    role VARCHAR(20) DEFAULT 'USER',  -- USER, ADMIN
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relationships:
```
players (1) ──── (N) orders
    │
    └─> Ein Spieler kann viele Bestellungen haben

orders (1) ──── (N) order_items
    │
    └─> Eine Bestellung hat viele Produkte

products (1) ──── (N) order_items
    │
    └─> Ein Produkt kann in vielen Bestellungen sein
```

---

## 📦 Backend Package Struktur

```
com.teamgear.ordersystem/
├── OrderSystemApplication.java     # Main Entry Point
│
├── controller/                     # REST Endpoints (HTTP Layer)
│   ├── PlayerController.java      # /api/players
│   ├── ProductController.java     # /api/products
│   ├── OrderController.java       # /api/orders
│   ├── AdminController.java       # /api/admin
│   └── AuthController.java        # /api/auth
│
├── service/                        # Business Logic
│   ├── PlayerService.java
│   ├── ProductService.java
│   ├── OrderService.java
│   ├── EmailService.java
│   ├── ExcelExportService.java
│   └── PdfGenerationService.java
│
├── repository/                     # Database Access
│   ├── PlayerRepository.java
│   ├── ProductRepository.java
│   ├── OrderRepository.java
│   └── UserRepository.java
│
├── model/                          # Database Entities
│   ├── Player.java
│   ├── Product.java
│   ├── Order.java
│   ├── OrderItem.java
│   └── User.java
│
├── dto/                            # Data Transfer Objects
│   ├── request/
│   │   ├── OrderRequest.java
│   │   ├── PlayerRequest.java
│   │   └── LoginRequest.java
│   └── response/
│       ├── OrderResponse.java
│       ├── PlayerResponse.java
│       └── ApiResponse.java
│
├── exception/                      # Error Handling
│   ├── ResourceNotFoundException.java
│   ├── DuplicateResourceException.java
│   ├── GlobalExceptionHandler.java
│   └── ValidationException.java
│
├── security/                       # Authentication & Authorization
│   ├── JwtUtil.java
│   ├── SecurityConfig.java
│   └── JwtAuthFilter.java
│
├── config/                         # Configuration Classes
│   ├── WebConfig.java
│   ├── DatabaseConfig.java
│   └── MailConfig.java
│
└── util/                           # Helper Classes
    ├── OrderNumberGenerator.java
    ├── DateFormatter.java
    └── PriceCalculator.java
```

---

## 🌐 API Endpoints

### Players
```
GET    /api/players           # Alle Spieler
GET    /api/players/{id}      # Ein Spieler
POST   /api/players           # Neuer Spieler
PUT    /api/players/{id}      # Update Spieler
DELETE /api/players/{id}      # Lösche Spieler
```

### Products
```
GET    /api/products          # Alle Produkte
GET    /api/products/{id}     # Ein Produkt
GET    /api/products/category/{category}  # Nach Kategorie
POST   /api/products          # Neues Produkt (Admin)
PUT    /api/products/{id}     # Update Produkt (Admin)
DELETE /api/products/{id}     # Lösche Produkt (Admin)
```

### Orders
```
GET    /api/orders            # Alle Bestellungen
GET    /api/orders/{id}       # Eine Bestellung
GET    /api/orders/player/{playerId}  # Bestellungen eines Spielers
POST   /api/orders            # Neue Bestellung
PUT    /api/orders/{id}       # Update Status
DELETE /api/orders/{id}       # Storniere Bestellung
```

### Admin
```
GET    /api/admin/orders      # Alle Bestellungen (Admin View)
GET    /api/admin/stats       # Statistiken
GET    /api/admin/export/excel  # Excel Download
GET    /api/admin/export/pdf    # PDF Download
POST   /api/admin/send-email    # Email an Lieferant
```

### Auth
```
POST   /api/auth/login        # Login
POST   /api/auth/register     # Register (nur für Demo)
POST   /api/auth/logout       # Logout
GET    /api/auth/me           # Current User Info
```

---

## 🔐 Security Flow

### JWT Token Authentication

```
1. LOGIN
   POST /api/auth/login
   Body: { username, password }
   
   ↓
   
   Server validiert
   - Username existiert?
   - Password korrekt?
   
   ↓
   
   Server erstellt JWT Token
   - Enthält: userId, username, role
   - Signiert mit Secret Key
   - Gültig für 24h
   
   ↓
   
   Response: { token: "eyJhbGc..." }

2. PROTECTED REQUEST
   GET /api/admin/orders
   Header: Authorization: Bearer eyJhbGc...
   
   ↓
   
   JwtAuthFilter prüft:
   - Token vorhanden?
   - Token gültig?
   - Nicht abgelaufen?
   - Signature korrekt?
   
   ↓
   
   Extrahiert User aus Token
   Setzt in SecurityContext
   
   ↓
   
   Controller prüft:
   - Hat User die richtige Rolle?
   - @PreAuthorize("hasRole('ADMIN')")
   
   ↓
   
   Request wird verarbeitet
```

---

## 📤 Export Features

### Excel Export Flow
```
Admin klickt "Export Excel"
    ↓
GET /api/admin/export/excel
    ↓
ExcelExportService
    ├─> Lädt alle Orders aus DB
    ├─> Erstellt Excel Workbook (Apache POI)
    ├─> Sheet 1: Bestellungen Übersicht
    ├─> Sheet 2: Details pro Spieler
    └─> Sheet 3: Zusammenfassung
    ↓
Returns: orders_2024-02-13.xlsx
```

### PDF Generation Flow
```
Admin klickt "PDF für Lieferant"
    ↓
GET /api/admin/export/pdf
    ↓
PdfGenerationService
    ├─> Lädt alle PENDING Orders
    ├─> Gruppiert nach Produkt & Größe
    ├─> Erstellt PDF (iText)
    │   ├─> Header: Team Logo, Datum
    │   ├─> Tabelle: Produkt, Größe, Anzahl
    │   └─> Footer: Kontakt Info
    └─> Returns: supplier_order_2024-02-13.pdf
```

---

## 🎨 Frontend Struktur (React)

```
teamgear-frontend/
├── public/
│   ├── index.html
│   └── assets/
│       └── logo.png
│
├── src/
│   ├── App.js                  # Main Component
│   ├── index.js                # Entry Point
│   │
│   ├── components/             # Reusable Components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── OrderSummary.jsx
│   │
│   ├── pages/                  # Page Components
│   │   ├── Home.jsx
│   │   ├── OrderForm.jsx
│   │   ├── MyOrders.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── Login.jsx
│   │
│   ├── services/               # API Calls
│   │   ├── api.js              # Axios setup
│   │   ├── playerService.js
│   │   ├── orderService.js
│   │   └── authService.js
│   │
│   ├── context/                # State Management
│   │   ├── AuthContext.js
│   │   └── OrderContext.js
│   │
│   ├── hooks/                  # Custom Hooks
│   │   ├── useAuth.js
│   │   └── useOrders.js
│   │
│   └── utils/                  # Helper Functions
│       ├── validators.js
│       └── formatters.js
│
└── package.json
```

---

## 🔄 State Management (Frontend)

```javascript
// AuthContext Example

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const login = async (username, password) => {
    const response = await authService.login(username, password);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
  };
  
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## 🚀 Deployment Architektur

```
┌─────────────────────────────────────────────┐
│           PRODUCTION ENVIRONMENT             │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐    ┌──────────────┐      │
│  │   Nginx      │    │   Frontend   │      │
│  │   (Proxy)    │───>│   (React)    │      │
│  │   Port 80    │    │   (Static)   │      │
│  └──────────────┘    └──────────────┘      │
│         │                                    │
│         │ Reverse Proxy                     │
│         ↓                                    │
│  ┌──────────────┐    ┌──────────────┐      │
│  │   Backend    │───>│  PostgreSQL  │      │
│  │ (Spring Boot)│    │  Database    │      │
│  │   Port 8080  │    │   Port 5432  │      │
│  └──────────────┘    └──────────────┘      │
│                                              │
│  All in Docker Containers                   │
│  Orchestrated with Docker Compose           │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 🔍 Monitoring & Logging

### Application Logs
```
logs/
├── application.log          # All logs
├── error.log               # Only errors
└── audit.log               # User actions
```

### Metrics (Spring Actuator)
```
/actuator/health           # Health Check
/actuator/metrics          # Performance Metrics
/actuator/info             # App Info
/actuator/prometheus       # Prometheus Format
```

---

## 🧪 Testing Strategy

```
┌────────────────────────────────────┐
│         TESTING PYRAMID             │
├────────────────────────────────────┤
│                                     │
│           E2E Tests (5%)            │
│         ─────────────               │
│                                     │
│      Integration Tests (15%)       │
│     ────────────────────────        │
│                                     │
│        Unit Tests (80%)             │
│  ──────────────────────────────    │
│                                     │
└────────────────────────────────────┘
```

### Unit Tests
- Service Layer
- Repository Layer
- Util Classes

### Integration Tests
- Controller + Service + Repository
- Database Integration
- API Endpoint Tests

### E2E Tests
- Complete User Flows
- Selenium/Cypress

---

**Das ist deine System-Architektur! Jetzt verstehst du wie alles zusammenspielt! 🎯**
