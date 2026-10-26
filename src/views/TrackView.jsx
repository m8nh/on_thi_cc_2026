import { Award, ChevronRight, Landmark, LogOut } from "lucide-react";
import { LIGHT, displayFont } from "../theme.js";
import { lightCardBlock, plainBtn } from "../styles.js";

const TRACKS = [
  { id: "bng", icon: Award, title: "Ôn thi BNG", sub: "Bộ Ngoại giao · Vòng 1, Vòng 2, phỏng vấn" },
  { id: "hq", icon: Landmark, title: "Ôn thi HQ", sub: "Hải quan · đang chờ cập nhật nội dung" },
];

// Escolha da prova logo após o login.
export default function TrackView({ progress, onPick, onLogout }) {
  return (
    <div style={{ padding: "48px 16px 40px", maxWidth: 880, margin: "0 auto" }}>
      <div style={{ ...displayFont, fontSize: 28, fontWeight: 600, marginBottom: 4, textAlign: "center" }}>Chào, {progress.name}!</div>
      <div style={{ color: LIGHT.muted, fontSize: 15, marginBottom: 28, textAlign: "center" }}>Hôm nay bạn ôn kỳ thi nào?</div>
      <div className="tda-dash-grid">
        {TRACKS.map((t) => (
          <TrackCard key={t.id} track={t} last={progress.track === t.id} onClick={() => onPick(t.id)} />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 18 }}>
        <button onClick={onLogout} style={{ ...plainBtn, color: LIGHT.muted, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <LogOut size={15} /> Đăng xuất
        </button>
      </div>
    </div>
  );
}

function TrackCard({ track, last, onClick }) {
  const Icon = track.icon;
  return (
    <button onClick={onClick} style={{ ...lightCardBlock, width: "100%", cursor: "pointer", textAlign: "left", padding: "28px 26px", display: "flex", alignItems: "center", gap: 18, border: `1.5px solid ${last ? LIGHT.gold : LIGHT.border}` }}>
      <div style={{ width: 58, height: 58, borderRadius: 16, background: last ? LIGHT.goldSoft : LIGHT.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={28} color={last ? LIGHT.gold : LIGHT.teal} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...displayFont, fontWeight: 600, fontSize: 22, color: LIGHT.text }}>{track.title}</div>
        <div style={{ fontSize: 14, color: LIGHT.muted, marginTop: 4 }}>{track.sub}</div>
        {last && <div style={{ fontSize: 12, color: LIGHT.gold, marginTop: 6, fontWeight: 600 }}>Lần trước bạn ôn ở đây</div>}
      </div>
      <ChevronRight size={22} color={LIGHT.muted} />
    </button>
  );
}
