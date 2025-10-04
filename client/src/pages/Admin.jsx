"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { api, setAuthToken } from "../services/api"
import { getToken, me } from "../services/auth"

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
          <h3>Create New User</h3>
          <form className="grid grid-2" onSubmit={createUser}>
            <input className="input" name="name" placeholder="Name" value={form.name} onChange={onChange} required />
            <input className="input" name="email" placeholder="Email" type="email" value={form.email} onChange={onChange} required />
            <input className="input" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
            <select className="select" name="role" value={form.role} onChange={onChange}>
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
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
            <button className="btn" style={{ gridColumn: "1/-1" }}>
              Create User
            </button>
          </form>
        </div>
        <div className="card">
          <h3>User Management</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Manager</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${getRoleColor(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.manager_id ? users.find(m => m.id === u.manager_id)?.name || u.manager_id : "-"}</td>
                  <td style={{ display: "flex", gap: ".5rem" }}>
                    <button className="btn" onClick={() => updateRole(u, "EMPLOYEE")}>
                      EMP
                    </button>
                    <button className="btn" onClick={() => updateRole(u, "MANAGER")}>
                      MGR
                    </button>
                    <button className="btn" onClick={() => updateRole(u, "ADMIN")}>
                      ADM
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
