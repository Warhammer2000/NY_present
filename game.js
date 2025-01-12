document.addEventListener("DOMContentLoaded", () => {
    const comicCanvas = document.getElementById("comicCanvas");
    const ctx = comicCanvas.getContext("2d");
    const backgroundOptions = document.querySelectorAll(".background-options img");
    const characterOptions = document.querySelectorAll(".character-options img");
    const addSpeechBubbleButton = document.getElementById("add-speech-bubble");
    const clearCanvasButton = document.getElementById("clear-canvas");
    const saveComicButton = document.getElementById("save-comic");
    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");
    const addPageButton = document.getElementById("add-page");
    const pageNumberDisplay = document.getElementById("page-number");
  
    let comicPages = [{ background: null, elements: [] }]; // Массив страниц комикса
    let currentPageIndex = 0;
  
    let draggingElement = null;
    let offsetX, offsetY;
  
    // === Функции управления страницами ===
    function updatePageDisplay() {
      pageNumberDisplay.textContent = `Страница ${currentPageIndex + 1} из ${comicPages.length}`;
      prevPageButton.disabled = currentPageIndex === 0;
      nextPageButton.disabled = currentPageIndex === comicPages.length - 1;
    }
  
    function loadPage() {
      const currentPage = comicPages[currentPageIndex];
      currentBackground = currentPage.background ? new Image() : null;
      if (currentBackground) {
        currentBackground.src = currentPage.background;
        currentBackground.onload = redrawCanvas;
      } else {
        redrawCanvas(); // Если фона нет, просто перерисовываем элементы
      }
    }
  
    function addPage() {
      comicPages.push({ background: null, elements: [] });
      currentPageIndex = comicPages.length - 1;
      loadPage();
      updatePageDisplay();
    }
  
    function prevPage() {
      if (currentPageIndex > 0) {
        currentPageIndex--;
        loadPage();
        updatePageDisplay();
      }
    }
  
    function nextPage() {
      if (currentPageIndex < comicPages.length - 1) {
        currentPageIndex++;
        loadPage();
        updatePageDisplay();
      }
    }
  
    // === Функция перерисовки холста ===
    function redrawCanvas() {
      ctx.clearRect(0, 0, comicCanvas.width, comicCanvas.height);
      const currentPage = comicPages[currentPageIndex];
      if (currentPage.background) {
        ctx.drawImage(
          currentBackground,
          0,
          0,
          comicCanvas.width,
          comicCanvas.height
        );
      }
  
      currentPage.elements.forEach((element) => {
        if (element.type === "image") {
          ctx.drawImage(
            element.image,
            element.x,
            element.y,
            element.width,
            element.height
          );
        } else if (element.type === "speechBubble") {
          ctx.fillStyle = "white";
          ctx.strokeStyle = "black";
          ctx.fillRect(element.x, element.y, element.width, element.height);
          ctx.strokeRect(element.x, element.y, element.width, element.height);
          ctx.fillStyle = "black";
          ctx.font = "16px sans-serif";
  
          // Многострочный текст
          const words = element.text.split(" ");
          let line = "";
          let y = element.y + 20;
          const lineHeight = 20;
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            const metrics = ctx.measureText(testLine);
            const textWidth = metrics.width;
            if (textWidth > element.width - 20 && n > 0) {
              ctx.fillText(line, element.x + 10, y);
              line = words[n] + " ";
              y += lineHeight;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, element.x + 10, y);
        }
      });
    }
  
    // === Обработчики событий ===
    backgroundOptions.forEach((option) => {
      option.addEventListener("click", function () {
        const currentPage = comicPages[currentPageIndex];
        currentPage.background = this.dataset.background;
        currentBackground = new Image();
        currentBackground.src = currentPage.background;
        currentBackground.onload = redrawCanvas;
      });
    });
  
    characterOptions.forEach((option) => {
      option.addEventListener("click", function () {
        const img = new Image();
        img.src = this.dataset.character;
        img.onload = () => {
          const newElement = {
            type: "image",
            image: img,
            x: 50,
            y: 50,
            width: img.width,
            height: img.height,
            isDragging: false,
          };
          comicPages[currentPageIndex].elements.push(newElement);
          redrawCanvas();
        };
      });
    });
  
    addSpeechBubbleButton.addEventListener("click", () => {
      const newElement = {
        type: "speechBubble",
        x: 100,
        y: 100,
        width: 150,
        height: 80,
        text: "Введите ваш текст",
      };
      comicPages[currentPageIndex].elements.push(newElement);
      redrawCanvas();
    });
  
    clearCanvasButton.addEventListener("click", () => {
      comicPages[currentPageIndex].elements = [];
      loadPage(); // Используем loadPage, чтобы обновить и фон, если он есть
    });
  
    saveComicButton.addEventListener("click", () => {
      // Сохранение каждой страницы как отдельное изображение
      comicPages.forEach((page, index) => {
        // Временно устанавливаем фон и элементы текущей страницы
        const tempBackground = currentBackground;
        const tempElements = comicElements;
        currentBackground = page.background ? new Image() : null;
        if (currentBackground) currentBackground.src = page.background;
        comicElements = page.elements;
        redrawCanvas(); // Рисуем текущую страницу
  
        const dataURL = comicCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `comic_page_${index + 1}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        // Восстанавливаем фон и элементы
        currentBackground = tempBackground;
        comicElements = tempElements;
      });
      // После сохранения последней страницы, можно перерисовать текущую
      if (comicPages.length > 0) {
        loadPage();
      }
    });
  
    // === Логика перетаскивания ===
    comicCanvas.addEventListener("mousedown", (e) => {
      const rect = comicCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const elements = comicPages[currentPageIndex].elements;
  
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        if (
          mouseX >= element.x &&
          mouseX <= element.x + element.width &&
          mouseY >= element.y &&
          mouseY <= element.y + element.height
        ) {
          draggingElement = element;
          offsetX = mouseX - element.x;
          offsetY = mouseY - element.y;
          break;
        }
      }
    });
  
    comicCanvas.addEventListener("mousemove", (e) => {
      if (!draggingElement) return;
      const rect = comicCanvas.getBoundingClientRect();
      draggingElement.x = e.clientX - rect.left - offsetX;
      draggingElement.y = e.clientY - rect.top - offsetY;
      redrawCanvas();
    });
  
    comicCanvas.addEventListener("mouseup", () => {
      draggingElement = null;
    });
  
    comicCanvas.addEventListener("mouseout", () => {
      draggingElement = null;
    });
  
    // === Редактирование текста в речевом пузыре ===
    comicCanvas.addEventListener("dblclick", (e) => {
      const rect = comicCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const elements = comicPages[currentPageIndex].elements;
  
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        if (element.type === "speechBubble" &&
            mouseX >= element.x &&
            mouseX <= element.x + element.width &&
            mouseY >= element.y &&
            mouseY <= element.y + element.height) {
          // Создаем поле ввода для редактирования текста
          const textarea = document.createElement('textarea');
          textarea.value = element.text;
          textarea.style.position = 'absolute';
          textarea.style.left = `${element.x + rect.left}px`;
          textarea.style.top = `${element.y + rect.top}px`;
          textarea.style.width = `${element.width}px`;
          textarea.style.height = `${element.height}px`;
          document.body.appendChild(textarea);
          textarea.focus();
  
          textarea.addEventListener('blur', () => {
            element.text = textarea.value;
            document.body.removeChild(textarea);
            redrawCanvas();
          });
          break;
        }
      }
    });
  
    // === Инициализация ===
    loadPage();
    updatePageDisplay();
  
    // === Привязка обработчиков к кнопкам управления страницами ===
    prevPageButton.addEventListener("click", prevPage);
    nextPageButton.addEventListener("click", nextPage);
    addPageButton.addEventListener("click", addPage);
  });