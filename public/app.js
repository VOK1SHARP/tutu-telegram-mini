/* ===========================
   ТИ•ТИ - ЧАЙНАЯ ЛАВКА
   Полная версия в одном файле
   =========================== */

// Глобальные переменные
let tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
let cart = [];
let userData = null;
let userId = null;
let isTelegramUser = false;
let popularity = {};

// Каталог чая
const teaCatalog = [
    { id:1, name:'ЛАО ЧА ТОУ', subtitle:'Старые чайные головы', type:'Пуэр', price:1200, description:'Насыщенный и бархатистый чай с землистыми нотами и долгим послевкусием.', brewing:['🌿 5 гр чая на 500 мл воды','🌡 95°C','⏳ 3-5 минут'], benefits:['♥️ Антиоксидант', '🧠 Улучшает концентрацию'], tag:'Хит' },
    { id:2, name:'ХЭЙ ЦЗИНЬ', subtitle:'Черное золото', type:'Красный чай', price:950, description:'Аромат сладости с нотками меда и сухофруктов, мягкий вкус.', brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 85-95°C','⏳ 20-30 секунд'], benefits:['❄️ Согревает', '💆 Расслабляет'], tag:'Популярное' },
    { id:3, name:'ЖОУ ГУЙ НУН СЯН', subtitle:'Мясистая корица', type:'Улун', price:1100, description:'Чай для концентрации с пряными нотками корицы и карамели.', brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 80-90°C','⏳ 30-40 секунд'], benefits:['🦋 Стимулирует обмен веществ', '🔥 Тонизирует'], tag:'Рекомендуем' },
    { id:4, name:'ДЯНЬ ХУН', subtitle:'Красный чай из Юньнани', type:'Красный чай', price:850, description:'Теплый, хлебно-медовый аромат с фруктовым послевкусием.', brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 85-95°C','⏳ 20-30 секунд'], benefits:['❄️ Согревает', '🍎 Улучшает пищеварение'] },
    { id:5, name:'ГАБА МАО ЧА', subtitle:'Чай-сырец', type:'Габа', price:1400, description:'В аромате жареные семечки и карамель, богатый ГАБА-аминокислотами.', brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 85°C','⏳ 20-30 секунд'], benefits:['♥️ Полезен для сердца', '🧘 Успокаивает нервную систему'], tag:'Новинка' },
    { id:6, name:'ГУ ШУ ХУН ЧА', subtitle:'Красный чай со старых деревьев', type:'Красный чай', price:1300, description:'Насыщенные медово-сливовые оттенки с древесными нотками.', brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 85-90°C','⏳ 20-30 секунд'], benefits:['❄️ Согревает', '🌿 Детоксикация'] },
    { id:7, name:'ТЕ ГУАНЬ ИНЬ', subtitle:'Железная богиня милосердия', type:'Улун', price:1050, description:'Классический расслабляющий светлый улун с цветочным ароматом.', brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 85°C','⏳ 20-25 секунд'], benefits:['👨🏻‍🦳 Антиоксиданты', '🌱 Очищает организм'], tag:'Классика' },
    { id:8, name:'МО ЛИ ХУА ЧА', subtitle:'Жасмин', type:'Зеленый чай', price:900, description:'Свежий жасминовый аромат в сочетании с нежным вкусом зеленого чая.', brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 70°C','⏳ 20-40 секунд'], benefits:['🧘🏻‍♀️ Снимает стресс', '🌸 Освежает'] }
];

// ------------ Утилиты ------------
function sleep(ms){ return new Promise(res => setTimeout(res, ms)); }
function log(...args){ console.log('[app]', ...args); }
function error(...args){ console.error('[app]', ...args); }

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatPrice(price) {
    if (!price && price !== 0) return '0₽';
    return new Intl.NumberFormat('ru-RU', { 
        style: 'currency', 
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price).replace('₽', '') + '₽';
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString || '';
    }
}

function getTeaTypeClass(type) {
    const classes = {'Пуэр':'puer','Красный чай':'red-tea','Улун':'oolong','Габа':'gaba','Зеленый чай':'green-tea'};
    return classes[type] || '';
}

// ------------ Хранилище ------------
function loadCart() {
    try {
        const saved = localStorage.getItem('tutu_cart');
        if (saved) {
            cart = JSON.parse(saved);
            updateCartUI();
        }
    } catch(e) {
        console.error('Ошибка загрузки корзины:', e);
        cart = [];
    }
}

function saveCart() {
    try {
        localStorage.setItem('tutu_cart', JSON.stringify(cart));
        updateCartUI();
    } catch(e) {
        console.error('Ошибка сохранения корзины:', e);
    }
}

function loadOrders() {
    try {
        const saved = localStorage.getItem('tutu_orders');
        return saved ? JSON.parse(saved) : [];
    } catch(e) {
        console.error('Ошибка загрузки заказов:', e);
        return [];
    }
}

function saveOrder(order) {
    try {
        const orders = loadOrders();
        orders.push(order);
        localStorage.setItem('tutu_orders', JSON.stringify(orders));
        
        // Обновляем популярность
        updatePopularityFromOrder(order);
        return true;
    } catch(e) {
        console.error('Ошибка сохранения заказа:', e);
        return false;
    }
}

function loadPopularity() {
    try {
        const saved = localStorage.getItem('tutu_popularity');
        popularity = saved ? JSON.parse(saved) : {};
    } catch(e) {
        console.error('Ошибка загрузки популярности:', e);
        popularity = {};
    }
}

function savePopularity() {
    try {
        localStorage.setItem('tutu_popularity', JSON.stringify(popularity));
    } catch(e) {
        console.error('Ошибка сохранения популярности:', e);
    }
}

function updatePopularityFromOrder(order) {
    if (!order || !Array.isArray(order.cart)) return;
    order.cart.forEach(it => {
        const id = String(it.id);
        const q = Number(it.quantity || 1);
        popularity[id] = (popularity[id] || 0) + q;
    });
    savePopularity();
}

// ------------ Пользователь ------------
async function getUserData() {
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const u = tg.initDataUnsafe.user;
        isTelegramUser = true;
        return { 
            id: u.id || null, 
            first_name: u.first_name || '', 
            last_name: u.last_name || '', 
            username: u.username || '', 
            photo_url: u.photo_url || '', 
            is_bot: u.is_bot || false, 
            language_code: u.language_code || 'ru' 
        };
    }
    
    // Гость
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

function generateUserId() {
    if (userData && userData.id) return `tg_${userData.id}`;
    let guest = localStorage.getItem('tutu_guest_id');
    if (!guest) { 
        guest = 'guest_' + Date.now() + '_' + Math.random().toString(36).slice(2,9); 
        localStorage.setItem('tutu_guest_id', guest); 
    }
    return guest;
}

// ------------ Toast уведомления ------------
const TOAST_TIMEOUT = 3000;
let toastContainer = null;

function ensureToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            right: 14px;
            top: 14px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;
        document.body.appendChild(toastContainer);
    }
}

function showToast(text, options = {}) {
    ensureToastContainer();
    
    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.style.cssText = `
        background: ${options.type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 'rgba(0,0,0,0.8)'};
        color: white;
        padding: 10px 14px;
        border-radius: 12px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.2);
        max-width: 320px;
        font-size: 14px;
        opacity: 0;
        transform: translateY(-6px);
        transition: opacity 220ms ease, transform 220ms ease;
    `;
    toast.textContent = text;
    
    toastContainer.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });
    
    const timeout = options.timeout || TOAST_TIMEOUT;
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-6px)';
        setTimeout(() => toast.remove(), 260);
    }, timeout);
}

