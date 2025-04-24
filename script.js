const canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

const socket = new WebSocket("http://localhost:8080");

socket.addEventListener("open", (e) => {
  socket.send("Hello server!");
});

socket.addEventListener("message", (e) => {
  console.log("Message from server ", e.data);
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
  ctx.fillStyle = "orange";
  ctx.clearRect(0, 0, 500, 400);
  ctx.fillRect(x, y, 20, 20);

  if (keyboard.ArrowUp) {
    y -= 3;
  } else if (keyboard.ArrowDown) {
    y += 3;
  } else if (keyboard.ArrowLeft) {
    x -= 3;
  } else if (keyboard.ArrowRight) {
    x += 3;
  }
}

draw();

setInterval(draw, 10);
