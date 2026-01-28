// Simple product data (could come from a database in a real app)
const PRODUCTS = [
  {
    id: "html-css",
    title: "HTML & CSS Essentials",
    description: "Learn how to build beautiful, responsive websites from scratch using only HTML and CSS.",
    level: "Beginner",
    duration: "6 hours",
    price: 19,
  },
  {
    id: "js-basics",
    title: "JavaScript Basics",
    description: "Understand variables, functions, loops and the DOM with hands-on examples.",
    level: "Beginner",
    duration: "8 hours",
    price: 29,
  },
  {
    id: "frontend-mini",
    title: "Mini Frontend Projects",
    description: "Build 5 tiny real-world projects to practice layout, forms and interactivity.",
    level: "Beginner–Intermediate",
    duration: "10 hours",
    price: 39,
  },
  {
    id: "node-express",
    title: "Node.js & Express Starter",
    description: "Create simple APIs and understand how backend and frontend talk to each other.",
    level: "Intermediate",
    duration: "7 hours",
    price: 34,
  },
];

// --- Cart helpers (stored in localStorage so all pages share the same cart) ---

const CART_KEY = "mini_shop_cart";

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function findProduct(productId) {
  return PRODUCTS.find((p) => p.id === productId);
}

function addToCart(productId) {
  const product = findProduct(productId);
  if (!product) return;

  const cart = readCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
  alert(`Added "${product.title}" to cart.`);
}

function updateQuantity(productId, newQty) {
  const cart = readCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  if (newQty <= 0) {
    const filtered = cart.filter((i) => i.id !== productId);
    saveCart(filtered);
  } else {
    item.quantity = newQty;
    saveCart(cart);
  }
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

function getCartDetails() {
  const cart = readCart();
  const detailedItems = cart
    .map((item) => {
      const product = findProduct(item.id);
      if (!product) return null;
      return {
        ...product,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      };
    })
    .filter(Boolean);

  const total = detailedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const count = detailedItems.reduce((sum, item) => sum + item.quantity, 0);

  return { items: detailedItems, total, count };
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// --- Page-specific render functions ---

function initProductsPage() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = "";

  PRODUCTS.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-tag">Course</div>
      <h3 class="product-title">${product.title}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-meta">
        <span><strong>${product.level}</strong></span>
        <span>${product.duration}</span>
      </div>
      <div class="product-footer">
        <span class="price">${formatCurrency(product.price)}</span>
        <button class="btn btn-primary small" data-add-to-cart="${product.id}">
          + Add to cart
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.matches("button[data-add-to-cart]")) {
      const productId = target.getAttribute("data-add-to-cart");
      addToCart(productId);
    }
  });
}

function initCartPage() {
  const list = document.getElementById("cartItems");
  const countSpan = document.getElementById("cartItemCount");
  const totalSpan = document.getElementById("cartTotal");
  const goToCheckoutBtn = document.getElementById("goToCheckoutBtn");
  if (!list || !countSpan || !totalSpan) return;

  function renderCart() {
    const { items, total, count } = getCartDetails();
    countSpan.textContent = String(count);
    totalSpan.textContent = formatCurrency(total);

    list.innerHTML = "";

    if (items.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          Your cart is empty. Go back to the products page and add a course!
        </div>
      `;
      if (goToCheckoutBtn) {
        goToCheckoutBtn.classList.add("btn-secondary");
        goToCheckoutBtn.classList.remove("btn-primary");
      }
      return;
    }

    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div>
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-meta">${formatCurrency(item.price)} each • ${item.level}</div>
        </div>
        <div>
          <div class="quantity-controls" data-id="${item.id}">
            <button type="button" data-action="decrease">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase">+</button>
          </div>
        </div>
        <div style="text-align:right;">
          <div>${formatCurrency(item.lineTotal)}</div>
          <button class="btn btn-ghost small" data-remove="${item.id}">Remove</button>
        </div>
      `;
      list.appendChild(row);
    });

    if (goToCheckoutBtn) {
      goToCheckoutBtn.classList.remove("btn-secondary");
      goToCheckoutBtn.classList.add("btn-primary");
    }
  }

  list.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const removeId = target.getAttribute("data-remove");
    if (removeId) {
      updateQuantity(removeId, 0);
      renderCart();
      return;
    }

    const action = target.getAttribute("data-action");
    if (!action) return;

    const controls = target.closest(".quantity-controls");
    if (!controls) return;
    const productId = controls.getAttribute("data-id");
    const span = controls.querySelector("span");
    if (!productId || !span) return;

    let current = parseInt(span.textContent || "1", 10);
    if (action === "decrease") current -= 1;
    if (action === "increase") current += 1;
    updateQuantity(productId, current);
    renderCart();
  });

  renderCart();
}

function initCheckoutPage() {
  const itemsContainer = document.getElementById("checkoutItems");
  const totalSpan = document.getElementById("checkoutTotal");
  const form = document.getElementById("checkoutForm");
  const message = document.getElementById("checkoutMessage");
  if (!itemsContainer || !totalSpan || !form || !message) return;

  function renderSummary() {
    const { items, total } = getCartDetails();
    itemsContainer.innerHTML = "";

    if (items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="empty-state">
          Your cart is empty. Add something from the products page first.
        </div>
      `;
      totalSpan.textContent = formatCurrency(0);
      return;
    }

    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "checkout-item-row";
      row.innerHTML = `
        <span>${item.title} × ${item.quantity}</span>
        <span>${formatCurrency(item.lineTotal)}</span>
      `;
      itemsContainer.appendChild(row);
    });

    totalSpan.textContent = formatCurrency(total);
  }

  renderSummary();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";
    message.classList.remove("success", "error");

    const { items, total } = getCartDetails();
    if (items.length === 0) {
      message.textContent = "Your cart is empty. Please add at least one course.";
      message.classList.add("error");
      return;
    }

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      address: formData.get("address"),
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
      total,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      message.textContent = data.message || "Order placed successfully!";
      message.classList.add("success");

      clearCart();
      renderSummary();
      form.reset();
    } catch (err) {
      console.error(err);
      message.textContent = "Something went wrong while placing your order. Please try again.";
      message.classList.add("error");
    }
  });
}

// --- Shared initialisation ---

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  const page = document.body.getAttribute("data-page");
  if (page === "products") initProductsPage();
  if (page === "cart") initCartPage();
  if (page === "checkout") initCheckoutPage();
});

