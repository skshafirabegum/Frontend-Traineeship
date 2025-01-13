const API_URL = 'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889';

const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');

let cartData = [];

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount / 100);
};

const calculateTotals = () => {
    const subtotal = cartData.reduce((acc, item) => acc + item.quantity * item.price, 0);
    subtotalElement.textContent = formatCurrency(subtotal);
    totalElement.textContent = formatCurrency(subtotal);
};

const renderCartItems = () => {
    cartItemsContainer.innerHTML = '<h2>Your Cart</h2>';

    cartData.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>${formatCurrency(item.price)}</p>
            </div>
            <div class="cart-item-quantity">
                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
            </div>
            <div class="cart-item-remove" data-id="${item.id}">🗑️</div>
        `;

        cartItemsContainer.appendChild(itemElement);
    });
};

const fetchCartData = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        cartData = data.items;
        renderCartItems();
        calculateTotals();
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
};

cartItemsContainer.addEventListener('change', (e) => {
    if (e.target.type === 'number') {
        const id = e.target.dataset.id;
        const newQuantity = parseInt(e.target.value);
        const item = cartData.find(item => item.id == id);
        if (item) {
            item.quantity = newQuantity;
            calculateTotals();
        }
    }
});

cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-item-remove')) {
        const id = e.target.dataset.id;
        cartData = cartData.filter(item => item.id != id);
        renderCartItems();
        calculateTotals();
    }
});

fetchCartData();

const navLinks = document.querySelectorAll('header nav a');
const setActiveNavLink = (clickedLink) => {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    clickedLink.classList.add('active');
};

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        setActiveNavLink(e.target);
    });
});

