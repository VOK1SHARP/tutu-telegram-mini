// ===================================
// ТИ•ТИ - ЧАЙНАЯ ЛАВКА (ФИНАЛЬНАЯ РАБОЧАЯ ВЕРСИЯ)
// Исправлены все проблемы с отправкой и добавлены заказы/профиль
// ===================================

// Глобальные переменные
let tg = window.Telegram.WebApp;
let cart = [];
let userData = null;
let userId = null;
let isTelegramUser = false;
let orders = [];
let currentPage = 'main';

// Полный каталог чая
const teaCatalog = [
    {
        id: 1,
        name: 'ЛАО ЧА ТОУ',
        subtitle: 'Старые чайные головы',
        type: 'Пуэр',
        price: 1200,
        tag: 'Хит',
        icon: 'fas fa-mountain',
        category: 'puer'
    },
    {
        id: 2,
        name: 'ХЭЙ ЦЗИНЬ',
        subtitle: 'Черное золото',
        type: 'Красный чай',
        price: 950,
        tag: 'Популярное',
        icon: 'fas fa-crown',
        category: 'red'
    },
    {
        id: 3,
        name: 'ЖОУ ГУЙ НУН СЯН',
        subtitle: 'Мясистая корица',
        type: 'Улун',
        price: 1100,
        tag: 'Рекомендуем',
        icon: 'fas fa-spice',
        category: 'oolong'
    },
    {
        id: 4,
        name: 'ДЯНЬ ХУН',
        subtitle: 'Красный чай из Юньнани',
        type: 'Красный чай',
        price: 850,
        icon: 'fas fa-fire',
        category: 'red'
    },
    {
        id: 5,
        name: 'ГАБА МАО ЧА',
        subtitle: 'Чай-сырец',
        type: 'Габа',
        price: 1400,
        tag: 'Новинка',
        icon: 'fas fa-brain',
        category: 'gaba'
    },
    {
        id: 6,
        name: 'ГУ ШУ ХУН ЧА',
        subtitle: 'Красный чай со старых деревьев',
        type: 'Красный чай',
        price: 1300,
        icon: 'fas fa-tree',
        category: 'red'
    },
    {
        id: 7,
        name: 'ТЕ ГУАНЬ ИНЬ',
        subtitle: 'Железная богиня милосердия',
        type: 'Улун',
        price: 1050,
        tag: 'Классика',
        icon: 'fas fa-yin-yang',
        category: 'oolong'
    },
    {
        id: 8,
        name: 'МО ЛИ ХУА ЧА',
        subtitle: 'Жасмин',
        type: 'Зеленый чай',
        price: 900,
        icon: 'fas fa-flower',
        category: 'green'
    }
];

// Категории чая
const teaCategories = [
    { id: 'all', name: 'Все чаи', icon: 'fas fa-mug-hot', color: 'var(--tea-green)' },
    { id: 'puer', name: 'Пуэры', icon: 'fas fa-mountain', color: '#5D4037' },
    { id: 'red', name: 'Красные чаи', icon: 'fas fa-fire', color: '#D32F2F' },
    { id: 'oolong', name: 'Улуны', icon: 'fas fa-yin-yang', color: '#F57C00' },
    { id: 'green', name: 'Зеленые чаи', icon: 'fas fa-leaf', color: '#2E7D32' },
    { id: 'gaba', name: 'Габа чаи', icon: 'fas fa-brain', color: '#7B1FA2' }
];

// ========== ИНИЦИАЛИЗАЦИЯ ==========
async function initApp() {
    console.log('Инициализация приложения...');
    
    // Инициализация Telegram
    if (tg && tg.ready) {
        tg.ready();
        tg.expand();
        tg.setHeaderColor('#4CAF50');
        tg.setBackgroundColor('#FFF8F0');
    }
    
    // Загружаем данные пользователя
    userData = await getUserData();
    userId = generateUserId();
    isTelegramUser = userData.id !== null;
    
    // Загружаем корзину и заказы
    await loadCart();
    await loadOrders();
    
    // Показываем главную страницу
    showMainPage();
}

// Получение данных пользователя
async function getUserData() {
    try {
        if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            return {
                id: user.id,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                username: user.username || '',
                photo_url: user.photo_url || '',
                is_bot: user.is_bot || false,
                language_code: user.language_code || 'ru'
            };
        }
    } catch (error) {
        console.log('Telegram user data error:', error);
    }
    
    // Для гостей
    return {
        id: null,
        first_name: 'Гость',
        last_name: '',
        username: '',
        photo_url: '',
        is_bot: false,
        language_code: 'ru'
    };
}

