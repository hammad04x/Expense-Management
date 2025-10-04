import { Router } from "express"
import { authenticate, requireRole } from "../middleware/auth.js"
import { myApprovals, actApproval, getAllExpensesForApproval } from "../controllers/approvalController.js"
const router = Router()

router.use(authenticate, requireRole("MANAGER", "ADMIN"))
router.get("/", myApprovals)
router.get("/expenses", getAllExpensesForApproval)
router.post("/act", actApproval)

export default router
