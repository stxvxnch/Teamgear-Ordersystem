# 📱 Phase 2: Frontend Development - Übungsblatt

**Dauer:** 1 Woche | **Level:** Anfänger-Mittel

---

## 🎯 Lernziele

- ✅ React Projekt aufsetzen
- ✅ Components erstellen
- ✅ API Calls machen (fetch/axios)
- ✅ Forms bauen und validieren  
- ✅ State Management verstehen
- ✅ Frontend mit Backend verbinden

**Am Ende hast du:** Ein funktionierendes Web-Interface!

---

## 📚 Voraussetzungen

- [ ] Node.js 18+ installiert (`node --version`)
- [ ] Backend aus Phase 1 läuft auf Port 8080
- [ ] Grundlegende HTML/CSS Kenntnisse
- [ ] JavaScript Basics (Variablen, Funktionen, Arrays)

---

## ✏️ Aufgabe 1: React Projekt Setup (20 Min)

### Schritt 1.1: React App erstellen

```bash
npx create-react-app teamgear-frontend
cd teamgear-frontend
npm install axios react-router-dom
npm start
```

**✅ Check:** Browser öffnet sich auf http://localhost:3000

### Schritt 1.2: Projekt-Struktur verstehen

```
src/
├── App.js           # Main Component
├── index.js         # Entry Point
├── components/      # Du erstellst das!
├── pages/           # Du erstellst das!
└── services/        # Du erstellst das!
```

**📝 DEINE AUFGABE:** Erstelle diese Ordner!

---

## ✏️ Aufgabe 2: API Service Setup (30 Min)

### Theorie: Wie redet Frontend mit Backend?

```
React (Port 3000)
    ↓ HTTP Request
Backend API (Port 8080)
    ↓ Response
React zeigt Daten an
```

### Schritt 2.1: API Service erstellen

**📝 DEINE AUFGABE:**
Erstelle `src/services/api.js`

**Was du brauchst:**
1. Import axios
2. Erstelle axios instance mit:
   - baseURL: `http://localhost:8080/api`
   - headers: `Content-Type: application/json`
3. Export die instance

**💡 Tipp:** Schau im CHEATSHEET unter "React Basics"

### Schritt 2.2: Player Service

**📝 DEINE AUFGABE:**
Erstelle `src/services/playerService.js`

**Methoden die du brauchst:**
```javascript
export const playerService = {
  getAllPlayers: async () => { /* GET /players */ },
  getPlayerById: async (id) => { /* GET /players/:id */ },
  createPlayer: async (data) => { /* POST /players */ },
  updatePlayer: async (id, data) => { /* PUT /players/:id */ },
  deletePlayer: async (id) => { /* DELETE /players/:id */ }
};
```

**💡 Tipp:**
```javascript
const response = await api.get('/players');
return response.data;
```

---

## ✏️ Aufgabe 3: Erste Component - Navbar (30 Min)

**📝 DEINE AUFGABE:**
Erstelle `src/components/Navbar.jsx`

**Anforderungen:**
1. Functional Component
2. Links zu:
   - Home (/)
   - Bestellen (/order)
   - Meine Bestellungen (/my-orders)
3. Nutze `react-router-dom` → `<Link>`
4. Schönes Styling mit CSS

**Beispiel-Struktur:**
```jsx
function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">⚽ TeamGear</div>
      <ul>
        <li><Link to="/">Home</Link></li>
        {/* ... */}
      </ul>
    </nav>
  );
}
```

---

## ✏️ Aufgabe 4: Players Liste anzeigen (45 Min)

**📝 DEINE AUFGABE:**
Erstelle `src/pages/PlayerList.jsx`

**Anforderungen:**
1. State für Players: `const [players, setPlayers] = useState([])`
2. useEffect um Daten zu laden:
   ```javascript
   useEffect(() => {
     loadPlayers();
   }, []);
   ```
3. `loadPlayers()` Funktion:
   - Ruft `playerService.getAllPlayers()` auf
   - Setzt State mit den Daten
   - Error Handling mit try-catch
4. Zeige Players in einer Liste an
5. Loading State während Daten laden
6. Error State bei Fehler

**💡 Tipps:**
- `useState` für State
- `useEffect` für API Calls beim Mount
- `.map()` um Liste zu rendern

**🤔 Denkaufgaben:**
- Warum `[]` bei useEffect?
- Was ist State?
- Wann wird useEffect ausgeführt?

