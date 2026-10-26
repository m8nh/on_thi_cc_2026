import { useState } from "react";
import { lightPagePadding, pillStyle } from "../../styles.js";
import { BackButton, PageHeader } from "../../components/ui.jsx";
import { INTERVIEW_CARDS } from "../../data/interviewData.js";
import { PROFILE_KEYS } from "../../lib/interview.js";
import ProgressCard from "./ProgressCard.jsx";
import DrawPanel from "./DrawPanel.jsx";
import MemoryMapTab from "./MemoryMapTab.jsx";
import FlashcardTab from "./FlashcardTab.jsx";
import QuestionsTab, { QuestionFilter } from "./QuestionsTab.jsx";
import ProfileTab from "./ProfileTab.jsx";

const TABS = [
  ["ban-do", "Bản đồ ghi nhớ"],
  ["flash", `Flash card (${INTERVIEW_CARDS.length})`],
  ["doi-ngoai", "20 câu đối ngoại"],
  ["ho-so", `Câu về hồ sơ & tình huống (${PROFILE_KEYS.length})`],
];

// ui (aba, filtros, tempos) vive no App para sobreviver à ida à tela de recompensa.
export default function InterviewView({ progress, setProgress, ui, setUi, onComplete, onBack }) {
  const [openQuestion, setOpenQuestion] = useState(null);
  const iv = progress.interview;
  const saveIv = (patch) => setProgress((p) => ({ ...p, interview: { ...p.interview, ...patch } }));

  const jumpToQuestion = (n) => {
    setUi({ tab: "doi-ngoai", filter: "all" });
    setOpenQuestion(n);
  };

  return (
    <div style={lightPagePadding}>
      <BackButton light onClick={onBack}>Trang chủ</BackButton>
      <PageHeader title="Phỏng vấn vòng 2" subtitle="Tối đa 30 phút · 100 điểm · không phúc khảo. Hội đồng chấm cấu trúc và lập trường hơn độ dài." />

      <div className="tda-dash-grid">
        <ProgressCard iv={iv} />
        <DrawPanel iv={iv} ui={ui} setUi={setUi} onComplete={onComplete} />
      </div>

      <div style={{ display: "flex", gap: 8, margin: "8px 0 14px", flexWrap: "wrap" }}>
        {TABS.map(([key, label]) => (
          <button key={key} onClick={() => setUi({ tab: key })} style={pillStyle(ui.tab === key)}>{label}</button>
        ))}
        {ui.tab === "doi-ngoai" && <QuestionFilter value={ui.filter} onChange={(filter) => setUi({ filter })} />}
      </div>

      {ui.tab === "ban-do" && <MemoryMapTab ratings={iv.ratings} onOpenQuestion={jumpToQuestion} />}
      {ui.tab === "flash" && <FlashcardTab cards={iv.cards || {}} deck={ui.deck} setDeck={(deck) => setUi({ deck })} saveIv={saveIv} onComplete={onComplete} />}
      {ui.tab === "doi-ngoai" && <QuestionsTab iv={iv} saveIv={saveIv} filter={ui.filter} openQuestion={openQuestion} setOpenQuestion={setOpenQuestion} />}
      {ui.tab === "ho-so" && <ProfileTab iv={iv} saveIv={saveIv} />}
    </div>
  );
}
