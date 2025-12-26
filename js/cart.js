// ============================================
// CART MANAGEMENT
// ============================================

const STORAGE_KEY = 'gazonpro_cart';

class Cart {
    constructor() {
        this.items = this.loadFromStorage();
    }

    // Load cart from localStorage
    loadFromStorage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    // Save cart to localStorage
    saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    }

    // Add item to cart
    addItem(productId, quantity = 1) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.saveToStorage();
        this.updateUI();
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateUI();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.updateUI();
            }
        }
    }

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get item count
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Clear cart
    clear() {
        this.items = [];
        this.saveToStorage();
        this.updateUI();
    }

    // Update UI elements
    updateUI() {
        updateCartCount();
        renderCartItems();
        updateCartTotal();
    }
}

// Initialize cart
const cart = new Cart();

// ============================================
// UI FUNCTIONS
// ============================================

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.getItemCount();
    }
}

function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');

    if (!cartItems) return;

    if (cart.items.length === 0) {
        cartItems.style.display = 'none';
        emptyCart.style.display = 'block';
    } else {
        cartItems.style.display = 'flex';
        emptyCart.style.display = 'none';

        cartItems.innerHTML = cart.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item__image">
                <div class="cart-item__content">
                    <div class="cart-item__title">${item.name}</div>
                    <div class="cart-item__price">₸${item.price}/м²</div>
                    <div class="cart-item__controls">
                        <button class="cart-item__btn" onclick="decreaseCartItem(${item.id})">−</button>
                        <input type="number" class="cart-item__quantity" value="${item.quantity}" readonly>
                        <button class="cart-item__btn" onclick="increaseCartItem(${item.id})">+</button>
                        <button class="cart-item__btn" onclick="removeFromCart(${item.id})" style="background-color: #E74C3C; color: white;">✕</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function updateCartTotal() {
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        cartTotal.textContent = `${cart.getTotal()} ₸`;
    }
}

// ============================================
// CART ACTIONS
// ============================================

function addToCart(productId) {
    const quantityInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(quantityInput.value) || 1;
    
    cart.addItem(productId, quantity);
    
    // Reset quantity input
    quantityInput.value = 1;
    
    // Show feedback
    showNotification('Товар добавлен в корзину!');
}

function removeFromCart(productId) {
    cart.removeItem(productId);
    showNotification('Товар удален из корзины');
}

function increaseCartItem(productId) {
    const item = cart.items.find(i => i.id === productId);
    if (item) {
        cart.updateQuantity(productId, item.quantity + 1);
    }
}

function decreaseCartItem(productId) {
    const item = cart.items.find(i => i.id === productId);
    if (item && item.quantity > 1) {
        cart.updateQuantity(productId, item.quantity - 1);
    }
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.add('active');
        renderCartItems();
        updateCartTotal();
    }
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function goToCheckout() {
    if (cart.items.length === 0) {
        showNotification('Корзина пуста!');
        return;
    }
    window.location.href = 'pages/checkout.html';
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message) {
    // Simple notification (can be enhanced with toast library)
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const continueShopping = document.getElementById('continueShopping');
    const cartModal = document.getElementById('cartModal');

    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', goToCheckout);
    }

    if (continueShopping) {
        continueShopping.addEventListener('click', closeCart);
    }

    // Close modal when clicking outside
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeCart();
            }
        });
    }

    // Initialize cart UI
    updateCartCount();
    renderCartItems();
});
