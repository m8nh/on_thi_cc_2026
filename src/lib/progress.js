import { TIPS } from "../data/tips.js";
import { DAILY_MISSIONS, HIGH_SCORE, MISSIONS_FOR_STREAK } from "../data/missions.js";
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
  qStats: {}, cardStats: {},
  mockExamsPassed: 0, writingsDone: 0, bestMissionStreak: 0,
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

const MISSION_COUNTERS = ["flashcardDecks", "cardsReviewed", "quizzes", "quizCorrect", "highScoreRounds", "writings", "interviews", "sessions", "studyXp"];

function freshMissionDay(dateKey) {
  const mp = { date: dateKey, subjectsTouched: [], claimedIds: [], streakCounted: false };
  MISSION_COUNTERS.forEach((k) => { mp[k] = 0; });
  return mp;
}

// Completa campos que faltam (dados salvos antes de haver 10 missões).
// O formato antigo tinha só `claimed: true/false` para as 3 missões originais.
function normalizeMissionDay(mp) {
  const base = freshMissionDay(mp.date);
  const out = { ...base, ...mp };
  if (mp.claimed && !mp.claimedIds) {
    out.claimedIds = ["flashcard", "quiz", "subjects"];
    out.streakCounted = true;
  }
  delete out.claimed;
  return out;
}

export function missionValue(mp, mission) {
  if (!mp) return 0;
  return mission.key === "subjectsTouched" ? mp.subjectsTouched.length : (mp[mission.key] || 0);
}

export const isMissionDone = (mp, m) => missionValue(mp, m) >= m.target;
export const doneMissions = (mp) => DAILY_MISSIONS.filter((m) => isMissionDone(mp, m));
// Missões concluídas cujo XP ainda não foi recebido.
export const claimableMissions = (mp) => doneMissions(mp).filter((m) => !mp.claimedIds.includes(m.id));
export const allMissionsDone = (mp) => doneMissions(mp).length === DAILY_MISSIONS.length;

export const missionBonus = (streak) => 20 + Math.min(streak, 5) * 4;

// XP que o botão "Nhận thưởng" entrega agora: missões pendentes + bônus de
// sequência quando este resgate faz o dia atingir MISSIONS_FOR_STREAK.
export function pendingMissionReward(mp, streak) {
  const pending = claimableMissions(mp);
  const xp = pending.reduce((sum, m) => sum + m.xp, 0);
  const reachesStreak = !mp.streakCounted && mp.claimedIds.length + pending.length >= MISSIONS_FOR_STREAK;
  return { pending, xp: xp + (reachesStreak ? missionBonus(streak) : 0), reachesStreak };
}

// Se o dia mudou, "vira a página" das missões. Se o dia anterior não atingiu
// MISSIONS_FOR_STREAK, zera só a sequência de bônus — nunca XP/nível.
export function rolloverMissions(p, dateKey = todayKey()) {
  if (p.missionProgress && p.missionProgress.date === dateKey) {
    return { missionProgress: normalizeMissionDay(p.missionProgress), missionStreak: p.missionStreak || 0 };
  }
  const prev = p.missionProgress && normalizeMissionDay(p.missionProgress);
  const missionStreak = prev && !prev.streakCounted ? 0 : (p.missionStreak || 0);
  return { missionProgress: freshMissionDay(dateKey), missionStreak };
}

// Soma uma sessão concluída nos contadores do dia.
export function recordMissionSession(mp, { kind, cardsReviewed = 0, quizCorrect = 0, quizTotal = 0, xp = 0 }) {
  const highScore = kind === "quiz" && quizTotal >= HIGH_SCORE.minQuestions && quizCorrect / quizTotal >= HIGH_SCORE.ratio;
  return {
    ...mp,
    flashcardDecks: mp.flashcardDecks + (kind === "flashcard" ? 1 : 0),
    cardsReviewed: mp.cardsReviewed + cardsReviewed,
    quizzes: mp.quizzes + (kind === "quiz" ? 1 : 0),
    quizCorrect: mp.quizCorrect + quizCorrect,
    highScoreRounds: mp.highScoreRounds + (highScore ? 1 : 0),
    writings: mp.writings + (kind === "writing" ? 1 : 0),
    interviews: mp.interviews + (kind === "interview" ? 1 : 0),
    sessions: mp.sessions + 1,
    studyXp: mp.studyXp + xp,
  };
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
