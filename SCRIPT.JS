let panier = JSON.parse(localStorage.getItem("flashtchi_panier")) || [];

const productsContainer = document.getElementById("productsContainer");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");

const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const productOverlay = document.getElementById("productOverlay");
const closeProduct = document.getElementById("closeProduct");
const detailImage = document.getElementById("detailImage");
const detailName = document.getElementById("detailName");
const detailDescription = document.getElementById("detailDescription");
const detailStock = document.getElementById("detailStock");
const detailPrice = document.getElementById("detailPrice");
const detailCartButton = document.getElementById("detailCartButton");
const buyNowButton = document.getElementById("buyNowButton");
let produitDetailActuel = null;
const checkoutButton = document.getElementById("checkoutButton");
const orderOverlay = document.getElementById("orderOverlay");
const closeOrder = document.getElementById("closeOrder");
const orderForm = document.getElementById("orderForm");

// =========================
// AFFICHER LES PRODUITS
// =========================

produits.forEach((produit) => {

    const productCard = document.createElement("div");

    productCard.className = "product-card";
productCard.style.cursor = "pointer";

productCard.addEventListener("click", (event) => {

    if (event.target.closest(".product-button")) {
        return;
    }

    ouvrirProduit(produit.id);
});
    productCard.innerHTML = `
        <img 
            src="${produit.image}" 
            alt="${produit.nom}" 
            class="product-image"
        >

<img
    src="${produit.image}"
    alt="${produit.nom}"
    class="product-image"
>

<div class="stock-badge">🟢 EN STOCK : ${produit.stock} unités</div>

<div class="product-info">

        <div class="product-info">

            <h3>${produit.nom}</h3>

            <p class="product-description">
                ${produit.description}
            </p>

            <div class="product-price">
                ${
                    produit.prix > 0
                    ? produit.prix + " FCFA"
                    : "Prix bientôt disponible"
                }
            </div>

            <button 
                class="product-button"
                onclick="ajouterAuPanier(${produit.id})"
            >
                🛒 Ajouter au panier
            </button>

        </div>
    `;

    productsContainer.appendChild(productCard);
});


// =========================
// AJOUTER AU PANIER
// =========================

function ajouterAuPanier(id) {

    const produit = produits.find(p => p.id === id);

    const existe = panier.find(p => p.id === id);

if (existe && existe.quantite >= produit.stock) {
    alert("⚠️ Stock maximum disponible : " + produit.stock + " unités.");
    return;
}

    if (existe) {

        existe.quantite++;

    } else {

        panier.push({
            ...produit,
            quantite: 1
        });
    }

    mettreAJourPanier();
    afficherPanier();

}


// =========================
// AFFICHER LE PANIER
// =========================

function afficherPanier() {

    cartOverlay.style.display = "flex";

    cartItems.innerHTML = "";

    if (panier.length === 0) {

        cartItems.innerHTML = `
            <p>Ton panier est vide 🛒</p>
        `;

        cartTotal.textContent = "0 FCFA";

        return;
    }

    let total = 0;

    panier.forEach((produit) => {

        const sousTotal =
            produit.prix * produit.quantite;

        total += sousTotal;

        const item = document.createElement("div");

        item.className = "cart-item";

        item.innerHTML = `
            <h3>${produit.nom}</h3>

            <p>
                ${produit.prix} FCFA
            </p>

            <div class="quantity-buttons">

                <button onclick="modifierQuantite(${produit.id}, -1)">
                    −
                </button>

                <strong>
                    ${produit.quantite}
                </strong>

<small>
    📦 Stock : ${produit.stock}
</small>

                <button onclick="modifierQuantite(${produit.id}, 1)">
                    +
                </button>

            </div>

            <button 
                class="remove-button"
                onclick="supprimerDuPanier(${produit.id})"
            >
                Supprimer
            </button>
        `;

        cartItems.appendChild(item);

    });

    cartTotal.textContent = total + " FCFA";
}


// =========================
// MODIFIER QUANTITÉ
// =========================

function modifierQuantite(id, changement) {

    const produit = panier.find(p => p.id === id);

    if (!produit) return;

    produit.quantite += changement;

if (produit.quantite > produit.stock) {
    produit.quantite = produit.stock;

    alert(
        "⚠️ Stock maximum disponible : " +
        produit.stock +
        " unités."
    );

    mettreAJourPanier();
    afficherPanier();
    return;
}

    if (produit.quantite <= 0) {

        panier = panier.filter(p => p.id !== id);
    }

    mettreAJourPanier();
    afficherPanier();
}


// =========================
// SUPPRIMER DU PANIER
// =========================

function supprimerDuPanier(id) {

    panier = panier.filter(p => p.id !== id);

    mettreAJourPanier();
    afficherPanier();
}


// =========================
// COMPTEUR DU PANIER
// =========================

