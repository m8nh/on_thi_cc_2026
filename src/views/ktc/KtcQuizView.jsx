import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Flag } from "lucide-react";
import { COLORS, TINT, bodyFont, displayFont, monoFont } from "../../theme.js";
import { btnStyle, darkPanelStyle } from "../../styles.js";
import { docOfQuestion } from "../../lib/ktcBank.js";
import { formatClock } from "../../lib/dates.js";

const XP_CORRECT = 15;
const XP_WRONG = 3;
const XP_EXAM_CORRECT = 10;
const XP_EXAM_PASS = 50;
const LETTERS = ["A", "B", "C", "D"];

const isRight = (it, ans) => {
  if (ans == null) return false;
  if (it.t === "tf") return ans[0] === it.a[0] && ans[1] === it.a[1];
  return ans === it.c;
};

/* ---------------------------------------------------------
   mode "practice": corrige na hora, com căn cứ, giải thích e mẹo nhớ.
   mode "exam": 60 câu / 60 phút, sem correção até nộp bài, depois revisão.
--------------------------------------------------------- */
export default function KtcQuizView({ items, mode = "practice", minutes = 60, passRatio = 0.5, onFinish }) {
  return mode === "exam"
    ? <ExamQuiz items={items} minutes={minutes} passRatio={passRatio} onFinish={onFinish} />
    : <PracticeQuiz items={items} onFinish={onFinish} />;
}

function PracticeQuiz({ items, onFinish }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [results, setResults] = useState([]);
  const it = items[index];
  if (!it) return null;
  const done = it.t === "tf" ? !!answer && answer[0] != null && answer[1] != null : answer !== null;
  const isLast = index === items.length - 1;

  const advance = () => {
    const next = [...results, { id: it.id, correct: isRight(it, answer) }];
    if (isLast) {
      const correct = next.filter((r) => r.correct).length;
      const xp = correct * XP_CORRECT + (next.length - correct) * XP_WRONG;
      onFinish(next, xp, { quizCorrect: correct, quizTotal: next.length });
    } else {
      setResults(next);
      setIndex(index + 1);
      setAnswer(null);
    }
  };

  return (
    <div>
      <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 10, ...monoFont }}>câu {index + 1} / {items.length}{it.s ? ` · ${it.s}` : ""}</div>
      <QuestionBody it={it} answer={answer} setAnswer={setAnswer} reveal={done} />
      {done && (
        <>
          <Explanation it={it} correct={isRight(it, answer)} />
          <button onClick={advance} style={btnStyle(COLORS.gold, true)}>{isLast ? "Xem kết quả" : "Câu tiếp theo"} <ChevronRight size={15} /></button>
        </>
      )}
    </div>
  );
}

const WARN_MS = 5 * 60000;

