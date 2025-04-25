import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let canvasSize = { width: 0, height: 0 };
let points = 0;
let fruitPosition;
let playerPosition;

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const dt = JSON.parse(data);

    if (dt.type === "canvasSize") canvasSize = dt;

    if (dt.type === "playerPosition") {
      playerPosition = dt;
      colision();
    }
  });

  fruitPosition = randomFruit();
  ws.send(fruitPosition);
});

function randomFruit() {
  const x = Math.ceil(Math.random() * canvasSize.width);
  const y = Math.ceil(Math.random() * canvasSize.height);

  return JSON.stringify({ x, y });
}

function colision() {
  const fruit = JSON.parse(fruitPosition);

  const isColliding =
    playerPosition.x < fruit.x + 20 &&
    playerPosition.x + 20 > fruit.x &&
    playerPosition.y < fruit.y + 20 &&
    playerPosition.y + 20 > fruit.y;

  if (isColliding) {
    points++;
  }
}

console.log("Servidor WebSocket rodando em ws://localhost:8080");
