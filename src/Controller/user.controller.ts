import type { Request, Response, NextFunction } from "express";
import { ApiErrors, ApiResponse, type IApiErrors, type IApiResponse, asyncHandler, assertSoftDefined, mustHave } from "../utility/index.utility"
import { User } from "../dataModel";
import { type UserInterface, zUserSchema, type PubUser, pubUserSchema } from "../utility/interface.utility";
import jwt from "jsonwebtoken"
import { config } from "../../gameSetting.config";
import z from "zod";

const generateAccessTokenAndRefreshToken = async (user: UserInterface) => {
  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()
  user.refreshToken = refreshToken
  user.save({ validateBeforeSave: false })
  return { accessToken, refreshToken }
}

export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userName, password } = req.body
    // check for requied data 
    const userData = mustHave({ userName, password }, "data must have", 404)
    const cookieOption = {
      // set option for secure cookie 
      httpOnly: true,
      secure: true
    }

    const existUser = await User.findOne({ $or: [{ userName }] }).select("-password -refreshToken")

    if (existUser) {
      throw new ApiErrors(400, `user with this name:${userName} already exists`)
    }

    const result: UserInterface = await User.create(userData)

    if (!result) {
      throw new ApiErrors(500, "user was unable to create")
    }
    const Token = await generateAccessTokenAndRefreshToken(result)
    const parseResult = pubUserSchema.parse(result)

    res.status(200)
      .cookie("accessToken", Token.accessToken, cookieOption)
      .cookie("refreshToken", Token.refreshToken, cookieOption)
      .json(new ApiResponse<PubUser>(parseResult, 200, "User Created"))

  } catch (err: any) {
    throw new ApiErrors(err.statusCode ?? 500, err.message ?? err,)
  }
})


export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userName, password } = req.body

    const userData = mustHave({ userName, password }, "data must have", 404)

    const user = await User.findOne({ userName: { $in: userData.userName } })

    if (!user) {
      throw new ApiErrors(404, "User not found")
    }

    const parsedUser = zUserSchema.safeParse(user)

    if (!parsedUser.success) {
      throw new ApiErrors(401, "token has been modifie", parsedUser.error.issues)
    }
    const isPasswordCorrect = await user.comparePassword(userData.password)

    if (!isPasswordCorrect) {
      throw new ApiErrors(401, "Password is incorrect")
    }

    const newTokens = await generateAccessTokenAndRefreshToken(user)

    if (!newTokens) {
      throw new ApiErrors(500, "Something went wrong While generating new tokens")
    }

    const AccessToken = newTokens.accessToken
    const RefreshToken = newTokens.refreshToken

    const options = {
      httpOnly: true,
      secure: true
    }

    const pubUser: PubUser = pubUserSchema.parse(parsedUser)

    return res.status(200)
      .cookie("accessToken", AccessToken, options)
      .cookie("refreshToken", RefreshToken, options)
      .json(new ApiResponse(pubUser, 200, "Refresh access token successful"))

  } catch (err: any) {
    throw new ApiErrors(err.statusCode ?? 500, err.message ?? err,)
  }
})

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oldRefreshToken = mustHave(
      req.cookies?.refreshToken || req.body?.refreshToken,
      "Unauthorized request User is not authorized for this action",
      401
    )

    let refreshTokenSchema = z.object({
      _id: z.string()
    }).strict()

    const decodedToken = jwt.verify(oldRefreshToken, config.user.refreshTokenSecret as jwt.Secret)

    if (!decodedToken) {
      throw new ApiErrors(401, "invalid token")
    }

    const safeParseToken = refreshTokenSchema.safeParse(decodedToken)

    if (!safeParseToken.success) {
      throw new ApiErrors(401, "token has been modifie", safeParseToken.error.issues)
    }

    const user: UserInterface = await User.findById(safeParseToken.data._id).select("-password")
    if (!user) {
      throw new ApiErrors(401, "User not found")
    }

    if (user.refreshToken !== oldRefreshToken) {
      throw new ApiErrors(401, "refresh token is not valid or expired")
    }

    const newTokens = await generateAccessTokenAndRefreshToken(user)

    if (!newTokens) {
      throw new ApiErrors(500, "Something went wrong While generating new tokens")
    }

    const AccessToken = newTokens.accessToken
    const RefreshToken = newTokens.refreshToken

    const options = {
      httpOnly: true,
      secure: true
    }
    const userobj: PubUser = pubUserSchema.parse(user.toObject())

    return res.status(200)
      .cookie("accessToken", AccessToken, options)
      .cookie("refreshToken", RefreshToken, options)
      .json(new ApiResponse(userobj, 200, "Refresh access token successful"))
  } catch (err: any) {
    throw new ApiErrors(err.statusCode ?? 500, err.message ?? err, err.Errors ?? err)
  }
})
