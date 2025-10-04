"use client"

import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { setAuthToken } from "../services/api"
import { getToken, me } from "../services/auth"
import { 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  BarChart3,
  User,
  Mail,
  Building2,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp
} from "lucide-react"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalExpenses: 0,
    pendingApprovals: 0,
    approvedExpenses: 0,
    rejectedExpenses: 0,
    totalAmount: 0,
    monthlySpending: 0,
    averageExpense: 0,
    approvalRate: 0
  })
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const t = getToken()
    if (t) setAuthToken(t)
    me().then(setUser)
    loadStats()
    
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  async function loadStats() {
    try {
      setStats({
        totalExpenses: 24,
        pendingApprovals: 5,
        approvedExpenses: 16,
        rejectedExpenses: 3,
        totalAmount: 12450.75,
        monthlySpending: 3200.25,
        averageExpense: 518.78,
        approvalRate: 84.2
      })
    } catch (error) {
      console.error("Failed to load stats:", error)
    }
  }

  if (!user) return null

  return (
    <Layout role={user.role}>
      {/* Header */}
      <div style={{ 
        background: "white",
        borderRadius: "12px",
        padding: "32px",
        marginBottom: "32px",
        border: "1px solid #e2e8f0"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <h1 style={{ 
              margin: "0 0 8px 0", 
              fontSize: "28px", 
              fontWeight: "600",
              color: "#0f172a",
              letterSpacing: "-0.02em"
            }}>
              Welcome back, {user.name}
            </h1>
            <p style={{ 
              margin: 0, 
              color: "#64748b",
              fontSize: "15px"
            }}>
              Track and manage your expenses efficiently
            </p>
          </div>
          <div style={{ 
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "16px 20px",
            background: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0"
          }}>
            <Clock size={20} color="#64748b" />
            <div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "2px", fontWeight: "500" }}>
                CURRENT TIME
              </div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>
                {currentTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "32px"
      }}>
        <MetricCard 
          icon={<DollarSign size={20} />}
          value={`$${stats.totalAmount.toLocaleString()}`}
          label="Total Amount"
          change={8.2}
          isPositive={true}
          bgColor="#f0fdf4"
          iconColor="#16a34a"
        />
        <MetricCard 
          icon={<FileText size={20} />}
          value={stats.totalExpenses.toString()}
          label="Total Expenses"
          change={12}
          isPositive={true}
          bgColor="#eff6ff"
          iconColor="#2563eb"
        />
        <MetricCard 
          icon={<CheckCircle size={20} />}
          value={stats.approvedExpenses.toString()}
          label="Approved"
          change={stats.approvalRate}
          isPositive={true}
          bgColor="#f0fdf4"
          iconColor="#16a34a"
        />
        <MetricCard 
          icon={<Clock size={20} />}
          value={stats.pendingApprovals.toString()}
          label="Pending Review"
          isUrgent={true}
          bgColor="#fef3c7"
          iconColor="#d97706"
        />
        <MetricCard 
          icon={<XCircle size={20} />}
          value={stats.rejectedExpenses.toString()}
          label="Rejected"
          change={-2}
          isPositive={false}
          bgColor="#fee2e2"
          iconColor="#dc2626"
        />
        <MetricCard 
          icon={<TrendingUp size={20} />}
          value={`$${stats.monthlySpending.toLocaleString()}`}
          label="This Month"
          change={5.1}
          isPositive={true}
          bgColor="#f3e8ff"
          iconColor="#9333ea"
        />
      </div>

      {/* Content Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "24px",
        marginBottom: "24px"
      }}>
        {/* Analytics */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "28px",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: "#eff6ff",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <BarChart3 size={20} color="#2563eb" />
            </div>
            <h2 style={{ 
              fontSize: "18px", 
              fontWeight: "600",
              color: "#0f172a",
              margin: 0
            }}>
              Expense Analytics
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <MetricRow label="Average Expense" value={`$${stats.averageExpense}`} />
            <MetricRow label="Approval Rate" value={`${stats.approvalRate}%`} />
            <MetricRow label="Monthly Budget" value="$5,000" />
            <MetricRow label="Budget Remaining" value="$1,799.75" />
          </div>
        </div>

        {/* Account Info */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "28px",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: "#f0fdf4",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <User size={20} color="#16a34a" />
            </div>
            <h2 style={{ 
              fontSize: "18px", 
              fontWeight: "600",
              color: "#0f172a",
              margin: 0
            }}>
              Account Details
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <InfoItem icon={<User size={18} />} label="Full Name" value={user.name} />
            <InfoItem icon={<Mail size={18} />} label="Email" value={user.email} />
            <InfoItem icon={<Award size={18} />} label="Role" value={user.role} />
            <InfoItem icon={<Building2 size={18} />} label="Company ID" value={user.company_id} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "28px",
        border: "1px solid #e2e8f0"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            background: "#fef3c7",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Clock size={20} color="#d97706" />
          </div>
          <h2 style={{ 
            fontSize: "18px", 
            fontWeight: "600",
            color: "#0f172a",
            margin: 0
          }}>
            Recent Activity
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <ActivityRow 
            icon={<CheckCircle size={18} />}
            title="Expense Approved"
            description="Lunch meeting - $45.50"
            time="2 hours ago"
            iconBg="#f0fdf4"
            iconColor="#16a34a"
          />
          <ActivityRow 
            icon={<Clock size={18} />}
            title="Expense Pending Review"
            description="Office supplies - $120.00"
            time="5 hours ago"
            iconBg="#fef3c7"
            iconColor="#d97706"
          />
          <ActivityRow 
            icon={<FileText size={18} />}
            title="New Expense Submitted"
            description="Travel expenses - $350.00"
            time="1 day ago"
            iconBg="#eff6ff"
            iconColor="#2563eb"
          />
          <ActivityRow 
            icon={<CheckCircle size={18} />}
            title="Expense Approved"
            description="Team dinner - $280.00"
            time="2 days ago"
            iconBg="#f0fdf4"
            iconColor="#16a34a"
          />
        </div>
      </div>
    </Layout>
  )
}

