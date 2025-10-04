"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import Tesseract from "tesseract.js"
import { api, setAuthToken } from "../services/api"
import { getToken, me } from "../services/auth"
import Icon from "../components/Icons"

export default function ExpenseNew() {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    amount: "",
    currency: "USD",
    category: "MEALS",
    description: "",
    expense_date: "",
  })
  const [file, setFile] = useState(null)
  const [ocrStatus, setOcrStatus] = useState("")

  useEffect(() => {
    const t = getToken()
    if (t) setAuthToken(t)
    me().then(setUser)
  }, [])

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function runOCR(file) {
    setOcrStatus("Reading receipt...")
    const { data } = await Tesseract.recognize(file, "eng")
    setOcrStatus("Parsing...")
    // Naive amount extraction: take the largest number
    const nums = (data.text.match(/(\d+[.,]\d{2})/g) || []).map((s) => Number(s.replace(",", ".")))
    if (nums.length) setForm((f) => ({ ...f, amount: String(Math.max(...nums)) }))
    setOcrStatus("Done")
  }

  async function onFile(e) {
    const f = e.target.files?.[0]
    setFile(f)
    if (f) await runOCR(f)
  }

  async function onSubmit(e) {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (file) fd.append("receipt", file)
    const { data } = await api.post("/expenses", fd, { headers: { "Content-Type": "multipart/form-data" } })
    window.location.href = "/expenses"
  }

  if (!user) return null
  return (
    <Layout role={user.role}>
      <div className="card">
        <h3>
          <span className="icon">➕</span>
          Submit New Expense
        </h3>
        <p style={{ color: "var(--gray-600)", marginBottom: "var(--space-6)" }}>
          Fill out the form below to submit a new expense for approval.
        </p>
        
        <form onSubmit={onSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Amount *</label>
              <div style={{ position: "relative" }}>
                <input 
                  className="input" 
                  name="amount" 
                  placeholder="0.00" 
                  value={form.amount} 
                  onChange={onChange}
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
<Icon name="money" size={24} color="var(--primary-600)" />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Currency *</label>
              <select className="select" name="currency" value={form.currency} onChange={onChange} required>
                <option value="USD">🇺🇸 USD - US Dollar</option>
                <option value="EUR">🇪🇺 EUR - Euro</option>
                <option value="GBP">🇬🇧 GBP - British Pound</option>
                <option value="INR">🇮🇳 INR - Indian Rupee</option>
                <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
                <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="select" name="category" value={form.category} onChange={onChange} required>
                <option value="MEALS">🍽️ Meals & Dining</option>
                <option value="TRAVEL">✈️ Travel & Transportation</option>
                <option value="ACCOMMODATION">🏨 Accommodation</option>
                <option value="OFFICE">🏢 Office Supplies</option>
                <option value="ENTERTAINMENT">🎬 Entertainment</option>
                <option value="TRAINING">📚 Training & Education</option>
                <option value="COMMUNICATION">📞 Communication</option>
                <option value="OTHER">📋 Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Expense Date *</label>
              <input 
                className="input" 
                name="expense_date" 
                type="date" 
                value={form.expense_date} 
                onChange={onChange}
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
                📅
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="textarea"
              name="description"
              placeholder="Describe the expense in detail..."
              value={form.description}
              onChange={onChange}
              required
              rows={4}
              style={{ paddingLeft: "var(--space-10)" }}
            />
            <div style={{ 
              position: "absolute", 
              left: "var(--space-3)", 
              top: "var(--space-3)",
              color: "var(--gray-400)"
            }}>
<Icon name="add" size={20} color="var(--primary-600)" />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Receipt (Optional)</label>
            <div style={{ 
              border: "2px dashed var(--gray-300)", 
              borderRadius: "var(--radius-md)", 
              padding: "var(--space-6)", 
              textAlign: "center",
              background: "var(--gray-50)",
              transition: "all 0.2s ease",
              cursor: "pointer",
              position: "relative"
            }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onFile} 
                style={{ 
                  position: "absolute", 
                  top: 0, 
                  left: 0, 
                  width: "100%", 
                  height: "100%", 
                  opacity: 0, 
                  cursor: "pointer" 
                }}
              />
<Icon name="file" size={48} color="var(--gray-400)" />
              <div style={{ fontWeight: "600", color: "var(--gray-700)", marginBottom: "var(--space-1)" }}>
                {file ? file.name : "Click to upload receipt"}
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>
                Supports JPG, PNG, PDF files
              </div>
            </div>
            {ocrStatus && (
              <div style={{ 
                marginTop: "var(--space-2)", 
                padding: "var(--space-2)", 
                background: "var(--primary-50)", 
                color: "var(--primary-700)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)"
              }}>
                <span className="loading"></span>
                {ocrStatus}
              </div>
            )}
          </div>
          
          <div style={{ 
            display: "flex", 
            gap: "var(--space-4)", 
            alignItems: "center", 
            marginTop: "var(--space-6)",
            paddingTop: "var(--space-4)",
            borderTop: "1px solid var(--gray-200)"
          }}>
            <button className="btn" type="submit">
              🚀 Submit Expense
            </button>
            <a className="btn secondary" href="/expenses">
              📋 View All Expenses
            </a>
          </div>
        </form>
      </div>
    </Layout>
  )
}
