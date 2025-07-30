import GameState, { ClassType } from "./gameState";
import { ECSManager } from "./EntityManager";
import { PlayerEntity, type rigidBody} from "./Entites/PlayerEntity";
import type { CharacterInterface } from "./dataModel";

export async function loadDataBeforeGameLoopStarts(){
  const gameState = await new GameState().loadGameState("68839600a7d777f847957c30")
  const ecsManager = new ECSManager()
  if(!gameState){
    return false
  }
  const player = new PlayerEntity(gameState.Character as CharacterInterface )
  return {ecsManager, player}
}


export function gameLoop(ECSManager: ECSManager, deltaTime: number, player: PlayerEntity){
  const state = player.getComponent("rigidBody")
  console.log(state)
  ECSManager.update(deltaTime)
}

