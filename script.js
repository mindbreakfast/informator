document.addEventListener('DOMContentLoaded', function() {
    initThemeSwitcher();
    initServices();
    initSearch();
    initCounter();
    initModal();
    initCounterAnimation();
    initScrollToTop();
});

// === ПЕРЕКЛЮЧАТЕЛЬ ЧЕТЫРЕХ ТЕМ ===
function initThemeSwitcher() {
    const themeSelect = document.getElementById('theme-select');
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    themeSelect.value = savedTheme;
    document.body.className = 'theme-' + savedTheme;
    
    themeSelect.addEventListener('change', function() {
        const theme = this.value;
        document.body.className = 'theme-' + theme;
        localStorage.setItem('theme', theme);
    });
}

// === УСЛУГИ С КНОПКАМИ ЗАКАЗАТЬ ===
function initServices() {
    const servicesGrid = document.getElementById('services-grid');
    const filterButtons = document.getElementById('filter-buttons');
    
    // Создаём кнопки фильтров
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = category.name;
        button.dataset.filter = category.filter;
        button.addEventListener('click', () => filterServices(category.filter, button));
        filterButtons.appendChild(button);
    });
    
    // Показываем все услуги
    renderServices(servicesData);
    
    function renderServices(services) {
        servicesGrid.innerHTML = '';
        
        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            
            // Определяем иконку для услуги
            const icon = getServiceIcon(service.categories);
            
            card.innerHTML = `
                <div class="service-image">
                    <i class="${icon}"></i>
                </div>
                <div class="service-info">
                    <h3>${service.name}</h3>
                    <div class="service-price-container">
                        <div class="price-text">
                            <div class="service-price">${service.price}</div>
                            <div class="service-price-per">${service.pricePer}</div>
                        </div>
                    </div>
                </div>
                <div class="service-card-footer">
                    <button class="card-order-btn" onclick="event.stopPropagation(); orderService('${service.name}')">
                        <i class="fas fa-shopping-cart"></i>
                        Заказать
                    </button>
                </div>
            `;
            card.addEventListener('click', () => openModal(service));
            servicesGrid.appendChild(card);
        });
    }
    
    function filterServices(filter, clickedButton) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        clickedButton.classList.add('active');
        
        if (filter === 'all') {
            renderServices(servicesData);
        } else {
            const filteredServices = servicesData.filter(service => 
                service.categories.some(cat => 
                    cat.toLowerCase().includes(filter.toLowerCase())
                )
            );
            renderServices(filteredServices);
        }
    }
    
    function getServiceIcon(categories) {
        if (categories.includes('telegram')) return 'fab fa-telegram';
        if (categories.includes('vk') || categories.includes('вконтакте')) return 'fab fa-vk';
        if (categories.includes('youtube')) return 'fab fa-youtube';
        if (categories.includes('tiktok')) return 'fab fa-tiktok';
        if (categories.includes('spotify')) return 'fab fa-spotify';
        if (categories.includes('reddit')) return 'fab fa-reddit';
        if (categories.includes('просмотры')) return 'fas fa-eye';
        if (categories.includes('подписчики')) return 'fas fa-users';
        if (categories.includes('лайки') || categories.includes('реакции')) return 'fas fa-heart';
        if (categories.includes('рассылка')) return 'fas fa-envelope';
        return 'fas fa-rocket';
    }
}

// === ПОИСК ===
function initSearch() {
    const searchInput = document.getElementById('service-search');
    
    const layoutMap = {
        'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з',
        '[': 'х', ']': 'ъ', 'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л',
        'l': 'д', ';': 'ж', "'": 'э', 'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь',
        ',': 'б', '.': 'ю', '/': '.', '`': 'ё'
    };
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            renderServices(servicesData);
            return;
        }
        
        let filteredServices = servicesData.filter(service => 
            service.name.toLowerCase().includes(searchTerm) ||
            service.categories.some(cat => cat.toLowerCase().includes(searchTerm))
        );
        
        if (filteredServices.length === 0) {
            const translatedTerm = searchTerm.split('').map(char => 
                layoutMap[char] || char
            ).join('');
            
            filteredServices = servicesData.filter(service => 
                service.name.toLowerCase().includes(translatedTerm) ||
                service.categories.some(cat => cat.toLowerCase().includes(translatedTerm))
            );
        }
        
        renderServices(filtereredServices);
    });
}

// === СЧЁТЧИК - УСКОРЕННАЯ ВЕРСИЯ ===
function initCounter() {
    const counterElement = document.getElementById('subs-counter');
    let currentCount = 1283417;
    
    animateCounter(1000000, currentCount, 1000); // Уменьшил время анимации с 1500 до 1000
    
    setInterval(() => {
        currentCount += Math.floor(Math.random() * 15) + 8; // Увеличил прирост с 3-8 до 8-23
        counterElement.textContent = formatNumber(currentCount);
    }, 2000); // Уменьшил интервал с 3000 до 2000
    
    function animateCounter(start, end, duration) {
        let startTime = null;
        
        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const increment = Math.floor((end - start) * (progress / duration));
            
            if (progress < duration) {
                counterElement.textContent = formatNumber(start + increment);
                requestAnimationFrame(updateCounter);
            } else {
                counterElement.textContent = formatNumber(end);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

// === АНИМАЦИЯ РОСТА ПОДПИСЧИКОВ ===
function initCounterAnimation() {
    const animationContainer = document.getElementById('counter-animation');
    
    function createFloatingElement() {
        const element = document.createElement('div');
        element.className = 'floating-element';
        
        // Случайный выбор иконки
        const icons = ['fas fa-user-plus', 'fas fa-heart', 'fas fa-eye', 'fas fa-share', 'fas fa-rocket'];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        
        element.innerHTML = `<i class="${randomIcon}"></i>`;
        
        // Случайная позиция
        const left = Math.random() * 100;
        element.style.left = left + '%';
        
        // Случайная задержка
        const delay = Math.random() * 2;
        element.style.animationDelay = delay + 's';
        
        animationContainer.appendChild(element);
        
        // Удаляем элемент после анимации
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 3000);
    }
    
    // Создаём новые элементы каждые 300ms
    setInterval(createFloatingElement, 300);
}

// === КНОПКА "ВВЕРХ" ===
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.style.display = 'none';
    document.body.appendChild(scrollBtn);
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
}

// === МОДАЛЬНОЕ ОКНО ===
function initModal() {
    const modal = document.getElementById('service-modal');
    const closeBtn = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    document.querySelector('.order-btn').addEventListener('click', function() {
        alert('Отлично! Свяжись со мной в Telegram: @informator_one для заказа услуги!');
        closeModal();
    });
}

function openModal(service) {
    const modal = document.getElementById('service-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');
    
    modalTitle.textContent = service.name;
    modalBody.innerHTML = service.description;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('service-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// === ФУНКЦИЯ ЗАКАЗА УСЛУГИ ===
function orderService(serviceName) {
    alert(`🎉 Отлично! Вы выбрали услугу: "${serviceName}"\n\n💬 Свяжитесь со мной в Telegram: @informator_one для оформления заказа!\n\n📞 Я отвечу в течение 5-10 минут!`);
}
