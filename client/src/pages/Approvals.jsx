"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { api, setAuthToken } from "../services/api"
import { getToken, me } from "../services/auth"

export default function Approvals() {
  const [user, setUser] = useState(null)
  const [pendingApprovals, setPendingApprovals] = useState([])
  const [allExpenses, setAllExpenses] = useState([])
  const [comments, setComments] = useState({})

  useEffect(() => {
    const t = getToken()
    if (t) setAuthToken(t)
    me().then(setUser)
    loadData()
  }, [])

  async function loadData() {
    try {
      const [approvalsRes, expensesRes] = await Promise.all([
        api.get("/approvals"),
        api.get("/approvals/expenses")
      ])
      setPendingApprovals(approvalsRes.data)
      setAllExpenses(expensesRes.data)
    } catch (error) {
      console.error("Failed to load data:", error)
    }
  }

  async function act(approvalId, decision, expenseId) {
    const comment = comments[approvalId] || ""
    try {
      await api.post("/approvals/act", { approvalId, decision, comment, expenseId })
      loadData()
      setComments(prev => ({ ...prev, [approvalId]: "" }))
    } catch (error) {
      console.error("Failed to act on approval:", error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED": return "success"
      case "REJECTED": return "danger"
      case "PENDING": return "warning"
      default: return "secondary"
    }
  }

  if (!user) return null
  return (
    <Layout role={user.role}>
      <div className="grid">
        {/* Pending Approvals */}
        <div className="card">
          <h3>Pending Approvals</h3>
          {pendingApprovals.length === 0 ? (
            <p className="text-muted">Nothing pending.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map((r) => (
                  <tr key={r.id}>
                    <td>{r.user_name}</td>
                    <td>{r.description}</td>
                    <td>
                      {r.amount} {r.currency}
                    </td>
                    <td>{r.category}</td>
                    <td>{r.level}</td>
                    <td>
                      {/* Show manager's decision to admin */}
                      {r.level === 2 && r.prev_level_status && (
                        <div className="mb-2 p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center gap-2 mb-1">
                            <strong className="text-gray-700">Manager Decision:</strong> 
                            <span className={`badge ${getStatusColor(r.prev_level_status)}`}>
                              {r.prev_level_status}
                            </span>
                          </div>
                          {r.prev_level_comment && (
                            <div className="text-sm text-gray-600">
                              <strong>Comment:</strong> {r.prev_level_comment}
                            </div>
                          )}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                        <input
                          className="input"
                          placeholder="Comment (optional)"
                          value={comments[r.id] || ""}
                          onChange={(e) => setComments(prev => ({ ...prev, [r.id]: e.target.value }))}
                          style={{ width: "150px" }}
                        />
                        <button className="btn success" onClick={() => act(r.id, "APPROVED", r.expense_id)}>
                          Approve
                        </button>
                        <button className="btn danger" onClick={() => act(r.id, "REJECTED", r.expense_id)}>
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* All Expenses Overview */}
        <div className="card">
          <h3>All Expenses Overview</h3>
          {allExpenses.length === 0 ? (
            <p className="text-muted">No expenses found.</p>
          ) : (
            <div className="space-y-3">
              {allExpenses.map((expense) => (
                <div key={expense.id} className="border rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{expense.user_name} - {expense.description}</div>
                      <div className="text-sm text-muted">
                        Amount: {expense.amount} {expense.currency} • Category: {expense.category}
                      </div>
                      <div className="text-sm text-muted">
                        Date: {new Date(expense.expense_date).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`badge ${getStatusColor(expense.status)}`}>
                      {expense.status}
                    </span>
                  </div>
                  
                  {/* Approval Status */}
                  <div className="mt-2">
                    <div className="text-sm font-medium mb-1">Approval Status:</div>
                    <div className="space-y-1">
                      {expense.approvals?.map((approval, index) => (
                        <div key={approval.id} className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-blue-600">Level {approval.level}:</span>
                          <span className="font-medium">{approval.approver_name} ({approval.approver_role})</span>
                          <span className={`badge ${getStatusColor(approval.status)}`}>
                            {approval.status}
                          </span>
                          {approval.comment && (
                            <span className="text-muted text-xs">- {approval.comment}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
