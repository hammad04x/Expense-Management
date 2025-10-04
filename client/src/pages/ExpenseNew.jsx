"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import Tesseract from "tesseract.js"
import { api, setAuthToken } from "../services/api"
import { getToken, me } from "../services/auth"

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
        <h3>New Expense</h3>
        <form className="grid grid-2" onSubmit={onSubmit}>
          <input className="input" name="amount" placeholder="Amount" value={form.amount} onChange={onChange} />
          <input className="input" name="currency" placeholder="Currency" value={form.currency} onChange={onChange} />
          <input className="input" name="category" placeholder="Category" value={form.category} onChange={onChange} />
          <input className="input" name="expense_date" type="date" value={form.expense_date} onChange={onChange} />
          <textarea
            className="textarea"
            name="description"
            placeholder="Description"
            style={{ gridColumn: "1/-1" }}
            value={form.description}
            onChange={onChange}
          />
          <input className="input" type="file" accept="image/*" onChange={onFile} style={{ gridColumn: "1/-1" }} />
          <div style={{ gridColumn: "1/-1", display: "flex", gap: ".5rem", alignItems: "center" }}>
            <button className="btn">Submit</button>
            {ocrStatus && <span className="badge">{ocrStatus}</span>}
          </div>
        </form>
      </div>
    </Layout>
  )
}