function mettreAJourPanier() {

    const totalArticles = panier.reduce(
        (total, produit) =>
            total + produit.quantite,
        0
    );

    cartCount.textContent = totalArticles;

    localStorage.setItem(
        "flashtchi_panier",
        JSON.stringify(panier)
    );
}


// =========================
// OUVRIR LE PANIER
// =========================

cartButton.addEventListener("click", () => {

    afficherPanier();

});


// =========================
// FERMER LE PANIER
// =========================

closeCart.addEventListener("click", () => {

    cartOverlay.style.display = "none";

});


// Fermer en cliquant à côté du panier

cartOverlay.addEventListener("click", (event) => {

    if (event.target === cartOverlay) {

        cartOverlay.style.display = "none";
    }// =========================
// OUVRIR LE FORMULAIRE
// =========================

checkoutButton.addEventListener("click", () => {

    if (panier.length === 0) {

        alert("Ton panier est vide 🛒");

        return;
    }

    const produit = panier[0];

    document.getElementById("orderProduct").textContent =
        produit.nom;

    document.getElementById("orderQuantity").textContent =
        produit.quantite;

    const total = panier.reduce(
        (somme, produit) =>
            somme + produit.prix * produit.quantite,
        0
    );

    document.getElementById("orderTotal").textContent =
        total + " FCFA";

    orderOverlay.style.display = "flex";

});


// =========================
// FERMER LE FORMULAIRE
// =========================

closeOrder.addEventListener("click", () => {

    orderOverlay.style.display = "none";

});


// Fermer en cliquant à l'extérieur

orderOverlay.addEventListener("click", (event) => {

    if (event.target === orderOverlay) {

        orderOverlay.style.display = "none";
    }

});

});

// =========================
// ENVOYER LA COMMANDE WHATSAPP
// =========================

orderForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const nom =
        document.getElementById("customerName").value.trim();

    const telephone =
        document.getElementById("customerPhone").value.trim();

    const adresse =
        document.getElementById("customerAddress").value.trim();

    const ville =
        document.getElementById("customerCity").value.trim();

    if (panier.length === 0) {

        alert("Ton panier est vide 🛒");

        return;
    }

    let total = 0;

    let produitsMessage = "";

    panier.forEach((produit) => {

        const sousTotal =
            produit.prix * produit.quantite;

        total += sousTotal;

        produitsMessage +=
            `• ${produit.nom} x${produit.quantite} = ${sousTotal} FCFA\n`;
    });


    const message =
        `Bonjour FLASHTCHI03 👋\n\n` +
        `📦 *NOUVELLE COMMANDE*\n\n` +
        `👤 Nom : ${nom}\n` +
        `📞 Téléphone : ${telephone}\n` +
        `📍 Adresse : ${adresse}\n` +
        `🏙️ Ville : ${ville}\n\n` +
        `🛍️ PRODUIT(S) :\n` +
        `${produitsMessage}\n` +
        `💰 *TOTAL : ${total} FCFA*\n\n` +
        `Merci. Je souhaite confirmer cette commande. ⚡`;


    // ⚠️ REMPLACE CE NUMÉRO PAR TON NUMÉRO WHATSAPP BUSINESS
    const numeroWhatsApp = "221769260512";


    const url =
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`;


    window.open(url, "_blank");

});
// =========================
// OUVRIR LA FICHE PRODUIT
// =========================

function ouvrirProduit(id) {

    const produit = produits.find(p => p.id === id);

    if (!produit) return;

    produitDetailActuel = produit;

    detailImage.src = produit.image;
    detailName.textContent = produit.nom;
    detailDescription.textContent = produit.description;
detailStock.textContent =
    "📦 Stock disponible : " + produit.stock + " unités";
    detailPrice.textContent =
        produit.prix + " FCFA";

    productOverlay.style.display = "flex";
}


// =========================
// AJOUTER DEPUIS LA FICHE
// =========================

detailCartButton.addEventListener("click", () => {

    if (!produitDetailActuel) return;

    ajouterAuPanier(produitDetailActuel.id);

    productOverlay.style.display = "none";
});

buyNowButton.addEventListener("click", () => {

    if (!produitDetailActuel) return;

    ajouterAuPanier(produitDetailActuel.id);

    productOverlay.style.display = "none";

    checkoutButton.click();
});


// =========================
// FERMER LA FICHE
// =========================

closeProduct.addEventListener("click", () => {

    productOverlay.style.display = "none";
});


productOverlay.addEventListener("click", (event) => {

    if (event.target === productOverlay) {

        productOverlay.style.display = "none";
    }
});
// =========================
// MENU MOBILE
// =========================

const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");

menuButton.addEventListener("click", () => {

    navigation.classList.toggle("active");

});
const navigationLinks =
    navigation.querySelectorAll("a");

navigationLinks.forEach((link) => {

    link.addEventListener("click", () => {

        navigation.classList.remove("active");

    });

});