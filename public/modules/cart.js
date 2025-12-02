/* ===========================
   КОРЗИНА ПОКУПОК
   =========================== */

const Cart = (function() {
    const { log, error, validateCartItem, hapticFeedback } = Utils;
    const { Toast, Confirm, UI, createModal } = UI;
    const { getProductById } = Catalog;
    
    let cart = [];
    
    // Загрузка корзины
    async function load() {
        try {
            cart = await Storage.loadCart();
            updateUI();
            log('Cart loaded:', cart.length, 'items');
            return cart;
        } catch (e) {
            error('Failed to load cart:', e);
            cart = [];
            return [];
        }
    }
    
    // Сохранение корзины
    async function save() {
        try {
            await Storage.saveCart(cart);
            updateUI();
            return true;
        } catch (e) {
            error('Failed to save cart:', e);
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
        const product = getProductById(productId);
        if (!product) {
            Toast.show('Товар не найден', { type: 'error' });
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
            
            if (!validateCartItem(newItem)) {
                Toast.show('Ошибка добавления товара', { type: 'error' });
                return false;
            }
            
            cart.push(newItem);
        }
        
        await save();
        hapticFeedback('light');
        Toast.show(`✅ ${product.name} добавлен в корзину`);
        return true;
    }
    
    // Обновление количества товара
    async function updateQuantity(productId, delta) {
        const item = cart.find(i => i.id === productId);
        if (!item) return false;
        
        const newQuantity = item.quantity + delta;
        
        if (newQuantity <= 0) {
            // Удаление товара
            const confirmed = await Confirm.show(`Удалить "${item.name}" из корзины?`);
            if (!confirmed) return false;
            
            cart = cart.filter(i => i.id !== productId);
        } else {
            item.quantity = newQuantity;
        }
        
        await save();
        hapticFeedback('light');
        Toast.show('Корзина обновлена');
        return true;
    }
    
    // Удаление товара из корзины
    async function removeItem(productId) {
        const item = cart.find(i => i.id === productId);
        if (!item) return false;
        
        const confirmed = await Confirm.show(`Удалить "${item.name}" из корзины?`);
        if (!confirmed) return false;
        
        cart = cart.filter(i => i.id !== productId);
        await save();
        hapticFeedback('medium');
        Toast.show('Товар удален из корзины');
        return true;
    }
    
    // Очистка всей корзины
    async function clearAll() {
        if (cart.length === 0) {
            Toast.show('Корзина уже пуста');
            return false;
        }
        
        const confirmed = await Confirm.show(
            'Очистить всю корзину? Это действие необратимо.',
            'Очистка корзины'
        );
        
        if (!confirmed) return false;
        
        cart = [];
        await save();
        hapticFeedback('heavy');
        Toast.show('Корзина очищена');
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
        
        UI.updateCartBadge(totalItems);
        UI.updateCartFooter(totalItems, totalPrice);
    }
    
    // Показ модального окна корзины
    function showCartModal() {
        const modal = createModal({
            id: 'cart-modal',
            bottomSheet: true
        });
        
        const totalPrice = getTotalPrice();
        const isCartEmpty = isEmpty();
        
        let html = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-shopping-cart"></i> Корзина</h3>
                    <button class="modal-close" onclick="window.Cart.closeCartModal()">×</button>
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
                            <div style="font-weight: 700;">${Utils.escapeHtml(item.name)}</div>
                            <div style="color: #666; font-size: 13px;">
                                ${Utils.escapeHtml(item.type)} • ${Utils.formatPrice(item.price)}/шт
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button onclick="window.Cart.updateQuantity(${item.id}, -1)" 
                                    style="width: 32px; height: 32px; border-radius: 50%; border: none; 
                                           background: #eee; cursor: pointer;">-</button>
                            <div style="min-width: 28px; text-align: center; font-weight: 700;">
                                ${item.quantity}
                            </div>
                            <button onclick="window.Cart.updateQuantity(${item.id}, 1)" 
                                    style="width: 32px; height: 32px; border-radius: 50%; border: none; 
                                           background: #4CAF50; color: white; cursor: pointer;">+</button>
                            <div style="min-width: 70px; text-align: right; font-weight: 700; 
                                        color: #4CAF50; margin-left: 8px;">
                                ${Utils.formatPrice(item.price * item.quantity)}
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
                            Итого: <span style="color: #4CAF50;">${Utils.formatPrice(totalPrice)}</span>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            ${!isCartEmpty ? `
                                <button onclick="window.Cart.clearAll()" 
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
        
        modal.setContent(html);
        modal.show();
    }
    
    // Закрытие модального окна корзины
    function closeCartModal() {
        UI.closeModal('cart-modal');
    }
    
    return {
        load,
        save,
        get,
        clear,
        addToCart,
        updateQuantity,
        removeItem,
        clearAll,
        getTotalItems,
        getTotalPrice,
        isEmpty,
        updateUI,
        showCartModal,
        closeCartModal
    };
})();