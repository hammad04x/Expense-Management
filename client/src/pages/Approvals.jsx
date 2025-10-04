"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { api, setAuthToken } from "../services/api"
import { getToken, me } from "../services/auth"
import Icon from "../components/Icons"

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
          <h3>
<Icon name="pending" size={20} color="var(--warning-600)" />
            Pending Approvals
          </h3>
          {pendingApprovals.length === 0 ? (
            <div className="empty-state">
<Icon name="approved" size={20} color="var(--success-600)" />
              <h3>All caught up!</h3>
              <p>No pending approvals at the moment.</p>
            </div>
          ) : (
            <div className="table-container">
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
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                          <div style={{ 
                            width: "32px", 
                            height: "32px", 
                            background: "var(--primary-100)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "var(--primary-700)"
                          }}>
                            {r.user_name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: "500" }}>{r.user_name}</span>
                        </div>
                      </td>
                      <td style={{ maxWidth: "200px" }}>
                        <div style={{ fontWeight: "500", marginBottom: "var(--space-1)" }}>
                          {r.description}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
                          {new Date(r.expense_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: "600", color: "var(--primary-600)", fontSize: "1.125rem" }}>
                          {r.amount} {r.currency}
                        </div>
                      </td>
                      <td>
                        <span className="badge secondary">{r.category}</span>
                      </td>
                      <td>
                        <span className="badge primary">Level {r.level}</span>
                      </td>
                      <td style={{ minWidth: "300px" }}>
                        {/* Show manager's decision to admin */}
                        {r.level === 2 && r.prev_level_status && (
                          <div style={{ 
                            marginBottom: "var(--space-3)", 
                            padding: "var(--space-3)", 
                            background: "var(--gray-50)", 
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--gray-200)"
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                              <strong style={{ color: "var(--gray-700)", fontSize: "0.875rem" }}>Manager Decision:</strong> 
                              <span className={`badge ${getStatusColor(r.prev_level_status)}`}>
                                {r.prev_level_status}
                              </span>
                            </div>
                            {r.prev_level_comment && (
                              <div style={{ fontSize: "0.75rem", color: "var(--gray-600)" }}>
                                <strong>Comment:</strong> {r.prev_level_comment}
                              </div>
                            )}
                          </div>
                        )}
                        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                          <input
                            className="input"
                            placeholder="Add comment..."
                            value={comments[r.id] || ""}
                            onChange={(e) => setComments(prev => ({ ...prev, [r.id]: e.target.value }))}
                            style={{ flex: 1, minWidth: "120px" }}
                          />
                          <button 
                            className="btn success btn-sm" 
                            onClick={() => act(r.id, "APPROVED", r.expense_id)}
                          >
<Icon name="approved" size={16} color="white" /> Approve
                          </button>
                          <button 
                            className="btn danger btn-sm" 
                            onClick={() => act(r.id, "REJECTED", r.expense_id)}
                          >
<Icon name="rejected" size={16} color="white" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* All Expenses Overview */}
        <div className="card">
          <h3>
            <span className="icon">📋</span>
            All Expenses Overview
          </h3>
          {allExpenses.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📄</div>
              <h3>No expenses found</h3>
              <p>There are no expenses to display at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allExpenses.map((expense) => (
                <div key={expense.id} className="expense-card">
                  <div className="expense-header">
                    <div>
                      <div className="expense-title">{expense.user_name} - {expense.description}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginTop: "var(--space-1)" }}>
                        Submitted on {new Date(expense.expense_date).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`badge ${getStatusColor(expense.status)}`}>
                      {expense.status}
                    </span>
                  </div>
                  
                  <div className="expense-details">
                    <div className="expense-detail">
                      <div className="expense-detail-label">Amount</div>
                      <div className="expense-detail-value" style={{ color: "var(--primary-600)", fontWeight: "600" }}>
                        {expense.amount} {expense.currency}
                      </div>
                    </div>
                    <div className="expense-detail">
                      <div className="expense-detail-label">Category</div>
                      <div className="expense-detail-value">{expense.category}</div>
                    </div>
                    <div className="expense-detail">
                      <div className="expense-detail-label">Date</div>
                      <div className="expense-detail-value">
                        {new Date(expense.expense_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Approval Status */}
                  {expense.approvals && expense.approvals.length > 0 && (
                    <div className="approval-status">
                      <div style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "var(--space-3)", color: "var(--gray-700)" }}>
                        Approval Status:
                      </div>
                      <div className="space-y-2">
                        {expense.approvals.map((approval, index) => (
                          <div key={approval.id} className="approval-level">
                            <div className="approval-level-label">Level {approval.level}:</div>
                            <div className="approval-level-name">{approval.approver_name} ({approval.approver_role})</div>
                            <span className={`badge ${getStatusColor(approval.status)}`}>
                              {approval.status}
                            </span>
                            {approval.comment && (
                              <div className="approval-level-comment">
                                "{approval.comment}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
