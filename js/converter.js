const API_KEY = "a89b9820fa15ed7858683e09"; // Register at exchangerate-api.com to get your own key
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

let rates = {}; // чтобы хранить курсы валют

async function fetchCurrencies() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.result === "error") {
      throw new Error(`API error: ${data['error-type']}`);
    }
    
    rates = data.conversion_rates; // сохраняем курсы валют
    
    populateSelect("currency-left");
    populateSelect("currency-right");
    
    calculate(); // сразу посчитаем после загрузки
  } catch (error) {
    console.error("Error loading exchange rates:", error);
  }
}

function populateSelect(selectId) {
  const selectElement = document.getElementById(selectId);
  selectElement.innerHTML = "";
  Object.keys(rates).forEach(currency => {
    const option = document.createElement("option");
    option.value = currency;
    option.textContent = currency; // можно добавить курс, если нужно
    selectElement.appendChild(option);
  });
}

function calculate() {
  const amountLeft = parseFloat(document.getElementById("amount-left").value);
  const currencyLeft = document.getElementById("currency-left").value;
  const currencyRight = document.getElementById("currency-right").value;
  const decimalPlaces = parseInt(document.getElementById("decimal-places").value, 10);
  
  if (!currencyLeft || !currencyRight || isNaN(amountLeft)) {
    return;
  }

  const rateLeft = rates[currencyLeft];
  const rateRight = rates[currencyRight];

  const amountRight = amountLeft * (rateRight / rateLeft);

  document.getElementById("amount-right").value = amountRight.toFixed(decimalPlaces);
}

// Слушаем изменения
document.getElementById("amount-left").addEventListener("input", calculate);
document.getElementById("currency-left").addEventListener("change", calculate);
document.getElementById("currency-right").addEventListener("change", calculate);
document.getElementById("decimal-places").addEventListener("change", calculate);

// Загружаем данные при старте
fetchCurrencies();

/* // Start when page loads
document.addEventListener('DOMContentLoaded', fetchCurrencies); */