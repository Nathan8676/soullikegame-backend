export class ECS {
  static currentId = 0
  readonly id: number
  components: Map<string, any>
  lowPriorityDirtyComponents: Set<string>
  highPriorityDirtyComponents: Set<string>

  constructor() {
    this.id = ECS.currentId++
    this.components = new Map()
    this.lowPriorityDirtyComponents = new Set()
    this.highPriorityDirtyComponents = new Set()
  }

  addComponent<T>(name: string, component: T) {
    this.components.set(name, component)
    this.highPriorityDirtyComponents.add(name)
    return this
  }

  makeDirty(name: string, isHigh: boolean = false) {
    if (isHigh) {
      this.highPriorityDirtyComponents.add(name)
    } else {
      this.lowPriorityDirtyComponents.add(name)
    }
  }

  removeComponent(name: string) {
    this.components.delete(name)
    return this
  }

  updateComponent<T>(name: string, component: T) {
    this.components.set(name, component)
    return this
  }

  getComponent<T>(name: string): T | undefined {
    return this.components.get(name)
  }

  getDirtyComponents() {
    const lowOut: Record<string, any> = {}
    const highOut: Record<string, any> = {}
    for (const name of this.highPriorityDirtyComponents) {
      highOut[name] = this.getComponent(name)
    }
    for (const name of this.lowPriorityDirtyComponents) {
      lowOut[name] = this.getComponent(name)
    }
    return { lowPriority: lowOut, highPriority: highOut }
  }

  hasComponent(name: string): boolean {
    return this.components.has(name)
  }

  clearDirtycomponents() {
    this.highPriorityDirtyComponents.clear()
    this.lowPriorityDirtyComponents.clear()
  }

}


