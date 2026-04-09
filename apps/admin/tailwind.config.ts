import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mac: {
          desktop:  "#868686",
          platinum: "#D4D0C8",
          window:   "#FFFFFF",
          border:   "#000000",
          shadow:   "#888888",
          highlight:"#FFFFFF",
          selection:"#000080",
          titlebar: "#ABABAB",
        },
        admin: { 500: "#000080", 600: "#000060", accent: "#880000", gold: "#8B6914" },
        surface: { page: "#D4D0C8", card: "#FFFFFF", subtle: "#F5F5F5", inset: "#EBEBEB" },
        border: { DEFAULT: "#888888", strong: "#000000" },
        text: { primary: "#000000", secondary: "#333333", muted: "#666666", inverse: "#FFFFFF" },
        status: { green: "#006400", yellow: "#8B6914", red: "#880000", blue: "#000080" },
      },
      fontFamily: {
        sans:    ['"Geneva"', '"Helvetica Neue"', "Arial", "sans-serif"],
        chicago: ['"Chicago"', '"Charcoal"', '"Geneva"', "sans-serif"],
        mono:    ['"Monaco"', '"Courier New"', "Courier", "monospace"],
      },
      borderRadius: { DEFAULT: "0px", btn: "4px", dialog: "8px" },
    },
  },
  plugins: [],
};

export default config;
