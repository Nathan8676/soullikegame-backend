import type { Socket } from "socket.io"
import { gameLoop } from "../gameLoop"
import { generateId } from "../utility/index.utility"
import { ECSManager } from "../EntityManager"

interface GameSessionI {
  sessionId: string
  userId: string
  ECSManagerInstance: ECSManager
  socketInstance: Socket
  createdAt: Number
}

export default class GameSession implements GameSessionI {
  readonly sessionId: string
  readonly userId: string
  readonly ECSManagerInstance: ECSManager
  readonly socketInstance: Socket
  createdAt: number

  constructor(userId: string, ecsManager: ECSManager, socket: Socket) {
    this.sessionId = generateId()
    this.userId = userId
    this.createdAt = Date.now();
    this.socketInstance = socket
    this.ECSManagerInstance = ecsManager

    this.setupLoop()
  }

  private setupLoop() {
    let lastTime = Date.now();
    let backgroundAccumulator = 0;
    const backgroundStep = 1 / 30;
    setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;
      this.ECSManagerInstance.update(deltaTime)
      backgroundAccumulator += deltaTime
      if (backgroundAccumulator >= backgroundStep) {
        this.ECSManagerInstance.updateInBackground(backgroundAccumulator)
        backgroundAccumulator = 0;
      }
      this.collectAndEmit()

    }, 1000 / 60);
  }

  private collectAndEmit() {
    const { highUpdate, lowUpdate } = this.ECSManagerInstance.sendQueues()
    if (highUpdate.length > 0) {
      this.socketInstance.emit("World:updateHigh", highUpdate)
    }
    if (lowUpdate.length > 0) {
      this.socketInstance.emit("World:updateLow", lowUpdate)
    }
    this.ECSManagerInstance.cleanQueuesAfterSending()
    // TODO: before sending check if inside render en change or not then send base on that 
    // second check if data is for frontend comsumable meaning remove any data that is not connected to render and not need the info to display
    // and remove them 
    if (this.ECSManagerInstance.inSideRenderDistance.length > 0) {
      this.socketInstance.emit("World:EntitiesData", this.ECSManagerInstance.inSideRenderDistance)
    }
  }

  getEcsId() {
    return this.ECSManagerInstance.getInstanceId() ?? null
  }

  getSocketId() {
    return this.socketInstance.id ?? null
  }

  async terminate() {

  }
}
