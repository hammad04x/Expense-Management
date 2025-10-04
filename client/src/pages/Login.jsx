"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { login } from "../services/auth"
import "../styles/main.css"

export default function Login() {
  const [email, setEmail] = useState("admin@acme.com")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const nav = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    try {
      await login(email, password)
      nav("/dashboard")
    } catch {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: "10vh" }}>
      <div className="card">
        <h2>Login</h2>
        {error && <div className="badge status-rejected">{error}</div>}
        <form onSubmit={onSubmit} className="grid">
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn">Login</button>
        </form>
        <p style={{ marginTop: ".5rem" }}>
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
