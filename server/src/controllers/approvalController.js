import { getApprovalsForApprover, setApprovalDecision, getApprovalsForExpense, getApprovalsForExpenseWithDetails } from "../models/approvalModel.js"
import { setExpenseStatus, getAllExpenses, getExpensesForManager } from "../models/expenseModel.js"

export async function myApprovals(req, res) {
  try {
    const rows = await getApprovalsForApprover(req.user.id)
    return res.json(rows)
  } catch {
    return res.status(500).json({ error: "Approvals fetch failed" })
  }
}

export async function actApproval(req, res) {
  const { approvalId, decision, comment, expenseId } = req.body
  if (!["APPROVED", "REJECTED"].includes(decision)) return res.status(400).json({ error: "Invalid decision" })
  try {
    await setApprovalDecision({ approvalId, status: decision, comment })
    
    // Get all approvals for this expense to check status
    const approvals = await getApprovalsForExpense(expenseId)
    
    // If any REJECTED -> expense REJECTED
    if (approvals.some((a) => a.status === "REJECTED")) {
      await setExpenseStatus(expenseId, "REJECTED")
    } 
    // If all APPROVED -> expense APPROVED
    else if (approvals.every((a) => a.status === "APPROVED")) {
      await setExpenseStatus(expenseId, "APPROVED")
    }
    // Otherwise, expense stays PENDING (waiting for other approvals)
    
    return res.json({ ok: true })
  } catch (error) {
    console.error("Approval action failed:", error)
    return res.status(500).json({ error: "Approval action failed" })
  }
}

export async function getAllExpensesForApproval(req, res) {
  try {
    let expenses
    if (req.user.role === 'ADMIN') {
      // Admins can see all expenses in the company
      expenses = await getAllExpenses(req.user.company_id)
    } else if (req.user.role === 'MANAGER') {
      // Managers can see expenses from their team and all manager/admin expenses
      expenses = await getExpensesForManager(req.user.id)
    } else {
      return res.status(403).json({ error: "Access denied" })
    }
    
    // Get approval details for each expense
    const expensesWithApprovals = await Promise.all(
      expenses.map(async (expense) => {
        const approvals = await getApprovalsForExpenseWithDetails(expense.id)
        return {
          ...expense,
          approvals
        }
      })
    )
    
    return res.json(expensesWithApprovals)
  } catch (error) {
    console.error("Get expenses failed:", error)
    return res.status(500).json({ error: "Failed to fetch expenses" })
  }
}
