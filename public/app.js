// ===========================================
// ТИ•ТИ - ЧАЙНАЯ ГАРМОНИЯ
// Telegram Mini App для заказа чая
// ===========================================

// Глобальные переменные
let tg = window.Telegram.WebApp;
let cart = [];
let userData = null;
let userId = null;
let isTelegramUser = false;
let orders = [];
let currentPage = 'main';
let isTransitioning = false;

// Определение устройств
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isAndroid = /Android/.test(navigator.userAgent);

// При загрузке добавляем классы для устройств
document.addEventListener('DOMContentLoaded', () => {
    if (isIOS) {
        document.body.classList.add('ios-device');
        fixIOSViewport();
    }
    if (isAndroid) {
        document.body.classList.add('android-device');
    }
});

// ========== ЭЛИТНЫЙ КАТАЛОГ ЧАЯ ==========
const teaCatalog = [
    {
        id: 1,
        name: 'БАНЬ ЧЖАН ХУН ПЯО',
        subtitle: 'Урожай 2022 года',
        type: 'Шу Пуэр',
        price: 2800,
        tag: 'Элитный',
        icon: 'fas fa-mountain-sun',
        category: 'puer',
        image: 'puer1.jpg',
        description: 'Полностью ферментированный чай из провинции Юньнань, классический шу пуэр с глубоким и богатым характером.',
        details: {
            aroma: 'Яркая, прохладная нота с древесными оттенками',
            taste: 'Ореховый, древесный с яркими фруктами и отчетливым черносливом',
            effect: 'Бодрит, восстанавливает силы, подходит для активного рабочего режима',
            region: 'Юньнань, Китай',
            harvest: '2022 год',
            weight: '100г'
        }
    },
    {
        id: 2,
        name: 'СТАРЫЕ ДЕРЕВЬЯ ИЗ БАНЬ ЧЖАН',
        subtitle: 'Урожай 2009 года',
        type: 'Шу Пуэр',
        price: 4500,
        tag: 'Коллекционный',
        icon: 'fas fa-tree',
        category: 'puer',
        image: 'puer2.jpg',
        description: 'Выдержанный чай из сырья, собранного со старых чайных деревьев в провинции Юньнань.',
        details: {
            aroma: 'Сдержанный, древесно-ягодный',
            taste: 'Сочный, чистый и гладкий, маслянистый, сладковатый с ягодной кислинкой',
            effect: 'Умеренно тонизирующий, помогает восстановить силы и улучшить концентрацию',
            region: 'Юньнань, Китай',
            harvest: '2009 год',
            weight: '100г'
        }
    },
    {
        id: 3,
        name: 'НОУ МИ СЯН',
        subtitle: 'С ароматом клейкого риса',
        type: 'Шу Пуэр',
        price: 2200,
        tag: 'Эксклюзив',
        icon: 'fas fa-bowl-rice',
        category: 'puer',
        image: 'puer3.jpg',
        description: 'Особый вид пуэра, ферментированный совместно с травой Ноу Ми Сян.',
        details: {
            aroma: 'Напоминает влажные листья и пропаренный рис',
            taste: 'Древесно-землистые ноты, кукурузно-травяной вкус с оттенками сухофруктов',
            effect: 'Умеренно тонизирующий, помогает восстановить силы и улучшить концентрацию',
            region: 'Юньнань, Китай',
            weight: '8г (прессованный)'
        }
    },
    {
        id: 4,
        name: 'ТЕ ГУАНЬ ИНЬ',
        subtitle: 'Железная богиня милосердия',
        type: 'Улун',
        price: 1900,
        tag: 'Классика',
        icon: 'fas fa-yin-yang',
        category: 'oolong',
        image: 'oolong1.jpg',
        description: 'Полуферментированный улун, занимающий промежуточное положение между зелёными и красными чаями.',
        details: {
            aroma: 'Сбалансированный, с оттенками цветов и свежескошенной травы',
            taste: 'Плотный, маслянистый, ноты цветочной и кондитерской сладости',
            effect: 'Снижает тревожность и нервное напряжение, создаёт состояние внутренней гармонии',
            region: 'Фуцзянь, Китай',
            weight: '100г'
        }
    },
    {
        id: 5,
        name: 'ЖОУ ГУЙ НУН СЯН',
        subtitle: 'Мясистая корица с сильным ароматом',
        type: 'Улун',
        price: 2500,
        tag: 'Премиум',
        icon: 'fas fa-spice',
        category: 'oolong',
        image: 'oolong2.jpg',
        description: 'Утёсный улун из провинции Фуцзянь с насыщенным пряным профилем и глубиной вкуса.',
        details: {
            aroma: 'Ноты корочки ржаного хлеба, корицы и карамели',
            taste: 'Насыщенный, с терпкостью, слегка горьковатый, быстро переходит в сладость',
            effect: 'Мягко бодрит, проясняет сознание, повышает концентрацию',
            region: 'Фуцзянь, Китай',
            weight: '100г'
        }
    },
    {
        id: 6,
        name: 'ХЭЙ ЦЗИНЬ',
        subtitle: 'Черное золото',
        type: 'Красный чай',
        price: 2700,
        tag: 'Премиальный',
        icon: 'fas fa-crown',
        category: 'red',
        image: 'red1.jpg',
        description: 'Премиальный красный чай из северной части провинции Фуцзянь с объёмным вкусовым профилем.',
        details: {
            aroma: 'Медовые, хлебные ноты',
            taste: 'Пряные, хлебные, медовые, сухофруктовые ноты',
            effect: 'Мягко снимает нервное напряжение, создаёт состояние умиротворения',
            region: 'Фуцзянь, Китай',
            weight: '100г'
        }
    },
    {
        id: 7,
        name: 'СЯО ЧЖУН ЧЖЭНЬ ШАНЬ',
        subtitle: 'Подлинный горный мелколистный',
        type: 'Красный чай',
        price: 2300,
        tag: 'Классика',
        icon: 'fas fa-mountain',
        category: 'red',
        image: 'red2.jpg',
        description: 'Один из самых известных китайских красных чаёв с горного хребта Уишань.',
        details: {
            aroma: 'Медово-карамельный с шоколадными и хлебными оттенками',
            taste: 'Ягодные и сухофруктовые ноты с тонким акцентом печеных орехов',
            effect: 'Расслабляет, снижает стресс, обладает согревающим действием',
            region: 'Фуцзянь, Китай',
            weight: '100г'
        }
    },
    {
        id: 8,
        name: 'ГУ ШУ ХУН ЧА',
        subtitle: 'Красный чай со старых деревьев',
        type: 'Красный чай',
        price: 3500,
        tag: 'Элитный',
        icon: 'fas fa-tree',
        category: 'red',
        image: 'red3.jpg',
        description: 'Красный чай из листьев древних чайных деревьев возрастом от десятков до сотен лет.',
        details: {
            aroma: 'Медовые и травяные ноты, оттенки сухофруктов и корицы',
            taste: 'Преобладает сладость фруктов с ягодной терпкостью в послевкусии',
            effect: 'Мягко бодрит, обладает согревающим действием',
            region: 'Юньнань/Фуцзянь',
            weight: '100г'
        }
    },
    {
        id: 9,
        name: 'ДЯНЬ ХУН',
        subtitle: 'Красный чай из Дяньси',
        type: 'Красный чай',
        price: 1800,
        tag: 'Традиционный',
        icon: 'fas fa-fire',
        category: 'red',
        image: 'red4.jpg',
        description: 'Классический красный чай из исторической провинции Дяньси (Юньнань).',
        details: {
            aroma: 'Приглушенный сладкий аромат с нотами свежей выпечки',
            taste: 'Нотки шоколада, легкая медовая сладость, оттенки выпечки',
            effect: 'Согревающее действие, мягкое тонизирование',
            region: 'Юньнань, Китай',
            weight: '100г'
        }
    },
    {
        id: 10,
        name: 'МАО ЦЗЯНЬ',
        subtitle: 'Пушистые кончики',
        type: 'Зеленый чай',
        price: 2100,
        tag: 'Топ-10 Китая',
        icon: 'fas fa-leaf',
        category: 'green',
        image: 'green1.jpg',
        description: 'Один из самых известных китайских зелёных чаёв, входит в "Десятку знаменитых чаёв Китая".',
        details: {
            aroma: 'Свежие оттенки цветов и луговых трав',
            taste: 'Гладкий, освежающий, с легкой кислинкой, сладкое послевкусие',
            effect: 'Мягко бодрит, повышает концентрацию внимания',
            region: 'Хэнань, Китай',
            weight: '100г'
        }
    },
    {
        id: 11,
        name: 'МО ЛИ ХУА ЧА',
        subtitle: 'Жасминовый цветочный чай',
        type: 'Зеленый чай',
        price: 1600,
        tag: 'Традиционный',
        icon: 'fas fa-flower',
        category: 'green',
        image: 'green2.jpg',
        description: 'Традиционный китайский чай с тысячелетней историей, ароматизированный цветками жасмина.',
        details: {
            aroma: 'Цветочный, жасминовый',
            taste: 'Мягкий, освежающий, сладковатый с жасминовой терпкостью',
            effect: 'Сочетает тонизирование и релаксацию, приводит в состояние баланса',
            region: 'Фуцзянь, Китай',
            weight: '100г'
        }
    },
    {
        id: 12,
        name: 'ГУН МЭЙ',
        subtitle: 'Бровь, подношение',
        type: 'Белый чай',
        price: 2400,
        tag: 'Полезный',
        icon: 'fas fa-heart',
        category: 'white',
        image: 'white1.jpg',
        description: 'Белый чай с минимальной обработкой, максимально сохраняющий природные биологические вещества.',
        details: {
            aroma: 'Медовые, слегка ореховые оттенки, легкий шлейф сухих цветов',
            taste: 'Мягкая сладость, напоминающая горный мёд, с легкой терпкостью',
            effect: 'Укрепляет иммунитет, поддерживает эластичность кожи, антиоксидант',
            region: 'Фуцзянь, Китай',
            weight: '100г'
        }
    },
    {
        id: 13,
        name: 'БАЙ ХАО ИНЬ ЧЖЭНЬ',
        subtitle: 'Белый пион серебряные иглы',
        type: 'Белый чай',
        price: 3200,
        tag: 'Премиум',
        icon: 'fas fa-cloud',
        category: 'white',
        image: 'white2.jpg',
        description: 'Элитный белый чай из нераспустившихся почек, покрытых белым ворсом.',
        details: {
            aroma: 'Нежный, цветочный с медовыми нотами',
            taste: 'Сладкий, шелковистый, с фруктовыми оттенками',
            effect: 'Антиоксидант, омолаживающий эффект, успокаивает нервную систему',
            region: 'Фуцзянь, Китай',
            weight: '50г'
        }
    },
    {
        id: 14,
        name: 'ПЯТИЗВЕЗДОЧНЫЙ ПАВЛИН',
        subtitle: 'Из Булань 2018г',
        type: 'Шу Пуэр',
        price: 3800,
        tag: 'Выдержанный',
        icon: 'fas fa-feather-alt',
        category: 'puer',
        image: 'puer4.jpg',
        description: 'Шу пуэр 2018 года — выдержанный чай с ароматом и вкусом, сформированным многолетней выдержкой.',
        details: {
            aroma: 'Бархатистые ноты карамели, печёного яблока и лёгкой пряности',
            taste: 'Шоколадно-ореховые тона с нотами чернослива, персика и карамели',
            effect: 'Мягко бодрит, повышает концентрацию, способствует ментальной релаксации',
            region: 'Юньнань, Китай',
            harvest: '2018 год',
            weight: '357г (блин)'
        }
    }
];

