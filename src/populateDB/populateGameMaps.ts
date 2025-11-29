import type { Response, NextFunction, Request } from "express";
import { MapLayout } from "../dataModel";
import type { MapLayoutInterface } from "../utility/interface.utility";
import { loadMapData } from "./loadFileData";

async function TiledMapConvertorToEngineMapLayout() {
  const mapDataArr = await loadMapData("mapLayout")
  const finalMapArr: Array<MapLayoutInterface> = []
  mapDataArr.forEach((map) => {
    let convertedMap: MapLayoutInterface
    // NO convert need cause This Custom tiled data is same my engine
    convertedMap = {
      name: map.name,
      description: map.description,
      height: map.height,
      width: map.width,
      floorLeveltoScaleBoss: map.floorLeveltoScaleBoss,
      floorLeveltoScaleEnemy: map.floorLeveltoScaleEnemy,
      floorLevel: map.floorLevel,
    }
    // TODO: convert needed for object layer and layout
  })
  console.log(mapDataArr)
}
TiledMapConvertorToEngineMapLayout()

export async function populateGameMaps(req: Request, res: Response, next: NextFunction) {
  try {
    const mapDataArr = await loadMapData("mapLayout");
    if (!mapDataArr) {
      return res.json({ Message: "there is nothing to update " })
    }
    const result = await MapLayout.bulkWrite(
      mapDataArr.map((en: MapLayoutInterface) => ({
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


