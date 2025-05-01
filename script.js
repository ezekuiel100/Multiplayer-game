const canvas = document.querySelector("canvas");
const player = document.querySelector("#player");
const points = document.querySelector("#points");
const stats = document.querySelector(".stats");

let ctx = canvas.getContext("2d");

const fruitSize = { width: 20, height: 20 };

let fruit;
let playerId;
let myPosition;
let players;

let keyboard = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

window.addEventListener("keydown", (e) => (keyboard[e.key] = true));
window.addEventListener("keyup", (e) => (keyboard[e.key] = false));

const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("open", () => {
  sendCanvasSize();
});

socket.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  handleMessage(msg);
});

function sendCanvasSize() {
  const canvasSize = {
    type: "canvasSize",
    width: canvas.width - fruitSize.width,
    height: canvas.height - fruitSize.height,
  };

  socket.send(JSON.stringify(canvasSize));
}

function handleMessage(msg) {
  if (msg.type === "fruitPosition") {
    fruit = msg;
  }

  if (msg.type === "playerId") {
    playerId = msg.playerId;
  }

  if (msg.type === "players") {
    myPosition = msg.players[playerId];
    players = msg.players;
  }
}

function handleMovement() {
  if (!myPosition) return;

  let oldX = myPosition.x;
  let oldY = myPosition.y;

  if (keyboard.ArrowUp) myPosition.y -= 2;
  if (keyboard.ArrowDown) myPosition.y += 2;
  if (keyboard.ArrowLeft) myPosition.x -= 2;
  if (keyboard.ArrowRight) myPosition.x += 2;

  if (oldX !== myPosition.x || oldY !== myPosition.y) {
    sendPlayerMovement();
  }
}

function sendPlayerMovement() {
  socket.send(
    JSON.stringify({
      type: "move",
      playerId,
      x: myPosition.x,
      y: myPosition.y,
    })
  );
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayers() {
  for (const id in players) {
    ctx.fillStyle = id === playerId ? "lightgray" : "orange";
    ctx.fillRect(players[id].x, players[id].y, 20, 20);
  }
}

function drawFruit() {
  if (!fruit) return;

  ctx.fillStyle = "green";
  ctx.fillRect(fruit.x, fruit.y, fruitSize.width, fruitSize.height);
}

function updateStats() {
  if (!players) return;

  stats.innerHTML = "";

  for (const id in players) {
    const div = document.createElement("div");
    div.textContent = `${id}  ${players[id].points} pts`;
    stats.appendChild(div);
  }
}

function gameLoop() {
  clearCanvas();

  if (socket.readyState === 1) {
    drawFruit();
    drawPlayers();
    handleMovement();
    updateStats();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
