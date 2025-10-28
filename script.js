// Бро, тут ВСЯ магия! Графики, анимации, всё что душе угодно!

document.addEventListener('DOMContentLoaded', function() {
    initThemeSwitcher();
    initServices();
    initSearch();
    initCounter();
    initModal();
    initGrowthChart();
});

// === ПЕРЕКЛЮЧАТЕЛЬ ТЕМ ===
function initThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeText = document.querySelector('.theme-text');
    const themeIcon = document.querySelector('.theme-icon i');
    
    const savedTheme = localStorage.getItem('theme') || 'matrix';
    if (savedTheme === 'crystal') {
        document.body.classList.remove('theme-matrix');
        document.body.classList.add('theme-crystal');
        themeToggle.checked = true;
        themeText.textContent = 'Матричная тема';
        themeIcon.className = 'fas fa-matrix';
    }
    
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.remove('theme-matrix');
            document.body.classList.add('theme-crystal');
            themeText.textContent = 'Матричная тема';
            themeIcon.className = 'fas fa-matrix';
            localStorage.setItem('theme', 'crystal');
        } else {
            document.body.classList.remove('theme-crystal');
            document.body.classList.add('theme-matrix');
            themeText.textContent = 'Кристальная тема';
            themeIcon.className = 'fas fa-gem';
            localStorage.setItem('theme', 'matrix');
        }
    });
}

// === УСЛУГИ С КАРТИНКАМИ ===
function initServices() {
    const servicesGrid = document.getElementById('services-grid');
    const filterButtons = document.getElementById('filter-buttons');
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = category.name;
        button.dataset.filter = category.filter;
        button.addEventListener('click', () => filterServices(category.filter, button));
        filterButtons.appendChild(button);
    });
    
    renderServices(servicesData);
    
    function renderServices(services) {
        servicesGrid.innerHTML = '';
        
        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <div class="service-image">
                    <img src="${service.image}" alt="${service.name}" onerror="this.style.display='none'; this.parentNode.innerHTML='<i class=\"fas fa-users\"></i>
                                    <div class="service-image">
                    <img src="${service.image}" alt="${service.name}" onerror="this.style.display='none'; this.parentNode.innerHTML='<i class=\"fas fa-users\"></i>'">
                </div>
                <div class="service-info">
                    <h3>${service.name}</h3>
                    <div class="service-price">${service.price}</div>
                    <div class="service-price-per">${service.pricePer}</div>
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
}

// === УМНЫЙ ПОИСК С РАСКЛАДКАМИ ===
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

// === СУМАСШЕДШИЙ СЧЁТЧИК С ГРАФИКОМ ===
function initCounter() {
    const counterElement = document.getElementById('subs-counter');
    let currentCount = 1283417;
    
    animateCounter(0, currentCount, 2000);
    
    setInterval(() => {
        currentCount += Math.floor(Math.random() * 15) + 5;
        counterElement.textContent = formatNumber(currentCount);
    }, 2000);
    
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

// === АНИМИРОВАННЫЙ ГРАФИК РОСТА ===
function initGrowthChart() {
    const canvas = document.getElementById('growth-chart');
    const ctx = canvas.getContext('2d');
    
    let points = [];
    let animationFrame;
    let time = 0;
    
    // Инициализируем начальные точки
    for (let i = 0; i <= 30; i++) {
        points.push({
            x: i * (canvas.width / 30),
            y: canvas.height - Math.random() * 20
        });
    }
    
    function drawChart() {
        // Очищаем canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем сетку
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 2]);
        
        for (let i = 0; i <= 5; i++) {
            const y = i * (canvas.height / 5);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
        
        // Рисуем линию графика
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
        gradient.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--accent-color') + '40');
        gradient.addColorStop(1, 'transparent');
        
        ctx.lineTo(points[points.length - 1].x, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Анимируем точки - двигаем влево и добавляем новые
        time++;
        if (time % 2 === 0) {
            points.shift();
            
            const lastPoint = points[points.length - 1];
            points.push({
                x: lastPoint.x + (canvas.width / 30),
                y: Math.max(10, Math.min(canvas.height - 10, lastPoint.y + (Math.random() - 0.5) * 15))
            });
        }
        
        animationFrame = requestAnimationFrame(drawChart);
    }
    
    drawChart();
}

// === КРУТОЕ МОДАЛЬНОЕ ОКНО ===
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
    
    // Кнопка заказа в модалке
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
    
    // Добавляем плавное появление контента
    setTimeout(() => {
        modalBody.style.opacity = '1';
        modalBody.style.transform = 'translateY(0)';
    }, 100);
}

function closeModal() {
    const modal = document.getElementById('service-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.style.opacity = '0';
    modalBody.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Функция для рендера услуг (нужна для поиска и фильтров)
function renderServices(services) {
    const servicesGrid = document.getElementById('services-grid');
    servicesGrid.innerHTML = '';
    
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <div class="service-image">
                <img src="${service.image}" alt="${service.name}" onerror="this.style.display='none'; this.parentNode.innerHTML='<i class=\"fas fa-users\"></i>'">
            </div>
            <div class="service-info">
                <h3>${service.name}</h3>
                <div class="service-price">${service.price}</div>
                <div class="service-price-per">${service.pricePer}</div>
            </div>
        `;
        card.addEventListener('click', () => openModal(service));
        servicesGrid.appendChild(card);
    });
}

// Плавная прокрутка для всех якорей
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
