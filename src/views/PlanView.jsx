import { Fragment } from "react";
import { BookOpen, CheckCircle2, ChevronRight, ExternalLink } from "lucide-react";
import { LIGHT, LIGHT_GRADIENT, bodyFont, displayFont, monoFont } from "../theme.js";
import { lightBtnStyle, lightCardBlock, lightPagePadding, plainBtn } from "../styles.js";
import { BackButton, CheckMark, GroupHeading, PageHeader, ProgressBar } from "../components/ui.jsx";
import { MATERIAL_ICON, MATERIAL_TAG, PLAN_STATUS, STUDY_PLAN } from "../data/studyPlan.js";
import { cycleStepStatus, isMaterialDone, planSummary, stepStatus, toggleMaterial } from "../lib/studyPlan.js";

const STATUS_COLOR = { done: LIGHT.teal, doing: LIGHT.gold, todo: LIGHT.muted };

export default function PlanView({ progress, setProgress, onOpenStep, onBack }) {
  const summary = planSummary(progress);
  const { currentStep } = summary;

  return (
    <div style={lightPagePadding}>
      <BackButton light onClick={onBack}>Trang chủ</BackButton>
      <PageHeader title="Tiến độ học tập" subtitle={`Lộ trình ${STUDY_PLAN.length} bước, từ nền tảng đến đề thi tổng hợp`} />

      <div style={lightCardBlock}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 14, color: LIGHT.muted }}>Hoàn thành</span>
          <span style={{ ...monoFont, fontSize: 15, fontWeight: 700, color: LIGHT.gold }}>{summary.pct}%</span>
        </div>
        <ProgressBar pct={summary.pct} fill={LIGHT_GRADIENT} style={{ marginBottom: 8 }} />
        <div style={{ fontSize: 12.5, color: LIGHT.muted }}>{summary.doneCount}/{STUDY_PLAN.length} bước đã xong · {summary.materialsDoneCount}/{summary.totalMaterials} tài liệu đã học</div>
        {currentStep && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${LIGHT.border}`, fontSize: 14.5 }}>
            <span style={{ color: LIGHT.muted }}>Bạn đang ở: </span>
            <span style={{ ...displayFont, fontWeight: 600 }}>Bước {summary.currentIndex + 1} · {currentStep.title}</span>
          </div>
        )}
      </div>

      <div className="tda-plan-grid">
        {STUDY_PLAN.map((step, idx) => (
          <Fragment key={step.id}>
            {(idx === 0 || STUDY_PLAN[idx - 1].phase !== step.phase) && (
              <GroupHeading style={{ fontSize: 14.5, margin: "18px 0 8px", gridColumn: "1 / -1" }}>{step.phase}</GroupHeading>
            )}
            <StepCard
              step={step}
              number={idx + 1}
              status={stepStatus(progress.planStatus, step)}
              isCurrent={currentStep?.id === step.id}
              materialsDone={progress.materialsDone}
              onCycleStatus={() => setProgress((p) => cycleStepStatus(p, step))}
              onToggleMaterial={(i) => setProgress((p) => toggleMaterial(p, step, i))}
              onOpenStep={onOpenStep}
            />
          </Fragment>
        ))}
      </div>
      <div style={{ fontSize: 11.5, color: LIGHT.muted, marginTop: 6, lineHeight: 1.5 }}>
        Nhấn vào nhãn trạng thái để chuyển Chưa học → Đang học → Đã xong. Mở một bộ thẻ sẽ tự chuyển bước đó sang Đang học.
      </div>
    </div>
  );
}

function StepCard({ step, number, status, isCurrent, materialsDone, onCycleStatus, onToggleMaterial, onOpenStep }) {
  const color = STATUS_COLOR[status];
  return (
    <div style={{ ...lightCardBlock, border: `1px solid ${isCurrent ? LIGHT.gold : LIGHT.border}`, opacity: status === "done" ? 0.85 : 1 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: status === "todo" ? LIGHT.surfaceAlt : color, color: status === "todo" ? LIGHT.muted : "#fff", border: status === "todo" ? `1px solid ${LIGHT.border}` : "none", ...monoFont, fontSize: 14, fontWeight: 700 }}>
          {status === "done" ? <CheckCircle2 size={15} color="#fff" /> : number}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...displayFont, fontWeight: 600, fontSize: 16 }}>{step.title}</div>
          <div style={{ fontSize: 12.5, color: LIGHT.muted, marginTop: 3, lineHeight: 1.5 }}>{step.goal}</div>
        </div>
        <button onClick={onCycleStatus} title="Đổi trạng thái" style={{ flexShrink: 0, border: `1px solid ${color}`, color, background: "transparent", borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", ...bodyFont }}>
          {PLAN_STATUS[status].label}
        </button>
      </div>

      <div style={{ marginTop: 12, borderTop: `1px solid ${LIGHT.border}`, paddingTop: 8 }}>
        {step.materials.map((m, i) => (
          <MaterialRow key={i} material={m} done={isMaterialDone(materialsDone, step, i)} onToggle={() => onToggleMaterial(i)} onOpenStep={onOpenStep} />
        ))}
      </div>

      {step.subjectId && (
        <button onClick={() => onOpenStep(step.subjectId)} style={{ ...lightBtnStyle(isCurrent ? LIGHT.gold : LIGHT.teal), marginTop: 10 }}>
          Học ngay <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function MaterialRow({ material: m, done, onToggle, onOpenStep }) {
  const Icon = MATERIAL_ICON[m.type] || BookOpen;
  const textStyle = { flex: 1, fontSize: 14, color: LIGHT.text, textDecoration: done ? "line-through" : "none" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
      <button onClick={onToggle} title="Đánh dấu đã học" style={{ ...plainBtn, display: "flex" }}>
        <CheckMark done={done} />
      </button>
      <Icon size={14} color={done ? LIGHT.muted : LIGHT.purple} style={{ flexShrink: 0 }} />
      {m.url ? (
        <a href={m.url} target="_blank" rel="noreferrer" style={{ ...textStyle, display: "flex", alignItems: "center", gap: 4 }}>
          {m.label} <ExternalLink size={11} color={LIGHT.muted} />
        </a>
      ) : m.subjectId ? (
        <button onClick={() => onOpenStep(m.subjectId)} style={{ ...plainBtn, ...textStyle, textAlign: "left", textDecoration: done ? "line-through" : "underline" }}>
          {m.label}
        </button>
      ) : (
        <span style={textStyle}>{m.label}</span>
      )}
      <span style={{ fontSize: 11, color: LIGHT.muted, ...monoFont, flexShrink: 0 }}>{MATERIAL_TAG[m.type]}</span>
    </div>
  );
}
