# 🚀 Phase 3: Advanced Features

**Dauer:** 1 Woche | **Aufwand:** 6-8 Stunden

---

## 🎯 Was du baust

Die **Power-Features** deines Systems:
- 📊 **Excel Export** - Alle Bestellungen als Excel
- 📄 **PDF Generation** - Lieferanten-Liste als PDF
- 📧 **Email Service** - Automatische Benachrichtigungen
- 📁 **File Upload** - Produktbilder hochladen

---

## 📊 Module 3.1: Excel Export

### Dependencies hinzufügen

**pom.xml**
```xml
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi</artifactId>
    <version>5.2.3</version>
</dependency>
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.3</version>
</dependency>
```

### Excel Export Service

```java
package com.teamgear.ordersystem.service;

import com.teamgear.ordersystem.model.Order;
import com.teamgear.ordersystem.repository.OrderRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelExportService {
    
    private final OrderRepository orderRepository;
    
    public ExcelExportService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
    
    public byte[] exportOrdersToExcel() throws IOException {
        List<Order> orders = orderRepository.findAll();
        
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Bestellungen");
        
        // Header Style
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        
        // Header Row
        Row headerRow = sheet.createRow(0);
        String[] columns = {"Best.-Nr.", "Spieler", "Email", "Produkt", "Größe", "Nummer", "Preis", "Datum", "Status"};
        
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }
        
        // Data Rows
        int rowNum = 1;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        
        for (Order order : orders) {
            Row row = sheet.createRow(rowNum++);
            
            row.createCell(0).setCellValue(order.getOrderNumber());
            row.createCell(1).setCellValue(order.getPlayer().getFirstName() + " " + order.getPlayer().getLastName());
            row.createCell(2).setCellValue(order.getPlayer().getEmail());
            
            // Items
            if (!order.getItems().isEmpty()) {
                var item = order.getItems().get(0);
                row.createCell(3).setCellValue(item.getProduct().getName());
                row.createCell(4).setCellValue(item.getSize());
                row.createCell(5).setCellValue(item.getJerseyNumber() != null ? item.getJerseyNumber() : "-");
                row.createCell(6).setCellValue(item.getSubtotal().doubleValue());
            }
            
            row.createCell(7).setCellValue(order.getCreatedAt().format(formatter));
            row.createCell(8).setCellValue(order.getStatus());
        }
        
        // Auto-size columns
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }
        
        // Write to ByteArray
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        
        return outputStream.toByteArray();
    }
}
```

### Controller Endpoint

```java
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    private final ExcelExportService excelExportService;
    
    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() throws IOException {
        byte[] excel = excelExportService.exportOrdersToExcel();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "orders_" + LocalDate.now() + ".xlsx");
        
        return new ResponseEntity<>(excel, headers, HttpStatus.OK);
    }
}
```

---

## 📄 Module 3.2: PDF Generation

### Dependencies

```xml
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>itext7-core</artifactId>
    <version>7.2.5</version>
    <type>pom</type>
</dependency>
```

### PDF Service

```java
package com.teamgear.ordersystem.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.teamgear.ordersystem.model.Order;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PdfGenerationService {
    
    private final OrderRepository orderRepository;
    
    public byte[] generateSupplierPdf() {
        List<Order> orders = orderRepository.findByStatus("PENDING");
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        
        // Title
        Paragraph title = new Paragraph("Lieferanten-Bestellung")
                .setFontSize(20)
                .setBold();
        document.add(title);
        
        document.add(new Paragraph("Datum: " + LocalDate.now()));
        document.add(new Paragraph(" ")); // Spacer
        
        // Group by Product and Size
        Map<String, Long> summary = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.groupingBy(
                    item -> item.getProduct().getName() + " - " + item.getSize(),
                    Collectors.counting()
                ));
        
        // Table
        Table table = new Table(3);
        table.addHeaderCell("Produkt");
        table.addHeaderCell("Größe");
        table.addHeaderCell("Anzahl");
        
        summary.forEach((key, count) -> {
            String[] parts = key.split(" - ");
            table.addCell(parts[0]);
            table.addCell(parts[1]);
            table.addCell(String.valueOf(count));
        });
        
        document.add(table);
        document.close();
        
        return baos.toByteArray();
    }
}
```

---

## 📧 Module 3.3: Email Service

### Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

### Configuration

**application.properties**
```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Email Service

```java
package com.teamgear.ordersystem.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    public void sendOrderConfirmation(String to, String playerName, String orderNumber) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Bestellbestätigung - " + orderNumber);
        message.setText(
            "Hallo " + playerName + ",\n\n" +
            "deine Bestellung " + orderNumber + " wurde erfolgreich aufgenommen!\n\n" +
            "Wir werden dich informieren, sobald die Lieferung bereit ist.\n\n" +
            "Sportliche Grüße,\n" +
            "Dein TeamGear Team"
        );
        message.setFrom("noreply@teamgear.com");
        
        mailSender.send(message);
    }
    
    public void sendSupplierNotification(String supplierEmail, int orderCount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(supplierEmail);
        message.setSubject("Neue Bestellung - " + orderCount + " Items");
        message.setText(
            "Hallo,\n\n" +
            "es gibt eine neue Sammelbestellung mit " + orderCount + " Items.\n\n" +
            "Bitte sieh dir das angehängte PDF an.\n\n" +
            "Grüße"
        );
        
        mailSender.send(message);
    }
}
```

---

## 📁 Module 3.4: File Upload

### Controller

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @PostMapping("/{id}/image")
    public ResponseEntity<String> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("Only images allowed");
        }
        
        try {
            // Save file
            String filename = id + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("uploads/products");
            Files.createDirectories(uploadPath);
            
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Update product
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            product.setImageUrl("/uploads/products/" + filename);
            productRepository.save(product);
            
            return ResponseEntity.ok("File uploaded: " + filename);
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload failed: " + e.getMessage());
        }
    }
}
```

---

## ✏️ Übungen

### Übung 3.1: Excel mit Formatierung
Erweitere den Excel Export:
- Farbliche Markierung nach Status
- Summenzeile am Ende
- Mehrere Sheets (Übersicht, Details, Statistik)

### Übung 3.2: PDF mit Logo
Füge dem PDF hinzu:
- Team Logo im Header
- Formatierte Tabelle
- Footer mit Kontaktdaten

### Übung 3.3: Email Templates
Erstelle HTML Email Templates:
- Schönes Design
- Order Details Tabelle
- Tracking Link

---

## 🎓 Was du gelernt hast

- ✅ Excel Generierung (Apache POI)
- ✅ PDF Erstellung (iText)
- ✅ Email Versand (Spring Mail)
- ✅ File Upload/Download
- ✅ Binary Data Handling
- ✅ Third-party Libraries Integration

---

## 🚀 Nächste Schritte

→ **Phase 4: Security & Authentication**

---

**Awesome! Dein System kann richtig was! 🎉**
