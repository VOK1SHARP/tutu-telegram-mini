/* ===========================
   ГЛАВНЫЙ ФАЙЛ ПРИЛОЖЕНИЯ
   =========================== */

// Инициализация приложения
async function initApp() {
    console.log('[App] Инициализация приложения...');
    
    try {
        // Скрываем загрузчик
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }, 500);
        }
        
        // Показываем основной интерфейс
        showMainInterface();
        
        // Принудительно показываем приложение
        const app = document.getElementById('app');
        if (app) {
            app.style.display = 'block';
        }
        
        console.log('[App] Приложение запущено');
        
    } catch (error) {
        console.error('[App] Ошибка инициализации:', error);
        
        // Показываем сообщение об ошибке
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div style="padding: 40px 20px; text-align: center;">
                    <h2 style="color: #f44336;">Ошибка</h2>
                    <p>${error.message}</p>
                    <button onclick="window.location.reload()" 
                            style="padding: 10px 20px; background: #4CAF50; color: white; 
                                   border: none; border-radius: 8px; cursor: pointer;">
                        Обновить страницу
                    </button>
                </div>
            `;
            app.style.display = 'block';
        }
    }
}

// Показ основного интерфейса
function showMainInterface() {
    const app = document.getElementById('app');
    if (!app) return;
    
    app.innerHTML = `
        <div class="header">
            <div class="header-content">
                <div class="logo">
                    <div class="logo-icon"><i class="fas fa-leaf"></i></div>
                    <div class="logo-text">
                        <h1>ТИ•ТИ</h1>
                        <div class="subtitle">Чайная лавка</div>
                    </div>
                </div>
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
            </div>
        </div>

        <div class="banner">
            <h2>🍵 Добро пожаловать!</h2>
            <p>Аутентичный китайский чай с доставкой</p>
            <a href="#" class="banner-button" onclick="showCatalog(); return false;">
                Смотреть каталог
            </a>
        </div>

        <div class="nav-grid">
            <div class="nav-item" onclick="showCatalog()">
                <div class="nav-icon icon-tea"><i class="fas fa-mug-hot"></i></div>
                <h3>Каталог</h3>
                <p>8+ сортов чая</p>
            </div>
            <div class="nav-item" onclick="showOrders()">
                <div class="nav-icon icon-orders"><i class="fas fa-box"></i></div>
                <h3>Заказы</h3>
                <p>История покупок</p>
            </div>
            <div class="nav-item" onclick="showCart()">
                <div class="nav-icon icon-cart"><i class="fas fa-shopping-cart"></i></div>
                <h3>Корзина</h3>
                <p>Товары: <span class="cart-count">0</span></p>
            </div>
            <div class="nav-item" onclick="showProfile()">
                <div class="nav-icon icon-profile"><i class="fas fa-user"></i></div>
                <h3>Профиль</h3>
                <p>Ваш профиль</p>
            </div>
        </div>

        <div class="products-section">
            <h2 class="section-title"><i class="fas fa-fire"></i> Популярное</h2>
            <div class="products-grid" id="popular-products">
                <!-- Товары загружаются динамически -->
            </div>
        </div>

        <div class="cart-footer">
            <div class="cart-content">
                <div class="cart-total" id="cart-total">Корзина пуста</div>
                <button class="checkout-button" id="checkout-btn" onclick="checkout()" disabled>
                    Оформить заказ
                </button>
            </div>
        </div>
    `;
    
    // Загружаем популярные товары
    loadPopularProducts();
}

// Загрузка популярных товаров
function loadPopularProducts() {
    const container = document.getElementById('popular-products');
    if (!container) return;
    
    const products = [
        { id: 1, name: 'ЛАО ЧА ТОУ', subtitle: 'Старые чайные головы', type: 'Пуэр', price: 1200, tag: 'Хит' },
        { id: 2, name: 'ХЭЙ ЦЗИНЬ', subtitle: 'Черное золото', type: 'Красный чай', price: 950, tag: 'Популярное' },
        { id: 3, name: 'ЖОУ ГУЙ НУН СЯН', subtitle: 'Мясистая корица', type: 'Улун', price: 1100, tag: 'Рекомендуем' },
        { id: 5, name: 'ГАБА МАО ЧА', subtitle: 'Чай-сырец', type: 'Габа', price: 1400, tag: 'Новинка' }
    ];
    
    container.innerHTML = products.map(product => `
        <div class="product-card" onclick="showProduct(${product.id})">
            <div class="product-image ${product.type === 'Пуэр' ? 'puer' : product.type === 'Красный чай' ? 'red-tea' : product.type === 'Улун' ? 'oolong' : 'gaba'}">
                ${product.tag ? `<div class="product-tag">${product.tag}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-subtitle">${product.subtitle}</div>
                <div class="product-price">${product.price}₽</div>
                <button class="product-button" onclick="event.stopPropagation(); addToCart(${product.id});">+ В корзину</button>
            </div>
        </div>
    `).join('');
}

// Функции-заглушки (будут реализованы позже)
function showCatalog() {
    alert('Каталог (в разработке)');
}

function showProduct(id) {
    alert(`Товар #${id} (в разработке)`);
}

function showOrders() {
    alert('Заказы (в разработке)');
}

function showCart() {
    alert('Корзина (в разработке)');
}

function showProfile() {
    alert('Профиль (в разработке)');
}

function addToCart(id) {
    alert(`Товар #${id} добавлен в корзину`);
    
    // Обновляем счетчик корзины
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const current = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = current + 1;
    }
    
    // Обновляем футер корзины
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (cartTotal && checkoutBtn) {
        cartTotal.innerHTML = `Итого: <span>1200₽</span>`;
        checkoutBtn.textContent = `Оформить (1)`;
        checkoutBtn.disabled = false;
    }
}

function checkout() {
    alert('Оформление заказа (в разработке)');
}

// Экспорт функций
window.showCatalog = showCatalog;
window.showProduct = showProduct;
window.showOrders = showOrders;
window.showCart = showCart;
window.showProfile = showProfile;
window.addToCart = addToCart;
window.checkout = checkout;

// Запуск приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Даем время на загрузку стилей
    setTimeout(initApp, 100);
});

// Аварийное восстановление
setTimeout(() => {
    const app = document.getElementById('app');
    const loader = document.getElementById('loader');
    
    if (app && app.style.display === 'none') {
        app.style.display = 'block';
    }
    
    if (loader && loader.style.display !== 'none') {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
}, 3000);
