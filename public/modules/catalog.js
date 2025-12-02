/* ===========================
   КАТАЛОГ ТОВАРОВ
   =========================== */

const Catalog = (function() {
    const { log, error, escapeHtml, formatPrice, getTeaTypeClass } = Utils;
    const { Toast, UI, createModal } = UI;
    
    // Каталог чая
    const teaCatalog = [
        { id:1, name:'ЛАО ЧА ТОУ', subtitle:'Старые чайные головы', type:'Пуэр', price:1200, 
          description:'Насыщенный и бархатистый чай с землистыми нотами и долгим послевкусием.', 
          brewing:['🌿 5 гр чая на 500 мл воды','🌡 95°C','⏳ 3-5 минут'], 
          benefits:['♥️ Антиоксидант', '🧠 Улучшает концентрацию'], 
          tag:'Хит' },
        { id:2, name:'ХЭЙ ЦЗИНЬ', subtitle:'Черное золото', type:'Красный чай', price:950, 
          description:'Аромат сладости с нотками меда и сухофруктов, мягкий вкус.', 
          brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 85-95°C','⏳ 20-30 секунд'], 
          benefits:['❄️ Согревает', '💆 Расслабляет'], 
          tag:'Популярное' },
        { id:3, name:'ЖОУ ГУЙ НУН СЯН', subtitle:'Мясистая корица', type:'Улун', price:1100, 
          description:'Чай для концентрации с пряными нотками корицы и карамели.', 
          brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 80-90°C','⏳ 30-40 секунд'], 
          benefits:['🦋 Стимулирует обмен веществ', '🔥 Тонизирует'], 
          tag:'Рекомендуем' },
        { id:4, name:'ДЯНЬ ХУН', subtitle:'Красный чай из Юньнани', type:'Красный чай', price:850, 
          description:'Теплый, хлебно-медовый аромат с фруктовым послевкусием.', 
          brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 85-95°C','⏳ 20-30 секунд'], 
          benefits:['❄️ Согревает', '🍎 Улучшает пищеварение'] },
        { id:5, name:'ГАБА МАО ЧА', subtitle:'Чай-сырец', type:'Габа', price:1400, 
          description:'В аромате жареные семечки и карамель, богатый ГАБА-аминокислотами.', 
          brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 85°C','⏳ 20-30 секунд'], 
          benefits:['♥️ Полезен для сердца', '🧘 Успокаивает нервную систему'], 
          tag:'Новинка' },
        { id:6, name:'ГУ ШУ ХУН ЧА', subtitle:'Красный чай со старых деревьев', type:'Красный чай', price:1300, 
          description:'Насыщенные медово-сливовые оттенки с древесными нотками.', 
          brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 85-90°C','⏳ 20-30 секунд'], 
          benefits:['❄️ Согревает', '🌿 Детоксикация'] },
        { id:7, name:'ТЕ ГУАНЬ ИНЬ', subtitle:'Железная богиня милосердия', type:'Улун', price:1050, 
          description:'Классический расслабляющий светлый улун с цветочным ароматом.', 
          brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 85°C','⏳ 20-25 секунд'], 
          benefits:['👨🏻‍🦳 Антиоксиданты', '🌱 Очищает организм'], 
          tag:'Классика' },
        { id:8, name:'МО ЛИ ХУА ЧА', subtitle:'Жасмин', type:'Зеленый чай', price:900, 
          description:'Свежий жасминовый аромат в сочетании с нежным вкусом зеленого чая.', 
          brewing:['🌿 5-8 гр на 150-200 мл воды','🌡 70°C','⏳ 20-40 секунд'], 
          benefits:['🧘🏻‍♀️ Снимает стресс', '🌸 Освежает'] }
    ];
    
    // Кэш товаров по ID
    const productCache = new Map();
    
    // Инициализация кэша
    function initCache() {
        teaCatalog.forEach(product => {
            productCache.set(product.id, product);
        });
    }
    
    // Получение товара по ID
    function getProductById(id) {
        if (!productCache.size) {
            initCache();
        }
        return productCache.get(id);
    }
    
    // Получение всех товаров
    function getAllProducts() {
        return [...teaCatalog];
    }
    
    // Получение популярных товаров (на основе статистики)
    function getPopularProducts(popularity, limit = 4) {
        const counts = {};
        teaCatalog.forEach(t => {
            counts[String(t.id)] = popularity[String(t.id)] || 0;
        });
        
        return [...teaCatalog]
            .sort((a, b) => {
                const pa = counts[String(a.id)] || 0;
                const pb = counts[String(b.id)] || 0;
                if (pa !== pb) return pb - pa;
                return a.id - b.id;
            })
            .slice(0, limit);
    }
    
    // Показ каталога
    function showCatalog() {
        const modal = createModal({
            id: 'catalog-modal',
            bottomSheet: true
        });
        
        let html = `
            <div class="modal-header">
                <h3><i class="fas fa-list"></i> Каталог</h3>
                <button class="modal-close" onclick="window.Catalog.closeCatalog()">×</button>
            </div>
            <div class="modal-body" style="padding: 10px;">
        `;
        
        teaCatalog.forEach(product => {
            html += `
                <div class="catalog-item" onclick="window.Catalog.showProductDetail(${product.id})" 
                     style="padding: 12px; border-radius: 10px; display: flex; gap: 12px; align-items: center; 
                            margin-bottom: 10px; background: #fff; cursor: pointer; transition: background 0.2s;">
                    <div style="width: 64px; height: 64px; border-radius: 10px; display: flex; 
                                align-items: center; justify-content: center;" 
                         class="tea-icon ${getTeaTypeClass(product.type)}">
                        <i class="fas fa-leaf"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 700;">${escapeHtml(product.name)}</div>
                        <div style="color: #666; font-size: 14px;">${escapeHtml(product.subtitle)}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: #4CAF50; font-weight: 700; margin-bottom: 8px;">
                            ${formatPrice(product.price)}
                        </div>
                        <button onclick="event.stopPropagation(); window.Cart.addToCart(${product.id});" 
                                style="padding: 6px 10px; border-radius: 10px; background: #4CAF50; 
                                       color: white; border: none; cursor: pointer;">
                            + Добавить
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        modal.setContent(html);
        modal.show();
    }
    
    // Показ деталей товара
    function showProductDetail(productId) {
        const product = getProductById(productId);
        if (!product) {
            Toast.show('Товар не найден', { type: 'error' });
            return;
        }
        
        const modal = createModal({
            id: 'product-detail-modal',
            bottomSheet: true
        });
        
        const html = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-leaf"></i> ${escapeHtml(product.name)}</h3>
                    <button class="modal-close" onclick="window.Catalog.closeProductDetail()">×</button>
                </div>
                <div class="modal-body">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="font-weight: 700;">${escapeHtml(product.subtitle)}</div>
                        <div style="background: #4CAF50; color: #fff; padding: 6px 10px; border-radius: 12px; font-weight: 700;">
                            ${escapeHtml(product.type)}
                        </div>
                    </div>
                    ${product.tag ? `
                        <div style="background: #FF9800; color: white; padding: 6px 8px; border-radius: 8px; 
                                    display: inline-block; margin-bottom: 12px;">
                            ${escapeHtml(product.tag)}
                        </div>
                    ` : ''}
                    
                    <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                        <h4 style="margin: 0 0 8px 0; color: #333;">Описание:</h4>
                        <p style="margin: 0; color: #666; line-height: 1.5;">${escapeHtml(product.description)}</p>
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <h4 style="margin: 0 0 8px 0; color: #333;">🍶 Способ заваривания:</h4>
                        <ul style="margin: 0; color: #666; padding-left: 20px; line-height: 1.6;">
                            ${product.brewing.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <h4 style="margin: 0 0 8px 0; color: #333;">🌿 Полезные свойства:</h4>
                        <ul style="margin: 0; color: #666; padding-left: 20px; line-height: 1.6;">
                            ${product.benefits.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; 
                                padding-top: 10px; border-top: 1px solid #eee;">
                        <div style="font-size: 20px; font-weight: 700; color: #4CAF50;">
                            ${formatPrice(product.price)}
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="window.Cart.addToCart(${product.id})" 
                                    style="padding: 10px 14px; border-radius: 10px; 
                                           background: linear-gradient(135deg, #4CAF50, #2E7D32); 
                                           color: white; border: none; cursor: pointer;">
                                Добавить в корзину
                            </button>
                            <button onclick="window.Catalog.showCatalog()" 
                                    style="padding: 10px 14px; border-radius: 10px; 
                                           background: #eee; border: none; cursor: pointer;">
                                Каталог
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modal.setContent(html);
        modal.show();
    }
    
    // Закрытие каталога
    function closeCatalog() {
        UI.closeModal('catalog-modal');
    }
    
    // Закрытие деталей товара
    function closeProductDetail() {
        UI.closeModal('product-detail-modal');
    }
    
    // Инициализация
    function init() {
        initCache();
        log('Catalog initialized:', teaCatalog.length, 'products');
    }
    
    return {
        init,
        getProductById,
        getAllProducts,
        getPopularProducts,
        showCatalog,
        showProductDetail,
        closeCatalog,
        closeProductDetail
    };
})();