import type { Response, NextFunction, Request } from "express";
import { loadMapData as loadFloorBossData } from "./loadFileData";
import { FloorBoss, Item, Weapon } from "../dataModel";
import type { FloorBossInterface } from "../utility/interface.utility";

export async function popluateFloorBoss(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await loadFloorBossData("FloorBoss")
    const populatedata = await Promise.all(data.map(async (en: FloorBossInterface) => {
      let itemId = await Item.find({ name: { $in: en.inventory } }).select({ _id: 1 })
      let weaponId = await Weapon.findOne({ name: { $in: en.weaponSlot } }).select({ _id: 1 })
      return {
        ...en,
        inventory: itemId,
        weaponSlot: weaponId
      }
    }))
    if (populatedata.length <= 0) {
      return res.status(200).json({ message: "there is nothing to update" })
    }
    const result = await FloorBoss.bulkWrite(
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
    res.json({
      message: e
    })
  }
}
