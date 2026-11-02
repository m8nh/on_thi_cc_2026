import { useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { LIGHT, displayFont, monoFont } from "../../theme.js";
import { lightBtnStyle, lightCardBlock, pillStyle, plainBtn } from "../../styles.js";
import { ProgressBar } from "../../components/ui.jsx";
import { PRACTICE_XP, notesForDe } from "../../data/vong2.js";
import { useVong2Data } from "../../lib/vong2.js";
import { todayKey } from "../../lib/dates.js";
import { LoadingOrEmpty, NotesBlock, SourceFooter } from "./shared.jsx";

// practice: { [cardId]: { count, last } }
export default function PhongVanView({ practice, onPractice }) {
  const cards = useVong2Data("phongvan");
  const [de, setDe] = useState("all");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!cards?.length) return <LoadingOrEmpty data={cards} />;

  const des = [...new Set(cards.map((c) => c.de))];
  const deck = cards.filter((c) => de === "all" || c.de === de);
  const card = deck[idx];
  const log = practice[card.id];
  const practicedToday = log?.last === todayKey();
  const doneCount = cards.filter((c) => practice[c.id]).length;

  const go = (i) => { setIdx(i); setFlipped(false); };
  const pickDe = (value) => { setDe(value); go(0); };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <div style={{ ...displayFont, fontSize: 20.5, fontWeight: 600, marginBottom: 4 }}>Câu hỏi phỏng vấn</div>
      <div style={{ color: LIGHT.muted, fontSize: 14, marginBottom: 8 }}>Đã luyện {doneCount}/{cards.length} thẻ · +{PRACTICE_XP} XP cho lần luyện đầu tiên mỗi ngày của mỗi thẻ</div>
      <ProgressBar pct={(doneCount / cards.length) * 100} height={5} fill={LIGHT.teal} style={{ marginBottom: 12 }} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <button onClick={() => pickDe("all")} style={pillStyle(de === "all")}>Tất cả</button>
        {des.map((d) => <button key={d} onClick={() => pickDe(d)} style={pillStyle(de === d)}>Đề {d}</button>)}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: LIGHT.muted, marginBottom: 8 }}>
        <span>Thẻ {idx + 1}/{deck.length} · Đề {card.de} · {card.chuDe}</span>
        {log && <span style={monoFont}>Đã luyện {log.count} lần</span>}
      </div>
      <div onClick={() => setFlipped(true)} style={{ ...lightCardBlock, minHeight: 240, cursor: flipped ? "default" : "pointer", border: `1px solid ${flipped ? LIGHT.teal : LIGHT.gold}`, padding: "22px 26px" }}>
        <div style={{ ...displayFont, fontSize: 17, lineHeight: 1.6, fontWeight: 600 }}>{card.front}</div>
        {!flipped && <div style={{ marginTop: 24, fontSize: 13, color: LIGHT.muted }}>Trả lời to thành tiếng, rồi nhấn vào thẻ để lật.</div>}
        {flipped && (
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${LIGHT.border}` }}>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14.5, lineHeight: 1.65 }}>
              {card.y.map((y, i) => <li key={i} style={{ marginBottom: 6 }}>{y}</li>)}
            </ul>
            <NotesBlock notes={notesForDe(card.de)} />
          </div>
        )}
        <SourceFooter />
      </div>
      <button onClick={() => onPractice(card.id)} style={{ ...lightBtnStyle(practicedToday ? LIGHT.muted : LIGHT.teal), marginBottom: 10 }}>
        <CheckCircle2 size={15} /> Đã luyện{practicedToday ? " hôm nay" : ` (+${PRACTICE_XP} XP)`}
      </button>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button disabled={idx === 0} onClick={() => go(idx - 1)} style={{ ...plainBtn, display: "flex", alignItems: "center", gap: 4, fontSize: 14, color: LIGHT.text, opacity: idx === 0 ? 0.35 : 1 }}><ChevronLeft size={15} /> Thẻ trước</button>
        <button disabled={idx === deck.length - 1} onClick={() => go(idx + 1)} style={{ ...plainBtn, display: "flex", alignItems: "center", gap: 4, fontSize: 14, color: LIGHT.text, opacity: idx === deck.length - 1 ? 0.35 : 1 }}>Thẻ sau <ChevronRight size={15} /></button>
      </div>
    </div>
  );
}
