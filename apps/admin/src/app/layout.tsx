import type { Metadata } from "next";
import "@/styles/globals.css";
import AuthGuard from "./AuthGuard";

export const metadata: Metadata = {
  title: "LedgerDesk Admin",
  description: "LedgerDesk internal administration portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