function ExamQuiz({ items, minutes, passRatio, onFinish }) {
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const endAt = useRef(Date.now() + minutes * 60000);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (submitted) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [submitted]);
  const left = Math.max(0, endAt.current - now);
  useEffect(() => { if (!submitted && left === 0) setSubmitted(true); }, [left, submitted]);

  if (submitted) return <ExamResult items={items} answers={answers} passRatio={passRatio} onFinish={onFinish} />;

  const it = items[index];
  const answeredCount = Object.keys(answers).length;
  const unanswered = items.length - answeredCount;
  const submit = () => (unanswered > 0 && !confirming ? setConfirming(true) : setSubmitted(true));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ color: COLORS.muted, fontSize: 14, ...monoFont }}>câu {index + 1} / {items.length} · đã làm {answeredCount}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, ...monoFont, fontSize: 16, color: left < WARN_MS ? COLORS.red : COLORS.gold }}>
          <Clock size={15} />{formatClock(Math.floor(left / 1000))}
        </span>
      </div>
      <QuestionBody it={it} answer={answers[it.id] ?? null} setAnswer={(a) => setAnswers((s) => ({ ...s, [it.id]: a }))} reveal={false} />
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button disabled={index === 0} onClick={() => setIndex(index - 1)} style={{ ...btnStyle(COLORS.muted), opacity: index === 0 ? 0.4 : 1 }}><ChevronLeft size={15} /> Câu trước</button>
        {index < items.length - 1
          ? <button onClick={() => setIndex(index + 1)} style={btnStyle(COLORS.gold)}>Câu sau <ChevronRight size={15} /></button>
          : <span style={{ flex: 1 }} />}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 5, marginBottom: 14 }}>
        {items.map((q, i) => (
          <button key={q.id} onClick={() => setIndex(i)} style={{
            ...monoFont, fontSize: 12, padding: "6px 0", borderRadius: 6, cursor: "pointer",
            border: `1px solid ${i === index ? COLORS.gold : COLORS.border}`,
            background: answers[q.id] != null ? TINT.teal : "transparent", color: COLORS.text,
          }}>{i + 1}</button>
        ))}
      </div>
      <button onClick={submit} style={btnStyle(confirming ? COLORS.red : COLORS.teal, true)}>
        <Flag size={15} /> {confirming ? `Còn ${unanswered} câu chưa làm · nhấn lần nữa để nộp` : `Nộp bài (${answeredCount}/${items.length})`}
      </button>
    </div>
  );
}

// Acertos por văn bản, do pior para o melhor: [{ name, correct, total }]
function scoreByDoc(items, results) {
  const byDoc = new Map();
  items.forEach((it, i) => {
    const name = docOfQuestion(it.id)?.name ?? "Khác";
    const score = byDoc.get(name) ?? { name, correct: 0, total: 0 };
    score.total += 1;
    if (results[i].correct) score.correct += 1;
    byDoc.set(name, score);
  });
  return [...byDoc.values()].sort((a, b) => a.correct / a.total - b.correct / b.total);
}

