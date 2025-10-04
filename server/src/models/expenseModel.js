import { pool } from "../config/db.js"

export async function createExpense({ user_id, amount, currency, category, description, expense_date, receipt_url }) {
  const [res] = await pool.query(
    "INSERT INTO expenses (user_id, amount, currency, category, description, expense_date, receipt_url) VALUES (?,?,?,?,?,?,?)",
    [user_id, amount, currency, category, description, expense_date, receipt_url || null],
  )
  return res.insertId
}
export async function getExpenseById(id) {
  const [rows] = await pool.query("SELECT * FROM expenses WHERE id=?", [id])
  return rows[0] || null
}
export async function getExpensesForUser(userId) {
  const [rows] = await pool.query("SELECT * FROM expenses WHERE user_id=? ORDER BY created_at DESC", [userId])
  return rows
}
export async function getTeamExpenses(managerId) {
  // employees who report to manager
  const [rows] = await pool.query(
    "SELECT e.* FROM expenses e JOIN users u ON e.user_id=u.id WHERE u.manager_id=? ORDER BY e.created_at DESC",
    [managerId],
  )
  return rows
}
export async function getAllExpenses(companyId) {
  const [rows] = await pool.query(
    "SELECT e.*, u.name as user_name, u.email as user_email FROM expenses e JOIN users u ON e.user_id=u.id WHERE u.company_id=? ORDER BY e.created_at DESC",
    [companyId],
  )
  return rows
}

export async function getExpensesForManager(managerId) {
  // Get expenses from employees who report to this manager, plus all expenses for managers/admins
  const [rows] = await pool.query(
    `SELECT e.*, u.name as user_name, u.email as user_email 
     FROM expenses e 
     JOIN users u ON e.user_id=u.id 
     WHERE u.manager_id=? OR u.id=? OR u.role IN ('MANAGER', 'ADMIN')
     ORDER BY e.created_at DESC`,
    [managerId, managerId],
  )
  return rows
}
export async function setExpenseStatus(expenseId, status) {
  const [res] = await pool.query("UPDATE expenses SET status=? WHERE id=?", [status, expenseId])
  return res.affectedRows > 0
}
