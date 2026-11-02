import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LIGHT, displayFont } from "../../theme.js";
import { plainBtn } from "../../styles.js";
import { DAP_AN_NOTICE, V2_SOURCE } from "../../data/vong2.js";

export const Paragraphs = ({ items, color = LIGHT.text }) => items.map((p, i) => (
  <p key={i} style={{ margin: "0 0 8px", fontSize: 14.5, lineHeight: 1.65, color }}>{p}</p>
));

export function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${LIGHT.border}`, borderRadius: 10, marginTop: 10, background: LIGHT.surfaceAlt }}>
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open} style={{ ...plainBtn, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 12px", color: LIGHT.text, fontSize: 14, fontWeight: 600, textAlign: "left" }}>
        {title}
        <ChevronDown size={15} color={LIGHT.muted} style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      {open && <div style={{ padding: "0 12px 10px" }}>{children}</div>}
    </div>
  );
}

export function NotesBlock({ notes }) {
  if (!notes.length) return null;
  return (
    <div style={{ background: LIGHT.goldSoft, borderLeft: `3px solid ${LIGHT.gold}`, borderRadius: 8, padding: "10px 12px", marginTop: 10 }}>
      <div style={{ ...displayFont, fontWeight: 600, fontSize: 14.5, marginBottom: 6 }}>⚠ Lưu ý</div>
      {notes.map((n) => (
        <div key={n.label} style={{ fontSize: 13.5, lineHeight: 1.55, marginBottom: 6 }}><strong>{n.label}:</strong> {n.text}</div>
      ))}
    </div>
  );
}

// Gabarito recolhido, com o aviso fixo e as notas do đề.
export function DapAnPanel({ dapAn, notes }) {
  return (
    <Collapsible title="Đáp án tham khảo">
      <div style={{ fontSize: 13, color: LIGHT.muted, fontStyle: "italic", lineHeight: 1.5, marginBottom: 10 }}>{DAP_AN_NOTICE}</div>
      {dapAn ? <Paragraphs items={dapAn} /> : <div style={{ fontSize: 14, color: LIGHT.muted }}>Câu này không có đáp án tiếng Việt.</div>}
      <NotesBlock notes={notes} />
    </Collapsible>
  );
}

export const SourceFooter = () => (
  <div style={{ fontSize: 11.5, color: LIGHT.muted, marginTop: 10 }}>{V2_SOURCE}</div>
);

export const LoadingOrEmpty = ({ data }) => (
  <div style={{ fontSize: 14, color: LIGHT.muted }}>{data ? "Chưa có dữ liệu." : "Đang tải…"}</div>
);
