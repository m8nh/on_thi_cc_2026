import { LIGHT, LIGHT_GRADIENT, displayFont, monoFont } from "../../theme.js";
import { lightCardBlock, plainBtn } from "../../styles.js";
import { CheckMark, ProgressBar } from "../../components/ui.jsx";
import { DE_CUONG_NOTES } from "../../data/vong2.js";
import { useVong2Data } from "../../lib/vong2.js";
import { LoadingOrEmpty, NotesBlock, SourceFooter } from "./shared.jsx";

// done: { [itemId]: true }, salvo no progresso (localStorage).
export default function DeCuongView({ done, setProgress }) {
  const groups = useVong2Data("decuong");
  if (!groups?.length) return <LoadingOrEmpty data={groups} />;

  const items = groups.flatMap((g) => g.items);
  const doneCount = items.filter((it) => done[it.id]).length;
  const toggle = (id) => setProgress((p) => ({ ...p, deCuongDone: { ...p.deCuongDone, [id]: !p.deCuongDone[id] } }));

  return (
    <div>
      <div style={{ ...displayFont, fontSize: 20.5, fontWeight: 600, marginBottom: 4 }}>Đề cương ôn tập chi tiết</div>
      <div style={{ ...lightCardBlock, marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: LIGHT.muted, marginBottom: 6 }}>
          <span>Đã ôn</span>
          <span style={{ ...monoFont, fontWeight: 700, color: LIGHT.gold }}>{doneCount}/{items.length}</span>
        </div>
        <ProgressBar pct={(doneCount / items.length) * 100} fill={LIGHT_GRADIENT} />
        <NotesBlock notes={DE_CUONG_NOTES} />
      </div>
      {groups.map((g) => (
        <div key={g.ten} style={lightCardBlock}>
          <div style={{ ...displayFont, fontWeight: 600, fontSize: 15.5, marginBottom: 8 }}>{g.ten}</div>
          {g.items.map((it) => (
            <button key={it.id} onClick={() => toggle(it.id)} aria-pressed={!!done[it.id]} style={{ ...plainBtn, width: "100%", display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", textAlign: "left", color: done[it.id] ? LIGHT.muted : LIGHT.text, fontSize: 14, lineHeight: 1.55 }}>
              <span style={{ marginTop: 2, flexShrink: 0 }}><CheckMark done={!!done[it.id]} /></span>
              <span>{it.text}</span>
            </button>
          ))}
          <SourceFooter />
        </div>
      ))}
    </div>
  );
}