// Категории с изображениями
const teaCategories = [
    { 
        id: 'all', 
        name: 'Все чаи', 
        icon: 'fas fa-mug-hot', 
        color: 'var(--tea-green)',
        image: 'category_all.jpg'
    },
    { 
        id: 'puer', 
        name: 'Пуэры', 
        icon: 'fas fa-mountain', 
        color: '#5D4037',
        image: 'category_puer.jpg'
    },
    { 
        id: 'oolong', 
        name: 'Улуны', 
        icon: 'fas fa-yin-yang', 
        color: '#F57C00',
        image: 'category_oolong.jpg'
    },
    { 
        id: 'red', 
        name: 'Красные чаи', 
        icon: 'fas fa-fire', 
        color: '#D32F2F',
        image: 'category_red.jpg'
    },
    { 
        id: 'green', 
        name: 'Зеленые чаи', 
        icon: 'fas fa-leaf', 
        color: '#2E7D32',
        image: 'category_green.jpg'
    },
    { 
        id: 'white', 
        name: 'Белые чаи', 
        icon: 'fas fa-cloud', 
        color: '#757575',
        image: 'category_white.jpg'
    }
];

// ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========
async function initApp() {
    console.log('🚀 Инициализация ТИ•ТИ Чайной лавки...');
    
    // Аналитика
    trackEvent('app_start', { platform: isIOS ? 'ios' : isAndroid ? 'android' : 'web' });
    
    // Фиксы для iOS
    if (isIOS) {
        fixIOSViewport();
        document.body.classList.add('ios-device');
    }
    
    // Настройка темы
    setupTheme();
    
    // Инициализация Telegram WebApp
    initTelegramWebApp();
    
    // Загружаем данные пользователя
    userData = await getUserData();
    userId = generateUserId();
    isTelegramUser = userData.id !== null;
    
    // Загружаем корзину и заказы
    await loadCart();
    await loadOrders();
    
    // Скрываем прелоадер и показываем приложение
    setTimeout(() => {
        const loader = document.querySelector('.quick-loader');
        if (loader) {
            loader.style.transition = 'opacity 0.5s ease';
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                const app = document.getElementById('app');
                if (app) {
                    app.style.display = 'block';
                    app.style.opacity = '0';
                    setTimeout(() => {
                        app.style.transition = 'opacity 0.5s ease';
                        app.style.opacity = '1';
                    }, 50);
                }
            }, 500);
        }
        
        // Показываем главную страницу
        showMainPage();
        
        // Тактильная обратная связь
        if (window.hapticFeedback) {
            window.hapticFeedback.impactOccurred('soft');
        }
        
        console.log('✅ Приложение успешно загружено');
    }, 1000);
}

