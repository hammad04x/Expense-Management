"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { signup } from "../services/auth"
import Icon from "../components/Icons"

export default function Signup() {
  const [companyName, setCompanyName] = useState("")
  const [defaultCurrency, setDefaultCurrency] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
        maxWidth: "520px",
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
            margin: "0 auto var(--space-4)"
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
            Create Company
          </h1>
          <p style={{ margin: "var(--space-2) 0 0", color: "var(--gray-600)" }}>
            Set up your company and start managing expenses.
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
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  style={{ paddingLeft: "var(--space-10)" }}
                />
                <div style={{ 
                  position: "absolute", 
                  left: "var(--space-3)", 
                  top: "50%", 
                  transform: "translateY(-50%)",
                  color: "var(--gray-400)"
                }}>
                  <Icon name="company" size={20} color="var(--gray-400)" />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Default Currency *</label>
              <select
                className="select"
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                required
              >
                <option value="USD">🇺🇸 USD - US Dollar</option>
                <option value="EUR">🇪🇺 EUR - Euro</option>
                <option value="GBP">🇬🇧 GBP - British Pound</option>
                <option value="INR">🇮🇳 INR - Indian Rupee</option>
                <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
                <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <div style={{ position: "relative" }}>
                <input 
                  className="input" 
                  placeholder="Enter your full name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ paddingLeft: "var(--space-10)" }}
                />
                <div style={{ 
                  position: "absolute", 
                  left: "var(--space-3)", 
                  top: "50%", 
                  transform: "translateY(-50%)",
                  color: "var(--gray-400)"
                }}>
                  👤
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div style={{ position: "relative" }}>
                <input 
                  className="input" 
                  placeholder="Enter email address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  style={{ paddingLeft: "var(--space-10)" }}
                />
                <div style={{ 
                  position: "absolute", 
                  left: "var(--space-3)", 
                  top: "50%", 
                  transform: "translateY(-50%)",
                  color: "var(--gray-400)"
                }}>
                  <Icon name="email" size={20} color="var(--gray-400)" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password *</label>
            <div style={{ position: "relative" }}>
              <input
                className="input"
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: "var(--space-10)" }}
              />
              <div style={{ 
                position: "absolute", 
                left: "var(--space-3)", 
                top: "50%", 
                transform: "translateY(-50%)",
                color: "var(--gray-400)"
              }}>
                <Icon name="lock" size={20} color="var(--gray-400)" />
              </div>
            </div>
          </div>
          
          <button className="btn" style={{ width: "100%", marginTop: "var(--space-2)", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)" }}>
            <Icon name="add" size={18} color="white" />
            Create Company
          </button>
        </form>

        <div style={{ 
          textAlign: "center", 
          marginTop: "var(--space-6)", 
          paddingTop: "var(--space-4)",
          borderTop: "1px solid var(--gray-200)"
        }}>
          <p style={{ margin: 0, color: "var(--gray-600)" }}>
            Already have an account?{" "}
            <Link 
              to="/login" 
              style={{ 
                color: "var(--primary-600)", 
                fontWeight: "600",
                textDecoration: "none"
              }}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
