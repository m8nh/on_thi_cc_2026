import { ArrowLeft } from "lucide-react";
import { COLORS, displayFont, monoFont } from "../theme.js";
import { btnStyle } from "../styles.js";

const RETURN_LABELS = { interview: "Về phần phỏng vấn", "ktc-subject": "Về văn bản" };

export default function RewardView({ reward, onContinue }) {
  const TipIcon = reward.tip.icon;
  return (
    <div style={{ textAlign: "center", padding: "8px 4px" }}>
      {reward.leveledUp && <div style={{ ...displayFont, color: COLORS.gold, fontSize: 15, fontWeight: 600, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>✦ Bạn đã lên cấp! ✦</div>}
      <div style={{ ...displayFont, fontSize: 23, fontWeight: 600, marginBottom: 4 }}>Hoàn thành phiên học</div>
      <div style={{ ...monoFont, color: COLORS.teal, fontSize: 18.5, marginBottom: 20 }}>+{reward.xp} XP</div>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.gold}`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.surfaceAlt, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TipIcon size={19} color={COLORS.gold} />
        </div>
        <div style={{ ...displayFont, fontSize: 16, fontWeight: 600, marginBottom: 6, color: COLORS.gold }}>Mở khóa phần thưởng: {reward.tip.title}</div>
        <div style={{ fontSize: 14.5, color: COLORS.muted, lineHeight: 1.6 }}>{reward.tip.body}</div>
      </div>
      <button onClick={onContinue} style={btnStyle(COLORS.gold, true)}>
        <ArrowLeft size={15} /> {RETURN_LABELS[reward.returnTo] ?? "Về lộ trình"}
      </button>
    </div>
  );
}
