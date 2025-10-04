import { useState } from "react"
import Icon from "./Icons"

export default function ReceiptModal({ receiptUrl, onClose }) {
  if (!receiptUrl) return null
  
  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "var(--space-4)"
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: "white",
          borderRadius: "var(--radius-lg)",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          position: "sticky",
          top: 0,
          background: "white",
          padding: "var(--space-4)",
          borderBottom: "1px solid var(--gray-200)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1
        }}>
          <h3 style={{ margin: 0 }}>Receipt Image</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "var(--space-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-md)",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--gray-100)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            <Icon name="rejected" size={24} color="var(--gray-600)" />
          </button>
        </div>
        <div style={{ padding: "var(--space-4)" }}>
          <img 
            src={`http://localhost:5000${receiptUrl}`}
            alt="Receipt"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "var(--radius-md)"
            }}
          />
        </div>
      </div>
    </div>
  )
}