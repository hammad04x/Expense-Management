import { getApprovalsForApprover, setApprovalDecision, getApprovalsForExpense, getApprovalsForExpenseWithDetails, getVisibleApprovalsForApprover } from "../models/approvalModel.js"
import { setExpenseStatus, getAllExpenses, getExpensesForManager } from "../models/expenseModel.js"

export async function myApprovals(req, res) {
  try {
    // Use the new sequential workflow function
    const rows = await getVisibleApprovalsForApprover(req.user.id, req.user.role)
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
    
    // Get the current approval that was just decided
    const currentApproval = approvals.find(a => a.id === approvalId)
    
    if (currentApproval) {
      if (currentApproval.level === 1) {
        // Manager decision
        if (decision === "REJECTED") {
          // Manager rejected - create admin approval for override capability
          const adminApprovals = approvals.filter(a => a.level === 2)
          if (adminApprovals.length === 0) {
            const { createNextLevelApprovals } = await import("../utils/approvalEngine.js")
            const { getExpenseById } = await import("../models/expenseModel.js")
            const { getUserById } = await import("../models/userModel.js")
            
            const expense = await getExpenseById(expenseId)
            const submitter = await getUserById(expense.user_id)
            
            // Create level 2 (admin) approvals for override
            await createNextLevelApprovals({
              companyId: submitter.company_id,
              submitterId: expense.user_id,
              amount: expense.amount,
              expenseId: expenseId,
              level: 2
            })
          }
          // Don't set expense status yet - wait for admin decision
        } else if (decision === "APPROVED") {
          // Manager approved - create admin approval for final approval
          const adminApprovals = approvals.filter(a => a.level === 2)
          if (adminApprovals.length === 0) {
            const { createNextLevelApprovals } = await import("../utils/approvalEngine.js")
            const { getExpenseById } = await import("../models/expenseModel.js")
            const { getUserById } = await import("../models/userModel.js")
            
            const expense = await getExpenseById(expenseId)
            const submitter = await getUserById(expense.user_id)
            
            // Create level 2 (admin) approvals
            await createNextLevelApprovals({
              companyId: submitter.company_id,
              submitterId: expense.user_id,
              amount: expense.amount,
              expenseId: expenseId,
              level: 2
            })
          }
        }
      } else if (currentApproval.level === 2) {
        // Admin decision - final decision
        if (decision === "REJECTED") {
          // Admin rejected - expense is rejected (regardless of manager decision)
          await setExpenseStatus(expenseId, "REJECTED")
        } else if (decision === "APPROVED") {
          // Admin approved - expense is approved (regardless of manager decision)
          await setExpenseStatus(expenseId, "APPROVED")
        }
      }
    }
    
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
    
    // Get approval details for each expense and determine the effective status
    const expensesWithApprovals = await Promise.all(
      expenses.map(async (expense) => {
        const approvals = await getApprovalsForExpenseWithDetails(expense.id)
        
        // Determine the effective status based on approvals
        let effectiveStatus = expense.status
        
        if (approvals.length > 0) {
          const hasPendingApprovals = approvals.some(a => a.status === 'PENDING')
          const hasRejectedApprovals = approvals.some(a => a.status === 'REJECTED')
          const hasApprovedApprovals = approvals.some(a => a.status === 'APPROVED')
          
          if (hasPendingApprovals) {
            effectiveStatus = 'PENDING'
          } else if (hasRejectedApprovals) {
            effectiveStatus = 'REJECTED'
          } else if (hasApprovedApprovals) {
            effectiveStatus = 'APPROVED'
          }
        }
        
        return {
          ...expense,
          status: effectiveStatus,
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
