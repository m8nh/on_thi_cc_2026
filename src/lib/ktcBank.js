import { shuffle } from "./shuffle.js";
import { KTC_DOCS, MOCK_EXAM } from "../data/ktc/vanBan.js";

/* ---------------------------------------------------------
   Ngân hàng câu hỏi Vòng 1: carregados sob demanda (um JSON por văn bản),
   para o site não baixar ~2.700 questões de uma vez.
   Formato de cada item (gerado a partir dos PDFs):
     t: "m" (4 phương án) | "tf" (Đúng/Sai 2 nội dung) | "f" (điền khuyết)
     q, o[], c (índice correto), st[2] + a[2] (Đúng/Sai), ans (điền khuyết)
     s (chương/mục), cc (căn cứ), gt (giải thích), mn (mẹo nhớ)
--------------------------------------------------------- */

export const ROUND_SIZE = 20;

// Carrega `${dir}/${docId}.json` uma única vez; văn bản sem arquivo devolve [].
function lazyJsonLoader(modules, dir) {
  const cache = {};
  return async (docId) => {
    if (!cache[docId]) cache[docId] = (await modules[`${dir}/${docId}.json`]?.()) ?? [];
    return cache[docId];
  };
}

export const loadBank = lazyJsonLoader(
  import.meta.glob("../data/ktc/banks/*.json", { import: "default" }),
  "../data/ktc/banks",
);

// Thẻ từ khóa (số liệu, thời hạn, tỷ lệ) tirados do bộ KEY: { id, front, back, tip?, basis? }
export const loadKeyCards = lazyJsonLoader(
  import.meta.glob("../data/ktc/keycards/*.json", { import: "default" }),
  "../data/ktc/keycards",
);

export const isQuizItem = (it) => it.t === "m" || it.t === "tf";
const sectionOf = (it) => it.s || "Khác";

export function sectionsOf(items) {
  const counts = new Map();
  for (const it of items.filter(isQuizItem)) counts.set(sectionOf(it), (counts.get(sectionOf(it)) || 0) + 1);
  return [...counts].map(([name, count]) => ({ name, count }));
}

export const docOfQuestion = (id) => KTC_DOCS.find((d) => id.startsWith(`${d.id}-`));

/* ---------- Estatística por questão ----------
   qStats[id] = [vezes respondida, vezes errada, última foi certa (1/0)] */
export function recordAnswers(qStats, results) {
  const next = { ...qStats };
  for (const { id, correct } of results) {
    const [seen = 0, wrong = 0] = next[id] || [];
    next[id] = [seen + 1, wrong + (correct ? 0 : 1), correct ? 1 : 0];
  }
  return next;
}

// qStats só guarda questões do Vòng 1, então cada chave é uma questão já feita.
export const countSeen = (qStats) => Object.keys(qStats).length;

export function docStats(docId, qStats) {
  const prefix = `${docId}-`;
  let seen = 0, right = 0;
  for (const [id, st] of Object.entries(qStats)) {
    if (!id.startsWith(prefix)) continue;
    seen += 1;
    if (st[2]) right += 1;
  }
  return { seen, right };
}

// 0 = errou da última vez, 1 = nunca vista, 2 = acertou da última vez
const tierOf = (st) => (!st ? 1 : st[2] === 0 ? 0 : 2);

// Rodada de prática: primeiro as que errou da última vez, depois as nunca vistas,
// depois as já acertadas (as menos revisadas primeiro).
export function pickRound(items, qStats, { onlyWrong = false, section = null } = {}) {
  let pool = items.filter(isQuizItem);
  if (section) pool = pool.filter((it) => sectionOf(it) === section);
  if (onlyWrong) pool = pool.filter((it) => tierOf(qStats[it.id]) === 0);
  const tiers = [[], [], []];
  for (const it of shuffle(pool)) tiers[tierOf(qStats[it.id])].push(it);
  tiers[2].sort((a, b) => qStats[a.id][0] - qStats[b.id][0]);
  return shuffle(tiers.flat().slice(0, ROUND_SIZE));
}

export const countWrong = (items, qStats) => items.filter((it) => isQuizItem(it) && tierOf(qStats[it.id]) === 0).length;

/* ---------- Flash card ----------
   cardStats[id] = 1 (nhớ) | 0 (chưa nhớ) */

// Perguntas negativas ("KHÔNG đúng…") não viram thẻ: a resposta isolada confundiria.
const NEGATIVE = /KHÔNG|không đúng|SAI\b|ngoại trừ/;

export function cardsOf(items) {
  const cards = [];
  for (const it of items) {
    const back = it.t === "f" ? it.ans
      : it.t === "m" && !NEGATIVE.test(it.q) ? it.o[it.c]
      : null;
    if (back) cards.push({ id: `${it.id}c`, front: it.q, back, tip: it.mn, basis: it.cc });
  }
  return cards;
}

export function pickCards(cards, cardStats) {
  const forgot = [], fresh = [], known = [];
  for (const c of shuffle(cards)) {
    const st = cardStats[c.id];
    (st === 0 ? forgot : st === undefined ? fresh : known).push(c);
  }
  return [...forgot, ...fresh, ...known].slice(0, ROUND_SIZE);
}

export function recordCards(cardStats, cardResults) {
  const next = { ...cardStats };
  for (const { id, knew } of cardResults) next[id] = knew ? 1 : 0;
  return next;
}

/* ---------- Thi thử Vòng 1 ----------
   60 câu 4 phương án, chia theo mức ưu tiên của từng văn bản. */

// Cota proporcional à prioridade; as sobras do arredondamento vão
// para os văn bản de prioridade mais alta.
function examQuotas(docs) {
  const weightSum = docs.reduce((n, d) => n + d.priority, 0);
  const quotas = docs.map((d) => Math.floor((MOCK_EXAM.questions * d.priority) / weightSum));
  const byPriority = docs.map((_, i) => i).sort((a, b) => docs[b].priority - docs[a].priority);
  let rest = MOCK_EXAM.questions - quotas.reduce((a, b) => a + b, 0);
  for (let k = 0; rest > 0; k += 1, rest -= 1) quotas[byPriority[k % byPriority.length]] += 1;
  return quotas;
}

export async function buildMockExam() {
  const docs = KTC_DOCS.filter((d) => d.counts.mcq > 0);
  const banks = await Promise.all(docs.map((d) => loadBank(d.id)));
  const quotas = examQuotas(docs);
  const picked = banks.flatMap((items, i) => shuffle(items.filter((it) => it.t === "m")).slice(0, quotas[i]));
  return shuffle(picked);
}
