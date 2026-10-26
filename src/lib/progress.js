import { TIPS } from "../data/tips.js";
import { DAILY_MISSIONS } from "../data/missions.js";
import { todayKey, yesterdayKey } from "./dates.js";
import { markStepStarted } from "./studyPlan.js";

const STORAGE_KEY = "trilha-do-aprovado-progress";

export const DEFAULT_PROGRESS = {
  name: null, examDate: null, examTime: "08:00",
  level: 1, xp: 0, streakDays: 1, lastActiveDate: null,
  tipsSeen: [], totalSessions: 0, sessionDates: [],
  writingDraft: null,
  missionProgress: null, missionStreak: 0,
  dailyXp: {}, subjectsEverTouched: [], totalCardsReviewed: 0,
  quizStats: { correct: 0, total: 0 },
  planStatus: {}, materialsDone: {},
  interview: { ratings: {}, notes: {}, prepared: {} },
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch (e) {
    console.error("Lỗi khi đọc tiến trình đã lưu:", e);
  }
  return DEFAULT_PROGRESS;
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Lỗi khi lưu tiến trình:", e);
  }
}

export const xpMaxFor = (level) => 100 + (level - 1) * 40;

const addUnique = (arr, item) => (arr.includes(item) ? arr : [...arr, item]);

/* ---------- Missões diárias ---------- */

export function missionValue(mp, mission) {
  if (!mp) return 0;
  return mission.key === "subjectsTouched" ? mp.subjectsTouched.length : mp[mission.key];
}

export const allMissionsDone = (mp) => DAILY_MISSIONS.every((m) => missionValue(mp, m) >= m.target);

export const missionBonus = (streak) => 20 + Math.min(streak, 5) * 4;

function freshMissionDay(dateKey) {
  return { date: dateKey, flashcardDecks: 0, quizzes: 0, subjectsTouched: [], claimed: false };
}

// Se o dia mudou, "vira a página" das missões. Se o dia anterior não foi
// concluído (e reivindicado), zera só a sequência de bônus — nunca XP/nível.
export function rolloverMissions(p, dateKey = todayKey()) {
  if (p.missionProgress && p.missionProgress.date === dateKey) {
    return { missionProgress: p.missionProgress, missionStreak: p.missionStreak || 0 };
  }
  const hadPrevious = !!p.missionProgress;
  const wasClaimed = hadPrevious && p.missionProgress.claimed;
  const missionStreak = hadPrevious && !wasClaimed ? 0 : (p.missionStreak || 0);
  return { missionProgress: freshMissionDay(dateKey), missionStreak };
}

/* ---------- Sessões e XP ---------- */

function recordSession(p, t) {
  return {
    ...p,
    sessionDates: addUnique(p.sessionDates, t),
    streakDays: p.lastActiveDate === t ? p.streakDays : (p.lastActiveDate === yesterdayKey() ? p.streakDays + 1 : 1),
    lastActiveDate: t,
  };
}

function pickTip(tipsSeen) {
  const unseen = TIPS.map((_, i) => i).filter((i) => !tipsSeen.includes(i));
  const pool = unseen.length ? unseen : TIPS.map((_, i) => i);
  return pool[Math.floor(Math.random() * pool.length)];
}

// Fecha uma sessão: registra o dia, soma o XP (subindo de nível quantas vezes
// precisar) e sorteia uma dica ainda não vista como recompensa.
export function applySessionXp(p, amount) {
  const t = todayKey();
  const base = recordSession(p, t);
  let xp = base.xp + amount, level = base.level, didLevelUp = false;
  while (xp >= xpMaxFor(level)) { xp -= xpMaxFor(level); level += 1; didLevelUp = true; }
  const tipIdx = pickTip(base.tipsSeen);
  const next = {
    ...base, xp, level,
    tipsSeen: addUnique(base.tipsSeen, tipIdx),
    totalSessions: base.totalSessions + 1,
    dailyXp: { ...base.dailyXp, [t]: (base.dailyXp[t] || 0) + amount },
  };
  return { next, didLevelUp, tip: TIPS[tipIdx] };
}

// Abrir um chuyên đề conta para a missão "2 chuyên đề", para o progresso da Vòng 1
// e marca o passo correspondente do lộ trình como "Đang học".
export function touchSubject(p, id) {
  const { missionProgress, missionStreak } = rolloverMissions(p);
  return {
    ...p,
    missionStreak,
    missionProgress: { ...missionProgress, subjectsTouched: addUnique(missionProgress.subjectsTouched, id) },
    subjectsEverTouched: addUnique(p.subjectsEverTouched, id),
    planStatus: markStepStarted(p.planStatus, id),
  };
}
