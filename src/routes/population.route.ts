import type {Request, Response, NextFunction} from "express"
import router from "express/lib/router/index.js"
import { populateBaseItems } from "../populateDB/populateInGameItems"

const PopulationRoute = router()

PopulationRoute.get("/test", populateBaseItems)

export default PopulationRoute
