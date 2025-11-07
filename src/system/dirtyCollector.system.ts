import { assertSoftDefined } from "../utility/index.utility"
import { ECS } from "../Entites/baseEntity";
import { config } from "../../gameSetting.config";
import { ECSManager } from "../EntityManager";
import type { TileLayoutInterface } from "../dataModel";

// TODO: make sure you add this system in the end of the arr and don't add anything afterward

function dirtCollector(entities: ECS[], deltaTime: number, ECSInstance: ECSManager, chunk: Map<string, TileLayoutInterface[][]>, globalTime: number) {
  for (const entity of entities) {
    const dirtyCompObj = entity.getDirtyComponents()
    ECSInstance.addDirtyComponentsForQueues(String(entity.id), dirtyCompObj.highPriority, 'high')
    ECSInstance.addDirtyComponentsForQueues(String(entity.id), dirtyCompObj.lowPriority, 'low')
  }
}
