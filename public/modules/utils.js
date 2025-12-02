/* ===========================
   УТИЛИТЫ
   =========================== */

window.Utils = (function() {
    // Глобальные переменные
    let tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
    let userData = null;
    let userId = null;
    let isTelegramUser = false;
    
    // Ключи для хранения
    const APP_KEYS = {
        CART_KEY: (uid) => `tutu_cart_${uid}`,
        ORDERS_KEY: (uid) => `tutu_orders_${uid}`,
        POP_KEY: (uid) => `tutu_popularity_${uid}`
    };

    function sleep(ms) { 
        return new Promise(res => setTimeout(res, ms)); 
    }
    
    function log(...args) { 
        console.log('[app]', ...args); 
    }
    
    function error(...args) {
        console.error('[app]', ...args);
    }
    
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
        const classes = {
            'Пуэр': 'puer',
            'Красный чай': 'red-tea',
            'Улун': 'oolong',
            'Габа': 'gaba',
            'Зеленый чай': 'green-tea'
        };
        return classes[type] || '';
    }
    
    function validateProduct(product) {
        const required = ['id', 'name', 'price', 'type'];
        return required.every(field => product[field] !== undefined);
    }
    
    function validateCartItem(item) {
        return item && 
               typeof item.id === 'number' && 
               typeof item.quantity === 'number' && 
               item.quantity > 0 &&
               typeof item.price === 'number' &&
               item.price > 0;
    }
    
    function hapticFeedback(type = 'light') {
        if (tg && tg.HapticFeedback && tg.HapticFeedback.impactOccurred) {
            try {
                tg.HapticFeedback.impactOccurred(type);
            } catch (e) {
                log('Haptic feedback error:', e);
            }
        }
    }
    
    async function getUserData() {
        // Telegram WebApp данные
        if (window.Telegram && window.Telegram.WebApp) {
            for (let i = 0; i < 6; i++) {
                const maybe = window.Telegram.WebApp.initDataUnsafe;
                if (maybe && maybe.user) {
                    const u = maybe.user;
                    isTelegramUser = true;
                    const data = { 
                        id: u.id || null, 
                        first_name: u.first_name || '', 
                        last_name: u.last_name || '', 
                        username: u.username || '', 
                        photo_url: u.photo_url || '', 
                        is_bot: u.is_bot || false, 
                        language_code: u.language_code || 'ru' 
                    };
                    log('Telegram user detected:', data);
                    return data;
                }
                await sleep(120);
            }
        }
        
        // Debug через URL параметр
        try {
            const p = new URLSearchParams(window.location.search).get('tgUser');
            if (p) {
                const debugUser = JSON.parse(decodeURIComponent(p));
                log('Debug user from URL:', debugUser);
                return debugUser;
            }
        } catch(e) { 
            log('tgUser parse fail', e); 
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
            guest = 'guest_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9); 
            localStorage.setItem('tutu_guest_id', guest); 
        }
        return guest;
    }
    
    function initTelegram() {
        if (!tg && window.Telegram && window.Telegram.WebApp) {
            tg = window.Telegram.WebApp;
        }
        
        if (tg) {
            try {
                if (tg.ready) tg.ready();
                if (tg.expand) tg.expand();
                if (tg.setHeaderColor) tg.setHeaderColor('#4CAF50');
                if (tg.setBackgroundColor) tg.setBackgroundColor('#f5f7fa');
                if (tg.enableClosingConfirmation) tg.enableClosingConfirmation();
            } catch (e) {
                log('Telegram init warnings:', e);
            }
        }
        return tg;
    }
    
    // Экспорт
    return {
        sleep,
        log,
        error,
        escapeHtml,
        formatPrice,
        formatDate,
        getTeaTypeClass,
        validateProduct,
        validateCartItem,
        hapticFeedback,
        getUserData,
        generateUserId,
        initTelegram,
        
        // Геттеры и сеттеры
        getTg: () => tg,
        setUserData: (data) => { userData = data; },
        getUserData: () => userData,
        setUserId: (id) => { userId = id; },
        getUserId: () => userId,
        setIsTelegramUser: (value) => { isTelegramUser = value; },
        getIsTelegramUser: () => isTelegramUser,
        getAppKeys: () => APP_KEYS
    };
})();
async function getUserData() {
    // ... весь существующий код ...
    
    // Убедитесь, что последняя строка ВСЕГДА возвращает объект:
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
