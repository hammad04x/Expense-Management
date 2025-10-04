"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { signup } from "../services/auth"

export default function Signup() {
  const [companyName, setCompanyName] = useState("New Co")
  const [defaultCurrency, setDefaultCurrency] = useState("USD")
  const [name, setName] = useState("Your Name")
  const [email, setEmail] = useState("you@example.com")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const nav = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    try {
      await signup({ companyName, defaultCurrency, name, email, password })
      nav("/dashboard")
    } catch {
      setError("Signup failed")
    }
  }

  return (
    <div className="container" style={{ maxWidth: 520, marginTop: "8vh" }}>
      <div className="card">
        <h2>Create Company</h2>
        {error && <div className="badge status-rejected">{error}</div>}
        <form onSubmit={onSubmit} className="grid grid-2">
          <input
            className="input"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Default Currency"
            value={defaultCurrency}
            onChange={(e) => setDefaultCurrency(e.target.value)}
          />
          <input className="input" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" style={{ gridColumn: "1/-1" }}>
            Create
          </button>
        </form>
        <p style={{ marginTop: ".5rem" }}>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
