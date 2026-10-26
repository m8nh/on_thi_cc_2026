import { Fragment, useState } from "react";
import { Eye } from "lucide-react";
import { LIGHT } from "../../theme.js";
import { lightCardBlock, lightTextarea, plainBtn } from "../../styles.js";
import { CheckMark, GroupHeading } from "../../components/ui.jsx";
import { PROFILE_QUESTIONS } from "../../data/interviewData.js";
import { profileKey } from "../../lib/interview.js";
import AnswerSections from "./AnswerSections.jsx";

// Câu về hồ sơ & tình huống: sem resposta modelo, o candidato escreve a própria.
export default function ProfileTab({ iv, saveIv }) {
  const [openHint, setOpenHint] = useState(null);
  const togglePrepared = (key) => saveIv({ prepared: { ...iv.prepared, [key]: !iv.prepared[key] } });
  const setNote = (key, text) => saveIv({ notes: { ...iv.notes, [key]: text } });

  return (
    <>
      <div style={{ fontSize: 13.5, color: LIGHT.muted, lineHeight: 1.6, marginBottom: 6 }}>
        Không có đáp án mẫu: tự soạn câu trả lời ngắn, trung thực, có cấu trúc. Với câu tình huống, hướng đúng gần như luôn là báo cáo cấp có thẩm quyền và làm đúng quy trình.
      </div>
      {PROFILE_QUESTIONS.map((g, gi) => (
        <Fragment key={gi}>
          <GroupHeading>{g.group}</GroupHeading>
          <div className="tda-plan-grid">
            {g.items.map((item, i) => {
              const key = profileKey(gi, i);
              return (
                <ProfileCard
                  key={key}
                  item={item}
                  done={!!iv.prepared[key]}
                  hintOpen={openHint === key}
                  note={iv.notes[key] || ""}
                  onTogglePrepared={() => togglePrepared(key)}
                  onToggleHint={() => setOpenHint(openHint === key ? null : key)}
                  onNote={(text) => setNote(key, text)}
                />
              );
            })}
          </div>
        </Fragment>
      ))}
    </>
  );
}

function ProfileCard({ item, done, hintOpen, note, onTogglePrepared, onToggleHint, onNote }) {
  return (
    <div style={{ ...lightCardBlock, opacity: done ? 0.85 : 1 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <button onClick={onTogglePrepared} title="Đánh dấu đã chuẩn bị" style={{ ...plainBtn, display: "flex", marginTop: 2 }}>
          <CheckMark done={done} size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.5 }}>{item.q}</div>
          {item.hint && <div style={{ fontSize: 12.5, color: LIGHT.muted, marginTop: 4, fontStyle: "italic", lineHeight: 1.5 }}>{item.hint}</div>}
        </div>
      </div>
      <button onClick={onToggleHint} style={{ ...plainBtn, display: "flex", alignItems: "center", gap: 5, marginTop: 10, color: LIGHT.purple, fontSize: 13, fontWeight: 600 }}>
        <Eye size={14} /> {hintOpen ? "Ẩn gợi ý" : "Xem gợi ý trả lời, mẹo và lý do"}
      </button>
      {hintOpen && <div style={{ marginTop: 10 }}><AnswerSections q={item} /></div>}
      <textarea value={note} onChange={(e) => onNote(e.target.value)} placeholder="Câu trả lời của bạn..." style={{ ...lightTextarea, marginTop: 10, minHeight: 70 }} />
    </div>
  );
}
