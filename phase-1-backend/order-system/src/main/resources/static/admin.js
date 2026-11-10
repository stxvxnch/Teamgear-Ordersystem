// =====================================================================
// Admin-Seite: neue Produkte anlegen und die vorhandenen auflisten
// =====================================================================

const form = document.getElementById("produkt-form");
const list = document.getElementById("produkt-liste");
const toast = document.getElementById("toast");

const formatPrice = (value) => Number(value).toFixed(2).replace(".", ",") + " €";

// Meldung unten rechts anzeigen und nach 4 Sekunden ausblenden
let toastTimer;
function showToast(text, isError = false) {
    toast.textContent = text;
    toast.className = "toast" + (isError ? " error" : "");
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
}

// Produkte laden (GET /api/products) und als Liste anzeigen
function loadProducts() {
    fetch("/api/products")
        .then((response) => {
            if (!response.ok) throw new Error("Produkte konnten nicht geladen werden.");
            return response.json();
        })
        .then((products) => {
            list.innerHTML = "";
            products.forEach((product) => {
                const row = document.createElement("li");
                // textContent statt innerHTML: kein Risiko durch Sonderzeichen im Namen
                row.textContent = `${product.name} (${product.category}) – ${formatPrice(product.price)}`;
                list.appendChild(row);
            });
        })
        .catch((error) => showToast(error.message, true));
}

// Formular abschicken (POST /api/products)
form.addEventListener("submit", (event) => {
    event.preventDefault(); // verhindert das Neuladen der Seite

    const payload = {
        name: document.getElementById("name").value.trim(),
        description: document.getElementById("beschreibung").value.trim() || null,
        price: Number(document.getElementById("preis").value),
        category: document.getElementById("kategorie").value,
    };

    fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
        .then(async (response) => {
            const data = await response.json().catch(() => null);
            if (!response.ok) throw new Error(data?.message || "Produkt konnte nicht angelegt werden.");

            showToast(`Produkt "${data.name}" angelegt`);
            form.reset();
            loadProducts(); // Liste aktualisieren
        })
        .catch((error) => showToast(error.message, true));
});

loadProducts();