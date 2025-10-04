import { Router } from "express"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import { authenticate, requireRole } from "../middleware/auth.js"
import { submitExpense, myExpenses, teamExpenses, companyExpenses } from "../controllers/expenseController.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const upload = multer({ dest: path.join(__dirname, "../../uploads") })

const router = Router()
router.use(authenticate)

router.post("/", upload.single("receipt"), submitExpense)
router.get("/mine", myExpenses)
router.get("/team", requireRole("MANAGER", "ADMIN"), teamExpenses)
router.get("/company", requireRole("ADMIN"), companyExpenses)

export default router
