import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  let canvasSize = { width: 0, height: 0 };
  let fruitPosition;
  let points = 0;
  let playerPosition = { type: "playerPosition", x: 250, y: 200 };

  ws.on("message", (data) => {
    const dt = JSON.parse(data);

    if (dt.type === "canvasSize") canvasSize = dt;

    if (dt.type === "playerPosition") {
      playerPosition = dt;
      colision();
    }

    ws.send(fruitPosition);
    ws.send(JSON.stringify(playerPosition));
  });

  fruitPosition = randomFruit();

  function randomFruit() {
    const x = Math.ceil(Math.random() * canvasSize.width);
    const y = Math.ceil(Math.random() * canvasSize.height);

    return JSON.stringify({ type: "fruitPosition", x, y });
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
      fruitPosition = randomFruit();
    }
  }
});

console.log("Servidor WebSocket rodando em ws://localhost:8080");
