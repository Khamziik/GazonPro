// ============================================
// PRODUCTS DATA
// ============================================

const PRODUCTS = [
    {
        id: 1,
        name: 'Премиум зелень',
        description: 'Высокий ворс, натуральный вид, идеален для активного использования',
        price: 850,
        image: 'images/product-showcase-1.jpg',
        specs: [
            'Высота ворса: 40мм',
            'Плотность: 16000 стежков/м²',
            'Дренаж: да'
        ]
    },
    {
        id: 2,
        name: 'Садовая классика',
        description: 'Универсальный газон для любых целей, отличное соотношение цены и качества',
        price: 650,
        image: 'images/product-showcase-2.jpg',
        specs: [
            'Высота ворса: 35мм',
            'Плотность: 14000 стежков/м²',
            'Дренаж: да'
        ]
    },
    {
        id: 3,
        name: 'Спортивный газон',
        description: 'Для спортивных площадок и активных игр, максимальная прочность',
        price: 1200,
        image: 'images/product-showcase-1.jpg',
        specs: [
            'Высота ворса: 50мм',
            'Плотность: 18000 стежков/м²',
            'Дренаж: усиленный'
        ]
    },
    {
        id: 4,
        name: 'Мини-газон',
        description: 'Компактный рулон для маленьких участков и балконов',
        price: 550,
        image: 'images/product-showcase-2.jpg',
        specs: [
            'Высота ворса: 25мм',
            'Плотность: 12000 стежков/м²',
            'Дренаж: да'
        ]
    }
];

// ============================================
// RENDER PRODUCTS
// ============================================

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;

    productsGrid.innerHTML = PRODUCTS.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-card__image">
            <div class="product-card__content">
                <h3 class="product-card__title">${product.name}</h3>
                <p class="product-card__description">${product.description}</p>
                <ul class="product-card__specs">
                    ${product.specs.map(spec => `<li>${spec}</li>`).join('')}
                </ul>
                <div class="product-card__price">₸${product.price}</div>
                <div class="product-card__quantity">
                    <button class="product-card__quantity-btn" onclick="decreaseQuantity(${product.id})">−</button>
                    <input type="number" class="product-card__quantity-input" id="qty-${product.id}" value="1" min="1" readonly>
                    <button class="product-card__quantity-btn" onclick="increaseQuantity(${product.id})">+</button>
                </div>
                <button class="btn btn--primary product-card__btn" onclick="addToCart(${product.id})">
                    Добавить в корзину
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// QUANTITY CONTROLS
// ============================================

function increaseQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
});
