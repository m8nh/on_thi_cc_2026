import { useRef, useState } from "react";
import { Lock, Trophy } from "lucide-react";
import { LIGHT, LIGHT_GRADIENT, displayFont, monoFont } from "../../theme.js";
import { lightCardBlock } from "../../styles.js";
import { ProgressBar } from "../../components/ui.jsx";
import { ACHIEVEMENTS } from "../../data/achievements.js";

const TIP_WIDTH = 240;

// Bảng thành tích: passar o mouse (ou tocar, no celular) mostra o que é e como conseguir.
export default function AchievementsBoard({ progress }) {
  const boxRef = useRef(null);
  const [tip, setTip] = useState(null); // { id, left, top }
  const items = ACHIEVEMENTS.map((a) => {
    const value = a.value(progress) || 0;
    return { ...a, value, unlocked: value >= a.target };
  });
  const unlockedCount = items.filter((a) => a.unlocked).length;
  const active = tip && items.find((a) => a.id === tip.id);

  const show = (id, el) => {
    const box = boxRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const center = r.left - box.left + r.width / 2;
    const left = Math.min(Math.max(center - TIP_WIDTH / 2, 0), Math.max(0, box.width - TIP_WIDTH));
    setTip({ id, left, top: r.bottom - box.top + 8 });
  };

  return (
    <div ref={boxRef} style={{ ...lightCardBlock, position: "relative" }} onMouseLeave={() => setTip(null)}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Trophy size={14} color={LIGHT.gold} />
          <span style={{ ...displayFont, fontWeight: 600, fontSize: 15 }}>Bảng thành tích</span>
        </div>
        <span style={{ ...monoFont, fontSize: 12.5, color: LIGHT.muted }}>{unlockedCount}/{items.length}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(42px, 1fr))", gap: 8 }}>
        {items.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              aria-label={a.title}
              onMouseEnter={(e) => show(a.id, e.currentTarget)}
              onFocus={(e) => show(a.id, e.currentTarget)}
              onBlur={() => setTip(null)}
              onClick={(e) => (tip?.id === a.id ? setTip(null) : show(a.id, e.currentTarget))}
              style={{
                aspectRatio: "1", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0,
                background: a.unlocked ? LIGHT.goldSoft : LIGHT.surfaceAlt,
                border: `1px solid ${tip?.id === a.id ? LIGHT.teal : a.unlocked ? LIGHT.gold : LIGHT.border}`,
                opacity: a.unlocked ? 1 : 0.55,
              }}
            >
              <Icon size={16} color={a.unlocked ? LIGHT.gold : LIGHT.muted} />
            </button>
          );
        })}
      </div>

      {active && (
        <div role="tooltip" style={{
          position: "absolute", left: tip.left, top: tip.top, width: TIP_WIDTH, zIndex: 20, boxSizing: "border-box",
          background: LIGHT.text, color: "#fff", borderRadius: 10, padding: "10px 12px", boxShadow: "0 6px 20px rgba(20,23,50,0.18)", pointerEvents: "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, ...displayFont, fontWeight: 600, fontSize: 14 }}>
            {!active.unlocked && <Lock size={12} color="#C9CCDA" />} {active.title}
          </div>
          <div style={{ fontSize: 12.5, color: "#C9CCDA", margin: "4px 0 8px", lineHeight: 1.45 }}>
            {active.unlocked ? "Đã đạt: " : "Cách đạt: "}{active.how}
          </div>
          <ProgressBar pct={Math.min(100, (active.value / active.target) * 100)} height={4} fill={active.unlocked ? LIGHT.gold : LIGHT_GRADIENT} />
          <div style={{ ...monoFont, fontSize: 11.5, color: "#C9CCDA", marginTop: 5 }}>
            {Math.min(active.value, active.target)}/{active.target}{active.unlocked ? " ✓" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