// Генерация ID пользователя
function generateUserId() {
    if (userData && userData.id) {
        return `tg_${userData.id}`;
    }
    
    let guestId = localStorage.getItem('tutu_guest_id');
    if (!guestId) {
        guestId = 'guest_' + Date.now();
        localStorage.setItem('tutu_guest_id', guestId);
    }
    return guestId;
}

// ========== УПРАВЛЕНИЕ СТРАНИЦАМИ ==========
function showPage(pageName) {
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    
    // Показываем нужную страницу
    const pageElement = document.getElementById(pageName + '-page');
    if (pageElement) {
        pageElement.style.display = 'block';
        pageElement.classList.add('page-transition');
        setTimeout(() => pageElement.classList.remove('page-transition'), 300);
        currentPage = pageName;
        
        // Обновляем футер корзины на главной
        if (pageName === 'main') {
            setTimeout(updateMainCartFooter, 100);
        }
    }
}

function goBack() {
    switch(currentPage) {
        case 'catalog':
        case 'product':
        case 'cart':
        case 'orders':
        case 'profile':
            showMainPage();
            break;
        default:
            showMainPage();
    }
}

// ========== ГЛАВНАЯ СТРАНИЦА ==========
function showMainPage() {
    const page = document.getElementById('main-page');
    const firstName = userData.first_name || 'друг';
    const fullName = `${firstName} ${userData.last_name || ''}`.trim();
    const username = userData.username ? `@${userData.username}` : '';
    const hasPhoto = userData.photo_url && userData.photo_url.trim() !== '';
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <div class="logo" onclick="showCatalogPage()" style="cursor: pointer;">
                    <div class="logo-icon">
                        <i class="fas fa-leaf"></i>
                    </div>
                    <div class="logo-text">
                        <h1>ТИ•ТИ</h1>
                        <div class="subtitle">Чайная лавка</div>
                    </div>
                </div>
                <div class="user-avatar" onclick="showProfilePage()" style="cursor: pointer;" title="${fullName}${username ? ` (${username})` : ''}">
                    ${hasPhoto ? 
                        `<img src="${userData.photo_url}" alt="${fullName}" 
                             onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\\'fas fa-user\\'></i>';">` : 
                        `<i class="fas fa-user"></i>`
                    }
                    <span class="cart-badge" style="display: none;">0</span>
                    ${isTelegramUser ? `<div class="tg-badge">TG</div>` : ''}
                </div>
            </div>
        </div>
        
        <div class="main-content">
            <!-- Welcome Banner -->
            <div class="welcome-banner">
                <div class="banner-content">
                    <h2>${getWelcomeMessage()}</h2>
                    <p>${isTelegramUser ? 'Рады видеть вас снова!' : 'Аутентичный китайский чай с доставкой'}</p>
                    <div class="banner-actions">
                        <button class="catalog-btn" onclick="showCatalogPage()">
                            <i class="fas fa-search"></i> Выбрать чай
                        </button>
                        <button class="popular-btn" onclick="showCartPage()">
                            <i class="fas fa-shopping-cart"></i> Корзина
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Featured Categories -->
            <div class="featured-categories">
                <h2 class="section-title">
                    <i class="fas fa-filter"></i> Категории чая
                </h2>
                <div class="category-grid">
                    ${teaCategories.map(category => `
                        <div class="category-item" onclick="showCatalogPage('${category.id}')" style="cursor: pointer;">
                            <div class="category-icon" style="background: ${category.color};">
                                <i class="${category.icon}"></i>
                            </div>
                            <div class="category-name">${category.name}</div>
                            <div class="category-count">
                                ${category.id === 'all' ? teaCatalog.length : 
                                  teaCatalog.filter(t => t.category === category.id).length} видов
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
                <h2 class="section-title">
                    <i class="fas fa-bolt"></i> Быстрые действия
                </h2>
                <div class="action-buttons">
                    <div class="action-btn" onclick="showOrdersPage()" style="cursor: pointer;">
                        <i class="fas fa-box"></i>
                        <span>Мои заказы</span>
                    </div>
                    <div class="action-btn" onclick="showProfilePage()" style="cursor: pointer;">
                        <i class="fas fa-user"></i>
                        <span>Профиль</span>
                    </div>
                    <div class="action-btn" onclick="openTelegramLink('https://t.me/teatea_bar')" style="cursor: pointer;">
                        <i class="fab fa-telegram"></i>
                        <span>Наш канал</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Cart Footer -->
        <div class="main-cart-footer">
            <div class="cart-content">
                <div class="cart-total" id="main-cart-total">Корзина пуста</div>
                <button class="checkout-button" id="main-checkout-btn" onclick="startCheckout()" style="cursor: pointer;">
                    <i class="fas fa-paper-plane"></i> Оформить
                </button>
            </div>
        </div>
    `;
    
    showPage('main');
    updateMainCartFooter();
}

// Универсальная функция открытия ссылок
function openTelegramLink(url) {
    if (tg && tg.openLink) {
        tg.openLink(url);
    } else {
        window.open(url, '_blank');
    }
}

function getWelcomeMessage() {
    const hour = new Date().getHours();
    const firstName = userData.first_name || 'друг';
    
    if (hour >= 5 && hour < 12) return `☀️ Доброе утро, ${firstName}!`;
    if (hour >= 12 && hour < 18) return `🌤 Добрый день, ${firstName}!`;
    if (hour >= 18 && hour < 23) return `🌙 Добрый вечер, ${firstName}!`;
    return `🌜 Доброй ночи, ${firstName}!`;
}

// ========== СТРАНИЦА КАТАЛОГА ==========
function showCatalogPage(category = 'all') {
    const filteredTeas = category === 'all' 
        ? teaCatalog 
        : teaCatalog.filter(tea => tea.category === category);
    
    const page = document.getElementById('catalog-page');
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <button class="back-button" onclick="goBack()" style="cursor: pointer;">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="page-title">
                    <i class="fas fa-mug-hot"></i>
                    <span>Каталог чая</span>
                </div>
                <div style="width: 40px;"></div>
            </div>
        </div>
        
        <div class="catalog-filters">
            <div class="filter-buttons">
                ${teaCategories.map(cat => `
                    <button class="filter-btn ${category === cat.id ? 'active' : ''}" 
                            onclick="showCatalogPage('${cat.id}')" style="cursor: pointer;">
                        ${cat.name}
                    </button>
                `).join('')}
            </div>
        </div>
        
        <div class="catalog-list">
            ${filteredTeas.map(tea => `
                <div class="catalog-product-item" onclick="showProductPage(${tea.id})" style="cursor: pointer;">
                    <div class="catalog-product-icon ${getTeaTypeClass(tea.type)}">
                        <i class="${tea.icon}"></i>
                    </div>
                    <div class="catalog-product-info">
                        <div class="catalog-product-name">${tea.name}</div>
                        <div class="catalog-product-subtitle">${tea.subtitle}</div>
                        <div class="catalog-product-price">${tea.price}₽</div>
                    </div>
                    <div class="catalog-product-actions">
                        ${tea.tag ? `<span style="background: var(--tea-gold); color: white; padding: 2px 8px; border-radius: 10px; font-size: 11px;">${tea.tag}</span>` : ''}
                        <button class="catalog-add-btn" onclick="event.stopPropagation(); addToCart(${tea.id})" style="cursor: pointer;">
                            + Добавить
                        </button>
                    </div>
                </div>
            `).join('')}
            
            ${filteredTeas.length === 0 ? `
                <div style="text-align: center; padding: 40px 20px; color: var(--tea-text-light);">
                    <i class="fas fa-mug-hot" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>В этой категории пока нет чаев</p>
                </div>
            ` : ''}
        </div>
    `;
    
    showPage('catalog');
}

// ========== СТРАНИЦА ТОВАРА ==========
function showProductPage(productId) {
    const product = teaCatalog.find(p => p.id === productId);
    if (!product) return;
    
    const page = document.getElementById('product-page');
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <button class="back-button" onclick="showCatalogPage()" style="cursor: pointer;">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="page-title">
                    <i class="${product.icon}"></i>
                    <span>${product.name}</span>
                </div>
                <div style="width: 40px;"></div>
            </div>
        </div>
        
        <div class="product-detail" style="padding-bottom: 120px;">
            <div class="product-detail-header">
                <div class="product-detail-icon ${getTeaTypeClass(product.type)}">
                    <i class="${product.icon}"></i>
                </div>
                <div class="product-detail-title">
                    <h2>${product.name}</h2>
                    <div class="subtitle">${product.subtitle}</div>
                    <div style="background: var(--tea-green); color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; display: inline-block; margin-top: 8px;">
                        ${product.type}
                    </div>
                    ${product.tag ? `<div class="product-detail-tag">${product.tag}</div>` : ''}
                </div>
            </div>
            
            <div class="product-detail-price">${product.price}₽</div>
            
            <div class="product-detail-actions">
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}); showNotification('✅ Добавлено в корзину!', 'green')" style="cursor: pointer;">
                    <i class="fas fa-cart-plus"></i> В корзину
                </button>
                <button class="buy-now-btn" onclick="addToCart(${product.id}); showCartPage()" style="cursor: pointer;">
                    <i class="fas fa-bolt"></i> Купить сейчас
                </button>
            </div>
        </div>
    `;
    
    showPage('product');
}

function getTeaTypeClass(type) {
    const map = {
        'Пуэр': 'puer',
        'Красный чай': 'red-tea',
        'Улун': 'oolong',
        'Габа': 'gaba',
        'Зеленый чай': 'green-tea'
    };
    return map[type] || '';
}

// ========== КОРЗИНА ==========
async function loadCart() {
    const key = `tutu_cart_${userId}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
        try {
            cart = JSON.parse(saved);
            if (!Array.isArray(cart)) cart = [];
        } catch (e) {
            cart = [];
        }
    } else {
        cart = [];
    }
    
    updateCart();
}

async function saveCart() {
    const key = `tutu_cart_${userId}`;
    localStorage.setItem(key, JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Обновляем бейдж
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    updateMainCartFooter();
}

function updateMainCartFooter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const cartTotal = document.getElementById('main-cart-total');
    const checkoutBtn = document.getElementById('main-checkout-btn');
    
    if (cartTotal && checkoutBtn) {
        if (totalItems > 0) {
            cartTotal.innerHTML = `Итого: <span style="color: var(--tea-green); font-weight: 800;">${totalPrice}₽</span>`;
            checkoutBtn.textContent = `Оформить (${totalItems})`;
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.cursor = 'pointer';
        } else {
            cartTotal.innerHTML = `Корзина пуста`;
            checkoutBtn.textContent = 'Оформить';
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
            checkoutBtn.style.cursor = 'not-allowed';
        }
    }
}

function addToCart(productId) {
    const product = teaCatalog.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            id: product.id,
            name: product.name,
            price: product.price,
            type: product.type,
            quantity: 1
        });
    }
    
    saveCart();
    
    // Эффекты
    createHeartEffect();
    showNotification(`✅ ${product.name} добавлен в корзину!`, 'green');
    
    // Тактильная обратная связь
    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// ========== СТРАНИЦА КОРЗИНЫ ==========
function showCartPage() {
    const page = document.getElementById('cart-page');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <button class="back-button" onclick="goBack()" style="cursor: pointer;">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="page-title">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Корзина</span>
                </div>
                <div style="width: 40px;"></div>
            </div>
        </div>
        
        <div class="cart-items">
            ${cart.length === 0 ? `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Корзина пуста</h3>
                    <p>Добавьте товары из каталога</p>
                    <button onclick="showCatalogPage()" 
                            style="margin-top: 20px; padding: 12px 24px; background: var(--tea-green); 
                                   color: white; border: none; border-radius: var(--radius-round); 
                                   font-weight: 600; cursor: pointer;">
                        <i class="fas fa-mug-hot"></i> Перейти в каталог
                    </button>
                </div>
            ` : `
                ${cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image ${getTeaTypeClass(item.type)}">
                            <i class="fas fa-leaf"></i>
                        </div>
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">${item.price}₽/шт</div>
                        </div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn minus" onclick="updateCartQuantity(${item.id}, -1)" style="cursor: pointer;">
                                −
                            </button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" onclick="updateCartQuantity(${item.id}, 1)" style="cursor: pointer;">
                                +
                            </button>
                        </div>
                        <div class="cart-item-total">${item.price * item.quantity}₽</div>
                    </div>
                `).join('')}
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid var(--tea-green);">
                    <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 700; margin-bottom: 24px;">
                        <span>Итого:</span>
                        <span>${total}₽</span>
                    </div>
                    <button onclick="startCheckout()" 
                            style="width: 100%; padding: 16px; background: linear-gradient(135deg, var(--tea-purple), var(--tea-purple-light)); 
                                   color: white; border: none; border-radius: var(--radius-round); 
                                   font-weight: 600; cursor: pointer; display: flex; align-items: center; 
                                   justify-content: center; gap: 10px; font-size: 16px;">
                        <i class="fas fa-paper-plane"></i> Оформить заказ (${totalItems})
                    </button>
                </div>
            `}
        </div>
    `;
    
    showPage('cart');
}

function updateCartQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }
    
    saveCart();
    showCartPage();
}

// ========== ОФОРМЛЕНИЕ ЗАКАЗА (ИСПРАВЛЕННОЕ) ==========
function startCheckout() {
    if (cart.length === 0) {
        showNotification('🛒 Добавьте товары в корзину!', 'gold');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Создаем модальное окно подтверждения
    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(62, 39, 35, 0.95);
        backdrop-filter: blur(15px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: var(--tea-card);
            border-radius: var(--radius-lg);
            width: 100%;
            max-width: 450px;
            max-height: 85vh;
            overflow: hidden;
            animation: modalSlideUp 0.4s var(--ease-spring);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
        ">
            <div class="modal-header" style="
                background: linear-gradient(135deg, var(--tea-green), var(--tea-green-dark));
                padding: var(--space-md) var(--space-lg);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                z-index: 10;
            ">
                <h3 style="font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-check-circle"></i> Подтверждение заказа
                </h3>
                <button class="modal-close" onclick="closeCheckoutModal()" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
            </div>
            <div class="modal-body" style="
                padding: var(--space-lg);
                max-height: calc(85vh - 70px);
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            ">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 48px; color: var(--tea-green); margin-bottom: 12px;">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <h4 style="margin-bottom: 8px; color: var(--tea-green);">Сумма заказа</h4>
                    <div style="font-size: 32px; font-weight: 800; color: var(--tea-text); margin-bottom: 16px;">${total}₽</div>
                    <p style="color: var(--tea-text-light); font-size: 14px;">${totalItems} товаров</p>
                </div>
                
                <div style="background: var(--tea-bg); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
                    <h5 style="margin-bottom: 12px; color: var(--tea-text);">Состав заказа:</h5>
                    ${cart.map(item => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                            <span>${item.name} × ${item.quantity}</span>
                            <span style="font-weight: 600;">${item.price * item.quantity}₽</span>
                        </div>
                    `).join('')}
                </div>
                
                <div style="color: var(--tea-text-light); font-size: 14px; margin-bottom: 20px; text-align: center; padding: 12px; background: rgba(76, 175, 80, 0.1); border-radius: var(--radius-md);">
                    <i class="fas fa-info-circle" style="margin-right: 8px;"></i>
                    После подтверждения откроется чат с менеджером для уточнения деталей доставки.
                </div>
                
                <div style="display: flex; gap: 12px;">
                    <button onclick="closeCheckoutModal()" style="
                        flex: 1;
                        padding: 14px;
                        background: var(--tea-bg);
                        color: var(--tea-text);
                        border: none;
                        border-radius: var(--radius-round);
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s var(--ease-smooth);
                    ">Отмена</button>
                    <button onclick="confirmCheckout()" id="confirm-checkout-btn" style="
                        flex: 1;
                        padding: 14px;
                        background: linear-gradient(135deg, var(--tea-green), var(--tea-green-light));
                        color: white;
                        border: none;
                        border-radius: var(--radius-round);
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s var(--ease-smooth);
                    ">Подтвердить</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.remove();
}

