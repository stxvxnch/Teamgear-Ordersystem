# ⚽ TeamGear Order System - Lernprojekt

**Baue ein komplettes Bestellsystem für deine Fußballmannschaft - und lerne dabei ALLES über moderne Softwareentwicklung!**

---

## 🎯 Was du baust

Ein **vollständiges Web-System** für Teamkleidung-Bestellungen:

### User Stories (Was die Nutzer können):
1. **Spieler:** Kann Trikots/Hosen/etc. bestellen mit Größe und Nummer
2. **Du (Admin):** Siehst alle Bestellungen, kannst Excel/PDF exportieren
3. **Lieferant:** Bekommt PDF mit allen Bestellungen

### Technisch lernst du:
- ✅ **Frontend** bauen (React oder einfaches HTML)
- ✅ **REST API** entwickeln (Spring Boot)
- ✅ **Datenbank** einbinden (PostgreSQL)
- ✅ **File Uploads** handhaben
- ✅ **Excel/PDF** generieren
- ✅ **Email** versenden
- ✅ **Docker** Deployment
- ✅ **Testing** (Unit + Integration)
- ✅ **Security** (Login System)
- ✅ **Monitoring** (Logs, Metrics)

---

## 🗺️ Projekt-Phasen (Build as you Learn!)

### Phase 1: Backend API (Woche 1-2)
**Goal:** REST API die läuft und Daten speichert

**Module:**
- 1.1 Projekt Setup & Spring Boot Basics
- 1.2 Datenbank & JPA (Players, Products, Orders)
- 1.3 REST Endpoints (CRUD Operations)
- 1.4 Testing (Unit Tests)

**Was du lernst:**
- Spring Boot Struktur verstehen
- REST APIs designen
- Datenbank-Operationen
- HTTP Methods & Status Codes

---

### Phase 2: Frontend (Woche 3)
**Goal:** Benutzer können Bestellungen aufgeben

**Module:**
- 2.1 HTML/CSS/JavaScript Basics
- 2.2 React Grundlagen (oder plain HTML)
- 2.3 API Integration (Fetch/Axios)
- 2.4 Forms & Validation

**Was du lernst:**
- Wie Frontend mit Backend redet
- REST API Calls verstehen
- User Interface bauen
- State Management

---

### Phase 3: Features (Woche 4)
**Goal:** Excel Export, PDF, Email

**Module:**
- 3.1 Excel Export (Apache POI)
- 3.2 PDF Generation (iText)
- 3.3 Email Service (Spring Mail)
- 3.4 File Upload (Produktbilder)

**Was du lernst:**
- File Handling
- Document Generation
- Email Integration
- File Upload/Download

---

### Phase 4: Security & Auth (Woche 5)
**Goal:** Login System & Berechtigungen

**Module:**
- 4.1 Spring Security Setup
- 4.2 Login/Register
- 4.3 JWT Tokens
- 4.4 Role-based Access (Admin vs. User)

**Was du lernst:**
- Authentication verstehen
- Authorization (wer darf was?)
- Session Management
- Security Best Practices

---

### Phase 5: Deployment & Production (Woche 6)
**Goal:** Online verfügbar machen

**Module:**
- 5.1 Docker Setup
- 5.2 Docker Compose (Backend + DB + Frontend)
- 5.3 CI/CD Pipeline (GitHub Actions)
- 5.4 Monitoring & Logging

**Was du lernst:**
- Container verstehen
- Deployment Prozess
- DevOps Basics
- Production Best Practices

---

## 📂 Projekt-Struktur

