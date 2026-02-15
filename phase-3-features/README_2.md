# 🚀 Phase 3: Advanced Features - Übungsblatt

**Dauer:** 1 Woche | **Level:** Mittel

---

## 🎯 Lernziele

- ✅ Excel Files generieren (Apache POI)
- ✅ PDF Dokumente erstellen (iText)
- ✅ Emails versenden (Spring Mail)
- ✅ File Upload implementieren

---

## ✏️ Aufgabe 1: Excel Export (90 Min)

### Schritt 1.1: Dependencies

**📝 DEINE AUFGABE:** Füge zu `pom.xml` hinzu:
```xml
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.3</version>
</dependency>
```

### Schritt 1.2: ExcelExportService

**📝 DEINE AUFGABE:**
Erstelle `src/main/java/com/teamgear/ordersystem/service/ExcelExportService.java`

**Was du bauen musst:**
1. Method `exportOrdersToExcel()` → returns `byte[]`
2. Erstelle Workbook (`XSSFWorkbook`)
3. Erstelle Sheet "Bestellungen"
4. Header Row mit: Best.-Nr., Spieler, Email, Produkt, Größe, Preis, Datum
5. Data Rows mit allen Orders aus DB
6. Auto-size Columns
7. Return als ByteArray

**💡 Tipps:**
- Workbook workbook = new XSSFWorkbook()
- Sheet sheet = workbook.createSheet("Name")
- Row row = sheet.createRow(rowNum)
- Cell cell = row.createCell(colNum)

### Schritt 1.3: Controller Endpoint

**📝 DEINE AUFGABE:**
In `AdminController`, füge hinzu:
```java
@GetMapping("/export/excel")
public ResponseEntity<byte[]> exportExcel() {
    // 1. Service aufrufen
    // 2. Headers setzen (Content-Type, Content-Disposition)
    // 3. ByteArray zurückgeben
}
```

**Test:** `GET http://localhost:8080/api/admin/export/excel`
→ Sollte Excel File downloaden!

---

## ✏️ Aufgabe 2: PDF Generation (90 Min)

### Schritt 2.1: Dependencies

```xml
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>itext7-core</artifactId>
    <version>7.2.5</version>
    <type>pom</type>
</dependency>
```

### Schritt 2.2: PdfGenerationService

**📝 DEINE AUFGABE:**
Erstelle `PdfGenerationService.java`

**Was du bauen musst:**
1. Method `generateSupplierPdf()` → returns `byte[]`
2. Erstelle PDF Document
3. Add Title "Lieferanten-Bestellung"
4. Add Datum
5. Tabelle mit: Produkt, Größe, Anzahl
6. Gruppiere Orders nach Produkt + Größe
7. Return als ByteArray

**💡 Tipps:**
- PdfWriter writer = new PdfWriter(baos)
- PdfDocument pdf = new PdfDocument(writer)
- Document doc = new Document(pdf)
- doc.add(new Paragraph("Text"))
- Table table = new Table(3)

### Schritt 2.3: Endpoint

**📝 DEINE AUFGABE:**
```java
@GetMapping("/export/pdf")
public ResponseEntity<byte[]> exportPdf() {
    // Analog zu Excel
}
```

---

## ✏️ Aufgabe 3: Email Service (60 Min)

### Schritt 3.1: Dependencies & Config

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

**application.properties:**
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Schritt 3.2: EmailService

**📝 DEINE AUFGABE:**
Erstelle `EmailService.java`

**Methoden:**
1. `sendOrderConfirmation(to, playerName, orderNumber)`
   - Subject: "Bestellbestätigung"
   - Body: Freundlicher Text mit Details
2. `sendSupplierNotification(supplierEmail, orderCount)`
   - Subject: "Neue Bestellung"
   - Body: Info über neue Bestellung

**💡 Tipp:**
```java
SimpleMailMessage message = new SimpleMailMessage();
message.setTo(to);
message.setSubject(subject);
message.setText(text);
mailSender.send(message);
```

### Schritt 3.3: Integration

**📝 DEINE AUFGABE:**
In `OrderService`, nach Save:
```java
emailService.sendOrderConfirmation(
    player.getEmail(),
    player.getFirstName(),
    order.getOrderNumber()
);
```

---

## ✏️ Aufgabe 4: File Upload (60 Min)

### Schritt 4.1: Upload Endpoint

**📝 DEINE AUFGABE:**
In `ProductController`:

```java
@PostMapping("/{id}/image")
public ResponseEntity<String> uploadImage(
    @PathVariable Long id,
    @RequestParam("file") MultipartFile file) {
    
    // 1. Validate: Datei leer?
    // 2. Validate: Ist es ein Image?
    // 3. Filename generieren: id + originalFilename
    // 4. Save zu: uploads/products/
    // 5. Update Product imageUrl
    // 6. Return Success Message
}
```

**💡 Tipps:**
- Files.createDirectories(path)
- Files.copy(file.getInputStream(), filePath)
- file.getContentType() für Validation

### Schritt 4.2: Static Resources

**application.properties:**
```properties
spring.web.resources.static-locations=file:uploads/
```

**Test mit Postman:**
- POST /api/products/1/image
- Body: form-data
- Key: file (type: File)
- Value: Select image

---

## 💪 Bonus-Aufgaben

### Bonus 1: Excel mit Styling
- Header mit Background Color
- Bold Font
- Borders
- Currency Format für Preise

### Bonus 2: PDF mit Logo
- Team Logo im Header
- Formatierte Tabelle
- Footer mit Kontaktdaten

### Bonus 3: HTML Email Templates
- Schönes HTML Design
- Inline CSS
- Order Details Tabelle

### Bonus 4: Multiple File Upload
- Mehrere Bilder auf einmal
- Image Gallery für Products
- Thumbnail Generation

---

## 🧪 Test-Szenarien

### Excel Export Test
1. Erstelle mehrere Orders
2. GET /api/admin/export/excel
3. Öffne Excel
4. Check: Alle Daten korrekt?

### PDF Test
1. GET /api/admin/export/pdf
2. Öffne PDF
3. Check: Formatierung OK?

### Email Test
1. Erstelle Order
2. Check Email Inbox
3. Email angekommen?

### Upload Test
1. POST Image
2. Check uploads/ Ordner
3. GET Product → imageUrl gesetzt?

---

## ✅ Checkliste

- [ ] Excel Export funktioniert
- [ ] PDF Generation funktioniert
- [ ] Email Versand funktioniert
- [ ] File Upload funktioniert
- [ ] Alle Features getestet
- [ ] Error Handling implementiert

---

## 🚀 Nächste Schritte

→ **Phase 4: Security & Authentication**

---

**Awesome! Dein System kann richtig was! 🎉**
