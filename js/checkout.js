// ============================================
// CHECKOUT PAGE FUNCTIONALITY
// ============================================

// Generate order number
function generateOrderNumber() {
    return 'ГП-' + Math.floor(100000 + Math.random() * 900000);
}

// Render order items on checkout page
function renderOrderItems() {
    const orderItems = document.getElementById('orderItems');
    if (!orderItems) return;

    if (cart.items.length === 0) {
        orderItems.innerHTML = '<p style="text-align: center; color: #7F8C8D;">Корзина пуста</p>';
        return;
    }

    orderItems.innerHTML = cart.items.map(item => `
        <div class="order-item">
            <div class="order-item__info">
                <div class="order-item__name">${item.name}</div>
                <div class="order-item__quantity">× ${item.quantity} м²</div>
            </div>
            <div class="order-item__price">₸${item.price * item.quantity}</div>
        </div>
    `).join('');
}

// Update order total on checkout page
function updateOrderTotal() {
    const orderTotal = document.getElementById('orderTotal');
    if (orderTotal) {
        orderTotal.textContent = `${cart.getTotal()} ₸`;
    }
}

// Format phone number
function formatPhoneNumber(value) {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as +7 (XXX) XXX-XX-XX
    if (digits.length === 0) return '';
    if (digits.length <= 1) return '+' + digits;
    if (digits.length <= 4) return '+' + digits.slice(0, 1) + ' (' + digits.slice(1);
    if (digits.length <= 7) return '+' + digits.slice(0, 1) + ' (' + digits.slice(1, 4) + ') ' + digits.slice(4);
    return '+' + digits.slice(0, 1) + ' (' + digits.slice(1, 4) + ') ' + digits.slice(4, 7) + '-' + digits.slice(7, 9) + '-' + digits.slice(9, 11);
}

// ============================================
// FORM SUBMISSION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Render order items and total
    renderOrderItems();
    updateOrderTotal();
    updateCartCount();

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            e.target.value = formatPhoneNumber(e.target.value);
        });
    }

    // Form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate form
            if (!this.checkValidity()) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }

            // Validate cart is not empty
            if (cart.items.length === 0) {
                alert('Корзина пуста!');
                return;
            }

            // Collect form data
            const formData = {
                orderNumber: generateOrderNumber(),
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                delivery: document.querySelector('input[name="delivery"]:checked').value,
                payment: document.querySelector('input[name="payment"]:checked').value,
                comments: document.getElementById('comments').value,
                items: cart.items,
                total: cart.getTotal(),
                date: new Date().toISOString()
            };

            // Save order to localStorage
            saveOrder(formData);

            // Clear cart
            cart.clear();

            // Redirect to confirmation page
            window.location.href = 'confirmation.html?orderNumber=' + formData.orderNumber;
        });
    }
});

// ============================================
// ORDER STORAGE
// ============================================

function saveOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem('gazonpro_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('gazonpro_orders', JSON.stringify(orders));
}

function getLastOrder() {
    const orders = JSON.parse(localStorage.getItem('gazonpro_orders') || '[]');
    return orders.length > 0 ? orders[orders.length - 1] : null;
}