```
teamgear-project/
├── README.md                      ← Du bist hier
├── GETTING_STARTED.md             ← Schnellstart Guide
├── ARCHITECTURE.md                ← System Architektur
│
├── phase-1-backend/               ← Backend Development
│   ├── 01-setup/
│   ├── 02-database/
│   ├── 03-rest-api/
│   └── 04-testing/
│
├── phase-2-frontend/              ← Frontend Development
│   ├── 01-html-basics/
│   ├── 02-react-basics/
│   ├── 03-api-integration/
│   └── 04-forms/
│
├── phase-3-features/              ← Advanced Features
│   ├── 01-excel-export/
│   ├── 02-pdf-generation/
│   ├── 03-email-service/
│   └── 04-file-upload/
│
├── phase-4-security/              ← Security & Auth
│   ├── 01-spring-security/
│   ├── 02-login-register/
│   ├── 03-jwt-tokens/
│   └── 04-authorization/
│
├── phase-5-deployment/            ← Production Ready
│   ├── 01-docker/
│   ├── 02-docker-compose/
│   ├── 03-cicd/
│   └── 04-monitoring/
│
├── complete-app/                  ← Finale Version
│   ├── backend/
│   ├── frontend/
│   └── docker-compose.yml
│
└── resources/                     ← Hilfreiche Dateien
    ├── cheatsheet.md
    ├── troubleshooting.md
    └── faq.md
```

---

## 🚀 Quick Start

### Was du brauchst:
```bash
✅ Java 17+
✅ Maven 3.6+
✅ Node.js 18+ (für Frontend)
✅ PostgreSQL (oder Docker)
✅ IDE (IntelliJ IDEA oder VS Code)
✅ Git
```

### Los geht's:
```bash
# 1. Lies GETTING_STARTED.md
cat GETTING_STARTED.md

# 2. Starte mit Phase 1
cd phase-1-backend/01-setup
cat README.md

# 3. Folge den Anweisungen Schritt für Schritt
```

---

## 🎓 Lernziele pro Phase

### Nach Phase 1 verstehst du:
- [ ] Wie Spring Boot Projekte aufgebaut sind
- [ ] Wie REST APIs funktionieren
- [ ] Wie man mit Datenbanken arbeitet
- [ ] Wie man APIs testet

### Nach Phase 2 verstehst du:
- [ ] Wie Frontend und Backend kommunizieren
- [ ] Wie HTTP Requests funktionieren
- [ ] Wie man User Interfaces baut
- [ ] Wie man Forms validiert

### Nach Phase 3 verstehst du:
- [ ] Wie man Files generiert (Excel, PDF)
- [ ] Wie Email-Versand funktioniert
- [ ] Wie File Upload/Download geht
- [ ] Wie man externe Libraries einbindet

### Nach Phase 4 verstehst du:
- [ ] Wie Authentication funktioniert
- [ ] Wie man APIs absichert
- [ ] Wie Session Management geht
- [ ] Wie Role-based Access Control funktioniert

### Nach Phase 5 verstehst du:
- [ ] Wie Deployment funktioniert
- [ ] Wie Docker Container arbeiten
- [ ] Wie CI/CD Pipelines funktionieren
- [ ] Wie man Apps monitored

---

## 💡 Warum dieses Projekt perfekt für dich ist

### 1. Real-World Problem
- Du löst ein echtes Problem aus deinem Leben
- Du siehst direkt den Nutzen
- Du kannst es wirklich verwenden!

### 2. Vollständiger Stack
- Du siehst den **kompletten Flow**: Frontend → API → Datenbank
- Du verstehst wie alles zusammenhängt
- Wie bei der Arbeit: Ein System von A-Z

### 3. Praxisnah
- Genau die Technologien die in der Industrie verwendet werden
- REST API Design wie in der Arbeit
- Integration patterns die du brauchst

### 4. Schritt für Schritt
- Jede Phase baut auf der vorherigen auf
- Klare Lernziele
- Von einfach zu komplex

### 5. Übertragbar auf Arbeit
```
TeamGear System          →  Arbeit (eAkte System)
─────────────────────────────────────────────────
Frontend (Bestellung)    →  Frontend-Verfahren (FV)
REST API (Backend)       →  Deine REST API
Datenbank (Orders)       →  eAkte Datenbank
PDF Export               →  Dokument-Export
Integration              →  FV Integration
```

---

