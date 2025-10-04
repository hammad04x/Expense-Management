import {
  createExpense,
  getExpenseById,
  getExpensesForUser,
  getTeamExpenses,
  getAllExpenses,
} from "../models/expenseModel.js"
import { generateApprovalChain } from "../utils/approvalEngine.js"

export async function submitExpense(req, res) {
  try {
    // Only employees can submit expenses
    if (req.user.role !== 'EMPLOYEE') {
      return res.status(403).json({ 
        error: "Access denied. Only employees can submit expense requests. Managers and admins can only review and approve expenses." 
      })
    }
    
    const { amount, currency, category, description, expense_date } = req.body
    const receipt_url = req.file ? `/uploads/${req.file.filename}` : null
    const expenseId = await createExpense({
      user_id: req.user.id,
      amount,
      currency,
      category,
      description,
      expense_date,
      receipt_url,
    })
    // Only create Level 1 (Manager) approvals initially
    await generateApprovalChain({
      companyId: req.user.company_id,
      submitterId: req.user.id,
      amount: Number(amount),
      expenseId,
      startLevel: 1
    })
    const exp = await getExpenseById(expenseId)
    return res.json(exp)
  } catch {
    return res.status(500).json({ error: "Submit expense failed" })
  }
}

export async function myExpenses(req, res) {
  try {
    const rows = await getExpensesForUser(req.user.id)
    return res.json(rows)
  } catch {
    return res.status(500).json({ error: "Fetch expenses failed" })
  }
}

export async function teamExpenses(req, res) {
  try {
    const rows = await getTeamExpenses(req.user.id)
    return res.json(rows)
  } catch {
    return res.status(500).json({ error: "Team expenses failed" })
  }
}

export async function companyExpenses(req, res) {
  try {
    const rows = await getAllExpenses(req.user.company_id)
    return res.json(rows)
  } catch {
    return res.status(500).json({ error: "Company expenses failed" })
  }
}
