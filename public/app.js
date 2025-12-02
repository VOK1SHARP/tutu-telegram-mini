// ===================================
// ТИ•ТИ - ЧАЙНАЯ ЛАВКА (ФИНАЛЬНАЯ ВЕРСИЯ С АНИМАЦИЯМИ)
// Исправлены все проблемы с iOS, добавлены анимации переходов
// ===================================

// Глобальные переменные
let tg = window.Telegram.WebApp;
let cart = [];
let userData = null;
let userId = null;
let isTelegramUser = false;
let orders = [];
let currentPage = 'main';
let isTransitioning = false;

// Определение iOS устройства
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Полный каталог чая с описаниями
const teaCatalog = [
    {
        id: 1,
        name: 'ЛАО ЧА ТОУ',
        subtitle: 'Старые чайные головы',
        type: 'Пуэр',
        price: 1200,
        tag: 'Хит',
        icon: 'fas fa-mountain',
        category: 'puer',
        description: 'Премиальный выдержанный пуэр с богатым земляным вкусом и послевкусием, которое длится часами. Идеален для вечерней медитации. Выдержка более 10 лет.'
    },
    {
        id: 2,
        name: 'ХЭЙ ЦЗИНЬ',
        subtitle: 'Черное золото',
        type: 'Красный чай',
        price: 950,
        tag: 'Популярное',
        icon: 'fas fa-crown',
        category: 'red',
        description: 'Элитный красный чай с нотами шоколада, сухофруктов и меда. Обладает согревающим эффектом и тонким ароматом. Сбор весеннего урожая.'
    },
    {
        id: 3,
        name: 'ЖОУ ГУЙ НУН СЯН',
        subtitle: 'Мясистая корица',
        type: 'Улун',
        price: 1100,
        tag: 'Рекомендуем',
        icon: 'fas fa-spice',
        category: 'oolong',
        description: 'Улун средней ферментации с яркими нотами корицы, карамели и цветочными оттенками. Нежный сладковатый вкус с долгим послевкусием.'
    },
    {
        id: 4,
        name: 'ДЯНЬ ХУН',
        subtitle: 'Красный чай из Юньнани',
        type: 'Красный чай',
        price: 850,
        icon: 'fas fa-fire',
        category: 'red',
        description: 'Классический юньнаньский красный чай с бархатистым вкусом, нотами сухофруктов и легкой сладостью. Традиционная технология обработки.'
    },
    {
        id: 5,
        name: 'ГАБА МАО ЧА',
        subtitle: 'Чай-сырец',
        type: 'Габа',
        price: 1400,
        tag: 'Новинка',
        icon: 'fas fa-brain',
        category: 'gaba',
        description: 'Уникальный чай с повышенным содержанием GABA (гамма-аминомасляной кислоты), способствующей расслаблению и улучшению концентрации.'
    },
    {
        id: 6,
        name: 'ГУ ШУ ХУН ЧА',
        subtitle: 'Красный чай со старых деревьев',
        type: 'Красный чай',
        price: 1300,
        icon: 'fas fa-tree',
        category: 'red',
        description: 'Красный чай со старых деревьев, обладает сложным букетом с нотами меда, орехов и сухофруктов. Возраст деревьев более 100 лет.'
    },
    {
        id: 7,
        name: 'ТЕ ГУАНЬ ИНЬ',
        subtitle: 'Железная богиня милосердия',
        type: 'Улун',
        price: 1050,
        tag: 'Классика',
        icon: 'fas fa-yin-yang',
        category: 'oolong',
        description: 'Знаменитый улун "Железная Богиня Милосердия" с цветочным ароматом и освежающим вкусом. Полуферментированный чай высшего сорта.'
    },
    {
        id: 8,
        name: 'МО ЛИ ХУА ЧА',
        subtitle: 'Жасмин',
        type: 'Зеленый чай',
        price: 900,
        icon: 'fas fa-flower',
        category: 'green',
        description: 'Зеленый чай, ароматизированный цветками жасмина. Нежный цветочный вкус и успокаивающий эффект. Традиционный китайский ароматизированный чай.'
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
    
    // Применяем iOS фиксы
    if (isIOS) {
        document.body.classList.add('ios-device');
        fixIOSViewport();
    }
    
    // Загружаем тему
    setupTheme();
    
    // Инициализация Telegram
    if (typeof window.Telegram !== 'undefined' && tg && tg.initDataUnsafe) {
        try {
            tg.ready();
            tg.expand();
            
            // Устанавливаем тему Telegram
            const isDark = document.body.classList.contains('dark-theme');
            tg.setHeaderColor(isDark ? '#1E1E1E' : '#4CAF50');
            tg.setBackgroundColor(isDark ? '#121212' : '#FFF8F0');
            
            // Включаем тактильную обратную связь
            if (tg.HapticFeedback) {
                window.hapticFeedback = tg.HapticFeedback;
            }
        } catch (error) {
            console.log('Telegram WebApp error:', error);
        }
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
    
    // Добавляем эффект появления
    setTimeout(() => {
        document.getElementById('app').style.opacity = '1';
    }, 100);
}

// Фикс для viewport на iOS
function fixIOSViewport() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    const appHeight = () => {
        const doc = document.documentElement;
        doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    
    window.addEventListener('resize', appHeight);
    appHeight();
}

// Настройка темы
function setupTheme() {
    const savedTheme = localStorage.getItem('tea_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        // Авто режим - используем системную тему
        if (prefersDark) {
            document.body.classList.add('dark-theme');
        }
    }
    
    // Следим за изменениями темы системы (только в авто режиме)
    if (!savedTheme || savedTheme === 'auto') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('tea_theme') || localStorage.getItem('tea_theme') === 'auto') {
                if (e.matches) {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                }
            }
        });
    }
}

