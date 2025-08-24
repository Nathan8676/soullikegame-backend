import type { Response, NextFunction, Request } from "express";
import { MapLayout } from "../dataModel";
import type { MapLayoutInterface } from "../dataModel";
import { loadMapData } from "./loadFileData";

export async function populateGameMaps(req: Request, res: Response, next: NextFunction) {
  try {
    const mapData = await loadMapData("mapLayout");
    if (!mapData) {
      return res.json({ Message: "there is nothing to update " })
    }
    const result = await MapLayout.bulkWrite(
      mapData.map((en: MapLayoutInterface) => ({
        updateOne: {
          filter: { name: en.name },
          update: { $set: en },
          upsert: true
        }
      }))
    )
    if (!result) {
      new Error("bulkWrite return nothing")
    }
    return res.status(200).json({
      message: "Maps Added",
      result
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ErrorMessage: err })
  }
}


