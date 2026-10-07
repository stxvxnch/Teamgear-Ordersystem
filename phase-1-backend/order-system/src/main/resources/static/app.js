document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("produkt-liste");
    const productForm = document.getElementById("produkt-form");
    const productStatus = document.getElementById("produkt-form-status");
    const orderForm = document.getElementById("bestellung-form");
    const orderStatus = document.getElementById("bestellung-form-status");
    const orderPositionsContainer = document.getElementById("bestellung-positionen");
    const addPositionButton = document.getElementById("position-hinzufuegen");

    let products = [];

    const setStatus = (element, message, isError = false) => {
        element.textContent = message;
        element.style.color = isError ? "#b00020" : "#1f7a1f";
    };

    const formatPrice = (value) => Number(value).toFixed(2).replace(".", ",") + " €";

    const renderProductCards = (produkte) => {
        productList.innerHTML = "";

        if (!produkte || produkte.length === 0) {
            productList.innerHTML = "<p>Keine Produkte vorhanden.</p>";
            return;
        }

        produkte.forEach(produkt => {
            productList.innerHTML += `
                <div class="produkt-karte">
                    <h3 class="produkt-name">${produkt.name}</h3>
                    <p class="produkt-kategorie">${produkt.category}</p>
                    <p class="produkt-preis">${formatPrice(produkt.price)}</p>
                </div>
            `;
        });
    };

    const populateOrderProductOptions = () => {
        const selects = document.querySelectorAll(".bestellung-produkt");

        selects.forEach((select) => {
            const selectedValue = select.value;
            select.innerHTML = '<option value="">-- Produkt wählen --</option>' + products
                .map(produkt => `<option value="${produkt.id}">${produkt.name} (${produkt.category})</option>`)
                .join("");

            if (selectedValue) {
                select.value = selectedValue;
            }
        });
    };

    const createOrderPositionRow = () => {
        const row = document.createElement("div");
        row.className = "bestell-position-row";
        row.innerHTML = `
            <label>Produkt</label>
            <select class="bestellung-produkt" required>
                <option value="">-- Produkt wählen --</option>
                ${products.map(produkt => `<option value="${produkt.id}">${produkt.name} (${produkt.category})</option>`).join("")}
            </select>

            <label>Menge</label>
            <input type="number" class="bestellung-menge" min="1" value="1" required>

            <label>Größe</label>
            <select class="bestellung-groesse" required>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
            </select>

            <button type="button" class="position-loeschen">Entfernen</button>
        `;

        const removeButton = row.querySelector(".position-loeschen");
        removeButton.addEventListener("click", () => {
            const rows = orderPositionsContainer.querySelectorAll(".bestell-position-row");
            if (rows.length === 1) {
                setStatus(orderStatus, "Es muss mindestens eine Position vorhanden sein.", true);
                return;
            }
            row.remove();
        });

        orderPositionsContainer.appendChild(row);
    };

    const refreshProducts = () => {
        return fetch("/api/products")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Produkte konnten nicht geladen werden.");
                }
                return response.json();
            })
            .then(produkte => {
                products = produkte;
                renderProductCards(produkte);
                populateOrderProductOptions();
            })
            .catch(error => {
                setStatus(productStatus, error.message, true);
            });
    };

    productForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(productForm);
        const payload = {
            name: String(formData.get("name") || "").trim(),
            description: String(formData.get("description") || "").trim() || null,
            price: Number(formData.get("price")),
            category: formData.get("category")
        };

        if (!payload.name) {
            setStatus(productStatus, "Bitte gib einen Produktnamen ein.", true);
            return;
        }

        if (!payload.category) {
            setStatus(productStatus, "Bitte wähle eine Kategorie aus.", true);
            return;
        }

        if (Number.isNaN(payload.price) || payload.price < 0) {
            setStatus(productStatus, "Bitte gib einen gültigen Preis ein.", true);
            return;
        }

        setStatus(productStatus, "Produkt wird angelegt...");

        fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(async response => {
                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    throw new Error(data?.message || "Produkt konnte nicht angelegt werden.");
                }

                setStatus(productStatus, `Produkt "${data.name}" wurde erfolgreich angelegt.`);
                productForm.reset();
                return refreshProducts();
            })
            .catch(error => {
                setStatus(productStatus, error.message, true);
            });
    });

    addPositionButton.addEventListener("click", () => createOrderPositionRow());

    orderForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const rows = [...orderPositionsContainer.querySelectorAll(".bestell-position-row")];
        const bestellPositionen = rows.map(row => {
            const productSelect = row.querySelector(".bestellung-produkt");
            const quantityInput = row.querySelector(".bestellung-menge");
            const sizeSelect = row.querySelector(".bestellung-groesse");

            return {
                productId: Number(productSelect.value),
                quantity: Number(quantityInput.value),
                size: sizeSelect.value
            };
        });

        const customerName = orderForm.querySelector("#bestellung-kunde").value.trim();
        const zahlungsart = orderForm.querySelector("#bestellung-zahlungsart").value;

        if (!customerName) {
            setStatus(orderStatus, "Bitte gib deinen Namen ein.", true);
            return;
        }

        if (!bestellPositionen.length || bestellPositionen.some(position => !position.productId || position.quantity < 1 || !position.size)) {
            setStatus(orderStatus, "Bitte fülle alle Positionen vollständig aus.", true);
            return;
        }

        setStatus(orderStatus, "Bestellung wird aufgegeben...");

        fetch("/api/bestellungen", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                customerName,
                zahlungsart,
                bestellPositionen
            })
        })
            .then(async response => {
                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    throw new Error(data?.message || "Bestellung konnte nicht erstellt werden.");
                }

                setStatus(orderStatus, `Bestellung für ${data.customerName} wurde erfolgreich angelegt.`);
                orderForm.reset();
                orderPositionsContainer.innerHTML = "";
                createOrderPositionRow();
                return refreshProducts();
            })
            .catch(error => {
                setStatus(orderStatus, error.message, true);
            });
    });

    refreshProducts().then(() => {
        const existingRows = orderPositionsContainer.querySelectorAll(".bestell-position-row");
        if (existingRows.length === 0) {
            createOrderPositionRow();
        }
    });
});

