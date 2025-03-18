const cells = [...document.querySelectorAll(".cell")];
const score = JSON.parse(localStorage.getItem("score"));
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];
const winnerText = document.getElementById("winnerText");
const modal = document.getElementById("victory-window");
const crossScore = document.getElementById("crossScore");
const circleScore = document.getElementById("circleScore");
const closeModal = document.getElementById("closeModal");
const localStorageClear = document.getElementById("clearLocalScore");
const myStorage = window.localStorage;

if (!myStorage.getItem("score")) {
  myStorage.setItem("score", JSON.stringify({ crossScore: 0, circleScore: 0 }));
}

crossScore.textContent = score.crossScore;
circleScore.textContent = score.circleScore;



console.log(cells);

let currentPlayer = "❌"
let circle = "⭕"

cells.forEach(cell => {
  cell.addEventListener("click", function () {
    if (!cell.textContent) {
      cell.textContent = currentPlayer

      if (checkWinner()) {
        updateScore();
        console.log(modal)
        showModal(`🎉 Победил ${currentPlayer}`);
        return
      }

      currentPlayer = currentPlayer === "❌" ? "⭕" : "❌";
    }
  })
})

function checkWinner() {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent;
  });
}

function showModal(message) {
  winnerText.textContent = message;
  modal.style.display = "flex";
}

function resetGame() {
  console.log('game reset')
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = "❌";
}

function updateScore() {
  if (currentPlayer === "❌") {
    score.crossScore++;
    crossScore.textContent = score.crossScore;
  } else {
    score.circleScore++
    circleScore.textContent = score.circleScore;
  }
  myStorage.setItem("score", JSON.stringify(score));
}

document.getElementById("reset-button").addEventListener("click", resetGame);
localStorageClear.addEventListener("click", () => {myStorage.clear(); document.location.reload()})
closeModal.addEventListener("click", () => { modal.style.display = "none"; resetGame() })
