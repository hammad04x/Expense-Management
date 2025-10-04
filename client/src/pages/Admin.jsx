"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { api, setAuthToken } from "../services/api"
import { getToken, me } from "../services/auth"
import Icon from "../components/Icons"

export default function Admin() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: "", email: "", password: "user123", role: "EMPLOYEE", managerId: "" })

  useEffect(() => {
    const t = getToken()
    if (t) setAuthToken(t)
    me().then(setUser)
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const r = await api.get("/users")
      setUsers(r.data)
    } catch (error) {
      console.error("Failed to load users:", error)
    }
  }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function createUser(e) {
    e.preventDefault()
    try {
      await api.post("/users", { ...form, managerId: form.managerId ? Number(form.managerId) : null })
      setForm({ name: "", email: "", password: "user123", role: "EMPLOYEE", managerId: "" })
      loadUsers()
    } catch (error) {
      console.error("Failed to create user:", error)
    }
  }

  async function updateRole(u, role) {
    try {
      await api.put("/users/role", { userId: u.id, role, managerId: u.manager_id })
      loadUsers()
    } catch (error) {
      console.error("Failed to update role:", error)
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN": return "danger"
      case "MANAGER": return "primary"
      case "EMPLOYEE": return "success"
      default: return "secondary"
    }
  }

  if (!user) return null
  return (
    <Layout role={user.role}>
      <div className="grid">
        <div className="card">
          <h3>
<Icon name="user" size={20} color="var(--primary-600)" />
            Create New User
          </h3>
          <form onSubmit={createUser}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  className="input" 
                  name="name" 
                  placeholder="Enter full name" 
                  value={form.name} 
                  onChange={onChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  className="input" 
                  name="email" 
                  placeholder="Enter email address" 
                  type="email" 
                  value={form.email} 
                  onChange={onChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  className="input" 
                  name="password" 
                  placeholder="Enter password" 
                  value={form.password} 
                  onChange={onChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="select" name="role" value={form.role} onChange={onChange}>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Manager (Optional)</label>
                <select className="select" name="managerId" value={form.managerId} onChange={onChange}>
                  <option value="">No Manager</option>
                  {users
                    .filter((u) => u.role === "MANAGER" || u.role === "ADMIN")
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <button className="btn" style={{ width: "100%", marginTop: "var(--space-4)" }}>
              ➕ Create User
            </button>
          </form>
        </div>
        
        <div className="card">
          <h3>
            <span className="icon">👥</span>
            User Management
          </h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Manager</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                        <div style={{ 
                          width: "40px", 
                          height: "40px", 
                          background: "var(--primary-100)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          fontWeight: "600",
                          color: "var(--primary-700)"
                        }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", color: "var(--gray-900)" }}>{u.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ color: "var(--gray-700)" }}>{u.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${getRoleColor(u.role)}`}>
                        {u.role === "ADMIN" && <Icon name="admin" size={16} color="var(--primary-600)" />}
                        {u.role === "MANAGER" && <Icon name="manager" size={16} color="var(--primary-600)" />}
                        {u.role === "EMPLOYEE" && <Icon name="employee" size={16} color="var(--primary-600)" />}
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ color: "var(--gray-700)" }}>
                        {u.manager_id ? users.find(m => m.id === u.manager_id)?.name || `ID: ${u.manager_id}` : "-"}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "var(--space-2)" }}>
                        <button 
                          className={`btn btn-sm ${u.role === "EMPLOYEE" ? "success" : "secondary"}`}
                          onClick={() => updateRole(u, "EMPLOYEE")}
                          disabled={u.role === "EMPLOYEE"}
                        >
<Icon name="employee" size={14} color="var(--gray-500)" /> EMP
                        </button>
                        <button 
                          className={`btn btn-sm ${u.role === "MANAGER" ? "success" : "secondary"}`}
                          onClick={() => updateRole(u, "MANAGER")}
                          disabled={u.role === "MANAGER"}
                        >
<Icon name="manager" size={14} color="var(--gray-500)" /> MGR
                        </button>
                        <button 
                          className={`btn btn-sm ${u.role === "ADMIN" ? "success" : "secondary"}`}
                          onClick={() => updateRole(u, "ADMIN")}
                          disabled={u.role === "ADMIN"}
                        >
<Icon name="admin" size={14} color="var(--gray-500)" /> ADM
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
