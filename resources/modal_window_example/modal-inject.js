document.addEventListener("DOMContentLoaded", () => {
  // 1. Добавляем стили
  const style = document.createElement("style");
  style.textContent = `
    .modal {
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0,0,0,0.5);
      justify-content: center;
      align-items: center;
      transition: opacity 0.3s ease;
      z-index: 10000;
    }

    .modal-box {
      background: white;
      width: 90%;
      max-width: 400px;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.3);
      transform: translateY(-20px);
      opacity: 0;
      transition: all 0.3s ease;
      padding: 20px;
    }

    .modal.show {
      display: flex;
    }

    .modal.show .modal-box {
      transform: translateY(0);
      opacity: 1;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .modal-close {
      cursor: pointer;
      font-size: 24px;
      line-height: 1;
    }
  `;
  document.head.appendChild(style);

  // 2. Добавляем HTML модалки
  const modalHTML = `
    <div id="modal" class="modal">
      <div class="modal-box">
        <div class="modal-header">
          <h2>Заголовок</h2>
          <span id="close-modal" class="modal-close">&times;</span>
        </div>
        <div class="modal-body">
          <p>Это модальное окно, добавленное без изменения исходных файлов.</p>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // 3. Добавляем кнопку для вызова
  const button = document.createElement("button");
  button.textContent = "Открыть модалку";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "10001";
  button.style.padding = "10px 15px";
  button.style.borderRadius = "8px";
  button.style.border = "none";
  button.style.background = "#007bff";
  button.style.color = "white";
  button.style.cursor = "pointer";
  document.body.appendChild(button);

  // 4. Обработка кликов
  const modal = document.getElementById("modal");
  const close = document.getElementById("close-modal");

  button.addEventListener("click", () => {
    modal.classList.add("show");
  });

  close.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });
});
