import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, ChevronRight, KeyRound, Layers, RotateCcw, ListTree, FileImage } from "lucide-react";
import { COLORS, displayFont, monoFont } from "../../theme.js";
import { iconBoxStyle, subjectCardStyle, darkPanelStyle } from "../../styles.js";
import { ProgressBar } from "../../components/ui.jsx";
import { ktcQuestionTotal, priorityStars } from "../../data/ktc/vanBan.js";
import { ROUND_SIZE, cardsOf, countWrong, docStats, loadBank, sectionsOf } from "../../lib/ktcBank.js";

// Tela de um văn bản: trọng tâm, estatística e os modos de estudo.
export default function KtcSubjectView({ doc, progress, onStart }) {
  const [items, setItems] = useState(null);
  const [showFocus, setShowFocus] = useState(false);
  const [showSections, setShowSections] = useState(false);

  useEffect(() => {
    let alive = true;
    loadBank(doc.id).then((bank) => alive && setItems(bank));
    return () => { alive = false; };
  }, [doc.id]);

  const { qStats } = progress;
  const total = ktcQuestionTotal(doc);
  const { seen, right } = docStats(doc.id, qStats);
  const wrong = items ? countWrong(items, qStats) : 0;
  const cards = items ? cardsOf(items) : [];
  const sections = items ? sectionsOf(items) : [];
  const pct = total ? Math.round((seen / total) * 100) : 0;
  const keyPageCount = doc.keyFiles.reduce((n, f) => n + f.pages.length, 0);

  return (
    <div>
      <div style={{ color: COLORS.gold, fontSize: 13, ...monoFont, marginBottom: 4 }}>Văn bản {doc.no} · {priorityStars(doc.priority)}</div>
      <div style={{ ...displayFont, fontSize: 21, fontWeight: 600, marginBottom: 4 }}>{doc.name}</div>
      <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 16 }}>{doc.ref}</div>

      {total > 0 && (
        <div style={darkPanelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: COLORS.muted, marginBottom: 8 }}>
            <span>Đã làm {seen}/{total} câu · đúng lần gần nhất {right}</span>
            <span style={{ ...monoFont, color: COLORS.gold }}>{pct}%</span>
          </div>
          <ProgressBar pct={pct} height={6} fill={COLORS.teal} track={COLORS.border} />
        </div>
      )}

      <button onClick={() => setShowFocus((v) => !v)} style={{ ...subjectCardStyle, padding: "11px 16px" }}>
        <div style={{ flex: 1, ...displayFont, fontWeight: 600, fontSize: 15.5 }}>Nội dung trọng tâm</div>
        {showFocus ? <ChevronDown size={16} color={COLORS.muted} /> : <ChevronRight size={16} color={COLORS.muted} />}
      </button>
      {showFocus && (
        <ul style={{ ...darkPanelStyle, margin: "-4px 0 14px", paddingLeft: 32, color: COLORS.muted, fontSize: 14.5, lineHeight: 1.6 }}>
          {doc.focus.map((f) => <li key={f} style={{ marginBottom: 6 }}>{f}</li>)}
        </ul>
      )}

      {doc.keyFiles.length > 0 && (
        <ModeCard icon={FileImage} title="Tóm tắt KEY" sub={`${keyPageCount} trang · ${doc.keyFiles.length} tài liệu`} onClick={() => onStart({ kind: "key" })} />
      )}
      {doc.keyCards > 0 && (
        <ModeCard icon={KeyRound} title="Thẻ từ khóa KEY" sub={`${doc.keyCards} thẻ số liệu, thời hạn, tỷ lệ · mỗi lượt ${ROUND_SIZE} thẻ`} onClick={() => onStart({ kind: "keycards" })} />
      )}

      {total === 0 ? (
        <div style={{ ...darkPanelStyle, color: COLORS.muted, fontSize: 14.5, lineHeight: 1.6 }}>
          Bộ tài liệu không có ngân hàng câu hỏi cho văn bản này. Học bằng bản KEY và thẻ từ khóa ở trên; câu hỏi về văn bản này vẫn có thể xuất hiện trong đề thi.
        </div>
      ) : !items ? (
        <div style={{ color: COLORS.muted, fontSize: 14 }}>Đang tải câu hỏi…</div>
      ) : (
        <>
          <ModeCard icon={BookOpen} title={`Luyện ${ROUND_SIZE} câu`} sub="Ưu tiên câu làm sai lần trước, rồi câu chưa làm" onClick={() => onStart({ kind: "quiz", items })} />
          <ModeCard icon={RotateCcw} title="Ôn lại câu sai" sub={wrong ? `${wrong} câu đang sai` : "Chưa có câu sai"} disabled={!wrong} onClick={() => onStart({ kind: "quiz", items, onlyWrong: true })} />
          <ModeCard icon={Layers} title="Flash card" sub={`${cards.length} thẻ · mỗi lượt ${ROUND_SIZE} thẻ`} disabled={!cards.length} onClick={() => onStart({ kind: "cards", items })} />
          <ModeCard icon={ListTree} title="Luyện theo chương, mục" sub={`${sections.length} phần`} onClick={() => setShowSections((v) => !v)} open={showSections} />
          {showSections && (
            <div style={{ margin: "-4px 0 14px 14px" }}>
              {sections.map((s) => (
                <button key={s.name} onClick={() => onStart({ kind: "quiz", items, section: s.name })} style={{ ...subjectCardStyle, padding: "10px 14px", fontSize: 14 }}>
                  <span style={{ flex: 1 }}>{s.name}</span>
                  <span style={{ ...monoFont, color: COLORS.muted, fontSize: 13 }}>{s.count}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ModeCard({ icon: Icon, title, sub, onClick, disabled, open }) {
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...subjectCardStyle, opacity: disabled ? 0.45 : 1, cursor: disabled ? "default" : "pointer" }}>
      <div style={iconBoxStyle}><Icon size={17} color={COLORS.teal} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ ...displayFont, fontWeight: 600, fontSize: 16.5 }}>{title}</div>
        <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>{sub}</div>
      </div>
      {open ? <ChevronDown size={16} color={COLORS.muted} /> : <ChevronRight size={16} color={COLORS.muted} />}
    </button>
  );
}
