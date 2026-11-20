document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".divheaderparentA1");
    const mainContainer = document.querySelector(".divcontainerABCDEFGHI");
    const masterGrid = document.getElementById("master-product-grid");
    const rows = [
        document.querySelector(".divlowercontainerABC"),
        document.querySelector(".divlowercontainerDEF"),
        document.querySelector(".divlowercontainerGHI")
    ];
    const cards = document.querySelectorAll('[class^="divparent"]');
    const searchInput = document.getElementById("rattan-search-input");

    function triggerPopup(el) {
        if (!el) return;
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "popup 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards";
    }

    document.getElementById("nav-help").addEventListener("click", () => {
        document.getElementById("help-section").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("nav-product").addEventListener("click", () => {
        document.getElementById("product-section").scrollIntoView({ behavior: "smooth" });
    });

    document.querySelectorAll("button, .divheaderchildA3, .divheaderchildA4, [class^='divparent']").forEach(el => {
        el.addEventListener("mousedown", () => { el.style.transform = "scale(0.95)"; });
        el.addEventListener("mouseup", () => { el.style.transform = "scale(1)"; });
        el.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; });
    });

    let basket = [];

    const basketBtn = document.createElement("div");
    basketBtn.className = "rattan-basket-btn";
    basketBtn.innerHTML = `<h1>Basket (0)</h1>`;
    header.appendChild(basketBtn);

    const basketModal = document.createElement("div");
    basketModal.className = "rattan-modal-overlay";
    basketModal.innerHTML = `
        <div class="rattan-modal-box">
            <h2>Basket</h2>
            <ul id="rattan-basket-list"></ul>
            <p id="rattan-basket-empty">Nothing's here...</p>
            <div class="rattan-modal-actions">
                <button id="rattan-clear-basket">Remove All Items</button>
                <button id="rattan-close-basket">Exit</button>
            </div>
        </div>
    `;
    document.body.appendChild(basketModal);

    const basketList = document.getElementById("rattan-basket-list");
    const basketEmptyMsg = document.getElementById("rattan-basket-empty");

    function updateBasketUI() {
        basketBtn.innerHTML = `<h1>Basket (${basket.length})</h1>`;
        basketList.innerHTML = "";
        if (basket.length === 0) {
            basketEmptyMsg.style.display = "block";
        } else {
            basketEmptyMsg.style.display = "none";
            basket.forEach((item, index) => {
                const li = document.createElement("li");
                li.style.animation = "showup 0.3s ease forwards";
                li.innerHTML = `
                    <span><strong>${item.name}</strong> (${item.price})</span>
                    <button class="remove-item-btn" data-index="${index}">Remove</button>
                `;
                basketList.appendChild(li);
            });
        }
    }

    basketBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        updateBasketUI();
        basketModal.style.display = "flex";
        triggerPopup(basketModal.querySelector(".rattan-modal-box"));
        setTimeout(() => basketModal.style.opacity = "1", 10);
    });

    function closeBasketModal() {
        basketModal.style.opacity = "0";
        setTimeout(() => basketModal.style.display = "none", 300);
    }

    document.getElementById("rattan-close-basket").addEventListener("click", closeBasketModal);
    document.getElementById("rattan-clear-basket").addEventListener("click", () => {
        basket = [];
        updateBasketUI();
    });

    basketList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item-btn")) {
            const idx = parseInt(e.target.getAttribute("data-index"), 10);
            basket.splice(idx, 1);
            updateBasketUI();
        }
    });

    const detailModal = document.createElement("div");
    detailModal.className = "rattan-modal-overlay";
    detailModal.innerHTML = `
        <div class="rattan-modal-box">
            <h2 id="detail-title"></h2>
            <p id="detail-desc"></p>
            <p id="detail-price" class="detail-highlight"></p>
            <div id="detail-processes" class="detail-process-box"></div>
            <div class="rattan-modal-actions">
                <button id="detail-add-btn">Add to Basket</button>
                <button id="detail-close-btn">Exit</button>
            </div>
        </div>
    `;
    document.body.appendChild(detailModal);

    let currentSelectedProduct = null;

    cards.forEach((card) => {
        const letter = card.className.replace("divparent", "").replace("1", "");
        const titleEl = card.querySelector(`.divchild${letter}1 h1`) || card.querySelector(`.divchild${letter}1 H1`);
        const descEl = card.querySelector(`.divchild${letter}2`);
        const priceEl = card.querySelector(`.divchild${letter}3`);
        const semiEl = card.querySelector(`.divsemichild${letter}1`);

        if (descEl) descEl.style.display = "none";
        if (priceEl) priceEl.style.display = "none";
        if (semiEl) semiEl.style.display = "none";

        card.style.cursor = "pointer";

        card.addEventListener("click", (e) => {
            e.stopPropagation();

            const name = titleEl ? titleEl.textContent.trim() : "Rattan Item";
            const desc = descEl ? descEl.textContent.trim() : "";
            const price = priceEl ? priceEl.textContent.trim() : "";
            const semiItems = semiEl ? Array.from(semiEl.querySelectorAll("p")).map(p => p.textContent.trim()) : [];

            currentSelectedProduct = { name, price };

            document.getElementById("detail-title").textContent = name;
            document.getElementById("detail-desc").textContent = desc;
            document.getElementById("detail-price").textContent = `Price Range: ${price}`;

            const processLabels = ["Making Process", "Distribution Process", "Checking Process"];
            document.getElementById("detail-processes").innerHTML = semiItems
                .map((time, i) => `<p><strong>${processLabels[i] || "Process"}:</strong> ${time}</p>`)
                .join("");

            detailModal.style.display = "flex";
            triggerPopup(detailModal.querySelector(".rattan-modal-box"));
            setTimeout(() => detailModal.style.opacity = "1", 10);
        });
    });

    document.getElementById("detail-add-btn").addEventListener("click", () => {
        if (currentSelectedProduct) {
            basket.push(currentSelectedProduct);
            updateBasketUI();
            closeDetailModal();
        }
    });

    function closeDetailModal() {
        detailModal.style.opacity = "0";
        setTimeout(() => detailModal.style.display = "none", 300);
    }

    document.getElementById("detail-close-btn").addEventListener("click", closeDetailModal);

    [basketModal, detailModal].forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.opacity = "0";
                setTimeout(() => modal.style.display = "none", 300);
            }
        });
    });

    let isSearching = false;
    let currentRowIndex = 0;
    const groupLabels = ["Group 1: ABC", "Group 2: DEF", "Group 3: GHI"];

    const poster = document.querySelector(".divposter");
    const indicator = document.createElement("p");
    indicator.className = "array-indicator";
    if (poster) poster.appendChild(indicator);

    function applyRowDisplay() {
        if (isSearching) return;
        rows.forEach((row, i) => {
            if (row) {
                if (i === currentRowIndex) {
                    row.style.display = "flex";
                    row.querySelectorAll('[class^="divparent"]').forEach(triggerPopup);
                } else {
                    row.style.display = "none";
                }
            }
        });
        indicator.textContent = `Showing ${groupLabels[currentRowIndex]} (Click container background to switch)`;
        indicator.style.display = "inline-block";
    }

    applyRowDisplay();

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length > 0) {
            isSearching = true;
            indicator.style.display = "none";

            rows.forEach(row => { if (row) row.style.display = "flex"; });

            cards.forEach(card => {
                const letter = card.className.replace("divparent", "").replace("1", "");
                const titleEl = card.querySelector(`.divchild${letter}1 h1`) || card.querySelector(`.divchild${letter}1 H1`);
                const name = titleEl ? titleEl.textContent.toLowerCase() : "";

                if (name.includes(query)) {
                    if (card.style.display !== "flex") {
                        card.style.display = "flex";
                        triggerPopup(card);
                    }
                } else {
                    card.style.display = "none";
                }
            });
        } else {
            isSearching = false;
            cards.forEach(card => { card.style.display = "flex"; });
            applyRowDisplay();
        }
    });

    mainContainer.addEventListener("click", (e) => {
        if (e.target === mainContainer || e.target === masterGrid || e.target === poster) {
            if (isSearching) {
                searchInput.value = "";
                isSearching = false;
                cards.forEach(card => { card.style.display = "flex"; });
                applyRowDisplay();
            } else {
                currentRowIndex = (currentRowIndex + 1) % rows.length;
                applyRowDisplay();
            }
        }
    });
});