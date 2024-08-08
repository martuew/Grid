const gridContainer = document.getElementById('grid-container');
const clearButton = document.getElementById('clear-button');
const saveButton = document.getElementById('save-button');
const colorOptions = document.querySelectorAll('.color-option');
const sizeSlider = document.getElementById('size-slider');
const sizeInput = document.getElementById('size-input');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');

let currentColor = 'black'; // Цвет по умолчанию
let isMouseDown = false;
let currentButton = null;
let cellSize = parseInt(sizeSlider.value); // Изначальный размер клетки

// Установка начального выбранного цвета
document.querySelector('.color-option[data-color="black"]').classList.add('selected');

// Функция для создания сетки
function createGrid(size) {
    gridContainer.innerHTML = ''; // Очистить сетку
    const cellsPerRow = Math.floor(gridContainer.clientWidth / size);
    const cellsPerCol = Math.floor(gridContainer.clientHeight / size);
    const totalCells = cellsPerRow * cellsPerCol;

    for (let i = 0; i < cellsPerCol; i++) {
        for (let j = 0; j < cellsPerRow; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            gridContainer.appendChild(cell);
        }
    }

    gridContainer.style.setProperty('--cell-size', `${size}px`);
    updateInfo(cellsPerRow, cellsPerCol, totalCells); // Обновление информации
}

// Инициализация сетки с начальным размером
createGrid(cellSize);

// Обновление информации о размерах сетки и количестве клеток
function updateInfo(cellsPerRow, cellsPerCol, totalCells) {
    info.textContent = `Размер сетки: ${cellsPerRow}x${cellsPerCol} | Количество клеток: ${totalCells}`;
}

// Обработка выбора цвета
colorOptions.forEach(option => {
    option.addEventListener('click', function() {
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        currentColor = option.getAttribute('data-color');
    });
});

// Обработка нажатия кнопки мыши
gridContainer.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('cell')) {
        isMouseDown = true;
        currentButton = e.button; // 0 для левой кнопки, 2 для правой
        if (currentButton === 0) {
            e.target.style.backgroundColor = currentColor;
        } else if (currentButton === 2) {
            e.target.style.backgroundColor = 'white';
        }
        e.preventDefault();
    }
});

// Обработка отпускания кнопки мыши
document.addEventListener('mouseup', function() {
    isMouseDown = false;
    currentButton = null;
});

// Обработка наведения курсора на клетку при зажатой кнопке мыши
gridContainer.addEventListener('mouseover', function(e) {
    if (isMouseDown && e.target.classList.contains('cell')) {
        if (currentButton === 0) {
            e.target.style.backgroundColor = currentColor;
        } else if (currentButton === 2) {
            e.target.style.backgroundColor = 'white';
        }
    }
});

// Предотвращаем открытие контекстного меню при правом клике
gridContainer.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Обработка клика по кнопке "Clear"
clearButton.addEventListener('click', function() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.backgroundColor = 'white'; // Возвращаем клетки к исходному белому цвету
    });
});

// Обработка клика по кнопке "Save"
saveButton.addEventListener('click', function() {
    const cells = document.querySelectorAll('.cell');
    const size = parseInt(getComputedStyle(gridContainer).getPropertyValue('--cell-size'));
    const cellsPerRow = Math.floor(gridContainer.clientWidth / size);
    const cellsPerCol = Math.floor(gridContainer.clientHeight / size);

    // Установка размеров canvas
    canvas.width = gridContainer.clientWidth;
    canvas.height = gridContainer.clientHeight;

    cells.forEach((cell, index) => {
        const x = (index % cellsPerRow) * size;
        const y = Math.floor(index / cellsPerRow) * size;
        const color = window.getComputedStyle(cell).backgroundColor;
        
        // Рисуем клетки на canvas
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
    });

    // Создание ссылки для скачивания изображения
    const link = document.createElement('a');
    link.download = 'grid-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Обработка изменения размера клетки через ползунок
sizeSlider.addEventListener('input', function() {
    cellSize = parseInt(sizeSlider.value);
    sizeInput.value = cellSize; // Обновляем значение текстового поля
    createGrid(cellSize); // Перерисовываем сетку с новым размером клеток
});

// Обработка изменения размера клетки через текстовое поле
sizeInput.addEventListener('input', function() {
    let value = parseInt(sizeInput.value);
    if (value < 10) value = 10; // Минимально допустимый размер
    if (value > 50) value = 50; // Максимально допустимый размер
    sizeSlider.value = value;
    createGrid(value); // Перерисовываем сетку с новым размером клеток
});
