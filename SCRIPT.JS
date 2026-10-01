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
const colorOptions = document.getElementById("colorOptions");
const selectedColor = document.getElementById("selectedColor");

let couleurSelectionnee = null;
const buyNowButton = document.getElementById("buyNowButton");
let produitDetailActuel = null;
function formaterPrix(prix) {
    return prix.toLocaleString("fr-FR") + " FCFA";
}
function formaterPrix(prix) {
    return prix.toLocaleString("fr-FR") + " FCFA";
}
const checkoutButton = document.getElementById("checkoutButton");
const orderOverlay = document.getElementById("orderOverlay");
const closeOrder = document.getElementById("closeOrder");
const orderForm = document.getElementById("orderForm");

// =========================
// AFFICHER LES PRODUITS
// =========================

console.log("SCRIPT.JS chargé");
console.log("Produits disponibles :", produits);

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
    loading="lazy"
    decoding="async"
    onerror="this.src='https://placehold.co/600x600/f5f5f5/666666?text=FLASHTCHI03'"
>

<div class="stock-badge ${produit.stock <= 0 ? "out-of-stock" : ""}">
    ${produit.stock > 0
        ? `🟢 EN STOCK : ${produit.stock} unités`
        : "🔴 RUPTURE DE STOCK"}
</div>
<div class="product-info">

        <div class="product-info">

          <h3>${produit.nom}</h3>

<p>
    🎨 Couleur : <strong>${produit.couleur || "Non sélectionnée"}</strong>
</p>



            <p class="product-description">
                ${produit.description}
            </p>

           <div class="product-price">${formaterPrix(produit.prix)}</div>

          <button
    class="product-button"onclick="ouvrirProduit(${produit.id})"
        ${produit.stock <= 0 ? "disabled" : ""}
>
    ${produit.stock > 0
        ? "🛒 Ajouter au panier"
        : "🔴 Rupture de stock"}
</button>
        </div>
    `;

    productsContainer.appendChild(productCard);
});


// =========================
// AJOUTER AU PANIER
// =========================

function ajouterAuPanier(id, couleur = null) {

    const produit = produits.find(p => p.id === id);

    if (!produit) return;

    const existe = panier.find(
        p => p.id === id && p.couleur === couleur
    );

    if (produit.stock <= 0) {
        alert("❌ Ce produit est actuellement en rupture de stock.");
        return;
    }

    if (existe && existe.quantite >= produit.stock) {
        alert(
            "⚠️ Stock maximum disponible : " +
            produit.stock +
            " unités."
        );
        return;
    }

    if (existe) {

        existe.quantite++;

    } else {

        panier.push({
            ...produit,
            couleur: couleur,
            quantite: 1
        });

    }

    mettreAJourPanier();

    alert("✅ Produit ajouté au panier.");

}


// =========================
// AFFICHER LE PANIER
// =========================

 function afficherPanier() {

    cartItems.innerHTML = "";

    if (panier.length === 0) {

        cartItems.innerHTML = "<p>🛒 Ton panier est vide</p>";
        cartTotal.textContent = "0 FCFA";

        cartOverlay.style.setProperty("display", "flex", "important");

        return;
    }

    panier.forEach((produit) => {

        const item = document.createElement("div");

        item.className = "cart-item";

        item.innerHTML = `

        <h3>${produit.nom}</h3>

       <p class="cart-color">
    🎨 Couleur :
    <span class="color-badge ${produit.couleur ? produit.couleur.toLowerCase() : ""}">
        ${produit.couleur || "Non choisie"}
    </span>
