/* ===========================
   ЗАКАЗЫ
   =========================== */

window.Orders = (function() {
    const Utils = window.Utils;
    const UI = window.UI;
    const Catalog = window.Catalog;
    const Cart = window.Cart;
    const Storage = window.Storage;
    
    // Создание нового заказа
    async function createOrder() {
        const cart = Cart.get();
        if (!cart || cart.length === 0) {
            throw new Error('Корзина пуста');
        }
        
        const userData = Utils.getUserData();
        const userId = Utils.getUserId();
        
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
            total: Cart.getTotalPrice(),
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        return await Storage.saveOrder(order);
    }
    
    // Загрузка всех заказов
    async function loadAll() {
        try {
            const orders = await Storage.loadOrders();
            Utils.log('Orders loaded:', orders.length, 'orders');
            return orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (e) {
            Utils.error('Failed to load orders:', e);
            return [];
        }
    }
    
    // Получение заказа по ID
    async function getOrderById(orderId) {
        const orders = await loadAll();
        return orders.find(order => order.id === orderId);
    }
    
    // Форматирование текста заказа
    function formatOrderText(order) {
        const lines = [];
        const userData = Utils.getUserData();
        
        lines.push(`Новый заказ #${order.id}`);
        lines.push(`Покупатель: ${order.user_name} ${order.user_username ? `(@${order.user_username})` : ''}`);
        lines.push(`ID пользователя: ${Utils.getUserId()}`);
        lines.push(`Дата: ${Utils.formatDate(order.timestamp)}`);
        lines.push(`Сумма: ${Utils.formatPrice(order.total)}`);
        lines.push(`Товары:`);
        
        order.cart.forEach(item => {
            lines.push(` - ${item.name} × ${item.quantity} (${Utils.formatPrice(item.price)})`);
        });
        
        lines.push('');
        lines.push('Пожалуйста, укажите адрес и контакты для доставки и отправьте сообщение.');
        lines.push('Адрес: ');
        
        return lines.join('\n');
    }
    
    // Копирование текста заказа в буфер
    async function copyOrderText(order) {
        try {
            const text = formatOrderText(order);
            await navigator.clipboard.writeText(text);
            UI.Toast.show('Текст заказа скопирован в буфер');
            return true;
        } catch (e) {
            Utils.error('Failed to copy to clipboard:', e);
            
            // Fallback для старых браузеров
            const textarea = document.createElement('textarea');
            textarea.value = formatOrderText(order);
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                
                if (successful) {
                    UI.Toast.show('Текст заказа скопирован');
                    return true;
                } else {
                    throw new Error('Copy command failed');
                }
            } catch (err) {
                Utils.error('Fallback copy failed:', err);
                return false;
            }
        }
    }
    
    // Повтор заказа (добавление товаров из заказа в корзину)
    async function reorder(orderId) {
        const order = await getOrderById(orderId);
        if (!order) {
            UI.Toast.show('Заказ не найден', { type: 'error' });
            return false;
        }
        
        const confirmed = await UI.Confirm.show(
            'Добавить все товары из этого заказа в корзину?',
            'Повторить заказ'
        );
        
        if (!confirmed) return false;
        
        UI.Loader.show('Добавляем товары...');
        
        try {
            // Очищаем текущую корзину
            Cart.clear();
            
            // Добавляем все товары из заказа
            for (const item of order.cart) {
                for (let i = 0; i < item.quantity; i++) {
                    await Cart.addToCart(item.id);
                }
            }
            
            await Cart.save();
            
            UI.Toast.show('Товары из заказа добавлены в корзину');
            Cart.showCartModal();
            
            return true;
        } catch (e) {
            Utils.error('Failed to reorder:', e);
            UI.Toast.show('Ошибка при добавлении товаров', { type: 'error' });
            return false;
        } finally {
            UI.Loader.hide();
        }
    }
    
    // Показ истории заказов
    async function showOrdersHistory() {
        // Создаем модальное окно
        const modal = document.getElementById('order-modal');
        if (!modal) return;
        
        UI.Loader.show('Загружаем заказы...');
        
        try {
            const orders = await loadAll();
            
            let html = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-box"></i> История заказов</h3>
                        <button class="modal-close" onclick="closeModal('order-modal')">×</button>
                    </div>
                    <div class="modal-body">
            `;
            
            if (orders.length === 0) {
                html += `
                    <div style="text-align: center; padding: 40px; color: #888;">
                        <i class="fas fa-box-open" style="font-size: 42px; color: #ddd;"></i>
                        <div style="margin-top: 12px;">Заказов пока нет</div>
                    </div>
                `;
            } else {
                html += `
                    <div style="max-height: 60vh; overflow: auto;">
                `;
                
                orders.forEach(order => {
                    const itemCount = order.cart.reduce((sum, item) => sum + item.quantity, 0);
                    
                    html += `
                        <div style="background: #f8f9fa; padding: 12px; border-radius: 10px; 
                                    margin-bottom: 10px; display: flex; justify-content: space-between; 
                                    align-items: center;">
                            <div>
                                <div style="font-weight: 700;">Заказ #${order.id}</div>
                                <div style="color: #666; font-size: 13px;">
                                    ${Utils.formatDate(order.timestamp)}
                                </div>
                                <div style="color: #888; font-size: 13px; margin-top: 4px;">
                                    Товаров: ${itemCount}
                                </div>
                            </div>
                            <div style="text-align: right; display: flex; flex-direction: column; gap: 8px;">
                                <div style="font-weight: 700; color: #4CAF50;">
                                    ${Utils.formatPrice(order.total)}
                                </div>
                                <div style="display: flex; gap: 8px;">
                                    <button onclick="Orders.showOrderDetails(${order.id})" 
                                            style="padding: 6px 8px; border-radius: 8px; border: none; 
                                                   background: #fff; cursor: pointer; font-size: 12px;">
                                        Открыть
                                    </button>
                                    <button onclick="Orders.reorder(${order.id})" 
                                            style="padding: 6px 8px; border-radius: 8px; border: none; 
                                                   background: #4CAF50; color: white; cursor: pointer; 
                                                   font-size: 12px;">
                                        Повторить
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                html += `</div>`;
            }
            
            html += `
                    </div>
                </div>
            `;
            
            modal.innerHTML = html;
            modal.classList.add('bottom-sheet');
            modal.style.display = 'flex';
            modal.onclick = (e) => {
                if (e.target === modal) closeModal('order-modal');
            };
            
        } catch (e) {
            Utils.error('Failed to load orders:', e);
            UI.Toast.show('Ошибка загрузки заказов', { type: 'error' });
        } finally {
            UI.Loader.hide();
        }
    }
    
    // Показ деталей заказа
    async function showOrderDetails(orderId) {
        const modal = document.getElementById('order-modal');
        if (!modal) return;
        
        UI.Loader.show('Загружаем детали заказа...');
        
        try {
            const order = await getOrderById(orderId);
            if (!order) {
                UI.Toast.show('Заказ не найден', { type: 'error' });
                return;
            }
            
            const itemCount = order.cart.reduce((sum, item) => sum + item.quantity, 0);
            
            let html = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-receipt"></i> Заказ #${order.id}</h3>
                        <button class="modal-close" onclick="Orders.showOrdersHistory()">← Назад</button>
                    </div>
                    <div class="modal-body">
                        <div style="margin-bottom: 12px;">
                            <strong>Покупатель:</strong> ${Utils.escapeHtml(order.user_name)} 
                            ${order.user_username ? `(@${Utils.escapeHtml(order.user_username)})` : ''}
                        </div>
                        <div style="margin-bottom: 12px;">
                            <strong>Дата заказа:</strong> ${Utils.formatDate(order.timestamp)}
                        </div>
                        <div style="margin-bottom: 12px;">
                            <strong>Статус:</strong> 
                            <span style="color: #4CAF50; font-weight: 700;">
                                ${order.status === 'completed' ? '✅ Выполнен' : '⏳ Ожидает обработки'}
                            </span>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <strong>Сумма:</strong> ${Utils.formatPrice(order.total)}
                        </div>
                        <div style="margin-bottom: 12px;">
                            <strong>Товары (${itemCount}):</strong>
                            <div style="margin-top: 8px;">
            `;
            
            order.cart.forEach(item => {
                html += `
                    <div style="display: flex; justify-content: space-between; align-items: center; 
                                padding: 8px; background: #f8f9fa; border-radius: 8px; margin-bottom: 6px;">
                        <div>
                            <div style="font-weight: 500;">${Utils.escapeHtml(item.name)}</div>
                            <div style="color: #666; font-size: 12px;">${Utils.escapeHtml(item.type)}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700;">${item.quantity} × ${Utils.formatPrice(item.price)}</div>
                            <div style="color: #4CAF50; font-size: 12px;">
                                ${Utils.formatPrice(item.price * item.quantity)}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 8px; margin-top: 16px;">
                            <button onclick="Orders.copyOrderToChat(${order.id})" 
                                    style="flex: 1; padding: 10px; border-radius: 8px; 
                                           background: #4CAF50; color: white; border: none; cursor: pointer;">
                                Открыть в чате
                            </button>
                            <button onclick="Orders.reorder(${order.id})" 
                                    style="flex: 1; padding: 10px; border-radius: 8px; 
                                           background: #2196F3; color: white; border: none; cursor: pointer;">
                                Повторить заказ
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            modal.innerHTML = html;
            modal.classList.remove('bottom-sheet');
            modal.style.display = 'flex';
            modal.onclick = (e) => {
                if (e.target === modal) closeModal('order-modal');
            };
            
        } catch (e) {
            Utils.error('Failed to load order details:', e);
            UI.Toast.show('Ошибка загрузки деталей заказа', { type: 'error' });
        } finally {
            UI.Loader.hide();
        }
    }
    
    // Открытие заказа в чате
    async function copyOrderToChat(orderId) {
        const order = await getOrderById(orderId);
        if (!order) {
            UI.Toast.show('Заказ не найден', { type: 'error' });
            return;
        }
        
        const copied = await copyOrderText(order);
        if (!copied) {
            // Показываем модальное окно с текстом для ручного копирования
            const modal = document.getElementById('order-modal');
            if (!modal) return;
            
            const text = formatOrderText(order);
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-paper-plane"></i> Текст заказа</h3>
                        <button class="modal-close" onclick="closeModal('order-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <textarea id="order-copy-textarea" 
                                  style="width: 100%; height: 220px; border-radius: 8px; 
                                         padding: 10px; font-family: monospace; font-size: 12px;"
                                  readonly>${Utils.escapeHtml(text)}</textarea>
                        <div style="display: flex; gap: 10px; margin-top: 12px;">
                            <button onclick="Orders.copyFromTextarea()" 
                                    style="flex: 1; padding: 10px; border-radius: 8px; 
                                           background: #4CAF50; color: white; border: none; cursor: pointer;">
                                Копировать
                            </button>
                            <button onclick="Orders.openChat()" 
                                    style="flex: 1; padding: 10px; border-radius: 8px; 
                                           background: #2196F3; color: white; border: none; cursor: pointer;">
                                Открыть чат
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            modal.classList.remove('bottom-sheet');
            modal.style.display = 'flex';
            modal.onclick = (e) => {
                if (e.target === modal) closeModal('order-modal');
            };
            
            return;
        }
        
        // Открываем чат менеджера
        openChat();
    }
    
    // Открытие чата менеджера
    function openChat() {
        const managerUrl = 'https://t.me/ivan_likhov';
        const tg = Utils.getTg();
        
        try {
            if (tg && tg.openLink) {
                tg.openLink(managerUrl);
            } else {
                window.open(managerUrl, '_blank');
            }
            
            UI.Toast.show('Перейдите в чат @ivan_likhov и вставьте текст заказа');
        } catch (e) {
            Utils.error('Failed to open chat:', e);
            window.open(managerUrl, '_blank');
        }
    }
    
    // Копирование из textarea
    async function copyFromTextarea() {
        const textarea = document.getElementById('order-copy-textarea');
        if (!textarea) return;
        
        try {
            textarea.select();
            const successful = document.execCommand('copy');
            
            if (successful) {
                UI.Toast.show('Текст скопирован в буфер');
                Utils.hapticFeedback('light');
            } else {
                throw new Error('Copy command failed');
            }
        } catch (e) {
            Utils.error('Failed to copy from textarea:', e);
            UI.Toast.show('Не удалось скопировать', { type: 'error' });
        }
    }
    
    // Вспомогательная функция закрытия модального окна
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Экспорт публичных методов
    return {
        createOrder,
        loadAll,
        getOrderById,
        formatOrderText,
        copyOrderText,
        reorder,
        showOrdersHistory,
        showOrderDetails,
        copyOrderToChat,
        openChat,
        copyFromTextarea
    };
})();
