function toggleModalWindow() {
  document.getElementById("modal-window").classList.toggle("visible");
  document.getElementById("blackscreen").classList.toggle("visible");
}

document.getElementById("contact-me").addEventListener("click", toggleModalWindow);
document.getElementById("close-modal").addEventListener("click", toggleModalWindow);
