import { useState } from "react";
import { LIGHT, bodyFont, displayFont, monoFont } from "../../theme.js";
import { lightCardBlock, pillStyle, plainBtn } from "../../styles.js";
import { GroupHeading } from "../../components/ui.jsx";
import { INTERVIEW_GROUPS } from "../../data/interviewData.js";
import { RATING } from "../../lib/interview.js";

const SIDES = ["Thế giới", "Việt Nam"];

// Bản đồ ghi nhớ: 20 câu em 2 vế × 4 nhóm, com modo de autoteste que esconde os títulos.
export default function MemoryMapTab({ ratings, onOpenQuestion }) {
  const [hideTitles, setHideTitles] = useState(false);
  const [revealed, setRevealed] = useState({});

  const toggleHide = () => {
    setHideTitles(!hideTitles);
    setRevealed({});
  };

  return (
    <>
      <div style={{ ...lightCardBlock, fontSize: 14, lineHeight: 1.65 }}>
        <div style={{ ...displayFont, fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Nhớ 20 câu bằng 2 vế × 4 nhóm</div>
        Vế trái là <strong>Thế giới</strong> (câu 1 đến 10), vế phải là <strong>Việt Nam</strong> (câu 11 đến 20). Mỗi nhóm có một <strong>câu hỏi gợi nhớ</strong>: khi bốc thăm, hỏi mình câu đó là biết ngay đề thuộc khối kiến thức nào, rồi dùng mẹo ghi nhớ của từng câu để mở dàn ý. Đọc theo thứ tự trong nhóm: các câu trong một nhóm dùng chung kiến thức.
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={toggleHide} style={pillStyle(hideTitles)}>{hideTitles ? "Hiện lại tên câu" : "Tự kiểm tra: ẩn tên câu"}</button>
        </div>
      </div>
      <div className="tda-dash-grid">
        {SIDES.map((side) => (
          <div key={side}>
            <GroupHeading style={{ margin: "8px 0 8px" }}>{side}</GroupHeading>
            {INTERVIEW_GROUPS.filter((g) => g.side === side).map((g) => (
              <div key={g.id} style={lightCardBlock}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
                  <span style={{ ...monoFont, fontSize: 18, fontWeight: 700, color: LIGHT.gold }}>{g.id}</span>
                  <span style={{ ...displayFont, fontWeight: 600, fontSize: 16 }}>{g.name}</span>
                  <span style={{ fontSize: 13, color: LIGHT.purple, fontStyle: "italic", marginLeft: "auto" }}>"{g.hook}?"</span>
                </div>
                {g.qs.map(([n, title]) => {
                  const key = `${g.id}-${n}`;
                  return (
                    <MapRow
                      key={n} n={n} title={title} rating={ratings[n]}
                      hidden={hideTitles && !revealed[key]}
                      onReveal={() => setRevealed({ ...revealed, [key]: true })}
                      onOpen={() => onOpenQuestion(n)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function MapRow({ n, title, rating, hidden, onReveal, onOpen }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderTop: `1px solid ${LIGHT.border}` }}>
      <span style={{ ...monoFont, fontSize: 13, fontWeight: 700, minWidth: 28, color: LIGHT.text }}>{n}</span>
      {hidden ? (
        <button onClick={onReveal} style={{ flex: 1, textAlign: "left", background: LIGHT.surfaceAlt, border: `1px dashed ${LIGHT.border}`, borderRadius: 8, padding: "4px 10px", color: LIGHT.muted, fontSize: 13, cursor: "pointer", ...bodyFont }}>Câu {n} hỏi gì? Nhấn để xem</button>
      ) : (
        <button onClick={onOpen} style={{ ...plainBtn, flex: 1, textAlign: "left", color: LIGHT.text, fontSize: 14 }}>{title}</button>
      )}
      {rating && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, color: "#fff", background: RATING[rating].color }}>{RATING[rating].label}</span>}
    </div>
  );
}
