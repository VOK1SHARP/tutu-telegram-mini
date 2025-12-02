/* ===========================
   ГЛАВНЫЙ ФАЙЛ ПРИЛОЖЕНИЯ
   =========================== */

// Инициализация приложения
async function initApp() {
    try {
        console.log('[App] Инициализация приложения...');
        
        // Показываем загрузчик
        if (window.UI && window.UI.Loader) {
            window.UI.Loader.show('Загрузка приложения...');
        }
        
        // Инициализация Telegram
        if (window.Utils) {
            window.Utils.initTelegram();
        }
        
        // Загрузка данных пользователя
        let userData = { first_name: 'Гость', last_name: '', username: '' };
        if (window.Utils) {
            userData = await window.Utils.getUserData();
            window.Utils.setUserData(userData);
            window.Utils.setIsTelegramUser(!!userData.id);
            
            // Генерация/получение ID пользователя
            const userId = window.Utils.generateUserId();
            window.Utils.setUserId(userId);
            
            console.log('[App] Пользователь:', {
                name: userData.first_name,
                id: userId,
                isTelegram: window.Utils.getIsTelegramUser()
            });
        }
        
        // Инициализация модулей
        if (window.Catalog) {
            window.Catalog.init();
        }
        
        // Загрузка корзины
        if (window.Cart) {
            await window.Cart.load();
        }
        
        // Показ основного интерфейса
        showMainInterface();
        
        // Анимация загрузки
        setTimeout(() => {
            if (window.UI && window.UI.Loader) {
                window.UI.Loader.hide();
            }
            
            // Приветственное сообщение
            const cart = window.Cart ? window.Cart.get() : [];
            if (cart.length > 0) {
                showToast(`Добро пожаловать! В корзине ${cart.length} товаров`);
            } else {
                showToast(`Добро пожаловать, ${userData.first_name}!`);
            }
            
            if (window.Utils) {
                window.Utils.hapticFeedback('light');
            }
        }, 800);
        
    } catch (error) {
        console.error('[App] Критическая ошибка инициализации:', error);
        
        // Показ сообщения об ошибке
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div style="padding: 40px 20px; text-align: center;">
                    <h2 style="color: #f44336;">Ошибка загрузки</h2>
                    <p style="color: #666; margin: 16px 0;">
                        Не удалось загрузить приложение. Пожалуйста, обновите страницу.
                    </p>
                    <button onclick="window.location.reload()" 
                            style="padding: 10px 20px; background: #4CAF50; color: white; 
                                   border: none; border-radius: 8px; cursor: pointer;">
                        Обновить страницу
                    </button>
                </div>
            `;
        }
        
        if (window.UI && window.UI.Loader) {
            window.UI.Loader.hide();
        }
        
        showToast('Ошибка загрузки приложения', 'error');
    }
}

// Показ основного интерфейса
function showMainInterface() {
    const app = document.getElementById('app');
    if (!app) return;
    
    const userData = window.Utils ? window.Utils.getUserData() : { first_name: 'Гость' };
    const isTelegramUser = window.Utils ? window.Utils.getIsTelegramUser() : false;
    const firstName = userData.first_name || 'Гость';
    const lastName = userData.last_name || '';
    const username = userData.username ? `@${userData.username}` : '';
    const fullName = `${firstName} ${lastName}`.trim();
    const hasPhoto = userData.photo_url && userData.photo_url.trim() !== '';
    const escapeHtml = window.Utils ? window.Utils.escapeHtml : (text) => text || '';
    
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
                <div class="user-avatar" onclick="showProfile()" 
                     title="${escapeHtml(fullName)}${username ? ` (${escapeHtml(username)})` : ''}">
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
                <p>${window.Catalog ? window.Catalog.getAllProducts().length : 8}+ сортов чая</p>
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
                <button class="checkout-button" id="checkout-btn" onclick="window.checkout()" disabled>
                    Оформить заказ
                </button>
            </div>
        </div>
    `;
    
    // Загрузка популярных товаров
    loadPopularProducts();
    
    // Обновление UI корзины
    if (window.Cart) {
        window.Cart.updateUI();
    }
}

// Загрузка популярных товаров
async function loadPopularProducts() {
    try {
        let popularity = {};
        if (window.Storage) {
            popularity = await window.Storage.loadPopularity();
        }
        
        const popularProducts = window.Catalog ? 
            window.Catalog.getPopularProducts(popularity, 4) : 
            (window.Catalog ? window.Catalog.teaCatalog || [] : []).slice(0, 4);
        
        const container = document.getElementById('popular-products');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        popularProducts.forEach(product => {
            const productCard = window.UI ? 
                window.UI.createProductCard(product, (productId) => {
                    showProductDetail(productId);
                }) : 
                createSimpleProductCard(product);
            
            container.appendChild(productCard);
        });
        
        // Делегирование событий для кнопок "В корзину"
        container.addEventListener('click', (e) => {
            const button = e.target.closest('.product-button');
            if (button) {
                const productId = parseInt(button.dataset.id);
                if (productId && window.Cart) {
                    window.Cart.addToCart(productId);
                }
            }
        });
        
    } catch (error) {
        console.error('[App] Ошибка загрузки популярных товаров:', error);
    }
}

// Создание простой карточки товара (fallback)
function createSimpleProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <div class="product-image ${window.Utils ? window.Utils.getTeaTypeClass(product.type) : ''}">
            ${product.tag ? `<div class="product-tag">${product.tag}</div>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-subtitle">${product.subtitle}</div>
            <div class="product-price">${product.price}₽</div>
            <button class="product-button" data-id="${product.id}">+ В корзину</button>
        </div>
    `;
    
    div.addEventListener('click', () => {
        showProductDetail(product.id);
    });
    
    return div;
}

// Функции-заглушки для модальных окон
function showToast(message, type = 'info') {
    if (window.UI && window.UI.Toast) {
        window.UI.Toast.show(message, { type: type === 'error' ? 'error' : 'info' });
    } else {
        console.log('Toast:', message);
    }
}

function showCatalog() {
    console.log('showCatalog called');
    if (window.Catalog) {
        window.Catalog.showCatalog();
    }
}

function showProductDetail(productId) {
    console.log('showProductDetail called for:', productId);
    if (window.Catalog) {
        window.Catalog.showProductDetail(productId);
    }
}

function showOrders() {
    console.log('showOrders called');
    if (window.Orders) {
        window.Orders.showOrdersHistory();
    }
}

function showProfile() {
    console.log('showProfile called');
    if (window.Profile) {
        window.Profile.showProfile();
    }
}

function showCartModal() {
    console.log('showCartModal called');
    if (window.Cart) {
        window.Cart.showCartModal();
    }
}

// Оформление заказа
async function checkout() {
    try {
        const cart = window.Cart ? window.Cart.get() : [];
        if (!cart || cart.length === 0) {
            showToast('Добавьте товары в корзину', 'error');
            return;
        }
        
        if (window.UI && window.UI.Confirm) {
            const confirmed = await window.UI.Confirm.show(
                'Подтвердить оформление заказа?',
                'Оформление заказа'
            );
            
            if (!confirmed) return;
        }
        
        if (window.UI && window.UI.Loader) {
            window.UI.Loader.show('Создаем заказ...');
        }
        
        // Логика создания заказа
        const userData = window.Utils ? window.Utils.getUserData() : { first_name: 'Гость' };
        const userId = window.Utils ? window.Utils.getUserId() : 'guest';
        const totalPrice = window.Cart ? window.Cart.getTotalPrice() : 0;
        
        const order = {
            id: Date.now(),
            user_id: userId,
            user_name: userData.first_name || 'Гость',
            user_username: userData.username || '',
            cart: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                type: item.type,
                quantity: item.quantity
            })),
            total: totalPrice,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        // Сохраняем заказ
        if (window.Storage) {
            await window.Storage.saveOrder(order);
        }
        
        // Формируем текст заказа
        const lines = [];
        lines.push(`Новый заказ #${order.id}`);
        lines.push(`Покупатель: ${order.user_name} ${order.user_username ? `(${order.user_username})` : ''}`);
        lines.push(`ID пользователя: ${userId}`);
        lines.push(`Сумма: ${totalPrice}₽`);
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
            console.error('Clipboard error:', e);
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
        const tg = window.Utils ? window.Utils.getTg() : null;
        
        try {
            if (tg && tg.openLink) {
                tg.openLink(managerUrl);
            } else {
                window.open(managerUrl, '_blank');
            }
            
            showToast('Перейдите в чат @ivan_likhov и вставьте текст заказа');
        } catch (e) {
            console.error('Failed to open chat:', e);
            window.open(managerUrl, '_blank');
        }
        
        // Очищаем корзину
        if (window.Cart) {
            window.Cart.clear();
            await window.Cart.save();
        }
        
        // Закрытие модальных окон
        if (window.UI) {
            window.UI.closeAllModals();
        }
        
        if (window.Utils) {
            window.Utils.hapticFeedback('success');
        }
        
    } catch (error) {
        console.error('[App] Ошибка оформления заказа:', error);
        showToast('Ошибка оформления заказа', 'error');
    } finally {
        if (window.UI && window.UI.Loader) {
            window.UI.Loader.hide();
        }
    }
}

