const DAY_MS = 86400000;

export const WEEKDAYS_VI = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// Data local (não UTC): com toISOString o "dia" virava às 07:00 no fuso UTC+7.
const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const todayKey = () => isoDate(new Date());
export const yesterdayKey = () => { const d = new Date(); d.setDate(d.getDate() - 1); return isoDate(d); };

export function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return isoDate(d);
}

export function toDateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// Células do mês começando na segunda-feira; null = dia vazio.
export function buildCalendarGrid(year, month) {
  const startWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const numDays = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= numDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function fullCountdown(dateStr, timeStr) {
  if (!dateStr) return null;
  const target = new Date(`${dateStr}T${timeStr || "08:00"}:00`).getTime();
  const diff = target - Date.now();
  if (diff <= 0) return { passed: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    passed: false,
    days: Math.floor(diff / DAY_MS),
    hours: Math.floor((diff % DAY_MS) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function last7Days() {
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({ key: isoDate(d), label: WEEKDAYS_VI[(d.getDay() + 6) % 7], isToday: i === 0 });
  }
  return out;
}

const pad2 = (n) => String(n).padStart(2, "0");

// mm:ss; valores negativos (estouro de tempo) aparecem como +mm:ss.
export function formatClock(sec) {
  const abs = Math.abs(sec);
  return `${sec < 0 ? "+" : ""}${pad2(Math.floor(abs / 60))}:${pad2(abs % 60)}`;
}
