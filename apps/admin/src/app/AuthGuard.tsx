"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";

const PAGE_TITLES: Record<string, string> = {
  "/":         "Dashboard",
  "/users":    "User Management",
  "/policies": "Policy Management",
  "/audit":    "Audit Log",
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === "/login") { setChecked(true); return; }
    const t = localStorage.getItem("ld_admin_token");
    if (!t) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (!checked) return null;

  if (pathname === "/login") return <>{children}</>;

  const title = PAGE_TITLES[pathname] ?? "LedgerDesk Admin";

  return (
    <div className="mac-window mac-window-full">
      {/* ── Title Bar ─────────────────────────── */}
      <div className="mac-titlebar">
        <span className="mac-widget" />
        <span className="mac-widget" />
        <span className="mac-widget" />
        <span className="mac-titlebar-title">LedgerDesk Administration — {title}</span>
      </div>

      {/* ── Menu Bar ──────────────────────────── */}
      <div className="mac-menubar">
        <span className="mac-menuitem" style={{ fontWeight: "bold", fontSize: 13 }}>&#63743;</span>
        <span className="mac-menuitem">LedgerDesk</span>
        <span className="mac-menuitem">Admin</span>
        <span className="mac-menuitem">Window</span>
        <span className="mac-menuitem">Help</span>
        {/* Right-aligned admin badge */}
        <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: "bold", color: "#880000", fontFamily: '"Geneva", sans-serif', paddingRight: 8 }}>
          ▲ ADMIN MODE
        </span>
      </div>

      {/* ── Body ──────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <AdminSidebar />
        <main className="mac-content" style={{ padding: 0 }}>
          <div style={{ padding: "12px" }}>
            {children}
          </div>
        </main>
      </div>

      {/* ── Status Bar ────────────────────────── */}
      <div className="mac-statusbar">
        <span style={{ color: "#880000", fontWeight: "bold" }}>Admin Portal</span>
        <span>Internal Use Only</span>
        <span style={{ marginLeft: "auto" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
        </span>
      </div>
    </div>
  );
}
