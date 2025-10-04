import { getRulesForCompany } from "../models/ruleModel.js"
import { getUserById, listUsers } from "../models/userModel.js"
import { createApproval } from "../models/approvalModel.js"

export async function generateApprovalChain({ companyId, submitterId, amount, expenseId, startLevel = 1 }) {
  // Hierarchical approval: Level 1 -> MANAGER, Level 2 -> ADMIN
  const rules = await getRulesForCompany(companyId)
  const submitter = await getUserById(submitterId)
  const companyUsers = await listUsers(companyId)

  // Sort rules by level to ensure proper order
  const sortedRules = rules.sort((a, b) => a.level - b.level)

  for (const rule of sortedRules) {
    // Only create approvals for the specified start level
    if (rule.level !== startLevel) continue
    
    if (rule.role_required === "MANAGER") {
      // For employees: find their direct manager
      // For managers/admins: find any manager (they can approve each other)
      if (submitter.role === 'EMPLOYEE' && submitter.manager_id) {
        // Employee's direct manager
        await createApproval(expenseId, submitter.manager_id, rule.level)
      } else {
        // For managers/admins, find any manager in the company
        const managers = companyUsers.filter(user => user.role === 'MANAGER')
        if (managers.length > 0) {
          // Use the first manager found (or could be more sophisticated)
          await createApproval(expenseId, managers[0].id, rule.level)
        }
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

// New function to create only the next level approvals
export async function createNextLevelApprovals({ companyId, submitterId, amount, expenseId, level }) {
  await generateApprovalChain({ companyId, submitterId, amount, expenseId, startLevel: level })
}