function MetricCard({ icon, value, label, change, isPositive, isUrgent, bgColor, iconColor }) {
  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      padding: "24px",
      border: "1px solid #e2e8f0"
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{
          width: "48px",
          height: "48px",
          background: bgColor,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor
        }}>
          {icon}
        </div>
        {(change !== undefined || isUrgent) && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "600",
            background: isUrgent ? "#fef3c7" : (isPositive ? "#f0fdf4" : "#fee2e2"),
            color: isUrgent ? "#d97706" : (isPositive ? "#16a34a" : "#dc2626")
          }}>
            {!isUrgent && (isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />)}
            {isUrgent ? "Urgent" : `${change > 0 ? "+" : ""}${change}${typeof change === 'number' && change < 100 ? '%' : ''}`}
          </div>
        )}
      </div>
      <div style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", marginBottom: "6px", letterSpacing: "-0.02em" }}>
        {value}
      </div>
      <div style={{ fontSize: "14px", fontWeight: "500", color: "#64748b" }}>
        {label}
      </div>
    </div>
  )
}

function MetricRow({ label, value }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 16px",
      background: "#f8fafc",
      borderRadius: "8px",
      border: "1px solid #f1f5f9"
    }}>
      <span style={{ fontWeight: "500", color: "#475569", fontSize: "14px" }}>
        {label}
      </span>
      <span style={{ fontWeight: "600", color: "#0f172a", fontSize: "15px" }}>
        {value}
      </span>
    </div>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ color: "#64748b" }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "2px", fontWeight: "500" }}>
          {label}
        </div>
        <div style={{ fontWeight: "500", color: "#0f172a", fontSize: "14px" }}>
          {value}
        </div>
      </div>
    </div>
  )
}

function ActivityRow({ icon, title, description, time, iconBg, iconColor }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "16px",
      background: "#f8fafc",
      borderRadius: "8px",
      border: "1px solid #f1f5f9"
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: iconBg,
        borderRadius: "8px",
        color: iconColor,
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: "500", color: "#0f172a", fontSize: "14px", marginBottom: "2px" }}>
          {title}
        </div>
        <div style={{ fontSize: "13px", color: "#64748b" }}>
          {description}
        </div>
      </div>
      <div style={{ fontSize: "13px", color: "#94a3b8", whiteSpace: "nowrap", flexShrink: 0 }}>
        {time}
      </div>
    </div>
  )
}