import { useState } from "react";
import { ExternalLink, Mic } from "lucide-react";
import { LIGHT, LIGHT_GRADIENT, displayFont } from "../../theme.js";
import { lightCardBlock, plainBtn } from "../../styles.js";
import { ProgressBar, StatGrid } from "../../components/ui.jsx";
import { INTERVIEW_DOC_URL, INTERVIEW_INTRO, INTERVIEW_QUESTIONS } from "../../data/interviewData.js";
import { PROFILE_KEYS } from "../../lib/interview.js";
import { OutlineBlock } from "./AnswerSections.jsx";

export default function ProgressCard({ iv }) {
  const [showIntro, setShowIntro] = useState(false);
  const countRated = (pred) => INTERVIEW_QUESTIONS.filter((q) => pred(iv.ratings[q.n])).length;
  const rated = countRated(Boolean);
  const good = countRated((r) => r === "good");
  const weak = countRated((r) => r === "weak");
  const prepared = PROFILE_KEYS.filter((k) => iv.prepared[k]).length;
  const total = INTERVIEW_QUESTIONS.length + PROFILE_KEYS.length;

  return (
    <div style={lightCardBlock}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Mic size={16} color={LIGHT.gold} />
        <span style={{ ...displayFont, fontWeight: 600, fontSize: 15 }}>Tiến độ ôn phỏng vấn</span>
      </div>
      <StatGrid items={[
        ["Đã luyện", `${rated}/${INTERVIEW_QUESTIONS.length}`, LIGHT.text],
        ["Tốt", good, LIGHT.teal],
        ["Cần ôn", weak, LIGHT.red],
        ["Câu hồ sơ", `${prepared}/${PROFILE_KEYS.length}`, LIGHT.purple],
      ]} />
      <ProgressBar pct={Math.round(((rated + prepared) / total) * 100)} height={7} fill={LIGHT_GRADIENT} style={{ marginBottom: 12 }} />
      <button onClick={() => setShowIntro(!showIntro)} style={{ ...plainBtn, color: LIGHT.purple, fontSize: 13, fontWeight: 600, marginBottom: showIntro ? 8 : 0, display: "block" }}>
        {showIntro ? "Ẩn cách dùng" : "Cách dùng và điểm mới bắt buộc phải nhắc"}
      </button>
      {showIntro && INTERVIEW_INTRO.map((b, i) => <OutlineBlock key={i} b={b} />)}
      <a href={INTERVIEW_DOC_URL} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: LIGHT.purple, marginTop: 4 }}>
        Mở bản tài liệu đầy đủ <ExternalLink size={12} />
      </a>
    </div>
  );
}
