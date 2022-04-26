import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!" + "PORT :" + `${PORT}`);
});
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log("✅ Server listening on port 3003");
});
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

/////////////////////////////////////////////////////////////////
let playersArrayServer = [];
let coinsArrayServer = [];
for (let i = 0; i < 50; i++) {
  coinsArrayServer.push({
    id: i,
    x: Math.random() * 6 - 3,
    y: Math.random() * 6 - 3,
  });
}

io.on("connection", (socket) => {
  console.log("🔗 User connected", "socket.id :", socket.id);
  // playersArrayServer.push({ id: socket.id, x: 0, y: 0, point: 0 });
  console.log("init", playersArrayServer);
  socket.emit("init", {
    id: socket.id,
    playersArrayServer: playersArrayServer,
    coinsArrayServer: coinsArrayServer,
  });

  socket.on("player-move", (myPlayInfo) => {
    console.log("🔗 player-move", myPlayInfo);
    console.log("playersArrayServer", playersArrayServer);
    if (myPlayInfo.id === socket.id) {
      let updatedPlayers = playersArrayServer.filter(
        (player) => player.id !== myPlayInfo.id
      );
      // playersArrayServer = [...updatedPlayers, myPlayInfo];
      playersArrayServer = [myPlayInfo];
    }
    socket.broadcast.emit("move-otherPlayer", playersArrayServer);
  });

  socket.on("coin-remove", (coinId, myPlayInfo) => {
    console.log("🔗 coin-remove", coinId, myPlayInfo);
    let updatedCoins = coinsArrayServer.filter((coin) => coin.id !== coinId);
    coinsArrayServer = [...updatedCoins];
    socket.broadcast.emit("remove-coin", coinsArrayServer);
    socket.emit("remove-coin", coinsArrayServer);
  });

  socket.on("disconnecting", () => {});
  socket.on("disconnect", () => {
    console.log("🔗 User disconnected", "socket.id :", socket.id);
    playersArrayServer.splice(playersArrayServer.indexOf(socket.id), 1);
  });
});
