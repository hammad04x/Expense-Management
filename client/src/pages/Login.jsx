"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { login } from "../services/auth"
import "../styles/main.css"
import Icon from "../components/Icons"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, var(--primary-700) 0%, var(--primary-900) 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-4)"
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "420px",
        background: "white",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-8)",
        boxShadow: "var(--shadow-xl)",
        border: "1px solid var(--gray-200)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
        <div style={{
          width: "80px",
          height: "80px",
          background: "linear-gradient(135deg, var(--primary-600), var(--primary-700))",
          borderRadius: "var(--radius-xl)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.5rem",
          margin: "0 auto var(--space-4)",
          boxShadow: "var(--shadow-lg)"
        }}>
          <Icon name="company" size={40} color="white" />
        </div>
          <h1 style={{ 
            margin: 0, 
            color: "var(--gray-900)", 
            fontSize: "2rem", 
            fontWeight: "700",
            background: "linear-gradient(135deg, var(--primary-700), var(--primary-900))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            ExpensePro
          </h1>
          <p style={{ margin: "var(--space-2) 0 0", color: "var(--gray-600)" }}>
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {error && (
          <div style={{ 
            background: "var(--error-50)", 
            color: "var(--error-700)", 
            padding: "var(--space-3)", 
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--space-4)",
            border: "1px solid var(--error-200)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)"
          }}>
            <Icon name="warning" size={20} color="var(--error-600)" />
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              className="input" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: "var(--space-10)" }}
            />
            <div style={{ 
              position: "absolute", 
              left: "var(--space-3)", 
              top: "50%", 
              transform: "translateY(-50%)",
              color: "var(--gray-400)"
            }}>
              📧
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="input"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: "var(--space-10)" }}
            />
            <div style={{ 
              position: "absolute", 
              left: "var(--space-3)", 
              top: "50%", 
              transform: "translateY(-50%)",
              color: "var(--gray-400)"
            }}>
              🔒
            </div>
          </div>
          
          <button className="btn" style={{ width: "100%", marginTop: "var(--space-2)" }}>
            🚀 Sign In
          </button>
        </form>

        <div style={{ 
          textAlign: "center", 
          marginTop: "var(--space-6)", 
          paddingTop: "var(--space-4)",
          borderTop: "1px solid var(--gray-200)"
        }}>
          <p style={{ margin: 0, color: "var(--gray-600)" }}>
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              style={{ 
                color: "var(--primary-600)", 
                fontWeight: "600",
                textDecoration: "none"
              }}
            >
              Create one here
            </Link>
          </p>
        </div>

       
      </div>
    </div>
  )
}
