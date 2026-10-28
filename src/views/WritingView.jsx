import { useRef, useState } from "react";
import { Clock } from "lucide-react";
import { COLORS, displayFont, monoFont } from "../theme.js";
import { btnStyle, darkPanelStyle, labelStyle, textareaStyle } from "../styles.js";
import { SectionTitle, TextBlock } from "../components/ui.jsx";
import { CHECKLIST_CRITERIA, WRITING_SUBJECT } from "../data/subjects.js";
import { formatClock } from "../lib/dates.js";
import { requestWritingFeedback } from "../lib/writingFeedback.js";
import { useTicker } from "../hooks/useTicker.js";

const COMPLETION_XP = 40;
const DRAFT_SAVE_DELAY_MS = 700;
const { content, timeLimitMinutes } = WRITING_SUBJECT;

const emptyDraft = (startedAt) => ({
  startedAt, summaryText: "", answers: content.questions.map(() => ""), translationVi: "", translationPt: "",
});

export default function WritingView({ progress, setProgress, onComplete }) {
  // Rascunho em andamento (retomado do progresso salvo); null = prova ainda não começou.
  const [draft, setDraft] = useState(() => (progress.writingDraft ? { ...emptyDraft(), ...progress.writingDraft } : null));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { text } | { error: true }
  const saveTimer = useRef(null);

  useTicker(!!draft && !result);

  const saveDraft = (next) => setProgress((p) => ({ ...p, writingDraft: next }));

  const start = () => {
    const next = emptyDraft(Date.now());
    setDraft(next);
    saveDraft(next);
  };

  const updateDraft = (patch) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveDraft(next), DRAFT_SAVE_DELAY_MS);
  };

  const submit = async () => {
    setLoading(true);
    try {
      setResult({ text: await requestWritingFeedback(draft) });
    } catch (e) {
      console.error("Lỗi khi lấy phản hồi AI:", e);
      setResult({ error: true });
    } finally {
      clearTimeout(saveTimer.current);
      saveDraft(null);
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ ...displayFont, fontSize: 20.5, fontWeight: 600, marginBottom: 4 }}>{WRITING_SUBJECT.name}</div>
      <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 18 }}>{WRITING_SUBJECT.ref}</div>

      {!draft && !result && (
        <div>
          <div style={{ ...darkPanelStyle, fontSize: 14.5, color: COLORS.muted, lineHeight: 1.7 }}>
            Bài thi gồm 3 phần: (1) đọc hiểu + tóm tắt + trả lời câu hỏi, (2) dịch trích đoạn sang tiếng Việt, (3) dịch một bài viết sang tiếng Bồ Đào Nha. Thời gian làm bài: {timeLimitMinutes} phút. Khi nộp bài, bạn có thể nhận phản hồi từ AI hoặc tự chấm theo checklist.
          </div>
          <button onClick={start} style={btnStyle(COLORS.gold, true)}>Bắt đầu làm bài ({timeLimitMinutes} phút)</button>
        </div>
      )}

      {draft && !result && <ExamForm draft={draft} onChange={updateDraft} onSubmit={submit} loading={loading} />}

      {result && <FeedbackPanel result={result} onFinish={() => onComplete(COMPLETION_XP, { kind: "writing" })} />}
    </div>
  );
}

function ExamForm({ draft, onChange, onSubmit, loading }) {
  const remaining = Math.max(0, timeLimitMinutes * 60 - Math.floor((Date.now() - draft.startedAt) / 1000));
  const timeUp = remaining === 0;
  const setAnswer = (i, value) => onChange({ answers: draft.answers.map((a, j) => (j === i ? value : a)) });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", background: COLORS.surface, border: `1px solid ${timeUp ? COLORS.red : COLORS.gold}`, borderRadius: 12, padding: "10px 14px", marginBottom: 18, ...monoFont, fontSize: 18.5 }}>
        <Clock size={15} color={timeUp ? COLORS.red : COLORS.gold} /> {formatClock(remaining)} {timeUp && <span style={{ fontSize: 12.5, color: COLORS.red }}>(Hết giờ)</span>}
      </div>

      <SectionTitle>Phần 1 · Đọc hiểu, tóm tắt & trả lời câu hỏi</SectionTitle>
      <TextBlock>{content.readingText}</TextBlock>
      <label style={labelStyle}>Tóm tắt (250–300 từ)</label>
      <textarea style={textareaStyle} value={draft.summaryText} onChange={(e) => onChange({ summaryText: e.target.value })} placeholder="Viết tóm tắt ở đây..." />
      {content.questions.map((q, i) => (
        <div key={i}>
          <label style={labelStyle}>{q}</label>
          <textarea style={{ ...textareaStyle, minHeight: 60 }} value={draft.answers[i]} onChange={(e) => setAnswer(i, e.target.value)} />
        </div>
      ))}

      <SectionTitle>Phần 2 · Dịch sang tiếng Việt</SectionTitle>
      <TextBlock>{content.excerptToVietnamese}</TextBlock>
      <label style={labelStyle}>Bản dịch tiếng Việt</label>
      <textarea style={textareaStyle} value={draft.translationVi} onChange={(e) => onChange({ translationVi: e.target.value })} placeholder="Viết bản dịch ở đây..." />

      <SectionTitle>Phần 3 · Dịch sang tiếng Bồ Đào Nha</SectionTitle>
      <TextBlock>{content.sourceToPortuguese}</TextBlock>
      <label style={labelStyle}>Bản dịch tiếng Bồ Đào Nha</label>
      <textarea style={textareaStyle} value={draft.translationPt} onChange={(e) => onChange({ translationPt: e.target.value })} placeholder="Escreva a tradução aqui..." />

      <button onClick={onSubmit} disabled={loading} style={{ ...btnStyle(COLORS.gold, true), opacity: loading ? 0.6 : 1 }}>
        {loading ? "Đang chấm bài..." : "Nộp bài & nhận phản hồi"}
      </button>
    </div>
  );
}

// Sem IA disponível, cai no checklist de autoavaliação.
function FeedbackPanel({ result, onFinish }) {
  const [checklist, setChecklist] = useState({});
  return (
    <div>
      <div style={{ ...displayFont, fontSize: 16, fontWeight: 600, color: COLORS.gold, marginBottom: 10 }}>
        {result.error ? "Không thể chấm bằng AI — tự đánh giá theo checklist:" : "Phản hồi từ AI"}
      </div>
      {result.error ? (
        <div style={darkPanelStyle}>
          {CHECKLIST_CRITERIA.map((c, i) => (
            <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, marginBottom: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={!!checklist[i]} onChange={() => setChecklist({ ...checklist, [i]: !checklist[i] })} />
              {c}
            </label>
          ))}
        </div>
      ) : (
        <div style={{ ...darkPanelStyle, fontSize: 14.5, color: COLORS.text, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{result.text}</div>
      )}
      <button onClick={onFinish} style={btnStyle(COLORS.gold, true)}>Hoàn tất buổi luyện tập (+{COMPLETION_XP} XP)</button>
    </div>
  );
}
