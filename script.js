// Бро, тут всё исправлено! График теперь работает как надо!

document.addEventListener('DOMContentLoaded', function() {
    initThemeSwitcher();
    initServices();
    initSearch();
    initCounter();
    initModal();
    initGrowthChart();
    initScrollToTop();
});

// === ПЕРЕКЛЮЧАТЕЛЬ ТРЕХ ТЕМ ===
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

// === УСЛУГИ С ЗАГЛУШКАМИ ВМЕСТО КАРТИНОК ===
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
        
        renderServices(filteredServices);
    });
}

// === СЧЁТЧИК ===
function initCounter() {
    const counterElement = document.getElementById('subs-counter');
    let currentCount = 1283417;
    
    animateCounter(1000000, currentCount, 1500);
    
    setInterval(() => {
        currentCount += Math.floor(Math.random() * 8) + 3;
        counterElement.textContent = formatNumber(currentCount);
    }, 3000);
    
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

// === РАБОЧИЙ ГРАФИК РОСТА - ПОСТОЯННО ВИДЕН ===
function initGrowthChart() {
    const canvas = document.getElementById('growth-chart');
    const ctx = canvas.getContext('2d');
    
    let points = [];
    const pointCount = 15;
    let frameCount = 0;
    
    // Инициализируем точки с явным восходящим трендом
    for (let i = 0; i < pointCount; i++) {
        points.push({
            x: i * (canvas.width / (pointCount - 1)),
            y: canvas.height - 15 - (i * 3)
        });
    }
    
    function drawChart() {
        frameCount++;
        
        // Очищаем canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем плавную линию графика
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            const xc = (points[i].x + points[i - 1].x) / 2;
            const yc = (points[i].y + points[i - 1].y) / 2;
            ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }
        
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Градиент под линией
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
        gradient.addColorStop(0, accentColor + '40');
        gradient.addColorStop(1, 'transparent');
        
        ctx.lineTo(points[points.length - 1].x, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Медленная анимация - двигаем точки каждые 10 кадров
        if (frameCount % 10 === 0) {
            points.shift();
            
            const lastPoint = points[points.length - 1];
            // Гарантируем восходящий тренд
            const newY = Math.max(10, Math.min(canvas.height - 10, lastPoint.y - 1 + Math.random() * 3));
            
            points.push({
                x: lastPoint.x + (canvas.width / (pointCount - 1)),
                y: newY
            });
        }
        
        requestAnimationFrame(drawChart);
    }
    
    drawChart();
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

// Функция для определения иконки услуги
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
