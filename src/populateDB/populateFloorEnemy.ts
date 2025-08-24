import type { Response, Request, NextFunction } from "express";
import { loadMapData as loadFloorEnemyData } from "./loadFileData";
import { FloorEnemy, Item, Weapon } from "../dataModel";
import type { FloorEnemy as FloorEnemyType } from "../dataModel/floorEnemy.model";

export async function popluateFloorEnemy(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await loadFloorEnemyData("FloorEnemy")
    const populatedata = await Promise.all(data.map(async (en: FloorEnemyType) => {
      let itemId = await Item.find({ name: { $in: en.inventory } }).select({ _id: 1 })
      let weaponId = await Weapon.findOne({ name: { $in: en.weaponSlot } }).select({ _id: 1 })
      return {
        ...en,
        inventory: itemId,
        weaponSlot: weaponId
      }
    }))
    if (populatedata.length <= 0) {
      return res.json({ message: "there is nothing to update" })
    }
    const result = await FloorEnemy.bulkWrite(
      populatedata.map(en => ({
        updateOne: {
          filter: { name: en.name },
          update: { $set: en },
          upsert: true
        }
      }))
    )
    return res.json({
      message: "data added",
      added: populatedata,
      result
    })
  } catch (e) {
    console.log("Message:", e)
    return res.json({
      message: e
    })
  }
}