// Переключение темы
function toggleTheme(theme) {
    localStorage.setItem('tea_theme', theme);
    
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (theme === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        // Авто режим
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
    
    // Обновляем тему в Telegram WebApp
    if (tg) {
        const isDark = document.body.classList.contains('dark-theme');
        tg.setHeaderColor(isDark ? '#1E1E1E' : '#4CAF50');
        tg.setBackgroundColor(isDark ? '#121212' : '#FFF8F0');
    }
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

// ========== УПРАВЛЕНИЕ СТРАНИЦАМИ С АНИМАЦИЯМИ ==========
function showPage(pageName, direction = 'forward') {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const currentPageEl = document.querySelector('.page.active');
    const nextPageEl = document.getElementById(pageName + '-page');
    
    if (!nextPageEl || currentPageEl === nextPageEl) {
        isTransitioning = false;
        return;
    }
    
    // Скрываем текущую страницу с анимацией
    if (currentPageEl) {
        currentPageEl.classList.remove('active');
        currentPageEl.classList.add('exiting');
        
        setTimeout(() => {
            currentPageEl.classList.remove('exiting');
            currentPageEl.style.display = 'none';
        }, 300);
    }
    
    // Показываем новую страницу с анимацией
    nextPageEl.style.display = 'block';
    setTimeout(() => {
        nextPageEl.classList.add('active');
        currentPage = pageName;
        
        // Обновляем футер корзины на главной
        if (pageName === 'main') {
            setTimeout(updateMainCartFooter, 100);
        }
        
        // Тактильная обратная связь
        if (window.hapticFeedback) {
            window.hapticFeedback.impactOccurred('light');
        }
        
        isTransitioning = false;
    }, 50);
}

function goBack() {
    switch(currentPage) {
        case 'catalog':
        case 'product':
        case 'cart':
        case 'orders':
        case 'profile':
            showMainPage('back');
            break;
        default:
            showMainPage('back');
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
        <!-- Шапка с паттерном и логотипом -->
        <div class="header-with-pattern">
            <div class="logo-centered">
                <img src="tea_tea_logo.png" alt="ТИ•ТИ - Чайная лавка" 
                     onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22 fill=%22%234CAF50%22>🍵</text></svg>';">
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
                    ${teaCategories.map((category, index) => `
                        <div class="category-item" onclick="showCatalogPage('${category.id}')" style="cursor: pointer; animation-delay: ${0.1 + index * 0.05}s">
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
    setTimeout(updateMainCartFooter, 100);
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
            ${filteredTeas.map((tea, index) => `
                <div class="catalog-product-item" onclick="showProductPage(${tea.id})" style="cursor: pointer; animation-delay: ${index * 0.05}s">
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
                <div style="text-align: center; padding: 40px 20px; color: var(--tea-text-light); animation: fadeInUp 0.5s ease">
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
        
        <div class="product-detail">
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
            
            <div class="product-detail-description">
                <h3><i class="fas fa-info-circle"></i> Описание</h3>
                <p>${product.description || 'Аутентичный китайский чай высшего качества. Идеально сбалансированный вкус и аромат.'}</p>
                <p style="margin-top: 12px; font-size: 13px; color: var(--tea-text-light);">
                    <i class="fas fa-truck"></i> Доставка: 1-2 дня<br>
                    <i class="fas fa-box"></i> Фасовка: 100г в вакуумной упаковке<br>
                    <i class="fas fa-leaf"></i> Сбор: весна 2024 года
                </p>
            </div>
            
            <div class="product-detail-actions">
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}); showNotification('✅ ${product.name} добавлен в корзину!', 'green')" style="cursor: pointer;">
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
    
    // Эффект добавления в корзину
    createAddToCartEffect(event);
    showNotification(`✅ ${product.name} добавлен в корзину!`, 'green');
    
    // Тактильная обратная связь
    if (window.hapticFeedback) {
        window.hapticFeedback.impactOccurred('light');
    }
}

// Эффект добавления в корзину
function createAddToCartEffect(clickEvent) {
    const effect = document.createElement('div');
    effect.className = 'add-to-cart-effect';
    effect.innerHTML = '🛒';
    effect.style.cssText = `
        position: fixed;
        font-size: 24px;
        pointer-events: none;
        z-index: 1001;
    `;
    
    // Позиционируем от места клика
    const x = clickEvent.clientX;
    const y = clickEvent.clientY;
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    
    // Конечная позиция (кнопка корзины в футере)
    const footer = document.querySelector('.main-cart-footer');
    if (footer) {
        const rect = footer.getBoundingClientRect();
        const targetX = rect.left + rect.width - 60;
        const targetY = rect.top + 10;
        
        effect.style.setProperty('--tx', (targetX - x) + 'px');
        effect.style.setProperty('--ty', (targetY - y) + 'px');
    }
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 800);
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
                                   font-weight: 600; cursor: pointer; animation: fadeInUp 0.5s ease 0.3s both;">
                        <i class="fas fa-mug-hot"></i> Перейти в каталог
                    </button>
                </div>
            ` : `
                ${cart.map((item, index) => `
                    <div class="cart-item" style="animation-delay: ${index * 0.05}s">
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
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid var(--tea-green); animation: fadeInUp 0.5s ease 0.4s both">
                    <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 700; margin-bottom: 24px;">
                        <span>Итого:</span>
                        <span>${total}₽</span>
                    </div>
                    <button onclick="startCheckout()" 
                            style="width: 100%; padding: 16px; background: linear-gradient(135deg, var(--tea-purple), var(--tea-purple-light)); 
                                   color: white; border: none; border-radius: var(--radius-round); 
                                   font-weight: 600; cursor: pointer; display: flex; align-items: center; 
                                   justify-content: center; gap: 10px; font-size: 16px; animation: pulse 2s infinite;">
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

// ========== ОФОРМЛЕНИЕ ЗАКАЗА (ИСПРАВЛЕННОЕ ДЛЯ iOS) ==========
function startCheckout() {
    if (cart.length === 0) {
        showNotification('🛒 Добавьте товары в корзину!', 'gold');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--tea-overlay);
        backdrop-filter: blur(15px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div class="modal-content">
            <div style="background: linear-gradient(135deg, var(--tea-green), var(--tea-green-dark)); padding: 20px; color: white; text-align: center;">
                <h3 style="margin: 0; font-size: 18px;">Подтверждение заказа</h3>
            </div>
            <div style="padding: 20px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 48px; color: var(--tea-green); margin-bottom: 12px;">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <h4 style="margin-bottom: 8px; color: var(--tea-green);">Сумма заказа</h4>
                    <div style="font-size: 32px; font-weight: 800; margin-bottom: 16px;">${total}₽</div>
                    <p style="color: var(--tea-text-light); font-size: 14px;">${totalItems} товаров</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    ${cart.map(item => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                            <span>${item.name} × ${item.quantity}</span>
                            <span style="font-weight: 600;">${item.price * item.quantity}₽</span>
                        </div>
                    `).join('')}
                </div>
                
                <div style="color: var(--tea-text-light); font-size: 14px; margin-bottom: 20px; text-align: center; padding: 12px; background: rgba(76, 175, 80, 0.1); border-radius: 8px;">
                    <i class="fas fa-info-circle" style="margin-right: 8px;"></i>
                    После подтверждения откроется чат с менеджером
                </div>
                
                <div style="display: flex; gap: 12px;">
                    <button onclick="closeCheckoutModal()" 
                            style="flex: 1; padding: 14px; background: var(--tea-bg); color: var(--tea-text); 
                                   border: none; border-radius: 25px; font-weight: 600; cursor: pointer;">
                        Отмена
                    </button>
                    <button onclick="confirmCheckout()" id="confirm-checkout-btn"
                            style="flex: 1; padding: 14px; background: linear-gradient(135deg, var(--tea-green), var(--tea-green-light)); 
                                   color: white; border: none; border-radius: 25px; font-weight: 600; cursor: pointer;">
                        Подтвердить
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.remove();
}

async function confirmCheckout() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Отключаем кнопку
    const confirmBtn = document.getElementById('confirm-checkout-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }
    
    // Создаем заказ
    const order = {
        id: Date.now().toString().slice(-6),
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
        timestamp: new Date().toLocaleString('ru-RU')
    };
    
    // Сохраняем заказ
    await saveOrder(order);
    
    // Формируем сообщение для Telegram
    const message = `Новый заказ #${order.id}\n` +
                   `Имя: ${order.user_name}${order.user_username ? ` (@${order.user_username})` : ''}\n` +
                   `Сумма: ${order.total}₽\n` +
                   `Товаров: ${totalItems}\n` +
                   `Дата: ${order.timestamp}\n\n` +
                   `Состав заказа:\n` +
                   order.cart.map(item => 
                       `• ${item.name} × ${item.quantity} = ${item.total}₽`
                   ).join('\n');
    
    // Кодируем сообщение
    const encodedMessage = encodeURIComponent(message);
    
    // Создаем URL для Telegram (используем безопасный метод для iOS)
    const telegramUrl = `https://t.me/ivan_likhov?text=${encodedMessage}`;
    
    // Закрываем модальное окно
    closeCheckoutModal();
    
    // Очищаем корзину
    cart = [];
    await saveCart();
    updateCart();
    
    // Показываем уведомление
    showNotification(`🎉 Заказ #${order.id} оформлен! Открываем чат...`, 'green');
    
    // Создаем конфетти эффект
    createConfetti();
    
    // Тактильная обратная связь
    if (window.hapticFeedback) {
        window.hapticFeedback.impactOccurred('heavy');
    }
    
    // Открываем чат с менеджером с задержкой
    setTimeout(() => {
        if (isIOS) {
            // iOS фикс: используем window.location
            window.location.href = telegramUrl;
        } else if (tg && tg.openLink) {
            tg.openLink(telegramUrl);
        } else {
            window.open(telegramUrl, '_blank', 'noopener,noreferrer');
        }
        
        // Возвращаемся на главную через 2 секунды
        setTimeout(() => {
            showMainPage();
        }, 2000);
    }, 1500);
}

// Конфетти эффект
function createConfetti() {
    const colors = ['#4CAF50', '#FFC107', '#F44336', '#2196F3', '#7B1FA2'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}%;
            top: -20px;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1001;
            animation: confettiFall ${Math.random() * 2 + 1}s linear forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
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
                    <div style="text-align: center; padding: 60px 20px; animation: fadeInUp 0.5s ease">
                        <i class="fas fa-box-open" style="font-size: 64px; color: var(--tea-text-lighter); margin-bottom: 20px;"></i>
                        <h3 style="color: var(--tea-text-light); margin-bottom: 10px;">Заказов пока нет</h3>
                        <p style="color: var(--tea-text-lighter); font-size: 14px;">Совершите первую покупку!</p>
                    </div>
                ` : `
                    ${orders.slice().reverse().map((order, index) => `
                        <div class="catalog-product-item" onclick="showOrderDetails(${order.id})" style="cursor: pointer; animation-delay: ${index * 0.05}s">
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
    const order = orders.find(o => o.id == orderId);
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
            <div style="padding: var(--space-lg); animation: fadeInUp 0.5s ease">
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
    const order = orders.find(o => o.id == orderId);
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
            <div style="text-align: center; padding: var(--space-lg); animation: fadeInUp 0.5s ease 0.1s both">
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
                         border-radius: var(--radius-md); animation: fadeInUp 0.5s ease 0.2s both">
                        <div style="font-size: 24px; margin-bottom: 8px; color: var(--tea-green);">🛒</div>
                        <div style="font-weight: 700; font-size: 18px; color: var(--tea-text);">${cart.length}</div>
                        <div style="font-size: 12px; color: var(--tea-text-light);">В корзине</div>
                    </div>
                    
                    <div style="text-align: center; padding: 16px; background: var(--tea-bg); 
                         border-radius: var(--radius-md);" onclick="showOrdersPage()" style="cursor: pointer; animation: fadeInUp 0.5s ease 0.25s both">
                        <div style="font-size: 24px; margin-bottom: 8px; color: var(--tea-blue);">📦</div>
                        <div style="font-weight: 700; font-size: 18px; color: var(--tea-text);">${totalOrders}</div>
                        <div style="font-size: 12px; color: var(--tea-text-light);">Заказов</div>
                    </div>
                    
                    <div style="text-align: center; padding: 16px; background: var(--tea-bg); 
                         border-radius: var(--radius-md); animation: fadeInUp 0.5s ease 0.3s both">
                        <div style="font-size: 24px; margin-bottom: 8px; color: var(--tea-gold);">💰</div>
                        <div style="font-weight: 700; font-size: 18px; color: var(--tea-text);">${totalSpent}₽</div>
                        <div style="font-size: 12px; color: var(--tea-text-light);">Потрачено</div>
                    </div>
                    
                    <div style="text-align: center; padding: 16px; background: var(--tea-bg); 
                         border-radius: var(--radius-md); animation: fadeInUp 0.5s ease 0.35s both">
                        <div style="font-size: 24px; margin-bottom: 8px; color: var(--tea-purple);">⭐</div>
                        <div style="font-weight: 700; font-size: 18px; color: var(--tea-text);">${orders.length > 0 ? 'Постоянный' : 'Новый'}</div>
                        <div style="font-size: 12px; color: var(--tea-text-light);">Статус</div>
                    </div>
                </div>
                
                <!-- Контакты поддержки -->
                <div style="background: var(--tea-bg); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px; animation: fadeInUp 0.5s ease 0.4s both">
                    <h4 style="margin-bottom: 12px; color: var(--tea-text); display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-headset"></i> Контакты поддержки
                    </h4>
                    <div style="color: var(--tea-text-light); font-size: 14px; line-height: 1.6;">
                        <p style="margin-bottom: 12px;">По всем вопросам обращайтесь:</p>
                        <div class="contact-support-item" style="animation-delay: 0.45s">
                            <i class="fab fa-telegram"></i>
                            <span>@ivan_likhov</span>
                            <button onclick="openTelegramLink('https://t.me/ivan_likhov')">
                                Написать
                            </button>
                        </div>
                        <div class="contact-support-item phone-item" style="animation-delay: 0.5s">
                            <i class="fas fa-phone"></i>
                            <span>+7 (903) 839-46-70</span>
                            <button onclick="window.location.href = 'tel:+79038394670'">
                                Позвонить
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Настройки -->
                <div style="background: var(--tea-bg); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px; animation: fadeInUp 0.5s ease 0.55s both">
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
                            <select onchange="toggleTheme(this.value)" style="padding: 4px 8px; border-radius: 8px; border: 1px solid var(--tea-green);">
                                <option value="auto">Авто</option>
                                <option value="light">Светлая</option>
                                <option value="dark">Темная</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Кнопки действий -->
                <div style="display: flex; flex-direction: column; gap: 12px; animation: fadeInUp 0.5s ease 0.6s both">
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
    
    // Устанавливаем текущую тему в селекторе
    setTimeout(() => {
        const themeSelect = page.querySelector('select');
        if (themeSelect) {
            const savedTheme = localStorage.getItem('tea_theme') || 'auto';
            themeSelect.value = savedTheme;
        }
    }, 100);
    
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
    notification.className = `tea-notification notification-${type} swipe-notification`;
    
    // Проверяем, есть ли эмодзи в начале сообщения
    const hasEmoji = /^[^\w\s]/.test(message);
    const displayMessage = hasEmoji ? message : `✅ ${message}`;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'green' ? 'check-circle' : type === 'red' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${displayMessage}</span>
    `;
    
    container.appendChild(notification);
    
    // Добавляем свайп-функционал
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;
    let swipeDistance = 0;
    
    notification.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        notification.classList.add('swiping');
    }, { passive: true });
    
    notification.addEventListener('touchmove', (e) => {
        if (!startX) return;
        
        currentX = e.touches[0].clientX;
        swipeDistance = currentX - startX;
        
        // Разрешаем только свайп вправо (для удаления)
        if (swipeDistance > 0) {
            notification.style.transform = `translateX(${Math.min(swipeDistance, 100)}px)`;
            notification.style.opacity = `${1 - Math.min(swipeDistance, 100) / 200}`;
            isSwiping = true;
        }
    }, { passive: true });
    
    notification.addEventListener('touchend', () => {
        notification.classList.remove('swiping');
        
        // Если свайпнули достаточно далеко - удаляем
        if (swipeDistance > 60) {
            notification.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        } else {
            // Возвращаем на место
            notification.style.transition = 'transform 0.3s ease';
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }
        
        startX = 0;
        currentX = 0;
        isSwiping = false;
        swipeDistance = 0;
    }, { passive: true });
    
    // Автоудаление через 3 секунды
    const autoRemove = setTimeout(() => {
        if (notification.parentNode && !isSwiping) {
            notification.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
    
    // Отменяем автоудаление если начали свайп
    notification.addEventListener('touchstart', () => {
        clearTimeout(autoRemove);
    }, { once: true });
    
    // Тактильная обратная связь
    if (window.hapticFeedback) {
        window.hapticFeedback.notificationOccurred('success');
    }
}

// Универсальная функция открытия ссылок
function openTelegramLink(url) {
    if (tg && tg.openLink) {
        tg.openLink(url);
    } else if (isIOS) {
        // iOS фикс
        window.location.href = url;
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
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
window.toggleTheme = toggleTheme;
