import { Socket } from "socket.io";
import { loadDataBeforeGameLoopStarts } from "../gameLoop";
import { ApiErrors, mustHave } from "../utility/index.utility";
import jwt from "jsonwebtoken";
import { User, pubUserSchema, type PubUser } from "../dataModel";
import { config } from "../../gameSetting.config";
import * as z from "zod"
import { io } from "../app";

const tokenSchema = z.object({
  _id: z.string(),
  userName: z.string()
})

declare module "socket.io" {
  interface Socket {
    user?: PubUser
  }
}

function runSocketIo() {
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
    socket.on("joinGame", async (data) => {
      const { characterId } = data
      const user = pubUserSchema.safeParse(await User.findById(characterId).select("-password -refreshToken"))
      if (!user.success) return socket.emit("error", "invalid_character")
      if (user.data.characterIds.find((id) => id === characterId) === undefined) return socket.emit("error", "forbidden");
      const { ecsManager, player } = await loadDataBeforeGameLoopStarts(characterId)

    })
  })

}
