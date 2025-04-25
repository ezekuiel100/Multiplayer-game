const canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let fruitPositon = { x: 0, y: 0 };
let fruitSize = { with: 20, height: 20 };

let playerPosition;

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

setInterval(draw, 10);
