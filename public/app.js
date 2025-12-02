// ===================================
// ТИ•ТИ - ЧАЙНАЯ ЛАВКА
// Полностью рабочий JavaScript код
// ===================================

// Глобальные переменные
let tg = window.Telegram.WebApp;
let cart = [];
let userData = null;
let userId = null;
let isTelegramUser = false;
let orders = [];

// Каталог чая
const teaCatalog = [
    {
        id: 1,
        name: 'ЛАО ЧА ТОУ',
        subtitle: 'Старые чайные головы',
        type: 'Пуэр',
        price: 1200,
        description: 'Насыщенный и бархатистый. Настой — густой, тёмно-коричневый с рубиновыми отблесками. Во вкусе преобладают тёплые ноты ореха, карамели, сухофруктов и лёгкой древесной горчинки.',
        brewing: ['🌿 5 гр чая на 500 мл воды', '🌡 температура 95°C и выше', '⏳ время заваривания — 3-5 минут'],
        benefits: [
            '♥️ мощный природный антиоксидант, укрепляет сердце и сосуды',
            '🦠 укрепляет иммунную систему',
            '⚡️способствует улучшению работы нервной системы'
        ],
        tag: 'Хит',
        icon: 'fas fa-mountain'
    },
    {
        id: 2,
        name: 'ХЭЙ ЦЗИНЬ',
        subtitle: 'Черное золото',
        type: 'Красный чай',
        price: 950,
        description: 'Аромат сладости пронизывает тело, становясь его основной нотой. Настой гладкий, сладкий, приятный, с едва заметной кислинкой.',
        brewing: ['🌿 5-8 гр на 150-200 мл воды', '🌡 температура 85-95°C', '⏳ второй на 20-30 секунд'],
        benefits: [
            '❄️ согревает в холодные дни',
            '🏡 снимает усталость и дарит ощущение уюта',
            '🦠 помогает при простудных заболеваниях'
        ],
        tag: 'Популярное',
        icon: 'fas fa-crown'
    },
    {
        id: 3,
        name: 'ЖОУ ГУЙ НУН СЯН',
        subtitle: 'Мясистая корица',
        type: 'Улун',
        price: 1100,
        description: 'Чай для концентрации, погружения, имеет приятный ярко выраженный топленый вкус с ореховыми нотками.',
        brewing: ['🌿 5-8 гр на 150-200 мл воды', '🌡 температура 80-90°C', '⏳ второй на 30-40 секунд'],
        benefits: [
            '🦋 стимулирует обмен веществ',
            '❤️ снижает уровень вредного холестерина',
            '😴 успокаивающе воздействует на нервную систему'
        ],
        tag: 'Рекомендуем',
        icon: 'fas fa-spice'
    },
    {
        id: 4,
        name: 'ДЯНЬ ХУН',
        subtitle: 'Красный чай из Юньнани',
        type: 'Красный чай',
        price: 850,
        description: 'Теплый, хлебно-медовый аромат. Вкус прямой и насыщенный, мягкая сладость, небольшая терпкость.',
        brewing: ['🌿 5-8 гр на 150-200 мл воды', '🌡 температура 85-95°C', '⏳ второй на 20-30 секунд'],
        benefits: [
            '❄️ согревает в холодные дни',
            '🏡 снимает усталость',
            '🦠 помогает при простудных заболеваниях'
        ],
        icon: 'fas fa-fire'
    },
    {
        id: 5,
        name: 'ГАБА МАО ЧА',
        subtitle: 'Чай-сырец',
        type: 'Габа',
        price: 1400,
        description: 'В аромате жареные семечки, кедровые орехи переходящие в свежий мёд. Во вкусе кешью, кедровые орешки.',
        brewing: ['🌿 5-8 гр на 150-200 мл воды', '🌡 температура 85°C', '⏳ второй на 20-30 секунд'],
        benefits: [
            '♥️ полезен для сердечно-сосудистой системы',
            '🥣 улучшает работу пищеварительной системы',
            '👳‍♂️снимает головные боли'
        ],
        tag: 'Новинка',
        icon: 'fas fa-brain'
    },
    {
        id: 6,
        name: 'ГУ ШУ ХУН ЧА',
        subtitle: 'Красный чай со старых деревьев',
        type: 'Красный чай',
        price: 1300,
        description: 'Насыщенные медово-сливовые оттенки, небольшая маслянистость, абрикосовая легкая косточка.',
        brewing: ['🌿 5-8 гр на 150-200 мл воды', '🌡 температура 85-90°C', '⏳ второй на 20-30 секунд'],
        benefits: [
            '❄️ согревает в холодные дни',
            '🏡 снимает усталость',
            '🦠 помогает при простудных заболеваниях'
        ],
        icon: 'fas fa-tree'
    },
    {
        id: 7,
        name: 'ТЕ ГУАНЬ ИНЬ',
        subtitle: 'Железная богиня милосердия',
        type: 'Улун',
        price: 1050,
        description: 'Классический расслабляющий светлый улун с интересной и многогранной лугово-травной и цветочной вкусоароматикой.',
        brewing: ['🌿 5-8 гр на 150-200 мл воды', '🌡 температура 85°C', '⏳ второй на 20-25 секунд'],
        benefits: [
            '👨🏻‍🦳 содержит антиоксиданты',
            '🦷 профилактика заболеваний зубов',
            '❤️ положительно сказывается на здоровье сердца'
        ],
        tag: 'Классика',
        icon: 'fas fa-yin-yang'
    },
    {
        id: 8,
        name: 'МО ЛИ ХУА ЧА',
        subtitle: 'Жасмин',
        type: 'Зеленый чай',
        price: 900,
        description: 'Свежий жасминовый аромат с нежными цветочными оттенками, вкус сбалансированный и приятный.',
        brewing: ['🌿 5-8 гр на 150-200 мл воды', '🌡 температура 70°C', '⏳ второй на 20-40 секунд'],
        benefits: [
            '🧘🏻‍♀️ снимает стресс',
            '🦋 способствует похудению',
            '✨ выводит шлаки и токсины'
        ],
        icon: 'fas fa-flower'
    }
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
    
    // Показываем интерфейс
    showMainInterface();
    
    // Скрываем загрузчик
    setTimeout(() => {
        document.getElementById('app').style.display = 'block';
        showNotification('🍵 Добро пожаловать в чайную гармонию!', 'green');
    }, 500);
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
    
    // Обновляем счетчик
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    // Обновляем футер
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cartTotal && checkoutBtn) {
        if (totalItems > 0) {
            cartTotal.innerHTML = `Итого: <span>${totalPrice}₽</span>`;
            checkoutBtn.textContent = `Оформить (${totalItems})`;
            checkoutBtn.disabled = false;
        } else {
            cartTotal.innerHTML = `Корзина пуста`;
            checkoutBtn.textContent = 'Добавьте товары';
            checkoutBtn.disabled = true;
        }
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

// ========== ОСНОВНОЙ ИНТЕРФЕЙС ==========
function showMainInterface() {
    const app = document.getElementById('app');
    
    const firstName = userData.first_name || 'Гость';
    const lastName = userData.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const username = userData.username ? `@${userData.username}` : '';
    const hasPhoto = userData.photo_url && userData.photo_url.trim() !== '';
    
    app.innerHTML = `
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="logo" onclick="showFullCatalog()">
                    <div class="logo-icon">
                        <i class="fas fa-leaf"></i>
                    </div>
                    <div class="logo-text">
                        <h1>ТИ•ТИ</h1>
                        <div class="subtitle">Чайная лавка</div>
                    </div>
                </div>
                <div class="user-avatar" onclick="showProfile()">
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
        
        <!-- Welcome Banner -->
        <div class="welcome-banner fade-in">
            <div class="banner-content">
                <h2>${getWelcomeMessage()}</h2>
                <p>${isTelegramUser ? 'Рады видеть вас снова!' : 'Аутентичный китайский чай с доставкой'}</p>
                <div class="banner-actions">
                    <button class="catalog-btn" onclick="showFullCatalog()">
                        <i class="fas fa-search"></i> Искать чай
                    </button>
                    <button class="popular-btn" onclick="scrollToPopular()">
                        <i class="fas fa-fire"></i> Популярное
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Navigation -->
        <div class="nav-grid">
            <div class="nav-item" onclick="showFullCatalog()">
                <div class="nav-icon icon-tea">
                    <i class="fas fa-mug-hot"></i>
                </div>
                <h3>Каталог</h3>
                <p>${teaCatalog.length}+ сортов</p>
            </div>
            
            <div class="nav-item" onclick="showOrders()">
                <div class="nav-icon icon-orders">
                    <i class="fas fa-box"></i>
                </div>
                <h3>Заказы</h3>
                <p>История покупок</p>
            </div>
            
            <div class="nav-item" onclick="showCartModal()">
                <div class="nav-icon icon-cart">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3>Корзина</h3>
                <p>Товары: <span class="cart-count">0</span></p>
            </div>
            
            <div class="nav-item" onclick="showProfile()">
                <div class="nav-icon icon-profile">
                    <i class="fas fa-user"></i>
                </div>
                <h3>Профиль</h3>
                <p>${username || 'Ваш профиль'}</p>
            </div>
        </div>
        
        <!-- Popular Products -->
        <div class="products-section">
            <h2 class="section-title">
                <i class="fas fa-fire"></i> Популярное
            </h2>
            <div class="products-grid" id="popular-products"></div>
        </div>
        
        <!-- Cart Footer -->
        <div class="cart-footer">
            <div class="cart-content">
                <div class="cart-total" id="cart-total">Корзина пуста</div>
                <button class="checkout-button" id="checkout-btn" onclick="checkout()" disabled>
                    <i class="fas fa-paper-plane"></i> Оформить
                </button>
            </div>
        </div>
    `;
    
    loadPopularProducts();
    updateCart();
}

function getWelcomeMessage() {
    const hour = new Date().getHours();
    const firstName = userData.first_name || 'друг';
    
    if (hour >= 5 && hour < 12) return `☀️ Доброе утро, ${firstName}!`;
    if (hour >= 12 && hour < 18) return `🌤 Добрый день, ${firstName}!`;
    if (hour >= 18 && hour < 23) return `🌙 Добрый вечер, ${firstName}!`;
    return `🌜 Доброй ночи, ${firstName}!`;
}

function scrollToPopular() {
    const section = document.querySelector('.products-section');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        section.classList.add('text-vibrate');
        setTimeout(() => section.classList.remove('text-vibrate'), 1000);
    }
}

