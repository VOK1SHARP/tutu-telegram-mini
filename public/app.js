// ===========================================
// ТИ•ТИ - ЧАЙНАЯ ГАРМОНИЯ
// Telegram Mini App для заказа чая
// ОСНОВНОЙ ФАЙЛ ПРИЛОЖЕНИЯ
// ===========================================

// Глобальные переменные
let tg = null;
let cart = [];
let userData = null;
let userId = null;
let isTelegramUser = false;
let orders = [];
let currentPage = 'main';

// Простой каталог чая для тестирования
const teaCatalog = [
    {
        id: 1,
        name: 'БАНЬ ЧЖАН ХУН ПЯО',
        subtitle: 'Урожай 2022 года',
        type: 'Шу Пуэр',
        category: 'puer',
        price: 500,
        icon: 'fas fa-mountain-sun',
        description: 'Классический шу пуэр из провинции Юньнань'
    },
    {
        id: 2,
        name: 'ТЕ ГУАНЬ ИНЬ',
        subtitle: 'Железная богиня милосердия',
        type: 'Улун',
        category: 'oolong',
        price: 420,
        icon: 'fas fa-yin-yang',
        description: 'Полуферментированный улун из Фуцзяни'
    }
];

// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
function initApp() {
    console.log('🚀 Инициализация ТИ•ТИ Чайной лавки...');
    
    try {
        // Пытаемся получить Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
            tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();
            console.log('Telegram WebApp инициализирован');
        } else {
            console.log('Telegram WebApp не обнаружен, работаем в браузере');
        }
        
        // Генерируем ID пользователя
        userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
        userData = {
            id: userId,
            first_name: 'Гость',
            username: ''
        };
        
        // Загружаем корзину
        loadCart();
        
        // Показываем главную страницу
        showMainPage();
        
        console.log('✅ Приложение успешно загружено');
        
    } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
        // Резервное отображение
        showSimpleMainPage();
    }
}

