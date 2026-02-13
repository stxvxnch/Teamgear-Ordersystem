# 🚀 Phase 5: Deployment & Production

**Dauer:** 1 Woche | **Aufwand:** 6-10 Stunden

---

## 🎯 Was du lernst

Dein System **production-ready** machen:
- 🐳 Docker Container erstellen
- 🎼 Docker Compose für Multi-Container
- 🔄 CI/CD Pipeline (GitHub Actions)
- 📊 Monitoring & Logging
- 🌐 Production Deployment

---

## 🐳 Module 5.1: Docker Basics

### Dockerfile für Backend

**Dockerfile** (im Backend-Root)
```dockerfile
# Build Stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Build & Run Backend

```bash
# Build Image
docker build -t teamgear-backend:latest .

# Run Container
docker run -d \
  --name teamgear-backend \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DATABASE_URL=jdbc:postgresql://db:5432/teamgear \
  teamgear-backend:latest

# View Logs
docker logs -f teamgear-backend

# Stop & Remove
docker stop teamgear-backend
docker rm teamgear-backend
```

### Dockerfile für Frontend

**Dockerfile** (im Frontend-Root)
```dockerfile
# Build Stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

**nginx.conf**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🎼 Module 5.2: Docker Compose

### docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: teamgear-db
    environment:
      POSTGRES_DB: teamgear
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD:-admin123}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - teamgear-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: teamgear-backend
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/teamgear
      SPRING_DATASOURCE_USERNAME: admin
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD:-admin123}
      JWT_SECRET: ${JWT_SECRET:-mySecretKey}
      MAIL_USERNAME: ${MAIL_USERNAME}
      MAIL_PASSWORD: ${MAIL_PASSWORD}
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - teamgear-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: teamgear-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - teamgear-network

volumes:
  postgres-data:

networks:
  teamgear-network:
    driver: bridge
```

### Environment Variables

**.env** (nicht in Git committen!)
```env
DB_PASSWORD=secure_password_here
JWT_SECRET=your_jwt_secret_at_least_32_chars
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Docker Compose Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild images
docker-compose build

# Restart specific service
docker-compose restart backend

# Scale service
docker-compose up -d --scale backend=3
```

---

## 🔄 Module 5.3: CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/deploy.yml**
```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    
    - name: Run Backend Tests
      run: |
        cd backend
        mvn test
    
    - name: Build Backend
      run: |
        cd backend
        mvn clean package -DskipTests

  test-frontend:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install Dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Run Frontend Tests
      run: |
        cd frontend
        npm test
    
    - name: Build Frontend
      run: |
        cd frontend
        npm run build

  build-and-push:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and Push Backend
      run: |
        cd backend
        docker build -t ${{ secrets.DOCKER_USERNAME }}/teamgear-backend:latest .
        docker push ${{ secrets.DOCKER_USERNAME }}/teamgear-backend:latest
    
    - name: Build and Push Frontend
      run: |
        cd frontend
        docker build -t ${{ secrets.DOCKER_USERNAME }}/teamgear-frontend:latest .
        docker push ${{ secrets.DOCKER_USERNAME }}/teamgear-frontend:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to Server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /opt/teamgear
          docker-compose pull
          docker-compose up -d
          docker-compose logs -f
```

### GitHub Secrets Setup

In deinem GitHub Repo:
1. Settings → Secrets and variables → Actions
2. Füge hinzu:
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
   - `SERVER_HOST`
   - `SERVER_USER`
   - `SSH_PRIVATE_KEY`

---

## 📊 Module 5.4: Monitoring & Logging

### Spring Boot Actuator

**pom.xml**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**application-prod.properties**
```properties
# Actuator
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=always
management.metrics.export.prometheus.enabled=true

# Info Endpoint
info.app.name=@project.artifactId@
info.app.version=@project.version@
info.app.description=TeamGear Order System
```

### Prometheus & Grafana (Optional)

**docker-compose.yml** (erweitert)
```yaml
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - teamgear-network

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    networks:
      - teamgear-network
    depends_on:
      - prometheus
```

**prometheus.yml**
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'teamgear-backend'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['backend:8080']
```

### Logging Configuration

**logback-spring.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/application.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/application-%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>

    <logger name="com.teamgear" level="DEBUG"/>
</configuration>
```

---

## 🌐 Production Checklist

### Vor dem Deployment

- [ ] Alle Tests passed
- [ ] Environment Variables gesetzt
- [ ] Secrets nicht im Code
- [ ] Database Migrations getestet
- [ ] Security Audit durchgeführt
- [ ] Performance Tests gemacht
- [ ] Backup Strategy definiert
- [ ] Rollback Plan erstellt

### Nach dem Deployment

- [ ] Health Checks grün
- [ ] Logs prüfen
- [ ] Metrics prüfen
- [ ] Smoke Tests durchführen
- [ ] Monitoring Alerts setzen
- [ ] Documentation updaten

---

## ✏️ Übungen

### Übung 5.1: Multi-Stage Deployment
Erstelle drei Environments:
- Development
- Staging
- Production

Mit separaten docker-compose Files.

### Übung 5.2: Backup & Restore
Implementiere:
- Automatisches DB Backup (täglich)
- Backup Upload zu Cloud Storage
- Restore Script

### Übung 5.3: Load Balancing
Setup Nginx als Load Balancer:
- Mehrere Backend Instanzen
- Health Checks
- Sticky Sessions

---

## 🎓 Was du gelernt hast

- ✅ Docker Container erstellen
- ✅ Docker Compose orchestrieren
- ✅ CI/CD Pipeline aufsetzen
- ✅ Monitoring implementieren
- ✅ Production Best Practices
- ✅ Deployment Automation

---

## 🎉 GESCHAFFT!

**Du hast ein komplettes Production-Ready System gebaut!**

### Was du jetzt kannst:
- ✅ Fullstack Entwicklung (Frontend + Backend)
- ✅ REST API Design & Implementation
- ✅ Database Design & Management
- ✅ Authentication & Security
- ✅ File Generation (Excel, PDF)
- ✅ Email Integration
- ✅ Docker & Containerization
- ✅ CI/CD Pipelines
- ✅ Monitoring & Logging

### Für deine Arbeit bedeutet das:
- ✅ Du verstehst den kompletten Flow (FV → API → DB)
- ✅ Du kannst selbstständig Features implementieren
- ✅ Du kannst Probleme debuggen
- ✅ Du kannst mit dem Team mitdiskutieren
- ✅ Du bist bereit für EAI-Entwicklung!

---

**Glückwunsch! Du bist jetzt ein Fullstack Developer! 🚀⚽**
