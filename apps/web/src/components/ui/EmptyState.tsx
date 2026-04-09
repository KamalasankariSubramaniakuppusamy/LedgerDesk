interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="card" style={{ textAlign: "center", padding: "32px 20px" }}>
      <div style={{
        width: 40, height: 40, margin: "0 auto 12px",
        background: "#D4D0C8", border: "1px solid #000",
        boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #888",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20,
      }}>
        ◻
      </div>
      <p style={{ fontFamily: '"Chicago", "Charcoal", sans-serif', fontSize: 12, fontWeight: "bold", color: "#000", marginBottom: 6 }}>
        {title}
      </p>
      <p style={{ fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#555", maxWidth: 280, margin: "0 auto" }}>
        {description}
      </p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
