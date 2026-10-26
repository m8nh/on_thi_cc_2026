import { Clock, Flame, ListChecks, Target, Trophy } from "lucide-react";
import { LIGHT, LIGHT_GRADIENT, displayFont, monoFont } from "../../theme.js";
import { lightBtnStyle, lightCardBlock } from "../../styles.js";
import { CheckMark, ProgressBar, RingStat } from "../../components/ui.jsx";
import { STAGE1_SUBJECTS } from "../../data/subjects.js";
import { DAILY_MISSIONS } from "../../data/missions.js";
import { STUDY_PLAN } from "../../data/studyPlan.js";
import { fullCountdown, last7Days } from "../../lib/dates.js";
import { allMissionsDone, missionBonus, missionValue, rolloverMissions, xpMaxFor } from "../../lib/progress.js";
import { planSummary } from "../../lib/studyPlan.js";
import { useTicker } from "../../hooks/useTicker.js";

const cardButton = { ...lightCardBlock, width: "100%", textAlign: "left", cursor: "pointer" };

export default function OverviewColumn({ progress, actions }) {
  const { missionProgress, missionStreak } = rolloverMissions(progress);
  return (
    <div>
      <PlanCard progress={progress} onClick={() => actions.navigate("plan")} />
      <CountdownCard progress={progress} missionProgress={missionProgress} onClick={actions.openSettings} />
      <ActivityCard dailyXp={progress.dailyXp} />
      <MissionsCard missionProgress={missionProgress} missionStreak={missionStreak} onClaim={actions.claimMissions} />
      <StatsCards progress={progress} />
      <LevelCard progress={progress} />
    </div>
  );
}

