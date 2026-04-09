"use client";

import { useEffect, useState } from "react";
import { casesApi, usersApi, policiesApi } from "@/lib/api";

export default function AdminDashboard() {
  const [totalCases,    setTotalCases]    = useState<number | "…">("…");
  const [escalated,     setEscalated]     = useState<number | "…">("…");
  const [totalUsers,    setTotalUsers]    = useState<number | "…">("…");
  const [totalPolicies, setTotalPolicies] = useState<number | "…">("…");

  useEffect(() => {
    casesApi.list({ limit: 1 }).then((r) => setTotalCases(r.total)).catch(() => {});
    casesApi.list({ status: "escalated", limit: 1 }).then((r) => setEscalated(r.total)).catch(() => {});
    usersApi.list().then((u) => setTotalUsers(u.length)).catch(() => {});
    policiesApi.list().then((p) => setTotalPolicies(p.length)).catch(() => {});
  }, []);

  const metrics = [
    { label: "Total Cases",     value: totalCases,    sub: "all time",          color: "#000080" },
    { label: "Escalated",       value: escalated,     sub: "needs review",      color: "#880000" },
    { label: "Users",           value: totalUsers,    sub: "registered",        color: "#000" },
    { label: "Active Policies", value: totalPolicies, sub: "in knowledge base", color: "#006400" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {metrics.map((m) => (
          <div key={m.label} className="card" style={{ padding: 0 }}>
            <div className="card-header"><h3>{m.label}</h3></div>
            <div style={{ padding: "8px 10px" }}>
              <p style={{ fontFamily: '"Monaco", "Courier New", monospace', fontSize: 28, fontWeight: "bold", color: m.color, lineHeight: 1 }}>
                {m.value}
              </p>
              <p style={{ fontFamily: '"Geneva", sans-serif', fontSize: 10, color: "#555", marginTop: 3 }}>{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {[
          { href: "/users",    title: "User Management",   desc: `${totalUsers} registered users` },
          { href: "/policies", title: "Policy Management", desc: `${totalPolicies} active documents` },
          { href: "/audit",    title: "Audit Log",         desc: "Full event history" },
        ].map((item) => (
          <a key={item.href} href={item.href} style={{ textDecoration: "none" }}>
            <div className="card" style={{ padding: 0, cursor: "default" }}>
              <div className="card-header"><h3>{item.title}</h3></div>
              <div style={{ padding: "8px 10px" }}>
                <p style={{ fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#555", marginBottom: 6 }}>{item.desc}</p>
                <span style={{ fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#000080", fontWeight: "bold" }}>Open →</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Warning banner */}
      <div style={{ background: "#FFFFF0", border: "1px solid #8B6914", color: "#8B6914", padding: "6px 10px", fontFamily: '"Geneva", sans-serif', fontSize: 11 }}>
        ▲ <strong>Admin portal</strong> — actions taken here are logged and audited. Use with care. Authorized personnel only.
      </div>
    </div>
  );
}
