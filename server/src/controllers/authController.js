import { createCompany, createUser, getUserByEmail } from "../models/userModel.js"
import { hashPassword, comparePassword } from "../utils/password.js"
import { signToken } from "../config/jwt.js"

export async function signup(req, res) {
  try {
    const { companyName, defaultCurrency = "USD", name, email, password } = req.body
    if (!companyName || !name || !email || !password) return res.status(400).json({ error: "Missing fields" })
    const companyId = await createCompany(companyName, defaultCurrency)
    const password_hash = await hashPassword(password)
    const userId = await createUser({ company_id: companyId, name, email, password_hash, role: "ADMIN" })
    const token = signToken({ id: userId })
    return res.json({ token })
  } catch (e) {
    return res.status(500).json({ error: "Signup failed" })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    const user = await getUserByEmail(email)
    if (!user) return res.status(401).json({ error: "Invalid credentials" })
    const ok = await comparePassword(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: "Invalid credentials" })
    const token = signToken({ id: user.id })
    return res.json({ token })
  } catch {
    return res.status(500).json({ error: "Login failed" })
  }
}

export async function me(req, res) {
  // user is attached by auth middleware
  const { id, name, email, role, manager_id, company_id } = req.user
  return res.json({ id, name, email, role, manager_id, company_id })
}
