interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
}

export function MetricCard({ label, value, subtitle }: MetricCardProps) {
  return (
    <div className="card" style={{ padding: 0 }}>
      <div className="card-header">
        <h3>{label}</h3>
      </div>
      <div style={{ padding: "8px 10px" }}>
        <p style={{ fontFamily: '"Monaco", "Courier New", monospace', fontSize: 22, fontWeight: "bold", color: "#000080", lineHeight: 1.2 }}>
          {value}
        </p>
        {subtitle && (
          <p style={{ fontFamily: '"Geneva", sans-serif', fontSize: 10, color: "#555", marginTop: 3 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
