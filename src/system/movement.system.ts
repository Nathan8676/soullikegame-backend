import { PlayerEntity, type rigidBody } from "../Entites/PlayerEntity";
import { applyGravity, applyDrag, applyFriction, applyForces, clumpSpeedForWalk, clumpSpeedForSprint, integrate, snapToZeroVelocity } from "../physics/physics"
import { ECS } from "../Entites/baseEntity";
import type { ECSManager } from "../EntityManager";

export function movePlayerSystem(entities: ECS[], deltaTime: number, ECSInstance: ECSManager) {
  entities.forEach((entity) => {
    if (entity.hasComponent("isAlive")) {
      if (entity.getComponent("isMoving")) {
        applyDrag(entity, deltaTime)
        applyFriction(entity, deltaTime)
        if (entity.getComponent("isJumping")) {
          applyGravity(entity)
        }
        if (entity.getComponent("isWalking")) {
          clumpSpeedForWalk(entity)
        }
        integrate(entity, deltaTime)
        snapToZeroVelocity(entity)
      }
    }
    return
  })
}


