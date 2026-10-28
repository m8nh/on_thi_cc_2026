import { Award, BookOpen, Brain, CalendarCheck, Crown, Flame, GraduationCap, Layers, Map, Medal, Mic, PenLine, Rocket, Target, Trophy, Zap } from "lucide-react";
import { KTC_TOTAL_QUESTIONS } from "./ktc/vanBan.js";
import { countSeen } from "../lib/ktcBank.js";

// Chuỗi ngày học dài nhất, tính từ lịch sử sessionDates (không mất khi chuỗi hiện tại bị đứt).
function longestStreak(dates) {
  const days = [...new Set(dates)].sort().map((d) => Math.round(new Date(`${d}T00:00:00Z`).getTime() / 86400000));
  let best = 0, run = 0;
  days.forEach((d, i) => { run = i && d === days[i - 1] + 1 ? run + 1 : 1; best = Math.max(best, run); });
  return best;
}

// Bảng thành tích: mỗi thành tích có điều kiện đo được từ tiến trình.
// value(p) trả về số hiện tại; đạt khi value >= target.
export const ACHIEVEMENTS = [
  { id: "first-session", icon: Rocket, title: "Bước đầu tiên", how: "Hoàn thành 1 phiên học bất kỳ", target: 1, value: (p) => p.totalSessions },
  { id: "sessions-25", icon: Zap, title: "Chăm chỉ", how: "Hoàn thành 25 phiên học", target: 25, value: (p) => p.totalSessions },
  { id: "sessions-100", icon: Crown, title: "Bền bỉ", how: "Hoàn thành 100 phiên học", target: 100, value: (p) => p.totalSessions },
  { id: "streak-3", icon: Flame, title: "Khởi động", how: "Học 3 ngày liên tiếp", target: 3, value: (p) => longestStreak(p.sessionDates) },
  { id: "streak-7", icon: CalendarCheck, title: "Một tuần trọn vẹn", how: "Học 7 ngày liên tiếp", target: 7, value: (p) => longestStreak(p.sessionDates) },
  { id: "streak-30", icon: Medal, title: "Kỷ luật thép", how: "Học 30 ngày liên tiếp", target: 30, value: (p) => longestStreak(p.sessionDates) },
  { id: "missions-7", icon: Target, title: "Hoàn thành nhiệm vụ", how: "Giữ chuỗi nhiệm vụ hằng ngày 7 ngày (đạt mốc nhiệm vụ mỗi ngày)", target: 7, value: (p) => Math.max(p.bestMissionStreak || 0, p.missionStreak || 0) },
  { id: "level-5", icon: Award, title: "Lên cấp 5", how: "Đạt cấp độ 5", target: 5, value: (p) => p.level },
  { id: "level-10", icon: GraduationCap, title: "Lên cấp 10", how: "Đạt cấp độ 10", target: 10, value: (p) => p.level },
  { id: "cards-100", icon: Layers, title: "Trăm thẻ", how: "Ôn tổng cộng 100 thẻ flash card", target: 100, value: (p) => p.totalCardsReviewed },
  { id: "cards-500", icon: Brain, title: "Trí nhớ bền", how: "Ôn tổng cộng 500 thẻ flash card", target: 500, value: (p) => p.totalCardsReviewed },
  { id: "correct-100", icon: BookOpen, title: "Trăm câu đúng", how: "Trả lời đúng tổng cộng 100 câu", target: 100, value: (p) => p.quizStats.correct },
  { id: "bank-half", icon: Map, title: "Đi nửa chặng", how: `Làm qua 50% ngân hàng câu hỏi Vòng 1 (${Math.ceil(KTC_TOTAL_QUESTIONS / 2)} câu)`, target: Math.max(1, Math.ceil(KTC_TOTAL_QUESTIONS / 2)), value: (p) => countSeen(p.qStats) },
  { id: "mock-pass", icon: Trophy, title: "Đạt thi thử", how: "Đạt một đề thi thử Vòng 1 (đúng từ 50%)", target: 1, value: (p) => p.mockExamsPassed || 0 },
  { id: "writing-1", icon: PenLine, title: "Ngòi bút đầu tiên", how: "Hoàn thành 1 bài viết Vòng 2", target: 1, value: (p) => p.writingsDone || 0 },
  { id: "interview-10", icon: Mic, title: "Tự tin vấn đáp", how: "Bốc thăm và tự chấm 10 câu vấn đáp khác nhau", target: 10, value: (p) => Object.keys(p.interview?.ratings || {}).length },
];
