/* ===========================
   ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
   =========================== */

window.Profile = (function() {
    const Utils = window.Utils;
    const UI = window.UI;
    const Storage = window.Storage;
    
    // Показ профиля
    function showProfile() {
        const userData = Utils.getUserData();
        const isTelegramUser = Utils.getIsTelegramUser();
        
        const firstName = userData.first_name || 'Гость';
        const lastName = userData.last_name || '';
        const username = userData.username ? `@${userData.username}` : '';
        const fullName = `${firstName} ${lastName}`.trim();
        const hasPhoto = userData.photo_url && userData.photo_url.trim() !== '';
        
        const modal = document.getElementById('profile-modal');
        if (!modal) return;
        
        const html = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-user"></i> Мой профиль</h3>
                    <button class="modal-close" onclick="closeModal('profile-modal')">×</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="width: 100px; height: 100px; margin: 0 auto 12px; 
                                    border-radius: 50%; overflow: hidden; border: 3px solid #4CAF50; 
                                    display: flex; align-items: center; justify-content: center; 
                                    background: ${hasPhoto ? 'transparent' : 'linear-gradient(135deg, #667eea, #764ba2)'};">
                            ${hasPhoto ? 
                                `<img src="${Utils.escapeHtml(userData.photo_url)}" alt="${Utils.escapeHtml(fullName)}" 
                                      style="width: 100%; height: 100%; object-fit: cover;"
                                      onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<div style=\\'font-size: 36px; color: white;\\'>${Utils.escapeHtml(firstName.charAt(0))}</div>'">` 
                                : 
                                `<div style="font-size: 36px; color: white;">${Utils.escapeHtml(firstName.charAt(0) || 'G')}</div>`
                            }
                        </div>
                        <h3 style="margin: 0 0 6px 0;">${Utils.escapeHtml(fullName)}</h3>
                        ${username ? `<p style="color: #666; margin: 6px 0;">${Utils.escapeHtml(username)}</p>` : ''}
                        ${isTelegramUser ? 
                            `<span style="background: #0088cc; color: white; padding: 4px 8px; 
                                          border-radius: 12px; font-size: 12px; margin-top: 4px;">
                                Telegram пользователь
                            </span>` 
                            : 
                            `<span style="background: #666; color: white; padding: 4px 8px; 
                                          border-radius: 12px; font-size: 12px; margin-top: 4px;">
                                Гость
                            </span>`
                        }
                        ${userData.id ? 
                            `<p style="color: #999; font-size: 13px; margin-top: 6px;">
                                ID: ${Utils.escapeHtml(String(userData.id))}
                            </p>` 
                            : ''
                        }
                    </div>

                    <div style="background: #f8f9fa; padding: 14px; border-radius: 12px; margin-bottom: 12px;">
                        <h4 style="margin: 0 0 8px 0; color: #333;">
                            <i class="fas fa-headset"></i> Контакты поддержки
                        </h4>
                        <div style="margin-top: 6px;">
                            <div style="background: white; padding: 10px; border-radius: 8px; margin-bottom: 8px;">
                                <div style="font-weight: 700; margin-bottom: 4px;">Telegram менеджер:</div>
                                <a href="https://t.me/ivan_likhov" target="_blank" 
                                   style="color: #4CAF50; text-decoration: none; display: block;">
                                    @ivan_likhov
                                </a>
                            </div>
                            <div style="background: white; padding: 10px; border-radius: 8px;">
                                <div style="font-weight: 700; margin-bottom: 4px;">Телефон:</div>
                                <a href="tel:+79038394670" 
                                   style="color: #4CAF50; text-decoration: none; display: block;">
                                    +7 (903) 839-46-70
                                </a>
                            </div>
                        </div>
                    </div>

                    <div style="background: #f8f9fa; padding: 14px; border-radius: 12px; margin-bottom: 12px;">
                        <h4 style="margin: 0 0 8px 0; color: #333;">
                            <i class="fas fa-clock"></i> Часы работы
                        </h4>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-weight: 700;">Пн–Вс:</div>
                                <div style="color: #666; font-size: 13px;">09:00 - 21:00</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="color: #4CAF50; font-weight: 700;">Принимаем заказы 24/7</div>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; margin-top: 16px;">
                        <button onclick="Profile.openChannel()" 
                                style="flex: 1; padding: 12px; border-radius: 10px; 
                                       background: linear-gradient(135deg, #4CAF50, #2E7D32); 
                                       color: white; border: none; cursor: pointer;">
                            <i class="fab fa-telegram"></i> Наш канал
                        </button>
                        <button onclick="Profile.clearData()" 
                                style="flex: 1; padding: 12px; border-radius: 10px; 
                                       background: #f8f9fa; color: #666; border: 1px solid #ddd; 
                                       cursor: pointer;">
                            <i class="fas fa-trash"></i> Очистить данные
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.innerHTML = html;
        modal.classList.remove('bottom-sheet');
        modal.style.display = 'flex';
        modal.onclick = (e) => {
            if (e.target === modal) closeModal('profile-modal');
        };
    }
    
    // Открытие канала
    function openChannel() {
        const url = 'https://t.me/teatea_bar';
        const tg = Utils.getTg();
        
        try {
            if (tg && tg.openLink) {
                tg.openLink(url);
            } else {
                window.open(url, '_blank');
            }
        } catch (e) {
            Utils.error('Failed to open channel:', e);
            window.open(url, '_blank');
        }
    }
    
    // Очистка данных
    async function clearData() {
        const confirmed = await UI.Confirm.show(
            'Очистить все данные (корзину, заказы, историю)? Это действие нельзя отменить.',
            'Очистка данных'
        );
        
        if (!confirmed) return;
        
        try {
            UI.Loader.show('Очищаем данные...');
            
            // Очищаем все данные
            await Storage.clearUserData();
            
            // Очищаем локальные переменные
            if (window.Cart) {
                window.Cart.clear();
                window.Cart.updateUI();
            }
            
            // Перезагружаем страницу
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (e) {
            Utils.error('Failed to clear data:', e);
            UI.Toast.show('Ошибка при очистке данных', { type: 'error' });
        } finally {
            UI.Loader.hide();
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
        showProfile,
        openChannel,
        clearData
    };
})();
