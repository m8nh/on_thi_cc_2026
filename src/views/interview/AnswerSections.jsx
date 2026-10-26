import { Brain, CheckCircle2, Target } from "lucide-react";
import { LIGHT } from "../../theme.js";

// Os textos do documento já vêm escapados (só <strong>/<em>), por isso o innerHTML é seguro aqui.
const html = (h) => ({ __html: h });

export function OutlineBlock({ b }) {
  const txt = { fontSize: 14, lineHeight: 1.65, color: LIGHT.text };
  if (b.t === "p") return <p style={{ ...txt, margin: "0 0 10px" }} dangerouslySetInnerHTML={html(b.h)} />;
  if (b.t === "ol" || b.t === "ul") {
    const Tag = b.t;
    return (
      <Tag style={{ ...txt, margin: "0 0 10px", paddingLeft: 22 }}>
        {b.items.map((it, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            <span dangerouslySetInnerHTML={html(it.h)} />
            {it.sub?.length > 0 && (
              <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>{it.sub.map((sh, j) => <li key={j} dangerouslySetInnerHTML={html(sh)} />)}</ul>
            )}
          </li>
        ))}
      </Tag>
    );
  }
  if (b.t === "table") {
    return (
      <div style={{ overflowX: "auto", margin: "0 0 12px" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13, lineHeight: 1.5 }}>
          <tbody>
            {b.rows.map((row, ri) => (
              <tr key={ri} style={{ background: ri === 0 ? LIGHT.surfaceAlt : "transparent" }}>
                {row.map((c, ci) => (
                  <td key={ci} style={{ border: `1px solid ${LIGHT.border}`, padding: "7px 9px", verticalAlign: "top", fontWeight: ri === 0 || ci === 0 ? 600 : 400 }} dangerouslySetInnerHTML={html(c)} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

function SectionHead({ icon: Icon, label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color, margin: "4px 0 8px" }}>
      <Icon size={14} color={color} /> {label}
    </div>
  );
}

const boxText = { fontSize: 14, lineHeight: 1.65, color: LIGHT.text, margin: 0 };

// Dàn ý / gợi ý trả lời + mẹo ghi nhớ + lý do de uma pergunta.
export default function AnswerSections({ q }) {
  return (
    <div>
      <SectionHead icon={CheckCircle2} label={q.traloi ? "Gợi ý trả lời" : "Câu trả lời"} color={LIGHT.teal} />
      {q.blocks
        ? q.blocks.map((b, i) => <OutlineBlock key={i} b={b} />)
        : <p style={{ ...boxText, marginBottom: 12 }} dangerouslySetInnerHTML={html(q.traloi)} />}
      {q.meo && (
        <div style={{ background: LIGHT.goldSoft, border: `1px solid ${LIGHT.gold}`, borderRadius: 12, padding: "10px 14px", margin: "6px 0 10px" }}>
          <SectionHead icon={Brain} label="Mẹo ghi nhớ" color={LIGHT.gold} />
          <p style={boxText} dangerouslySetInnerHTML={html(q.meo)} />
        </div>
      )}
      {q.visao && (
        <div style={{ background: "#F1F0FF", border: "1px solid #CFCBFF", borderRadius: 12, padding: "10px 14px", margin: "0 0 6px" }}>
          <SectionHead icon={Target} label="Vì sao trả lời như vậy" color={LIGHT.purple} />
          <p style={boxText} dangerouslySetInnerHTML={html(q.visao)} />
        </div>
      )}
    </div>
  );
}