async function confirmCheckout() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Отключаем кнопку чтобы избежать двойного нажатия
    const confirmBtn = document.getElementById('confirm-checkout-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Оформляем...';
    }
    
    // Создаем заказ
    const order = {
        id: Date.now(),
        user_id: userId,
        user_name: userData.first_name || 'Гость',
        user_username: userData.username || '',
        cart: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            type: item.type
        })),
        total: total,
        timestamp: new Date().toLocaleString('ru-RU'),
        date: new Date().toLocaleDateString('ru-RU'),
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
    
    // Сохраняем заказ
    await saveOrder(order);
    
    // Формируем КОРОТКОЕ сообщение для Telegram (максимум 200 символов)
    const message = `Заказ #${order.id}\n` +
                   `Сумма: ${order.total}₽\n` +
                   `Товаров: ${totalItems}\n` +
                   `Имя: ${order.user_name}\n` +
                   `Дата: ${order.timestamp}\n\n` +
                   `Состав:\n` +
                   order.cart.map(item => 
                       `${item.name} × ${item.quantity}`
                   ).join('\n');
    
    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    
    // Создаем URL для Telegram (максимум 2000 символов)
    const telegramUrl = `https://t.me/ivan_likhov?text=${encodedMessage}`;
    
    // Закрываем модальное окно
    closeCheckoutModal();
    
    // Показываем уведомление
    showNotification('📱 Открываем чат с менеджером...', 'green');
    
    // Очищаем корзину
    cart = [];
    await saveCart();
    
    // Открываем чат с менеджером
    setTimeout(() => {
        if (tg && tg.openLink) {
            tg.openLink(telegramUrl);
        } else {
            window.open(telegramUrl, '_blank');
        }
        
        // Показываем успешное уведомление
        showNotification(`🎉 Заказ #${order.id} оформлен!`, 'green');
        createConfetti();
        
        // Возвращаемся на главную
        setTimeout(() => {
            showMainPage();
        }, 1000);
    }, 500);
}

