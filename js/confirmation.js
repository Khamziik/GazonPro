// ============================================
// CONFIRMATION PAGE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Get last order from localStorage
    const lastOrder = getLastOrder();

    if (!lastOrder) {
        // If no order found, redirect to home
        window.location.href = '../index.html';
        return;
    }

    // Populate confirmation details
    const orderNumber = document.getElementById('orderNumber');
    const orderAmount = document.getElementById('orderAmount');
    const paymentMethod = document.getElementById('paymentMethod');
    const deliveryMethod = document.getElementById('deliveryMethod');

    if (orderNumber) {
        orderNumber.textContent = lastOrder.orderNumber;
    }

    if (orderAmount) {
        orderAmount.textContent = `${lastOrder.total} ₸`;
    }

    if (paymentMethod) {
        const paymentText = lastOrder.payment === 'online' 
            ? 'Онлайн-оплата (Kaspi, карта)' 
            : 'Оплата при получении';
        paymentMethod.textContent = paymentText;
    }

    if (deliveryMethod) {
        const deliveryText = lastOrder.delivery === 'delivery' 
            ? 'Доставка' 
            : 'Самовывоз';
        deliveryMethod.textContent = deliveryText;
    }

    // Clear last order from localStorage after displaying
    setTimeout(() => {
        localStorage.removeItem('gazonpro_orders');
    }, 5000);
});

// Helper function to get last order
function getLastOrder() {
    const orders = JSON.parse(localStorage.getItem('gazonpro_orders') || '[]');
    return orders.length > 0 ? orders[orders.length - 1] : null;
}
