import { LIGHT } from "../theme.js";
import { INTERVIEW_QUESTIONS, PROFILE_QUESTIONS } from "../data/interviewData.js";
import { addDays, todayKey } from "./dates.js";

export const RATING = {
  good: { label: "Tốt", color: LIGHT.teal },
  ok: { label: "Tạm được", color: LIGHT.gold },
  weak: { label: "Cần ôn", color: LIGHT.red },
};

export const profileKey = (groupIdx, itemIdx) => `p${groupIdx}-${itemIdx}`;
export const PROFILE_KEYS = PROFILE_QUESTIONS.flatMap((g, gi) => g.items.map((_, i) => profileKey(gi, i)));

export const findQuestion = (n) => INTERVIEW_QUESTIONS.find((q) => q.n === n);

// Prioriza o que você nunca treinou e o que marcou como fraco, como no sorteio real tudo pode cair.
export function pickDrawQuestion(ratings) {
  const weak = INTERVIEW_QUESTIONS.filter((q) => ratings[q.n] === "weak");
  const fresh = INTERVIEW_QUESTIONS.filter((q) => !ratings[q.n]);
  const notGood = INTERVIEW_QUESTIONS.filter((q) => ratings[q.n] !== "good");
  const pool = Math.random() < 0.7 && (weak.length || fresh.length)
    ? [...weak, ...fresh]
    : (notGood.length ? notGood : INTERVIEW_QUESTIONS);
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ---------- Flash card phỏng vấn: Leitner 6 hộp, khoảng ôn 0-1-3-7-14-30 ngày ---------- */

const FC_GAPS = [0, 1, 3, 7, 14, 30];
export const FC_SESSION_SIZE = 20;
export const LEARNED_BOX = 3;

export const cardBox = (cards, id) => cards[id]?.box || 0;
export const isCardDue = (cards, id) => !cards[id] || cards[id].due <= todayKey();

// grade: "again" (quên) | "hard" (nhớ mang máng) | "know" (nhớ rõ)
export function gradeCard(current, grade) {
  const cur = current || { box: 0 };
  const box = grade === "know" ? Math.min(5, cur.box + 1) : grade === "hard" ? Math.max(1, cur.box) : 0;
  const due = grade === "again" ? todayKey() : addDays(FC_GAPS[box] || 1);
  return { box, due };
}

export const flashSessionXp = (known) => Math.min(40, 10 + known * 2);
