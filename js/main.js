let cart = [];

document.addEventListener("DOMContentLoaded", function() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", addToCart);
    });

    if (document.getElementById("cart-items")) {
        renderCart();
    }

    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", registerUser);
    }

    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", contactUs);
    }

    const checkoutForm = document.querySelector("form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", handleCheckout);
        checkoutForm.addEventListener("input", calculateShipping);
    }
});

function addToCart(event) {
    const productId = event.target.dataset.id;
    const productType = event.target.dataset.type;
    const product = {
        id: productId,
        name: `Product ${productId}`,
        price: 10.00,
        quantity: 1,
        type: productType
    };

    const productInCart = cart.find(item => item.id === productId);
    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.push(product);
    }

    renderCart();
}

function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";
    cart.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
            </td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </td>
        `;
        cartItemsContainer.appendChild(row);
    });

    const quantityInputs = document.querySelectorAll(".quantity-input");
    quantityInputs.forEach(input => {
        input.addEventListener("change", updateQuantity);
    });

    const removeButtons = document.querySelectorAll(".remove-item");
    removeButtons.forEach(button => {
        button.addEventListener("click", removeItem);
    });
}

function updateQuantity(event) {
    const productId = event.target.dataset.id;
    const productInCart = cart.find(item => item.id === productId);
    productInCart.quantity = parseInt(event.target.value);
    renderCart();
}

function removeItem(event) {
    const productId = event.target.dataset.id;
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    });
}

function contactUs(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    fetch('/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    });
}

function calculateShipping() {
    const postalCode = document.getElementById("postal-code").value;
    const shippingCostInput = document.getElementById("shipping-cost");

    let totalShippingCost = 0;

    cart.forEach(item => {
        if (item.type === 'physical') {
            totalShippingCost += 5.00; // Example flat rate per physical item
        }
    });

    if (postalCode.length === 5) { // Example condition for postal code
        totalShippingCost += 10.00; // Example additional cost based on postal code
    }

    shippingCostInput.value = `$${totalShippingCost.toFixed(2)}`;
}

function handleCheckout(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const card = document.getElementById("card").value;
    const paymentMethod = document.getElementById("payment-method").value;
    const shippingCost = parseFloat(document.getElementById("shipping-cost").value.replace('$', ''));

    fetch('/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, address, card, paymentMethod, shippingCost, cart })
    })
    .then(response => response.text())
    .then(data => {
        if (paymentMethod === 'paypal') {
            window.location.href = data;
        } else {
            alert(data);
        }
    });
}