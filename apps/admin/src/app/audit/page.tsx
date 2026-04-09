"use client";

import { useEffect, useState, useCallback } from "react";

interface AuditRow {
  id:          string;
  case_id:     string;
  case_number: string;
  event_type:  string;
  actor:       string;
  description: string;
  created_at:  string;
}

const EVENT_BADGE: Record<string, string> = {
  status_change: "badge badge-blue",
  ai_analysis:   "badge badge-gray",
  escalation:    "badge badge-yellow",
  rejection:     "badge badge-red",
  resolution:    "badge badge-green",
  case_created:  "badge badge-gray",
};

function exportCSV(rows: AuditRow[]) {
  const headers = ["ID", "Case #", "Event", "Actor", "Description", "Timestamp"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [r.id, r.case_number, r.event_type, r.actor, `"${r.description.replace(/"/g, '""')}"`, r.created_at].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = `audit_log_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function AuditPage() {
  const [rows,      setRows]      = useState<AuditRow[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [caseNum,   setCaseNum]   = useState("");
  const [eventType, setEventType] = useState("");
  const [actor,     setActor]     = useState("");
  const [page,      setPage]      = useState(1);
  const PAGE_SIZE = 50;

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const casesRes = await fetch("/api/v1/cases?limit=200", {
        headers: { Authorization: `Bearer ${localStorage.getItem("ld_admin_token") ?? ""}` },
      });
      if (!casesRes.ok) throw new Error("Failed to load cases");
      const casesData = await casesRes.json();
      const cases = casesData.items ?? [];
      const allRows: AuditRow[] = [];
      await Promise.allSettled(
        cases.slice(0, 50).map(async (c: { id: string; case_number: string }) => {
          const res = await fetch(`/api/v1/cases/${c.id}/audit`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("ld_admin_token") ?? ""}` },
          });
          if (!res.ok) return;
          const events = await res.json();
          for (const ev of events) allRows.push({ ...ev, case_number: c.case_number });
        })
      );
      allRows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRows(allRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audit log");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((r) => {
    if (caseNum   && !r.case_number.toLowerCase().includes(caseNum.toLowerCase())) return false;
    if (eventType && r.event_type !== eventType) return false;
    if (actor     && !r.actor.toLowerCase().includes(actor.toLowerCase())) return false;
    return true;
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const uniqueTypes = [...new Set(rows.map((r) => r.event_type))].sort();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Toolbar */}
      <div className="mac-toolbar" style={{ flexWrap: "wrap" }}>
        <input type="search" className="mac-input" style={{ width: 120 }}
          placeholder="Case #" value={caseNum}
          onChange={(e) => { setCaseNum(e.target.value); setPage(1); }} />
        <select className="mac-input" style={{ width: 180 }}
          value={eventType} onChange={(e) => { setEventType(e.target.value); setPage(1); }}>
          <option value="">All event types</option>
          {uniqueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="search" className="mac-input" style={{ width: 140 }}
          placeholder="Actor" value={actor}
          onChange={(e) => { setActor(e.target.value); setPage(1); }} />
        <span style={{ marginLeft: "auto", fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#555" }}>
          {filtered.length} events
        </span>
        <button onClick={() => exportCSV(filtered)} className="mac-btn" disabled={filtered.length === 0}>
          Export CSV
        </button>
        <button onClick={load} className="mac-btn">Refresh</button>
      </div>

      {/* Table */}
      <div className="card p-0" style={{ overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: 20, fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#555" }}>Loading audit events…</p>
        ) : error ? (
          <p style={{ padding: 20, fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#880000" }}>{error}</p>
        ) : (
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Case #</th>
                <th>Event</th>
                <th>Actor</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: 20, fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#888" }}>
                  No audit events found
                </td></tr>
              )}
              {paginated.map((row) => (
                <tr key={row.id}>
                  <td><span style={{ fontFamily: '"Monaco", monospace', fontSize: 10, whiteSpace: "nowrap", color: "#555" }}>{new Date(row.created_at).toLocaleString()}</span></td>
                  <td><span style={{ fontFamily: '"Monaco", monospace', fontSize: 10 }}>{row.case_number}</span></td>
                  <td><span className={EVENT_BADGE[row.event_type] ?? "badge badge-gray"}>{row.event_type}</span></td>
                  <td style={{ fontSize: 11, color: "#333" }}>{row.actor}</td>
                  <td style={{ fontSize: 11, color: "#555", maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row.description}>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="mac-btn">← Previous</button>
          <span style={{ fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#555" }}>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="mac-btn">Next →</button>
        </div>
      )}
    </div>
  );
}
