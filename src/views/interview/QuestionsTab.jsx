import { Fragment } from "react";
import { ChevronRight, PenLine } from "lucide-react";
import { LIGHT, bodyFont, monoFont } from "../../theme.js";
import { lightCardBlock, lightTextarea, pillStyle } from "../../styles.js";
import { GroupHeading } from "../../components/ui.jsx";
import { INTERVIEW_QUESTIONS } from "../../data/interviewData.js";
import { RATING } from "../../lib/interview.js";
import AnswerSections from "./AnswerSections.jsx";

const FILTERS = [["all", "Tất cả"], ["new", "Chưa luyện"], ["weak", "Cần ôn"]];

const matchesFilter = (filter, rating) => (filter === "new" ? !rating : filter === "weak" ? rating === "weak" : true);

export function QuestionFilter({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
      {FILTERS.map(([key, label]) => (
        <button key={key} onClick={() => onChange(key)} style={{ ...pillStyle(value === key), fontSize: 12.5, padding: "6px 12px" }}>{label}</button>
      ))}
    </div>
  );
}

// 20 câu đối ngoại: acordeão com dàn ý, nota pessoal e autoavaliação.
export default function QuestionsTab({ iv, saveIv, filter, openQuestion, setOpenQuestion }) {
  const visible = INTERVIEW_QUESTIONS.filter((q) => matchesFilter(filter, iv.ratings[q.n]));
  // Clicar de novo na mesma avaliação desmarca.
  const setRating = (n, r) => saveIv({ ratings: { ...iv.ratings, [n]: iv.ratings[n] === r ? undefined : r } });
  const setNote = (key, text) => saveIv({ notes: { ...iv.notes, [key]: text } });

  if (visible.length === 0) {
    return <div style={{ fontSize: 14, color: LIGHT.muted, padding: "12px 0" }}>Không có câu nào trong bộ lọc này.</div>;
  }

  return visible.map((q, idx) => (
    <Fragment key={q.n}>
      {(idx === 0 || visible[idx - 1].part !== q.part) && <GroupHeading>{q.part}</GroupHeading>}
      <QuestionCard
        q={q}
        open={openQuestion === q.n}
        rating={iv.ratings[q.n]}
        note={iv.notes[`q${q.n}`] || ""}
        onToggle={() => setOpenQuestion(openQuestion === q.n ? null : q.n)}
        onRate={(r) => setRating(q.n, r)}
        onNote={(text) => setNote(`q${q.n}`, text)}
      />
    </Fragment>
  ));
}

function QuestionCard({ q, open, rating, note, onToggle, onRate, onNote }) {
  return (
    <div style={{ ...lightCardBlock, padding: 0, overflow: "hidden", border: `1px solid ${open ? LIGHT.gold : LIGHT.border}` }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left", background: "none", border: "none", padding: "14px 16px", cursor: "pointer", color: LIGHT.text, ...bodyFont }}>
        <div style={{ ...monoFont, fontSize: 13, fontWeight: 700, color: LIGHT.gold, minWidth: 30, paddingTop: 2 }}>{q.n}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.5 }}>{q.question}</div>
          <div style={{ fontSize: 12.5, color: LIGHT.muted, marginTop: 3 }}>{q.title}</div>
        </div>
        {rating && <span style={{ fontSize: 11.5, fontWeight: 600, padding: "3px 9px", borderRadius: 999, color: "#fff", background: RATING[rating].color, flexShrink: 0 }}>{RATING[rating].label}</span>}
        <ChevronRight size={16} color={LIGHT.muted} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .2s", flexShrink: 0, marginTop: 3 }} />
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px 58px" }}>
          <AnswerSections q={q} />
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: LIGHT.muted, margin: "14px 0 6px" }}><PenLine size={14} /> Ghi chú của bạn (số liệu cập nhật, ví dụ riêng)</div>
          <textarea value={note} onChange={(e) => onNote(e.target.value)} placeholder="Viết ý của bạn ở đây..." style={lightTextarea} />
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {Object.entries(RATING).map(([key, { label, color }]) => (
              <button key={key} onClick={() => onRate(key)} style={{ border: `1px solid ${color}`, background: rating === key ? color : "transparent", color: rating === key ? "#fff" : color, borderRadius: 999, padding: "6px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", ...bodyFont }}>{label}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