// Упрощенная главная страница
function showSimpleMainPage() {
    const page = document.getElementById('main-page');
    if (!page) return;
    
    page.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <div style="font-size: 48px; color: #4CAF50; margin-bottom: 10px;">🍵</div>
            <h1 style="color: #2E7D32; margin-bottom: 10px;">ТИ•ТИ ЧАЙ</h1>
            <p style="color: #666; margin-bottom: 30px;">Чайная лавка</p>
            
            <div style="background: linear-gradient(135deg, #7B1FA2, #BA68C8); padding: 20px; border-radius: 15px; color: white; margin-bottom: 20px;">
                <h2 style="margin-bottom: 10px;">Добро пожаловать!</h2>
                <p style="opacity: 0.9;">Аутентичный китайский чай с доставкой</p>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button onclick="showCatalogPage()" style="flex: 1; padding: 15px; background: #4CAF50; color: white; border: none; border-radius: 10px; font-weight: bold;">
                    <i class="fas fa-search"></i> Выбрать чай
                </button>
                <button onclick="showCartPage()" style="flex: 1; padding: 15px; background: #FFC107; color: #333; border: none; border-radius: 10px; font-weight: bold;">
                    <i class="fas fa-shopping-cart"></i> Корзина
                </button>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                <div onclick="showCatalogPage('puer')" style="background: #5D4037; color: white; padding: 15px; border-radius: 10px; text-align: center; cursor: pointer;">
                    <i class="fas fa-mountain"></i><br>Пуэр
                </div>
                <div onclick="showCatalogPage('oolong')" style="background: #F57C00; color: white; padding: 15px; border-radius: 10px; text-align: center; cursor: pointer;">
                    <i class="fas fa-yin-yang"></i><br>Улун
                </div>
                <div onclick="showCatalogPage('red')" style="background: #D32F2F; color: white; padding: 15px; border-radius: 10px; text-align: center; cursor: pointer;">
                    <i class="fas fa-fire"></i><br>Красный
                </div>
                <div onclick="showCatalogPage('green')" style="background: #2E7D32; color: white; padding: 15px; border-radius: 10px; text-align: center; cursor: pointer;">
                    <i class="fas fa-leaf"></i><br>Зеленый
                </div>
            </div>
        </div>
    `;
    
    showPage('main');
}

// Главная страница
function showMainPage() {
    try {
        showSimpleMainPage();
    } catch (error) {
        console.error('Ошибка показа главной страницы:', error);
        showSimpleMainPage();
    }
}

// Страница каталога
function showCatalogPage(category) {
    const page = document.getElementById('catalog-page');
    if (!page) return;
    
    let filteredTeas = teaCatalog;
    if (category) {
        filteredTeas = teaCatalog.filter(tea => tea.category === category);
    }
    
    page.innerHTML = `
        <div style="background: linear-gradient(135deg, #4CAF50, #2E7D32); padding: 15px; color: white;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <button onclick="showMainPage()" style="background: none; border: none; color: white; font-size: 18px;">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2 style="flex: 1;">Каталог чая</h2>
            </div>
        </div>
        
        <div style="padding: 15px;">
            ${filteredTeas.map(tea => `
                <div style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee; gap: 15px;">
                    <div style="width: 60px; height: 60px; background: #4CAF50; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                        <i class="${tea.icon}"></i>
                    </div>
                    <div style="flex: 1;">
                        <h3 style="margin-bottom: 5px;">${tea.name}</h3>
                        <p style="color: #666; font-size: 14px; margin-bottom: 5px;">${tea.subtitle}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #4CAF50; font-weight: bold; font-size: 18px;">${tea.price}₽</span>
                            <button onclick="addToCart(${tea.id})" style="padding: 8px 15px; background: #4CAF50; color: white; border: none; border-radius: 5px;">
                                В корзину
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    showPage('catalog');
}

// Страница корзины
function showCartPage() {
    const page = document.getElementById('cart-page');
    if (!page) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    page.innerHTML = `
        <div style="background: linear-gradient(135deg, #4CAF50, #2E7D32); padding: 15px; color: white;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <button onclick="showMainPage()" style="background: none; border: none; color: white; font-size: 18px;">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2 style="flex: 1;">Корзина</h2>
            </div>
        </div>
        
        <div style="padding: 15px;">
            ${cart.length === 0 ? `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 48px; color: #ccc; margin-bottom: 20px;">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3 style="margin-bottom: 10px;">Корзина пуста</h3>
                    <p style="color: #666; margin-bottom: 20px;">Добавьте товары из каталога</p>
                    <button onclick="showCatalogPage()" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; border-radius: 10px; font-weight: bold;">
                        Перейти в каталог
                    </button>
                </div>
            ` : `
                <div>
                    ${cart.map(item => `
                        <div style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee; gap: 15px;">
                            <div style="width: 50px; height: 50px; background: #4CAF50; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white;">
                                <i class="fas fa-leaf"></i>
                            </div>
                            <div style="flex: 1;">
                                <h4 style="margin-bottom: 5px;">${item.name}</h4>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #4CAF50; font-weight: bold;">${item.price}₽ × ${item.quantity}</span>
                                    <span style="font-weight: bold;">${item.price * item.quantity}₽</span>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <button onclick="updateCartQuantity(${item.id}, -1)" style="width: 30px; height: 30px; border: 1px solid #ddd; background: white; border-radius: 50%;">
                                    -
                                </button>
                                <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                                <button onclick="updateCartQuantity(${item.id}, 1)" style="width: 30px; height: 30px; background: #4CAF50; color: white; border: none; border-radius: 50%;">
                                    +
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 20px; padding: 20px; background: #f5f5f5; border-radius: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="font-size: 18px; font-weight: bold;">Итого:</span>
                        <span style="font-size: 24px; font-weight: bold; color: #4CAF50;">${total}₽</span>
                    </div>
                    <button onclick="startCheckout()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #7B1FA2, #BA68C8); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: bold;">
                        Оформить заказ (${totalItems})
                    </button>
                </div>
            `}
        </div>
    `;
    
    showPage('cart');
}

// Добавить в корзину
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
            quantity: 1
        });
    }
    
    saveCart();
    showNotification(`✅ ${product.name} добавлен в корзину!`);
}

// Обновить количество
function updateCartQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += delta;
    
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
        showNotification('🗑️ Товар удален из корзины');
    }
    
    saveCart();
    showCartPage();
}

// Оформление заказа
function startCheckout() {
    if (cart.length === 0) {
        showNotification('🛒 Добавьте товары в корзину!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (confirm(`Подтвердить заказ на сумму ${total}₽?`)) {
        showNotification('🎉 Заказ оформлен!');
        cart = [];
        saveCart();
        showMainPage();
    }
}

// Уведомления
function showNotification(message) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        background: linear-gradient(135deg, #4CAF50, #2E7D32);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        margin-bottom: 10px;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        <i class="fas fa-check-circle" style="margin-right: 10px;"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Показать страницу
function showPage(pageName) {
    // Скрыть все страницы
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Показать нужную страницу
    const activePage = document.getElementById(pageName + '-page');
    if (activePage) {
        activePage.classList.add('active');
        currentPage = pageName;
    }
}

// Загрузить корзину
function loadCart() {
    try {
        const saved = localStorage.getItem('tea_cart_' + userId);
        if (saved) {
            cart = JSON.parse(saved);
            if (!Array.isArray(cart)) cart = [];
        }
    } catch (e) {
        console.error('Ошибка загрузки корзины:', e);
        cart = [];
    }
}

// Сохранить корзину
function saveCart() {
    try {
        localStorage.setItem('tea_cart_' + userId, JSON.stringify(cart));
    } catch (e) {
        console.error('Ошибка сохранения корзины:', e);
    }
}

// Экспорт функций в глобальную область видимости
window.initApp = initApp;
window.showMainPage = showMainPage;
window.showCatalogPage = showCatalogPage;
window.showCartPage = showCartPage;
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.startCheckout = startCheckout;
window.showNotification = showNotification;