// ========== ТОВАРЫ ==========
function loadPopularProducts() {
    const popularTeas = teaCatalog.filter(tea => tea.tag).slice(0, 4);
    const container = document.getElementById('popular-products');
    
    container.innerHTML = popularTeas.map(tea => `
        <div class="product-card" onclick="showProduct(${tea.id})">
            <div class="product-image ${getTeaTypeClass(tea.type)}">
                ${tea.tag ? `<div class="product-tag">${tea.tag}</div>` : ''}
                <i class="${tea.icon || 'fas fa-leaf'}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-name">${tea.name}</h3>
                <div class="product-subtitle">${tea.subtitle}</div>
                <div class="product-price">${tea.price}₽</div>
                <button class="product-button" onclick="event.stopPropagation(); addToCart(${tea.id})">
                    <i class="fas fa-cart-plus"></i> В корзину
                </button>
            </div>
        </div>
    `).join('');
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

// ========== КАТАЛОГ ==========
function showFullCatalog() {
    const modal = document.getElementById('catalog-modal');
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-mug-hot"></i> Каталог чая</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                ${teaCatalog.map(tea => `
                    <div class="catalog-item" onclick="showProduct(${tea.id})">
                        <div class="tea-icon ${getTeaTypeClass(tea.type)}">
                            <i class="${tea.icon || 'fas fa-leaf'}"></i>
                        </div>
                        <div class="tea-info">
                            <div class="tea-name">${tea.name}</div>
                            <div class="tea-subtitle">${tea.subtitle}</div>
                            <div class="tea-price">${tea.price}₽</div>
                        </div>
                        <button class="add-btn" onclick="event.stopPropagation(); addToCart(${tea.id})">
                            + Добавить
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// ========== ПРОДУКТ ==========
function showProduct(productId) {
    const product = teaCatalog.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="${product.icon || 'fas fa-leaf'}"></i> ${product.name}</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="font-size: 16px; font-weight: 600; color: var(--tea-text);">${product.subtitle}</div>
                        <div style="background: var(--tea-green); color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
                            ${product.type}
                        </div>
                    </div>
                    ${product.tag ? `
                        <div style="background: var(--tea-gold); color: white; padding: 4px 10px; border-radius: 10px; 
                             display: inline-block; margin-bottom: 15px; font-size: 12px; font-weight: 600;">
                            ${product.tag}
                        </div>
                    ` : ''}
                </div>
                
                <div style="background: var(--tea-bg); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
                    <h4 style="margin-bottom: 10px; color: var(--tea-text); font-size: 15px;">Описание:</h4>
                    <p style="color: var(--tea-text-light); line-height: 1.5; font-size: 14px;">${product.description}</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="margin-bottom: 10px; color: var(--tea-text); font-size: 15px;">🍶 Способ заваривания:</h4>
                    <ul style="color: var(--tea-text-light); padding-left: 20px; line-height: 1.6; font-size: 14px;">
                        ${product.brewing.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h4 style="margin-bottom: 10px; color: var(--tea-text); font-size: 15px;">🌿 Полезные свойства:</h4>
                    <ul style="color: var(--tea-text-light); padding-left: 20px; line-height: 1.6; font-size: 14px;">
                        ${product.benefits.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid rgba(142, 110, 99, 0.1);">
                    <div style="font-size: 24px; font-weight: 800; color: var(--tea-green);">${product.price}₽</div>
                    <button onclick="addToCart(${product.id}); closeModal();" 
                            style="padding: 12px 24px; background: linear-gradient(135deg, var(--tea-green), var(--tea-green-light)); 
                                   color: white; border: none; border-radius: var(--radius-round); font-weight: 600; 
                                   cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px;">
                        <i class="fas fa-cart-plus"></i> Добавить в корзину
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// ========== ДОБАВЛЕНИЕ В КОРЗИНУ ==========
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

// ========== КОРЗИНА ==========
function showCartModal() {
    if (cart.length === 0) {
        showNotification('🛒 Корзина пуста', 'gold');
        return;
    }
    
    const modal = document.getElementById('cart-modal');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-shopping-cart"></i> Корзина</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="max-height: 40vh; overflow-y: auto; margin-bottom: 20px;">
                    ${cart.map(item => `
                        <div style="display: flex; justify-content: space-between; align-items: center; 
                             padding: 12px; border-bottom: 1px solid rgba(142, 110, 99, 0.1); 
                             background: var(--tea-bg); border-radius: var(--radius-md); margin-bottom: 8px;">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; margin-bottom: 4px; font-size: 15px;">${item.name}</div>
                                <div style="font-size: 13px; color: var(--tea-text-light);">${item.type} • ${item.price}₽/шт</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="display: flex; align-items: center; gap: 8px; background: white; 
                                     padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(142, 110, 99, 0.1);">
                                    <button onclick="updateQuantity(${item.id}, -1)" 
                                            style="width: 28px; height: 28px; border-radius: 50%; border: none; 
                                                   background: var(--tea-bg); cursor: pointer; display: flex; 
                                                   align-items: center; justify-content: center; font-size: 18px; color: var(--tea-text);">
                                        −
                                    </button>
                                    <span style="font-weight: 600; min-width: 24px; text-align: center;">${item.quantity}</span>
                                    <button onclick="updateQuantity(${item.id}, 1)" 
                                            style="width: 28px; height: 28px; border-radius: 50%; border: none; 
                                                   background: var(--tea-green); color: white; cursor: pointer; 
                                                   display: flex; align-items: center; justify-content: center; font-size: 18px;">
                                        +
                                    </button>
                                </div>
                                <div style="font-weight: 700; color: var(--tea-green); min-width: 60px; text-align: right; font-size: 16px;">
                                    ${item.price * item.quantity}₽
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--tea-green);">
                    <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; margin-bottom: 16px;">
                        <span>Итого:</span>
                        <span>${total}₽</span>
                    </div>
                    <button onclick="startCheckout()" 
                            style="width: 100%; padding: 14px; background: linear-gradient(135deg, var(--tea-purple), var(--tea-purple-light)); 
                                   color: white; border: none; border-radius: var(--radius-round); font-weight: 600; 
                                   cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 15px;">
                        <i class="fas fa-paper-plane"></i> Оформить заказ
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }
    
    saveCart();
    
    if (cart.length === 0) {
        closeModal();
        showNotification('Корзина очищена', 'gold');
    } else {
        showCartModal();
    }
}

// ========== ОФОРМЛЕНИЕ ЗАКАЗА ==========
function startCheckout() {
    const modal = document.getElementById('checkout-modal');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-check-circle"></i> Подтверждение заказа</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
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
                    После подтверждения заказа наш менеджер свяжется с вами в Telegram для уточнения деталей доставки.
                </div>
                
                <div style="display: flex; gap: 12px;">
                    <button onclick="closeModal()" 
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
    `;
    
    modal.style.display = 'flex';
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
    
    // Формируем сообщение для Telegram
    const message = `🎉 *Новый заказ #${order.id}*\n\n` +
                   `👤 *Покупатель:* ${order.user_name}${order.user_username ? ` (@${order.user_username})` : ''}\n` +
                   `💰 *Сумма:* ${order.total}₽\n` +
                   `📅 *Дата:* ${order.timestamp}\n\n` +
                   `🛒 *Состав заказа:*\n` +
                   order.cart.map(item => `▫️ ${item.name} × ${item.quantity} = ${item.total}₽`).join('\n') + '\n\n' +
                   `📱 *Источник:* ТИ•ТИ Чайная лавка\n` +
                   `🆔 *ID заказа:* ${order.id}`;
    
    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    
    // Пытаемся отправить через Telegram WebApp
    if (tg.sendData) {
        try {
            tg.sendData(JSON.stringify({
                action: 'checkout',
                order_id: order.id,
                user_name: order.user_name,
                cart: order.cart,
                total: order.total
            }));
        } catch (error) {
            console.log('WebApp sendData failed:', error);
        }
    }
    
    // Открываем чат с менеджером
    const telegramUrl = `https://t.me/ivan_likhov?text=${encodedMessage}`;
    
    if (tg.openLink) {
        tg.openLink(telegramUrl);
    } else {
        window.open(telegramUrl, '_blank');
    }
    
    // Очищаем корзину
    cart = [];
    await saveCart();
    
    // Показываем успех
    closeModal();
    createConfetti();
    showNotification(`🎉 Заказ #${order.id} оформлен! Менеджер свяжется с вами.`, 'green');
    
    // Показываем кнопку для копирования заказа
    setTimeout(() => {
        showOrderSuccess(order);
    }, 1000);
}

function showOrderSuccess(order) {
    const modal = document.getElementById('checkout-modal');
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header" style="background: linear-gradient(135deg, var(--tea-green), var(--tea-green-light));">
                <h3><i class="fas fa-check-circle"></i> Заказ оформлен!</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 64px; color: var(--tea-green); margin-bottom: 16px;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h4 style="margin-bottom: 8px; color: var(--tea-green);">Заказ #${order.id}</h4>
                    <div style="font-size: 28px; font-weight: 800; color: var(--tea-text); margin-bottom: 16px;">${order.total}₽</div>
                </div>
                
                <div style="background: var(--tea-bg); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
                    <p style="margin-bottom: 12px; color: var(--tea-text-light); font-size: 14px;">
                        Ваш заказ принят! Скоро с вами свяжется менеджер @ivan_likhov для уточнения деталей доставки.
                    </p>
                </div>
                
                <div style="display: flex; gap: 12px; flex-direction: column;">
                    <button onclick="copyToClipboard('${order.id}', '${order.total}')" 
                            style="width: 100%; padding: 14px; background: var(--tea-bg); color: var(--tea-text); 
                                   border: 1px solid var(--tea-green); border-radius: var(--radius-round); 
                                   font-weight: 600; cursor: pointer; display: flex; align-items: center; 
                                   justify-content: center; gap: 8px; transition: all 0.3s var(--ease-smooth);">
                        <i class="fas fa-copy"></i> Скопировать данные заказа
                    </button>
                    
                    <button onclick="window.open('https://t.me/ivan_likhov', '_blank')" 
                            style="width: 100%; padding: 14px; background: linear-gradient(135deg, #0088cc, #00aced); 
                                   color: white; border: none; border-radius: var(--radius-round); 
                                   font-weight: 600; cursor: pointer; display: flex; align-items: center; 
                                   justify-content: center; gap: 8px; transition: all 0.3s var(--ease-smooth);">
                        <i class="fab fa-telegram"></i> Написать менеджеру
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function copyToClipboard(orderId, total) {
    const text = `Заказ #${orderId}\nСумма: ${total}₽\nДата: ${new Date().toLocaleString('ru-RU')}`;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('📋 Данные заказа скопированы!', 'green');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('📋 Данные заказа скопированы!', 'green');
    });
}

// ========== ЗАКАЗЫ ==========
async function showOrders() {
    const orders = await loadOrders();
    const modal = document.getElementById('order-modal');
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-box"></i> История заказов</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                ${orders.length === 0 ? `
                    <div style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 48px; color: #ddd; margin-bottom: 20px;">
                            <i class="fas fa-box-open"></i>
                        </div>
                        <h4 style="color: var(--tea-text-light); margin-bottom: 10px;">Заказов пока нет</h4>
                        <p style="color: var(--tea-text-lighter); font-size: 14px;">Совершите первую покупку!</p>
                    </div>
                ` : `
                    <div style="max-height: 50vh; overflow-y: auto;">
                        ${orders.slice().reverse().map(order => `
                            <div style="background: var(--tea-bg); border-radius: var(--radius-md); 
                                 padding: 16px; margin-bottom: 12px; cursor: pointer; 
                                 transition: all 0.3s var(--ease-smooth);" 
                                 onclick="showOrderDetails(${order.id})">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <div style="font-weight: 600; color: var(--tea-text);">Заказ #${order.id}</div>
                                    <div style="color: var(--tea-green); font-weight: 700; font-size: 18px;">${order.total}₽</div>
                                </div>
                                <div style="font-size: 13px; color: var(--tea-text-light); margin-bottom: 8px;">
                                    ${order.timestamp}
                                </div>
                                <div style="font-size: 14px; color: var(--tea-text-lighter);">
                                    Товаров: ${order.cart.reduce((sum, item) => sum + item.quantity, 0)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function showOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('order-modal');
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-receipt"></i> Заказ #${order.id}</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--tea-text-light);">Дата:</span>
                        <span style="font-weight: 600;">${order.timestamp}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: var(--tea-text-light);">Покупатель:</span>
                        <span style="font-weight: 600;">${order.user_name}</span>
                    </div>
                </div>
                
                <div style="background: var(--tea-bg); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
                    <h4 style="margin-bottom: 12px; color: var(--tea-text);">Состав заказа:</h4>
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
                
                <button onclick="showOrders()" 
                        style="width: 100%; padding: 12px; background: var(--tea-bg); color: var(--tea-text); 
                               border: none; border-radius: var(--radius-round); font-weight: 600; 
                               cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-arrow-left"></i> Назад к заказам
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// ========== ПРОФИЛЬ ==========
function showProfile() {
    const modal = document.getElementById('profile-modal');
    const firstName = userData.first_name || 'Гость';
    const fullName = `${firstName} ${userData.last_name || ''}`.trim();
    const username = userData.username ? `@${userData.username}` : '';
    const hasPhoto = userData.photo_url && userData.photo_url.trim() !== '';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-user"></i> Мой профиль</h3>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 24px;">
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
                    ${userData.id ? `<p style="color: var(--tea-text-lighter); font-size: 12px; margin-top: 4px;">ID: ${userData.id}</p>` : ''}
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
                    <div style="text-align: center; padding: 16px; background: var(--tea-bg); 
                         border-radius: var(--radius-md); transition: all 0.3s var(--ease-smooth); cursor: pointer;"
                         onclick="showCartModal()">
                        <div style="font-size: 24px; margin-bottom: 8px; color: var(--tea-green);">🛒</div>
                        <div style="font-weight: 700; font-size: 18px; color: var(--tea-text);">${cart.length}</div>
                        <div style="font-size: 12px; color: var(--tea-text-light);">В корзине</div>
                    </div>
                    
                    <div style="text-align: center; padding: 16px; background: var(--tea-bg); 
                         border-radius: var(--radius-md); transition: all 0.3s var(--ease-smooth); cursor: pointer;"
                         onclick="showOrders()">
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
                        <p style="margin-bottom: 8px;">По всем вопросам обращайтесь:</p>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <i class="fab fa-telegram" style="color: var(--tea-blue);"></i>
                            <a href="https://t.me/ivan_likhov" target="_blank" 
                               style="color: var(--tea-blue); text-decoration: none; font-weight: 600;">
                                @ivan_likhov
                            </a>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-phone" style="color: var(--tea-green);"></i>
                            <a href="tel:+79038394670" style="color: var(--tea-green); text-decoration: none; font-weight: 600;">
                                +7 (903) 839-46-70
                            </a>
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
    
    modal.style.display = 'flex';
}

// ========== УТИЛИТЫ ==========
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Уведомления
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

// Эффекты
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
    for (let i = 0; i < 30; i++) {
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

// Обработчики Telegram событий
if (tg) {
    tg.onEvent('viewportChanged', (event) => {
        console.log('Viewport changed:', event);
    });
    
    tg.onEvent('themeChanged', () => {
        console.log('Theme changed');
    });
}

// Сохраняем корзину при закрытии
window.addEventListener('beforeunload', () => {
    saveCart();
});

// Экспортируем функции для глобального использования
window.addToCart = addToCart;
window.showProduct = showProduct;
window.showFullCatalog = showFullCatalog;
window.showCartModal = showCartModal;
window.showOrders = showOrders;
window.showProfile = showProfile;
window.closeModal = closeModal;
window.updateQuantity = updateQuantity;
window.startCheckout = startCheckout;
window.confirmCheckout = confirmCheckout;
window.copyToClipboard = copyToClipboard;
window.scrollToPopular = scrollToPopular;
