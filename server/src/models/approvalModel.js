import { pool } from "../config/db.js"

export async function createApproval(expenseId, approverId, level) {
  const [res] = await pool.query("INSERT INTO approvals (expense_id, approver_id, level) VALUES (?,?,?)", [
    expenseId,
    approverId,
    level,
  ])
  return res.insertId
}
export async function getApprovalsForExpense(expenseId) {
  const [rows] = await pool.query("SELECT * FROM approvals WHERE expense_id=? ORDER BY level ASC", [expenseId])
  return rows
}
export async function getApprovalsForApprover(approverId) {
  const [rows] = await pool.query(
    `SELECT a.*, e.amount, e.currency, e.category, e.description, e.expense_date, e.status AS expense_status, 
            u.name as user_name, u.email as user_email
     FROM approvals a 
     JOIN expenses e ON a.expense_id=e.id 
     JOIN users u ON e.user_id=u.id
     WHERE a.approver_id=? AND a.status="PENDING" 
     ORDER BY a.level ASC, e.created_at DESC`,
    [approverId],
  )
  return rows
}

export async function getApprovalsForExpenseWithDetails(expenseId) {
  const [rows] = await pool.query(
    `SELECT a.*, u.name as approver_name, u.email as approver_email, u.role as approver_role
     FROM approvals a 
     JOIN users u ON a.approver_id=u.id 
     WHERE a.expense_id=? 
     ORDER BY a.level ASC`,
    [expenseId],
  )
  return rows
}
export async function setApprovalDecision({ approvalId, status, comment }) {
  const [res] = await pool.query("UPDATE approvals SET status=?, comment=?, decided_at=NOW() WHERE id=?", [
    status,
    comment || null,
    approvalId,
  ])
  return res.affectedRows > 0
}