// ========== ЗАКАЗЫ ==========
async function loadOrders() {
    const key = `tutu_orders_${userId}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
        try {
            orders = JSON.parse(saved);
            if (!Array.isArray(orders)) orders = [];
        } catch (e) {
            orders = [];
        }
    } else {
        orders = [];
    }
    
    return orders;
}

async function saveOrder(order) {
    orders.push(order);
    const key = `tutu_orders_${userId}`;
    localStorage.setItem(key, JSON.stringify(orders));
}

function showOrdersPage() {
    const page = document.getElementById('orders-page');
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <button class="back-button" onclick="goBack()" style="cursor: pointer;">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="page-title">
                    <i class="fas fa-box"></i>
                    <span>Мои заказы</span>
                </div>
                <div style="width: 40px;"></div>
            </div>
        </div>
        
        <div class="page-body">
            <div class="catalog-list">
                ${orders.length === 0 ? `
                    <div style="text-align: center; padding: 60px 20px;">
                        <i class="fas fa-box-open" style="font-size: 64px; color: var(--tea-text-lighter); margin-bottom: 20px;"></i>
                        <h3 style="color: var(--tea-text-light); margin-bottom: 10px;">Заказов пока нет</h3>
                        <p style="color: var(--tea-text-lighter); font-size: 14px;">Совершите первую покупку!</p>
                    </div>
                ` : `
                    ${orders.slice().reverse().map(order => `
                        <div class="catalog-product-item" onclick="showOrderDetails(${order.id})" style="cursor: pointer;">
                            <div class="catalog-product-icon" style="background: var(--tea-green);">
                                <i class="fas fa-receipt"></i>
                            </div>
                            <div class="catalog-product-info">
                                <div class="catalog-product-name">Заказ #${order.id}</div>
                                <div class="catalog-product-subtitle">${order.timestamp}</div>
                                <div class="catalog-product-price">${order.total}₽</div>
                            </div>
                            <div class="catalog-product-actions">
                                <button class="catalog-add-btn" onclick="event.stopPropagation(); reorder(${order.id})" style="cursor: pointer;">
                                    Повторить
                                </button>
                            </div>
                        </div>
                    `).join('')}
                `}
            </div>
        </div>
    `;
    
    showPage('orders');
}

function showOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const page = document.getElementById('orders-page');
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <button class="back-button" onclick="showOrdersPage()" style="cursor: pointer;">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="page-title">
                    <i class="fas fa-receipt"></i>
                    <span>Заказ #${order.id}</span>
                </div>
                <div style="width: 40px;"></div>
            </div>
        </div>
        
        <div class="page-body">
            <div style="padding: var(--space-lg);">
                <div style="background: var(--tea-bg); padding: var(--space-md); border-radius: var(--radius-md); margin-bottom: var(--space-md);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--tea-text-light);">Дата:</span>
                        <span style="font-weight: 600;">${order.timestamp}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--tea-text-light);">Покупатель:</span>
                        <span style="font-weight: 600;">${order.user_name}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--tea-text-light);">Статус:</span>
                        <span style="color: var(--tea-green); font-weight: 600;">Оформлен</span>
                    </div>
                </div>
                
                <div style="background: var(--tea-bg); padding: var(--space-md); border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
                    <h3 style="margin-bottom: 12px; color: var(--tea-text);">Состав заказа:</h3>
                    ${order.cart.map(item => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                            <span>${item.name} × ${item.quantity}</span>
                            <span style="font-weight: 600;">${item.total}₽</span>
                        </div>
                    `).join('')}
                    
                    <div style="border-top: 1px solid rgba(142, 110, 99, 0.2); margin-top: 12px; padding-top: 12px;">
                        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700;">
                            <span>Итого:</span>
                            <span>${order.total}₽</span>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 12px;">
                    <button onclick="reorder(${order.id})" 
                            style="flex: 1; padding: 14px; background: var(--tea-green); 
                                   color: white; border: none; border-radius: var(--radius-round); 
                                   font-weight: 600; cursor: pointer; display: flex; align-items: center; 
                                   justify-content: center; gap: 8px;">
                        <i class="fas fa-redo"></i> Повторить заказ
                    </button>
                    <button onclick="contactSupport(${order.id})" 
                            style="flex: 1; padding: 14px; background: var(--tea-bg); 
                                   color: var(--tea-text); border: 1px solid var(--tea-green); 
                                   border-radius: var(--radius-round); font-weight: 600; 
                                   cursor: pointer; display: flex; align-items: center; 
                                   justify-content: center; gap: 8px;">
                        <i class="fas fa-headset"></i> Поддержка
                    </button>
                </div>
            </div>
        </div>
    `;
}

function reorder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Добавляем все товары из заказа в корзину
    order.cart.forEach(item => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                type: item.type || 'Чай',
                quantity: item.quantity
            });
        }
    });
    
    saveCart();
    showNotification('🛒 Товары добавлены в корзину!', 'green');
    showCartPage();
}

