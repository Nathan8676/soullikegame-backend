import GameState, { ClassType } from "./gameState";
import { ApiErrors } from "./utility/index.utility"
import { ECSManager } from "./EntityManager";
import { PlayerEntity, type rigidBody } from "./Entites/PlayerEntity";
import type { CharacterInterface } from "./utility/interface.utility";

export async function loadDataBeforeGameLoopStarts(id: string) {
  // TODO: handle id input and put some test and check
  const gameState = await GameState.continueGameState(id ?? "68839600a7d777f847957c30")
  if (!gameState) {
    throw new ApiErrors(404, "GameState not found")
  }
  const ecsManager = ECSManager.setup(gameState, Date.now()) // if have render distance put as second arg
  const player = new PlayerEntity(gameState.character as CharacterInterface)
  return { ecsManager, player, gameState }
}


export function gameLoop(ECSManager: ECSManager, deltaTime: number, player: PlayerEntity) {
}

