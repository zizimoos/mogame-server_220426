import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const PORT = process.env.PORT || 8070;

const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.send(`✅  Hello World! + ${PORT}`);
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(` ✅  Server listening on port ${PORT}`);
});
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

/////////////////////////////////////////////////////////////////
let playersArrayServer = [];

io.on("connection", (socket) => {
  console.log("🔗 User connected", "socket.id :", socket.id);
  // playersArrayServer.push({ id: socket.id, x: 0, y: 0, point: 0 });
  // console.log("init", playersArrayServer);
  socket.emit("init", {
    id: socket.id,
    playersArrayServer: playersArrayServer,
  });

  socket.on("player-move", (myPlayInfo) => {
    // console.log("🔗 player-move", myPlayInfo);
    console.log("playersArrayServer", playersArrayServer);
    if (myPlayInfo.id === socket.id) {
      let updatedPlayers = playersArrayServer.filter(
        (player) => player.id !== myPlayInfo.id
      );
      playersArrayServer = [...updatedPlayers, myPlayInfo];
      // playersArrayServer = [myPlayInfo];
    }
    socket.broadcast.emit("move-otherPlayer", playersArrayServer);
  });

  socket.on("disconnecting", () => {});
  socket.on("disconnect", () => {
    console.log("🔗 User disconnected", "socket.id :", socket.id);
    playersArrayServer.splice(playersArrayServer.indexOf(socket.id), 1);
  });
});
