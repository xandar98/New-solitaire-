const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.65;

const suits = ['♠', '♥', '♦', '♣'];
const colors = { '♠': 'black', '♣': 'black', '♥': 'red', '♦': 'red' };
let deck = [];
let tableau = [[], [], [], [], [], [], []];

let seconds = 0;
let moves = 0;

function updateHUD() {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById("timer").innerText = `⏱️ ${mins}:${secs.toString().padStart(2, "0")}`;
  document.getElementById("moves").innerText = `🎯 Moves: ${moves}`;
}

setInterval(() => {
  seconds++;
  updateHUD();
}, 1000);

function createDeck() {
  for (let suit of suits) {
    for (let value = 1; value <= 13; value++) {
      deck.push({
        suit,
        value,
        faceUp: false,
        color: colors[suit]
      });
    }
  }
  deck.sort(() => Math.random() - 0.5);
}

function dealCards() {
  for (let i = 0; i < tableau.length; i++) {
    for (let j = 0; j <= i; j++) {
      const card = deck.pop();
      card.faceUp = (j === i);
      tableau[i].push(card);
    }
  }
}

function drawTableau() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cardWidth = 60;
  const cardHeight = 80;
  const spacingX = 70;
  const spacingY = 25;
  const startX = 30;

  tableau.forEach((col, colIndex) => {
    col.forEach((card, rowIndex) => {
      const x = startX + colIndex * spacingX;
      const y = 50 + rowIndex * spacingY;

      ctx.fillStyle = card.faceUp ? "#fff" : "#444";
      ctx.fillRect(x, y, cardWidth, cardHeight);
      ctx.strokeStyle = "#000";
      ctx.strokeRect(x, y, cardWidth, cardHeight);

      if (card.faceUp) {
        ctx.fillStyle = card.color;
        ctx.font = "18px Arial";
        ctx.fillText(`${card.value}${card.suit}`, x + 10, y + 25);
      }
    });
  });
}

let draggingCard = null;

canvas.addEventListener("touchstart", function (e) {
  const touch = e.touches[0];
  const x = touch.clientX;
  const y = touch.clientY;

  const cardWidth = 60;
  const cardHeight = 80;
  const spacingX = 70;
  const spacingY = 25;
  const startX = 30;

  for (let col = 0; col < tableau.length; col++) {
    for (let row = 0; row < tableau[col].length; row++) {
      const card = tableau[col][row];
      const cx = startX + col * spacingX;
      const cy = 50 + row * spacingY;

      if (
        x >= cx &&
        x <= cx + cardWidth &&
        y >= cy &&
        y <= cy + cardHeight &&
        card.faceUp
      ) {
        draggingCard = { col, row };
        return;
      }
    }
  }
});

canvas.addEventListener("touchend", function (e) {
  if (draggingCard) {
    const { col, row } = draggingCard;

    const movedCards = tableau[col].splice(row);
    tableau[col].push(...movedCards);

    const lastCard = tableau[col][tableau[col].length - movedCards.length - 1];
    if (lastCard && !lastCard.faceUp) {
      lastCard.faceUp = true;
    }

    draggingCard = null;
    moves++;
    updateHUD();
    drawTableau();

    checkWin();
  }
});

function checkWin() {
  const allFaceUp = tableau.every(col => col.every(card => card.faceUp));
  if (allFaceUp) {
    setTimeout(() => {
      alert("🎉 You Win! Well played.");
    }, 500);
  }
}

createDeck();
dealCards();
drawTableau();
updateHUD();
