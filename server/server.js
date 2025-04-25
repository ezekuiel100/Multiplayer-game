import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let canvasSize = { width: 0, height: 0 };

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    canvasSize = JSON.parse(data.toString());
  });

  ws.send(randomFruit());
});

function randomFruit() {
  const x = Math.ceil(Math.random() * canvasSize.width);
  const y = Math.ceil(Math.random() * canvasSize.height);

  return JSON.stringify({ x, y });
}

console.log("Servidor WebSocket rodando em ws://localhost:8080");
