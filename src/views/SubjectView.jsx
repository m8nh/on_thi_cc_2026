import { BookOpen, ChevronRight, Layers } from "lucide-react";
import { COLORS, displayFont } from "../theme.js";
import { iconBoxStyle, subjectCardStyle } from "../styles.js";

export default function SubjectView({ subject, onStartFlashcards, onStartQuiz }) {
  return (
    <div>
      <div style={{ ...displayFont, fontSize: 20.5, fontWeight: 600, marginBottom: 4 }}>{subject.name}</div>
      <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 20 }}>{subject.ref}</div>
      <ModeCard icon={Layers} title="Flash card" sub={`${subject.flashcards.length} thẻ · +5 đến 15 XP/thẻ`} onClick={onStartFlashcards} />
      <ModeCard icon={BookOpen} title="Đề thi thử" sub={`${subject.quiz.length} câu hỏi · tối đa +${subject.quiz.length * 15} XP`} onClick={onStartQuiz} />
    </div>
  );
}

function ModeCard({ icon: Icon, title, sub, onClick }) {
  return (
    <button onClick={onClick} style={subjectCardStyle}>
      <div style={iconBoxStyle}><Icon size={17} color={COLORS.teal} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ ...displayFont, fontWeight: 600, fontSize: 16.5 }}>{title}</div>
        <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>{sub}</div>
      </div>
      <ChevronRight size={16} color={COLORS.muted} />
    </button>
  );
}