## 🎯 Bezug zu deiner Arbeit

### Was du jetzt nicht verstehst:
> "Wenn ein FV sich anbindet weiß ich nicht wie das funktioniert"

### Was du nach diesem Projekt verstehst:

**Frontend-Verfahren (FV) = Dein TeamGear Frontend**
```
FV sendet Request     →  Dein Frontend sendet Request
    ↓                        ↓
Deine REST API       →  Deine REST API
    ↓                        ↓
Verarbeitung         →  Deine Business Logic
    ↓                        ↓
eAkte Datenbank      →  Deine PostgreSQL DB
```

**Konkret lernst du:**
1. Wie HTTP Requests funktionieren (POST /api/orders)
2. Wie man Daten validiert (Input Validation)
3. Wie man in DB speichert (JPA/Hibernate)
4. Wie man Fehler behandelt (Error Handling)
5. Wie man Responses zurückgibt (JSON)
6. Wie man integriert (API zu API)
7. Wie man deployed (Docker)
8. Wie man testet (Unit + Integration)

---

## 📊 Lernfortschritt Tracking

```
Phase 1: Backend API
├─ Module 1.1: Setup                    [ ]
├─ Module 1.2: Datenbank               [ ]
├─ Module 1.3: REST API                [ ]
└─ Module 1.4: Testing                 [ ]

Phase 2: Frontend
├─ Module 2.1: HTML Basics             [ ]
├─ Module 2.2: React Basics            [ ]
├─ Module 2.3: API Integration         [ ]
└─ Module 2.4: Forms                   [ ]

Phase 3: Features
├─ Module 3.1: Excel Export            [ ]
├─ Module 3.2: PDF Generation          [ ]
├─ Module 3.3: Email Service           [ ]
└─ Module 3.4: File Upload             [ ]

Phase 4: Security
├─ Module 4.1: Spring Security         [ ]
├─ Module 4.2: Login/Register          [ ]
├─ Module 4.3: JWT Tokens              [ ]
└─ Module 4.4: Authorization           [ ]

Phase 5: Deployment
├─ Module 5.1: Docker                  [ ]
├─ Module 5.2: Docker Compose          [ ]
├─ Module 5.3: CI/CD                   [ ]
└─ Module 5.4: Monitoring              [ ]
```

---

## 🔥 Motivation

### Stell dir vor:
- ✅ Du verstehst **genau** wie dein System bei der Arbeit funktioniert
- ✅ Du kannst **selbstständig** neue Features implementieren
- ✅ Du kannst **Fehler debuggen** ohne Hilfe
- ✅ Du kannst **mit Kollegen mitdiskutieren** auf Augenhöhe
- ✅ Du hast ein **cooles Projekt** im Portfolio
- ✅ Du sparst **tatsächlich Zeit** bei deinen Fußball-Bestellungen!

### Nach 6 Wochen:
```
Vorher: "Ich verstehe nicht wie das funktioniert"
Nachher: "Ich habe ein komplettes System von Grund auf gebaut!"
```

---

## 🎊 Bonus Features (Später)

Wenn du durch bist, kannst du erweitern:
- 📱 Mobile App (React Native)
- 💬 Chat/Notifications
- 📊 Analytics Dashboard
- 🌍 Multi-Language Support
- 💳 Payment Integration
- 📧 Automated Reminders
- 🔔 Push Notifications

---

## 📞 Support & Resources

### Während dem Projekt:
- Jedes Modul hat ausführliche Erklärungen
- Code-Beispiele zum Nachbauen
- Übungen zum Festigen
- Troubleshooting Guides

### Wenn du stuck bist:
1. Check `troubleshooting.md`
2. Check `faq.md`
3. Google die Error Message
4. Frag mich nochmal!

---

## 🚀 Nächster Schritt

**Lies als nächstes:**
```bash
cat GETTING_STARTED.md
```

Dann geht's los mit Phase 1!

---

**Let's build something awesome! ⚽🚀**

*Made with ❤️ for your learning journey*