// ------------ Confirm диалог ------------
function showConfirm(message, title = 'Подтвердите действие') {
    return new Promise(resolve => {
        const overlay = document.createElement('div');
        overlay.id = 'confirm-overlay';
        overlay.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            opacity: 0;
            transition: opacity 180ms ease;
        `;
        
        overlay.innerHTML = `
            <div style="
                width: 92%;
                max-width: 420px;
                background: white;
                border-radius: 14px;
                overflow: hidden;
                box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                transform: scale(0.95);
                transition: transform 180ms ease;
            ">
                <div style="
                    background: #4CAF50;
                    color: white;
                    padding: 14px 16px;
                    font-weight: 700;
                    font-size: 16px;
                ">${escapeHtml(title)}</div>
                <div style="
                    padding: 16px;
                    font-size: 15px;
                    color: #333;
                    line-height: 1.5;
                ">${escapeHtml(message)}</div>
                <div style="
                    display: flex;
                    gap: 10px;
                    padding: 12px;
                    background: #fafafa;
                    justify-content: flex-end;
                ">
                    <button id="confirm-no" style="
                        background: #eee;
                        border: none;
                        padding: 8px 12px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Отмена</button>
                    <button id="confirm-yes" style="
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: 8px 12px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Подтвердить</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            overlay.querySelector('div').style.transform = 'scale(1)';
        });
        
        const noBtn = overlay.querySelector('#confirm-no');
        const yesBtn = overlay.querySelector('#confirm-yes');
        
        const close = (result) => {
            overlay.style.opacity = '0';
            overlay.querySelector('div').style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                overlay.remove();
                resolve(result);
            }, 180);
        };
        
        noBtn.onclick = () => close(false);
        yesBtn.onclick = () => close(true);
        
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                close(false);
            }
        };
    });
}

// ------------ Модальные окна ------------
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => {
        m.style.display = 'none';
        m.classList.remove('bottom-sheet');
        m.onclick = null;
    });
}

function closeModalById(id) {
    const m = document.getElementById(id);
    if (m) {
        m.style.display = 'none';
        m.classList.remove('bottom-sheet');
        m.onclick = null;
    }
}

function showModal(modalId, bottomSheet = false) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    closeAllModals();
    
    modal.style.display = 'flex';
    if (bottomSheet) {
        modal.classList.add('bottom-sheet');
    }
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModalById(modalId);
        }
    };
}

