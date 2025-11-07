import type { Request, Response, NextFunction } from "express"
import GameState, { ClassType } from "../gameState"
import router from "express/lib/router/index.js"

const Player_infoRoute = router()

// TODO: remove these route since we handle new and continue game in socket
Player_infoRoute.get("/newGameState/test", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gameState = await GameState.newGameState("vimer", ClassType.Knight)
    console.log(gameState)
    res.status(200).json({ gameState, message: "Success" })
    return
  } catch (error) {
    res.status(500).json({ error: error })
    return
  }
})
Player_infoRoute.get("/continueGameState/test", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gameState = await GameState.continueGameState("68839600a7d777f847957c30")
    if (!gameState) {
      res.status(404).json({ message: "Game not found" })
      return
    }
    res.status(200).json({ gameState: { character: gameState.character, map: gameState.mapLayout }, message: "Success" })
    return
  } catch (error) {
    res.status(500).json({ error: error })
    return
  }
})


export default Player_infoRoute