// Фикс для viewport на iOS
function fixIOSViewport() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    const setAppHeight = () => {
        const doc = document.documentElement;
        doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    
    window.addEventListener('resize', setAppHeight);
    setAppHeight();
    
    // Фикс для скролла в Telegram
    if (tg) {
        tg.viewportHeight = window.innerHeight;
    }
}

// Инициализация Telegram WebApp
function initTelegramWebApp() {
    if (typeof window.Telegram !== 'undefined' && tg) {
        try {
            tg.ready();
            tg.expand();
            
            // Включаем тактильную обратную связь
            if (tg.HapticFeedback) {
                window.hapticFeedback = tg.HapticFeedback;
            }
            
            // Настройка темы Telegram
            const isDark = document.body.classList.contains('dark-theme');
            tg.setHeaderColor(isDark ? '#1E1E1E' : '#4CAF50');
            tg.setBackgroundColor(isDark ? '#121212' : '#FFF8F0');
            
            // Обработка закрытия
            tg.onEvent('viewportChanged', fixIOSViewport);
            
            console.log('✅ Telegram WebApp инициализирован');
        } catch (error) {
            console.error('❌ Ошибка Telegram WebApp:', error);
        }
    }
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
        // Авто режим
        if (prefersDark) {
            document.body.classList.add('dark-theme');
        }
    }
    
    // Следим за изменениями темы системы
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
    
    showNotification(`Тема изменена на ${theme === 'auto' ? 'авто' : theme === 'dark' ? 'темную' : 'светлую'}`, 'green');
}

// Получение данных пользователя
async function getUserData() {
    try {
        if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            const userData = {
                id: user.id,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                username: user.username || '',
                photo_url: user.photo_url || '',
                is_bot: user.is_bot || false,
                language_code: user.language_code || 'ru'
            };
            
            // Кэшируем данные пользователя
            localStorage.setItem('tea_user_cache', JSON.stringify({
                data: userData,
                timestamp: Date.now()
            }));
            
            trackEvent('user_login', { userId: user.id });
            return userData;
        }
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
    }
    
    // Для гостей проверяем кэш
    const cached = localStorage.getItem('tea_user_cache');
    if (cached) {
        try {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < 30 * 60 * 1000) { // 30 минут
                return data;
            }
        } catch (e) {
            // Игнорируем ошибки кэша
        }
    }
    
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
    
    let guestId = localStorage.getItem('tea_guest_id');
    if (!guestId) {
        guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('tea_guest_id', guestId);
        trackEvent('guest_registered', { guestId });
    }
    return guestId;
}