// ------------ Основной интерфейс ------------
function showMainInterface() {
    const app = document.getElementById('app');
    if (!app) return;
    
    const firstName = userData.first_name || 'Гость';
    const lastName = userData.last_name || '';
    const username = userData.username ? `@${userData.username}` : '';
    const fullName = `${firstName} ${lastName}`.trim();
    const hasPhoto = userData.photo_url && userData.photo_url.trim() !== '';

    app.innerHTML = `
        <!-- Header -->
        <div class="header fade-in">
            <div class="header-content">
                <div class="logo" onclick="showCatalog()" style="cursor: pointer;">
                    <div class="logo-icon"><i class="fas fa-leaf"></i></div>
                    <div class="logo-text">
                        <h1>ТИ•ТИ</h1>
                        <div class="subtitle">Чайная лавка</div>
                    </div>
                </div>
                <div class="user-avatar" onclick="showProfile()" title="${escapeHtml(fullName)}${username ? ` (${escapeHtml(username)})` : ''}">
                    ${hasPhoto ? 
                        `<img src="${escapeHtml(userData.photo_url)}" alt="${escapeHtml(fullName)}" 
                              onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\\'fas fa-user\\'></i>'" 
                              style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` 
                        : 
                        `<i class="fas fa-user"></i>`
                    }
                    <span class="cart-badge" style="display:none">0</span>
                    ${isTelegramUser ? 
                        `<div class="tg-badge" title="Telegram пользователь">TG</div>` 
                        : ''
                    }
                </div>
            </div>
        </div>

        <!-- Banner -->
        <div class="banner fade-in" style="animation-delay:0.1s">
            <h2>🍵 Добро пожаловать, ${escapeHtml(firstName)}!</h2>
            <p>${isTelegramUser ? 'Рады видеть вас снова!' : 'Аутентичный китайский чай с доставкой'}</p>
            <a href="#" class="banner-button" onclick="showCatalog(); return false;">
                Смотреть каталог
            </a>
        </div>

        <!-- Navigation -->
        <div class="nav-grid fade-in" style="animation-delay:0.2s">
            <div class="nav-item" onclick="showCatalog()">
                <div class="nav-icon icon-tea"><i class="fas fa-mug-hot"></i></div>
                <h3>Каталог</h3>
                <p>${teaCatalog.length}+ сортов чая</p>
            </div>
            <div class="nav-item" onclick="showOrders()">
                <div class="nav-icon icon-orders"><i class="fas fa-box"></i></div>
                <h3>Заказы</h3>
                <p>История покупок</p>
            </div>
            <div class="nav-item" onclick="showCartModal()">
                <div class="nav-icon icon-cart"><i class="fas fa-shopping-cart"></i></div>
                <h3>Корзина</h3>
                <p>Товары: <span class="cart-count">0</span></p>
            </div>
            <div class="nav-item" onclick="showProfile()">
                <div class="nav-icon icon-profile"><i class="fas fa-user"></i></div>
                <h3>Профиль</h3>
                <p>${username || 'Ваш профиль'}</p>
            </div>
        </div>

        <!-- Popular -->
        <div class="products-section fade-in" style="animation-delay:0.3s">
            <h2 class="section-title"><i class="fas fa-fire"></i> Популярное</h2>
            <div class="products-grid" id="popular-products"></div>
        </div>

        <!-- Cart Footer -->
        <div class="cart-footer fade-in" style="animation-delay:0.4s">
            <div class="cart-content">
                <div class="cart-total" id="cart-total">Корзина пуста</div>
                <button class="checkout-button" id="checkout-btn" onclick="checkout()" disabled>
                    Оформить заказ
                </button>
            </div>
        </div>

        <!-- Модальные окна -->
        <div id="cart-modal" class="modal"></div>
        <div id="product-modal" class="modal"></div>
        <div id="order-modal" class="modal"></div>
        <div id="profile-modal" class="modal"></div>
        <div id="catalog-modal" class="modal"></div>
    `;
    
    loadPopularProducts();
    updateCartUI();
}

