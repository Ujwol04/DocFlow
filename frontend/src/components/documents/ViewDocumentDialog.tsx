import type { GeneratedDocument } from "@Types/types"

const LETTERHEAD = {
  name: "DocFlow",
  tagline: "Reusable documents with dynamic fields",
  address: "Kathmandu, Nepal",
}

interface ViewDocumentDialogProps {
  document: GeneratedDocument | null
  template?: { name: string; category?: string }
  onOpenChange: (open: boolean) => void
}

export default function ViewDocumentDialog({
  document,
  template,
  onOpenChange,
}: ViewDocumentDialogProps) {
  if (!document) return null

  const entries = Object.entries(document.values).filter(([, v]) => v)

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        overflowY: "auto",
        padding: "48px 16px",
      }}
      onClick={() => onOpenChange(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          margin: "0 auto",
          width: "100%",
          maxWidth: "820px",
          minHeight: "85vh",
          background: "white",
          color: "#18181b",
          borderRadius: "4px",
          border: "1px solid #e4e4e7",
          boxShadow: "0 25px 80px -15px rgba(0,0,0,0.5)",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: "#71717a",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <div
          style={{
            padding: "56px 64px",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          {/* Letterhead */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              borderBottom: "1px solid #e4e4e7",
              paddingBottom: "32px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "36px", fontWeight: 700, margin: 0 }}>{LETTERHEAD.name}</h2>
              <p style={{ marginTop: "8px", fontSize: "14px", color: "#71717a" }}>
                {LETTERHEAD.tagline}
              </p>
            </div>
            <p style={{ fontSize: "14px", color: "#71717a", textAlign: "right", margin: 0 }}>
              {LETTERHEAD.address}
            </p>
          </div>

          {/* Document body */}
          <div
            style={{
              marginTop: "40px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ fontSize: "28px", fontWeight: 700, margin: 0 }}>{document.title}</h3>
            <span
              style={{
                border: "1px solid #d4d4d8",
                borderRadius: "9999px",
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#52525b",
              }}
            >
              {document.status}
            </span>
          </div>
          <p style={{ marginTop: "8px", fontSize: "14px", color: "#71717a" }}>
            Date: {document.date}
          </p>

          <div style={{ marginTop: "40px", fontSize: "14px" }}>
            {entries.length > 0 ? (
              entries.map(([label, value], i) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderTop: i === 0 ? "none" : "1px solid #f4f4f5",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#3f3f46" }}>{label}</span>
                  <span>{value}</span>
                </div>
              ))
            ) : (
              <p style={{ padding: "12px 0", fontStyle: "italic", color: "#a1a1aa" }}>
                No fields filled in
              </p>
            )}
          </div>

          {template && (
            <p
              style={{
                marginTop: "64px",
                borderTop: "1px solid #e4e4e7",
                paddingTop: "16px",
                fontSize: "12px",
                color: "#a1a1aa",
              }}
            >
              From template: {template.name}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}