// Класс для типов чая
function getTeaTypeClass(type) {
    const classes = {
        'Шу Пуэр': 'puer',
        'Улун': 'oolong',
        'Красный чай': 'red-tea',
        'Зеленый чай': 'green-tea',
        'Белый чай': 'white-tea'
    };
    return classes[type] || 'puer';
}

// ========== УПРАВЛЕНИЕ СТРАНИЦАМИ ==========
function showPage(pageName, direction = 'forward') {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const currentPageEl = document.querySelector('.page.active');
    const nextPageEl = document.getElementById(pageName + '-page');
    
    if (!nextPageEl || currentPageEl === nextPageEl) {
        isTransitioning = false;
        return;
    }
    
    // Скрываем текущую страницу
    if (currentPageEl) {
        currentPageEl.classList.remove('active');
        currentPageEl.classList.add('exiting');
        
        setTimeout(() => {
            currentPageEl.classList.remove('exiting');
            currentPageEl.style.display = 'none';
        }, 300);
    }
    
    // Показываем новую страницу
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
        <!-- Шапка с паттерном и логотипом -->
        <div class="header-with-pattern">
            <div class="logo-centered">
                <img src="logo.png" alt="ТИ•ТИ - Чайная лавка" 
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
                        <button class="catalog-btn" onclick="showCatalogPage()" aria-label="Перейти в каталог чая">
                            <i class="fas fa-search"></i> Выбрать чай
                        </button>
                        <button class="popular-btn" onclick="showCartPage()" aria-label="Перейти в корзину">
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
                        <div class="category-item" onclick="showCatalogPage('${category.id}')" 
                             style="cursor: pointer; animation-delay: ${0.1 + index * 0.05}s"
                             aria-label="${category.name}">
                            <div class="category-image-container" style="background-image: url('${category.image}');">
                                <div class="category-overlay" style="background: ${category.color};">
                                    <i class="${category.icon}"></i>
                                </div>
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
                    <div class="action-btn" onclick="showOrdersPage()" style="cursor: pointer;" aria-label="Мои заказы">
                        <i class="fas fa-box"></i>
                        <span>Мои заказы</span>
                    </div>
                    <div class="action-btn" onclick="showProfilePage()" style="cursor: pointer;" aria-label="Мой профиль">
                        <i class="fas fa-user"></i>
                        <span>Профиль</span>
                    </div>
                    <div class="action-btn" onclick="openTelegramLink('https://t.me/teatea_bar')" style="cursor: pointer;" aria-label="Наш телеграм-канал">
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
                <button class="checkout-button pulse-button" id="main-checkout-btn" onclick="startCheckout()" aria-label="Оформить заказ">
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
    const categoryName = teaCategories.find(c => c.id === category)?.name || 'Все чаи';
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <button class="back-button" onclick="goBack()" aria-label="Назад">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="page-title">
                    <i class="fas fa-mug-hot"></i>
                    <span>${categoryName}</span>
                </div>
                <div style="width: 40px;"></div>
            </div>
        </div>
        
        <div class="catalog-filters">
            <div class="filter-buttons">
                ${teaCategories.map(cat => `
                    <button class="filter-btn ${category === cat.id ? 'active' : ''}" 
                            onclick="showCatalogPage('${cat.id}')" 
                            aria-label="${cat.name}"
                            aria-pressed="${category === cat.id}">
                        ${cat.name}
                    </button>
                `).join('')}
            </div>
        </div>
        
        <div class="catalog-list">
            ${filteredTeas.map((tea, index) => `
                <div class="catalog-product-item" onclick="showProductPage(${tea.id})" 
                     style="cursor: pointer; animation-delay: ${index * 0.05}s"
                     aria-label="${tea.name} - ${tea.price}₽">
                    <div class="catalog-product-icon ${getTeaTypeClass(tea.type)}">
                        <i class="${tea.icon}"></i>
                    </div>
                    <div class="catalog-product-info">
                        <div class="catalog-product-name">${tea.name}</div>
                        <div class="catalog-product-subtitle">${tea.subtitle}</div>
                        <div class="catalog-product-price">${tea.price}₽</div>
                    </div>
                    <div class="catalog-product-actions">
                        ${tea.tag ? `<span class="product-tag-mini" style="background: var(--tea-gold);">${tea.tag}</span>` : ''}
                        <button class="catalog-add-btn" onclick="event.stopPropagation(); addToCart(${tea.id})" 
                                aria-label="Добавить ${tea.name} в корзину">
                            + Добавить
                        </button>
                    </div>
                </div>
            `).join('')}
            
            ${filteredTeas.length === 0 ? `
                <div class="empty-state" style="text-align: center; padding: 40px 20px; color: var(--tea-text-light);">
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
                <button class="back-button" onclick="showCatalogPage()" aria-label="Назад к каталогу">
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
            <!-- Карточка продукта -->
            <div class="product-card">
                <div class="product-card-header">
                    <div class="product-image-container ${getTeaTypeClass(product.type)}">
                        <i class="${product.icon}"></i>
                    </div>
                    <div class="product-title">
                        <h2>${product.name}</h2>
                        <div class="product-subtitle">${product.subtitle}</div>
                        ${product.tag ? `<div class="product-tag">${product.tag}</div>` : ''}
                        <div class="product-type">${product.type}</div>
                    </div>
                </div>
                
                <!-- Цена -->
                <div class="product-price-main">${product.price}₽</div>
                
                <!-- Описание -->
                <div class="product-description">
                    <p>${product.description}</p>
                </div>
                
                <!-- Детали чая -->
                <div class="tea-details">
                    ${Object.entries(product.details).map(([key, value]) => {
                        const icons = {
                            aroma: 'fas fa-wine-glass-alt',
                            taste: 'fas fa-utensil-spoon',
                            effect: 'fas fa-brain',
                            region: 'fas fa-globe-asia',
                            harvest: 'fas fa-calendar-alt',
                            weight: 'fas fa-weight-hanging'
                        };
                        const titles = {
                            aroma: 'Аромат',
                            taste: 'Вкус',
                            effect: 'Эффект',
                            region: 'Регион',
                            harvest: 'Урожай',
                            weight: 'Фасовка'
                        };
                        
                        return `
                            <div class="detail-item">
                                <div class="detail-icon">
                                    <i class="${icons[key] || 'fas fa-info-circle'}"></i>
                                </div>
                                <div class="detail-content">
                                    <h4>${titles[key] || key}</h4>
                                    <p>${value}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <!-- Рекомендации -->
                <div class="tea-recommendations">
                    <h3><i class="fas fa-lightbulb"></i> Как заваривать</h3>
                    <p>Температура воды: 85-95°C<br>
                       Время настаивания: 2-3 минуты<br>
                       Проливов: 5-7</p>
                </div>
            </div>
            
            <!-- Кнопки действий -->
            <div class="product-detail-actions">
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}); showNotification('🎉 ${product.name} добавлен в корзину!', 'green')" 
                        aria-label="Добавить ${product.name} в корзину">
                    <i class="fas fa-cart-plus"></i> В корзину
                </button>
                <button class="buy-now-btn" onclick="addToCart(${product.id}); showCartPage()" 
                        aria-label="Купить ${product.name} сейчас">
                    <i class="fas fa-bolt"></i> Купить сейчас
                </button>
            </div>
        </div>
    `;
    
    showPage('product');
}

// ========== КОРЗИНА ==========
async function loadCart() {
    const key = `tea_cart_${userId}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
        try {
            cart = JSON.parse(saved);
            if (!Array.isArray(cart)) cart = [];
            // Валидация данных корзины
            cart = cart.filter(item => 
                item && item.id && item.price > 0 && item.quantity > 0
            );
        } catch (e) {
            console.error('Ошибка загрузки корзины:', e);
            cart = [];
        }
    } else {
        cart = [];
    }
    
    updateCart();
    return cart;
}