// ------------ Популярные товары ------------
function loadPopularProducts() {
    // Определяем популярность
    const counts = {};
    teaCatalog.forEach(t => counts[String(t.id)] = popularity[String(t.id)] || 0);
    
    // Сортируем по популярности
    const sorted = [...teaCatalog].sort((a,b) => {
        const pa = counts[String(a.id)] || 0;
        const pb = counts[String(b.id)] || 0;
        if (pa !== pb) return pb - pa;
        return a.id - b.id;
    });
    
    // Берем 4 самых популярных
    const popular = sorted.slice(0,4);
    const container = document.getElementById('popular-products');
    if (!container) return;
    
    container.innerHTML = popular.map(t => `
        <div class="product-card" onclick="showProduct(${t.id})">
            <div class="product-image ${getTeaTypeClass(t.type)}">
                ${t.tag ? `<div class="product-tag">${t.tag}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${t.name}</h3>
                <div class="product-subtitle">${t.subtitle}</div>
                <div class="product-price">${formatPrice(t.price)}</div>
                <button class="product-button" onclick="event.stopPropagation(); addToCart(${t.id});">+ В корзину</button>
            </div>
        </div>
    `).join('');
}

// ------------ Каталог ------------
function showCatalog() {
    const modal = document.getElementById('catalog-modal');
    if (!modal) return;
    
    let html = `
        <div class="modal-content" style="max-height:85vh; overflow:auto;">
            <div class="modal-header">
                <h3><i class="fas fa-list"></i> Каталог</h3>
                <button class="modal-close" onclick="closeModalById('catalog-modal')">×</button>
            </div>
            <div class="modal-body" style="padding:10px;">
    `;
    
    teaCatalog.forEach(t => {
        html += `
            <div class="catalog-item" onclick="showProduct(${t.id})" 
                 style="padding:12px;border-radius:10px;display:flex;gap:12px;align-items:center;margin-bottom:10px;background:#fff;cursor:pointer;">
                <div style="width:64px;height:64px;border-radius:10px;display:flex;align-items:center;justify-content:center;" 
                     class="tea-icon ${getTeaTypeClass(t.type)}"><i class="fas fa-leaf"></i></div>
                <div style="flex:1;">
                    <div style="font-weight:700;">${t.name}</div>
                    <div style="color:#666;font-size:14px;">${t.subtitle}</div>
                </div>
                <div style="text-align:right;">
                    <div style="color:#4CAF50;font-weight:700;margin-bottom:8px;">${formatPrice(t.price)}</div>
                    <button onclick="event.stopPropagation(); addToCart(${t.id});" 
                            style="padding:6px 10px;border-radius:10px;background:#4CAF50;color:white;border:none;cursor:pointer;">
                        + Добавить
                    </button>
                </div>
            </div>
        `;
    });
    
    html += `</div></div>`;
    modal.innerHTML = html;
    showModal('catalog-modal', true);
}

// ------------ Детали товара ------------
function showProduct(productId) {
    const product = teaCatalog.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    const html = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-leaf"></i> ${product.name}</h3>
                <button class="modal-close" onclick="closeModalById('product-modal')">×</button>
            </div>
            <div class="modal-body">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <div style="font-weight:700;">${product.subtitle}</div>
                    <div style="background:#4CAF50;color:#fff;padding:6px 10px;border-radius:12px;font-weight:700;">
                        ${product.type}
                    </div>
                </div>
                ${product.tag ? `<div style="background:#FF9800;color:white;padding:6px 8px;border-radius:8px;display:inline-block;margin-bottom:12px;">${product.tag}</div>` : ''}
                
                <div style="background:#f8f9fa;padding:12px;border-radius:8px;margin-bottom:12px;">
                    <h4 style="margin:0 0 8px 0;color:#333;">Описание:</h4>
                    <p style="margin:0;color:#666;line-height:1.5;">${product.description}</p>
                </div>
                
                <div style="margin-bottom:12px;">
                    <h4 style="margin:0 0 8px 0;color:#333;">🍶 Способ заваривания:</h4>
                    <ul style="margin:0;color:#666;padding-left:20px;line-height:1.6;">
                        ${product.brewing.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="margin-bottom:12px;">
                    <h4 style="margin:0 0 8px 0;color:#333;">🌿 Полезные свойства:</h4>
                    <ul style="margin:0;color:#666;padding-left:20px;line-height:1.6;">
                        ${product.benefits.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid #eee;">
                    <div style="font-size:20px;font-weight:700;color:#4CAF50;">
                        ${formatPrice(product.price)}
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button onclick="addToCart(${product.id})" 
                                style="padding:10px 14px;border-radius:10px;background:linear-gradient(135deg,#4CAF50,#2E7D32);color:white;border:none;cursor:pointer;">
                            Добавить в корзину
                        </button>
                        <button onclick="showCatalog()" 
                                style="padding:10px 14px;border-radius:10px;background:#eee;border:none;cursor:pointer;">
                            Каталог
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.innerHTML = html;
    showModal('product-modal', true);
}

// ------------ Корзина ------------
function showCartModal() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    
    const total = cart.reduce((s,i) => s + (i.price * i.quantity), 0);
    
    let html = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-shopping-cart"></i> Корзина</h3>
                <button class="modal-close" onclick="closeModalById('cart-modal')">×</button>
            </div>
            <div class="modal-body">
    `;
    
    if (cart.length === 0) {
        html += `
            <div style="text-align:center;padding:40px 10px;color:#888;">
                <i class="fas fa-box-open" style="font-size:42px;color:#ddd;"></i>
                <div style="margin-top:12px;">Корзина пуста</div>
            </div>
        `;
    } else {
        html += `
            <div style="max-height:40vh;overflow:auto;margin-bottom:12px;">
        `;
        
        cart.forEach(item => {
            html += `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:10px;background:#f8f9fa;margin-bottom:10px;">
                    <div style="flex:1;">
                        <div style="font-weight:700;">${item.name}</div>
                        <div style="color:#666;font-size:13px;">${item.type} • ${formatPrice(item.price)}/шт</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <button onclick="updateQuantity(${item.id}, -1)" 
                                style="width:32px;height:32px;border-radius:50%;border:none;background:#eee;cursor:pointer;">-</button>
                        <div style="min-width:28px;text-align:center;font-weight:700;">${item.quantity}</div>
                        <button onclick="updateQuantity(${item.id}, 1)" 
                                style="width:32px;height:32px;border-radius:50%;border:none;background:#4CAF50;color:white;cursor:pointer;">+</button>
                        <div style="min-width:70px;text-align:right;font-weight:700;color:#4CAF50;margin-left:8px;">
                            ${formatPrice(item.price * item.quantity)}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    html += `
                <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:2px solid #e9f5ee;">
                    <div style="font-weight:700;font-size:18px;">
                        Итого: <span style="color:#4CAF50;">${formatPrice(total)}</span>
                    </div>
                    <div style="display:flex;gap:10px;">
                        ${cart.length > 0 ? `
                            <button onclick="clearCart()" 
                                    style="padding:10px 12px;border-radius:10px;background:#f44336;color:white;border:none;cursor:pointer;">
                                Очистить
                            </button>
                        ` : ''}
                        <button onclick="checkout()" 
                                style="padding:10px 14px;border-radius:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;cursor:pointer;"
                                ${cart.length===0 ? 'disabled' : ''}>
                            ${cart.length===0 ? 'Добавьте товары' : 'Оформить'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.innerHTML = html;
    showModal('cart-modal', true);
}

// ------------ Работа с корзиной ------------
async function addToCart(productId) {
    const p = teaCatalog.find(t => t.id === productId);
    if (!p) return;
    
    const ex = cart.find(i => i.id === productId);
    if (ex) {
        ex.quantity += 1;
    } else {
        cart.push({ 
            id: p.id, 
            name: p.name, 
            price: p.price, 
            type: p.type, 
            quantity: 1 
        });
    }
    
    await saveCart();
    showToast(`✅ ${p.name} добавлен в корзину`);
}

async function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    const newQty = item.quantity + delta;
    
    if (newQty <= 0) {
        const ok = await showConfirm(`Удалить "${item.name}" из корзины?`);
        if (!ok) return;
        
        cart = cart.filter(i => i.id !== productId);
    } else {
        item.quantity = newQty;
    }
    
    await saveCart();
    showToast('Корзина обновлена');
    showCartModal();
}

async function clearCart() {
    if (cart.length === 0) {
        showToast('Корзина уже пуста');
        return;
    }
    
    const ok = await showConfirm('Очистить всю корзину? Это действие необратимо.');
    if (!ok) return;
    
    cart = [];
    await saveCart();
    showToast('Корзина очищена');
}

function updateCartUI() {
    const totalItems = cart.reduce((s,i) => s + (i.quantity || 0), 0);
    const totalPrice = cart.reduce((s,i) => s + ((i.price || 0) * (i.quantity || 0)), 0);
    
    // Обновляем бейдж
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Обновляем счетчик в навигации
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    // Обновляем футер
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (cartTotal && checkoutBtn) {
        if (totalItems > 0) {
            cartTotal.innerHTML = `Итого: <span>${formatPrice(totalPrice)}</span>`;
            checkoutBtn.textContent = `Оформить (${totalItems})`;
            checkoutBtn.disabled = false;
        } else {
            cartTotal.innerHTML = `Корзина пуста`;
            checkoutBtn.textContent = `Добавьте товары`;
            checkoutBtn.disabled = true;
        }
    }
}

// ------------ Заказы ------------
function showOrders() {
    const orders = loadOrders();
    const modal = document.getElementById('order-modal');
    if (!modal) return;
    
    let html = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-box"></i> История заказов</h3>
                <button class="modal-close" onclick="closeModalById('order-modal')">×</button>
            </div>
            <div class="modal-body">
    `;
    
    if (orders.length === 0) {
        html += `
            <div style="text-align:center;padding:40px;color:#888;">
                <i class="fas fa-box-open" style="font-size:42px;color:#ddd;"></i>
                <div style="margin-top:12px;">Заказов пока нет</div>
            </div>
        `;
    } else {
        html += `<div style="max-height:60vh;overflow:auto;">`;
        
        orders.slice().reverse().forEach(order => {
            const itemCount = order.cart.reduce((sum, item) => sum + item.quantity, 0);
            
            html += `
                <div style="background:#f8f9fa;padding:12px;border-radius:10px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <div style="font-weight:700;">Заказ #${order.id}</div>
                        <div style="color:#666;font-size:13px;">${formatDate(order.timestamp)}</div>
                        <div style="color:#888;font-size:13px;margin-top:4px;">Товаров: ${itemCount}</div>
                    </div>
                    <div style="text-align:right;display:flex;flex-direction:column;gap:8px;">
                        <div style="font-weight:700;color:#4CAF50;">${formatPrice(order.total)}</div>
                        <div style="display:flex;gap:8px;">
                            <button onclick="showOrderDetails(${order.id})" 
                                    style="padding:6px 8px;border-radius:8px;border:none;background:#fff;cursor:pointer;font-size:12px;">
                                Открыть
                            </button>
                            <button onclick="reorder(${order.id})" 
                                    style="padding:6px 8px;border-radius:8px;border:none;background:#4CAF50;color:white;cursor:pointer;font-size:12px;">
                                Повторить
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    html += `</div></div>`;
    modal.innerHTML = html;
    showModal('order-modal', true);
}

function showOrderDetails(orderId) {
    const orders = loadOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showToast('Заказ не найден', { type: 'error' });
        return;
    }
    
    const modal = document.getElementById('order-modal');
    if (!modal) return;
    
    const itemCount = order.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let html = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-receipt"></i> Заказ #${order.id}</h3>
                <button class="modal-close" onclick="showOrders()">← Назад</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom:12px;">
                    <strong>Покупатель:</strong> ${order.user_name}
                </div>
                <div style="margin-bottom:12px;">
                    <strong>Дата заказа:</strong> ${formatDate(order.timestamp)}
                </div>
                <div style="margin-bottom:12px;">
                    <strong>Сумма:</strong> ${formatPrice(order.total)}
                </div>
                <div style="margin-bottom:12px;">
                    <strong>Товары (${itemCount}):</strong>
                    <div style="margin-top:8px;">
    `;
    
    order.cart.forEach(item => {
        html += `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:#f8f9fa;border-radius:8px;margin-bottom:6px;">
                <div>
                    <div style="font-weight:500;">${item.name}</div>
                    <div style="color:#666;font-size:12px;">${item.type}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-weight:700;">${item.quantity} × ${formatPrice(item.price)}</div>
                    <div style="color:#4CAF50;font-size:12px;">${formatPrice(item.price * item.quantity)}</div>
                </div>
            </div>
        `;
    });
    
    html += `
                    </div>
                </div>
                
                <div style="display:flex;gap:8px;margin-top:16px;">
                    <button onclick="copyOrderToChat(${order.id})" 
                            style="flex:1;padding:10px;border-radius:8px;background:#4CAF50;color:white;border:none;cursor:pointer;">
                        Открыть в чате
                    </button>
                    <button onclick="reorder(${order.id})" 
                            style="flex:1;padding:10px;border-radius:8px;background:#2196F3;color:white;border:none;cursor:pointer;">
                        Повторить заказ
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.innerHTML = html;
    showModal('order-modal');
}

async function reorder(orderId) {
    const orders = loadOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showToast('Заказ не найден', { type: 'error' });
        return;
    }
    
    const confirmed = await showConfirm('Добавить все товары из этого заказа в корзину?', 'Повторить заказ');
    if (!confirmed) return;
    
    // Очищаем корзину
    cart = [];
    
    // Добавляем товары из заказа
    for (const item of order.cart) {
        for (let i = 0; i < item.quantity; i++) {
            const ex = cart.find(c => c.id === item.id);
            if (ex) {
                ex.quantity += 1;
            } else {
                cart.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    type: item.type,
                    quantity: 1
                });
            }
        }
    }
    
    await saveCart();
    showToast('Товары из заказа добавлены в корзину');
    showCartModal();
}

