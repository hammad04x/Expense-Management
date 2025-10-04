import { pool } from "../config/db.js"

export async function getUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email])
  return rows[0] || null
}
export async function getUserById(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id=?", [id])
  return rows[0] || null
}
export async function createCompany(name, currency) {
  const [res] = await pool.query("INSERT INTO companies (name, default_currency) VALUES (?,?)", [name, currency])
  return res.insertId
}
export async function createUser({ company_id, name, email, password_hash, role, manager_id = null }) {
  const [res] = await pool.query(
    "INSERT INTO users (company_id, name, email, password_hash, role, manager_id) VALUES (?,?,?,?,?,?)",
    [company_id, name, email, password_hash, role, manager_id],
  )
  return res.insertId
}
export async function listUsers(companyId) {
  const [rows] = await pool.query("SELECT id, name, email, role, manager_id FROM users WHERE company_id=?", [companyId])
  return rows
}
export async function updateUserRoleAndManager({ userId, role, managerId }) {
  const [res] = await pool.query("UPDATE users SET role=?, manager_id=? WHERE id=?", [role, managerId || null, userId])
  return res.affectedRows > 0
}
