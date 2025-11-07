import { ECS } from "./baseEntity";
import { config } from "../../gameSetting.config";
import { AttackType, type AttackState } from "./PlayerEntity";
import { FacingDirection } from "./PlayerEntity";
import { type rigidBody } from "./PlayerEntity";
import { facingEnum } from "./PlayerEntity";
import type { FloorEnemy } from "../dataModel/floorEnemy.model";

const mapToComponents = {
  name: "name",
  health: "health",
  weaponSlot: "weaponSlot",
  inventory: "inventory",
  mana: "mana",
  strength: "strength",
  statusEffect: "statusEffect",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
}

export class EnemyEntity extends ECS {

  constructor(data: FloorEnemy) {
    super()
    for (const [key, componentName] of Object.entries(mapToComponents)) {
      this.addComponent(componentName, data[key as keyof FloorEnemy])
    }

    this.addComponent("rigidBody", {
      // TODO: when rendering map and getting all Spawn places for enemy get the pos from there and set in position
      position: { x: data.characterPosition.col, y: data.characterPosition.row, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      acceleration: { x: 0, y: 0, z: 0 },
      direction: { x: 0, y: 0, z: 0 },
      facingDirection: FacingDirection[facingEnum.Down],
      mass: 1,
      friction: config.enemy.friction,
      drag: config.enemy.drag,
      maxSpeed: config.enemy.maxSpeed,
      maxSprintingSpeed: config.enemy.maxSprintingSpeed
    } as rigidBody)

    this.addComponent("attackState", {
      status: AttackType.null,
      queued: false,
      lastAttacktime: 0,
      comboStep: 0,
      moveSet: null
    } as AttackState)

    this.addComponent("aggroTarget", null);
    this.addComponent("respawnIn", config.enemy.respawnTime);
    this.addComponent("attackRange", config.enemy.aggroRange);
    this.addComponent("pathTarget", null);

    this.addComponent("tag", "Enemy")
  }

}
