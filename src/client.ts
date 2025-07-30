import {io} from "./app";
import {Socket} from "socket.io";

type AllClientSockets =  Map<string, Client>

export var clients: AllClientSockets = new Map()

export interface Client extends Socket {
  [key: string]: any
}

const InputEvents = async (socket: Client) => {
  socket.on("W", () => {
    // function for moving the character forward and validation for that move, comes from input.ts
  })
  socket.on("D", () => {
    // function for moving the character right and validation for that move, comes from input.ts
  })
  socket.on("A", () => {
    // function for moving the character left and validation for that move, comes from input.ts
  })
  socket.on("S", () => {
    // function for moving the character down and validation for that move, comes from input.ts
  })
  socket.on("Attack", () => {
    // function for the character to attack and validation for that move, comes from input.ts
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

io.on("connection", (client) => {
  // turn on connection by if condition met
  if(client.handshake.auth?.characterName == null || client.handshake.auth?.characterName == undefined) return
  console.log("Client connected", client.id, client.handshake.auth.characterName);

  clients.set(client.id, client)
  InputEvents(client)
})