</p>

        <p>
        Prix : ${formaterPrix(produit.prix)}
        </p>

        <p>
        Quantité : ${produit.quantite}
        </p>

        <button onclick="modifierQuantite(${produit.id}, '${produit.couleur}', -1)">
        -
        </button>

        <button onclick="modifierQuantite(${produit.id}, '${produit.couleur}', 1)">
        +
        </button>

        <button onclick="supprimerDuPanier(${produit.id}, '${produit.couleur}')">
        ❌ Supprimer
        </button>

        `;

        cartItems.appendChild(item);

    });

    const total = panier.reduce(
        (somme, produit) =>
            somme + produit.prix * produit.quantite,
        0
    );

    cartTotal.textContent = formaterPrix(total);

    cartOverlay.style.setProperty("display", "flex", "important");

}   

// =========================
// MODIFIER QUANTITÉ
// =========================

function modifierQuantite(id, couleur, changement) {

    const produit = panier.find(
        p => p.id === id && p.couleur === couleur
    );

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

        panier = panier.filter(
            p => !(p.id === id && p.couleur === couleur)
        );
    }

    mettreAJourPanier();
    afficherPanier();
}


// =========================
// SUPPRIMER DU PANIER
// =========================

function supprimerDuPanier(id, couleur) {

    panier = panier.filter(
        p => !(p.id === id && p.couleur === couleur)
    );

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

    console.log("BOUTON PANIER CLIQUÉ");

    afficherPanier();

    cartOverlay.style.setProperty("display", "flex", "important");

    console.log("DISPLAY APRÈS :", cartOverlay.style.display);

});

// =========================
// FERMER LE PANIER
// =========================

closeCart.addEventListener("click", () => {

    cartOverlay.style.display = "none";

});


// Fermer en cliquant à côté du panier


// =========================
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

    const quantiteTotale = panier.reduce(
        (total, produit) =>
            total + produit.quantite,
        0
    );

    document.getElementById("orderQuantity").textContent =
        quantiteTotale;

    const total = panier.reduce(
        (somme, produit) =>
            somme + produit.prix * produit.quantite,
        0
    );

    orderTotal.textContent = formaterPrix(total);

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

// =========================
// ENVOYER LA COMMANDE WHATSAPP
// =========================

orderForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const nom =
        document.getElementById("customerName").value.trim();

if (nom.length < 2) {
    alert("⚠️ Entre ton nom et prénom.");
    return;
}

    const telephone =
        document.getElementById("customerPhone").value.trim();

if (telephone.length < 8) {
    alert("⚠️ Entre un numéro WhatsApp valide.");
    return;
}

    const adresse =
        document.getElementById("customerAddress").value.trim();

if (adresse.length < 3) {
    alert("⚠️ Entre ton adresse ou ton quartier.");
    return;
}

    const ville =
        document.getElementById("customerCity").value.trim();

if (ville.length < 2) {
    alert("⚠️ Entre ta ville.");
    return;
}

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
    `• ${produit.nom} — ${produit.couleur || "Couleur non précisée"} x${produit.quantite} = ${formaterPrix(sousTotal)}\n`;
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
        `💰 *TOTAL : ${formaterPrix(total)}*\n\n` +
        `Merci. Je souhaite confirmer cette commande. ⚡`;


    // ⚠️ REMPLACE CE NUMÉRO PAR TON NUMÉRO WHATSAPP BUSINESS
    const numeroWhatsApp = "221771046520";


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
        formaterPrix(produit.prix);

    // =========================
    // COULEURS
    // =========================

    couleurSelectionnee = null;

    selectedColor.textContent =
        "Aucune couleur sélectionnée";

    colorOptions.innerHTML = "";

    (produit.couleurs || []).forEach((couleur) => {

        const conteneur = document.createElement("div");
        conteneur.className = "color-choice";

        const bouton = document.createElement("button");

        bouton.type = "button";
        bouton.className = "color-option";

        bouton.dataset.color = couleur;
        bouton.title = couleur;
        bouton.setAttribute("aria-label", couleur);

        bouton.addEventListener("click", () => {

            couleurSelectionnee = couleur;

            selectedColor.textContent =
                "Couleur choisie : " + couleur;

            document
                .querySelectorAll(".color-option")
                .forEach((btn) => {
                    btn.classList.remove("selected");
                });

            bouton.classList.add("selected");
        });

        const nomCouleur = document.createElement("span");

        nomCouleur.className = "color-name";
        nomCouleur.textContent = couleur;

        conteneur.appendChild(bouton);
        conteneur.appendChild(nomCouleur);

        colorOptions.appendChild(conteneur);

    });

    detailCartButton.disabled =
        produit.stock <= 0;

    productOverlay.style.display = "flex";

}


// =========================
// AJOUTER DEPUIS LA FICHE
// =========================

detailCartButton.addEventListener("click", () => {

    if (!produitDetailActuel) return;

    if (!couleurSelectionnee) {

        alert(
            "⚠️ Choisis une couleur avant d'ajouter le produit au panier."
        );

        return;
    }

    ajouterAuPanier(
        produitDetailActuel.id,
        couleurSelectionnee
    );

    productOverlay.style.display = "none";

});


// =========================
// ACHETER MAINTENANT
// =========================

buyNowButton.addEventListener("click", () => {

    if (!produitDetailActuel) return;

    if (!couleurSelectionnee) {

        alert(
            "⚠️ Choisis une couleur avant de continuer."
        );

        return;
    }

    ajouterAuPanier(
        produitDetailActuel.id,
        couleurSelectionnee
    );

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

// =========================
// RETOUR EN HAUT
// =========================

const backToTop = document.getElementById("backToTop");

if (backToTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }

    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}



    















   