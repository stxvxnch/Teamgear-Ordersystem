// =====================================================================
// Teamgear Shop – reines JavaScript, kein Framework
// Ablauf: Daten laden -> in Variablen merken -> mit render...() anzeigen.
// Ändert sich etwas (z. B. Warenkorb), rufen wir die passende render-Funktion neu auf.
// =====================================================================

// ---------- Konstanten (müssen so heißen wie die Enums im Backend) ----------
const SIZES = ["S", "M", "L", "XL"];
const CATEGORIES = ["TSHIRT", "HOSE", "PULLOVER", "TASCHEN"];
const CATEGORY_EMOJI = { TSHIRT: "👕", HOSE: "🩳", PULLOVER: "🧥", TASCHEN: "🎒" };

// ---------- Zustand: das "Gedächtnis" der Seite ----------
let products = [];   // alle Produkte vom Backend
let filter = "ALLE"; // aktuell gewählte Kategorie
let cart = [];       // Artikel im Warenkorb: { productId, name, price, size, quantity }

// ---------- Elemente der Seite einmal suchen und merken ----------
const filterBar = document.getElementById("filter-bar");
const productList = document.getElementById("produkt-liste");
const noProducts = document.getElementById("keine-produkte");
const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");
const cartClose = document.getElementById("cart-close");
const cartEmpty = document.getElementById("cart-empty");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
const checkoutForm = document.getElementById("checkout-form");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

// ---------- Kleine Helfer ----------

// 25 -> "25,00 €"
const formatPrice = (value) => Number(value).toFixed(2).replace(".", ",") + " €";

// Erzeugt ein HTML-Element. Wir nutzen textContent statt innerHTML:
// So kann ein Produktname mit "<script>" keinen Schaden anrichten.
function el(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

// Meldung unten rechts anzeigen und nach 4 Sekunden wieder ausblenden
let toastTimer;
function showToast(text, isError = false) {
    toast.textContent = text;
    toast.className = "toast" + (isError ? " error" : "");
    toast.hidden = false;
    clearTimeout(toastTimer); // alten Timer abbrechen, falls noch einer läuft
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
}

// ---------- Produkte laden (GET /api/products) ----------
function loadProducts() {
    return fetch("/api/products")
        .then((response) => {
            if (!response.ok) throw new Error("Produkte konnten nicht geladen werden.");
            return response.json();
        })
        .then((data) => {
            products = data;
            renderProducts();
        })
        .catch((error) => showToast(error.message, true));
}

// ---------- Kategorie-Filter anzeigen ----------
function renderFilters() {
    filterBar.innerHTML = ""; // erst leeren, dann neu aufbauen
    ["ALLE", ...CATEGORIES].forEach((category) => {
        const button = el("button", "chip" + (filter === category ? " active" : ""), category);
        button.addEventListener("click", () => {
            filter = category;
            renderFilters();
            renderProducts();
        });
        filterBar.appendChild(button);
    });
}

// ---------- Produktkarten anzeigen ----------
function renderProducts() {
    productList.innerHTML = "";

    // Nur Produkte der gewählten Kategorie behalten
    const visible = filter === "ALLE" ? products : products.filter((p) => p.category === filter);
    noProducts.hidden = visible.length > 0;

    visible.forEach((product) => {
        const card = el("article", "card");
        card.appendChild(el("div", "card-image", CATEGORY_EMOJI[product.category] || "🛍️"));

        const body = el("div", "card-body");
        body.appendChild(el("span", "badge", product.category));
        body.appendChild(el("h3", "", product.name));
        if (product.description) body.appendChild(el("p", "muted", product.description));
        body.appendChild(el("p", "price", formatPrice(product.price)));

        // Größenauswahl + Button
        const actions = el("div", "card-actions");
        const sizeSelect = document.createElement("select");
        SIZES.forEach((size) => {
            const option = el("option", "", size);
            option.value = size;
            sizeSelect.appendChild(option);
        });
        sizeSelect.value = "M";

        const addButton = el("button", "btn primary", "In den Warenkorb");
        addButton.addEventListener("click", () => addToCart(product, sizeSelect.value));

        actions.appendChild(sizeSelect);
        actions.appendChild(addButton);
        body.appendChild(actions);

        card.appendChild(body);
        productList.appendChild(card);
    });
}

// ---------- Warenkorb ----------

// Artikel hinzufügen. Gibt es Produkt+Größe schon, erhöhen wir nur die Menge.
function addToCart(product, size) {
    const existing = cart.find((item) => item.productId === product.id && item.size === size);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ productId: product.id, name: product.name, price: product.price, size, quantity: 1 });
    }
    renderCart();
    showToast(`${product.name} (${size}) im Warenkorb`);
}

// Menge ändern (+1 / -1). Bei 0 fliegt der Artikel raus.
function changeQuantity(item, delta) {
    item.quantity += delta;
    cart = cart.filter((entry) => entry.quantity > 0);
    renderCart();
}

// Warenkorb neu zeichnen
function renderCart() {
    cartList.innerHTML = "";

    cart.forEach((item) => {
        const row = el("li");

        const info = el("div");
        info.appendChild(el("strong", "", item.name));
        info.appendChild(el("div", "muted", `Größe ${item.size} · ${formatPrice(item.price)}`));

        const qty = el("div", "qty");
        const minus = el("button", "", "−");
        const plus = el("button", "", "+");
        minus.type = "button"; // "button" statt "submit", sonst würde das Formular abgeschickt
        plus.type = "button";
        minus.addEventListener("click", () => changeQuantity(item, -1));
        plus.addEventListener("click", () => changeQuantity(item, +1));
        qty.append(minus, el("span", "", String(item.quantity)), plus);

        row.append(info, qty);
        cartList.appendChild(row);
    });

    // Summe und Stückzahl berechnen
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartTotal.textContent = formatPrice(total);
    cartCount.textContent = count;
    cartCount.hidden = count === 0;

    // Bei leerem Warenkorb den Hinweis zeigen, sonst das Bestellformular
    cartEmpty.hidden = cart.length > 0;
    checkoutForm.hidden = cart.length === 0;
}

// Seitenleiste öffnen/schließen
function openCart() { drawer.classList.add("open"); overlay.hidden = false; }
function closeCart() { drawer.classList.remove("open"); overlay.hidden = true; }

cartButton.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// ---------- Bestellung abschicken (POST /api/bestellungen) ----------
checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault(); // verhindert das Neuladen der Seite

    const body = {
        customerName: document.getElementById("kunde").value.trim(),
        zahlungsart: document.getElementById("zahlungsart").value,
        // Aus jedem Warenkorb-Artikel wird eine Bestellposition fürs Backend
        bestellPositionen: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
        })),
    };

    fetch("/api/bestellungen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
        .then(async (response) => {
            const data = await response.json().catch(() => null);
            // Unser GlobalExceptionHandler liefert Fehler als { "message": "..." }
            if (!response.ok) throw new Error(data?.message || "Bestellung fehlgeschlagen.");

            cart = [];
            checkoutForm.reset();
            renderCart();
            closeCart();
            showToast(`Danke ${data.customerName}, deine Bestellung ist eingegangen!`);
        })
        .catch((error) => showToast(error.message, true));
});

// ---------- Start ----------
renderFilters();
renderCart();
loadProducts();