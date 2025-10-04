import { Router } from "express"
import { countries, rates } from "../controllers/metaController.js"
const router = Router()

router.get("/countries", countries)
router.get("/rates/:base", rates)

export default router
