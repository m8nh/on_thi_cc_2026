import { Flame, Trophy } from "lucide-react";
import { COLORS, DARK_GRADIENT, displayFont, monoFont } from "../theme.js";
import { xpMaxFor } from "../lib/progress.js";
import { ProgressBar } from "./ui.jsx";

// Cabeçalho das telas escuras (subject/flashcards/quiz/writing/reward): nome, sequência e XP.
export default function DarkHeader({ progress }) {
  const xpMax = xpMaxFor(progress.level);
  const xpPct = Math.min(100, Math.round((progress.xp / xpMax) * 100));
  return (
    <>
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <div style={{ ...displayFont, fontSize: 25.5, fontWeight: 600, letterSpacing: 0.2 }}>Trilha do Aprovado</div>
          <div style={{ color: COLORS.muted, fontSize: 14.5, marginTop: 2 }}>Chào, {progress.name}!</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 999, padding: "6px 12px" }}>
          <Flame size={15} color={COLORS.gold} />
          <span style={{ ...monoFont, fontSize: 15 }}>{progress.streakDays} ngày</span>
        </div>
      </div>

      <div style={{ position: "relative", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: COLORS.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Trophy size={15} color={COLORS.bg} />
            </div>
            <span style={{ ...displayFont, fontWeight: 600, fontSize: 17 }}>Cấp {progress.level}</span>
          </div>
          <span style={{ ...monoFont, fontSize: 14, color: COLORS.muted }}>{progress.xp} / {xpMax} XP</span>
        </div>
        <ProgressBar pct={xpPct} fill={DARK_GRADIENT} track={COLORS.bg} />
      </div>
    </>
  );
}
