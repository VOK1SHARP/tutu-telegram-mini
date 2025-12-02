/* ===========================
   ХРАНИЛИЩЕ
   =========================== */

window.Storage = (function() {
    const Utils = window.Utils;
    
    async function loadCart() {
        const userId = Utils.getUserId();
        const key = Utils.getAppKeys().CART_KEY(userId);
        const cart = [];
        
        // Cloud Storage для Telegram
        const tg = Utils.getTg();
        if (tg && tg.CloudStorage && Utils.getIsTelegramUser()) {
            try {
                const cloud = await new Promise(res => 
                    tg.CloudStorage.getItem('cart', (err, val) => 
                        res(!err && val ? val : null)
                    )
                );
                if (cloud) {
                    const parsed = JSON.parse(cloud);
                    if (Array.isArray(parsed)) {
                        Utils.log('Cart loaded from cloud:', parsed.length, 'items');
                        return parsed;
                    }
                }
            } catch(e) { 
                Utils.error('Cloud cart error:', e); 
            }
        }
        
        // LocalStorage fallback
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    Utils.log('Cart loaded from localStorage:', parsed.length, 'items');
                    return parsed;
                }
            } catch(e) {
                Utils.error('LocalStorage cart parse error:', e);
                // Восстановление из backup
                const backup = localStorage.getItem('tutu_cart_backup');
                if (backup) {
                    try {
                        const backupData = JSON.parse(backup);
                        if (backupData.cart && Array.isArray(backupData.cart)) {
                            Utils.log('Cart restored from backup');
                            return backupData.cart;
                        }
                    } catch(backupError) {
                        Utils.error('Backup restore error:', backupError);
                    }
                }
            }
        }
        
        Utils.log('Cart initialized as empty');
        return [];
    }
    
    async function saveCart(cart) {
        const userId = Utils.getUserId();
        const key = Utils.getAppKeys().CART_KEY(userId);
        
        // Валидация корзины
        if (!Array.isArray(cart)) {
            Utils.error('Invalid cart format');
            return;
        }
        
        // Сохраняем в LocalStorage
        try {
            localStorage.setItem(key, JSON.stringify(cart));
        } catch(e) {
            Utils.error('LocalStorage write failed:', e);
        }
        
        // Cloud Storage для Telegram
        const tg = Utils.getTg();
        if (tg && tg.CloudStorage && Utils.getIsTelegramUser()) {
            try {
                await new Promise((res, rej) => 
                    tg.CloudStorage.setItem('cart', JSON.stringify(cart), err => 
                        err ? rej(err) : res()
                    )
                );
                Utils.log('Cart saved to cloud');
            } catch(e) {
                Utils.error('Cloud save cart failed:', e);
            }
        }
        
        // Резервная копия
        try {
            localStorage.setItem('tutu_cart_backup', JSON.stringify({
                userId,
                cart,
                timestamp: new Date().toISOString()
            }));
        } catch(e) {
            Utils.error('Backup save failed:', e);
        }
        
        Utils.log('Cart saved:', cart.length, 'items');
    }
    
    async function loadOrders() {
        const userId = Utils.getUserId();
        const key = Utils.getAppKeys().ORDERS_KEY(userId);
        
        // Cloud Storage
        const tg = Utils.getTg();
        if (tg && tg.CloudStorage && Utils.getIsTelegramUser()) {
            try {
                const cloud = await new Promise(res => 
                    tg.CloudStorage.getItem('orders', (err, val) => 
                        res(!err && val ? val : null)
                    )
                );
                if (cloud) {
                    const parsed = JSON.parse(cloud);
                    if (Array.isArray(parsed)) {
                        Utils.log('Orders loaded from cloud:', parsed.length, 'orders');
                        return parsed;
                    }
                }
            } catch(e) {
                Utils.error('Cloud orders error:', e);
            }
        }
        
        // LocalStorage
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    Utils.log('Orders loaded from localStorage:', parsed.length, 'orders');
                    return parsed;
                }
            } catch(e) {
                Utils.error('LocalStorage orders parse error:', e);
            }
        }
        
        return [];
    }
    
    async function saveOrder(order) {
        if (!order || !order.id) {
            Utils.error('Invalid order format');
            return;
        }
        
        const userId = Utils.getUserId();
        const key = Utils.getAppKeys().ORDERS_KEY(userId);
        const orders = await loadOrders();
        
        // Проверяем, нет ли уже такого заказа
        const existingOrderIndex = orders.findIndex(o => o.id === order.id);
        if (existingOrderIndex >= 0) {
            orders[existingOrderIndex] = order;
        } else {
            orders.push(order);
        }
        
        // Сохраняем
        try {
            localStorage.setItem(key, JSON.stringify(orders));
        } catch(e) {
            Utils.error('LocalStorage order save failed:', e);
        }
        
        // Cloud Storage
        const tg = Utils.getTg();
        if (tg && tg.CloudStorage && Utils.getIsTelegramUser()) {
            try {
                await new Promise((res, rej) => 
                    tg.CloudStorage.setItem('orders', JSON.stringify(orders), err => 
                        err ? rej(err) : res()
                    )
                );
                Utils.log('Order saved to cloud');
            } catch(e) {
                Utils.error('Cloud save order failed:', e);
            }
        }
        
        Utils.log('Order saved:', order.id);
        return order;
    }
    
    async function loadPopularity() {
        const userId = Utils.getUserId();
        const key = Utils.getAppKeys().POP_KEY(userId);
        let popularity = {};
        
        // Cloud Storage
        const tg = Utils.getTg();
        if (tg && tg.CloudStorage && Utils.getIsTelegramUser()) {
            try {
                const cloud = await new Promise(res => 
                    tg.CloudStorage.getItem('popularity', (err, val) => 
                        res(!err && val ? val : null)
                    )
                );
                if (cloud) {
                    popularity = JSON.parse(cloud);
                    Utils.log('Popularity loaded from cloud');
                    return popularity;
                }
            } catch(e) {
                Utils.error('Cloud popularity error:', e);
            }
        }
        
        // LocalStorage
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                popularity = JSON.parse(saved);
            } catch(e) {
                Utils.error('LocalStorage popularity parse error:', e);
                popularity = {};
            }
        }
        
        return popularity;
    }
    
    async function savePopularity(popularity) {
        if (!popularity || typeof popularity !== 'object') {
            Utils.error('Invalid popularity format');
            return;
        }
        
        const userId = Utils.getUserId();
        const key = Utils.getAppKeys().POP_KEY(userId);
        
        try {
            localStorage.setItem(key, JSON.stringify(popularity));
        } catch(e) {
            Utils.error('LocalStorage popularity save failed:', e);
        }
        
        // Cloud Storage
        const tg = Utils.getTg();
        if (tg && tg.CloudStorage && Utils.getIsTelegramUser()) {
            try {
                await new Promise((res, rej) => 
                    tg.CloudStorage.setItem('popularity', JSON.stringify(popularity), err => 
                        err ? rej(err) : res()
                    )
                );
                Utils.log('Popularity saved to cloud');
            } catch(e) {
                Utils.error('Cloud save popularity failed:', e);
            }
        }
    }
    
    function updatePopularityFromOrder(order, popularity) {
        if (!order || !Array.isArray(order.cart)) return popularity;
        
        const newPopularity = { ...popularity };
        order.cart.forEach(item => {
            const id = String(item.id);
            const qty = Number(item.quantity || 1);
            newPopularity[id] = (newPopularity[id] || 0) + qty;
        });
        
        return newPopularity;
    }
    
    async function clearUserData() {
        const userId = Utils.getUserId();
        const keys = Utils.getAppKeys();
        
        Object.values(keys).forEach(keyFn => {
            const key = keyFn(userId);
            localStorage.removeItem(key);
        });
        
        // Cloud Storage
        const tg = Utils.getTg();
        if (tg && tg.CloudStorage && Utils.getIsTelegramUser()) {
            try {
                await Promise.all([
                    new Promise(res => tg.CloudStorage.removeItem('cart', () => res())),
                    new Promise(res => tg.CloudStorage.removeItem('orders', () => res())),
                    new Promise(res => tg.CloudStorage.removeItem('popularity', () => res()))
                ]);
            } catch(e) {
                Utils.error('Cloud clear error:', e);
            }
        }
        
        Utils.log('User data cleared');
    }
    
    return {
        loadCart,
        saveCart,
        loadOrders,
        saveOrder,
        loadPopularity,
        savePopularity,
        updatePopularityFromOrder,
        clearUserData
    };
})();
