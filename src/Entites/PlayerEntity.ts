import type { WeaponType, CharacterInterface } from "../utility/interface.utility.ts"
import { config } from "../../gameSetting.config.ts";
import { ECS } from "./baseEntity.ts";

export type Vec2 = { x: number, y: number };

export const FacingDirection: Record<'right' | 'left' | 'up' | 'down' | 'upRight' | 'upLeft' | 'downRight' | 'downLeft', Vec2> = {
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  upLeft: { x: -1, y: 1 },
  upRight: { x: 1, y: 1 },
  downLeft: { x: -1, y: -1 },
  downRight: { x: 1, y: -1 }
};
export enum facingEnum {
  Right = "right",
  UpRight = "upRight",
  Left = "left",
  UpLeft = "upLeft",
  DownRight = "downRight",
  DownLeft = "downLeft",
  Up = "up",
  Down = "down"
}

export enum AttackType {
  lightAttack = "lightAttack",
  heavyAttack = "heavyAttack",
  specialAttack = "specialAttack",
  null = "null"
}


export interface rigidBody {
  position: { x: number, y: number, z: number }
  velocity: { x: number, y: number, z: number }
  acceleration: { x: number, y: number, z: number }
  direction: { x: number, y: number, z: number }
  maxSpeed: number
  maxSprintingSpeed: number
  mass: number
  friction: number
  drag: number
}
export interface AttackState {
  status: AttackType
  lastAttacktime: number
  queued: boolean
  comboStep: number
  moveSet: WeaponType | null
}
const mapToComponents = {
  name: "name",
  mana: "mana",
  health: "health",
  stamina: "stamina",
  strength: "strength",
  weaponSlot: "weaponSlot",
  characterPosition: "characterPosition",
  armorSlot: "armorSlot",
  inventory: "inventory",
  Quest: "Quest",
  statusEffect: "statusEffect",
  level: "level",
  mapLayout: "mapLayout",
  gold: "gold",
  experience: "experience",
}

export class PlayerEntity extends ECS {
  constructor(data: CharacterInterface) {
    super()
    for (const [key, componentName] of Object.entries(mapToComponents)) {
      this.addComponent(componentName, data[key as keyof CharacterInterface])
    }
    this.addComponent("rigidBody", {
      position: { x: data.characterPosition.col, y: data.characterPosition.row, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      acceleration: { x: 0, y: 0, z: 0 },
      direction: { x: 0, y: 0, z: 0 },
      facingDirection: FacingDirection[facingEnum.Down],
      mass: 1,
      friction: config.player.friction,
      drag: config.player.drag,
      maxSpeed: config.player.maxSpeed,
      maxSprintingSpeed: config.player.maxSprintingSpeed
    } as rigidBody)
    this.addComponent("attackState", {
      status: AttackType.null,
      queued: false,
      lastAttacktime: 0,
      comboStep: 0,
      moveSet: null
    } as AttackState)
    this.addComponent("isJumping", false)
    this.addComponent("isSprinting", true)
    this.addComponent("isMoving", true)
    this.addComponent("isWalking", false)
    this.addComponent("tag", "Player")
  }
}



