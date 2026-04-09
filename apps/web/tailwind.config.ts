import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ── Mac OS 9 Platinum Palette ─────────────────
        mac: {
          desktop:  "#868686",
          platinum: "#D4D0C8",
          window:   "#FFFFFF",
          border:   "#000000",
          shadow:   "#888888",
          highlight:"#FFFFFF",
          selection:"#000080",
          titlebar: "#ABABAB",
          stripe:   "#D9D9D9",
        },
        // ── Legacy aliases → remapped to Mac grays ────
        ledger: {
          navy:     "#000000",
          slate:    "#666666",
          charcoal: "#333333",
          gold:     "#000080",
        },
        parchment: {
          50:  "#FFFFFF",
          100: "#F5F5F5",
          200: "#D4D0C8",
          300: "#B8B4AC",
          400: "#888888",
        },
        stamp: {
          approved:   "#006400",
          rejected:   "#8B0000",
          pending:    "#8B6914",
          processing: "#00008B",
          neutral:    "#444444",
        },
        ink: {
          black: "#000000",
          dark:  "#333333",
          faded: "#666666",
          red:   "#CC0000",
          blue:  "#000080",
        },
        // ── Other Tailwind utilities ──────────────────
        surface: {
          page:   "#D4D0C8",
          card:   "#FFFFFF",
          subtle: "#F5F5F5",
          inset:  "#EBEBEB",
        },
        brand: {
          500: "#000080",
          600: "#00006B",
        },
        text: {
          primary:   "#000000",
          secondary: "#333333",
          muted:     "#666666",
          inverse:   "#FFFFFF",
        },
        border: {
          DEFAULT: "#888888",
          strong:  "#000000",
        },
      },
      fontFamily: {
        sans:    ['"Geneva"', '"Helvetica Neue"', "Arial", "sans-serif"],
        display: ['"Chicago"', '"Charcoal"', '"Geneva"', "sans-serif"],
        body:    ['"Geneva"', '"Helvetica Neue"', "Arial", "sans-serif"],
        mono:    ['"Monaco"', '"Courier New"', "Courier", "monospace"],
        ledger:  ['"Monaco"', '"Courier New"', "monospace"],
        chicago: ['"Chicago"', '"Charcoal"', '"Geneva"', "sans-serif"],
      },
      boxShadow: {
        "mac-raised": "inset 1px 1px 0 #fff, inset -1px -1px 0 #888",
        "mac-inset":  "inset 2px 2px 0 #888, inset -1px -1px 0 #fff",
        "mac-window": "inset 1px 1px 0 rgba(255,255,255,0.8), inset -1px -1px 0 rgba(0,0,0,0.3), 3px 3px 0 rgba(0,0,0,0.35)",
        "mac-dialog": "inset 1px 1px 0 #fff, inset -1px -1px 0 #888, 4px 4px 0 rgba(0,0,0,0.5)",
        card:   "inset 1px 1px 0 #fff, inset -1px -1px 0 #aaa, 0 0 0 1px #888",
      },
      borderRadius: {
        DEFAULT: "0px",
        sm:  "0px",
        md:  "0px",
        lg:  "0px",
        btn: "4px",
        dialog: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
