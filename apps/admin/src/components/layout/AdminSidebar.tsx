"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/",         label: "Dashboard",  icon: "⊞" },
  { href: "/users",    label: "Users",      icon: "👤" },
  { href: "/policies", label: "Policies",   icon: "◻" },
  { href: "/audit",    label: "Audit Log",  icon: "☰" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const signOut = () => {
    localStorage.removeItem("ld_admin_token");
    router.push("/login");
  };

  return (
    <aside className="mac-sidebar">
      {/* App label */}
      <div className="mac-sidebar-header" style={{ fontSize: 11, letterSpacing: 0, textTransform: "none", fontWeight: "bold", color: "#000", padding: "5px 8px 4px" }}>
        <span style={{ color: "#880000" }}>▲</span> LedgerDesk Admin
      </div>

      {/* Section label */}
      <div className="mac-sidebar-header">Administration</div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mac-sidebar-item${active ? " mac-sidebar-item-active" : ""}`}
            >
              <span style={{ fontSize: 10, width: 14, textAlign: "center", flexShrink: 0 }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mac-sidebar-header">Account</div>
      <button
        onClick={signOut}
        className="mac-sidebar-item"
        style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "default", paddingLeft: 10 }}
      >
        <span style={{ fontSize: 10, width: 14, textAlign: "center", flexShrink: 0 }}>⏏</span>
        <span>Sign Out</span>
      </button>

      <div style={{ padding: "6px 8px", fontSize: 9, color: "#888", fontFamily: '"Geneva", sans-serif', borderTop: "1px solid #aaa" }}>
        Admin Portal v1.0
      </div>
    </aside>
  );
}
