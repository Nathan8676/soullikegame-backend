import { Socket } from "socket.io"
import { type AttackState, AttackType } from "./Entites/PlayerEntity.ts"
import type { rigidBody } from "./Entites/PlayerEntity.ts"
import type { CharacterInterface, TileLayoutInterface } from "./dataModel/index.ts"
import { ECS } from "./Entites/baseEntity.ts"
import type GameState from "./gameState.ts"
import { inRenderDistance } from "./physics/physics.ts"
import { EventEmitter } from "events"
import { config } from "../gameSetting.config.ts"

type characterPosition = {
  Floor: number,
  row: number,
  col: number
}

type chunks = Map<string, TileLayoutInterface[][]>

export class ECSManager extends EventEmitter {
  private GlobalTime!: number
  private Entites: ECS[] = []
  private chunkData!: chunks
  private socketEntities: Map<string, Socket> = new Map()
  private playerPos!: characterPosition
  private renderDistance: number = 20
  private systems: ((entity: ECS[], deltaTime: number, chunk?: Map<string, TileLayoutInterface[][]>, globalTime?: number) => void)[] = []
  static setup(gameState: GameState, globalTime: number, rd?: number) {
    if (!gameState.chunks || !gameState.character?.characterPosition || globalTime) {
      return new Error("GameState is missing required data")
    }
    return new ECSManager(gameState.character?.characterPosition, gameState.chunks, globalTime, rd)
  }

  private constructor(playerPos: characterPosition, chunk: chunks, globalTime: number, rd?: number) {
    super()
    this.setGlobalTime(globalTime)
    this.setPlayerPos(playerPos)
    this.setChunkData(chunk)
    this.setupEvent()
    if (rd) {
      this.setRenderDistance(rd)
    }
  }

  private setupEvent() {
    this.on("move", (data) => {
      const dir = data.direction
      const playerId = data.entityId
      const entity = this.getEntityWithId(playerId)

      if (!entity) return

      const rb = entity.getComponent("rigidBody") as rigidBody

      switch (dir) {
        case "W":
          rb.acceleration.y += config.player.baseAccle
          entity.updateComponent<rigidBody>("rigidBody", rb)

          break
        case "D":
          rb.acceleration.x += config.player.baseAccle
          entity.updateComponent<rigidBody>("rigidBody", rb)

          break
        case "A":
          rb.acceleration.x -= config.player.baseAccle
          entity.updateComponent<rigidBody>("rigidBody", rb)

          break
        case "S":
          rb.acceleration.y -= config.player.baseAccle
          entity.updateComponent<rigidBody>("rigidBody", rb)

          break

      }
    })

    this.on("Attack", (data) => {
      const { playerId, atckType } = data
      const entity = this.getEntityWithId(playerId)
      if (!entity) return
      const attackState = entity.getComponent<AttackState>("attackState")
      if (!attackState) return

      switch (atckType) {
        case "lightAttack":
          attackState.status = AttackType.lightAttack
          attackState.lastAttacktime = this.getGlobalTime()

          break
        case "spacialAttack":
          attackState.status = AttackType.specialAttack
          attackState.lastAttacktime = this.getGlobalTime()

          break
        case "heavyAttack":
          attackState.status = AttackType.heavyAttack
          attackState.lastAttacktime = this.getGlobalTime()

          break
      }
    })

  }

  linkSocket(playerId: string, socket: Socket) {
    this.socketEntities.set(playerId, socket)
  }

  setGlobalTime(val: number) {
    this.GlobalTime = val
  }

  getGlobalTime(): number {
    return this.GlobalTime - Date.now()
  }

  setPlayerPos(val: characterPosition) {
    this.playerPos = val
  }

  getPlayerPos() {
    return this.playerPos
  }

  setChunkData(val: Map<string, TileLayoutInterface[][]>) {
    this.chunkData = val
  }

  getChunkData() {
    return this.chunkData
  }

  setRenderDistance(value: number) {
    this.renderDistance = value
  }

  getRenderDistance() {
    return this.renderDistance
  }

  addEntity(data: ECS) {
    this.Entites.push(data)
  }

  addSystem(system: (entity: ECS[], deltaTime: number, chunk?: Map<string, TileLayoutInterface[][]>) => void) {
    this.systems.push(system)
  }

  getEntitiesWith(componentsName: string): ECS[] {
    return this.Entites.filter(entity => entity.hasComponent(componentsName))
  }

  getEntityWithId(Id: number): ECS | undefined {
    const entity = this.Entites.find(en => en.id === Id)
    return entity
  }

  removeEntityById(Id: number): boolean {
    this.Entites = this.Entites.filter(en => en.id !== Id)
    if (this.getEntityWithId(Id)) return false
    return true
  }

  update(deltaTime: number) {
    const inSideRenderDistance = this.Entites.filter((en) => {
      const enPos = en.getComponent<characterPosition>("characterPosition")
      if (!enPos) return false
      if (enPos.Floor === this.playerPos?.Floor) {
        return inRenderDistance({ x: enPos.row, y: enPos.col }, { x: this.playerPos.row, y: this.playerPos.col }, this.renderDistance)
      } else return false
    })
    this.systems.forEach((system) => {
      system(inSideRenderDistance, deltaTime, this.chunkData, this.getGlobalTime())
    })
  }

  updateInBackground(deltaTime: number) {
    const outSideRenderDistance = this.Entites.filter((en) => {
      const enPos = en.getComponent<characterPosition>("characterPosition")
      if (!enPos) return false
      if (enPos.Floor !== this.playerPos?.Floor) return true
      return !inRenderDistance({ x: enPos.row, y: enPos.col }, { x: this.playerPos.row, y: this.playerPos.col }, this.renderDistance)
    })
    this.systems.forEach((system) => {
      system(outSideRenderDistance, deltaTime, this.chunkData, this.getGlobalTime())
    })
  }
}

