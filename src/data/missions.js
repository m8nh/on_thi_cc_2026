// Nhiệm vụ hằng ngày. `key` é o contador do dia em missionProgress (ver lib/progress.js);
// `xp` é o prêmio de cada missão, recebido ao bấm "Nhận thưởng".
export const DAILY_MISSIONS = [
  { id: "flashcard", label: "Hoàn thành 1 bộ flash card", target: 1, key: "flashcardDecks", xp: 10 },
  { id: "cards", label: "Ôn 40 thẻ flash card", target: 40, key: "cardsReviewed", xp: 15 },
  { id: "quiz", label: "Làm 1 lượt câu hỏi / đề thi thử", target: 1, key: "quizzes", xp: 10 },
  { id: "correct", label: "Trả lời đúng 25 câu", target: 25, key: "quizCorrect", xp: 15 },
  { id: "accuracy", label: "Đạt từ 80% đúng trong 1 lượt (≥10 câu)", target: 1, key: "highScoreRounds", xp: 15 },
  { id: "subjects", label: "Học từ 2 chuyên đề khác nhau", target: 2, key: "subjectsTouched", xp: 10 },
  { id: "writing", label: "Hoàn thành 1 bài viết", target: 1, key: "writings", xp: 20 },
  { id: "interview", label: "Bốc thăm và trả lời 1 câu vấn đáp", target: 1, key: "interviews", xp: 15 },
  { id: "sessions", label: "Hoàn thành 4 phiên học", target: 4, key: "sessions", xp: 10 },
  { id: "xp", label: "Kiếm 150 XP từ việc học", target: 150, key: "studyXp", xp: 20 },
];

// Số nhiệm vụ cần hoàn thành (và nhận thưởng) để giữ chuỗi 🔥.
export const MISSIONS_FOR_STREAK = 7;

// Lượt câu hỏi tính là "điểm cao".
export const HIGH_SCORE = { minQuestions: 10, ratio: 0.8 };