// Экспорт функций в глобальную область видимости
window.showCatalog = showCatalog;
window.showProductDetail = showProductDetail;
window.showOrders = showOrders;
window.showProfile = showProfile;
window.showCartModal = showCartModal;
window.checkout = checkout;

// Инициализация приложения при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Скрываем стандартный загрузчик
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }, 500);
    }
    
    // Запуск приложения с задержкой
    setTimeout(initApp, 300);
});

// Сохранение корзины при закрытии страницы
window.addEventListener('beforeunload', () => {
    try {
        if (window.Cart) {
            window.Cart.save();
        }
    } catch (error) {
        console.warn('[App] Ошибка сохранения при закрытии:', error);
    }
});
// Вспомогательные функции для модальных окон
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function showModal(modalId, bottomSheet = false) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    if (window.UI) {
        window.UI.closeAllModals();
    }
    
    modal.style.display = 'flex';
    if (bottomSheet) {
        modal.classList.add('bottom-sheet');
    } else {
        modal.classList.remove('bottom-sheet');
    }
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal(modalId);
        }
    };
}

// Переопределяем функции модулей
window.addEventListener('load', function() {
    // Переопределяем функции Catalog
    if (window.Catalog) {
        window.Catalog.showCatalog = function() {
            showCatalogModal();
        };
        
        window.Catalog.showProductDetail = function(productId) {
            showProductModal(productId);
        };
    }
    
    // Переопределяем функции Cart
    if (window.Cart) {
        window.Cart.showCartModal = function() {
            showCartModal();
        };
        
        window.Cart.clearAll = async function() {
            return await clearCart();
        };
    }
});