async function copyOrderToChat(orderId) {
    const orders = loadOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showToast('Заказ не найден', { type: 'error' });
        return;
    }
    
    // Формируем текст заказа
    const lines = [];
    lines.push(`Новый заказ #${order.id}`);
    lines.push(`Покупатель: ${order.user_name}`);
    lines.push(`Сумма: ${order.total}₽`);
    lines.push(`Товары:`);
    order.cart.forEach(it => lines.push(` - ${it.name} × ${it.quantity} (${it.price}₽)`));
    lines.push('');
    lines.push('Пожалуйста, укажите адрес и контакты для доставки и отправьте сообщение.');
    lines.push('Адрес: ');
    
    const orderText = lines.join('\n');
    
    // Копируем в буфер
    try {
        await navigator.clipboard.writeText(orderText);
        showToast('Текст заказа скопирован в буфер');
    } catch(e) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = orderText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Текст заказа скопирован');
    }
    
    // Открываем чат менеджера
    const managerUrl = 'https://t.me/ivan_likhov';
    try {
        if (tg && tg.openLink) {
            tg.openLink(managerUrl);
        } else {
            window.open(managerUrl, '_blank');
        }
        
        showToast('Перейдите в чат @ivan_likhov и вставьте текст заказа');
    } catch(e) {
        window.open(managerUrl, '_blank');
    }
}

