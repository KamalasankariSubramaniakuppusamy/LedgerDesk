"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("admin@ledgerdesk.dev");
  const [password, setPassword] = useState("demo123");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem("ld_admin_token", res.access_token);
      const me = await authApi.me();
      if (!["admin", "supervisor"].includes(me.role)) {
        localStorage.removeItem("ld_admin_token");
        setError("Access denied. Admin or supervisor role required.");
        return;
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mac-desktop" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="mac-dialog" style={{ width: 360 }}>
        {/* Title bar */}
        <div className="mac-dialog-titlebar">
          <span className="mac-widget" />
          <span style={{
            flex: 1, textAlign: "center",
            fontFamily: '"Chicago", "Charcoal", "Geneva", sans-serif',
            fontSize: 12, fontWeight: "bold", color: "#000",
          }}>
            LedgerDesk Admin — Sign In
          </span>
        </div>

        {/* Body */}
        <div className="mac-dialog-body">
          {/* Icon row */}
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 48, height: 48, background: "#880000", border: "2px solid #000",
              boxShadow: "inset 1px 1px 0 #CC4444, inset -1px -1px 0 #440000",
              fontFamily: '"Chicago", sans-serif', fontSize: 11, fontWeight: "bold", color: "#fff",
              letterSpacing: 1,
            }}>
              ADMIN
            </div>
            <p style={{ marginTop: 6, fontFamily: '"Chicago", "Charcoal", sans-serif', fontSize: 11, fontWeight: "bold", color: "#000" }}>
              LedgerDesk Administration
            </p>
            <p style={{ fontSize: 10, color: "#888", fontFamily: '"Geneva", sans-serif', marginTop: 2 }}>
              Restricted access — authorized personnel only
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 10 }}>
              <label className="mac-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mac-input"
                required
                autoFocus
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="mac-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mac-input"
                required
              />
            </div>

            {error && (
              <div style={{
                background: "#FFE8E8", border: "1px solid #880000", color: "#880000",
                padding: "4px 8px", fontSize: 11, marginBottom: 12,
                fontFamily: '"Geneva", sans-serif',
              }}>
                ⚠ {error}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" disabled={loading} className="mac-btn-default">
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </div>
          </form>

          <hr style={{ margin: "12px 0" }} />
          <p style={{ fontSize: 10, color: "#555", fontFamily: '"Geneva", sans-serif', textAlign: "center" }}>
            admin@ledgerdesk.dev / demo123
          </p>
          <p style={{ fontSize: 10, color: "#555", fontFamily: '"Geneva", sans-serif', textAlign: "center" }}>
            supervisor@ledgerdesk.dev / demo123
          </p>
          <p style={{ fontSize: 10, color: "#555", fontFamily: '"Geneva", sans-serif', textAlign: "center", marginTop: 6 }}>
            Analyst portal:{" "}
            <a href="http://localhost:3000" style={{ color: "#000080", textDecoration: "underline" }}>
              localhost:3000
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
