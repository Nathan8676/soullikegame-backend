import express from "express";
import type { rigidBody } from "./Entites/PlayerEntity";
import { loadDataBeforeGameLoopStarts, gameLoop } from "./gameLoop";
import { movePlayerSystem } from "./system/movement.system";
import { Server } from "socket.io";
import http from "http";
import Player_infoRoute from "./routes/Player_info.route";
import PopulationRoute from "./routes/population.route";

const app = express();

export const server = http.createServer(app);
export const io = new Server(server, {
  connectTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Routes
app.get("/", (req, res) => {
  res.send("Game server is running!");
});

app.use("/player_info", Player_infoRoute);
app.use("/population", PopulationRoute);

// ✅ Start game loop outside of any route
export async function startGameLoop() {
  //   const loadedData = await loadDataBeforeGameLoopStarts();
  //   if (!loadedData) {
  //     console.error("Failed to load game data");
  //     process.exit(1);
  //   }
  //
  //   const { ecsManager, player } = loadedData;
  //   ecsManager.addEntity(player);
  //   ecsManager.addSystem(movePlayerSystem);
  //   let lastTime = Date.now();
  //   setInterval(() => {
  //     const now = Date.now();
  //     const deltaTime = now - lastTime;
  //     lastTime = now;
  //     gameLoop(ecsManager, deltaTime / 1000, player);
  //   }, 1000 / 60);
}
