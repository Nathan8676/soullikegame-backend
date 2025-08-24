import router from "express/lib/router/index.js"
import { populateBaseItems } from "../populateDB/populateInGameItems"
import { populateGameMaps } from "../populateDB/populateGameMaps"
import { popluateFloorEnemy } from "../populateDB/populateFloorEnemy"
import { popluateFloorBoss } from "../populateDB/populateFloorBoss"

const PopulationRoute = router()

PopulationRoute.get("/test", populateBaseItems)

PopulationRoute.get("/floor-enemy", popluateFloorEnemy)

PopulationRoute.get("/floor-boss", popluateFloorBoss)

PopulationRoute.get("/mapdata", populateGameMaps)

export default PopulationRoute
