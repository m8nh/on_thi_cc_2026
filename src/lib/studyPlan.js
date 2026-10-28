import { STUDY_PLAN, PLAN_STATUS } from "../data/studyPlan.js";

export const stepStatus = (planStatus, step) => (planStatus || {})[step.id] || "todo";
const materialKey = (step, i) => `${step.id}:${i}`;
export const isMaterialDone = (materialsDone, step, i) => !!(materialsDone || {})[materialKey(step, i)];

// Abrir o baralho de um passo (ou de um dos seus materiais) marca esse passo
// como "Đang học" (se ainda estava "Chưa học").
export function markStepStarted(planStatus, subjectId) {
  const ps = planStatus || {};
  const step = STUDY_PLAN.find((st) => st.subjectId === subjectId || st.materials.some((m) => m.subjectId === subjectId));
  if (!step || stepStatus(ps, step) !== "todo") return ps;
  return { ...ps, [step.id]: "doing" };
}

export function cycleStepStatus(p, step) {
  const next = PLAN_STATUS[stepStatus(p.planStatus, step)].next;
  return { ...p, planStatus: { ...p.planStatus, [step.id]: next } };
}

// Marcar um material como feito também tira o passo de "Chưa học".
export function toggleMaterial(p, step, i) {
  const key = materialKey(step, i);
  const materialsDone = { ...p.materialsDone, [key]: !(p.materialsDone || {})[key] };
  const startStep = materialsDone[key] && stepStatus(p.planStatus, step) === "todo";
  const planStatus = startStep ? { ...p.planStatus, [step.id]: "doing" } : p.planStatus;
  return { ...p, materialsDone, planStatus };
}

// Resumo usado no dashboard e na tela de lộ trình.
export function planSummary(p) {
  const status = (st) => stepStatus(p.planStatus, st);
  const doneCount = STUDY_PLAN.filter((st) => status(st) === "done").length;
  const totalMaterials = STUDY_PLAN.reduce((n, st) => n + st.materials.length, 0);
  const materialsDoneCount = STUDY_PLAN.reduce(
    (n, st) => n + st.materials.filter((_, i) => isMaterialDone(p.materialsDone, st, i)).length, 0,
  );
  const pct = Math.round(((doneCount + materialsDoneCount / Math.max(1, totalMaterials)) / (STUDY_PLAN.length + 1)) * 100);
  const currentStep = STUDY_PLAN.find((st) => status(st) === "doing") || STUDY_PLAN.find((st) => status(st) !== "done") || null;
  const currentIndex = currentStep ? STUDY_PLAN.indexOf(currentStep) : -1;
  return { doneCount, totalMaterials, materialsDoneCount, pct, currentStep, currentIndex };
}
