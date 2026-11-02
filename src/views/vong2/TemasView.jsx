import { useState } from "react";
import { ChevronDown, PenLine } from "lucide-react";
import { LIGHT, displayFont } from "../../theme.js";
import { lightBtnStyle, lightCardBlock, pillStyle, plainBtn } from "../../styles.js";
import { GroupHeading } from "../../components/ui.jsx";
import { TIPO_LABEL, notesForDe } from "../../data/vong2.js";
import { useVong2Data } from "../../lib/vong2.js";
import { DapAnPanel, LoadingOrEmpty, NotesBlock, Paragraphs, SourceFooter } from "./shared.jsx";

// Đề 9 só tem questões em inglês, então não entra no banco; a nota dele fica no fim da página.
export default function TemasView({ topicDrafts, onWrite }) {
  const temas = useVong2Data("temas");
  const [tipo, setTipo] = useState("all");
  const [openId, setOpenId] = useState(null);
  if (!temas?.length) return <LoadingOrEmpty data={temas} />;

  const shown = temas.filter((t) => tipo === "all" || t.tipo === tipo);
  const des = [...new Set(shown.map((t) => t.de))];
  return (
    <div>
      <div style={{ ...displayFont, fontSize: 20.5, fontWeight: 600, marginBottom: 4 }}>Đề luận & Tình huống</div>
      <div style={{ color: LIGHT.muted, fontSize: 14, marginBottom: 12 }}>{temas.length} đề bài tiếng Việt · mỗi đề mở bài viết 180 phút</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
        <button onClick={() => setTipo("all")} style={pillStyle(tipo === "all")}>Tất cả</button>
        {Object.entries(TIPO_LABEL).map(([key, label]) => (
          <button key={key} onClick={() => setTipo(key)} style={pillStyle(tipo === key)}>{label}</button>
        ))}
      </div>
      {des.map((de) => (
        <div key={de}>
          <GroupHeading>Đề {de} · {shown.find((t) => t.de === de).chuyenDe}</GroupHeading>
          {shown.filter((t) => t.de === de).map((t) => (
            <TemaCard key={t.id} tema={t} open={openId === t.id} hasDraft={!!topicDrafts[t.id]}
              onToggle={() => setOpenId(openId === t.id ? null : t.id)} onWrite={() => onWrite(t)} />
          ))}
        </div>
      ))}
      {tipo === "all" && (
        <div style={lightCardBlock}>
          <div style={{ ...displayFont, fontWeight: 600, fontSize: 15 }}>Đề 9</div>
          <div style={{ fontSize: 13.5, color: LIGHT.muted, marginTop: 3 }}>Đề 9 chỉ có câu hỏi tiếng Anh nên không có trong ngân hàng này.</div>
          <NotesBlock notes={notesForDe(9)} />
          <SourceFooter />
        </div>
      )}
    </div>
  );
}

function TemaCard({ tema, open, hasDraft, onToggle, onWrite }) {
  const preview = tema.enunciado[tema.enunciado.length - 1];
  return (
    <div style={{ ...lightCardBlock, marginBottom: 9 }}>
      <button onClick={onToggle} aria-expanded={open} style={{ ...plainBtn, width: "100%", display: "flex", alignItems: "flex-start", gap: 10, textAlign: "left", color: LIGHT.text }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: LIGHT.gold }}>Question {tema.q} · {TIPO_LABEL[tema.tipo]}{hasDraft ? " · đang làm dở" : ""}</div>
          {!open && <div style={{ fontSize: 14, lineHeight: 1.5, marginTop: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{preview}</div>}
        </div>
        <ChevronDown size={15} color={LIGHT.muted} style={{ flexShrink: 0, marginTop: 2, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      {open && (
        <div style={{ marginTop: 10 }}>
          <Paragraphs items={tema.enunciado} />
          <button onClick={onWrite} style={{ ...lightBtnStyle(LIGHT.gold), marginTop: 4 }}>
            <PenLine size={15} /> {hasDraft ? "Tiếp tục bài viết" : "Viết bài (180 phút)"}
          </button>
          <DapAnPanel dapAn={tema.dapAn} notes={notesForDe(tema.de)} />
          <SourceFooter />
        </div>
      )}
    </div>
  );
}
