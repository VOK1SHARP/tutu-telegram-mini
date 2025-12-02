/* ===========================
   ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
   =========================== */

const Profile = (function() {
    const { log, error, escapeHtml } = Utils;
    const { UI, createModal } = UI;
    const { clearUserData } = Storage;
    
    // Показ профиля
    function showProfile() {
        const userData = Utils.getUserData();
        const isTelegramUser = Utils.getIsTelegramUser();
        
        const firstName = userData.first_name || 'Гость';
        const lastName = userData.last_name || '';
        const username = userData.username ? `@${userData.username}` : '';
        const fullName = `${firstName} ${lastName}`.trim();
        const hasPhoto = userData.photo_url && userData.photo_url.trim() !== '';
        
        const modal = createModal({
            id: 'profile-modal'
        });
        
        const html = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-user"></i> Мой профиль</h3>
                    <button class="modal-close" onclick="window.Profile.closeProfile()">×</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="width: 100px; height: 100px; margin: 0 auto 12px; 
                                    border-radius: 50%; overflow: hidden; border: 3px solid #4CAF50; 
                                    display: flex; align-items: center; justify-content: center; 
                                    background: ${hasPhoto ? 'transparent' : 'linear-gradient(135deg, #667eea, #764ba2)'};">
                            ${hasPhoto ? 
                                `<img src="${escapeHtml(userData.photo_url)}" alt="${escapeHtml(fullName)}" 
                                      style="width: 100%; height: 100%; object-fit: cover;"
                                      onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<div style=\\'font-size: 36px; color: white;\\'>${escapeHtml(firstName.charAt(0))}</div>'">` 
                                : 
                                `<div style="font-size: 36px; color: white;">${escapeHtml(firstName.charAt(0) || 'G')}</div>`
                            }
                        </div>
                        <h3 style="margin: 0 0 6px 0;">${escapeHtml(fullName)}</h3>
                        ${username ? `<p style="color: #666; margin: 6px 0;">${escapeHtml(username)}</p>` : ''}
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
                                ID: ${escapeHtml(String(userData.id))}
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
                        <button onclick="window.Profile.openChannel()" 
                                style="flex: 1; padding: 12px; border-radius: 10px; 
                                       background: linear-gradient(135deg, #4CAF50, #2E7D32); 
                                       color: white; border: none; cursor: pointer;">
                            <i class="fab fa-telegram"></i> Наш канал
                        </button>
                        <button onclick="window.Profile.clearData()" 
                                style="flex: 1; padding: 12px; border-radius: 10px; 
                                       background: #f8f9fa; color: #666; border: 1px solid #ddd; 
                                       cursor: pointer;">
                            <i class="fas fa-trash"></i> Очистить данные
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.setContent(html);
        modal.show();
    }
    
    // Открытие канала
    function openChannel() {
        const url = 'https://t.me/teatea_bar';
        const tg = Utils.tg;
        
        try {
            if (tg && tg.openLink) {
                tg.openLink(url);
            } else {
                window.open(url, '_blank');
            }
        } catch (e) {
            error('Failed to open channel:', e);
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
            await clearUserData();
            
            // Очищаем локальные переменные
            Cart.clear();
            Cart.updateUI();
            
            // Перезагружаем страницу
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (e) {
            error('Failed to clear data:', e);
            UI.Toast.show('Ошибка при очистке данных', { type: 'error' });
        } finally {
            UI.Loader.hide();
        }
    }
    
    // Закрытие профиля
    function closeProfile() {
        UI.closeModal('profile-modal');
    }
    
    return {
        showProfile,
        openChannel,
        clearData,
        closeProfile
    };
})();