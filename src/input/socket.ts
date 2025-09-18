import { Socket } from "socket.io";
import GameState from "../gameState";
import { InputEvents, type Client } from "./inputs";
import { loadDataBeforeGameLoopStarts } from "../gameLoop";
import { ApiErrors, mustHave } from "../utility/index.utility";
import jwt from "jsonwebtoken";
import { User, pubUserSchema, type PubUser } from "../dataModel";
import { config } from "../../gameSetting.config";
import * as z from "zod"
import { io } from "../app";
import { ECSManager } from "../EntityManager";

const tokenSchema = z.object({
  _id: z.string(),
  userName: z.string()
})

declare module "socket.io" {
  interface Socket {
    user?: PubUser
  }
}

type AllClientSockets = Map<string, Client>
export var clients: AllClientSockets = new Map()

export function runSocketIo() {
  io.use(async (socket: Socket, next) => {
    try {
      console.log(socket)
      let token = socket.handshake.headers.cookie
      token = mustHave(token, "Authentication Error", 401)

      const verifiedToken = jwt.verify(token, config.user.accessTokenSecret as jwt.Secret)

      const verifiedParsedToken = tokenSchema.parse(verifiedToken)

      const parseUser = pubUserSchema.parse(await User.findById(verifiedParsedToken?._id).select("-password -refreshToken"))
      // TODO: add socket.id and user_id / userName to ecs manager after making ecs manager handle mulitiplayer 

      socket.user = parseUser

      next()
    } catch (err: any) {
      throw new ApiErrors(err.statusCode ?? 500, err.message, err, err.stack ? err : undefined)
    }
  })

  io.on("connection", (socket: Socket) => {
    const user = socket.user
    clients.set(user?.userName!, socket)
    socket.on("joinGame", async (data) => {
      const { characterId } = data
      const user = pubUserSchema.safeParse(await User.findById(characterId).select("-password -refreshToken"))
      if (!user.success) return socket.emit("error", "invalid_character")
      if (user.data.characterIds.find((id) => id === characterId) === undefined) return socket.emit("error", "forbidden");
      const { ecsManager, player } = await loadDataBeforeGameLoopStarts(characterId)
      if (ecsManager instanceof Error) return socket.emit("error", ecsManager)
      // TODO: add a map that point ecsManager to the user id. map player.id to world id (class base | function base) 

      InputEvents(socket, ecsManager, player.id)
    })
    socket.on("newGame", async (data) => {
      const { characterName, classType } = data
      // TODO: Do check data that coming for client
      const character = await GameState.newGameState(characterName, classType)
      // TODO: Before emitting put character id to user Account characterIds arr and push it to db
      socket.emit("CharacterId", character._id)
    })

    socket.on("getStarterClasses", () => {
      socket.emit("starterClasses",) // give a stripped-down version of StarterCharacter with min stats, items/weapons info
    })
  })

}