// ------------ Профиль ------------
function showProfile() {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;
    
    const firstName = userData.first_name || 'Гость';
    const lastName = userData.last_name || '';
    const username = userData.username ? `@${userData.username}` : '';
    const fullName = `${firstName} ${lastName}`.trim();
    const hasPhoto = userData.photo_url && userData.photo_url.trim() !== '';
    
    const html = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-user"></i> Мой профиль</h3>
                <button class="modal-close" onclick="closeModalById('profile-modal')">×</button>
            </div>
            <div class="modal-body">
                <div style="text-align:center;margin-bottom:20px;">
                    <div style="width:100px;height:100px;margin:0 auto 12px;border-radius:50%;overflow:hidden;border:3px solid #4CAF50;display:flex;align-items:center;justify-content:center;background:${hasPhoto ? 'transparent' : 'linear-gradient(135deg,#667eea,#764ba2)'};">
                        ${hasPhoto ? 
                            `<img src="${escapeHtml(userData.photo_url)}" alt="${escapeHtml(fullName)}" 
                                  style="width:100%;height:100%;object-fit:cover;"
                                  onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<div style=\\'font-size:36px;color:white;\\'>${escapeHtml(firstName.charAt(0))}</div>'">` 
                            : 
                            `<div style="font-size:36px;color:white;">${escapeHtml(firstName.charAt(0) || 'G')}</div>`
                        }
                    </div>
                    <h3 style="margin:0 0 6px 0;">${escapeHtml(fullName)}</h3>
                    ${username ? `<p style="color:#666;margin:6px 0;">${escapeHtml(username)}</p>` : ''}
                    ${isTelegramUser ? 
                        `<span style="background:#0088cc;color:white;padding:4px 8px;border-radius:12px;font-size:12px;margin-top:4px;">
                            Telegram пользователь
                        </span>` 
                        : ''
                    }
                </div>

                <div style="background:#f8f9fa;padding:14px;border-radius:12px;margin-bottom:12px;">
                    <h4 style="margin:0 0 8px 0;color:#333;">
                        <i class="fas fa-headset"></i> Контакты поддержки
                    </h4>
                    <div style="margin-top:6px;">
                        <div style="background:white;padding:10px;border-radius:8px;margin-bottom:8px;">
                            <div style="font-weight:700;margin-bottom:4px;">Telegram менеджер:</div>
                            <a href="https://t.me/ivan_likhov" target="_blank" 
                               style="color:#4CAF50;text-decoration:none;display:block;">
                                @ivan_likhov
                            </a>
                        </div>
                        <div style="background:white;padding:10px;border-radius:8px;">
                            <div style="font-weight:700;margin-bottom:4px;">Телефон:</div>
                            <a href="tel:+79038394670" 
                               style="color:#4CAF50;text-decoration:none;display:block;">
                                +7 (903) 839-46-70
                            </a>
                        </div>
                    </div>
                </div>

                <div style="background:#f8f9fa;padding:14px;border-radius:12px;margin-bottom:12px;">
                    <h4 style="margin:0 0 8px 0;color:#333;">
                        <i class="fas fa-clock"></i> Часы работы
                    </h4>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <div style="font-weight:700;">Пн–Вс:</div>
                            <div style="color:#666;font-size:13px;">09:00 - 21:00</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="color:#4CAF50;font-weight:700;">Принимаем заказы 24/7</div>
                        </div>
                    </div>
                </div>

                <div style="display:flex;gap:10px;margin-top:16px;">
                    <button onclick="openChannel()" 
                            style="flex:1;padding:12px;border-radius:10px;background:linear-gradient(135deg,#4CAF50,#2E7D32);color:white;border:none;cursor:pointer;">
                        <i class="fab fa-telegram"></i> Наш канал
                    </button>
                    <button onclick="clearUserData()" 
                            style="flex:1;padding:12px;border-radius:10px;background:#f8f9fa;color:#666;border:1px solid #ddd;cursor:pointer;">
                        <i class="fas fa-trash"></i> Очистить данные
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.innerHTML = html;
    showModal('profile-modal');
}

