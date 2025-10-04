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

// New function to get approvals that should be visible to the approver (sequential workflow)
export async function getVisibleApprovalsForApprover(approverId, approverRole) {
  if (approverRole === 'MANAGER') {
    // Managers can only see Level 1 approvals that are pending
    const [rows] = await pool.query(
      `SELECT a.*, e.amount, e.currency, e.category, e.description, e.expense_date, e.status AS expense_status, 
              u.name as user_name, u.email as user_email
       FROM approvals a 
       JOIN expenses e ON a.expense_id=e.id 
       JOIN users u ON e.user_id=u.id
       WHERE a.approver_id=? AND a.status="PENDING" AND a.level=1
       ORDER BY e.created_at DESC`,
      [approverId],
    )
    return rows
  } else if (approverRole === 'ADMIN') {
    // Admins can see Level 2 approvals that are pending AND Level 1 has been decided
    const [rows] = await pool.query(
      `SELECT a.*, e.amount, e.currency, e.category, e.description, e.expense_date, e.status AS expense_status, 
              u.name as user_name, u.email as user_email,
              prev_a.status as prev_level_status, prev_a.comment as prev_level_comment,
              prev_u.name as prev_approver_name
       FROM approvals a 
       JOIN expenses e ON a.expense_id=e.id 
       JOIN users u ON e.user_id=u.id
       LEFT JOIN approvals prev_a ON prev_a.expense_id = e.id AND prev_a.level = 1
       LEFT JOIN users prev_u ON prev_a.approver_id = prev_u.id
       WHERE a.approver_id=? AND a.status="PENDING" AND a.level=2
       AND prev_a.status IN ('APPROVED', 'REJECTED')
       ORDER BY e.created_at DESC`,
      [approverId],
    )
    return rows
  }
  return []
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
