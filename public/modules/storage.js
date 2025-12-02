/* ===========================
   ХРАНИЛИЩЕ
   =========================== */

const Storage = (function() {
    const { log, error, getAppKeys, getUserId } = Utils;
    
    async function loadCart() {
        const userId = getUserId();
        const key = getAppKeys().CART_KEY(userId);
        const cart = [];
        
        // Cloud Storage для Telegram
        const tg = Utils.tg;
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
                        log('Cart loaded from cloud:', parsed.length, 'items');
                        return parsed;
                    }
                }
            } catch(e) { 
                error('Cloud cart error:', e); 
            }
        }
        
        // LocalStorage fallback
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    log('Cart loaded from localStorage:', parsed.length, 'items');
                    return parsed;
                }
            } catch(e) {
                error('LocalStorage cart parse error:', e);
                // Восстановление из backup
                const backup = localStorage.getItem('tutu_cart_backup');
                if (backup) {
                    try {
                        const backupData = JSON.parse(backup);
                        if (backupData.cart && Array.isArray(backupData.cart)) {
                            log('Cart restored from backup');
                            return backupData.cart;
                        }
                    } catch(backupError) {
                        error('Backup restore error:', backupError);
                    }
                }
            }
        }
        
        log('Cart initialized as empty');
        return [];
    }
    
    async function saveCart(cart) {
        const userId = getUserId();
        const key = getAppKeys().CART_KEY(userId);
        
        // Валидация корзины
        if (!Array.isArray(cart)) {
            error('Invalid cart format');
            return;
        }
        
        // Сохраняем в LocalStorage
        try {
            localStorage.setItem(key, JSON.stringify(cart));
        } catch(e) {
            error('LocalStorage write failed:', e);
        }
        
        // Cloud Storage для Telegram
        const tg = Utils.tg;
        if (tg && tg.CloudStorage && Utils.getIsTelegramUser()) {
            try {
                await new Promise((res, rej) => 
                    tg.CloudStorage.setItem('cart', JSON.stringify(cart), err => 
                        err ? rej(err) : res()
                    )
                );
                log('Cart saved to cloud');
            } catch(e) {
                error('Cloud save cart failed:', e);
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
            error('Backup save failed:', e);
        }
        
        log('Cart saved:', cart.length, 'items');
    }
    
    async function loadOrders() {
        const userId = getUserId();
        const key = getAppKeys().ORDERS_KEY(userId);
        
        // Cloud Storage
        const tg = Utils.tg;
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
                        log('Orders loaded from cloud:', parsed.length, 'orders');
                        return parsed;
                    }
                }
            } catch(e) {
                error('Cloud orders error:', e);
            }
        }
        
        // LocalStorage
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    log('Orders loaded from localStorage:', parsed.length, 'orders');
                    return parsed;
                }
            } catch(e) {
                error('LocalStorage orders parse error:', e);
            }
        }
        
        return [];
    }
    
    async function saveOrder(order) {
        if (!order || !order.id) {
            error('Invalid order format');
            return;
        }
        
        const userId = getUserId();
        const key = getAppKeys().ORDERS_KEY(userId);
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
            error('LocalStorage order save failed:', e);
        }
        
        // Cloud Storage
        const tg = Utils.tg;
        if (tg && tg.CloudStorage && Utils.getIsTelegramUser()) {
            try {
                await new Promise((res, rej) => 
                    tg.CloudStorage.setItem('orders', JSON.stringify(orders), err => 
                        err ? rej(err) : res()
                    )
                );
                log('Order saved to cloud');
            } catch(e) {
                error('Cloud save order failed:', e);
            }
        }
        
        log('Order saved:', order.id);
        return order;
    }
    
    async function loadPopularity() {
        const userId = getUserId();
        const key = getAppKeys().POP_KEY(userId);
        let popularity = {};
        
        // Cloud Storage
        const tg = Utils.tg;
        if (tg && tg.CloudStorage && Utils.getIsTelegramUser()) {
            try {
                const cloud = await new Promise(res => 
                    tg.CloudStorage.getItem('popularity', (err, val) => 
                        res(!err && val ? val : null)
                    )
                );
                if (cloud) {
                    popularity = JSON.parse(cloud);
                    log('Popularity loaded from cloud');
                    return popularity;
                }
            } catch(e) {
                error('Cloud popularity error:', e);
            }
        }
        
        // LocalStorage
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                popularity = JSON.parse(saved);
            } catch(e) {
                error('LocalStorage popularity parse error:', e);
                popularity = {};
            }
        }
        
        return popularity;
    }
    
    async function savePopularity(popularity) {
        if (!popularity || typeof popularity !== 'object') {
            error('Invalid popularity format');
            return;
        }
        
        const userId = getUserId();
        const key = getAppKeys().POP_KEY(userId);
        
        try {
            localStorage.setItem(key, JSON.stringify(popularity));
        } catch(e) {
            error('LocalStorage popularity save failed:', e);
        }
        
        // Cloud Storage
        const tg = Utils.tg;
        if (tg && tg.CloudStorage && Utils.getIsTelegramUser()) {
            try {
                await new Promise((res, rej) => 
                    tg.CloudStorage.setItem('popularity', JSON.stringify(popularity), err => 
                        err ? rej(err) : res()
                    )
                );
                log('Popularity saved to cloud');
            } catch(e) {
                error('Cloud save popularity failed:', e);
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
        const userId = getUserId();
        const keys = getAppKeys();
        
        Object.values(keys).forEach(keyFn => {
            const key = keyFn(userId);
            localStorage.removeItem(key);
        });
        
        // Cloud Storage
        const tg = Utils.tg;
        if (tg && tg.CloudStorage && Utils.getIsTelegramUser()) {
            try {
                await Promise.all([
                    new Promise(res => tg.CloudStorage.removeItem('cart', () => res())),
                    new Promise(res => tg.CloudStorage.removeItem('orders', () => res())),
                    new Promise(res => tg.CloudStorage.removeItem('popularity', () => res()))
                ]);
            } catch(e) {
                error('Cloud clear error:', e);
            }
        }
        
        log('User data cleared');
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