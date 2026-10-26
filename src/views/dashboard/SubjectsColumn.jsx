import { CalendarDays } from "lucide-react";
import { LIGHT, displayFont, monoFont } from "../../theme.js";
import { lightCardBlock } from "../../styles.js";
import { GroupHeading, SubjectRow } from "../../components/ui.jsx";
import { COMBINED_SUBJECT, STAGE1_SUBJECTS, WRITING_SUBJECT } from "../../data/subjects.js";
import { TIPS } from "../../data/tips.js";
import { WEEKDAYS_VI, buildCalendarGrid, toDateKey } from "../../lib/dates.js";

const headingStyle = { fontSize: 14.5, margin: "18px 0 8px" };

export default function SubjectsColumn({ progress, actions }) {
  return (
    <div>
      <GroupHeading style={headingStyle}>Vòng 1 · Kiến thức chung</GroupHeading>
      <SubjectRow subject={COMBINED_SUBJECT} highlight onClick={() => actions.openDeck(COMBINED_SUBJECT.id)} />
      <div style={{ fontSize: 12, color: LIGHT.muted, margin: "12px 0 8px" }}>Hoặc luyện riêng từng chuyên đề:</div>
      {STAGE1_SUBJECTS.map((s) => <SubjectRow key={s.id} subject={s} onClick={() => actions.openDeck(s.id)} />)}

      <GroupHeading style={headingStyle}>Vòng 2 · Kỹ năng ngôn ngữ</GroupHeading>
      <SubjectRow subject={WRITING_SUBJECT} onClick={actions.openWriting} />

      <MiniCalendar sessionDates={progress.sessionDates} />
      <Achievements tipsSeen={progress.tipsSeen} />
    </div>
  );
}

// Mini calendário: dias com sessão de estudo ficam marcados.
function MiniCalendar({ sessionDates }) {
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const todayKey = toDateKey(year, month, now.getDate());
  return (
    <div style={lightCardBlock}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <CalendarDays size={14} color={LIGHT.teal} />
        <span style={{ ...displayFont, fontWeight: 600, fontSize: 15 }}>Tháng {month + 1}, {year}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {WEEKDAYS_VI.map((w) => <div key={w} style={{ textAlign: "center", fontSize: 11, color: LIGHT.muted, ...monoFont }}>{w}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {buildCalendarGrid(year, month).map((d, i) => {
          if (!d) return <div key={i} />;
          const key = toDateKey(year, month, d);
          const studied = sessionDates.includes(key);
          const isToday = key === todayKey;
          return (
            <div key={i} style={{
              aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, fontSize: 12,
              ...monoFont, color: isToday ? "#fff" : LIGHT.text,
              background: isToday ? LIGHT.gold : studied ? "rgba(46,154,118,0.12)" : "transparent",
              border: studied && !isToday ? `1px solid ${LIGHT.teal}` : "1px solid transparent",
              fontWeight: isToday ? 700 : 400,
            }}>{d}</div>
          );
        })}
      </div>
    </div>
  );
}

// Bảng thành tích: uma medalha por dica desbloqueada.
function Achievements({ tipsSeen }) {
  return (
    <>
      <div style={{ ...displayFont, fontSize: 15.5, fontWeight: 600, margin: "20px 0 10px" }}>Bảng thành tích</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {TIPS.map((tip, i) => {
          const Icon = tip.icon;
          const unlocked = tipsSeen.includes(i);
          return (
            <div key={i} title={unlocked ? tip.title : "Chưa mở khóa"} style={{
              aspectRatio: "1", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
              background: unlocked ? LIGHT.goldSoft : LIGHT.surface,
              border: `1px solid ${unlocked ? LIGHT.gold : LIGHT.border}`, opacity: unlocked ? 1 : 0.45,
            }}>
              <Icon size={14} color={unlocked ? LIGHT.gold : LIGHT.muted} />
            </div>
          );
        })}
      </div>
    </>
  );
}
