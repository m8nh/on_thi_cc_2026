import { useEffect, useRef, useState } from "react";
import { LIGHT, displayFont } from "../../theme.js";
import { labelStyle, lightCardBlock, lightTextarea } from "../../styles.js";
import { useVong2Data } from "../../lib/vong2.js";
import { Collapsible, LoadingOrEmpty, Paragraphs, SourceFooter } from "./shared.jsx";

const DRAFT_SAVE_DELAY_MS = 700;

export default function DichView({ drafts, setProgress }) {
  const trechos = useVong2Data("dich");
  if (!trechos?.length) return <LoadingOrEmpty data={trechos} />;
  const save = (id, text) => setProgress((p) => ({ ...p, translationDrafts: { ...p.translationDrafts, [id]: text } }));
  return (
    <div>
      <div style={{ ...displayFont, fontSize: 20.5, fontWeight: 600, marginBottom: 4 }}>Dịch Việt → Bồ</div>
      <div style={{ color: LIGHT.muted, fontSize: 14, marginBottom: 14 }}>{trechos.length} đoạn trích · bản nháp được lưu tự động</div>
      {trechos.map((t) => <TrechoCard key={t.id} trecho={t} initial={drafts[t.id] || ""} onSave={(text) => save(t.id, text)} />)}
    </div>
  );
}

function TrechoCard({ trecho, initial, onSave }) {
  const [text, setText] = useState(initial);
  const pending = useRef(null); // texto ainda não salvo
  const timer = useRef(null);
  const saveRef = useRef(onSave);
  saveRef.current = onSave;

  const flush = () => {
    clearTimeout(timer.current);
    if (pending.current !== null) saveRef.current(pending.current);
    pending.current = null;
  };
  // Sair da tela antes do atraso não pode perder o que foi digitado.
  useEffect(() => flush, []);

  const change = (value) => {
    setText(value);
    pending.current = value;
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, DRAFT_SAVE_DELAY_MS);
  };

  return (
    <div style={lightCardBlock}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: LIGHT.gold, marginBottom: 2 }}>{trecho.nhan}</div>
      <div style={{ ...displayFont, fontWeight: 600, fontSize: 15.5, marginBottom: 8 }}>{trecho.chuyenDe}</div>
      <Paragraphs items={trecho.tiengViet} />
      <label style={labelStyle}>Bản dịch tiếng Bồ Đào Nha</label>
      <textarea style={{ ...lightTextarea, minHeight: 160 }} value={text} onChange={(e) => change(e.target.value)} placeholder="Escreva a tradução aqui..." />
      <Collapsible title="Tham khảo nghĩa (bản tiếng Anh)">
        <Paragraphs items={trecho.tiengAnh} color={LIGHT.muted} />
      </Collapsible>
      <SourceFooter />
    </div>
  );
}
