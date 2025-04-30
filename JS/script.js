document.addEventListener("DOMContentLoaded", () => {
  setupAddToCartButtons();
  updateCartCount();
  setupSearchFilter();
  initContactForm();

  initNewsletterForm();

  if (document.getElementById("fullCartItems")) {
    renderFullCartIfNeeded();
    setupClearCartButton();
  }
});




// Hamburger toggle

  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }



// 🔹 Add to Cart Logic
function setupAddToCartButtons() {
  const buttons = document.querySelectorAll(".add-to-cart");

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const card = button.closest(".book-card");
      const title = card.querySelector("h4").innerText;
      const price = parseFloat(card.querySelector(".price").innerText.replace("$", ""));
      const id = `${title.toLowerCase().replace(/\s+/g, "-")}-${index}`;

      const cart = JSON.parse(localStorage.getItem("cart")) || {};

      cart[id] = cart[id]
        ? { ...cart[id], quantity: cart[id].quantity + 1 }
        : { title, price, quantity: 1 };

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      showToast(`✅ Added "${title}" to cart`);

      button.textContent = "Added!";
      button.disabled = true;
      setTimeout(() => {
        button.textContent = "Add to Cart";
        button.disabled = false;
      }, 1000);
    });
  });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}


// 🔹 Cart Rendering
function renderFullCartIfNeeded() {
  const container = document.getElementById("fullCartItems");
  const totalEl = document.getElementById("fullCartTotal");

  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  container.innerHTML = "";
  let total = 0;

  if (!Object.keys(cart).length) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.textContent = "0.00";
    return;
  }

  Object.entries(cart).forEach(([id, item]) => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <div>
        <strong>${item.title}</strong><br>
        <div class="quantity-controls">
          <button class="qty-btn" data-id="${id}" data-action="decrease">-</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" data-id="${id}" data-action="increase">+</button>
        </div>
      </div>
      <div>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
        <button class="remove-item" data-id="${id}">✖</button>
      </div>`;
    container.appendChild(itemEl);
    total += item.price * item.quantity;
  });

  totalEl.textContent = total.toFixed(2);
  attachCartEventHandlers();
}

function setupClearCartButton() {
  const clearBtn = document.getElementById("clearCartPage");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("cart");
      renderFullCartIfNeeded();
      updateCartCount();
      showToast("🧹 Cart cleared");
    });
  }
}

function attachCartEventHandlers() {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      delete cart[button.dataset.id];
      localStorage.setItem("cart", JSON.stringify(cart));
      renderFullCartIfNeeded();
      updateCartCount();
      showToast("❌ Item removed");
    });
  });

  document.querySelectorAll(".qty-btn").forEach((button) => {
    const id = button.dataset.id;
    const action = button.dataset.action;

    button.addEventListener("click", () => {
      if (action === "increase") {
        cart[id].quantity++;
      } else {
        cart[id].quantity--;
        if (cart[id].quantity <= 0) delete cart[id];
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      renderFullCartIfNeeded();
      updateCartCount();
    });
  });
}


// 🔹 Search Filter
function setupSearchFilter() {
  const searchBox = document.getElementById("searchBox");
  const books = document.querySelectorAll(".book-card");

  if (!searchBox || books.length === 0) return;

  searchBox.addEventListener("input", () => {
    const term = searchBox.value.toLowerCase();
    books.forEach((book) => {
      const title = book.querySelector("h4")?.innerText.toLowerCase() || "";
      book.classList.toggle("hidden", !title.includes(term));
    });
  });
}


// 🔹 Contact Form
function initContactForm() {
  const form = document.getElementById("contactForm");
  const response = document.getElementById("formResponse");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!fullName || !email || !subject || !message) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("📬 Contact submitted:", { fullName, email, subject, message });

    form.reset();
    response.classList.remove("hidden");
    setTimeout(() => response.classList.add("hidden"), 5000);
  });
}



// 🔹 Newsletter Logic
function initNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  const msg = document.getElementById("newsletterMsg");

  if (!form || !msg) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail").value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      msg.textContent = "❌ Please enter a valid email address.";
      msg.style.color = "#d32f2f";
      msg.classList.remove("hidden");
      return;
    }

    console.log("📬 Subscribed:", email);
    form.reset();
    msg.textContent = "✅ Thank you for subscribing!";
    msg.style.color = "#2e7d32";
    msg.classList.remove("hidden");
    setTimeout(() => msg.classList.add("hidden"), 4000);
  });
}


// 🔹 Toast Notification
function showToast(message, duration = 2500) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}


document.body.addEventListener('keydown', e => {
  const target = e.target;
  if ((target.matches('[tabindex][role="button"], [tabindex][role="link"], button, a')) && (e.key === 'Enter' || e.key === ' ')) {
    target.click(); // Trigger click
  }
});
