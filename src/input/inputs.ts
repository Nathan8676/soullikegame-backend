import { Socket } from "socket.io";
import { config } from "../../gameSetting.config";
import type { ECSManager } from "../EntityManager";

export interface Client extends Socket {
  [key: string]: any
}

export const InputEvents = async (socket: Client, ecsManager: ECSManager, playerId: number) => {
  socket.on("W", (data) => {
    // function for moving the character forward and validation for that move, comes from input.ts
    ecsManager.emit("move", { entityId: playerId, ddirection: "W" })
  })
  socket.on("D", (data) => {
    // function for moving the character right and validation for that move, comes from input.ts
    ecsManager.emit("move", { entityId: playerId, direction: "D" })
  })
  socket.on("A", (data) => {
    // function for moving the character left and validation for that move, comes from input.ts
    ecsManager.emit("move", { entityId: playerId, direction: "A" })
  })
  socket.on("S", (data) => {
    // function for moving the character down and validation for that move, comes from input.ts
    ecsManager.emit("move", { entityId: playerId, direction: "S" })
  })
  socket.on("Attack", (data) => {
    // function for the character to attack and validation for that move, comes from input.ts
    ecsManager.emit("Attack", { playerId: playerId, atckType: data.AttackType })

  })
  socket.on("inventory", () => {
    // function for the character to open inventory and validation for that move, comes from input.ts
  })
  socket.on("hotswap", () => {
    // function for the character to hotswap weapon, item and validation for that move, comes from input.ts
  })
  socket.on("itemUse", () => {
    // function for the character to use an item and validation for that move, comes from input.ts
  })
  socket.on("itemDrop", () => {
    // function for the character to drop an item and validation for that move, comes from input.ts
  })
  socket.on("interaction", () => {
    // function for the character to interact with an npc, item, door, etc and validation for that move, comes from input.ts
  })
  socket.on('CharacterDeath', () => {
    // function for the character death and validation, comes from input.ts
  })
}

