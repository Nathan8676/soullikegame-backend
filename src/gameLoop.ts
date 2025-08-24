import GameState, { ClassType } from "./gameState";
import { ECSManager } from "./EntityManager";
import { PlayerEntity, type rigidBody } from "./Entites/PlayerEntity";
import type { CharacterInterface } from "./dataModel";

export async function loadDataBeforeGameLoopStarts() {
  const gameState = await GameState.continueGameState("68839600a7d777f847957c30")
  if (!gameState) {
    return new Error("GameState not found")
  }
  const ecsManager = ECSManager.setup(gameState, Date.now()) // if have render distance put as second arg
  const player = new PlayerEntity(gameState.character as CharacterInterface)
  return { ecsManager, player }
}


export function gameLoop(ECSManager: ECSManager, deltaTime: number, player: PlayerEntity) {
  ECSManager.update(deltaTime)
}

