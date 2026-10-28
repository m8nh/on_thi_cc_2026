import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { COLORS, TINT, bodyFont, displayFont, monoFont } from "../theme.js";
import { btnStyle } from "../styles.js";

const XP_CORRECT = 15;
const XP_WRONG = 3;

export default function QuizView({ subject, onComplete }) {
  const questions = subject.quiz;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ xp: 0, correct: 0 });
  const question = questions[index];
  const answered = selected !== null;
  const isLast = index === questions.length - 1;

  const advance = () => {
    const correct = selected === question.correct;
    const next = { xp: score.xp + (correct ? XP_CORRECT : XP_WRONG), correct: score.correct + (correct ? 1 : 0) };
    if (isLast) {
      onComplete(next.xp, { kind: "quiz", quizCorrect: next.correct, quizTotal: questions.length });
    } else {
      setScore(next);
      setIndex(index + 1);
      setSelected(null);
    }
  };

  return (
    <div>
      <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 10, ...monoFont }}>câu {index + 1} / {questions.length}</div>
      <div style={{ ...displayFont, fontSize: 18, fontWeight: 500, marginBottom: 14, lineHeight: 1.5 }}>{question.q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {question.options.map((opt, i) => (
          <button key={i} disabled={answered} onClick={() => setSelected(i)} style={optionStyle(answered, i === question.correct, i === selected)}>{opt}</button>
        ))}
      </div>
      {answered && (
        <>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 12, fontSize: 14.5, color: COLORS.muted, marginBottom: 14 }}>{question.why}</div>
          <button onClick={advance} style={btnStyle(COLORS.gold, true)}>{isLast ? "Xem kết quả" : "Câu tiếp theo"} <ChevronRight size={15} /></button>
        </>
      )}
    </div>
  );
}

function optionStyle(answered, isCorrect, isSelected) {
  let border = COLORS.border, background = "transparent";
  if (answered && isCorrect) { border = COLORS.teal; background = TINT.teal; }
  else if (answered && isSelected) { border = COLORS.red; background = TINT.red; }
  return { textAlign: "left", padding: "11px 14px", borderRadius: 10, border: `1px solid ${border}`, background, color: COLORS.text, cursor: answered ? "default" : "pointer", fontSize: 15.5, ...bodyFont };
}
