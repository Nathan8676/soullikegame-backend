import { ECS } from "./Entites/baseEntity.ts"

export class ECSManager {
  Entites: ECS[] = []
  systems: ((entity: ECS[],deltaTime: number) => void)[] = []

  addEntity(data:ECS){
    this.Entites.push(data)
  }
  addSystem(system: (entity: ECS[],deltaTime: number) => void){
    this.systems.push(system)
  }
  update(deltaTime: number){
    this.systems.forEach((system) => {
      system(this.Entites, deltaTime)
    })
  }
}


