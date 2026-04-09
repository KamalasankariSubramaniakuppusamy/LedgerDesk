"use client";

import { useEffect, useState, FormEvent } from "react";
import { usersApi, type User, type CreateUserPayload } from "@/lib/api";

const ROLES = ["analyst", "senior_analyst", "supervisor", "admin"];
const ROLE_BADGE: Record<string, string> = {
  admin:          "badge badge-red",
  supervisor:     "badge badge-yellow",
  senior_analyst: "badge badge-blue",
  analyst:        "badge badge-gray",
};

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: (u: User) => void }) {
  const [form, setForm] = useState<CreateUserPayload>({ email: "", full_name: "", role: "analyst", password: "demo123" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try { onCreated(await usersApi.create(form)); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to create user"); }
    finally { setLoading(false); }
  }

  return (
    <div className="mac-modal-backdrop" onClick={onClose}>
      <div className="mac-dialog" style={{ width: 360 }} onClick={(e) => e.stopPropagation()}>
        <div className="mac-dialog-titlebar">
          <span className="mac-widget" onClick={onClose} />
          <span style={{ flex: 1, textAlign: "center", fontFamily: '"Chicago", "Charcoal", sans-serif', fontSize: 12, fontWeight: "bold" }}>Add New User</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mac-dialog-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label className="mac-label">Full Name</label>
              <input className="mac-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
            </div>
            <div>
              <label className="mac-label">Email Address</label>
              <input type="email" className="mac-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="mac-label">Role</label>
              <select className="mac-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="mac-label">Initial Password</label>
              <input type="text" className="mac-input" style={{ fontFamily: '"Monaco", monospace' }}
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            {error && <div style={{ background: "#FFE8E8", border: "1px solid #880000", color: "#880000", padding: "4px 8px", fontSize: 11, fontFamily: '"Geneva", sans-serif' }}>⚠ {error}</div>}
          </div>
          <div className="mac-dialog-footer">
            <button type="button" onClick={onClose} className="mac-btn">Cancel</button>
            <button type="submit" disabled={loading} className="mac-btn-default">{loading ? "Creating…" : "Create User"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditUserModal({ user, onClose, onUpdated }: { user: User; onClose: () => void; onUpdated: (u: User) => void }) {
  const [role,     setRole]     = useState(user.role);
  const [isActive, setIsActive] = useState(user.is_active);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try { onUpdated(await usersApi.patch(user.id, { role, is_active: isActive })); }
    catch (err) { setError(err instanceof Error ? err.message : "Update failed"); }
    finally { setLoading(false); }
  }

  return (
    <div className="mac-modal-backdrop" onClick={onClose}>
      <div className="mac-dialog" style={{ width: 340 }} onClick={(e) => e.stopPropagation()}>
        <div className="mac-dialog-titlebar">
          <span className="mac-widget" onClick={onClose} />
          <span style={{ flex: 1, textAlign: "center", fontFamily: '"Chicago", "Charcoal", sans-serif', fontSize: 12, fontWeight: "bold" }}>Edit User</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mac-dialog-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#555" }}>{user.full_name} — {user.email}</p>
            <div>
              <label className="mac-label">Role</label>
              <select className="mac-input" value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" id="active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ cursor: "default" }} />
              <label htmlFor="active" style={{ fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#000" }}>Account active</label>
            </div>
            {error && <div style={{ background: "#FFE8E8", border: "1px solid #880000", color: "#880000", padding: "4px 8px", fontSize: 11, fontFamily: '"Geneva", sans-serif' }}>⚠ {error}</div>}
          </div>
          <div className="mac-dialog-footer">
            <button type="button" onClick={onClose} className="mac-btn">Cancel</button>
            <button type="submit" disabled={loading} className="mac-btn-default">{loading ? "Saving…" : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users,      setUsers]      = useState<User[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editUser,   setEditUser]   = useState<User | null>(null);
  const [search,     setSearch]     = useState("");

  useEffect(() => { usersApi.list().then(setUsers).finally(() => setLoading(false)); }, []);

  async function handleDeactivate(user: User) {
    if (!confirm(`Deactivate ${user.full_name}?`)) return;
    await usersApi.deactivate(user.id);
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_active: false } : u));
  }

  const filtered = users.filter((u) =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreated={(u) => { setUsers((p) => [...p, u]); setShowCreate(false); }} />}
      {editUser   && <EditUserModal   user={editUser} onClose={() => setEditUser(null)} onUpdated={(u) => { setUsers((p) => p.map((x) => x.id === u.id ? u : x)); setEditUser(null); }} />}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="mac-toolbar" style={{ justifyContent: "space-between" }}>
          <input type="search" className="mac-input" style={{ width: 220 }}
            placeholder="Search by name or email…" value={search}
            onChange={(e) => setSearch(e.target.value)} />
          <button onClick={() => setShowCreate(true)} className="mac-btn-default">+ Add User</button>
        </div>

        <div className="card p-0" style={{ overflow: "hidden" }}>
          {loading ? (
            <p style={{ padding: 20, fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#555" }}>Loading users…</p>
          ) : (
            <table className="data-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: 20, fontFamily: '"Geneva", sans-serif', fontSize: 11, color: "#888" }}>No users found</td></tr>
                )}
                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: "bold", fontSize: 11 }}>{user.full_name}</td>
                    <td style={{ fontFamily: '"Monaco", monospace', fontSize: 10, color: "#555" }}>{user.email}</td>
                    <td><span className={ROLE_BADGE[user.role] ?? "badge badge-gray"}>{user.role}</span></td>
                    <td><span className={user.is_active ? "badge badge-green" : "badge badge-gray"}>{user.is_active ? "Active" : "Inactive"}</span></td>
                    <td style={{ fontFamily: '"Monaco", monospace', fontSize: 10, color: "#555" }}>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setEditUser(user)} className="mac-btn" style={{ minWidth: 0, padding: "1px 8px", fontSize: 10 }}>Edit</button>
                        {user.is_active && (
                          <button onClick={() => handleDeactivate(user)} className="mac-btn-danger" style={{ minWidth: 0, padding: "1px 8px", fontSize: 10 }}>Deactivate</button>
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
