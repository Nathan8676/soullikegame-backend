import type { Request, Response, NextFunction } from "express"
import ApiErrors from "./apiError.utility"
import { asyncHandler } from "./asyncHandler.utility"
import * as z from "zod"
import jwt from "jsonwebtoken"
import { User } from "../dataModel"
import { pubUserSchema, type PubUser } from "../utility/interface.utility"
import { config } from "../../gameSetting.config"


const tokenSchema = z.object({
  _id: z.string(),
  userName: z.string()
})

declare global {
  namespace Express {
    interface Request {
      user?: PubUser
    }
  }
}

export const VerifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jwtToken = req.cookies?.accessToken || req.header?.("Authorization")?.replace("Bearer ", "")

    if (!jwtToken) throw new ApiErrors(401, "Unauthorized request User is not authorized for this action")

    const verifiedToken = jwt.verify(jwtToken, config.user.accessTokenSecret as jwt.Secret)

    const verifiedParsedToken = tokenSchema.parse(verifiedToken)

    const user = pubUserSchema.parse(await User.findById(verifiedParsedToken?._id).select("-password -refreshToken"))

    if (!user) throw new Error("User not found")

    req.user = user
    next()

  } catch (err: any) {
    throw new ApiErrors(err.statusCode ?? 500, err.message, err, err.stack ? err : undefined)
  }
})

