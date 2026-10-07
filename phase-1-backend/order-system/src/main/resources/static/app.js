// ===================================================
// Teamgear Shop — hier kommt dein JavaScript rein
// ===================================================
//
// Da diese Datei von Spring Boot mit ausgeliefert wird
// (gleicher Port wie die API), kannst du einfach relative
// Pfade benutzen, z.B. fetch('/api/products')
//
// Die drei Dinge, die hier als Nächstes passieren sollen:
//
// 1. Beim Laden der Seite: GET /api/products aufrufen und
//    für jedes Produkt eine Karte in #produkt-liste einfügen
//    (orientier dich an der Beispiel-Karte, die aktuell noch
//    im HTML steht)
//
// 2. Das Formular #produkt-form abfangen (submit-Event),
//    die Werte auslesen und per POST an /api/products schicken
//
// 3. Das Formular #bestellung-form abfangen, die Werte
//    auslesen und als CreateBestellungDTO-Struktur per POST
//    an /api/bestellungen schicken (denk an das Format:
//    { customerName, zahlungsart, bestellPositionen: [ {...} ] })

document.addEventListener("DOMContentLoaded", () => {
    const liste = document.getElementById("produkt-liste");
    liste.innerHTML = "";

    fetch('/api/products')
    .then(response => response.json())
    .then(produkte => {
        produkte.forEach(produkt => {
            liste.innerHTML += `
                <div class="produkt-karte">
                <h3 class="produkt-name">${produkt.name}</h3>
                <p class="produkt-kategorie">${produkt.category}</p>
                <p class="produkt-preis">${produkt.price} €</p>
            </div>
            `;
        });
    })
})

