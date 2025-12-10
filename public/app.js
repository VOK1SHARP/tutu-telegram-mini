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
let lastScrollTop = 0;

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

// ========== КАТАЛОГ ЧАЯ ==========
const teaCatalog = [
    {
        id: 1,
        name: 'БАНЬ ЧЖАН ХУН ПЯО',
        subtitle: 'Урожай 2022 года',
        type: 'Шу Пуэр',
        category: 'puer',
        price: 500,
        icon: 'fas fa-mountain-sun',
        image: 'puer1.jpg',
        description: 'Полностью ферментированный чай из провинции Юньнань, классический шу пуэр с глубоким и богатым характером.',
        effect: 'Энергия',
        brewing: {
            pour: {
                temp: '90-95°C',
                amount: '5-8 г на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 25-30 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '90-95°C',
                amount: '5-8 г на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Яркая, прохладная нота с древесными оттенками',
            taste: 'Ореховый, древесный с яркими фруктами и отчетливым черносливом',
            region: 'Юньнань, Китай',
            harvest: '2022 год',
            weight: '50г'
        }
    },
    {
        id: 2,
        name: 'СТАРЫЕ ДЕРЕВЬЯ',
        subtitle: 'Урожай 2009 года',
        type: 'Шу Пуэр',
        category: 'puer',
        price: 500,
        icon: 'fas fa-tree',
        image: 'puer2.jpg',
        description: 'Выдержанный чай из сырья, собранного со старых чайных деревьев в провинции Юньнань.',
        effect: 'Расслабляет',
        brewing: {
            pour: {
                temp: '90-95°C',
                amount: '5-8 г на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 35-50 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '90-95°C',
                amount: '5-8 г на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Сдержанный, древесно-ягодный',
            taste: 'Сочный, чистый и гладкий, маслянистый, сладковатый с ягодной кислинкой',
            region: 'Юньнань, Китай',
            harvest: '2009 год',
            weight: '50г'
        }
    },
    {
        id: 3,
        name: 'НОУ МИ СЯН',
        subtitle: 'С ароматом клейкого риса',
        type: 'Шу Пуэр',
        category: 'puer',
        price: 50,
        icon: 'fas fa-bowl-rice',
        image: 'puer3.jpg',
        description: 'Особый вид пуэра, ферментированный совместно с травой Ноу Ми Сян.',
        effect: 'Расслабляет',
        brewing: {
            pour: {
                temp: '90-95°C',
                amount: '8 г (квадратик) на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 35-50 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '90-95°C',
                amount: '8 г (квадратик) на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Напоминает влажные листья и пропаренный рис',
            taste: 'Древесно-землистые ноты, кукурузно-травяной вкус с оттенками сухофруктов',
            region: 'Юньнань, Китай',
            weight: '8г (прессованный)'
        }
    },
    {
        id: 4,
        name: 'ПАВЛИН ИЗ БУЛАНЬ',
        subtitle: 'Шу пуэр',
        type: 'Шу Пуэр',
        category: 'puer',
        price: 450,
        icon: 'fas fa-feather',
        image: 'puer4.jpg',
        description: 'Качественный шу пуэр с богатым вкусом.',
        effect: 'Энергия',
        brewing: {
            pour: {
                temp: '90-95°C',
                amount: '7-10 г на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 40-60 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '90-95°C',
                amount: '7-10 г на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Древесный, земляной',
            taste: 'Насыщенный, гладкий с нотами чернослива',
            region: 'Юньнань, Китай',
            weight: '50г'
        }
    },
    {
        id: 5,
        name: 'ТЕ ГУАНЬ ИНЬ',
        subtitle: 'Железная богиня милосердия',
        type: 'Улун',
        category: 'oolong',
        price: 420,
        icon: 'fas fa-yin-yang',
        image: 'oolong1.jpg',
        description: 'Полуферментированный улун, занимающий промежуточное положение между зелёными и красными чаями.',
        effect: 'Расслабляет',
        brewing: {
            pour: {
                temp: '80-85°C',
                amount: '5-8 г на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 20-25 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '80-85°C',
                amount: '5-8 г на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Сбалансированный, с оттенками цветов и свежескошенной травы',
            taste: 'Плотный, маслянистый, ноты цветочной и кондитерской сладости',
            region: 'Фуцзянь, Китай',
            weight: '50г'
        }
    },
    {
        id: 6,
        name: 'ЖОУ ГУЙ НУН СЯН',
        subtitle: 'Мясистая корица с сильным ароматом',
        type: 'Улун',
        category: 'oolong',
        price: 440,
        icon: 'fas fa-spice',
        image: 'oolong2.jpg',
        description: 'Утёсный улун из провинции Фуцзянь с насыщенным пряным профилем и глубиной вкуса.',
        effect: 'Энергия',
        brewing: {
            pour: {
                temp: '80-90°C',
                amount: '5-8 г на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 30-40 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '80-90°C',
                amount: '5-8 г на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Ноты корочки ржаного хлеба, корицы и карамели',
            taste: 'Насыщенный, с терпкостью, слегка горьковатый, быстро переходит в сладость',
            region: 'Фуцзянь, Китай',
            weight: '50г'
        }
    },
    {
        id: 7,
        name: 'ГАБА МАО ЧА',
        subtitle: 'Особый ферментированный чай',
        type: 'ГАБА',
        category: 'gaba',
        price: 300,
        icon: 'fas fa-brain',
        image: 'gaba.jpg',
        description: 'Особый вид чая с высоким содержанием GABA (гамма-аминомасляной кислоты).',
        effect: 'Расслабляет',
        brewing: {
            pour: {
                temp: '80-85°C',
                amount: '5-8 г на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 20-30 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '80-85°C',
                amount: '5-8 г на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Пряный, с нотами сухофруктов',
            taste: 'Насыщенный, сбалансированный, с долгим послевкусием',
            region: 'Китай',
            weight: '50г'
        }
    },
    {
        id: 8,
        name: 'ХЭЙ ЦЗИНЬ',
        subtitle: 'Черное золото',
        type: 'Красный чай',
        category: 'red',
        price: 430,
        icon: 'fas fa-crown',
        image: 'red1.jpg',
        description: 'Премиальный красный чай из северной части провинции Фуцзянь с объёмным вкусовым профилем.',
        effect: 'Расслабляет',
        brewing: {
            pour: {
                temp: '85-95°C',
                amount: '5-8 г на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 20-30 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '85-95°C',
                amount: '5-8 г на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Медовые, хлебные ноты',
            taste: 'Пряные, хлебные, медовые, сухофруктовые ноты',
            region: 'Фуцзянь, Китай',
            weight: '50г'
        }
    },
    {
        id: 9,
        name: 'СЯО ЧЖУН',
        subtitle: 'Подлинный горный мелколистный',
        type: 'Красный чай',
        category: 'red',
        price: 500,
        icon: 'fas fa-mountain',
        image: 'red2.jpg',
        description: 'Один из самых известных китайских красных чаёв с горного хребта Уишань.',
        effect: 'Расслабляет',
        brewing: {
            pour: {
                temp: '80-90°C',
                amount: '5-8 г на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 20-40 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '80-90°C',
                amount: '5-8 г на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Медово-карамельный с шоколадными и хлебными оттенками',
            taste: 'Ягодные и сухофруктовые ноты с тонким акцентом печеных орехов',
            region: 'Фуцзянь, Китай',
            weight: '50г'
        }
    },
    {
        id: 10,
        name: 'ГУ ШУ ХУН ЧА',
        subtitle: 'Красный чай со старых деревьев',
        type: 'Красный чай',
        category: 'red',
        price: 300,
        icon: 'fas fa-tree',
        image: 'red3.jpg',
        description: 'Красный чай из листьев древних чайных деревьев возрастом от десятков до сотен лет.',
        effect: 'Энергия',
        brewing: {
            pour: {
                temp: '85-90°C',
                amount: '5-8 г на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 20-30 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '85-90°C',
                amount: '5-8 г на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Медовые и травяные ноты, оттенки сухофруктов и корицы',
            taste: 'Преобладает сладость фруктов с ягодной терпкостью в послевкусии',
            region: 'Юньнань/Фуцзянь',
            weight: '50г'
        }
    },
    {
        id: 11,
        name: 'ДЯНЬ ХУН',
        subtitle: 'Красный чай из Дяньси',
        type: 'Красный чай',
        category: 'red',
        price: 300,
        icon: 'fas fa-fire',
        image: 'red4.jpg',
        description: 'Классический красный чай из исторической провинции Дяньси (Юньнань).',
        effect: 'Расслабляет',
        brewing: {
            pour: {
                temp: '85-95°C',
                amount: '5-8 г на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 20-30 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '85-95°C',
                amount: '5-8 г на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Приглушенный сладкий аромат с нотами свежей выпечки',
            taste: 'Нотки шоколада, легкая медовая сладость, оттенки выпечки',
            region: 'Юньнань, Китай',
            weight: '50г'
        }
    },
    {
        id: 12,
        name: 'МАО ЦЗЯНЬ',
        subtitle: 'Пушистые кончики',
        type: 'Зеленый чай',
        category: 'green',
        price: 300,
        icon: 'fas fa-leaf',
        image: 'green1.jpg',
        description: 'Один из самых известных китайских зелёных чаёв, входит в "Десятку знаменитых чаёв Китая".',
        effect: 'Энергия',
        brewing: {
            pour: {
                temp: '65-75°C',
                amount: '5-8 г на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 7-15 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '65-75°C',
                amount: '5-8 г на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Свежие оттенки цветов и луговых трав',
            taste: 'Гладкий, освежающий, с легкой кислинкой, сладкое послевкусие',
            region: 'Хэнань, Китай',
            weight: '50г'
        }
    },
    {
        id: 13,
        name: 'МО ЛИ ХУА ЧА',
        subtitle: 'Жасминовый цветочный чай',
        type: 'Зеленый чай',
        category: 'green',
        price: 350,
        icon: 'fas fa-flower',
        image: 'green2.jpg',
        description: 'Традиционный китайский чай с тысячелетней историей, ароматизированный цветками жасмина.',
        effect: 'Расслабляет',
        brewing: {
            pour: {
                temp: '65-75°C',
                amount: '5-8 г на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 20-40 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '65-75°C',
                amount: '5-8 г на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Цветочный, жасминовый',
            taste: 'Мягкий, освежающий, сладковатый с жасминовой терпкостью',
            region: 'Фуцзянь, Китай',
            weight: '50г'
        }
    },
    {
        id: 14,
        name: 'ГУН МЭЙ',
        subtitle: 'Бровь, подношение',
        type: 'Белый чай',
        category: 'white',
        price: 450,
        icon: 'fas fa-heart',
        image: 'white1.jpg',
        description: 'Белый чай с минимальной обработкой, максимально сохраняющий природные биологические вещества.',
        effect: 'Расслабляет',
        brewing: {
            pour: {
                temp: '80-85°C',
                amount: '5-8 г на 150-200 мл',
                steps: [
                    'Пролив слить',
                    'Второй 20-25 сек',
                    'Каждые следующие +10 сек'
                ]
            },
            infusion: {
                temp: '80-85°C',
                amount: '5-8 г на чайник 500 мл',
                steps: [
                    'Промойте',
                    'Залейте водой',
                    'Настаивайте 3–5 мин'
                ]
            }
        },
        details: {
            aroma: 'Медовые, слегка ореховые оттенки, легкий шлейф сухих цветов',
            taste: 'Мягкая сладость, напоминающая горный мёд, с легкой терпкостью',
            region: 'Фуцзянь, Китай',
            weight: '50г'
        }
    }
];

// Категории с изображениями
const teaCategories = [
    { 
        id: 'all', 
        name: 'Все сорта', 
        icon: 'fas fa-mug-hot', 
        color: 'var(--tea-green)',
        image: 'category_all.jpg'
    },
    { 
        id: 'puer', 
        name: 'Пуэр', 
        icon: 'fas fa-mountain', 
        color: '#5D4037',
        image: 'category_puer.jpg'
    },
    { 
        id: 'oolong', 
        name: 'Улун', 
        icon: 'fas fa-yin-yang', 
        color: '#F57C00',
        image: 'category_oolong.jpg'
    },
    { 
        id: 'gaba', 
        name: 'Габа', 
        icon: 'fas fa-brain', 
        color: '#7B1FA2',
        image: 'gaba.jpg'
    },
    { 
        id: 'red', 
        name: 'Красный чай', 
        icon: 'fas fa-fire', 
        color: '#D32F2F',
        image: 'category_red.jpg'
    },
    { 
        id: 'green', 
        name: 'Зеленый чай', 
        icon: 'fas fa-leaf', 
        color: '#2E7D32',
        image: 'category_green.jpg'
    },
    { 
        id: 'white', 
        name: 'Белый чай', 
        icon: 'fas fa-cloud', 
        color: '#757575',
        image: 'category_white.jpg'
    }
];

// ========== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ==========
async function initApp() {
    console.log('🚀 Инициализация ТИ•ТИ Чайной лавки...');
    
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
        if (prefersDark) {
            document.body.classList.add('dark-theme');
        }
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
            
            localStorage.setItem('tea_user_cache', JSON.stringify({
                data: userData,
                timestamp: Date.now()
            }));
            
            return userData;
        }
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
    }
    
    const cached = localStorage.getItem('tea_user_cache');
    if (cached) {
        try {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < 30 * 60 * 1000) {
                return data;
            }
        } catch (e) {}
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
        'Белый чай': 'white-tea',
        'ГАБА': 'gaba'
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
    
    if (currentPageEl) {
        currentPageEl.classList.remove('active');
        currentPageEl.classList.add('exiting');
        
        setTimeout(() => {
            currentPageEl.classList.remove('exiting');
            currentPageEl.style.display = 'none';
        }, 300);
    }
    
    nextPageEl.style.display = 'block';
    setTimeout(() => {
        nextPageEl.classList.add('active');
        currentPage = pageName;
        
        if (pageName === 'main') {
            setTimeout(updateMainCartFooter, 100);
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
    
    page.innerHTML = `
        <!-- Шапка с логотипом -->
        <div class="header-with-pattern">
            <div class="logo-centered">
                <div class="logo-svg" style="
                    width: 80px;
                    height: 80px;
                    margin: 0 auto;
                    background: linear-gradient(135deg, #4CAF50, #2E7D32);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    color: white;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                ">
                    🍵
                </div>
                <h2 style="margin-top: 10px; color: var(--tea-text); font-size: 24px; letter-spacing: 2px;">ТИ•ТИ ЧАЙ</h2>
                <p style="color: var(--tea-text-light); margin-top: 5px;">Чайная лавка</p>
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
                    <i class="fas fa-filter"></i> Категории
                </h2>
                <div class="category-grid">
                    ${teaCategories.map((category, index) => {
                        const teasInCategory = category.id === 'all' 
                            ? teaCatalog.length 
                            : teaCatalog.filter(t => t.category === category.id).length;
                        const countText = teasInCategory === 1 ? '1 вид' : `${teasInCategory} вида`;
                        
                        const hasImage = category.image && category.image !== '';
                        const backgroundStyle = hasImage 
                            ? `background-image: url('${category.image}'); background-size: cover;`
                            : `background: ${category.color};`;
                        
                        return `
                        <div class="category-item" onclick="showCatalogPage('${category.id}')" 
                             style="cursor: pointer; animation-delay: ${0.1 + index * 0.05}s"
                             aria-label="${category.name}">
                            <div class="category-image-container" 
                                 style="${backgroundStyle}">
                                <div class="category-overlay">
                                    <i class="${category.icon}"></i>
                                </div>
                            </div>
                            <div class="category-name">${category.name}</div>
                            <div class="category-count">${countText}</div>
                        </div>
                        `;
                    }).join('')}
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
    setTimeout(() => {
        updateMainCartFooter();
        setupCartFooterScroll();
    }, 100);
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
    const categoryName = teaCategories.find(c => c.id === category)?.name || 'Все сорта';
    const countText = filteredTeas.length === 1 ? '1 вид' : `${filteredTeas.length} вида`;
    
    page.innerHTML = `
        <div class="page-header">
            <div class="page-header-content">
                <button class="back-button" onclick="goBack()" aria-label="Назад">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="page-title">
                    <i class="fas fa-mug-hot"></i>
                    <span>${categoryName} (${countText})</span>
                </div>
                <div style="width: 40px;"></div>
            </div>
        </div>
        
        <div class="catalog-filters">
            <div class="filter-buttons">
                ${teaCategories.map(cat => {
                    const teasCount = cat.id === 'all' 
                        ? teaCatalog.length 
                        : teaCatalog.filter(t => t.category === cat.id).length;
                    return `
                    <button class="filter-btn ${category === cat.id ? 'active' : ''}" 
                            onclick="showCatalogPage('${cat.id}')" 
                            aria-label="${cat.name}"
                            aria-pressed="${category === cat.id}">
                        ${cat.name} (${teasCount})
                    </button>
                `}).join('')}
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
                        <div class="catalog-product-effect">${tea.effect}</div>
                        <div class="catalog-product-price">${tea.price}₽ / ${tea.details.weight}</div>
                    </div>
                    <div class="catalog-product-actions">
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
                        <div class="product-effect">${product.effect}</div>
                        <div class="product-type">${product.type}</div>
                    </div>
                </div>
                
                <!-- Цена -->
                <div class="product-price-main">${product.price}₽ / ${product.details.weight}</div>
                
                <!-- Описание -->
                <div class="product-description">
                    <p>${product.description}</p>
                </div>
                
                <!-- Способы заваривания -->
                <div class="tea-brewing">
                    <h3><i class="fas fa-mug-hot"></i> Способы заваривания</h3>
                    
                    <div class="brewing-methods">
                        <div class="brewing-method">
                            <h4><i class="fas fa-faucet"></i> Проливом</h4>
                            <div class="brewing-details">
                                <p><strong>Температура:</strong> ${product.brewing.pour.temp}</p>
                                <p><strong>Количество:</strong> ${product.brewing.pour.amount}</p>
                                <p><strong>Способ:</strong></p>
                                <ol>
                                    ${product.brewing.pour.steps.map(step => `<li>${step}</li>`).join('')}
                                </ol>
                            </div>
                        </div>
                        
                        <div class="brewing-method">
                            <h4><i class="fas fa-clock"></i> Настаиванием</h4>
                            <div class="brewing-details">
                                <p><strong>Температура:</strong> ${product.brewing.infusion.temp}</p>
                                <p><strong>Количество:</strong> ${product.brewing.infusion.amount}</p>
                                <p><strong>Способ:</strong></p>
                                <ol>
                                    ${product.brewing.infusion.steps.map(step => `<li>${step}</li>`).join('')}
                                </ol>
                            </div>
                        </div>
                    </div>
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
                        
                        if (key === 'effect') return ''; // Уже есть отдельно
                        
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
    } catch (e) {
        console.error('Ошибка сохранения корзины:', e);
    }
}

function updateCart() {
    updateMainCartFooter();
    
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
            weight: product.details.weight
        });
    }
    
    saveCart();
    
    createAddToCartEffect(event);
    showNotification(`✅ ${product.name} добавлен в корзину!`, 'green');
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

// Управление скроллом футера корзины
function setupCartFooterScroll() {
    const cartFooter = document.querySelector('.main-cart-footer');
    if (!cartFooter) return;
    
    let ticking = false;
    let lastScrollTop = 0;
    
    function updateFooterVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            cartFooter.classList.add('hidden');
        } else if (scrollTop < lastScrollTop || scrollTop <= 50) {
            cartFooter.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateFooterVisibility);
            ticking = true;
        }
    }, { passive: true });
    
    setTimeout(updateFooterVisibility, 100);
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
                                <div class="cart-item-weight">${item.weight || '50г'}</div>
                                <div class="cart-item-price">${item.price}₽</div>
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
    
    const confirmBtn = document.getElementById('confirm-checkout-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка...';
    }
    
    try {
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
                type: item.type,
                weight: item.weight
            })),
            total: total,
            items_count: totalItems,
            timestamp: new Date().toLocaleString('ru-RU'),
            status: 'pending'
        };
        
        await saveOrder(order);
        
        const message = `🛒 *Новый заказ #${orderId}*\n\n` +
                       `👤 *Клиент:* ${order.user_name}${order.user_username ? ` (@${order.user_username})` : ''}\n` +
                       `💰 *Сумма:* ${order.total}₽\n` +
                       `📦 *Товаров:* ${totalItems}\n` +
                       `📅 *Дата:* ${order.timestamp}\n\n` +
                       `*Состав заказа:*\n` +
                       order.items.map(item => 
                           `• ${item.name} (${item.weight}) × ${item.quantity} = ${item.total}₽`
                       ).join('\n') + '\n\n' +
                       `_ID: ${userId}_`;
        
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://t.me/ivan_likhov?text=${encodedMessage}`;
        
        closeCheckoutModal();
        
        cart = [];
        await saveCart();
        
        showNotification(`🎉 Заказ #${orderId} оформлен!`, 'green');
        
        createConfetti();
        
        setTimeout(() => {
            openTelegramLink(telegramUrl);
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
                            <span>${item.name} (${item.weight}) × ${item.quantity}</span>
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
                quantity: item.quantity,
                weight: item.weight
            });
        }
        addedCount += item.quantity;
    });
    
    saveCart();
    showNotification(`🛒 ${addedCount} товаров добавлено в корзину!`, 'green');
    showCartPage();
}

function contactSupport(orderId) {
    const message = `❓ Вопрос по заказу #${orderId}`;
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
    }
}

// ========== УТИЛИТЫ И УВЕДОМЛЕНИЯ ==========
function showNotification(message, type = 'green') {
    const container = document.getElementById('notification-container');
    
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
}

// ========== СЕРВИС ВОРКЕР ==========
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
    registerServiceWorker();
    setTimeout(initApp, 100);
});

// Экспорт функций в глобальную область видимости
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
