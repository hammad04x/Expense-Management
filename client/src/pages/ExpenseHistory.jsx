"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { api, setAuthToken } from "../services/api"
import { getToken, me } from "../services/auth"
import Icon from "../components/Icons"

export default function ExpenseHistory() {
  const [user, setUser] = useState(null)
  const [rows, setRows] = useState([])

  useEffect(() => {
    const t = getToken()
    if (t) setAuthToken(t)
    me().then(setUser)
    api.get("/expenses/mine").then((r) => setRows(r.data))
  }, [])

  if (!user) return null
  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED": return "success"
      case "REJECTED": return "danger"
      case "PENDING": return "warning"
      default: return "secondary"
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "MEALS": return "🍽️"
      case "TRAVEL": return "✈️"
      case "ACCOMMODATION": return "🏨"
      case "OFFICE": return "🏢"
      case "ENTERTAINMENT": return "🎬"
      case "TRAINING": return "📚"
      case "COMMUNICATION": return "📞"
      default: return "📋"
    }
  }

  return (
    <Layout role={user.role}>
      <div className="card">
        <h3>
<Icon name="expenses" size={20} color="var(--primary-600)" />
          My Expenses
        </h3>
        <p style={{ color: "var(--gray-600)", marginBottom: "var(--space-6)" }}>
          Track and manage all your submitted expenses.
        </p>
        
        {rows.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📄</div>
            <h3>No expenses yet</h3>
            <p>You haven't submitted any expenses yet.</p>
            <a className="btn" href="/expenses/new" style={{ marginTop: "var(--space-4)" }}>
              ➕ Submit Your First Expense
            </a>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: "500", color: "var(--gray-900)", marginBottom: "var(--space-1)" }}>
                          {r.description || "No description"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
                          ID: {r.id}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                        <span style={{ fontSize: "1.25rem" }}>{getCategoryIcon(r.category)}</span>
                        <span style={{ fontWeight: "500" }}>{r.category}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: "600", color: "var(--primary-600)", fontSize: "1.125rem" }}>
                        {r.amount} {r.currency}
                      </div>
                    </td>
                    <td>
                      <div style={{ color: "var(--gray-700)" }}>
                        {new Date(r.expense_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusColor(r.status)}`}>
                        {r.status === "APPROVED" && <Icon name="approved" size={16} color="var(--success-600)" />}
                        {r.status === "REJECTED" && <Icon name="rejected" size={16} color="var(--error-600)" />}
                        {r.status === "PENDING" && <Icon name="pending" size={16} color="var(--warning-600)" />}
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.receipt_url ? (
                        <a 
                          href={`http://localhost:5000${r.receipt_url}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn btn-sm secondary"
                          style={{ textDecoration: "none" }}
                        >
                          📄 View
                        </a>
                      ) : (
                        <span style={{ color: "var(--gray-400)" }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div style={{ 
          marginTop: "var(--space-6)", 
          paddingTop: "var(--space-4)",
          borderTop: "1px solid var(--gray-200)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ color: "var(--gray-600)", fontSize: "0.875rem" }}>
            Total: {rows.length} expense{rows.length !== 1 ? 's' : ''}
          </div>
          <a className="btn" href="/expenses/new">
            ➕ Submit New Expense
          </a>
        </div>
      </div>
    </Layout>
  )
}