function openChannel() {
    const url = 'https://t.me/teatea_bar';
    try {
        if (tg && tg.openLink) {
            tg.openLink(url);
        } else {
            window.open(url, '_blank');
        }
    } catch(e) {
        window.open(url, '_blank');
    }
}

async function clearUserData() {
    const confirmed = await showConfirm(
        'Очистить все данные (корзину, заказы, историю)? Это действие нельзя отменить.',
        'Очистка данных'
    );
    
    if (!confirmed) return;
    
    try {
        localStorage.removeItem('tutu_cart');
        localStorage.removeItem('tutu_orders');
        localStorage.removeItem('tutu_popularity');
        
        cart = [];
        updateCartUI();
        
        showToast('Данные очищены');
        closeModalById('profile-modal');
        
    } catch(e) {
        showToast('Ошибка при очистке данных', { type: 'error' });
    }
}

// ------------ Оформление заказа ------------
async function checkout() {
    if (cart.length === 0) {
        showToast('Добавьте товары в корзину', { type: 'error' });
        return;
    }
    
    const confirmed = await showConfirm('Подтвердить оформление заказа?', 'Оформление заказа');
    if (!confirmed) return;
    
    const total = cart.reduce((s,i) => s + i.price * i.quantity, 0);
    const order = {
        id: Date.now(),
        user_id: userId,
        user_name: userData.first_name || 'Гость',
        user_username: userData.username || '',
        cart: [...cart],
        total: total,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    // Сохраняем заказ
    if (saveOrder(order)) {
        // Формируем текст заказа для копирования
        const lines = [];
        lines.push(`Новый заказ #${order.id}`);
        lines.push(`Покупатель: ${order.user_name} ${order.user_username ? `(${order.user_username})` : ''}`);
        lines.push(`ID пользователя: ${userId}`);
        lines.push(`Сумма: ${total}₽`);
        lines.push(`Товары:`);
        order.cart.forEach(it => lines.push(` - ${it.name} × ${it.quantity} (${it.price}₽)`));
        lines.push('');
        lines.push('Пожалуйста, укажите адрес и контакты для доставки и отправьте сообщение.');
        lines.push('Адрес: ');
        
        const orderText = lines.join('\n');
        
        // Копируем в буфер
        try {
            await navigator.clipboard.writeText(orderText);
        } catch(e) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = orderText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        
        // Открываем чат менеджера
        const managerUrl = 'https://t.me/ivan_likhov';
        try {
            if (tg && tg.openLink) {
                tg.openLink(managerUrl);
            } else {
                window.open(managerUrl, '_blank');
            }
            
            showToast('Текст заказа скопирован. Перейдите в чат @ivan_likhov и вставьте его.');
        } catch(e) {
            window.open(managerUrl, '_blank');
        }
        
        // Очищаем корзину
        cart = [];
        await saveCart();
        closeAllModals();
        
    } else {
        showToast('Ошибка сохранения заказа', { type: 'error' });
    }
}

// ------------ Инициализация приложения ------------
async function initApp() {
    try {
        console.log('[App] Инициализация приложения...');
        
        // Настройка Telegram WebApp
        if (tg) {
            try {
                if (tg.ready) tg.ready();
                if (tg.expand) tg.expand();
                if (tg.setHeaderColor) tg.setHeaderColor('#4CAF50');
                if (tg.setBackgroundColor) tg.setBackgroundColor('#f5f7fa');
                if (tg.enableClosingConfirmation) tg.enableClosingConfirmation();
                console.log('[App] Telegram WebApp настроен');
            } catch (e) {
                console.warn('[App] Ошибка настройки Telegram:', e);
            }
        }
        
        // Загрузка данных пользователя
        userData = await getUserData();
        userId = generateUserId();
        
        // Загрузка данных
        loadPopularity();
        loadCart();
        
        // Показ интерфейса
        showMainInterface();
        
        // Скрываем загрузчик
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }
            
            // Показываем приложение
            const app = document.getElementById('app');
            if (app) {
                app.style.display = 'block';
            }
            
            // Приветствие
            showToast(`Добро пожаловать, ${userData.first_name}!`);
            
        }, 500);
        
    } catch (error) {
        console.error('[App] Критическая ошибка инициализации:', error);
        
        // Показываем сообщение об ошибке
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div style="padding: 40px 20px; text-align: center;">
                    <h2 style="color: #f44336;">Ошибка загрузки</h2>
                    <p style="color: #666; margin: 16px 0;">${error.message}</p>
                    <button onclick="window.location.reload()" 
                            style="padding: 10px 20px; background: #4CAF50; color: white; 
                                   border: none; border-radius: 8px; cursor: pointer;">
                        Обновить страницу
                    </button>
                </div>
            `;
            app.style.display = 'block';
        }
        
        // Скрываем загрузчик
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
}

// ------------ Экспорт функций в window ------------
window.showCatalog = showCatalog;
window.showProduct = showProduct;
window.showOrders = showOrders;
window.showOrderDetails = showOrderDetails;
window.showProfile = showProfile;
window.showCartModal = showCartModal;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.reorder = reorder;
window.copyOrderToChat = copyOrderToChat;
window.openChannel = openChannel;
window.clearUserData = clearUserData;
window.checkout = checkout;
window.closeModalById = closeModalById;

// ------------ Запуск приложения ------------
document.addEventListener('DOMContentLoaded', () => {
    // Запускаем приложение с небольшой задержкой
    setTimeout(initApp, 100);
});

// Сохранение данных при закрытии
window.addEventListener('beforeunload', () => {
    try {
        saveCart();
    } catch (e) {
        console.warn('Ошибка сохранения при закрытии:', e);
    }
});

// Аварийное восстановление
setTimeout(() => {
    const app = document.getElementById('app');
    const loader = document.getElementById('loader');
    
    if (app && app.style.display === 'none') {
        console.warn('[App] Аварийное восстановление: показываем приложение');
        app.style.display = 'block';
    }
    
    if (loader && loader.style.display !== 'none') {
        console.warn('[App] Аварийное восстановление: скрываем загрузчик');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
}, 5000);
