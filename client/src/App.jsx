"use client"

import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import ExpenseNew from "./pages/ExpenseNew"
import ExpenseHistory from "./pages/ExpenseHistory"
import Approvals from "./pages/Approvals"
import Admin from "./pages/Admin"
import ProtectedRoute from "./components/ProtectedRoute"
import "./styles/main.css"
import { getToken } from "./services/auth"
import { setAuthToken } from "./services/api"

export default function App() {
  useEffect(() => {
    const t = getToken()
    if (t) setAuthToken(t)
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses/new"
          element={
            <ProtectedRoute>
              <ExpenseNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <ExpenseHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approvals"
          element={
            <ProtectedRoute>
              <Approvals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
