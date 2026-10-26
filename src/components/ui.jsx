import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { COLORS, LIGHT, displayFont, monoFont } from "../theme.js";
import { backBtnStyle, backBtnLight, lightCardStyle, lightIconBox } from "../styles.js";

export function BackButton({ onClick, light, children }) {
  return (
    <button onClick={onClick} style={light ? backBtnLight : backBtnStyle}>
      <ArrowLeft size={19} /> {children}
    </button>
  );
}

export function ProgressBar({ pct, height = 8, fill = LIGHT.gold, track = LIGHT.border, style }) {
  return (
    <div style={{ height, borderRadius: 999, background: track, overflow: "hidden", ...style }}>
      <div style={{ height: "100%", width: `${pct}%`, background: fill, transition: "width .4s ease" }} />
    </div>
  );
}

// Círculo vazio / check verde para itens marcáveis.
export function CheckMark({ done, size = 16 }) {
  return done
    ? <CheckCircle2 size={size} color={LIGHT.teal} />
    : <div style={{ width: size, height: size, borderRadius: "50%", border: `1.5px solid ${LIGHT.border}`, flexShrink: 0 }} />;
}

// Título de grupo em caixa alta (fases do lộ trình, partes da entrevista...).
export function GroupHeading({ children, style }) {
  return (
    <div style={{ ...displayFont, fontSize: 14, fontWeight: 600, margin: "16px 0 8px", color: LIGHT.muted, textTransform: "uppercase", letterSpacing: 0.5, ...style }}>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <>
      <div style={{ ...displayFont, fontSize: 24, fontWeight: 600, marginBottom: 2 }}>{title}</div>
      <div style={{ color: LIGHT.muted, fontSize: 14, marginBottom: 14 }}>{subtitle}</div>
    </>
  );
}

// Linha clicável de chuyên đề (ícone + nome + referência + seta).
export function SubjectRow({ subject, onClick, highlight }) {
  const Icon = subject.icon;
  return (
    <button onClick={onClick} style={{ ...lightCardStyle, ...(highlight && { border: `1px solid ${LIGHT.gold}` }) }}>
      <div style={{ ...lightIconBox, ...(highlight && { background: LIGHT.goldSoft }) }}>
        <Icon size={16} color={highlight ? LIGHT.gold : LIGHT.teal} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...displayFont, fontWeight: 600, fontSize: 15.5 }}>{subject.name}</div>
        <div style={{ color: LIGHT.muted, fontSize: 12, marginTop: 2 }}>{subject.ref}</div>
      </div>
      <ChevronRight size={15} color={LIGHT.muted} />
    </button>
  );
}

export function RingStat({ pct, color, label, sub, showDash }) {
  return (
    <>
      <div style={{ width: 54, height: 54, borderRadius: "50%", margin: "0 auto 8px", background: `conic-gradient(${color} ${pct * 3.6}deg, ${LIGHT.border} 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: LIGHT.surface, display: "flex", alignItems: "center", justifyContent: "center", ...monoFont, fontSize: 12.5, fontWeight: 700, color: LIGHT.text }}>
          {showDash ? "--" : `${pct}%`}
        </div>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: LIGHT.text }}>{label}</div>
      <div style={{ fontSize: 11, color: LIGHT.muted, marginTop: 2 }}>{sub}</div>
    </>
  );
}

// Grade de números grandes com legenda (contadores de progresso).
export function StatGrid({ items, valueSize = 20, labelSize = 11.5 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 8, textAlign: "center", marginBottom: 12 }}>
      {items.map(([label, value, color]) => (
        <div key={label}>
          <div style={{ ...monoFont, fontSize: valueSize, fontWeight: 700, color }}>{value}</div>
          <div style={{ fontSize: labelSize, color: LIGHT.muted }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Tema escuro ---------- */

export function SectionTitle({ children }) {
  return <div style={{ ...displayFont, fontSize: 15.5, fontWeight: 600, margin: "18px 0 8px", color: COLORS.gold }}>{children}</div>;
}

export function TextBlock({ children }) {
  return <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 14, fontSize: 14, color: COLORS.muted, lineHeight: 1.6, marginBottom: 10 }}>{children}</div>;
}