function ExamResult({ items, answers, passRatio, onFinish }) {
  const [openReviewId, setOpenReviewId] = useState(null);
  const results = items.map((it) => ({ id: it.id, correct: isRight(it, answers[it.id]) }));
  const correct = results.filter((r) => r.correct).length;
  const passMark = Math.ceil(items.length * passRatio);
  const passed = correct >= passMark;
  const wrongItems = items.filter((_, i) => !results[i].correct);
  const xp = correct * XP_EXAM_CORRECT + (passed ? XP_EXAM_PASS : 0);
  // Só as respondidas entram na estatística por questão; em branco não conta como erro.
  const finish = () => onFinish(results.filter((r) => answers[r.id] != null), xp, { quizCorrect: correct, quizTotal: items.length });

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ ...displayFont, fontSize: 22, fontWeight: 600 }}>{passed ? "Đạt Vòng 1" : "Chưa đạt"}</div>
        <div style={{ ...monoFont, fontSize: 30, color: passed ? COLORS.teal : COLORS.red, margin: "6px 0" }}>{correct} / {items.length}</div>
        <div style={{ color: COLORS.muted, fontSize: 14 }}>Cần đúng ít nhất {passMark} câu · đã trả lời {Object.keys(answers).length} câu</div>
      </div>
      <div style={darkPanelStyle}>
        <div style={{ ...displayFont, fontWeight: 600, marginBottom: 8 }}>Kết quả theo văn bản</div>
        {scoreByDoc(items, results).map(({ name, correct: ok, total }) => (
          <div key={name} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: COLORS.muted, padding: "3px 0" }}>
            <span>{name}</span><span style={{ ...monoFont, color: ok / total >= passRatio ? COLORS.teal : COLORS.red }}>{ok}/{total}</span>
          </div>
        ))}
      </div>
      {wrongItems.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...displayFont, fontWeight: 600, marginBottom: 8 }}>Xem lại {wrongItems.length} câu sai</div>
          {wrongItems.map((it) => {
            const open = openReviewId === it.id;
            return (
              <div key={it.id} style={{ ...darkPanelStyle, padding: 12, marginBottom: 8 }}>
                <button onClick={() => setOpenReviewId(open ? null : it.id)} style={{ background: "none", border: "none", color: COLORS.text, textAlign: "left", cursor: "pointer", fontSize: 14.5, lineHeight: 1.5, padding: 0, width: "100%", ...bodyFont }}>
                  {it.q}
                </button>
                {open && (
                  <div style={{ marginTop: 10 }}>
                    <QuestionBody it={it} answer={answers[it.id] ?? null} setAnswer={() => {}} reveal hideStem />
                    <Explanation it={it} correct={false} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <button onClick={finish} style={btnStyle(COLORS.gold, true)}>Nhận {xp} XP</button>
    </div>
  );
}

/* ---------- Partes compartilhadas ---------- */

function QuestionBody({ it, answer, setAnswer, reveal, hideStem }) {
  if (it.t === "tf") {
    const a = answer || [null, null];
    return (
      <div style={{ marginBottom: 14 }}>
        {!hideStem && <div style={{ ...displayFont, fontSize: 17.5, fontWeight: 500, marginBottom: 12, lineHeight: 1.5 }}>{it.q}</div>}
        {it.st.map((s, k) => (
          <div key={k} style={{ ...darkPanelStyle, padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 8 }}>{k === 0 ? "①" : "②"} {s}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[true, false].map((v) => (
                <button key={String(v)} disabled={reveal} onClick={() => { const n = [...a]; n[k] = v; setAnswer(n); }}
                  style={optionStyle(reveal, it.a[k] === v, a[k] === v, true)}>{v ? "Đúng" : "Sai"}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <>
      {!hideStem && <div style={{ ...displayFont, fontSize: 17.5, fontWeight: 500, marginBottom: 14, lineHeight: 1.5 }}>{it.q}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {it.o.map((opt, i) => (
          <button key={i} disabled={reveal} onClick={() => setAnswer(i)} style={optionStyle(reveal, i === it.c, i === answer)}>
            <b style={{ ...monoFont, marginRight: 8 }}>{LETTERS[i]}.</b>{opt}
          </button>
        ))}
      </div>
    </>
  );
}

function Explanation({ it, correct }) {
  const answerText = it.t === "tf"
    ? `① ${it.a[0] ? "Đúng" : "Sai"} · ② ${it.a[1] ? "Đúng" : "Sai"}`
    : `${LETTERS[it.c]}. ${it.o[it.c]}`;
  const row = (label, text, color) => text ? (
    <div style={{ marginTop: 6 }}><b style={{ color }}>{label}:</b> {text}</div>
  ) : null;
  return (
    <div style={{ ...darkPanelStyle, padding: 12, fontSize: 14.5, color: COLORS.muted, lineHeight: 1.6, marginBottom: 14 }}>
      <div style={{ color: correct ? COLORS.teal : COLORS.red, fontWeight: 600 }}>{correct ? "Chính xác" : "Chưa đúng"} · Đáp án: {answerText}</div>
      {row("Căn cứ", it.cc, COLORS.gold)}
      {row("Giải thích", it.gt, COLORS.text)}
      {row("Mẹo nhớ", it.mn, COLORS.teal)}
    </div>
  );
}

function optionStyle(reveal, isCorrect, isSelected, compact) {
  let border = COLORS.border, background = "transparent";
  if (reveal && isCorrect) { border = COLORS.teal; background = TINT.teal; }
  else if (reveal && isSelected) { border = COLORS.red; background = TINT.red; }
  else if (!reveal && isSelected) { border = COLORS.gold; background = TINT.gold; }
  return {
    flex: compact ? 1 : undefined, textAlign: compact ? "center" : "left", padding: compact ? "8px 12px" : "11px 14px",
    borderRadius: 10, border: `1px solid ${border}`, background, color: COLORS.text,
    cursor: reveal ? "default" : "pointer", fontSize: 15.5, lineHeight: 1.45, ...bodyFont,
  };
}
