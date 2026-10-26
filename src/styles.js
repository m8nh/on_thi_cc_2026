import { COLORS, LIGHT, bodyFont } from "./theme.js";

/* ---------- Tema escuro ---------- */
export const inputStyle = { width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", color: COLORS.text, fontSize: 15.5, marginBottom: 12, boxSizing: "border-box", ...bodyFont };
export const textareaStyle = { ...inputStyle, minHeight: 90, resize: "vertical", lineHeight: 1.5 };
export const formLabelStyle = { fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 6 };
export const labelStyle = { ...formLabelStyle, marginTop: 4 };
export const backBtnStyle = { display: "inline-flex", alignItems: "center", gap: 8, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 999, color: COLORS.text, fontSize: 16, fontWeight: 600, cursor: "pointer", padding: "10px 20px 10px 16px", marginBottom: 18, ...bodyFont };
export const subjectCardStyle = { width: "100%", display: "flex", alignItems: "center", gap: 14, textAlign: "left", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer", color: COLORS.text };
export const iconBoxStyle = { width: 38, height: 38, borderRadius: 10, background: COLORS.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
export const darkPanelStyle = { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16, marginBottom: 16 };

export function btnStyle(color, full) {
  return { flex: full ? "unset" : 1, width: full ? "100%" : "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 16px", borderRadius: 10, border: `1px solid ${color}`, background: "transparent", color, fontSize: 15.5, fontWeight: 500, cursor: "pointer", ...bodyFont };
}

/* ---------- Tema claro ---------- */
export const backBtnLight = { ...backBtnStyle, background: LIGHT.surface, border: `1px solid ${LIGHT.border}`, color: LIGHT.text, boxShadow: "0 1px 2px rgba(20,23,50,0.06)" };
export const lightCardStyle = { width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left", background: LIGHT.surface, border: `1px solid ${LIGHT.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 9, cursor: "pointer", color: LIGHT.text, boxShadow: "0 1px 2px rgba(20,23,50,0.04)" };
export const lightIconBox = { width: 34, height: 34, borderRadius: 9, background: LIGHT.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
export const lightCardBlock = { background: LIGHT.surface, border: `1px solid ${LIGHT.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 14, boxShadow: "0 1px 2px rgba(20,23,50,0.04)" };
export const selectStyle = { marginLeft: 6, padding: "5px 8px", borderRadius: 8, border: `1px solid ${LIGHT.border}`, background: LIGHT.surface, color: LIGHT.text, fontSize: 13, ...bodyFont };
export const lightTextarea = { width: "100%", minHeight: 80, boxSizing: "border-box", border: `1px solid ${LIGHT.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 14, lineHeight: 1.55, color: LIGHT.text, background: LIGHT.surfaceAlt, resize: "vertical", ...bodyFont };
export const lightPagePadding = { padding: "18px 16px 28px" };
// Botão sem aparência de botão (links de texto, "Hủy", "Dừng"...).
export const plainBtn = { background: "none", border: "none", padding: 0, cursor: "pointer", ...bodyFont };

export function lightBtnStyle(color) {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 16px", borderRadius: 10, border: "none", background: color, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", ...bodyFont };
}

export function pillStyle(active) {
  return { border: `1px solid ${active ? LIGHT.gold : LIGHT.border}`, background: active ? LIGHT.goldSoft : LIGHT.surface, color: active ? LIGHT.text : LIGHT.muted, borderRadius: 999, padding: "8px 16px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", ...bodyFont };
}
