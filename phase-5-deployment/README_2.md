# 🚀 Phase 5: Deployment & Production - Übungsblatt

**Dauer:** 1 Woche | **Level:** Fortgeschritten

---

## 🎯 Lernziele

- ✅ Docker Container erstellen
- ✅ Docker Compose orchestrieren
- ✅ CI/CD Pipeline aufsetzen
- ✅ Monitoring implementieren
- ✅ Production Best Practices

---

## ✏️ Aufgabe 1: Backend Dockerfile (45 Min)

### Theorie: Was ist Docker?

Docker = Container für deine App
- Wie eine Mini-VM
- Enthält: App + alle Dependencies
- Läuft überall gleich

### Schritt 1.1: Multi-Stage Dockerfile

**📝 DEINE AUFGABE:**
Erstelle `Dockerfile` im Backend-Root

**Anforderungen:**

**Stage 1: Build**
- Base Image: `maven:3.9-eclipse-temurin-17`
- Copy pom.xml und src/
- Run: `mvn clean package -DskipTests`

**Stage 2: Run**
- Base Image: `eclipse-temurin:17-jre-alpine`
- Copy JAR from build stage
- Expose Port 8080
- Add Health Check
- Run Application

**Template:**
```dockerfile
# Build Stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
# ... dein Code

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# ... dein Code
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Schritt 1.2: Build & Run

**📝 DEINE AUFGABE:**
```bash
# Build Image
docker build -t teamgear-backend:latest .

# Run Container
docker run -d \
  --name teamgear-backend \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  teamgear-backend:latest

# Check Logs
docker logs -f teamgear-backend
```

**✅ Test:** http://localhost:8080/actuator/health

---

## ✏️ Aufgabe 2: Frontend Dockerfile (30 Min)

### Schritt 2.1: Dockerfile erstellen

**📝 DEINE AUFGABE:**
Erstelle `Dockerfile` im Frontend-Root

**Anforderungen:**

**Stage 1: Build**
- Base: `node:18-alpine`
- npm install
- npm run build

**Stage 2: Production**
- Base: `nginx:alpine`
- Copy build files
- Copy nginx.conf
- Expose Port 80

### Schritt 2.2: Nginx Config

**📝 DEINE AUFGABE:**
Erstelle `nginx.conf`

**Anforderungen:**
- Serve React App
- Proxy `/api` zu Backend
- History Mode für React Router

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    
    location / {
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://backend:8080;
    }
}
```

---

## ✏️ Aufgabe 3: Docker Compose (60 Min)

### Theorie: Warum Docker Compose?

Orchestriert mehrere Container:
- Database
- Backend
- Frontend
- Alle connected in einem Network

### Schritt 3.1: docker-compose.yml

**📝 DEINE AUFGABE:**
Erstelle `docker-compose.yml` im Project-Root

**Services die du brauchst:**

**1. PostgreSQL:**
```yaml
db:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: teamgear
    POSTGRES_USER: admin
    POSTGRES_PASSWORD: ${DB_PASSWORD}
  ports:
    - "5432:5432"
  volumes:
    - postgres-data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U admin"]
```

**2. Backend:**
```yaml
backend:
  build: ./backend
  environment:
    SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/teamgear
    # ... more env vars
  ports:
    - "8080:8080"
  depends_on:
    db:
      condition: service_healthy
```

**3. Frontend:**
```yaml
frontend:
  build: ./frontend
  ports:
    - "80:80"
  depends_on:
    - backend
```

**4. Volumes & Networks:**
```yaml
volumes:
  postgres-data:

networks:
  teamgear-network:
    driver: bridge
```

### Schritt 3.2: Environment Variables

**📝 DEINE AUFGABE:**
Erstelle `.env` (NICHT committen!)

```env
DB_PASSWORD=secure_password
JWT_SECRET=your_jwt_secret_min_32_chars
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Schritt 3.3: Starten!

```bash
# Build & Start
docker-compose up -d

# Logs ansehen
docker-compose logs -f

# Stoppen
docker-compose down
```

**✅ Test:** 
- http://localhost → Frontend
- http://localhost:8080/api/players → Backend
- psql -h localhost -U admin -d teamgear → Database

---

## ✏️ Aufgabe 4: CI/CD Pipeline (90 Min)

### Theorie: Was ist CI/CD?

**CI** = Continuous Integration
- Automatisches Bauen & Testen
- Bei jedem Git Push

**CD** = Continuous Deployment
- Automatisches Deployment
- Wenn Tests passed

### Schritt 4.1: GitHub Actions

**📝 DEINE AUFGABE:**
Erstelle `.github/workflows/deploy.yml`

**Jobs die du brauchst:**

**1. Test Backend:**
```yaml
test-backend:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: Set up JDK 17
      uses: actions/setup-java@v3
    - name: Run Tests
      run: cd backend && mvn test
