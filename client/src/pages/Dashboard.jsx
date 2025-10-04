"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { setAuthToken } from "../services/api"
import { getToken, me } from "../services/auth"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const t = getToken()
    if (t) setAuthToken(t)
    me().then(setUser)
  }, [])
  if (!user) return null
  return (
    <Layout role={user.role}>
      <div className="grid grid-2">
        <div className="card">
          <h3>Welcome, {user.name}</h3>
          <p className="muted">Role: {user.role}</p>
          <div style={{ display: "flex", gap: ".5rem", marginTop: ".5rem" }}>
            <a className="btn" href="/expenses/new">
              New Expense
            </a>
            <a className="btn secondary" href="/expenses">
              My Expenses
            </a>
            {(user.role === "MANAGER" || user.role === "ADMIN") && (
              <a className="btn" href="/approvals">
                Approvals
              </a>
            )}
          </div>
        </div>
        <div className="card">
          <h3>Company</h3>
          <p>Company ID: {user.company_id}</p>
        </div>
      </div>
    </Layout>
  )
}
