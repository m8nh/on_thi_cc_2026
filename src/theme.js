export const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');";

// Telas de estudo (baralho, quiz, escrita, leitura, recompensa): agora usam a mesma paleta clara da página inicial.
// O nome COLORS foi mantido para não mexer em cada tela; os valores espelham LIGHT.
export const COLORS = {
  bg: "#F4F5FA", surface: "#FFFFFF", surfaceAlt: "#F7F8FC", border: "#E7E8F2",
  gold: "#C79A2E", teal: "#2E9A76", red: "#D9536B", text: "#20233A", muted: "#8A8FA3",
};

// Tema claro: dashboard, lộ trình, phỏng vấn, escolha de prova.
export const LIGHT = {
  bg: "#F4F5FA", surface: "#FFFFFF", surfaceAlt: "#F7F8FC", border: "#E7E8F2",
  text: "#20233A", muted: "#8A8FA3", gold: "#C79A2E", teal: "#2E9A76",
  red: "#D9536B", purple: "#6C63FF",
  goldSoft: "#FBF1DC",
};

// Fundos translúcidos para opção certa / errada / selecionada.
export const TINT = { teal: "rgba(46,154,118,0.12)", red: "rgba(217,83,107,0.12)", gold: "rgba(199,154,46,0.14)" };

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
