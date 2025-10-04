import { NavLink, useNavigate } from "react-router-dom"
import { logout } from "../services/auth"
import "../styles/main.css"
import Icon from "./Icons"

export default function Layout({ children, role }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN": return <Icon name="admin" size={20} color="var(--primary-600)" />
      case "MANAGER": return <Icon name="manager" size={20} color="var(--primary-600)" />
      case "EMPLOYEE": return <Icon name="employee" size={20} color="var(--primary-600)" />
      default: return <Icon name="user" size={20} color="var(--primary-600)" />
    }
  }

  const getNavIcon = (path) => {
    switch (path) {
      case "/dashboard": return <Icon name="dashboard" size={20} color="currentColor" />
      case "/expenses/new": return <Icon name="add" size={20} color="currentColor" />
      case "/expenses": return <Icon name="expenses" size={20} color="currentColor" />
      case "/approvals": return <Icon name="approvals" size={20} color="currentColor" />
      case "/admin": return <Icon name="admin" size={20} color="currentColor" />
      default: return <Icon name="file" size={20} color="currentColor" />
    }
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>
            <span className="icon">
              <Icon name="company" size={24} color="white" />
            </span>
            ExpensePro
          </h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                <span className="icon">{getNavIcon("/dashboard")}</span>
                Dashboard
              </NavLink>
            </li>
            {role === "EMPLOYEE" && (
              <li>
                <NavLink to="/expenses/new" className={({ isActive }) => isActive ? "active" : ""}>
                  <span className="icon">{getNavIcon("/expenses/new")}</span>
                  New Expense
                </NavLink>
              </li>
            )}
            <li>
              <NavLink to="/expenses" className={({ isActive }) => isActive ? "active" : ""}>
                <span className="icon">{getNavIcon("/expenses")}</span>
                My Expenses
              </NavLink>
            </li>
            {(role === "MANAGER" || role === "ADMIN") && (
              <li>
                <NavLink to="/approvals" className={({ isActive }) => isActive ? "active" : ""}>
                  <span className="icon">{getNavIcon("/approvals")}</span>
                  Approvals
                </NavLink>
              </li>
            )}
            {role === "ADMIN" && (
              <li>
                <NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>
                  <span className="icon">{getNavIcon("/admin")}</span>
                  Admin Panel
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="header">
          <h1>Expense Management System</h1>
          <div className="user-info">
            <span className="user-role">
              <span style={{ marginRight: "8px" }}>{getRoleIcon(role)}</span>
              {role}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              <Icon name="logout" size={16} color="currentColor" />
              Logout
            </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}
