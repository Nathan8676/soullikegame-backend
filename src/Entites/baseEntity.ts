export class ECS{
  static currentId = 0
  id: number
  components: Map<string, any>

  constructor() {
    this.id = ECS.currentId++
    this.components = new Map()
  }

  addComponent<T>(name: string, component: T) {
    this.components.set(name, component)
    return this
  }

  removeComponent(name: string) {
    this.components.delete(name)
    return this
  }

  updateComponent<T>(name: string, component: T){
    this.components.set(name, component)
    return this
  }

  getComponent<T>(name: string): T | undefined {
    return this.components.get(name)
  }

  hasComponent(name: string): boolean {
    return this.components.has(name)
  }

}


