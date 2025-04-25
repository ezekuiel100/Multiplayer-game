const canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

const player = document.querySelector("#player");
const points = document.querySelector("#points");

let fruitPositon = { x: 0, y: 0 };
let fruitSize = { with: 20, height: 20 };

let playerPosition;
let pt = 0;
let start = false;

const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("open", (e) => {
  const canvasSize = {
    type: "canvasSize",
    width: canvas.width - fruitSize.with,
    height: canvas.height - fruitSize.height,
  };

  socket.send(JSON.stringify(canvasSize));
});

socket.addEventListener("message", (e) => {
  const data = JSON.parse(e.data);

  if (data.type === "fruitPosition") {
    fruitPositon = data;
  }

  if (data.type === "playerPosition") {
    playerPosition = data;
  }

  if (data.type === "stats") {
    if (pt != data.points) {
      handleStats(data);
      pt++;
    }

    if (!start) {
      handleStats(data);
      start = true;
    }
  }
});

let keyboard = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

window.addEventListener("keydown", (e) => (keyboard[e.key] = true));
window.addEventListener("keyup", (e) => (keyboard[e.key] = false));

function draw() {
  if (socket.readyState === 1) {
    ctx.clearRect(0, 0, 500, 400);
    drawFruit();
    drawPlayer();
    keyboardInput();
  }
}

function drawPlayer() {
  ctx.fillStyle = "orange";
  ctx.fillRect(playerPosition.x, playerPosition.y, 20, 20);
}

function drawFruit() {
  ctx.fillStyle = "green";
  ctx.fillRect(
    fruitPositon.x,
    fruitPositon.y,
    fruitSize.with,
    fruitSize.height
  );
}

function keyboardInput() {
  if (keyboard.ArrowUp) {
    playerPosition.y -= 1;
  } else if (keyboard.ArrowDown) {
    playerPosition.y += 1;
  } else if (keyboard.ArrowLeft) {
    playerPosition.x -= 1;
  } else if (keyboard.ArrowRight) {
    playerPosition.x += 1;
  }

  socket.send(JSON.stringify(playerPosition));
}

function handleStats(data) {
  console.log(data);
  player.innerHTML = data.playerId;
  points.innerHTML = data.points;
}

setInterval(draw, 10);
