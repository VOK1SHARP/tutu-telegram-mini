// ===================================
// ТИ•ТИ - ЧАЙНАЯ ЛАВКА (ОБНОВЛЕННАЯ ВЕРСИЯ)
// С отдельными страницами вместо модальных окон
// ===================================

// Глобальные переменные
let tg = window.Telegram.WebApp;
let cart = [];
let userData = null;
let userId = null;
let isTelegramUser = false;
let orders = [];
let currentPage = 'main';

// Каталог чая (сокращенный для производительности)
const teaCatalog = [
    {
        id: 1, name: 'ЛАО ЧА ТОУ', subtitle: 'Старые чайные головы', type: 'Пуэр',
        price: 1200, tag: 'Хит', icon: 'fas fa-mountain',
        description: 'Насыщенный и бархатистый чай с нотами ореха и карамели.',
        category: 'puer'
    },
    {
        id: 2, name: 'ХЭЙ ЦЗИНЬ', subtitle: 'Черное золото', type: 'Красный чай',
        price: 950, tag: 'Популярное', icon: 'fas fa-crown',
        description: 'Сладкий чай с медовыми нотами и легкой кислинкой.',
        category: 'red'
    },
    {
        id: 3, name: 'ЖОУ ГУЙ НУН СЯН', subtitle: 'Мясистая корица', type: 'Улун',
        price: 1100, tag: 'Рекомендуем', icon: 'fas fa-spice',
        description: 'Топленый вкус с ореховыми нотками, согревает и успокаивает.',
        category: 'oolong'
    },
    {
        id: 4, name: 'ДЯНЬ ХУН', subtitle: 'Красный чай из Юньнани', type: 'Красный чай',
        price: 850, icon: 'fas fa-fire',
        description: 'Теплый хлебно-медовый аромат, мягкая сладость.',
        category: 'red'
    },
    {
        id: 5, name: 'ГАБА МАО ЧА', subtitle: 'Чай-сырец', type: 'Габа',
        price: 1400, tag: 'Новинка', icon: 'fas fa-brain',
        description: 'Аромат жареных семечек и кедровых орехов.',
        category: 'gaba'
    },
    {
        id: 6, name: 'ГУ ШУ ХУН ЧА', subtitle: 'Красный чай со старых деревьев', 
        type: 'Красный чай', price: 1300, icon: 'fas fa-tree',
        description: 'Медово-сливовые оттенки с маслянистостью.',
        category: 'red'
    },
    {
        id: 7, name: 'ТЕ ГУАНЬ ИНЬ', subtitle: 'Железная богиня милосердия', type: 'Улун',
        price: 1050, tag: 'Классика', icon: 'fas fa-yin-yang',
        description: 'Расслабляющий улун с цветочной вкусоароматикой.',
        category: 'oolong'
    },
    {
        id: 8, name: 'МО ЛИ ХУА ЧА', subtitle: 'Жасмин', type: 'Зеленый чай',
        price: 900, icon: 'fas fa-flower',
        description: 'Свежий жасминовый аромат с цветочными оттенками.',
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
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#4CAF50');
    tg.setBackgroundColor('#FFF8F0');
    
    // Загружаем данные пользователя
    userData = await getUserData();
    userId = generateUserId();
    isTelegramUser = userData.id !== null;
    
    // Загружаем корзину и заказы
    await loadCart();
    await loadOrders();
    
    // Показываем главную страницу
    showMainPage();
    
    // Приветственное уведомление
    setTimeout(() => {
        showNotification('🍵 Добро пожаловать в чайную гармонию!', 'green');
    }, 1000);
}

// Получение данных пользователя
async function getUserData() {
    try {
        const initData = tg.initDataUnsafe;
        if (initData && initData.user) {
            const user = initData.user;
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
        guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <div class="logo" onclick="showCatalogPage()">
                    <div class="logo-icon">
                        <i class="fas fa-leaf"></i>
                    </div>
                    <div class="logo-text">
                        <h1>ТИ•ТИ</h1>
                        <div class="subtitle">Чайная лавка</div>
                    </div>
                </div>
                <div class="user-avatar" onclick="showProfilePage()">
                    ${userData.photo_url ? 
                        `<img src="${userData.photo_url}" alt="${firstName}" 
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
                        <div class="category-item" onclick="showCatalogPage('${category.id}')">
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
                    <div class="action-btn" onclick="showOrdersPage()">
                        <i class="fas fa-box"></i>
                        <span>Мои заказы</span>
                    </div>
                    <div class="action-btn" onclick="showProfilePage()">
                        <i class="fas fa-user"></i>
                        <span>Профиль</span>
                    </div>
                    <div class="action-btn" onclick="window.open('https://t.me/teatea_bar', '_blank')">
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
                <button class="checkout-button" id="main-checkout-btn" onclick="startCheckout()" disabled>
                    <i class="fas fa-paper-plane"></i> Оформить
                </button>
            </div>
        </div>
    `;
    
    showPage('main');
    updateMainCartFooter();
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
                <button class="back-button" onclick="goBack()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="page-title">
                    <i class="fas fa-mug-hot"></i>
                    <span>Каталог чая</span>
                </div>
                <div style="width: 40px;"></div> <!-- Для выравнивания -->
            </div>
        </div>
        
        <div class="catalog-filters">
            <div class="filter-buttons">
                ${teaCategories.map(cat => `
                    <button class="filter-btn ${category === cat.id ? 'active' : ''}" 
                            onclick="showCatalogPage('${cat.id}')">
                        ${cat.name}
                    </button>
                `).join('')}
            </div>
        </div>
        
        <div class="catalog-list">
            ${filteredTeas.map(tea => `
                <div class="catalog-product-item" onclick="showProductPage(${tea.id})">
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
                        <button class="catalog-add-btn" onclick="event.stopPropagation(); addToCart(${tea.id})">
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
                <button class="back-button" onclick="showCatalogPage()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="page-title">
                    <i class="${product.icon}"></i>
                    <span>${product.name}</span>
                </div>
                <div style="width: 40px;"></div>
            </div>
        </div>
        
        <div class="product-detail">
            <div class="product-detail-header">
                <div class="product-detail-icon ${getTeaTypeClass(product.type)}">
                    <i class="${product.icon}"></i>
                </div>
                <div class="product-detail-title">
                    <h2>${product.name}</h2>
                    <div class="subtitle">${product.subtitle}</div>
                    ${product.tag ? `<div class="product-detail-tag">${product.tag}</div>` : ''}
                </div>
            </div>
            
            <div class="product-detail-price">${product.price}₽</div>
            
            <div class="product-detail-section">
                <h3><i class="fas fa-info-circle"></i> Описание</h3>
                <p>${product.description}</p>
            </div>
            
            <div class="product-detail-section">
                <h3><i class="fas fa-tag"></i> Тип чая</h3>
                <p>${product.type} • ${getCategoryName(product.category)}</p>
            </div>
        </div>
        
        <div class="product-detail-actions">
            <button class="add-to-cart-btn" onclick="addToCart(${product.id}); showNotification('✅ Добавлено в корзину!', 'green')">
                <i class="fas fa-cart-plus"></i> В корзину
            </button>
            <button class="buy-now-btn" onclick="addToCart(${product.id}); showCartPage()">
                <i class="fas fa-bolt"></i> Купить сейчас
            </button>
        </div>
    `;
    
    showPage('product');
}

function getCategoryName(categoryId) {
    const category = teaCategories.find(c => c.id === categoryId);
    return category ? category.name : '';
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

// ========== СТРАНИЦА КОРЗИНЫ ==========
function showCartPage() {
    const page = document.getElementById('cart-page');
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <button class="back-button" onclick="goBack()">
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
                            <button class="quantity-btn minus" onclick="updateCartQuantity(${item.id}, -1)">
                                −
                            </button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" onclick="updateCartQuantity(${item.id}, 1)">
                                +
                            </button>
                        </div>
                        <div class="cart-item-total">${item.price * item.quantity}₽</div>
                    </div>
                `).join('')}
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid var(--tea-green);">
                    <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 700; margin-bottom: 24px;">
                        <span>Итого:</span>
                        <span>${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}₽</span>
                    </div>
                    <button onclick="startCheckout()" 
                            style="width: 100%; padding: 16px; background: linear-gradient(135deg, var(--tea-purple), var(--tea-purple-light)); 
                                   color: white; border: none; border-radius: var(--radius-round); 
                                   font-weight: 600; cursor: pointer; display: flex; align-items: center; 
                                   justify-content: center; gap: 10px; font-size: 16px;">
                        <i class="fas fa-paper-plane"></i> Оформить заказ
                    </button>
                </div>
            `}
        </div>
    `;
    
    showPage('cart');
}

// ========== СТРАНИЦА ЗАКАЗОВ ==========
function showOrdersPage() {
    const page = document.getElementById('orders-page');
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <button class="back-button" onclick="goBack()">
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
                        <div class="catalog-product-item" onclick="showOrderDetails(${order.id})">
                            <div class="catalog-product-icon" style="background: var(--tea-green);">
                                <i class="fas fa-receipt"></i>
                            </div>
                            <div class="catalog-product-info">
                                <div class="catalog-product-name">Заказ #${order.id}</div>
                                <div class="catalog-product-subtitle">${order.timestamp}</div>
                                <div class="catalog-product-price">${order.total}₽</div>
                            </div>
                            <div class="catalog-product-actions">
                                <button class="catalog-add-btn" onclick="event.stopPropagation(); reorder(${order.id})">
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
                <button class="back-button" onclick="showOrdersPage()">
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
    
    if (tg.openLink) {
        tg.openLink(telegramUrl);
    } else {
        window.open(telegramUrl, '_blank');
    }
}

// ========== СТРАНИЦА ПРОФИЛЯ ==========
function showProfilePage() {
    const firstName = userData.first_name || 'Гость';
    const fullName = `${firstName} ${userData.last_name || ''}`.trim();
    const username = userData.username ? `@${userData.username}` : '';
    const hasPhoto = userData.photo_url && userData.photo_url.trim() !== '';
    
    const page = document.getElementById('profile-page');
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <button class="back-button" onclick="goBack()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="page-title">
                    <i class="fas fa-user"></i>
                    <span>Мой профиль</span>
                </div>
                <div style="width: 40px;"></div>
            </div>
        </div>
        
        <div class="page-body">
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
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
                    <div style="text-align: center; padding: 16px; background: var(--tea-bg); 
                         border-radius: var(--radius-md); cursor: pointer;" onclick="showCartPage()">
                        <div style="font-size: 24px; margin-bottom: 8px; color: var(--tea-green);">🛒</div>
                        <div style="font-weight: 700; font-size: 18px; color: var(--tea-text);">${cart.length}</div>
                        <div style="font-size: 12px; color: var(--tea-text-light);">В корзине</div>
                    </div>
                    
                    <div style="text-align: center; padding: 16px; background: var(--tea-bg); 
                         border-radius: var(--radius-md); cursor: pointer;" onclick="showOrdersPage()">
                        <div style="font-size: 24px; margin-bottom: 8px; color: var(--tea-blue);">📦</div>
                        <div style="font-weight: 700; font-size: 18px; color: var(--tea-text);">${orders.length}</div>
                        <div style="font-size: 12px; color: var(--tea-text-light);">Заказов</div>
                    </div>
                </div>
                
                <div style="background: var(--tea-bg); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
                    <h4 style="margin-bottom: 12px; color: var(--tea-text); display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-headset"></i> Контакты поддержки
                    </h4>
                    <div style="color: var(--tea-text-light); font-size: 14px; line-height: 1.6;">
                        <p style="margin-bottom: 12px;">По всем вопросам обращайтесь:</p>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px; background: white; border-radius: var(--radius-sm);">
                            <i class="fab fa-telegram" style="color: var(--tea-blue);"></i>
                            <a href="https://t.me/ivan_likhov" target="_blank" 
                               style="color: var(--tea-blue); text-decoration: none; font-weight: 600; flex: 1;">
                                @ivan_likhov
                            </a>
                            <button onclick="window.open('https://t.me/ivan_likhov', '_blank')" 
                                    style="padding: 4px 12px; background: var(--tea-blue); color: white; 
                                           border: none; border-radius: 12px; font-size: 12px; cursor: pointer;">
                                Написать
                            </button>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: white; border-radius: var(--radius-sm);">
                            <i class="fas fa-phone" style="color: var(--tea-green);"></i>
                            <a href="tel:+79038394670" style="color: var(--tea-green); text-decoration: none; font-weight: 600; flex: 1;">
                                +7 (903) 839-46-70
                            </a>
                            <button onclick="window.location.href = 'tel:+79038394670'" 
                                    style="padding: 4px 12px; background: var(--tea-green); color: white; 
                                           border: none; border-radius: 12px; font-size: 12px; cursor: pointer;">
                                Позвонить
                            </button>
                        </div>
                    </div>
                </div>
                
                <button onclick="window.open('https://t.me/teatea_bar', '_blank')" 
                        style="width: 100%; padding: 14px; background: linear-gradient(135deg, #0088cc, #00aced); 
                               color: white; border: none; border-radius: var(--radius-round); font-weight: 600; 
                               cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <i class="fab fa-telegram"></i> Наш телеграм-канал
                </button>
            </div>
        </div>
    `;
    
    showPage('profile');
}

// ========== КОРЗИНА (ОБНОВЛЕННАЯ) ==========
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
            cartTotal.innerHTML = `Итого: <span>${totalPrice}₽</span>`;
            checkoutBtn.textContent = `Оформить (${totalItems})`;
            checkoutBtn.disabled = false;
        } else {
            cartTotal.innerHTML = `Корзина пуста`;
            checkoutBtn.textContent = 'Оформить';
            checkoutBtn.disabled = true;
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
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
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

// ========== ОФОРМЛЕНИЕ ЗАКАЗА (ОБНОВЛЕННОЕ) ==========
function startCheckout() {
    if (cart.length === 0) {
        showNotification('🛒 Добавьте товары в корзину!', 'gold');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const page = document.getElementById('cart-page');
    
    page.innerHTML += `
        <div id="checkout-modal" class="modal" style="display: flex;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-check-circle"></i> Подтверждение заказа</h3>
                    <button class="modal-close" onclick="document.getElementById('checkout-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 48px; color: var(--tea-green); margin-bottom: 12px;">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <h4 style="margin-bottom: 8px; color: var(--tea-green);">Сумма заказа</h4>
                        <div style="font-size: 32px; font-weight: 800; color: var(--tea-text); margin-bottom: 16px;">${total}₽</div>
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
                    
                    <div style="color: var(--tea-text-light); font-size: 14px; margin-bottom: 20px; text-align: center;">
                        После подтверждения откроется чат с менеджером для уточнения деталей доставки.
                    </div>
                    
                    <div style="display: flex; gap: 12px;">
                        <button onclick="document.getElementById('checkout-modal').remove()" 
                                style="flex: 1; padding: 14px; background: var(--tea-bg); color: var(--tea-text); 
                                       border: none; border-radius: var(--radius-round); font-weight: 600; 
                                       cursor: pointer; transition: all 0.3s var(--ease-smooth);">
                            Отмена
                        </button>
                        <button onclick="confirmCheckout()" 
                                style="flex: 1; padding: 14px; background: linear-gradient(135deg, var(--tea-green), var(--tea-green-light)); 
                                       color: white; border: none; border-radius: var(--radius-round); 
                                       font-weight: 600; cursor: pointer; transition: all 0.3s var(--ease-smooth);">
                            Подтвердить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function confirmCheckout() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
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
            total: item.price * item.quantity
        })),
        total: total,
        timestamp: new Date().toLocaleString('ru-RU')
    };
    
    // Сохраняем заказ
    await saveOrder(order);
    
    // Формируем полное сообщение для Telegram
    const message = `🎉 *Новый заказ #${order.id}*\n\n` +
                   `👤 Покупатель: ${order.user_name}${order.user_username ? ` (@${order.user_username})` : ''}\n` +
                   `💰 Сумма: ${order.total}₽\n` +
                   `📅 Дата: ${order.timestamp}\n\n` +
                   `🛒 Состав заказа:\n` +
                   order.cart.map(item => 
                       `▫️ ${item.name} × ${item.quantity} = ${item.total}₽`
                   ).join('\n') + '\n\n' +
                   `📱 Источник: ТИ•ТИ Чайная лавка\n` +
                   `🆔 ID заказа: ${order.id}`;
    
    // Кодируем сообщение для URL (убираем звёздочки для надежности)
    const cleanMessage = message.replace(/\*/g, '');
    const encodedMessage = encodeURIComponent(cleanMessage);
    
    // Открываем чат с менеджером с полным сообщением
    const telegramUrl = `https://t.me/ivan_likhov?text=${encodedMessage}`;
    
    if (tg.openLink) {
        tg.openLink(telegramUrl);
    } else if (tg.openTelegramLink) {
        tg.openTelegramLink(telegramUrl);
    } else {
        window.open(telegramUrl, '_blank');
    }
    
    // Очищаем корзину
    cart = [];
    await saveCart();
    
    // Показываем успех
    document.getElementById('checkout-modal').remove();
    createConfetti();
    showNotification(`🎉 Заказ #${order.id} на ${total}₽ оформлен! Менеджер свяжется с вами.`, 'green');
    
    // Возвращаемся на главную
    setTimeout(() => {
        showMainPage();
    }, 2000);
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
    `;
    
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 1500);
}

function createConfetti() {
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            left: ${Math.random() * 100}%;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: hsl(${Math.random() * 360}, 100%, 60%);
            animation-delay: ${Math.random() * 0.5}s;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 2000);
    }
}

// ========== ЗАГРУЗКА ==========
document.addEventListener('DOMContentLoaded', initApp);

// Экспортируем функции для глобального использования
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
