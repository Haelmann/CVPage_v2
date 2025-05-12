// Получаем элементы DOM
const addTaskButton = document.getElementById("add-task-button");
const taskContainer = document.querySelector(".task-container");
const taskTemplate = document.getElementById("task-template");

// Загружаем сохранённые задачи из LocalStorage
let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Функция для отображения задач из LocalStorage
function loadTasks() {
  // Очистка списка задач
  document.querySelectorAll('.task-card').forEach(task => task.remove());
  savedTasks.forEach(task => createTask(
    task.title, 
    task.description, 
    task.timeStart, 
    task.timeFinish, 
    task.location,
    task.completed || false));
}

// Функция для создания задачи и добавления её на страницу
function createTask(title, description, timeStart, timeFinish, location, completed = false) {
  const taskClone = taskTemplate.content.cloneNode(true);
  const taskElement = taskClone.querySelector('.task-card');

  // Заполняем данные задачи
  taskElement.querySelector(".task-title").textContent = title;
  taskElement.querySelector(".task-description").textContent = description;
  taskElement.querySelector(".time-start").textContent = "Время начала: " + formatDate(timeStart);
  taskElement.querySelector(".time-finish").textContent = "Время окончания: " + formatDate(timeFinish);
  taskElement.querySelector(".location").textContent = "Локация: " + (location || "Не указано");

  // Обработчики событий
  taskElement.querySelector(".delete-task").addEventListener("click", function() {
    this.parentElement.remove();
    removeTaskFromLocalStorage(title);
    loadTasks();
  });

  //Проверка нажатости
  const checkbox = taskElement.querySelector('.completed-checkbox');
  if (completed) {
    taskElement.classList.add('completed');
    checkbox.checked = true;
  }

  //Через жопу конечно обновление ну да ладно
  checkbox.addEventListener('change', function() {
    taskElement.classList.toggle('completed');
    updateTaskInLocalStorage(title, { completed: this.checked });
  });

  //Экспорт в гугл календарь - триггер
  taskElement.querySelector('.export-to-google').addEventListener('click', function() {
    exportToGoogleCalendar(title, description, timeStart, timeFinish, location);
  });

  // Добавляем задачу в DOM
  const addButtonContainer = document.querySelector('.add-task-button-and-field');
  addButtonContainer.parentNode.insertBefore(taskClone, addButtonContainer);
}

//Обновление задачи в локальном хранилище
function updateTaskInLocalStorage(title, updates) {
  const taskIndex = savedTasks.findIndex(task => task.title === title);
  if (taskIndex !== -1) {
    savedTasks[taskIndex] = { ...savedTasks[taskIndex], ...updates };
    localStorage.setItem("tasks", JSON.stringify(savedTasks));
  }
}


// Функция для сохранения задачи в LocalStorage
function saveTaskToLocalStorage(title, description, timeStart, timeFinish, location) {
  // Проверки
  if (savedTasks.some(task => task.title === title)) {
    alert('Задача с таким названием уже существует!');
    return false;
  }

  const now = new Date();
  const startDate = new Date(timeStart);
  const endDate = new Date(timeFinish);

  if (startDate >= endDate) {
    alert('Время окончания должно быть позже времени начала!');
    return false;
  }

  if (startDate < now) {
    alert('Время начала не может быть в прошлом!');
    return false;
  }

  savedTasks.push({ 
    title, 
    description, 
    timeStart, 
    timeFinish, 
    location,
    completed: false
  });
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
  return true;
}

// Функция для экспорта задачи в гугл календарь
function exportToGoogleCalendar(title, description, start, end, location) {
  const encodeParam = (param) => encodeURIComponent(param || '');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const url = new URL('https://www.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', encodeParam(title));
  url.searchParams.append('details', encodeParam(description));
  url.searchParams.append('location', encodeParam(location));
  url.searchParams.append('dates', `${formatDate(start)}/${formatDate(end)}`);

  window.open(url.toString(), '_blank', 'noopener,noreferrer');
}

// Функция для удаления задачи из LocalStorage
function removeTaskFromLocalStorage(title) {
  savedTasks = savedTasks.filter(task => task.title !== title);
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

// Открытие модального окна по нажатию на кнопку
addTaskButton.addEventListener("click", () => {
  toggleModalWindow();
});

// Закрытие модального окна кнопкой отмены
document.getElementById("modal-window-cancel-button").addEventListener("click", (event) => {
  event.preventDefault();
  toggleModalWindow();
});

// Обработка сохранения задачи
document.getElementById("modal-window-task-creation").addEventListener("submit", (event) => {
  event.preventDefault();

  const modalWindow = event.target;
  const title = modalWindow.querySelector("#input-title").value.trim();
  const description = modalWindow.querySelector("#input-description").value.trim();
  const dateStart = modalWindow.querySelector("#date-time-start").value;
  const dateFinish = modalWindow.querySelector("#date-time-finish").value;
  const location = modalWindow.querySelector("#input-location").value.trim();

  if (title) {
    if (saveTaskToLocalStorage(title, description, dateStart, dateFinish, location)) {
      createTask(title, description, dateStart, dateFinish, location);
      modalWindow.reset(); //Сброс полей в дефолтные значения
      toggleModalWindow(); //Переключение окошечка
    }
  } else {
    alert('Пожалуйста, введите название задачи!'); //Ну хоть название введи, а?
  }
});

function toggleModalWindow() {
  const modalWindow = document.getElementById("modal-window-task-creation");  
  modalWindow.classList.toggle("visible");
  document.getElementById("blackscreen").classList.toggle("visible");

  // Reset form when opening
  if (modalWindow.classList.contains("visible")) {
    modalWindow.reset();
    // Set default dates
    const now = new Date();
    const startDate = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutes after start

    document.getElementById("date-time-start").value = formatDateTimeLocal(startDate);
    document.getElementById("date-time-finish").value = formatDateTimeLocal(endDate);
  }
}

function formatDateTimeLocal(date) {
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)) //Чёрная магия
    .toISOString()
    .slice(0, 16);
}

function formatDate(inputString) {
  const date = new Date(inputString);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return date.toLocaleDateString('ru-RU', options);
}

// Загружаем задачи при загрузке страницы
document.addEventListener('DOMContentLoaded', loadTasks);