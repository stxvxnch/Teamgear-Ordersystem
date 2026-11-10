// =====================================================================
// Bestellübersicht: wer hat was bestellt, was kostet es, ist es bezahlt?
// Ablauf wie im Shop: laden -> in Variable merken -> render...() zeigt es an.
// =====================================================================

// ---------- Zustand ----------
let orders = [];     // alle Bestellungen vom Backend
let filter = "ALLE"; // "ALLE", "OFFEN" oder "BEZAHLT"

// ---------- Elemente der Seite ----------
const summaryBox = document.getElementById("zusammenfassung");
const filterBar = document.getElementById("filter-bar");
const tableBody = document.getElementById("bestellungen-liste");
const noOrders = document.getElementById("keine-bestellungen");
const toast = document.getElementById("toast");

// ---------- Kleine Helfer ----------

// 25 -> "25,00 €"
const formatPrice = (value) => Number(value).toFixed(2).replace(".", ",") + " €";

// "2026-11-10T14:05:03.123" -> "10.11.2026, 14:05"
const formatDate = (iso) =>
    new Date(iso).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });

// Erzeugt ein HTML-Element. textContent statt innerHTML = sicher bei Sonderzeichen.
function el(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

let toastTimer;
function showToast(text, isError = false) {
    toast.textContent = text;
    toast.className = "toast" + (isError ? " error" : "");
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
}

// Summe einer Bestellung: Preis * Menge, über alle Positionen addiert
const orderTotal = (order) =>
    order.bestellPositionen.reduce((sum, pos) => sum + pos.unitPrice * pos.quantity, 0);

// ---------- Bestellungen laden (GET /api/bestellungen) ----------
function loadOrders() {
    return fetch("/api/bestellungen")
        .then((response) => {
            if (!response.ok) throw new Error("Bestellungen konnten nicht geladen werden.");
            return response.json();
        })
        .then((data) => {
            // Neueste zuerst: höhere Nummer = später bestellt
            orders = data.sort((a, b) => b.id - a.id);
            render();
        })
        .catch((error) => showToast(error.message, true));
}

// ---------- Status ändern (PATCH /api/bestellungen/{id}/status) ----------
function setStatus(order, newStatus) {
    fetch(`/api/bestellungen/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
    })
        .then(async (response) => {
            const data = await response.json().catch(() => null);
            if (!response.ok) throw new Error(data?.message || "Status konnte nicht geändert werden.");
            showToast(`Bestellung ${order.id} ist jetzt "${newStatus}"`);
            return loadOrders(); // Liste neu laden, damit alles aktuell ist
        })
        .catch((error) => showToast(error.message, true));
}

// ---------- Anzeige ----------
function render() {
    renderSummary();
    renderFilters();
    renderTable();
}

// Zusammenfassung oben: Anzahl und Beträge (über ALLE Bestellungen, nicht nur gefilterte)
function renderSummary() {
    const open = orders.filter((o) => o.bestellStatus === "OFFEN");
    const paid = orders.filter((o) => o.bestellStatus === "BEZAHLT");
    const sum = (list) => list.reduce((total, order) => total + orderTotal(order), 0);

    summaryBox.innerHTML = "";
    [
        [String(orders.length), "Bestellungen"],
        [formatPrice(sum(open)), `noch offen (${open.length})`],
        [formatPrice(sum(paid)), `bezahlt (${paid.length})`],
    ].forEach(([value, label]) => {
        const box = el("div", "summary-box");
        box.append(el("strong", "", value), el("span", "muted", label));
        summaryBox.appendChild(box);
    });
}

// Filter-Buttons (gleiche Chips wie im Shop)
function renderFilters() {
    filterBar.innerHTML = "";
    ["ALLE", "OFFEN", "BEZAHLT"].forEach((status) => {
        const button = el("button", "chip" + (filter === status ? " active" : ""), status);
        button.addEventListener("click", () => {
            filter = status;
            render();
        });
        filterBar.appendChild(button);
    });
}

// Tabelle: pro Bestellung eine Zeile
function renderTable() {
    tableBody.innerHTML = "";

    const visible = filter === "ALLE" ? orders : orders.filter((o) => o.bestellStatus === filter);
    noOrders.hidden = visible.length > 0;

    visible.forEach((order) => {
        const row = el("tr");

        row.appendChild(el("td", "", "#" + order.id));
        row.appendChild(el("td", "", formatDate(order.orderDate)));
        row.appendChild(el("td", "", order.customerName));

        // Artikel: pro Position eine Zeile, z. B. "2× Trikot (M) · 25,00 €"
        const itemsCell = el("td");
        const itemList = el("ul", "item-list");
        order.bestellPositionen.forEach((pos) => {
            itemList.appendChild(
                el("li", "", `${pos.quantity}× ${pos.productName} (${pos.size}) · ${formatPrice(pos.unitPrice)}`)
            );
        });
        itemsCell.appendChild(itemList);
        row.appendChild(itemsCell);

        row.appendChild(el("td", "nowrap", formatPrice(orderTotal(order))));
        row.appendChild(el("td", "", order.zahlungsart));

        // Status als farbiges Badge (CSS-Klasse "offen" oder "bezahlt")
        const statusCell = el("td");
        statusCell.appendChild(
            el("span", "status " + order.bestellStatus.toLowerCase(), order.bestellStatus)
        );
        row.appendChild(statusCell);

        // Button: wechselt zwischen OFFEN und BEZAHLT
        const actionCell = el("td");
        const isPaid = order.bestellStatus === "BEZAHLT";
        const button = el("button", "btn", isPaid ? "Wieder auf offen" : "Als bezahlt markieren");
        button.addEventListener("click", () => setStatus(order, isPaid ? "OFFEN" : "BEZAHLT"));
        actionCell.appendChild(button);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

// ---------- Start ----------
loadOrders();