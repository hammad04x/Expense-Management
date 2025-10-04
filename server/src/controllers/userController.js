import { createUser, listUsers, updateUserRoleAndManager } from "../models/userModel.js"
import { hashPassword } from "../utils/password.js"

export async function createUserAdmin(req, res) {
  // Only admins can create users
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: "Only admins can create users" })
  }
  
  const { name, email, password, role = "EMPLOYEE", managerId = null } = req.body
  try {
    const password_hash = await hashPassword(password || "user123")
    const userId = await createUser({
      company_id: req.user.company_id,
      name,
      email,
      password_hash,
      role,
      manager_id: managerId,
    })
    return res.json({ id: userId })
  } catch (error) {
    console.error("Create user failed:", error)
    return res.status(500).json({ error: "Create user failed" })
  }
}
export async function listCompanyUsers(req, res) {
  try {
    const users = await listUsers(req.user.company_id)
    return res.json(users)
  } catch {
    return res.status(500).json({ error: "List users failed" })
  }
}
export async function updateRoleManager(req, res) {
  // Only admins can update user roles and managers
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: "Only admins can update user roles" })
  }
  
  const { userId, role, managerId } = req.body
  try {
    const ok = await updateUserRoleAndManager({ userId, role, managerId })
    return res.json({ ok })
  } catch (error) {
    console.error("Update role/manager failed:", error)
    return res.status(500).json({ error: "Update role/manager failed" })
  }
}
