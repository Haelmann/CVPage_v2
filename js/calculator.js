const display_input = document.getElementById("display-input");
display_input.value = "0";
let memory_1 = 0;
let memory_operation = '';
let isNewInput = true; // <--- флаг, что это начало нового ввода

// === ЦИФРЫ ===
document.querySelectorAll('.digit').forEach(button => {
  button.addEventListener('click', (event) => {
    const digit = event.target.textContent;

    if (isNewInput || display_input.value === "0") {
      display_input.value = digit;
    } else {
      display_input.value += digit;
    }

    isNewInput = false;
    updateDebugWindows();
  });
});

// === ТОЧКА ===
document.querySelector('.dot').addEventListener('click', () => {
  if (isNewInput) {
    display_input.value = "0.";
    isNewInput = false;
  } else if (!display_input.value.includes(".")) {
    display_input.value += ".";
  }
  updateDebugWindows();
});

// === ОПЕРАЦИИ ===
document.querySelectorAll(".operation").forEach(operator => {
  operator.addEventListener("click", (event) => {
    const operation = event.target.textContent;

    if (!memory_operation || memory_1 === 0) {
      memory_1 = parseFloat(display_input.value);
      memory_operation = operation;
      display_input.value = "0";
      isNewInput = true;
      updateDebugWindows();
      return;
    }

    calculate(memory_operation);
    memory_operation = operation;
    display_input.value = "0";
    isNewInput = true;
    updateDebugWindows();
  });
});

// === ВЫЧИСЛЕНИЕ ===
document.getElementById("equal-button").addEventListener('click', () => {
  if (memory_operation) {
    calculate(memory_operation);
    display_input.value = memory_1;
    memory_operation = '';
    isNewInput = true;
    updateDebugWindows();
  }
});

// === ФУНКЦИЯ ВЫЧИСЛЕНИЯ ===
const calculate = (operation) => {
  const currentValue = parseFloat(display_input.value);

  switch (operation) {
    case '+': memory_1 += currentValue; break;
    case '-': memory_1 -= currentValue; break;
    case '*': memory_1 *= currentValue; break;
    case '/': memory_1 /= currentValue; break;
  }
};

// === ОЧИСТКА ===
document.getElementById("clear-button").addEventListener('click', () => {
  memory_1 = 0;
  memory_operation = '';
  display_input.value = "0";
  isNewInput = true;
  updateDebugWindows();
});

// === ОКНА ОТЛАДКИ ===
function updateDebugWindows() {
  document.getElementById("mem1debugwindow").textContent = memory_1;
  document.getElementById("operatordebugwindow").textContent = memory_operation;
  document.getElementById("displaydebugwindow").textContent = display_input.value;
}

// === ОБРАБОТКА НАЖАТИЙ КЛАВИШ ===
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (!isNaN(key)) {
    // Цифра
    if (isNewInput || display_input.value === "0") {
      display_input.value = key;
    } else {
      display_input.value += key;
    }
    isNewInput = false;
  }

  if (key === ".") {
    if (isNewInput) {
      display_input.value = "0.";
      isNewInput = false;
    } else if (!display_input.value.includes(".")) {
      display_input.value += ".";
    }
  }

  if (["+", "-", "*", "/"].includes(key)) {
    document.querySelectorAll(".operation").forEach(button => {
      if (button.textContent === key) {
        button.click();
      }
    });
  }

  if (key === "=" || key === "Enter") {
    document.getElementById("equal-button").click();
  }

  if (key === "Escape") {
    document.getElementById("clear-button").click();
  }

  updateDebugWindows();
});