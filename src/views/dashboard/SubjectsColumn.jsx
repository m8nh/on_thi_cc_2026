import { useState } from "react";
import { BookOpen, CalendarDays, ChevronDown, ChevronRight, PlayCircle, Trophy } from "lucide-react";
import { LIGHT, TINT, displayFont, monoFont } from "../../theme.js";
import { lightCardBlock, lightCardStyle, lightIconBox } from "../../styles.js";
import { GroupHeading, ProgressBar, SubjectRow, VideoPlayer } from "../../components/ui.jsx";
import { NGHIEP_VU_SUBJECT, WRITING_SUBJECT } from "../../data/subjects.js";
import { KTC_DOCS, KTC_GROUPS, KTC_MOCK_ID, KTC_TOTAL_QUESTIONS, MOCK_EXAM, ktcDocsInGroup, ktcQuestionTotal, priorityStars, REVIEW_VIDEOS } from "../../data/ktc/vanBan.js";
import { countSeen, docStats } from "../../lib/ktcBank.js";
import { WEEKDAYS_VI, buildCalendarGrid, toDateKey } from "../../lib/dates.js";

const headingStyle = { fontSize: 14.5, margin: "18px 0 8px" };

export default function SubjectsColumn({ progress, actions }) {
  const [showDocs, setShowDocs] = useState(false);
  const [openVideo, setOpenVideo] = useState(null);
  const seen = countSeen(progress.qStats);
  return (
    <div>
      <GroupHeading style={headingStyle}>Vòng 1 · Kiến thức chung</GroupHeading>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <Vong1Tile
          icon={Trophy} accent={LIGHT.gold} title="Thi thử"
          sub={`${MOCK_EXAM.questions} câu · ${MOCK_EXAM.minutes} phút · đạt từ ${MOCK_EXAM.passRatio * 100}%`}
          onClick={() => actions.openDeck(KTC_MOCK_ID)}
        />
        <Vong1Tile
          icon={BookOpen} accent={LIGHT.teal} title="Ôn tài liệu" active={showDocs}
          sub={`${KTC_DOCS.length} văn bản · ${seen}/${KTC_TOTAL_QUESTIONS} câu đã làm`}
          trailing={<ExpandChevron open={showDocs} />}
          onClick={() => setShowDocs((v) => !v)}
        />
      </div>
      {REVIEW_VIDEOS.map((v) => (
        <div key={v.id} style={{ marginBottom: 10 }}>
          <Vong1Tile
            icon={PlayCircle} accent={LIGHT.gold} title={`Video ôn tập · ${v.title}`} active={openVideo === v.id}
            sub={`${v.length} · ${v.sub}`}
            trailing={<ExpandChevron open={openVideo === v.id} />}
            onClick={() => setOpenVideo((cur) => (cur === v.id ? null : v.id))}
          />
          {openVideo === v.id && (
            <VideoPlayer file={v.file} style={{ marginTop: 8 }} />
          )}
        </div>
      ))}
      {showDocs && KTC_GROUPS.map((g) => (
        <div key={g.id}>
          <div style={{ fontSize: 12.5, color: LIGHT.muted, fontWeight: 600, margin: "12px 0 7px" }}>{g.no}. {g.title}</div>
          {ktcDocsInGroup(g.id).map((d) => (
            <KtcRow key={d.id} doc={d} qStats={progress.qStats} onClick={() => actions.openDeck(d.id)} />
          ))}
        </div>
      ))}

      <GroupHeading style={headingStyle}>Vòng 2 · Kỹ năng ngôn ngữ</GroupHeading>
      <SubjectRow subject={WRITING_SUBJECT} onClick={actions.openWriting} />
      <SubjectRow subject={NGHIEP_VU_SUBJECT} onClick={() => actions.openDeck(NGHIEP_VU_SUBJECT.id)} />

      <MiniCalendar sessionDates={progress.sessionDates} />
    </div>
  );
}

const ExpandChevron = ({ open }) => (
  <ChevronDown size={15} color={LIGHT.muted} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
);

// Ô lớn của Vòng 1 (Thi thử / Ôn tài liệu).
function Vong1Tile({ icon: Icon, accent, title, sub, onClick, active, trailing }) {
  return (
    <button onClick={onClick} style={{
      ...lightCardBlock, width: "100%", marginBottom: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10,
      textAlign: "left", cursor: "pointer", color: LIGHT.text, border: `1px solid ${active ? accent : LIGHT.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <div style={{ ...lightIconBox, background: accent === LIGHT.gold ? LIGHT.goldSoft : TINT.teal }}><Icon size={17} color={accent} /></div>
        {trailing ?? <ChevronRight size={15} color={LIGHT.muted} />}
      </div>
      <div>
        <div style={{ ...displayFont, fontWeight: 600, fontSize: 16 }}>{title}</div>
        <div style={{ color: LIGHT.muted, fontSize: 12, marginTop: 3, lineHeight: 1.4 }}>{sub}</div>
      </div>
    </button>
  );
}

// Linha de văn bản: prioridade, quantas questões já fez.
function KtcRow({ doc, qStats, onClick }) {
  const Icon = doc.icon;
  const total = ktcQuestionTotal(doc);
  const { seen } = docStats(doc.id, qStats);
  const pct = total ? Math.round((seen / total) * 100) : 0;
  return (
    <button onClick={onClick} style={lightCardStyle}>
      <div style={lightIconBox}><Icon size={16} color={LIGHT.teal} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...displayFont, fontWeight: 600, fontSize: 15 }}>{doc.no}. {doc.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <span style={{ color: LIGHT.gold, fontSize: 11.5, letterSpacing: 1 }}>{priorityStars(doc.priority)}</span>
          {total > 0 ? (
            <>
              <ProgressBar pct={pct} height={4} style={{ flex: 1, maxWidth: 140 }} fill={LIGHT.teal} />
              <span style={{ fontSize: 11.5, color: LIGHT.muted, ...monoFont }}>{seen}/{total}</span>
            </>
          ) : <span style={{ fontSize: 11.5, color: LIGHT.muted }}>{doc.keyFiles.length ? "KEY + thẻ từ khóa" : "chỉ có trọng tâm"}</span>}
        </div>
      </div>
      <ChevronRight size={15} color={LIGHT.muted} />
    </button>
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
