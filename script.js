const canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let fruitPositon = { x: 0, y: 0 };
let fruitSize = { with: 20, height: 20 };

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
  fruitPositon = JSON.parse(e.data);
});

let x = 0,
  y = 0;

let keyboard = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

window.addEventListener("keydown", (e) => (keyboard[e.key] = true));
window.addEventListener("keyup", (e) => (keyboard[e.key] = false));

function draw() {
  ctx.clearRect(0, 0, 500, 400);
  drawFruit();
  drawPlayer();
  keyboardInput();
}

function drawPlayer() {
  ctx.fillStyle = "orange";
  ctx.fillRect(x, y, 20, 20);
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
  let data = { type: "playerPosition", x, y };

  if (keyboard.ArrowUp) {
    y -= 1;
  } else if (keyboard.ArrowDown) {
    y += 1;
  } else if (keyboard.ArrowLeft) {
    x -= 1;
  } else if (keyboard.ArrowRight) {
    x += 1;
  }

  if (socket.readyState === 1) {
    socket.send(JSON.stringify(data));
  }
}

setInterval(draw, 10);
