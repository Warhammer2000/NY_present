document.addEventListener('DOMContentLoaded', () => {
    // Галерея - Продвинутый слайдер
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    let currentIndex = 0;

    if (sliderWrapper && slides.length > 0) {
        const slideWidth = slides[0].offsetWidth; // Получаем реальную ширину слайда
        const gap = parseFloat(getComputedStyle(slides[0]).marginRight); // Получаем размер отступа

        function updateSlider() {
            sliderWrapper.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
        }

        prevButton.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            updateSlider();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = Math.min(slides.length - 1, currentIndex + 1);
            updateSlider();
        });

        // Начальное позиционирование слайдера
        updateSlider();
    }
    // Секретный раздел - Показ контента
    const passwordInput = document.getElementById('secret-code');
    const revealButton = document.getElementById('reveal-secret');
    const secretContent = document.getElementById('secret-content');

    if (revealButton) {
        revealButton.addEventListener('click', () => {
            if (passwordInput.value === "123") { // Замените на свой пароль
                secretContent.classList.remove('hidden');
                console.log("Remove hidden"); // Added console log for verification
            } else {
                alert('Код неверный!');
            }
        });
    }

    // Календарь воспоминаний - Простая реализация (можно заменить на библиотеку)
    const calendarSection = document.getElementById('calendar');
    const importantDatesList = document.querySelector('.important-dates-list');

    if (calendarSection && importantDatesList) {
        const importantDates = [
            { month: 1, day: 1, description: 'Новый год' },
            { month: 3, day: 8, description: 'Международный женский день' },
            { month: 4, day: 10, description: 'Важная дата' },
            { month: 6, day: 5, description: 'Еще одно событие' },
            { month: 8, day: 19, description: 'Памятный день' }
        ];

        importantDates.forEach(date => {
            const listItem = document.createElement('li');
            const dateIcon = document.createElement('div');
            dateIcon.classList.add('date-icon');
            dateIcon.innerHTML = '<i class="fas fa-heart"></i>'; // Пример иконки, можно заменить

            const dateText = document.createElement('div');
            dateText.classList.add('date-text');
            dateText.innerHTML = `<span>${date.day}.${date.month.toString().padStart(2, '0')}</span> - ${date.description}`;

            listItem.appendChild(dateIcon);
            listItem.appendChild(dateText);
            importantDatesList.appendChild(listItem);
        });
    }

    // Часовой пояс - Обновление времени
    function updateClock(elementId, timezone) {
        const element = document.getElementById(elementId);
        if (element) {
            const now = new Date();
            const options = { timeZone: timezone, hour: 'numeric', minute: 'numeric', second: 'numeric' };
            element.textContent = new Intl.DateTimeFormat('ru-RU', options).format(now);
        }
    }
    setInterval(() => updateClock('tashkent-clock', 'Asia/Tashkent'), 1000);
    setInterval(() => updateClock('korea-clock', 'Asia/Seoul'), 1000);

    // Плавная прокрутка к якорям
    document.querySelectorAll('.main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
});