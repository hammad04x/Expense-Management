import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./src/routes/authRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"
import expenseRoutes from "./src/routes/expenseRoutes.js"
import approvalRoutes from "./src/routes/approvalRoutes.js"
import metaRoutes from "./src/routes/metaRoutes.js"

const app = express()
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/expenses", expenseRoutes)
app.use("/api/approvals", approvalRoutes)
app.use("/api/meta", metaRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`[server] running on http://localhost:${PORT}`))
