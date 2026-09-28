const products = [
    { id: 1, name: "Laptop", category: "Electronics", price: 55000 },
    { id: 2, name: "T-Shirt", category: "Clothing", price: 500 },
    { id: 3, name: "Running Shoes", category: "Shoes", price: 3000 },
    { id: 4, name: "Mouse", category: "Electronics", price: 800 },
    { id: 5, name: "Jeans", category: "Clothing", price: 1500 },
    { id: 6, name: "Keyboard", category: "Electronics", price: 1200 },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const priceInput = document.getElementById("price");
const sortSelect = document.getElementById("sort");
const cartItemsDiv = document.getElementById("cart-items");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cart-count");
const emptyState = document.getElementById("empty-state");

// Render Product Cards
function renderProducts(list) {
    productList.innerHTML = "";
    if (list.length === 0) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";
    list.forEach(p => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <h3>${p.name}</h3>
            <p>${p.category}</p>
            <p class="price">₹${p.price}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        `;
        productList.appendChild(div);
    });
}

// Filter + Search + Sort
function filterAndSort() {
    let filtered = [...products];
    const search = searchInput.value.toLowerCase();
    const cat = categorySelect.value;
    const maxPrice = parseInt(priceInput.value);
    const sort = sortSelect.value;

    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
    if (cat !== "all") filtered = filtered.filter(p => p.category === cat);
    if (!isNaN(maxPrice) && maxPrice > 0) filtered = filtered.filter(p => p.price <= maxPrice);

    if (sort === "low-high") filtered.sort((a,b) => a.price - b.price);
    if (sort === "high-low") filtered.sort((a,b) => b.price - a.price);
    if (sort === "name") filtered.sort((a,b) => a.name.localeCompare(b.name));

    renderProducts(filtered);
}

// Cart Functions
function addToCart(id) {
    const item = cart.find(c => c.id === id);
    if (item) {
        item.qty++;
    } else {
        const prod = products.find(p => p.id === id);
        cart.push({...prod, qty: 1});
    }
    saveAndRenderCart();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveAndRenderCart();
}

function updateQty(id, change) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += change;
    if (item.qty <= 0) removeFromCart(id);
    else saveAndRenderCart();
}

function emptyCart() {
    cart = [];
    saveAndRenderCart();
}

function saveAndRenderCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    cartItemsDiv.innerHTML = "";
    let total = 0;
    let count = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;
        const div = document.createElement("div");
        div.innerHTML = `
            <span>${item.name} (₹${item.price})</span>
            <span>
                <button onclick="updateQty(${item.id}, -1)">-</button>
                ${item.qty}
                <button onclick="updateQty(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </span>
        `;
        cartItemsDiv.appendChild(div);
    });
    cartTotal.innerText = total;
    cartCount.innerText = count;
    if(cart.length === 0) cartItemsDiv.innerHTML = "<p>Cart is empty</p>";
}

// Event Listeners
searchInput.addEventListener("input", filterAndSort);
categorySelect.addEventListener("change", filterAndSort);
priceInput.addEventListener("input", filterAndSort);
sortSelect.addEventListener("change", filterAndSort);
document.getElementById("empty-cart-btn").addEventListener("click", emptyCart);

// Initial render
renderProducts(products);
renderCart();