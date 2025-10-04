"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { api, setAuthToken } from "../services/api"
import { getToken, me } from "../services/auth"

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
  return (
    <Layout role={user.role}>
      <div className="card">
        <h3>My Expenses</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.expense_date}</td>
                <td>{r.category}</td>
                <td>
                  {r.amount} {r.currency}
                </td>
                <td>
                  <span className={`badge status-${r.status.toLowerCase()}`}>{r.status}</span>
                </td>
                <td>
                  {r.receipt_url ? (
                    <a href={`http://localhost:5000${r.receipt_url}`} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
