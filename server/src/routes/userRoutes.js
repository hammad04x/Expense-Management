import { Router } from "express"
import { authenticate, requireRole } from "../middleware/auth.js"
import { createUserAdmin, listCompanyUsers, updateRoleManager } from "../controllers/userController.js"
const router = Router()

router.use(authenticate, requireRole("ADMIN"))
router.post("/", createUserAdmin)
router.get("/", listCompanyUsers)
router.put("/role", updateRoleManager)

export default router
