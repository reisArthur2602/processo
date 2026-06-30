/** Tailwind Play CDN configuration for the Processo prototype. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: "#0B1F33",
        navy: "#123A5A",
        "navy-soft": "#EAF1F6",
        slate: "#516272",
        mist: "#F4F7F9",
        line: "#D8E1E8",
        docket: "#B58B4A",
        success: "#147D64",
        "success-soft": "#E8F6F1",
        danger: "#B43C47",
        "danger-soft": "#FCEDEF",
        warning: "#A66B1F",
        "warning-soft": "#FFF5E4",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        display: ["Source Serif 4", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "Consolas", "monospace"],
      },
      boxShadow: {
        panel: "0 18px 50px rgba(11, 31, 51, 0.08)",
        lift: "0 10px 24px rgba(11, 31, 51, 0.10)",
      },
      borderRadius: {
        card: "18px",
      },
    },
  },
};
