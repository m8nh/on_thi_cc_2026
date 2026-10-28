import { useEffect, useMemo, useRef, useState } from "react";
import { ListTree, Search, X } from "lucide-react";
import { COLORS, bodyFont, displayFont, monoFont } from "../../theme.js";
import { darkPanelStyle } from "../../styles.js";
import { foldVi, loadGoc } from "../../lib/ktcBank.js";

// Paleta suave da leitura (tema claro): texto cinza-azulado, sem preto puro, para cansar menos a vista.
const READER = { text: "#3B4060", strong: "#20233A", heading: "#9A7822", border: "#E1E3EF", link: "#2E8A6B", mark: "rgba(199,154,46,0.22)" };

const READER_CSS = `
.goc-body p { margin: 0 0 10px; line-height: 1.7; }
.goc-body table { width: 100%; border-collapse: collapse; margin: 6px 0 14px; font-size: 13.5px; }
.goc-body td, .goc-body th { border: 1px solid ${READER.border}; padding: 6px 8px; vertical-align: top; }
.goc-body a { color: ${READER.link}; }
.goc-body strong, .goc-body b { color: ${READER.strong}; font-weight: 600; }
.goc-body ul, .goc-body ol { padding-left: 22px; }
.goc-body mark { background: ${READER.mark}; color: ${READER.strong}; border-radius: 3px; padding: 0 1px; }
.goc-l1 > :first-child, .goc-l2 > :first-child { text-align: center; color: ${READER.heading}; }
.goc-l3 > :first-child { color: ${READER.heading}; }
`;

// Đánh dấu các chỗ khớp từ khóa (không phân biệt dấu) trong phần văn bản đang hiển thị.
function highlight(root, query) {
  root.querySelectorAll("mark[data-hit]").forEach((m) => m.replaceWith(document.createTextNode(m.textContent)));
  root.normalize();
  const q = foldVi(query.trim());
  if (q.length < 2) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const text = node.textContent;
    // bỏ dấu từng ký tự để giữ nguyên vị trí so với văn bản gốc
    const folded = Array.from(text, (c) => { const f = foldVi(c); return f.length === 1 ? f : c.toLowerCase(); }).join("");
    if (folded.length !== text.length) return;
    let idx = folded.indexOf(q);
    if (idx < 0) return;
    const frag = document.createDocumentFragment();
    let last = 0;
    while (idx >= 0) {
      frag.append(text.slice(last, idx));
      const mark = document.createElement("mark");
      mark.dataset.hit = "1";
      mark.textContent = text.slice(idx, idx + q.length);
      frag.append(mark);
      last = idx + q.length;
      idx = folded.indexOf(q, last);
    }
    frag.append(text.slice(last));
    node.replaceWith(frag);
  });
}

// Toàn văn văn bản: mục lục theo chương / mục / điều và tìm kiếm trong văn bản.
export default function KtcGocView({ doc }) {
  const [sections, setSections] = useState(null);
  const [query, setQuery] = useState("");
  const [showToc, setShowToc] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    let alive = true;
    loadGoc(doc.id).then((s) => alive && setSections(s));
    return () => { alive = false; };
  }, [doc.id]);

  const q = foldVi(query.trim());
  const visible = useMemo(() => {
    if (!sections) return [];
    return q.length < 2 ? sections : sections.filter((s) => s.plain.includes(q));
  }, [sections, q]);

  useEffect(() => { if (bodyRef.current) highlight(bodyRef.current, query); }, [visible, query]);

  const jump = (id) => {
    setShowToc(false);
    setQuery("");
    requestAnimationFrame(() => document.getElementById(`goc-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  if (!sections) return <div style={{ color: COLORS.muted }}>Đang tải văn bản…</div>;
  const toc = sections.filter((s) => s.level > 0);

  return (
    <div>
      <style>{READER_CSS}</style>
      <div style={{ color: COLORS.gold, fontSize: 13, ...monoFont, marginBottom: 4 }}>Văn bản gốc · {doc.no}</div>
      <div style={{ ...displayFont, fontSize: 21, fontWeight: 600, marginBottom: 4 }}>{doc.name}</div>
      <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 14 }}>{doc.ref}</div>

      <div style={{ position: "sticky", top: 0, zIndex: 5, background: COLORS.bg, paddingBottom: 10, display: "flex", gap: 8 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} color={COLORS.muted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm trong văn bản (gõ có dấu hoặc không dấu)"
            style={{ width: "100%", boxSizing: "border-box", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 34px", fontSize: 14.5, color: COLORS.text, ...bodyFont }}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Xóa tìm kiếm" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <X size={14} color={COLORS.muted} />
            </button>
          )}
        </div>
        <button onClick={() => setShowToc((v) => !v)} style={{
          display: "flex", alignItems: "center", gap: 6, background: showToc ? COLORS.surfaceAlt : COLORS.surface, color: showToc ? COLORS.gold : COLORS.text,
          border: `1px solid ${showToc ? COLORS.gold : COLORS.border}`, borderRadius: 10, padding: "0 12px", cursor: "pointer", fontSize: 14, ...bodyFont,
        }}>
          <ListTree size={15} /> Mục lục
        </button>
      </div>

      {showToc && (
        <div style={{ ...darkPanelStyle, maxHeight: 360, overflowY: "auto", padding: "8px 6px" }}>
          {toc.map((s) => (
            <button key={s.id} onClick={() => jump(s.id)} style={{
              display: "block", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", borderRadius: 6,
              padding: `5px 8px 5px ${8 + (s.level - 1) * 14}px`, fontSize: s.level === 3 ? 13.5 : 14, lineHeight: 1.4,
              color: s.level === 3 ? COLORS.muted : COLORS.gold, fontWeight: s.level === 3 ? 400 : 600, ...bodyFont,
            }}>{s.label}</button>
          ))}
        </div>
      )}

      {q.length >= 2 && (
        <div style={{ fontSize: 13, color: COLORS.muted, margin: "2px 0 12px" }}>
          {visible.length ? `${visible.filter((s) => s.level === 3).length || visible.length} phần có "${query.trim()}"` : `Không tìm thấy "${query.trim()}"`}
        </div>
      )}

      <div ref={bodyRef} className="goc-body" style={{ fontSize: 15, color: READER.text }}>
        {visible.map((s) => (
          <section key={s.id} id={`goc-${s.id}`} className={`goc-l${s.level}`} style={{ scrollMarginTop: 64, marginBottom: s.level === 3 ? 14 : 18 }}
            dangerouslySetInnerHTML={{ __html: s.html }} />
        ))}
      </div>
    </div>
  );
}