function contactSupport(orderId) {
    const message = `Вопрос по заказу #${orderId}`;
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/ivan_likhov?text=${encodedMessage}`;
    
    openTelegramLink(telegramUrl);
}

// ========== ПРОФИЛЬ ==========
function showProfilePage() {
    const firstName = userData.first_name || 'Гость';
    const fullName = `${firstName} ${userData.last_name || ''}`.trim();
    const username = userData.username ? `@${userData.username}` : '';
    const hasPhoto = userData.photo_url && userData.photo_url.trim() !== '';
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    
    const page = document.getElementById('profile-page');
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <button class="back-button" onclick="goBack()" style="cursor: pointer;">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="page-title">
                    <i class="fas fa-user"></i>
                    <span>Мой профиль</span>
                </div>
                <div style="width: 40px;"></div>
            </div>
        </div>
        
        <div class="page-body" style="padding-bottom: 80px;">
            <div style="text-align: center; padding: var(--space-lg);">
                <div style="width: 100px; height: 100px; margin: 0 auto 16px; 
                     background: ${hasPhoto ? 'transparent' : 'linear-gradient(135deg, var(--tea-purple), var(--tea-purple-light))'}; 
                     border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                     font-size: ${hasPhoto ? 'inherit' : '36px'}; color: white; overflow: hidden; 
                     border: 3px solid var(--tea-green); box-shadow: 0 8px 20px rgba(0,0,0,0.15);">
                    ${hasPhoto ? 
                        `<img src="${userData.photo_url}" alt="${fullName}" 
                             style="width: 100%; height: 100%; object-fit: cover;">` : 
                        `<i class="fas fa-user-circle"></i>`
                    }
                </div>
                <h3 style="margin-bottom: 4px; color: var(--tea-text);">${fullName}</h3>
                ${username ? `<p style="color: var(--tea-purple); font-weight: 600; font-size: 14px;">${username}</p>` : ''}
                ${isTelegramUser ? '<p style="color: var(--tea-green); font-size: 12px; margin-top: 4px;">Telegram пользователь</p>' : ''}
            </div>
            
            <div style="padding: 0 var(--space-lg);">
                <!-- Статистика -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
                    <div style="text-align: center; padding: 16px; background: var(--tea-bg); 
                         border-radius: var(--radius-md);">
                        <div style="font-size: 24px; margin-bottom: 8px; color: var(--tea-green);">🛒</div>
                        <div style="font-weight: 700; font-size: 18px; color: var(--tea-text);">${cart.length}</div>
                        <div style="font-size: 12px; color: var(--tea-text-light);">В корзине</div>
                    </div>
                    
                    <div style="text-align: center; padding: 16px; background: var(--tea-bg); 
                         border-radius: var(--radius-md);" onclick="showOrdersPage()" style="cursor: pointer;">
                        <div style="font-size: 24px; margin-bottom: 8px; color: var(--tea-blue);">📦</div>
                        <div style="font-weight: 700; font-size: 18px; color: var(--tea-text);">${totalOrders}</div>
                        <div style="font-size: 12px; color: var(--tea-text-light);">Заказов</div>
                    </div>
                    
                    <div style="text-align: center; padding: 16px; background: var(--tea-bg); 
                         border-radius: var(--radius-md);">
                        <div style="font-size: 24px; margin-bottom: 8px; color: var(--tea-gold);">💰</div>
                        <div style="font-weight: 700; font-size: 18px; color: var(--tea-text);">${totalSpent}₽</div>
                        <div style="font-size: 12px; color: var(--tea-text-light);">Потрачено</div>
                    </div>
                    
                    <div style="text-align: center; padding: 16px; background: var(--tea-bg); 
                         border-radius: var(--radius-md);">
                        <div style="font-size: 24px; margin-bottom: 8px; color: var(--tea-purple);">⭐</div>
                        <div style="font-weight: 700; font-size: 18px; color: var(--tea-text);">${orders.length > 0 ? 'Постоянный' : 'Новый'}</div>
                        <div style="font-size: 12px; color: var(--tea-text-light);">Статус</div>
                    </div>
                </div>
                
                <!-- Контакты поддержки -->
                <div style="background: var(--tea-bg); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
                    <h4 style="margin-bottom: 12px; color: var(--tea-text); display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-headset"></i> Контакты поддержки
                    </h4>
                    <div style="color: var(--tea-text-light); font-size: 14px; line-height: 1.6;">
                        <p style="margin-bottom: 12px;">По всем вопросам обращайтесь:</p>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px; background: white; border-radius: var(--radius-sm);">
                            <i class="fab fa-telegram" style="color: var(--tea-blue);"></i>
                            <span style="color: var(--tea-blue); font-weight: 600; flex: 1;">@ivan_likhov</span>
                            <button onclick="openTelegramLink('https://t.me/ivan_likhov')" 
                                    style="padding: 4px 12px; background: var(--tea-blue); color: white; 
                                           border: none; border-radius: 12px; font-size: 12px; cursor: pointer;">
                                Написать
                            </button>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: white; border-radius: var(--radius-sm);">
                            <i class="fas fa-phone" style="color: var(--tea-green);"></i>
                            <span style="color: var(--tea-green); font-weight: 600; flex: 1;">+7 (903) 839-46-70</span>
                            <button onclick="window.location.href = 'tel:+79038394670'" 
                                    style="padding: 4px 12px; background: var(--tea-green); color: white; 
                                           border: none; border-radius: 12px; font-size: 12px; cursor: pointer;">
                                Позвонить
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Настройки -->
                <div style="background: var(--tea-bg); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
                    <h4 style="margin-bottom: 12px; color: var(--tea-text); display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-cog"></i> Настройки
                    </h4>
                    <div style="color: var(--tea-text-light); font-size: 14px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 8px 0; border-bottom: 1px solid rgba(142, 110, 99, 0.1);">
                            <span>Уведомления</span>
                            <label class="switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                            <span>Тема оформления</span>
                            <select style="padding: 4px 8px; border-radius: 8px; border: 1px solid var(--tea-green);">
                                <option>Светлая</option>
                                <option>Темная</option>
                                <option>Авто</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Кнопки действий -->
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <button onclick="openTelegramLink('https://t.me/teatea_bar')" 
                            style="width: 100%; padding: 14px; background: linear-gradient(135deg, #0088cc, #00aced); 
                                   color: white; border: none; border-radius: var(--radius-round); 
                                   font-weight: 600; cursor: pointer; display: flex; align-items: center; 
                                   justify-content: center; gap: 10px;">
                        <i class="fab fa-telegram"></i> Наш телеграм-канал
                    </button>
                    
                    <button onclick="clearCart()" 
                            style="width: 100%; padding: 14px; background: var(--tea-bg); 
                                   color: var(--tea-text); border: 1px solid var(--tea-red); 
                                   border-radius: var(--radius-round); font-weight: 600; 
                                   cursor: pointer; display: flex; align-items: center; 
                                   justify-content: center; gap: 10px;">
                        <i class="fas fa-trash"></i> Очистить корзину
                    </button>
                    
                    <button onclick="clearHistory()" 
                            style="width: 100%; padding: 14px; background: var(--tea-bg); 
                                   color: var(--tea-text-light); border: 1px solid var(--tea-text-lighter); 
                                   border-radius: var(--radius-round); font-weight: 600; 
                                   cursor: pointer; display: flex; align-items: center; 
                                   justify-content: center; gap: 10px; font-size: 13px;">
                        <i class="fas fa-history"></i> Очистить историю заказов
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showPage('profile');
}

function clearCart() {
    cart = [];
    saveCart();
    showNotification('🛒 Корзина очищена', 'green');
    showMainPage();
}

function clearHistory() {
    if (confirm('Очистить всю историю заказов?')) {
        orders = [];
        const key = `tutu_orders_${userId}`;
        localStorage.removeItem(key);
        showNotification('📦 История заказов очищена', 'green');
        showMainPage();
    }
}

// ========== УТИЛИТЫ ==========
function showNotification(message, type = 'green') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `tea-notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'green' ? 'check-circle' : type === 'red' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Автоудаление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'notificationSlideIn 0.4s var(--ease-spring) reverse forwards';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

function createHeartEffect() {
    const heart = document.createElement('div');
    heart.className = 'heart-effect';
    heart.innerHTML = '❤️';
    heart.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        font-size: 24px;
        pointer-events: none;
        z-index: 1001;
        transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 1500);
}

function createConfetti() {
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}%;
            top: -20px;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: hsl(${Math.random() * 360}, 100%, 60%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1001;
            animation: confettiFall 2s linear forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 2500);
    }
}

// ========== ЗАГРУЗКА ==========
document.addEventListener('DOMContentLoaded', initApp);

// Экспортируем функции
window.showMainPage = showMainPage;
window.showCatalogPage = showCatalogPage;
window.showProductPage = showProductPage;
window.showCartPage = showCartPage;
window.showOrdersPage = showOrdersPage;
window.showProfilePage = showProfilePage;
window.goBack = goBack;
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.startCheckout = startCheckout;
window.confirmCheckout = confirmCheckout;
window.reorder = reorder;
window.contactSupport = contactSupport;
window.openTelegramLink = openTelegramLink;
window.clearCart = clearCart;
window.clearHistory = clearHistory;
window.closeCheckoutModal = closeCheckoutModal;
