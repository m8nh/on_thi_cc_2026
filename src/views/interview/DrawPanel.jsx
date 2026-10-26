import { useState } from "react";
import { Eye, Mic, Shuffle, Timer } from "lucide-react";
import { LIGHT, displayFont, monoFont } from "../../theme.js";
import { lightBtnStyle, lightCardBlock, plainBtn, selectStyle } from "../../styles.js";
import { findQuestion, pickDrawQuestion } from "../../lib/interview.js";
import { formatClock } from "../../lib/dates.js";
import { useTicker } from "../../hooks/useTicker.js";
import AnswerSections from "./AnswerSections.jsx";

const PREP_OPTIONS = [3, 5, 7, 10];
const TALK_OPTIONS = [3, 5, 7];
const DRAW_XP = { good: 25, ok: 20, weak: 20 };

// Bốc thăm như phòng thi: chuẩn bị → trình bày → xem dàn ý và tự chấm.
export default function DrawPanel({ iv, ui, setUi, onComplete }) {
  const [draw, setDraw] = useState(null); // { n, phase: prep|talk|review, ts }

  const finish = (rating) => {
    const n = draw.n;
    setDraw(null);
    onComplete(DRAW_XP[rating], { kind: "interview", patch: { interview: { ...iv, ratings: { ...iv.ratings, [n]: rating } } } });
  };

  return (
    <div style={{ ...lightCardBlock, border: `1px solid ${LIGHT.gold}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Shuffle size={16} color={LIGHT.gold} />
        <span style={{ ...displayFont, fontWeight: 600, fontSize: 15 }}>Bốc thăm như phòng thi</span>
      </div>
      {draw ? (
        <ActiveDraw draw={draw} setDraw={setDraw} ui={ui} onFinish={finish} />
      ) : (
        <>
          <div style={{ fontSize: 13.5, color: LIGHT.muted, lineHeight: 1.6, marginBottom: 12 }}>
            Bốc ngẫu nhiên một câu (ưu tiên câu chưa luyện và câu cần ôn), chuẩn bị rồi trình bày to thành tiếng theo đồng hồ. Dàn ý chỉ hiện sau khi bạn trình bày xong.
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12, fontSize: 13, color: LIGHT.muted, alignItems: "center", flexWrap: "wrap" }}>
            <MinutesSelect label="Chuẩn bị" value={ui.prepMin} options={PREP_OPTIONS} onChange={(prepMin) => setUi({ prepMin })} />
            <MinutesSelect label="Trình bày" value={ui.talkMin} options={TALK_OPTIONS} onChange={(talkMin) => setUi({ talkMin })} />
          </div>
          <button onClick={() => setDraw({ n: pickDrawQuestion(iv.ratings).n, phase: "prep", ts: Date.now() })} style={lightBtnStyle(LIGHT.gold)}>
            <Shuffle size={15} /> Bốc thăm câu hỏi
          </button>
        </>
      )}
    </div>
  );
}

function MinutesSelect({ label, value, options, onChange }) {
  return (
    <label>{label}{" "}
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} style={selectStyle}>
        {options.map((m) => <option key={m} value={m}>{m} phút</option>)}
      </select>
    </label>
  );
}

function ActiveDraw({ draw, setDraw, ui, onFinish }) {
  const timed = draw.phase !== "review";
  useTicker(timed);
  const q = findQuestion(draw.n);
  const limit = (draw.phase === "prep" ? ui.prepMin : ui.talkMin) * 60;
  const left = limit - Math.floor((Date.now() - draw.ts) / 1000);
  const overtime = left < 0;

  return (
    <>
      <div style={{ fontSize: 12, color: LIGHT.muted, ...monoFont, marginBottom: 4 }}>CÂU {q.n} · {q.part}</div>
      <div style={{ ...displayFont, fontWeight: 600, fontSize: 17, lineHeight: 1.45, marginBottom: 12 }}>{q.question}</div>
      {timed && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <Timer size={18} color={overtime ? LIGHT.red : LIGHT.gold} />
          <span style={{ ...monoFont, fontSize: 30, fontWeight: 700, color: overtime ? LIGHT.red : LIGHT.text }}>{formatClock(left)}</span>
          <span style={{ fontSize: 13, color: LIGHT.muted }}>{draw.phase === "prep" ? "chuẩn bị" : "trình bày"}{overtime ? " · quá giờ" : ""}</span>
        </div>
      )}
      {draw.phase === "prep" && (
        <>
          <div style={{ fontSize: 13, color: LIGHT.muted, marginBottom: 10 }}>Ghi ra giấy: câu chốt, 3 ý, liên hệ Việt Nam.</div>
          <button onClick={() => setDraw({ ...draw, phase: "talk", ts: Date.now() })} style={lightBtnStyle(LIGHT.gold)}><Mic size={15} /> Bắt đầu trình bày</button>
        </>
      )}
      {draw.phase === "talk" && (
        <button onClick={() => setDraw({ ...draw, phase: "review" })} style={lightBtnStyle(LIGHT.teal)}><Eye size={15} /> Kết thúc, xem dàn ý</button>
      )}
      {draw.phase === "review" && (
        <>
          <div style={{ maxHeight: 380, overflowY: "auto", borderTop: `1px solid ${LIGHT.border}`, paddingTop: 10, marginBottom: 12 }}>
            <AnswerSections q={q} />
          </div>
          <div style={{ fontSize: 13, color: LIGHT.muted, marginBottom: 8 }}>So với dàn ý, bạn trả lời thế nào?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <button onClick={() => onFinish("good")} style={lightBtnStyle(LIGHT.teal)}>Tốt</button>
            <button onClick={() => onFinish("ok")} style={lightBtnStyle(LIGHT.gold)}>Tạm được</button>
            <button onClick={() => onFinish("weak")} style={lightBtnStyle(LIGHT.red)}>Cần ôn lại</button>
          </div>
        </>
      )}
      <button onClick={() => setDraw(null)} style={{ ...plainBtn, color: LIGHT.muted, fontSize: 12.5, marginTop: 10 }}>Hủy lượt này</button>
    </>
  );
}
