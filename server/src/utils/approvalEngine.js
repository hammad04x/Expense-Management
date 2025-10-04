import { getRulesForCompany } from "../models/ruleModel.js"
import { getUserById, listUsers } from "../models/userModel.js"
import { createApproval } from "../models/approvalModel.js"

export async function generateApprovalChain({ companyId, submitterId, amount, expenseId }) {
  // Hierarchical approval: Level 1 -> MANAGER, Level 2 -> ADMIN
  const rules = await getRulesForCompany(companyId)
  const submitter = await getUserById(submitterId)
  const companyUsers = await listUsers(companyId)

  for (const rule of rules) {
    if (rule.role_required === "MANAGER") {
      // Find all managers in the company
      const managers = companyUsers.filter(user => user.role === 'MANAGER')
      for (const manager of managers) {
        await createApproval(expenseId, manager.id, rule.level)
      }
    } else if (rule.role_required === "ADMIN") {
      // Find all admins in the company
      const admins = companyUsers.filter(user => user.role === 'ADMIN')
      for (const admin of admins) {
        await createApproval(expenseId, admin.id, rule.level)
      }
    }
  }
}
