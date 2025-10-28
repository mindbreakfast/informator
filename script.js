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
