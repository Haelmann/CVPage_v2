document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const open = document.getElementById("open-modal");
  const close = document.getElementById("close-modal");

  // Функция открытия
  const openModal = () => {
    modal.classList.add("visible");
  };

  // Функция закрытия
  const closeModal = () => {
    modal.classList.remove("visible");
    // Ждём завершения анимации (0.3s = 300ms)
    setTimeout(() => {
      modal.style.visibility = "hidden";
      modal.style.pointerEvents = "none";
    }, 300);
  };

  // Открытие
  open.addEventListener("click", () => {
    modal.style.visibility = "visible";
    modal.style.pointerEvents = "auto";
    requestAnimationFrame(() => modal.classList.add("visible"));
  });

  // Закрытие по крестику
  close.addEventListener("click", closeModal);

  // Закрытие при клике вне окна
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
});
