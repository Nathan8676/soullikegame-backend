import type { CharacterInterface, TileLayoutInterface } from "./dataModel/index.ts"
import { ECS } from "./Entites/baseEntity.ts"
import type GameState from "./gameState.ts"
import { inRenderDistance } from "./physics/physics.ts"

type characterPosition = {
  Floor: number,
  row: number,
  col: number
}

type chunks = Map<string, TileLayoutInterface[][]>

export class ECSManager {
  private GlobalTime!: number
  private Entites: ECS[] = []
  private chunkData!: chunks
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
    this.setGlobalTime(globalTime)
    this.setPlayerPos(playerPos)
    this.setChunkData(chunk)
    if (rd) {
      this.setRenderDistance(rd)
    }
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

