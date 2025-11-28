import { Socket } from "socket.io";
import { sessionManager } from "../session/sessionManager";
import GameSession from "../session/GameSession";
import GameState from "../gameState";
import { InputEvents } from "./inputs";
import { loadDataBeforeGameLoopStarts } from "../gameLoop";
import { ApiErrors, mustHave, StarterCharacter } from "../utility/index.utility";
import jwt from "jsonwebtoken";
import { Character, User } from "../dataModel";
import { pubUserSchema, type PubUser } from "../utility/interface.utility";
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
    // TODO: make other listener that can be use to join other player world with ECSManager as there instance 
    socket.on("joinGame", async (data) => {
      const { characterId } = data
      if (user!.characterIds.find((id) => id === characterId) === undefined) return socket.emit("error", "forbidden");
      // TODO: make sure that loadData before Game Loop Starts can also handle finding other player Ecsmanager/world and able to return that as well 
      // or make a diff function for that. need to use session maanger to find other player world 
      const { ecsManager, player, gameState } = await loadDataBeforeGameLoopStarts(characterId)

      if (ecsManager instanceof Error) return socket.emit("error", ecsManager)

      const gameSession = new GameSession(user?.userName as string, ecsManager, socket)

      sessionManager.create(gameSession)
      socket.emit("playerState", player)
      socket.emit("chunksData", gameState.chunks)
      socket.emit("map", gameState.mapLayout)
      InputEvents(socket, ecsManager, player.id)
    })
    socket.on("newGame", async (data) => {
      const { characterName, classType } = data
      // TODO: Do check data that coming for client and enforce classType value to be one of the value in enum
      const character = await GameState.newGameState(characterName, classType)
      // TODO: Before emitting put character id to user Account characterIds arr and push it to db
      socket.emit("CharacterId", character._id)
    })

    socket.on("getStarterClasses", async () => {
      socket.emit("starterClasses", await StarterCharacter(undefined, true))
    })

  })

}
