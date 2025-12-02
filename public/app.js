// ===================================
// ТИ•ТИ - ЧАЙНАЯ ЛАВКА (ФИНАЛЬНАЯ ВЕРСИЯ)
// Исправлены все проблемы с iPhone и оформлением заказа
// ===================================

// Глобальные переменные
let tg = window.Telegram.WebApp;
let cart = [];
let userData = null;
let userId = null;
let isTelegramUser = false;
let orders = [];
let currentPage = 'main';

// Полный каталог чая с правильным описанием
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
        description: 'Насыщенный и бархатистый. Настой — густой, тёмно-коричневый с рубиновыми отблесками. Во вкусе преобладают тёплые ноты ореха, карамели, сухофруктов и лёгкой древесной горчинки. Послевкусие долгое, с приятными сладковатыми и пряными оттенками.',
        brewing: [
            '🌿 5 гр чая на 500 мл воды',
            '🌡 температура 95°C и выше',
            '⏳ время заваривания — 3-5 минут',
            'Впоследствии эту же заварку можно залить повторно до половины чайника несколько раз'
        ],
        benefits: [
            '♥️ мощный природный антиоксидант, укрепляет сердце и сосуды, снимает воспаление',
            '🦠 укрепляет иммунную систему и повышает сопротивляемость вирусам и простудным заболеваниям',
            '⚡️способствует улучшению работы нервной системы, придает организму энергию, устраняет головную боль'
        ]
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
        description: 'Аромат сладости пронизывает тело, становясь его основной нотой, окруженной едва заметным пряно-древесным ореолом. Настой гладкий, сладкий, приятный, с едва заметной кислинкой. Послевкусие тонкое, карамельное, в нем различаются оттенки ванили.',
        brewing: [
            'Проливами:',
            '🌿 5-8 гр на 150-200 мл воды',
            '🌡 температура 85-95°C',
            '🫖 первый пролив слить',
            '⏳ второй на 20-30 секунд',
            '➕ последующие дольше на 10 секунд',
            '',
            'Настаиванием:',
            '🌿 5 гр чая на 500 мл воды',
            '🌡 температура 85-95°C',
            '⏳ время заваривания — 3-5 минут'
        ],
        benefits: [
            '❄️ согревает в холодные дни',
            '🏡 снимает усталость и дарит ощущение уюта и гармонии',
            '🦠 помогает при простудных заболеваниях, так как расширяет дыхательные пути',
            '🧠 способствует улучшению памяти и работы мозга'
        ]
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
        description: 'Чай для концентрации, погружения, имеет приятный ярко выраженный топленый вкус с ореховыми нотками, приятный аромат, согревает и успокаивает. Отличный баланс вкуса и аромата. Табачные, медовые и фруктово-цитрусовые нотки. Сладость, стабильный вкус от пролива к проливу, не терпкий, приятный.',
        brewing: [
            'Проливами:',
            '🌿 5-8 гр на 150-200 мл воды',
            '🌡 температура 80-90°C',
            '🫖 первый пролив слить',
            '⏳ второй на 30-40 секунд',
            '➕ последующие дольше на 10 секунд',
            '',
            'Настаиванием:',
            '🌿 5 гр чая на 500 мл воды',
            '🌡 температура 80-90°C',
            '⏳ время заваривания — 3-5 минут'
        ],
        benefits: [
            '🦋 стимулирует обмен веществ, что способствует снижению веса',
            '❤️ снижает уровень вредного холестерина в крови, что благоприятно влияет на сердечно-сосудистую систему',
            '😴 успокаивающе воздействует на нервную систему, снижая стресс и тревожность',
            '🧠 улучшает когнитивные функции и память благодаря содержанию аминокислот'
        ]
    },
    {
        id: 4,
        name: 'ДЯНЬ ХУН',
        subtitle: 'Красный чай из Юньнани',
        type: 'Красный чай',
        price: 850,
        icon: 'fas fa-fire',
        category: 'red',
        description: 'Теплый, хлебно-медовый аромат. Вкус прямой и насыщенный, мягкая сладость, небольшая терпкость и приятная плотность в чашке. Легко бодрит и отлично подходит как повседневный, рабочий чай для любого времени суток.',
        brewing: [
            'Проливами:',
            '🌿 5-8 гр на 150-200 мл воды',
            '🌡 температура 85-95°C',
            '🫖 первый пролив слить',
            '⏳ второй на 20-30 секунд',
            '➕ последующие дольше на 10 секунд',
            '',
            'Настаиванием:',
            '🌿 5 гр чая на 500 мл воды',
            '🌡 температура 85-95°C',
            '⏳ время заваривания — 3-5 минут'
        ],
        benefits: [
            '❄️ согревает в холодные дни',
            '🏡 снимает усталость и дарит ощущение уюта и гармонии',
            '🦠 помогает при простудных заболеваниях, так как расширяет дыхательные пути',
            '🧠 способствует улучшению памяти и работы мозга'
        ]
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
        description: 'В аромате жареные семечки, кедровые орехи переходящие в свежий мёд. Во вкусе кешью, кедровые орешки, нота вишневой косточки с неяркой кислинкой.',
        brewing: [
            'Проливами:',
            '🌿 5-8 гр на 150-200 мл воды',
            '🌡 температура 85°C',
            '🫖 первый пролив слить',
            '⏳ второй на 20-30 секунд',
            '➕ последующие дольше на 10 секунд',
            '',
            'Настаиванием:',
            '🌿 5 гр чая на 500 мл воды',
            '🌡 температура 85°C',
            '⏳ время заваривания — 3-5 минут'
        ],
        benefits: [
            '♥️ полезен для сердечно-сосудистой системы, укрепляет стенки сосудов и капилляров',
            '🥣 улучшает работу пищеварительной системы, помогает в усвоении пищи',
            '👳‍♂️снимает головные боли, препятствует их возникновению',
            '🦋адсорбирует токсины и жиры, способствует похудению, регулирует обмен веществ'
        ]
    },
    {
        id: 6,
        name: 'ГУ ШУ ХУН ЧА',
        subtitle: 'Красный чай со старых деревьев',
        type: 'Красный чай',
        price: 1300,
        icon: 'fas fa-tree',
        category: 'red',
        description: 'Насыщенные медово-сливовые оттенки, небольшая маслянистость, абрикосовая легкая косточка на послевкусии, сладкий.',
        brewing: [
            'Проливами:',
            '🌿 5-8 гр на 150-200 мл воды',
            '🌡 температура 85-90°C',
            '🫖 первый пролив слить',
            '⏳ второй на 20-30 секунд',
            '➕ последующие дольше на 10 секунд',
            '',
            'Настаиванием:',
            '🌿 5 гр чая на 500 мл воды',
            '🌡 температура 85-90°C',
            '⏳ время заваривания — 3-5 минут'
        ],
        benefits: [
            '❄️ согревает в холодные дни',
            '🏡 снимает усталость и дарит ощущение уюта и гармонии',
            '🦠 помогает при простудным заболеваниям, так как расширяет дыхательные пути',
            '🧠 способствует улучшению памяти и работы мозга'
        ]
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
        description: 'Классический южнофуцзяньский расслабляющий светлый улун с интересной и многогранной лугово-травной и цветочной вкусоароматикой, а также яркой сиреневой кислинкой на послевкусии. Хорошо расслабляет, отлично подойдет для посиделок в компании близких людей за интересным диалогом, а так же будет отличным выбором для разгрузки после рабочего дня.',
        brewing: [
            'Проливами:',
            '🌿 5-8 гр на 150-200 мл воды',
            '🌡 температура 85°C',
            '🫖 первый пролив слить',
            '⏳ второй на 20-25 секунд',
            '➕ последующие дольше на 10 секунд',
            '',
            'Настаиванием:',
            '🌿 5 гр чая на 500 мл воды',
            '🌡 температура 85°C',
            '⏳ время заваривания — 3-5 минут'
        ],
        benefits: [
            '👨🏻‍🦳 содержит антиоксиданты, предотвращающие преждевременное старение',
            '🦷 профилактика заболеваний зубов и костей благодаря наличию фтора в улуне',
            '❤️ положительно сказывается на здоровье сердца',
            '🧘🏻‍♀️избавляет от тревожного состояния'
        ]
    },
    {
        id: 8,
        name: 'МО ЛИ ХУА ЧА',
        subtitle: 'Жасмин',
        type: 'Зеленый чай',
        price: 900,
        icon: 'fas fa-flower',
        category: 'green',
        description: 'Свежий жасминовый аромат с нежными цветочными оттенками, вкус сбалансированный и приятный. Оставляет тёплое, запоминающее послевкусие. Для любителей жасмина отличный вариант для старта дня на постоянной основе.',
        brewing: [
            'Проливами:',
            '🌿 5-8 гр на 150-200 мл воды',
            '🌡 температура 70°C',
            '🫖 первый пролив слить',
            '⏳ второй на 20-40 секунд',
            '➕ последующие дольше на 10 секунд',
            '',
            'Настаиванием:',
            '🌿 5 гр чая на 500 мл воды',
            '🌡 температура 70°C',
            '⏳ время заваривания — 3-5 минут'
        ],
        benefits: [
            '🧘🏻‍♀️ снимает стресс',
            '🦋 способствует похудению',
            '✨ выводит шлаки и токсины',
            '⚡️ тонизирует и бодрит',
            'Рекомендуется пить утром, но не натощак'
        ]
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
    
    // Очистка старых данных пользователей (кроме текущего)
    cleanupOldUserData();
    
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
    
    // Приветственное уведомление
    setTimeout(() => {
        showNotification('🍵 Добро пожаловать в чайную гармонию!', 'green');
    }, 1000);
}

