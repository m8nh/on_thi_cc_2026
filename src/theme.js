export const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');";

// Tema escuro: telas de estudo (baralho, quiz, escrita, recompensa).
export const COLORS = {
  bg: "#12162A", surface: "#1B2140", surfaceAlt: "#232A4D", border: "#333c66",
  gold: "#D6AE3D", teal: "#3EB489", red: "#E0667A", text: "#EDEAE2", muted: "#8891A8",
};

// Tema claro: dashboard, lộ trình, phỏng vấn, escolha de prova.
export const LIGHT = {
  bg: "#F4F5FA", surface: "#FFFFFF", surfaceAlt: "#F7F8FC", border: "#E7E8F2",
  text: "#20233A", muted: "#8A8FA3", gold: "#C79A2E", teal: "#2E9A76",
  red: "#D9536B", purple: "#6C63FF",
  goldSoft: "#FBF1DC",
};

export const DARK_GRADIENT = `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.gold})`;
export const LIGHT_GRADIENT = `linear-gradient(90deg, ${LIGHT.teal}, ${LIGHT.gold})`;

export const RESPONSIVE_CSS = `
.tda-dash-grid, .tda-plan-grid { display: grid; grid-template-columns: 1fr; column-gap: 24px; align-items: start; }
@media (min-width: 900px) {
  .tda-wide > div { padding-left: 32px !important; padding-right: 32px !important; }
  .tda-dash-grid, .tda-plan-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 900px) { .tda-root { border-radius: 0 !important; } }
.tda-card-back ol { margin: 0; padding-left: 22px; } .tda-card-back li { margin-bottom: 6px; } .tda-card-back p { margin: 0 0 8px; }
`;

export const displayFont = { fontFamily: "'Fraunces', serif" };
export const bodyFont = { fontFamily: "'IBM Plex Sans', sans-serif" };
export const monoFont = { fontFamily: "'IBM Plex Mono', monospace" };
