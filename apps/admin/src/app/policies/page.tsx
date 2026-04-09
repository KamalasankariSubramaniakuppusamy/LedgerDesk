"use client";

import { useEffect, useState, FormEvent } from "react";
import { policiesApi, type Policy, type PolicyDetail, type PolicyPayload } from "@/lib/api";

function PolicyModal({ initial, onClose, onSaved }: { initial?: PolicyDetail; onClose: () => void; onSaved: (p: Policy) => void }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<PolicyPayload>({
    title: initial?.title ?? "", category: initial?.category ?? "Transaction Exceptions",
    version: initial?.version ?? "1.0", content: initial?.content ?? "", metadata: null,
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      let result: { id: string; title: string };
      if (isEdit && initial) result = await policiesApi.update(initial.id, form);
      else                   result = await policiesApi.create(form);
      onSaved({ id: result.id, title: form.title, category: form.category, version: form.version, is_active: true, created_at: new Date().toISOString() });
    } catch (err) { setError(err instanceof Error ? err.message : "Save failed"); }
    finally { setLoading(false); }
  }

  return (
    <div className="mac-modal-backdrop" onClick={onClose}>
      <div className="mac-dialog" style={{ width: 540, maxHeight: "90vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        <div className="mac-dialog-titlebar">
          <span className="mac-widget" onClick={onClose} />
          <span style={{ flex: 1, textAlign: "center", fontFamily: '"Chicago", "Charcoal", sans-serif', fontSize: 12, fontWeight: "bold" }}>
            {isEdit ? `Edit Policy` : "New Policy Document"}
          </span>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div className="mac-dialog-body" style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label className="mac-label">Title</label>
                <input className="mac-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="mac-label">Category</label>
                <input className="mac-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              </div>
            </div>
            <div style={{ width: 120 }}>
              <label className="mac-label">Version</label>
              <input className="mac-input" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} required />
            </div>
            <div>
              <label className="mac-label">Content (Markdown / Plain Text)</label>
              <textarea className="mac-input" rows={12} style={{ fontFamily: '"Monaco", monospace', fontSize: 11 }}
                value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </div>
            {error && <div style={{ background: "#FFE8E8", border: "1px solid #880000", color: "#880000", padding: "4px 8px", fontSize: 11, fontFamily: '"Geneva", sans-serif' }}>⚠ {error}</div>}
          </div>
          <div className="mac-dialog-footer">
            <button type="button" onClick={onClose} className="mac-btn">Cancel</button>
            <button type="submit" disabled={loading} className="mac-btn-default">{loading ? "Saving…" : isEdit ? "Save Changes" : "Create Policy"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ViewPolicyModal({ policy, onClose, onEdit }: { policy: PolicyDetail; onClose: () => void; onEdit: () => void }) {
  return (
    <div className="mac-modal-backdrop" onClick={onClose}>
      <div className="mac-dialog" style={{ width: 560, maxHeight: "90vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
        <div className="mac-dialog-titlebar">
          <span className="mac-widget" onClick={onClose} />
          <span style={{ flex: 1, textAlign: "center", fontFamily: '"Chicago", "Charcoal", sans-serif', fontSize: 12, fontWeight: "bold" }}>
            {policy.title}
          </span>
        </div>
        <div style={{ padding: "8px 12px", background: "#D4D0C8", borderBottom: "1px solid #888", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: '"Geneva", sans-serif', fontSize: 10, color: "#555" }}>{policy.category} · Version {policy.version}</span>
          <button onClick={onEdit} className="mac-btn" style={{ minWidth: 0, padding: "2px 10px", fontSize: 10 }}>Edit</button>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "10px 14px" }}>
          <pre style={{ fontFamily: '"Monaco", "Courier New", monospace', fontSize: 11, whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#000", margin: 0 }}>
            {policy.content}
          </pre>
        </div>
        <div className="mac-dialog-footer">
          <button onClick={onClose} className="mac-btn">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function PoliciesPage() {
  const [policies,  setPolicies]  = useState<Policy[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [viewing,   setViewing]   = useState<PolicyDetail | null>(null);
  const [editing,   setEditing]   = useState<PolicyDetail | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [search,    setSearch]    = useState("");

  useEffect(() => { policiesApi.list().then(setPolicies).finally(() => setLoading(false)); }, []);

  async function openPolicy(id: string, mode: "view" | "edit") {
    setLoadingId(id);
    try {
      const detail = await policiesApi.get(id);
      if (mode === "view") setViewing(detail);
      else                 setEditing(detail);
    } finally { setLoadingId(null); }
  }

  async function handleDeactivate(policy: Policy) {
    if (!confirm(`Deactivate "${policy.title}"?`)) return;
    await policiesApi.deactivate(policy.id);
    setPolicies((prev) => prev.map((p) => p.id === policy.id ? { ...p, is_active: false } : p));
  }

  const filtered = policies.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {showCreate && <PolicyModal onClose={() => setShowCreate(false)} onSaved={(p) => { setPolicies((prev) => [p, ...prev]); setShowCreate(false); }} />}
      {editing    && <PolicyModal initial={editing} onClose={() => setEditing(null)} onSaved={(updated) => { setPolicies((prev) => prev.map((p) => p.id === updated.id ? updated : p)); setEditing(null); }} />}
      {viewing    && <ViewPolicyModal policy={viewing} onClose={() => setViewing(null)} onEdit={() => { setEditing(viewing); setViewing(null); }} />}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="mac-toolbar" style={{ justifyContent: "space-between" }}>
          <input type="search" className="mac-input" style={{ width: 240 }}
            placeholder="Search title or category…" value={search}
            onChange={(e) => setSearch(e.target.value)} />
          <button onClick={() => setShowCreate(true)} className="mac-btn-default">+ New Policy</button>
        </div>

        <div className="card p-0" style={{ overflow: "hidden" }}>
          {loading ? (
            <p style={{ padding: 20, fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#555" }}>Loading policies…</p>
          ) : (
            <table className="data-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: 20, fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#888" }}>No policies found</td></tr>
                )}
                {filtered.map((policy) => (
                  <tr key={policy.id}>
                    <td style={{ fontWeight: "bold", fontSize: 11 }}>{policy.title}</td>
                    <td style={{ fontSize: 11, color: "#555" }}>{policy.category}</td>
                    <td><span style={{ fontFamily: '"Monaco", monospace', fontSize: 10, color: "#555" }}>v{policy.version}</span></td>
                    <td><span className={`badge ${policy.is_active ? "badge-green" : "badge-gray"}`}>{policy.is_active ? "Active" : "Inactive"}</span></td>
                    <td style={{ fontFamily: '"Monaco", monospace', fontSize: 10, color: "#555" }}>{new Date(policy.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => openPolicy(policy.id, "view")} disabled={loadingId === policy.id} className="mac-btn" style={{ minWidth: 0, padding: "1px 8px", fontSize: 10 }}>
                          {loadingId === policy.id ? "…" : "View"}
                        </button>
                        <button onClick={() => openPolicy(policy.id, "edit")} disabled={loadingId === policy.id} className="mac-btn" style={{ minWidth: 0, padding: "1px 8px", fontSize: 10 }}>Edit</button>
                        {policy.is_active && (
                          <button onClick={() => handleDeactivate(policy)} className="mac-btn-danger" style={{ minWidth: 0, padding: "1px 8px", fontSize: 10 }}>Deactivate</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
