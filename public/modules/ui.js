/* ===========================
   КОМПОНЕНТЫ ИНТЕРФЕЙСА
   =========================== */

window.UI = (function() {
    const Utils = window.Utils;
    
    // DOM кэш
    const domCache = {};
    
    function getElement(id) {
        if (!domCache[id]) {
            domCache[id] = document.getElementById(id);
        }
        return domCache[id];
    }
    
    // Тосты
    const Toast = {
        container: null,
        timeout: 3500,
        
        init() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'toast-container';
                this.container.style.cssText = `
                    position: fixed;
                    right: 14px;
                    top: 14px;
                    z-index: 99999;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                `;
                document.body.appendChild(this.container);
            }
        },
        
        show(text, options = {}) {
            this.init();
            
            const toast = document.createElement('div');
            toast.className = 'app-toast';
            toast.style.cssText = `
                background: ${options.type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 'rgba(0, 0, 0, 0.8)'};
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
            
            this.container.appendChild(toast);
            
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            });
            
            const timeout = options.timeout || this.timeout;
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-6px)';
                setTimeout(() => toast.remove(), 260);
            }, timeout);
        }
    };
    
    // Модальное окно подтверждения
    const Confirm = {
        overlay: null,
        
        async show(message, title = 'Подтвердите действие') {
            return new Promise(resolve => {
                // Удаляем старый overlay если есть
                if (this.overlay) {
                    this.overlay.remove();
                }
                
                // Создаем новый overlay
                this.overlay = document.createElement('div');
                this.overlay.id = 'confirm-overlay';
                this.overlay.style.cssText = `
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
                
                this.overlay.innerHTML = `
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
                        ">${Utils.escapeHtml(title)}</div>
                        <div style="
                            padding: 16px;
                            font-size: 15px;
                            color: #333;
                            line-height: 1.5;
                        ">${Utils.escapeHtml(message)}</div>
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
                
                document.body.appendChild(this.overlay);
                
                // Анимация появления
                requestAnimationFrame(() => {
                    this.overlay.style.opacity = '1';
                    this.overlay.querySelector('div').style.transform = 'scale(1)';
                });
                
                // Обработчики кнопок
                const noBtn = this.overlay.querySelector('#confirm-no');
                const yesBtn = this.overlay.querySelector('#confirm-yes');
                
                const close = (result) => {
                    this.overlay.style.opacity = '0';
                    this.overlay.querySelector('div').style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        if (this.overlay && this.overlay.parentNode) {
                            this.overlay.remove();
                            this.overlay = null;
                        }
                        resolve(result);
                    }, 180);
                };
                
                noBtn.onclick = () => close(false);
                yesBtn.onclick = () => close(true);
                
                // Закрытие по клику вне окна
                this.overlay.onclick = (e) => {
                    if (e.target === this.overlay) {
                        close(false);
                    }
                };
                
                // Закрытие по Escape
                const handleEscape = (e) => {
                    if (e.key === 'Escape') {
                        close(false);
                        document.removeEventListener('keydown', handleEscape);
                    }
                };
                document.addEventListener('keydown', handleEscape);
            });
        }
    };
    
    // Индикатор загрузки
    const Loader = {
        element: null,
        
        show(message = 'Загрузка...') {
            if (!this.element) {
                this.element = document.createElement('div');
                this.element.id = 'global-loader';
                this.element.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 100001;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                
                this.element.innerHTML = `
                    <div style="
                        width: 50px;
                        height: 50px;
                        border: 3px solid #f3f3f3;
                        border-top: 3px solid #4CAF50;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    "></div>
                    <div style="
                        margin-top: 16px;
                        color: #333;
                        font-size: 14px;
                    ">${Utils.escapeHtml(message)}</div>
                `;
                
                document.body.appendChild(this.element);
                
                // Добавляем стили для анимации
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.element.style.display = 'flex';
            requestAnimationFrame(() => {
                this.element.style.opacity = '1';
            });
        },
        
        hide() {
            if (this.element) {
                this.element.style.opacity = '0';
                setTimeout(() => {
                    if (this.element) {
                        this.element.style.display = 'none';
                    }
                }, 300);
            }
        }
    };
    
    // Закрытие всех модальных окон
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('bottom-sheet');
            modal.onclick = null;
        });
    }
    
    // Обновление счетчика корзины
    function updateCartBadge(count) {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
            Utils.hapticFeedback('light');
        }
        
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = count;
        }
    }
    
    // Обновление футера корзины
    function updateCartFooter(totalItems, totalPrice) {
        const cartTotal = getElement('cart-total');
        const checkoutBtn = getElement('checkout-btn');
        
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
    
    // Создание элемента товара для каталога
    function createProductCard(product, onClick) {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <div class="product-image ${Utils.getTeaTypeClass(product.type)}">
                ${product.tag ? `<div class="product-tag">${Utils.escapeHtml(product.tag)}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${Utils.escapeHtml(product.name)}</h3>
                <div class="product-subtitle">${Utils.escapeHtml(product.subtitle)}</div>
                <div class="product-price">${Utils.formatPrice(product.price)}</div>
                <button class="product-button" data-id="${product.id}">+ В корзину</button>
            </div>
        `;
        
        if (onClick) {
            div.addEventListener('click', (e) => {
                if (!e.target.closest('.product-button')) {
                    onClick(product.id);
                }
            });
        }
        
        const button = div.querySelector('.product-button');
        if (button) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                Utils.hapticFeedback('light');
            });
        }
        
        return div;
    }
    
    return {
        getElement,
        Toast,
        Confirm,
        Loader,
        closeAllModals,
        updateCartBadge,
        updateCartFooter,
        createProductCard
    };
})();
