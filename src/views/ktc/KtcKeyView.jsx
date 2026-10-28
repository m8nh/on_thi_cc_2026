import { useState } from "react";
import { COLORS, bodyFont } from "../../theme.js";
import { pillStyle } from "../../styles.js";

const BASE = import.meta.env.BASE_URL;

// Páginas originais do bộ KEY (imagens), uma aba por arquivo do văn bản.
export default function KtcKeyView({ files }) {
  const [active, setActive] = useState(0);
  const file = files[active];
  return (
    <div>
      {files.length > 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {files.map((f, i) => (
            <button key={f.file} onClick={() => setActive(i)} style={{ ...pillStyle(i === active), background: i === active ? COLORS.surfaceAlt : COLORS.surface, color: i === active ? COLORS.gold : COLORS.muted, border: `1px solid ${i === active ? COLORS.gold : COLORS.border}`, ...bodyFont }}>
              {f.title}
            </button>
          ))}
        </div>
      )}
      <div style={{ color: COLORS.muted, fontSize: 13.5, marginBottom: 10 }}>{file.title} · {file.pages.length} trang</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {file.pages.map((p, i) => (
          <img
            key={p}
            src={`${BASE}key/${p}`}
            alt={`${file.title} – trang ${i + 1}`}
            loading="lazy"
            style={{ width: "100%", borderRadius: 8, background: "#fff", aspectRatio: file.ratio || "0.707", display: "block" }}
          />
        ))}
      </div>
    </div>
  );
}