---

## ✏️ Aufgabe 5: Bestellformular (90 Min)

**📝 DEINE AUFGABE:**
Erstelle `src/pages/OrderForm.jsx`

**Anforderungen:**

**1. Form State:**
```javascript
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  // ... mehr Felder
});
```

**2. Input Fields:**
- Vorname (required)
- Nachname (required)
- Email (required, type="email")
- Telefon (optional)
- Produkt Dropdown (required)
- Größe Dropdown (required)
- Rückennummer (optional, nur für Trikots)

**3. Handle Change:**
```javascript
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
```

**4. Handle Submit:**
- e.preventDefault()
- Validation (alle required Felder?)
- API Call zu playerService.createPlayer()
- Success/Error Message
- Form zurücksetzen bei Success

**5. UI Feedback:**
- Loading State während Submit
- Success Message (grün)
- Error Message (rot)
- Button disabled während Loading

**💡 Tipp:** Arbeite Schritt für Schritt:
1. Erst Form Layout
2. Dann State
3. Dann onChange
4. Dann Submit
5. Dann Feedback

---

## ✏️ Aufgabe 6: Routing Setup (20 Min)

**📝 DEINE AUFGABE:**
Editiere `src/App.js`

**Anforderungen:**
1. Import `BrowserRouter`, `Routes`, `Route`
2. Wrapp alles in `<BrowserRouter>`
3. Routes definieren:
   - `/` → Home Page
   - `/order` → OrderForm
   - `/players` → PlayerList
4. Navbar auf allen Pages

**Beispiel:**
```jsx
<BrowserRouter>
  <Navbar />
  <main>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* ... */}
    </Routes>
  </main>
</BrowserRouter>
```

---

## ✏️ Aufgabe 7: Styling (30-60 Min)

**📝 DEINE AUFGABE:**
Mache deine App schön!

**Anforderungen:**
1. Einheitliches Farbschema
2. Responsive Design (Mobile + Desktop)
3. Hover Effects auf Buttons
4. Box Shadows für Cards
5. Schöne Schriftarten

**💡 CSS Tipps:**
- Flexbox für Layouts
- Grid für Listen
- Media Queries für Mobile
- CSS Variables für Farben

**Inspiration:**
- https://dribbble.com/
- Andere Fußball-Websites

---

## 💪 Bonus-Aufgaben

### Bonus 1: Edit Player
- Button "Bearbeiten" in Player Liste
- Modal oder neue Page
- Form mit existierenden Daten
- PUT Request zum Update

### Bonus 2: Delete Player
- Button "Löschen"
- Bestätigungs-Dialog
- DELETE Request
- Liste neu laden

### Bonus 3: Search & Filter
- Search Bar für Player Name
- Filter nach Produkt
- Live-Search (während Tippen)

### Bonus 4: Dark Mode
- Toggle Button
- CSS Variables für Farben
- LocalStorage für Preference

---

## 🧪 Test-Szenarien

### Test 1: Player erstellen
1. Öffne /order
2. Fülle alle Felder aus
3. Click Submit
4. Sollte: Success Message + Form reset

### Test 2: Player Liste
1. Öffne /players
2. Sollte: Alle Players aus DB
3. Refresh Page
4. Sollte: Daten bleiben

### Test 3: Error Handling
1. Backend stoppen
2. Versuche Player zu erstellen
3. Sollte: Error Message

### Test 4: Validation
1. Lasse Required Field leer
2. Click Submit
3. Sollte: Validation Error

---

## 🎓 Reflexionsfragen

1. **Was ist der Unterschied zwischen Props und State?**
2. **Wann wird useEffect ausgeführt?**
3. **Warum async/await bei API Calls?**
4. **Was macht React "reactive"?**
5. **Wie funktioniert der Request-Flow genau?**

---

## ✅ Checkliste

- [ ] React App läuft
- [ ] API Service erstellt
- [ ] Navbar Component
- [ ] Player Liste zeigt Daten
- [ ] Bestellformular funktioniert
- [ ] Routing works
- [ ] Styling schön
- [ ] Error Handling implementiert
- [ ] Ich verstehe was ich gebaut habe!

---

## 🚀 Nächste Schritte

→ **Phase 3: Advanced Features**

Dort lernst du Excel Export, PDF Generation, Email!

---

**Du rockst! Weiter so! 🎨**