async function saveCart() {
    const key = `tea_cart_${userId}`;
    try {
        localStorage.setItem(key, JSON.stringify(cart));
        updateCart();
        trackEvent('cart_update', { items: cart.length, total: getCartTotal() });
    } catch (e) {
        console.error('Ошибка сохранения корзины:', e);
    }
}

function updateCart() {
    updateMainCartFooter();
    
    // Обновляем счетчик в заголовке, если страница корзины активна
    if (currentPage === 'cart') {
        showCartPage();
    }
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
            checkoutBtn.classList.add('pulse-button');
        } else {
            cartTotal.innerHTML = `Корзина пуста`;
            checkoutBtn.textContent = 'Оформить';
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
            checkoutBtn.style.cursor = 'not-allowed';
            checkoutBtn.classList.remove('pulse-button');
        }
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function addToCart(productId, quantity = 1) {
    const product = teaCatalog.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ 
            id: product.id,
            name: product.name,
            price: product.price,
            type: product.type,
            category: product.category,
            quantity: quantity,
            image: product.image
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
    
    // Аналитика
    trackEvent('add_to_cart', { 
        productId, 
        productName: product.name,
        quantity,
        price: product.price
    });
}

function createAddToCartEffect(clickEvent) {
    const effect = document.createElement('div');
    effect.className = 'add-to-cart-effect';
    effect.innerHTML = '🛒';
    effect.style.cssText = `
        position: fixed;
        font-size: 24px;
        pointer-events: none;
        z-index: 1001;
        will-change: transform;
        transform: translate3d(0, 0, 0);
    `;
    
    const x = clickEvent?.clientX || window.innerWidth / 2;
    const y = clickEvent?.clientY || window.innerHeight / 2;
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    
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
    const total = getCartTotal();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <button class="back-button" onclick="goBack()" aria-label="Назад">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="page-title">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Корзина</span>
                </div>
                <div style="width: 40px;"></div>
            </div>
        </div>
        
        <div class="cart-container ${isAndroid ? 'android-cart' : ''}" style="padding-bottom: 100px;">
            ${cart.length === 0 ? `
                <div class="cart-empty" aria-label="Корзина пуста">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Корзина пуста</h3>
                    <p>Добавьте товары из каталога</p>
                    <button onclick="showCatalogPage()" 
                            aria-label="Перейти в каталог"
                            style="margin-top: 20px; padding: 12px 24px; background: var(--tea-green); 
                                   color: white; border: none; border-radius: var(--radius-round); 
                                   font-weight: 600; cursor: pointer;">
                        <i class="fas fa-mug-hot"></i> Перейти в каталог
                    </button>
                </div>
            ` : `
                <div class="cart-items-list">
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
                                <button class="quantity-btn minus" onclick="updateCartQuantity(${item.id}, -1)" 
                                        aria-label="Уменьшить количество">
                                    −
                                </button>
                                <span class="cart-item-quantity">${item.quantity}</span>
                                <button class="quantity-btn plus" onclick="updateCartQuantity(${item.id}, 1)" 
                                        aria-label="Увеличить количество">
                                    +
                                </button>
                            </div>
                            <div class="cart-item-total">${item.price * item.quantity}₽</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="cart-summary">
                    <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 700; margin-bottom: 24px;">
                        <span>Итого:</span>
                        <span>${total}₽</span>
                    </div>
                    <button onclick="startCheckout()" 
                            aria-label="Оформить заказ на сумму ${total}₽"
                            style="width: 100%; padding: 16px; background: linear-gradient(135deg, var(--tea-purple), var(--tea-purple-light)); 
                                   color: white; border: none; border-radius: var(--radius-round); 
                                   font-weight: 600; cursor: pointer; display: flex; align-items: center; 
                                   justify-content: center; gap: 10px; font-size: 16px;"
                            class="pulse-button">
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
    
    const oldQuantity = item.quantity;
    item.quantity += delta;
    
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
        showNotification('🗑️ Товар удален из корзины', 'red');
    }
    
    saveCart();
    
    // Аналитика
    if (delta > 0) {
        trackEvent('increase_quantity', { productId, from: oldQuantity, to: item.quantity });
    } else {
        trackEvent('decrease_quantity', { productId, from: oldQuantity, to: item.quantity });
    }
    
    // Если корзина пуста, показываем пустую корзину
    if (cart.length === 0) {
        showCartPage();
    }
}

// ========== ОФОРМЛЕНИЕ ЗАКАЗА ==========
function startCheckout() {
    if (cart.length === 0) {
        showNotification('🛒 Добавьте товары в корзину!', 'gold');
        return;
    }
    
    const total = getCartTotal();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    showCheckoutModal(total, totalItems);
}

function showCheckoutModal(total, totalItems) {
    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.className = 'tea-modal';
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'checkout-title');
    
    modal.innerHTML = `
        <div class="modal-content" role="document">
            <div class="modal-header">
                <h3 id="checkout-title">Подтверждение заказа</h3>
            </div>
            <div class="modal-body">
                <div class="order-summary">
                    <div class="order-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <h4>Сумма заказа</h4>
                    <div class="order-total">${total}₽</div>
                    <p class="order-items">${totalItems} товаров</p>
                </div>
                
                <div class="order-details">
                    ${cart.map(item => `
                        <div class="order-item">
                            <span>${item.name} × ${item.quantity}</span>
                            <span class="order-item-price">${item.price * item.quantity}₽</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-info">
                    <i class="fas fa-info-circle"></i>
                    После подтверждения откроется чат с менеджером
                </div>
                
                <div class="modal-actions">
                    <button onclick="closeCheckoutModal()" class="modal-btn cancel" aria-label="Отмена">
                        Отмена
                    </button>
                    <button onclick="confirmCheckout()" id="confirm-checkout-btn" class="modal-btn confirm" aria-label="Подтвердить заказ">
                        Подтвердить
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Блокируем скролл фона
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
    document.body.style.overflow = '';
}

async function confirmCheckout() {
    const total = getCartTotal();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Отключаем кнопку
    const confirmBtn = document.getElementById('confirm-checkout-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка...';
    }
    
    try {
        // Создаем заказ
        const orderId = 'ORD' + Date.now().toString().slice(-8);
        const order = {
            id: orderId,
            user_id: userId,
            user_name: userData.first_name || 'Гость',
            user_username: userData.username || '',
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
                type: item.type
            })),
            total: total,
            items_count: totalItems,
            timestamp: new Date().toLocaleString('ru-RU'),
            status: 'pending'
        };
        
        // Сохраняем заказ
        await saveOrder(order);
        
        // Формируем сообщение для Telegram
        const message = `🛒 *Новый заказ #${orderId}*\n\n` +
                       `👤 *Клиент:* ${order.user_name}${order.user_username ? ` (@${order.user_username})` : ''}\n` +
                       `💰 *Сумма:* ${order.total}₽\n` +
                       `📦 *Товаров:* ${totalItems}\n` +
                       `📅 *Дата:* ${order.timestamp}\n\n` +
                       `*Состав заказа:*\n` +
                       order.items.map(item => 
                           `• ${item.name} × ${item.quantity} = ${item.total}₽`
                       ).join('\n') + '\n\n' +
                       `_ID: ${userId}_`;
        
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://t.me/ivan_likhov?text=${encodedMessage}`;
        
        // Закрываем модальное окно
        closeCheckoutModal();
        
        // Очищаем корзину
        cart = [];
        await saveCart();
        
        // Показываем уведомление
        showNotification(`🎉 Заказ #${orderId} оформлен!`, 'green');
        
        // Создаем конфетти эффект
        createConfetti();
        
        // Тактильная обратная связь
        if (window.hapticFeedback) {
            window.hapticFeedback.impactOccurred('heavy');
        }
        
        // Аналитика
        trackEvent('order_created', { 
            orderId, 
            total, 
            items: totalItems,
            userId 
        });
        
        // Открываем чат с менеджером
        setTimeout(() => {
            openTelegramLink(telegramUrl);
            
            // Возвращаемся на главную
            setTimeout(() => showMainPage(), 1000);
        }, 1500);
        
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
        showNotification('❌ Ошибка оформления заказа', 'red');
        
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = 'Подтвердить';
        }
    }
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
    const key = `tea_orders_${userId}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
        try {
            orders = JSON.parse(saved);
            if (!Array.isArray(orders)) orders = [];
        } catch (e) {
            console.error('Ошибка загрузки заказов:', e);
            orders = [];
        }
    } else {
        orders = [];
    }
    
    return orders;
}

async function saveOrder(order) {
    try {
        orders.push(order);
        const key = `tea_orders_${userId}`;
        localStorage.setItem(key, JSON.stringify(orders));
        
        trackEvent('order_saved', { orderId: order.id, total: order.total });
        return true;
    } catch (e) {
        console.error('Ошибка сохранения заказа:', e);
        return false;
    }
}

function showOrdersPage() {
    const page = document.getElementById('orders-page');
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <button class="back-button" onclick="goBack()" aria-label="Назад">
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
            <div class="orders-list">
                ${orders.length === 0 ? `
                    <div class="empty-orders" aria-label="Заказов пока нет">
                        <i class="fas fa-box-open"></i>
                        <h3>Заказов пока нет</h3>
                        <p>Совершите первую покупку!</p>
                    </div>
                ` : `
                    ${orders.slice().reverse().map((order, index) => `
                        <div class="order-item-card" onclick="showOrderDetails('${order.id}')" 
                             style="cursor: pointer; animation-delay: ${index * 0.05}s"
                             aria-label="Заказ #${order.id} от ${order.timestamp}">
                            <div class="order-item-icon">
                                <i class="fas fa-receipt"></i>
                            </div>
                            <div class="order-item-info">
                                <div class="order-item-title">Заказ #${order.id}</div>
                                <div class="order-item-date">${order.timestamp}</div>
                                <div class="order-item-total">${order.total}₽</div>
                            </div>
                            <div class="order-item-actions">
                                <button class="reorder-btn" onclick="event.stopPropagation(); reorder('${order.id}')" 
                                        aria-label="Повторить заказ #${order.id}">
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
                <button class="back-button" onclick="showOrdersPage()" aria-label="Назад к заказам">
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
            <div class="order-detail">
                <div class="order-info-card">
                    <div class="info-row">
                        <span>Дата:</span>
                        <span class="info-value">${order.timestamp}</span>
                    </div>
                    <div class="info-row">
                        <span>Покупатель:</span>
                        <span class="info-value">${order.user_name}</span>
                    </div>
                    <div class="info-row">
                        <span>Статус:</span>
                        <span class="info-value status-${order.status}">
                            ${order.status === 'pending' ? 'Оформлен' : 
                              order.status === 'completed' ? 'Выполнен' : 'В обработке'}
                        </span>
                    </div>
                </div>
                
                <div class="order-items-card">
                    <h3>Состав заказа:</h3>
                    ${order.items.map(item => `
                        <div class="order-item-row">
                            <span>${item.name} × ${item.quantity}</span>
                            <span class="item-total">${item.total}₽</span>
                        </div>
                    `).join('')}
                    
                    <div class="order-total-row">
                        <span>Итого:</span>
                        <span class="final-total">${order.total}₽</span>
                    </div>
                </div>
                
                <div class="order-actions">
                    <button onclick="reorder('${order.id}')" class="action-btn primary" aria-label="Повторить этот заказ">
                        <i class="fas fa-redo"></i> Повторить заказ
                    </button>
                    <button onclick="contactSupport('${order.id}')" class="action-btn secondary" aria-label="Связаться с поддержкой по заказу">
                        <i class="fas fa-headset"></i> Поддержка
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showPage('orders');
}

function reorder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    let addedCount = 0;
    order.items.forEach(item => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                type: item.type,
                category: teaCatalog.find(p => p.id === item.id)?.category || 'other',
                quantity: item.quantity
            });
        }
        addedCount += item.quantity;
    });
    
    saveCart();
    showNotification(`🛒 ${addedCount} товаров добавлено в корзину!`, 'green');
    showCartPage();
    
    trackEvent('reorder', { orderId, items: order.items.length });
}

function contactSupport(orderId) {
    const message = `❓ Вопрос по заказу #${orderId}`;
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/ivan_likhov?text=${encodedMessage}`;
    
    openTelegramLink(telegramUrl);
    trackEvent('contact_support', { orderId });
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
                <button class="back-button" onclick="goBack()" aria-label="Назад">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="page-title">
                    <i class="fas fa-user"></i>
                    <span>Мой профиль</span>
                </div>
                <div style="width: 40px;"></div>
            </div>
        </div>
        
        <div class="page-body profile-body">
            <div class="profile-header">
                <div class="profile-avatar ${hasPhoto ? '' : 'default-avatar'}" 
                     style="${hasPhoto ? `background-image: url('${userData.photo_url}')` : ''}">
                    ${!hasPhoto ? `<i class="fas fa-user-circle"></i>` : ''}
                </div>
                <h3 class="profile-name">${fullName}</h3>
                ${username ? `<p class="profile-username">${username}</p>` : ''}
                ${isTelegramUser ? '<p class="profile-badge">Telegram пользователь</p>' : ''}
            </div>
            
            <div class="profile-stats">
                <div class="stat-card" onclick="showCartPage()" style="cursor: pointer;">
                    <div class="stat-icon cart-icon">🛒</div>
                    <div class="stat-value">${cart.length}</div>
                    <div class="stat-label">В корзине</div>
                </div>
                
                <div class="stat-card" onclick="showOrdersPage()" style="cursor: pointer;">
                    <div class="stat-icon orders-icon">📦</div>
                    <div class="stat-value">${totalOrders}</div>
                    <div class="stat-label">Заказов</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon spent-icon">💰</div>
                    <div class="stat-value">${totalSpent}₽</div>
                    <div class="stat-label">Потрачено</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon status-icon">⭐</div>
                    <div class="stat-value">${orders.length > 2 ? 'Постоянный' : orders.length > 0 ? 'Новый' : 'Гость'}</div>
                    <div class="stat-label">Статус</div>
                </div>
            </div>
            
            <div class="profile-section">
                <h4><i class="fas fa-headset"></i> Контакты поддержки</h4>
                <div class="contact-list">
                    <div class="contact-item">
                        <i class="fab fa-telegram"></i>
                        <span>@ivan_likhov</span>
                        <button onclick="openTelegramLink('https://t.me/ivan_likhov')" aria-label="Написать в поддержку">
                            Написать
                        </button>
                    </div>
                    <div class="contact-item phone">
                        <i class="fas fa-phone"></i>
                        <span>+7 (903) 839-46-70</span>
                        <button onclick="window.location.href = 'tel:+79038394670'" aria-label="Позвонить в поддержку">
                            Позвонить
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="profile-section">
                <h4><i class="fas fa-cog"></i> Настройки</h4>
                <div class="settings-list">
                    <div class="setting-item">
                        <span>Уведомления</span>
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <span>Тема оформления</span>
                        <select onchange="toggleTheme(this.value)" aria-label="Выберите тему оформления">
                            <option value="auto">Авто</option>
                            <option value="light">Светлая</option>
                            <option value="dark">Темная</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="profile-actions">
                <button onclick="openTelegramLink('https://t.me/teatea_bar')" class="profile-btn telegram-btn" aria-label="Перейти в наш телеграм-канал">
                    <i class="fab fa-telegram"></i> Наш телеграм-канал
                </button>
                
                <button onclick="clearCart()" class="profile-btn danger-btn" aria-label="Очистить корзину">
                    <i class="fas fa-trash"></i> Очистить корзину
                </button>
                
                <button onclick="clearHistory()" class="profile-btn secondary-btn" aria-label="Очистить историю заказов">
                    <i class="fas fa-history"></i> Очистить историю заказов
                </button>
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
    if (cart.length === 0) {
        showNotification('Корзина уже пуста', 'gold');
        return;
    }
    
    if (confirm('Очистить корзину?')) {
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cart = [];
        saveCart();
        showNotification('🗑️ Корзина очищена', 'green');
        showMainPage();
        
        trackEvent('cart_cleared', { items: itemCount });
    }
}

function clearHistory() {
    if (orders.length === 0) {
        showNotification('История заказов пуста', 'gold');
        return;
    }
    
    if (confirm('Очистить всю историю заказов?')) {
        const orderCount = orders.length;
        orders = [];
        const key = `tea_orders_${userId}`;
        localStorage.removeItem(key);
        showNotification('📦 История заказов очищена', 'green');
        showMainPage();
        
        trackEvent('history_cleared', { orders: orderCount });
    }
}

// ========== УТИЛИТЫ И УВЕДОМЛЕНИЯ ==========
function showNotification(message, type = 'green') {
    const container = document.getElementById('notification-container');
    
    // Ограничиваем количество уведомлений
    if (container.children.length >= 3) {
        container.removeChild(container.firstChild);
    }
    
    const notification = document.createElement('div');
    notification.className = `tea-notification notification-${type} swipe-notification`;
    
    const hasEmoji = /^[^\w\s]/.test(message);
    const displayMessage = hasEmoji ? message : `✅ ${message}`;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'green' ? 'check-circle' : type === 'red' ? 'exclamation-circle' : type === 'gold' ? 'info-circle' : 'bell'}"></i>
        <span>${displayMessage}</span>
    `;
    
    container.appendChild(notification);
    
    // Свайп для удаления
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;
    
    notification.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        notification.classList.add('swiping');
    }, { passive: true });
    
    notification.addEventListener('touchmove', (e) => {
        if (!startX) return;
        
        currentX = e.touches[0].clientX;
        const swipeDistance = currentX - startX;
        
        if (swipeDistance > 0) {
            notification.style.transform = `translateX(${Math.min(swipeDistance, 100)}px)`;
            notification.style.opacity = `${1 - Math.min(swipeDistance, 100) / 200}`;
            isSwiping = true;
        }
    }, { passive: true });
    
    notification.addEventListener('touchend', () => {
        notification.classList.remove('swiping');
        
        const swipeDistance = currentX - startX;
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
            notification.style.transition = 'transform 0.3s ease';
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }
        
        startX = 0;
        currentX = 0;
        isSwiping = false;
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
    
    notification.addEventListener('touchstart', () => {
        clearTimeout(autoRemove);
    }, { once: true });
    
    // Тактильная обратная связь
    if (window.hapticFeedback) {
        window.hapticFeedback.notificationOccurred('success');
    }
    
    // Аналитика
    trackEvent('notification_shown', { type, message });
}

// Универсальная функция открытия ссылок
function openTelegramLink(url) {
    if (tg && tg.openLink) {
        tg.openLink(url);
    } else if (isIOS) {
        window.location.href = url;
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
    
    trackEvent('link_opened', { url });
}

// Вибрация для Android
function vibrate(pattern = [50]) {
    if ('vibrate' in navigator && !isIOS) {
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            console.log('Vibration not supported');
        }
    }
}

// Аналитика
function trackEvent(event, data = {}) {
    const eventData = {
        event,
        timestamp: Date.now(),
        userId,
        userType: isTelegramUser ? 'telegram' : 'guest',
        platform: isIOS ? 'ios' : isAndroid ? 'android' : 'web',
        page: currentPage,
        ...data
    };
    
    // Логируем в консоль для отладки
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${event}:`, eventData);
    }
    
    // Отправляем в Telegram, если доступно
    if (tg && tg.sendData) {
        try {
            tg.sendData(JSON.stringify(eventData));
        } catch (e) {
            console.error('Ошибка отправки аналитики:', e);
        }
    }
}

// ========== СЕРВИС ВОРКЕР ДЛЯ ОФЛАЙН-РЕЖИМА ==========
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker зарегистрирован:', registration);
            })
            .catch(error => {
                console.log('❌ Ошибка регистрации Service Worker:', error);
            });
    }
}

// ========== ЗАГРУЗКА ПРИЛОЖЕНИЯ ==========
window.addEventListener('DOMContentLoaded', () => {
    // Регистрируем Service Worker
    registerServiceWorker();
    
    // Инициализируем приложение
    setTimeout(initApp, 100);
});

// Экспортируем функции в глобальную область видимости
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
