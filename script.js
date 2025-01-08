document.addEventListener("DOMContentLoaded", () => {
  // Initialize EmailJS FIRST
  emailjs.init('H27wIf2owHo98p_li');
  // --- Галерея - Продвинутый слайдер ---
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const slides = document.querySelectorAll(".slide");
  const prevButton = document.querySelector(".prev-slide");
  const nextButton = document.querySelector(".next-slide");
  let currentIndex = 0;

  if (sliderWrapper && slides.length > 0) {
    let slideWidth, gap;

    const updateSliderDimensions = () => {
      slideWidth = slides[0].getBoundingClientRect().width;
      gap = parseFloat(getComputedStyle(slides[0]).marginRight);
      updateSlider();
    };

    function updateSlider() {
      sliderWrapper.style.transform = `translateX(-${
        currentIndex * (slideWidth + gap)
      }px)`;
    }

    prevButton.addEventListener("click", () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateSlider();
    });

    nextButton.addEventListener("click", () => {
      currentIndex = Math.min(slides.length - 1, currentIndex + 1);
      updateSlider();
    });

    updateSliderDimensions();
    window.addEventListener("resize", updateSliderDimensions);
  }

  // --- Секретный раздел - Показ контента ---
  const revealSecretButton = document.getElementById("reveal-secret");
  const secretContent = document.getElementById("secret-content");
  const passwordInput = document.getElementById("secret-code");
  const videoWrapper = document.querySelector(".video-wrapper");
  const videoSlides = document.querySelectorAll(".video-slide");
  const prevVideoButton = document.querySelector(".prev-video");
  const nextVideoButton = document.querySelector(".next-video");
  let currentVideoIndex = 0;

  function showCurrentVideo() {
    videoWrapper.style.transform = `translateX(-${currentVideoIndex * 100}%)`;
  }

  prevVideoButton?.addEventListener("click", () => {
    currentVideoIndex = Math.max(0, currentVideoIndex - 1);
    showCurrentVideo();
  });

  nextVideoButton?.addEventListener("click", () => {
    currentVideoIndex = Math.min(videoSlides.length - 1, currentVideoIndex + 1);
    showCurrentVideo();
  });

  revealSecretButton?.addEventListener("click", function () {
    const password = passwordInput.value;
    // **ВАЖНО: В РЕАЛЬНОМ ПРИЛОЖЕНИИ ЗДЕСЬ ДОЛЖНА БЫТЬ ПРОВЕРКА ПАРОЛЯ НА СЕРВЕРЕ**
    if (password === "123") {
      document.querySelector(".password-input").style.display = "none";
      secretContent.classList.remove("hidden");
      showCurrentVideo();
    } else {
      alert("Неверный код доступа!");
    }
  });

  // --- Календарь воспоминаний ---
  const importantDatesList = document.querySelector(".important-dates-list");
  if (importantDatesList) {
    const importantDates = [
      { month: 1, day: 1, description: "Новый год" },
      { month: 3, day: 8, description: "Международный женский день" },
      { month: 4, day: 10, description: "Важная дата" },
      { month: 6, day: 5, description: "Еще одно событие" },
      { month: 8, day: 19, description: "Памятный день" },
    ];

    importantDates.forEach((date) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                <div class="date-icon"><i class="fas fa-heart"></i></div>
                <div class="date-text"><span>${date.day}.${date.month
        .toString()
        .padStart(2, "0")}</span> - ${date.description}</div>
            `;
      importantDatesList.appendChild(listItem);
    });
  }

  // --- Часовой пояс - Обновление времени ---
  const updateClock = (elementId, timezone) => {
    const element = document.getElementById(elementId);
    if (element) {
      const now = new Date();
      const options = {
        timeZone: timezone,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      element.textContent = new Intl.DateTimeFormat("ru-RU", options).format(
        now
      );
    }
  };
  setInterval(() => updateClock("tashkent-clock", "Asia/Tashkent"), 1000);
  setInterval(() => updateClock("korea-clock", "Asia/Seoul"), 1000);

  // --- Плавная прокрутка к якорям ---
  document.querySelectorAll(".main-nav a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  if (Plyr) {
    console.log("Player Start");
    Plyr.setup(".plyr");
  }

  const audioPlayer = document.querySelector(".custom-audio-player");
  const audio = audioPlayer.querySelector("audio");
  const playPauseButton = audioPlayer.querySelector(".play-pause-button");
  const playIcon = "fa-play"; // Только специфическая часть иконки
  const pauseIcon = "fa-pause"; // Только специфическая часть иконки
  const progressBar = audioPlayer.querySelector(".progress-bar");
  const progress = audioPlayer.querySelector(".progress");
  const currentTimeDisplay = audioPlayer.querySelector(".current-time");
  const durationDisplay = audioPlayer.querySelector(".duration");
  const volumeSlider = audioPlayer.querySelector(".volume-slider");

  // Загрузка метаданных аудио
  audio.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatTime(audio.duration);
  });

  // Play/Pause
  playPauseButton.addEventListener("click", () => {
    const icon = playPauseButton.querySelector("i");
    if (audio.paused) {
      audio.play();
      icon.classList.remove(playIcon);
      icon.classList.add(pauseIcon);
    } else {
      audio.pause();
      icon.classList.remove(pauseIcon);
      icon.classList.add(playIcon);
    }
  });

  // Обновление прогресса
  audio.addEventListener("timeupdate", () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
  });

  // Перемотка при клике на progress bar
  progressBar.addEventListener("click", (e) => {
    const progressBarWidth = progressBar.offsetWidth;
    const clickPosition = e.offsetX;
    const seekTime = (clickPosition / progressBarWidth) * audio.duration;
    audio.currentTime = seekTime;
  });

  // Регулировка громкости
  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
  });

  // Функция для форматирования времени
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }


  console.log('DOMContentLoaded event fired.');
 
  console.log('EmailJS initialized (from script.js)');

  // --- Отправка email (EmailJS) ---
  const sendButton = document.getElementById('sendButton');
  if (sendButton) {
    sendButton.addEventListener('click', function(e) {
      e.preventDefault();

      const myLetterContent = document.getElementById('myLetterContent').textContent;
      const herAnswer = document.getElementById('herAnswer').value;

      const templateParams = {
        my_letter: myLetterContent,
        reply_text: herAnswer
      };

      // Отправка email через EmailJS
      emailjs.send('service_uld33j6', 'template_b5r6osc', templateParams)
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
          alert('Сообщение успешно отправлено!');
        }, function(error) {
          console.error('FAILED...', error);
          alert('Ошибка отправки сообщения.');
        });
    });
  }

  
});