```

**2. Test Frontend:**
```yaml
test-frontend:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: Set up Node
      uses: actions/setup-node@v3
    - name: Run Tests
      run: cd frontend && npm ci && npm test
```

**3. Build & Push:**
```yaml
build-and-push:
  needs: [test-backend, test-frontend]
  if: github.ref == 'refs/heads/main'
  steps:
    # Login to Docker Hub
    # Build Images
    # Push Images
```

**4. Deploy:**
```yaml
deploy:
  needs: build-and-push
  steps:
    # SSH to Server
    # Pull new Images
    # docker-compose up
```

### Schritt 4.2: GitHub Secrets

**📝 DEINE AUFGABE:**
In GitHub Repo → Settings → Secrets:
- DOCKER_USERNAME
- DOCKER_PASSWORD
- SERVER_HOST
- SSH_PRIVATE_KEY

---

## ✏️ Aufgabe 5: Monitoring (45 Min)

### Schritt 5.1: Spring Actuator

**📝 DEINE AUFGABE:**
`pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**application-prod.properties:**
```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

**✅ Test:**
- /actuator/health
- /actuator/metrics
- /actuator/info

### Schritt 5.2: Custom Health Check

**📝 DEINE AUFGABE:**
Erstelle `config/CustomHealthIndicator.java`

```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    
    @Override
    public Health health() {
        // Check Database Connection
        // Return Health.up() or Health.down()
    }
}
```

### Schritt 5.3: Logging

**📝 DEINE AUFGABE:**
Erstelle `src/main/resources/logback-spring.xml`

**Anforderungen:**
- Console Appender
- File Appender (mit Rotation)
- Different Levels per Package
- JSON Format (optional)

---

## ✏️ Aufgabe 6: Production Checklist (30 Min)

### Security

**📝 DEINE AUFGABE:** Prüfe & fixe:
- [ ] Keine Secrets im Code
- [ ] Environment Variables genutzt
- [ ] HTTPS enabled (bei echtem Server)
- [ ] CORS konfiguriert
- [ ] Security Headers gesetzt

### Performance

**📝 DEINE AUFGABE:**
- [ ] Database Indexes gesetzt
- [ ] Connection Pooling konfiguriert
- [ ] Caching implementiert
- [ ] Gzip Compression enabled

### Reliability

**📝 DEINE AUFGABE:**
- [ ] Health Checks funktionieren
- [ ] Graceful Shutdown enabled
- [ ] Database Backups automatisiert
- [ ] Rollback Strategy definiert

---

## 💪 Bonus-Aufgaben

### Bonus 1: Kubernetes
- Erstelle Kubernetes Manifests
- Deploy zu Minikube
- Service, Deployment, Ingress

### Bonus 2: Prometheus & Grafana
- Add Prometheus Service
- Add Grafana Dashboard
- Custom Metrics

### Bonus 3: Multi-Environment
- dev, staging, production
- Separate docker-compose files
- Environment-specific configs

### Bonus 4: Load Balancer
- Nginx als Load Balancer
- Mehrere Backend Instances
- Health Check Routing

---

## 🧪 Test-Szenarien

### Test 1: Local mit Docker Compose
```bash
docker-compose up -d
# Check alle Services laufen
# Test Frontend
# Test Backend
# Test Database Connection
```

### Test 2: Health Checks
```bash
curl http://localhost:8080/actuator/health
# Should: "UP"
```

### Test 3: Logs
```bash
docker-compose logs backend
# Should: Keine Errors
```

### Test 4: Resource Usage
```bash
docker stats
# Check CPU & Memory
```

---

## 🎓 Reflexionsfragen

1. **Warum Multi-Stage Build?**
2. **Was macht Docker Compose?**
3. **Warum Health Checks?**
4. **Was ist der Deployment Flow?**
5. **Wie funktioniert Zero-Downtime Deployment?**

---

## ✅ Checkliste

- [ ] Backend Dockerfile funktioniert
- [ ] Frontend Dockerfile funktioniert
- [ ] Docker Compose startet alle Services
- [ ] CI/CD Pipeline konfiguriert
- [ ] Monitoring implementiert
- [ ] Production Checklist abgehakt
- [ ] Alles dokumentiert!

---

## 🎊 GESCHAFFT!

**Du hast ein komplettes Production-Ready System gebaut!**

### Was du jetzt kannst:
- ✅ Fullstack Development
- ✅ REST API Design
- ✅ Database Management
- ✅ Security Implementation
- ✅ Docker & Containerization
- ✅ CI/CD Pipelines
- ✅ Production Deployment

### Für deine Arbeit:
- ✅ Du verstehst den kompletten Flow
- ✅ Du kannst selbstständig entwickeln
- ✅ Du kannst Probleme debuggen
- ✅ Du bist bereit!

---

**Glückwunsch! Du bist jetzt ein Fullstack Developer! 🚀⚽**

*Was jetzt? Bau mehr Projekte, lerne weiter, bleib neugierig!*
