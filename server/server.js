import { WebSocket, WebSocketServer } from "ws";
import { nanoid } from "nanoid";

const wss = new WebSocketServer({ port: 8080 });
let fruitPosition;
let canvasSize = { width: 0, height: 0 };
let players = {};

wss.on("connection", (ws) => {
  let playerId = nanoid();
  ws.send(JSON.stringify({ type: "playerId", playerId }));

  players[playerId] = { points: 0, x: 10, y: 10 };

  ws.on("message", (msg) => {
    const dt = JSON.parse(msg);

    if (dt.type === "canvasSize" && !canvasSize.width) canvasSize = dt;

    if (!fruitPosition) {
      fruitPosition = randomFruit();
    }

    ws.send(JSON.stringify(fruitPosition));

    if (dt.type === "move") {
      players[playerId].x = dt.x;
      players[playerId].y = dt.y;

      checkCollision();
      broadcastPlayers();
    }
  });

  function broadcastPlayers() {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "players", players }));
      }
    });
  }

  broadcastPlayers();

  function randomFruit() {
    const x = Math.ceil(Math.random() * canvasSize.width);
    const y = Math.ceil(Math.random() * canvasSize.height);

    return { type: "fruitPosition", x, y };
  }

  function checkCollision() {
    const fruit = fruitPosition;

    const isColliding =
      players[playerId].x < fruit.x + 20 &&
      players[playerId].x + 20 > fruit.x &&
      players[playerId].y < fruit.y + 20 &&
      players[playerId].y + 20 > fruit.y;

    if (isColliding) {
      players[playerId].points++;
      fruitPosition = randomFruit();
    }
  }

  ws.on("close", () => {
    delete players[playerId];
    console.log("Um jogador desconectou.");
  });
});

console.log("Servidor WebSocket rodando em ws://localhost:8080");
