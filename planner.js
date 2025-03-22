// Получаем элементы DOM
const addTaskButton = document.getElementById("add-task-button");
const taskContainer = document.querySelector(".task-container");
const taskTemplate = document.getElementById("task-template");

// Загружаем сохранённые задачи из LocalStorage
const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Функция для отображения задач из LocalStorage
function loadTasks() {
  savedTasks.forEach(task => createTask(task.title, task.description, task.timeStart, task.timeFinish, task.location));
}

// Функция для создания задачи и добавления её на страницу
function createTask(title, description, timeStart, timeFinish, location) {
  const taskClone = taskTemplate.content.cloneNode(true);

  // Заполняем данные задачи
  taskClone.querySelector(".task-title").textContent = title;
  taskClone.querySelector(".task-description").textContent = description;
  taskClone.querySelector(".time-start").textContent = formatDate(timeStart);
  taskClone.querySelector(".time-finish").textContent = formatDate(timeFinish);
  taskClone.querySelector(".location").textContent = location;

  // Добавляем обработчик для удаления задачи
  taskClone.querySelector(".delete-task").addEventListener("click", function () {
    const taskElement = this.parentElement;
    taskElement.remove();
    removeTaskFromLocalStorage(title); // Удаляем задачу из LocalStorage
  });

  // Добавляем задачу в DOM
  taskContainer.appendChild(taskClone);
}

// Функция для сохранения задачи в LocalStorage
function saveTaskToLocalStorage(title, description, timeStart, timeFinish, location) {
  savedTasks.push({ title, description, timeStart, timeFinish, location });
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

// Функция для удаления задачи из LocalStorage
function removeTaskFromLocalStorage(title) {
  const taskIndex = savedTasks.findIndex(task => task.title === title);
  if (taskIndex !== -1) {
    savedTasks.splice(taskIndex, 1); // Удаляем из массива
    localStorage.setItem("tasks", JSON.stringify(savedTasks)); // Обновляем LocalStorage
  }
}

// Открытие модального окна по нажатию на кнопку
addTaskButton.addEventListener("click", () => {
  toogleModalWindow();
});

document.getElementById("modal-window-save-button").addEventListener("click", (event) =>{
  event.preventDefault;
  event.stopPropagation;
  const modalWindow = document.getElementById("modal-window-task-creation");
  const title = modalWindow.querySelector("#input-title").value
  const description = modalWindow.querySelector("#input-description").value
  const dateStart = modalWindow.querySelector("#date-time-start").value
  const dateFinish = modalWindow.querySelector("#date-time-finish").value
  const location = modalWindow.querySelector("#input-location").value
  if (title){
    saveTaskToLocalStorage(title, description, dateStart, dateFinish, location);
  }
  toogleModalWindow();
})

document.getElementById("test-modal").addEventListener("click", toogleModalWindow)

function toogleModalWindow() {
  const modalWindow = document.getElementById("modal-window-task-creation");
  modalWindow.classList.toggle("visible");
  modalWindow.reset();
  document.getElementById("blackscreen").classList.toggle("visible");
}

function formatDate(inputString) {
  const date = new Date(inputString); 
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options); // 
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${formattedDate}, ${hours}:${minutes}`;
}

// Загружаем задачи при загрузке страницы
loadTasks();