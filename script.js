const cells = [...document.querySelectorAll(".cell")];
const status = document.querySelector("#status");
const resetButton = document.querySelector("#reset-game");
const winningLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const scores = { X: 0, O: 0, draws: 0 };
let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;

function setActivePlayer() {
  document.querySelectorAll(".score-card[data-player]").forEach((card) => {
    const active = card.dataset.player === currentPlayer && !gameOver;
    card.classList.toggle("active", active);
    card.querySelector(".turn-tag").textContent = active ? "YOUR TURN" : "WAITING";
  });
}

function checkWinner() { return winningLines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]); }

function finishGame(line, winner) {
  gameOver = true;
  line?.forEach((index) => cells[index].classList.add("winner"));
  if (winner) { scores[winner] += 1; status.textContent = `PLAYER ${winner} WINS`; }
  else { scores.draws += 1; status.textContent = "DRAW GAME"; }
  Object.entries(scores).forEach(([key, value]) => { document.querySelector(`[data-score="${key}"]`).textContent = value; });
  setActivePlayer();
}

function play(index) {
  if (board[index] || gameOver) return;
  board[index] = currentPlayer;
  const cell = cells[index];
  cell.textContent = currentPlayer === "X" ? "×" : "○";
  cell.classList.add(currentPlayer.toLowerCase()); cell.disabled = true;
  cell.setAttribute("aria-label", `Player ${currentPlayer} square ${index + 1}`);
  const line = checkWinner();
  if (line) finishGame(line, currentPlayer);
  else if (board.every(Boolean)) finishGame(null, null);
  else { currentPlayer = currentPlayer === "X" ? "O" : "X"; status.textContent = `PLAYER ${currentPlayer}`; setActivePlayer(); }
}

function resetBoard() {
  board = Array(9).fill(""); currentPlayer = "X"; gameOver = false; status.textContent = "PLAYER X";
  cells.forEach((cell, index) => { cell.textContent = ""; cell.disabled = false; cell.className = "cell"; cell.setAttribute("aria-label", `Empty square ${index + 1}`); });
  setActivePlayer();
}

cells.forEach((cell) => cell.addEventListener("click", () => play(Number(cell.dataset.index))));
resetButton.addEventListener("click", resetBoard);