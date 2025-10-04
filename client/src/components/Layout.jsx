import { NavLink, useNavigate } from "react-router-dom"
import { logout } from "../services/auth"
import "../styles/main.css"

export default function Layout({ children, role }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <strong>Expense</strong>
        <nav className="nav" style={{ display: "block", marginTop: "1rem" }}>
          <NavLink to="/dashboard">Dashboard</NavLink>
          {role === "EMPLOYEE" && <NavLink to="/expenses/new">New Expense</NavLink>}
          <NavLink to="/expenses">My Expenses</NavLink>
          {(role === "MANAGER" || role === "ADMIN") && <NavLink to="/approvals">Approvals</NavLink>}
          {role === "ADMIN" && <NavLink to="/admin">Admin</NavLink>}
        </nav>
      </aside>
      <main className="main">
        <header className="header">
          <div>Expense Management</div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "var(--muted)" }}>{role}</span>
            <button className="btn danger" onClick={handleLogout} style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
              Logout
            </button>
          </div>
        </header>
        <div className="container">{children}</div>
      </main>
    </div>
  )
}
