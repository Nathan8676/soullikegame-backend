import { PlayerEntity, type rigidBody } from "../Entites/PlayerEntity";
import { applyGravity, applyDrag, applyFriction, applyForces, clumpSpeedForWalk, clumpSpeedForSprint, integrate, snapToZeroVelocity} from "../physics/physics"
import { ECS } from "../Entites/baseEntity";

export function movePlayerSystem(entities: ECS[], deltaTime: number) {
  entities.forEach((entity) => {
    if(entity.getComponent("isMoving")){
      applyDrag(entity, deltaTime)
      applyFriction(entity, deltaTime)
      if(entity.getComponent("isJumping")){
        applyGravity(entity)
      }
      if(entity.getComponent("isWalking")){
        clumpSpeedForWalk(entity)
      }
      integrate(entity, deltaTime)
      snapToZeroVelocity(entity)
    }
  })
}