// Очистка старых данных пользователей
function cleanupOldUserData() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 дней назад
    
    // Очищаем старые гостевые ID
    const guestId = localStorage.getItem('tutu_guest_id');
    if (guestId) {
        const guestTime = parseInt(guestId.split('_')[1]);
        if (guestTime && guestTime < oneWeekAgo) {
            localStorage.removeItem('tutu_guest_id');
        }
    }
    
    // Очищаем старые корзины и заказы
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('tutu_cart_') || key.startsWith('tutu_orders_')) {
            // Пропускаем текущего пользователя
            if (key.includes(userId)) continue;
            
            const data = localStorage.getItem(key);
            try {
                const parsed = JSON.parse(data);
                // Если данные старше недели - удаляем
                if (parsed.timestamp) {
                    const dataTime = new Date(parsed.timestamp).getTime();
                    if (dataTime && dataTime < oneWeekAgo) {
                        localStorage.removeItem(key);
                    }
                }
            } catch (e) {
                // Если не удалось распарсить - удаляем
                localStorage.removeItem(key);
            }
        }
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
            updateMainCartFooter();
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
                <div class="user-avatar" onclick="showProfilePage()" style="cursor: pointer;">
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
    } else if (tg && tg.openTelegramLink) {
        tg.openTelegramLink(url);
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
            
            <div class="product-detail-section">
                <h3><i class="fas fa-info-circle"></i> Описание</h3>
                <p>${product.description}</p>
            </div>
            
            <div class="product-detail-section">
                <h3><i class="fas fa-mug-hot"></i> СПОСОБЫ ЗАВАРИВАНИЯ</h3>
                <div style="color: var(--tea-text-light); line-height: 1.6; font-size: 14px;">
                    ${product.brewing.map(item => `
                        <div style="margin-bottom: 6px;">${item}</div>
                    `).join('')}
                </div>
            </div>
            
            <div class="product-detail-section">
                <h3><i class="fas fa-heart"></i> ПОЛЕЗНЫЕ СВОЙСТВА</h3>
                <div style="color: var(--tea-text-light); line-height: 1.6; font-size: 14px;">
                    ${product.benefits.map(item => `
                        <div style="margin-bottom: 8px;">${item}</div>
                    `).join('')}
                </div>
            </div>
            
            <div class="product-detail-section" style="text-align: center; padding: 20px; background: var(--tea-green); color: white; border-radius: var(--radius-md); margin-top: 20px;">
                <p style="margin-bottom: 10px; font-size: 14px;">🤩 подписаться на наш канал:</p>
                <a href="https://t.me/teatea_bar" target="_blank" style="color: white; text-decoration: none; font-weight: 600; font-size: 16px;">
                    @teatea_bar
                </a>
            </div>
        </div>
        
        <div class="product-detail-actions">
            <button class="add-to-cart-btn" onclick="addToCart(${product.id}); showNotification('✅ Добавлено в корзину!', 'green')" style="cursor: pointer;">
                <i class="fas fa-cart-plus"></i> В корзину
            </button>
            <button class="buy-now-btn" onclick="addToCart(${product.id}); showCartPage()" style="cursor: pointer;">
                <i class="fas fa-bolt"></i> Купить сейчас
            </button>
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

// ========== ОФОРМЛЕНИЕ ЗАКАЗА (ИСПРАВЛЕННОЕ ДЛЯ IPHONE) ==========
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
        background: rgba(62, 39, 35, 0.9);
        backdrop-filter: blur(15px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
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
                <button class="modal-close" onclick="document.getElementById('checkout-modal').remove()" style="
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
                    <button onclick="document.getElementById('checkout-modal').remove()" style="
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
            total: item.price * item.quantity
        })),
        total: total,
        timestamp: new Date().toLocaleString('ru-RU'),
        date: new Date().toLocaleDateString('ru-RU'),
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
    
    // Сохраняем заказ
    await saveOrder(order);
    
    // Формируем полное сообщение для Telegram в нужном формате
    const message = `Китайский чай «ТИ•ТИ», [${order.date} ${order.time}]\n\n` +
                   `${order.cart.map(item => {
                       const tea = teaCatalog.find(t => t.id === item.id);
                       if (!tea) return '';
                       
                       return `${tea.name}\n«${tea.subtitle}»\n(${tea.type})\n\n${tea.description}\n\n` +
                              `🍶СПОСОБЫ ЗАВАРИВАНИЯ🍶\n\n${tea.brewing.join('\n')}\n\n` +
                              `🌿ПОЛЕЗНЫЕ СВОЙСТВА🌿\n\n${tea.benefits.join('\n')}\n\n` +
                              `🤩 подписаться (http://t.me/teatea_bar) ✔️\n\n` +
                              `#китайскийчай\n#community@teatea_bar\n\n` +
                              `Количество: ${item.quantity} × ${item.price}₽ = ${item.total}₽\n` +
                              `────────────────────\n\n`;
                   }).join('')}` +
                   `Итого заказано товаров: ${totalItems}\n` +
                   `Общая сумма заказа: ${total}₽\n\n` +
                   `Заказчик: ${order.user_name}${order.user_username ? ` (@${order.user_username})` : ''}\n` +
                   `ID заказа: #${order.id}\n` +
                   `Дата заказа: ${order.timestamp}`;
    
    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    
    // Создаем URL для Telegram
    const telegramUrl = `https://t.me/ivan_likhov?text=${encodedMessage}`;
    
    // Закрываем модальное окно
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.remove();
    
    // Показываем уведомление
    showNotification('📱 Открываем чат с менеджером...', 'green');
    
    // Открываем чат через 500мс (дает время на закрытие модалки)
    setTimeout(() => {
        if (tg && tg.openLink) {
            tg.openLink(telegramUrl);
        } else if (tg && tg.openTelegramLink) {
            tg.openTelegramLink(telegramUrl);
        } else {
            // Для Safari на iPhone используем window.open с _blank
            window.open(telegramUrl, '_blank');
        }
        
        // Очищаем корзину
        cart = [];
        saveCart().then(() => {
            // Показываем успешное уведомление
            showNotification(`🎉 Заказ #${order.id} оформлен! Менеджер свяжется с вами.`, 'green');
            createConfetti();
            
            // Возвращаемся на главную
            setTimeout(() => {
                showMainPage();
            }, 2000);
        });
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

// ========== СТРАНИЦЫ ЗАКАЗОВ И ПРОФИЛЯ ==========
function showOrdersPage() {
    showNotification('Раздел заказов в разработке', 'gold');
    showMainPage();
}

function showProfilePage() {
    showNotification('Раздел профиля в разработке', 'gold');
    showMainPage();
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

// Добавляем CSS для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes modalSlideUp {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .page-transition {
        animation: pageFadeIn 0.3s ease;
    }
    
    @keyframes pageFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

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
window.openTelegramLink = openTelegramLink;