// Реализация модального окна каталога
function showCatalogModal() {
    const modal = document.getElementById('catalog-modal');
    if (!modal) return;
    
    const products = window.Catalog ? window.Catalog.getAllProducts() : [];
    
    let html = `
        <div class="modal-content" style="max-height:85vh; overflow:auto;">
            <div class="modal-header">
                <h3><i class="fas fa-list"></i> Каталог</h3>
                <button class="modal-close" onclick="closeModal('catalog-modal')">×</button>
            </div>
            <div class="modal-body" style="padding:10px;">
    `;
    
    products.forEach(product => {
        const teaClass = window.Utils ? window.Utils.getTeaTypeClass(product.type) : '';
        html += `
            <div class="catalog-item" onclick="showProductModal(${product.id})" 
                 style="padding:12px;border-radius:10px;display:flex;gap:12px;align-items:center;margin-bottom:10px;background:#fff;cursor:pointer;">
                <div style="width:64px;height:64px;border-radius:10px;display:flex;align-items:center;justify-content:center;" 
                     class="tea-icon ${teaClass}"><i class="fas fa-leaf"></i></div>
                <div style="flex:1;">
                    <div style="font-weight:700;">${product.name}</div>
                    <div style="color:#666;font-size:14px;">${product.subtitle}</div>
                </div>
                <div style="text-align:right;">
                    <div style="color:#4CAF50;font-weight:700;margin-bottom:8px;">${product.price}₽</div>
                    <button onclick="event.stopPropagation(); addToCart(${product.id});" 
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

// Реализация модального окна товара
function showProductModal(productId) {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    const product = window.Catalog ? window.Catalog.getProductById(productId) : null;
    if (!product) return;
    
    const teaClass = window.Utils ? window.Utils.getTeaTypeClass(product.type) : '';
    
    const html = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-leaf"></i> ${product.name}</h3>
                <button class="modal-close" onclick="closeModal('product-modal')">×</button>
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
                        ${product.benefits ? product.benefits.map(b => `<li>${b}</li>`).join('') : ''}
                    </ul>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid #eee;">
                    <div style="font-size:20px;font-weight:700;color:#4CAF50;">
                        ${product.price}₽
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button onclick="addToCart(${product.id})" 
                                style="padding:10px 14px;border-radius:10px;background:linear-gradient(135deg,#4CAF50,#2E7D32);color:white;border:none;cursor:pointer;">
                            Добавить в корзину
                        </button>
                        <button onclick="showCatalogModal()" 
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

// Реализация модального окна корзины
function showCartModal() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    
    const cart = window.Cart ? window.Cart.get() : [];
    const totalPrice = window.Cart ? window.Cart.getTotalPrice() : 0;
    const isCartEmpty = window.Cart ? window.Cart.isEmpty() : true;
    
    let html = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-shopping-cart"></i> Корзина</h3>
                <button class="modal-close" onclick="closeModal('cart-modal')">×</button>
            </div>
            <div class="modal-body">
    `;
    
    if (isCartEmpty) {
        html += `
            <div style="text-align: center; padding: 40px 10px; color: #888;">
                <i class="fas fa-box-open" style="font-size: 42px; color: #ddd;"></i>
                <div style="margin-top: 12px;">Корзина пуста</div>
            </div>
        `;
    } else {
        html += `
            <div style="max-height: 40vh; overflow: auto; margin-bottom: 12px;">
        `;
        
        cart.forEach(item => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; 
                            padding: 12px; border-radius: 10px; background: #f8f9fa; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 700;">${item.name}</div>
                        <div style="color: #666; font-size: 13px;">
                            ${item.type} • ${item.price}₽/шт
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button onclick="updateCartQuantity(${item.id}, -1)" 
                                style="width: 32px; height: 32px; border-radius: 50%; border: none; 
                                       background: #eee; cursor: pointer;">-</button>
                        <div style="min-width: 28px; text-align: center; font-weight: 700;">
                            ${item.quantity}
                        </div>
                        <button onclick="updateCartQuantity(${item.id}, 1)" 
                                style="width: 32px; height: 32px; border-radius: 50%; border: none; 
                                       background: #4CAF50; color: white; cursor: pointer;">+</button>
                        <div style="min-width: 70px; text-align: right; font-weight: 700; 
                                    color: #4CAF50; margin-left: 8px;">
                            ${item.price * item.quantity}₽
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    html += `
                <div style="display: flex; justify-content: space-between; align-items: center; 
                            padding-top: 12px; border-top: 2px solid #e9f5ee;">
                    <div style="font-weight: 700; font-size: 18px;">
                        Итого: <span style="color: #4CAF50;">${totalPrice}₽</span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        ${!isCartEmpty ? `
                            <button onclick="clearCart()" 
                                    style="padding: 10px 12px; border-radius: 10px; 
                                           background: #f44336; color: white; border: none; 
                                           cursor: pointer;">
                                Очистить
                            </button>
                        ` : ''}
                        <button onclick="window.checkout()" 
                                style="padding: 10px 14px; border-radius: 10px; 
                                       background: linear-gradient(135deg, #667eea, #764ba2); 
                                       color: white; border: none; cursor: pointer;"
                                ${isCartEmpty ? 'disabled' : ''}>
                            ${isCartEmpty ? 'Добавьте товары' : 'Оформить'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.innerHTML = html;
    showModal('cart-modal', true);
}

// Вспомогательные функции для корзины
async function addToCart(productId) {
    if (window.Cart) {
        await window.Cart.addToCart(productId);
    }
}

async function updateCartQuantity(productId, delta) {
    if (window.Cart) {
        await window.Cart.updateQuantity(productId, delta);
        showCartModal(); // Переоткрываем модалку
    }
}

async function clearCart() {
    if (window.UI && window.UI.Confirm) {
        const confirmed = await window.UI.Confirm.show(
            'Очистить всю корзину? Это действие необратимо.',
            'Очистка корзины'
        );
        
        if (!confirmed) return;
    }
    
    if (window.Cart) {
        window.Cart.clear();
        await window.Cart.save();
        showToast('Корзина очищена');
        showCartModal();
    }
}
