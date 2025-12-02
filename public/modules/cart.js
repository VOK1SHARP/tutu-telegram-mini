/* ===========================
   КОРЗИНА (упрощенный)
   =========================== */

window.Cart = (function() {
    const Utils = window.Utils;
    
    let cart = [];
    
    // Загрузка корзины
    async function load() {
        try {
            if (window.Storage) {
                cart = await window.Storage.loadCart();
            } else {
                // Fallback
                const userId = Utils.getUserId();
                const key = `tutu_cart_${userId}`;
                const saved = localStorage.getItem(key);
                cart = saved ? JSON.parse(saved) : [];
            }
            updateUI();
            Utils.log('Cart loaded:', cart.length, 'items');
            return cart;
        } catch (e) {
            Utils.error('Failed to load cart:', e);
            cart = [];
            return [];
        }
    }
    
    // Сохранение корзины
    async function save() {
        try {
            if (window.Storage) {
                await window.Storage.saveCart(cart);
            } else {
                // Fallback
                const userId = Utils.getUserId();
                const key = `tutu_cart_${userId}`;
                localStorage.setItem(key, JSON.stringify(cart));
            }
            updateUI();
            return true;
        } catch (e) {
            Utils.error('Failed to save cart:', e);
            return false;
        }
    }
    
    // Получение корзины
    function get() {
        return [...cart];
    }
    
    // Очистка корзины
    function clear() {
        cart = [];
        updateUI();
    }
    
    // Добавление товара в корзину
    async function addToCart(productId) {
        const product = window.Catalog.getProductById(productId);
        if (!product) {
            if (window.UI) window.UI.Toast.show('Товар не найден', { type: 'error' });
            return false;
        }
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const newItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                type: product.type,
                quantity: 1
            };
            
            if (!Utils.validateCartItem(newItem)) {
                if (window.UI) window.UI.Toast.show('Ошибка добавления товара', { type: 'error' });
                return false;
            }
            
            cart.push(newItem);
        }
        
        await save();
        Utils.hapticFeedback('light');
        if (window.UI) window.UI.Toast.show(`✅ ${product.name} добавлен в корзину`);
        return true;
    }
    
    // Обновление количества товара
    async function updateQuantity(productId, delta) {
        const item = cart.find(i => i.id === productId);
        if (!item) return false;
        
        const newQuantity = item.quantity + delta;
        
        if (newQuantity <= 0) {
            // Удаление товара
            if (window.UI) {
                const confirmed = await window.UI.Confirm.show(`Удалить "${item.name}" из корзины?`);
                if (!confirmed) return false;
            }
            
            cart = cart.filter(i => i.id !== productId);
        } else {
            item.quantity = newQuantity;
        }
        
        await save();
        Utils.hapticFeedback('light');
        if (window.UI) window.UI.Toast.show('Корзина обновлена');
        return true;
    }
    
    // Подсчет общего количества товаров
    function getTotalItems() {
        return cart.reduce((total, item) => total + (item.quantity || 0), 0);
    }
    
    // Подсчет общей суммы
    function getTotalPrice() {
        return cart.reduce((total, item) => total + (item.price * (item.quantity || 0)), 0);
    }
    
    // Проверка, пуста ли корзина
    function isEmpty() {
        return cart.length === 0;
    }
    
    // Обновление UI корзины
    function updateUI() {
        const totalItems = getTotalItems();
        const totalPrice = getTotalPrice();
        
        if (window.UI) {
            window.UI.updateCartBadge(totalItems);
            window.UI.updateCartFooter(totalItems, totalPrice);
        }
        
        // Обновляем счетчик вручную, если UI не загружен
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
        
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        if (cartTotal && checkoutBtn) {
            if (totalItems > 0) {
                cartTotal.innerHTML = `Итого: <span>${Utils.formatPrice(totalPrice)}</span>`;
                checkoutBtn.textContent = `Оформить (${totalItems})`;
                checkoutBtn.disabled = false;
            } else {
                cartTotal.innerHTML = `Корзина пуста`;
                checkoutBtn.textContent = `Добавьте товары`;
                checkoutBtn.disabled = true;
            }
        }
    }
    
    // Функция для открытия модального окна корзины
    function showCartModal() {
        console.log('Cart.showCartModal called - override this in app.js');
    }
    
    function closeCartModal() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Функция для очистки всей корзины
    async function clearAll() {
        console.log('Cart.clearAll called - override this in app.js');
        return false;
    }
    
    return {
        load,
        save,
        get,
        clear,
        addToCart,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
        isEmpty,
        updateUI,
        showCartModal,
        closeCartModal,
        clearAll
    };
})();