// Lộ trình: đang ở đâu
function PlanCard({ progress, onClick }) {
  const { pct, currentStep, currentIndex, doneCount, materialsDoneCount, totalMaterials } = planSummary(progress);
  return (
    <button onClick={onClick} style={{ ...cardButton, border: `1px solid ${LIGHT.gold}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ListChecks size={15} color={LIGHT.gold} />
          <span style={{ fontSize: 14, color: LIGHT.muted }}>Tiến độ học tập</span>
        </div>
        <span style={{ ...monoFont, fontSize: 14, color: LIGHT.gold }}>{pct}%</span>
      </div>
      <div style={{ ...displayFont, fontWeight: 600, fontSize: 16.5, color: LIGHT.text }}>
        {currentStep ? `Bạn đang ở: Bước ${currentIndex + 1} · ${currentStep.title}` : "Đã hoàn thành toàn bộ lộ trình"}
      </div>
      <ProgressBar pct={pct} height={6} fill={LIGHT_GRADIENT} style={{ margin: "10px 0 6px" }} />
      <div style={{ fontSize: 12, color: LIGHT.muted }}>{doneCount}/{STUDY_PLAN.length} bước · {materialsDoneCount}/{totalMaterials} tài liệu · nhấn để xem lộ trình</div>
    </button>
  );
}

// Hôm nay: contagem regressiva até a prova (atualiza a cada segundo).
function CountdownCard({ progress, missionProgress, onClick }) {
  useTicker();
  const countdown = fullCountdown(progress.examDate, progress.examTime);
  const missionsDone = DAILY_MISSIONS.filter((m) => missionValue(missionProgress, m) >= m.target).length;
  return (
    <button onClick={onClick} style={cardButton}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: countdown ? 10 : 0 }}>
        <Clock size={15} color={LIGHT.gold} />
        <span style={{ fontSize: 14, color: LIGHT.muted }}>Hôm nay</span>
      </div>
      {countdown === null ? (
        <div style={{ fontSize: 15, color: LIGHT.muted }}>Chưa đặt ngày thi — nhấn để đặt</div>
      ) : countdown.passed ? (
        <div style={{ fontSize: 16, color: LIGHT.gold, fontWeight: 600 }}>Đã đến ngày thi! Chúc may mắn 🍀</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 12 }}>
          {[["Ngày", countdown.days], ["Giờ", countdown.hours], ["Phút", countdown.minutes], ["Giây", countdown.seconds]].map(([label, val]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ ...monoFont, fontSize: 22, fontWeight: 700, color: LIGHT.text }}>{String(val).padStart(2, "0")}</div>
              <div style={{ fontSize: 11, color: LIGHT.muted }}>{label}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 16, borderTop: `1px solid ${LIGHT.border}`, paddingTop: 10, marginTop: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: LIGHT.muted }}><Flame size={13} color={LIGHT.gold} /> {progress.streakDays} ngày liên tiếp</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: LIGHT.muted }}><Target size={13} color={LIGHT.teal} /> {missionsDone}/{DAILY_MISSIONS.length} nhiệm vụ</div>
      </div>
    </button>
  );
}

// Biểu đồ hoạt động
function ActivityCard({ dailyXp }) {
  const week = last7Days().map((d) => ({ ...d, xp: dailyXp[d.key] || 0 }));
  const max = Math.max(1, ...week.map((d) => d.xp));
  return (
    <div style={lightCardBlock}>
      <div style={{ fontSize: 14, color: LIGHT.muted, marginBottom: 12 }}>Hoạt động 7 ngày qua</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 70, gap: 6 }}>
        {week.map((d) => (
          <div key={d.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
            <div style={{ width: "100%", maxWidth: 20, height: Math.max(4, (d.xp / max) * 54), borderRadius: 4, background: d.isToday ? LIGHT.gold : LIGHT.purple, opacity: d.isToday ? 1 : 0.55 }} />
            <span style={{ fontSize: 10.5, color: LIGHT.muted, ...monoFont }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Nhiệm vụ hôm nay
function MissionsCard({ missionProgress, missionStreak, onClaim }) {
  const allDone = allMissionsDone(missionProgress);
  return (
    <div style={lightCardBlock}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Target size={14} color={LIGHT.teal} />
          <span style={{ ...displayFont, fontWeight: 600, fontSize: 15 }}>Nhiệm vụ hôm nay</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, ...monoFont, fontSize: 13, color: LIGHT.gold }}>
          <Flame size={12} color={LIGHT.gold} /> {missionStreak}
        </div>
      </div>
      {DAILY_MISSIONS.map((m) => {
        const val = missionValue(missionProgress, m);
        const done = val >= m.target;
        return (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 14, color: done ? LIGHT.text : LIGHT.muted }}>
            <CheckMark done={done} size={14} />
            <span style={{ flex: 1 }}>{m.label}</span>
            <span style={{ ...monoFont, fontSize: 12 }}>{Math.min(val, m.target)}/{m.target}</span>
          </div>
        );
      })}
      {allDone && !missionProgress.claimed && (
        <button onClick={onClaim} style={{ ...lightBtnStyle(LIGHT.gold), marginTop: 6 }}>
          Nhận thưởng (+{missionBonus(missionStreak)} XP)
        </button>
      )}
      {allDone && missionProgress.claimed && (
        <div style={{ textAlign: "center", fontSize: 12.5, color: LIGHT.teal, marginTop: 6 }}>Đã nhận thưởng hôm nay ✓</div>
      )}
      <div style={{ fontSize: 11.5, color: LIGHT.muted, marginTop: 10, lineHeight: 1.5 }}>
        Bỏ lỡ nhiệm vụ chỉ làm mất chuỗi thưởng 🔥 — không mất XP hay cấp độ đã có.
      </div>
    </div>
  );
}

// Thống kê
function StatsCards({ progress }) {
  const touchedStage1 = progress.subjectsEverTouched.filter((id) => STAGE1_SUBJECTS.some((s) => s.id === id)).length;
  const vong1Pct = Math.round((touchedStage1 / STAGE1_SUBJECTS.length) * 100);
  const { correct, total } = progress.quizStats;
  const accuracyPct = total > 0 ? Math.round((correct / total) * 100) : null;
  const statCard = { ...lightCardBlock, marginBottom: 0, textAlign: "center" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
      <div style={statCard}>
        <RingStat pct={vong1Pct} color={LIGHT.teal} label="Tiến độ Vòng 1" sub={`${touchedStage1}/${STAGE1_SUBJECTS.length} chuyên đề`} />
      </div>
      <div style={statCard}>
        <RingStat pct={accuracyPct ?? 0} color={LIGHT.purple} label="Độ chính xác" sub={accuracyPct === null ? "Chưa có dữ liệu" : `${correct}/${total} câu`} showDash={accuracyPct === null} />
      </div>
    </div>
  );
}

function LevelCard({ progress }) {
  const xpMax = xpMaxFor(progress.level);
  const xpPct = Math.min(100, Math.round((progress.xp / xpMax) * 100));
  return (
    <div style={{ ...lightCardBlock, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: LIGHT.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Trophy size={16} color="#fff" />
        </div>
        <div>
          <div style={{ ...displayFont, fontWeight: 600, fontSize: 16 }}>Cấp {progress.level}</div>
          <div style={{ fontSize: 12, color: LIGHT.muted }}>{progress.xp} / {xpMax} XP · {progress.totalCardsReviewed} thẻ đã ôn</div>
        </div>
      </div>
      <ProgressBar pct={xpPct} height={6} style={{ width: 60 }} />
    </div>
  );
}
