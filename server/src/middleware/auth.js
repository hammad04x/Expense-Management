import { verifyToken } from "../config/jwt.js"
import { getUserById } from "../models/userModel.js"

export const authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || ""
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null
    if (!token) return res.status(401).json({ error: "Unauthorized" })
    const decoded = verifyToken(token)
    const user = await getUserById(decoded.id)
    if (!user) return res.status(401).json({ error: "Unauthorized" })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" })
  }
}

export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" })
    }
    next()
  }
