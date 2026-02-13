# 📱 Phase 2: Frontend Development

**Dauer:** 1 Woche | **Aufwand:** 6-10 Stunden

---

## 🎯 Lernziele

Nach dieser Phase kannst du:
- ✅ React Projekt aufsetzen
- ✅ Components erstellen
- ✅ API Calls mit fetch/axios machen
- ✅ Forms bauen und validieren
- ✅ State Management verstehen
- ✅ Frontend mit Backend verbinden
- ✅ Responsive Design erstellen

---

## 📚 Was du baust

Ein **vollständiges Web-Interface** für dein Bestellsystem:

```
┌──────────────────────────────────────┐
│         TEAMGEAR WEBSITE             │
├──────────────────────────────────────┤
│  🏠 Home                             │
│     - Willkommen                     │
│     - Produktübersicht               │
│                                      │
│  📝 Bestellformular                  │
│     - Spielerdaten eingeben          │
│     - Produkt auswählen              │
│     - Größe & Nummer                 │
│     - Absenden                       │
│                                      │
│  📋 Meine Bestellungen               │
│     - Liste aller Bestellungen       │
│     - Status ansehen                 │
│                                      │
│  👨‍💼 Admin Dashboard                  │
│     - Alle Bestellungen              │
│     - Excel Export                   │
│     - PDF Export                     │
└──────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Option A: React (Modern, Empfohlen)

```bash
# Node.js installieren (falls nicht vorhanden)
# https://nodejs.org/ → Download LTS Version

# React App erstellen
npx create-react-app teamgear-frontend
cd teamgear-frontend

# Dependencies installieren
npm install axios react-router-dom

# Entwicklungsserver starten
npm start
# Öffnet http://localhost:3000
```

### Option B: Einfaches HTML/JS (Für Anfänger)

```bash
mkdir teamgear-frontend
cd teamgear-frontend

# Erstelle index.html, style.css, app.js
# Öffne mit Live Server (VS Code Extension)
```

---

## 📝 React Projekt-Struktur

```
teamgear-frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js                    ← Main Component
│   ├── index.js                  ← Entry Point
│   ├── index.css                 ← Global Styles
│   │
│   ├── components/               ← Wiederverwendbare Components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── OrderCard.jsx
│   │
│   ├── pages/                    ← Seiten
│   │   ├── Home.jsx
│   │   ├── OrderForm.jsx
│   │   ├── MyOrders.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── services/                 ← API Calls
│   │   ├── api.js
│   │   ├── playerService.js
│   │   ├── orderService.js
│   │   └── productService.js
│   │
│   └── utils/                    ← Helper Functions
│       ├── validators.js
│       └── formatters.js
│
└── package.json
```

---

## 📝 Code-Beispiele

### 1. API Service Setup

**src/services/api.js**
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (für später: JWT Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

### 2. Player Service

**src/services/playerService.js**
```javascript
import api from './api';

export const playerService = {
  // Alle Spieler holen
  getAllPlayers: async () => {
    const response = await api.get('/players');
    return response.data;
  },

  // Einen Spieler holen
  getPlayerById: async (id) => {
    const response = await api.get(`/players/${id}`);
    return response.data;
  },

  // Neuen Spieler erstellen
  createPlayer: async (playerData) => {
    const response = await api.post('/players', playerData);
    return response.data;
  },

  // Spieler aktualisieren
  updatePlayer: async (id, playerData) => {
    const response = await api.put(`/players/${id}`, playerData);
    return response.data;
  },

  // Spieler löschen
  deletePlayer: async (id) => {
    await api.delete(`/players/${id}`);
  },
};
```

### 3. Bestellformular Component

**src/pages/OrderForm.jsx**
```javascript
import React, { useState, useEffect } from 'react';
import { playerService } from '../services/playerService';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';

function OrderForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    productId: '',
    size: '',
    jerseyNumber: '',
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Produkte laden beim Start
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Fehler beim Laden der Produkte');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Spieler erstellen oder finden
      let player;
      try {
        player = await playerService.createPlayer({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        });
      } catch (err) {
        // Wenn Spieler existiert, finde ihn
        const players = await playerService.getAllPlayers();
        player = players.find(p => p.email === formData.email);
      }

      // 2. Bestellung erstellen
      const orderData = {
        playerId: player.id,
        items: [
          {
            productId: formData.productId,
            size: formData.size,
            jerseyNumber: formData.jerseyNumber || null,
            quantity: 1,
          },
        ],
      };

      await orderService.createOrder(orderData);
      
      setSuccess(true);
      // Formular zurücksetzen
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        productId: '',
        size: '',
        jerseyNumber: '',
      });

      // Success Message nach 3 Sekunden ausblenden
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError('Fehler beim Erstellen der Bestellung: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-form-container">
      <h1>Neue Bestellung</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">✅ Bestellung erfolgreich!</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Persönliche Daten</h2>
          
          <div className="form-group">
            <label>Vorname *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Nachname *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Telefon</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Produkt-Auswahl</h2>

          <div className="form-group">
            <label>Produkt *</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
            >
              <option value="">-- Bitte wählen --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.price}€
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Größe *</label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
            >
              <option value="">-- Bitte wählen --</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          <div className="form-group">
            <label>Rückennummer (nur für Trikots)</label>
            <input
              type="number"
              name="jerseyNumber"
              value={formData.jerseyNumber}
              onChange={handleChange}
              min="0"
              max="99"
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Wird erstellt...' : 'Bestellung absenden'}
        </button>
      </form>
    </div>
  );
}

export default OrderForm;
```

### 4. Navbar Component

**src/components/Navbar.jsx**
```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">⚽ TeamGear</Link>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/order">Bestellen</Link></li>
        <li><Link to="/my-orders">Meine Bestellungen</Link></li>
        <li><Link to="/admin">Admin</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
```

### 5. App.js (Main)

**src/App.js**
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import OrderForm from './pages/OrderForm';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<OrderForm />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
```

---

## 🎨 Styling

### Basis CSS (App.css)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
}

.App {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Forms */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4CAF50;
}

/* Buttons */
button {
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Messages */
.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
}
```

---

## ✏️ Übungen

### Übung 2.1: Product Card Component
Erstelle eine wiederverwendbare ProductCard Component:
- Zeigt Produktbild, Name, Preis
- "In den Warenkorb" Button
- Responsive Design

### Übung 2.2: MyOrders Page
Implementiere die "Meine Bestellungen" Seite:
- Zeige alle Bestellungen eines Users
- Filter nach Status
- Detail-Ansicht für eine Bestellung

### Übung 2.3: Validation
Füge Client-Side Validation hinzu:
- Email Format prüfen
- Telefonnummer Format
- Pflichtfelder markieren
- Error Messages anzeigen

---

## 🎓 Was du gelernt hast

- ✅ React Grundlagen
- ✅ Components erstellen
- ✅ State Management (useState)
- ✅ API Integration (fetch/axios)
- ✅ Forms & Validation
- ✅ Routing (react-router-dom)
- ✅ CSS Styling
- ✅ Error Handling

---

## 🚀 Nächste Schritte

→ **Phase 3: Advanced Features**

Dort lernst du:
- Excel Export
- PDF Generation
- Email Versand
- File Uploads

---

**Super! Du hast ein funktionierendes Frontend! 🎨**
