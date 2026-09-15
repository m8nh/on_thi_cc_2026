import { useState, useEffect, useRef } from "react";
import {
  Flame, Trophy, BookOpen, Layers, Brain, CheckCircle2, XCircle,
  Sparkles, Award, ArrowLeft, ChevronRight, Star, Zap, Target, RotateCcw,
  Settings, Clock, CalendarDays, LogOut, Search, Home,
} from "lucide-react";

/* ---------------------------------------------------------
   NỘI DUNG — thay bằng flash card / câu hỏi / bài đọc thật
--------------------------------------------------------- */
const STAGE1_SUBJECTS = [
  {
    id: "ly-luan-chinh-tri", type: "deck",
    name: "Lý luận chính trị",
    ref: "Hệ thống chính trị và phương thức lãnh đạo của Đảng (Chuyên đề 3)",
    icon: Sparkles,
    flashcards: [{ front: "Hệ thống chính trị ở Việt Nam gồm những thành tố nào?", back: "Đảng Cộng sản Việt Nam, Nhà nước CHXHCN Việt Nam, Mặt trận Tổ quốc và các tổ chức chính trị - xã hội." }],
    quiz: [{ q: "[Mẫu] Câu hỏi về hệ thống chính trị sẽ được cập nhật sau.", options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], correct: 0, why: "Đây là câu hỏi mẫu — thay bằng nội dung thật của chuyên đề 3." }],
  },
  {
    id: "nha-nuoc-phap-luat", type: "deck",
    name: "Nhà nước & Pháp luật",
    ref: "Giáo trình Lý luận NN&PL · Hiến pháp 2013",
    icon: BookOpen,
    flashcards: [{ front: "Hiến pháp nước CHXHCN Việt Nam hiện hành ban hành năm nào?", back: "Năm 2013." }],
    quiz: [{ q: "[Mẫu] Câu hỏi về Hiến pháp 2013 sẽ được cập nhật sau.", options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], correct: 0, why: "Đây là câu hỏi mẫu — thay bằng nội dung thật." }],
  },
  {
    id: "to-chuc-bo-may", type: "deck",
    name: "Tổ chức bộ máy nhà nước",
    ref: "Điều lệ Đảng · Luật tổ chức QH/CP · NĐ 123, 101, 81",
    icon: Layers,
    flashcards: [{ front: "Luật Tổ chức Quốc hội hiện hành ban hành ngày nào?", back: "Ngày 20/11/2014." }],
    quiz: [{ q: "[Mẫu] Câu hỏi về tổ chức bộ máy nhà nước sẽ được cập nhật sau.", options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], correct: 0, why: "Đây là câu hỏi mẫu — thay bằng nội dung thật." }],
  },
  {
    id: "can-bo-cong-chuc", type: "deck",
    name: "Cán bộ, công chức",
    ref: "Luật CBCC 2008 & sửa đổi 2019 · Luật CQ đại diện VN ở nước ngoài",
    icon: Target,
    flashcards: [{ front: "Luật Cán bộ, công chức được ban hành năm nào?", back: "Năm 2008, sửa đổi bổ sung năm 2019." }],
    quiz: [{ q: "[Mẫu] Câu hỏi về Luật Cán bộ, công chức sẽ được cập nhật sau.", options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], correct: 0, why: "Đây là câu hỏi mẫu — thay bằng nội dung thật." }],
  },
  {
    id: "lao-dong-vb-phap-luat", type: "deck",
    name: "Lao động & Văn bản pháp luật",
    ref: "Bộ luật Lao động 2019 · Luật ban hành VBQPPL 2015/2020",
    icon: Zap,
    flashcards: [{ front: "Bộ luật Lao động hiện hành được thông qua ngày nào?", back: "Ngày 20/11/2019." }],
    quiz: [{ q: "[Mẫu] Câu hỏi về Bộ luật Lao động sẽ được cập nhật sau.", options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], correct: 0, why: "Đây là câu hỏi mẫu — thay bằng nội dung thật." }],
  },
  {
    id: "cai-cach-hanh-chinh", type: "deck",
    name: "Cải cách hành chính",
    ref: "Nghị quyết 76/NQ-CP (giai đoạn 2021–2030)",
    icon: Award,
    flashcards: [{ front: "Nghị quyết 76/NQ-CP ban hành ngày nào?", back: "Ngày 15/7/2021, ban hành Chương trình tổng thể cải cách hành chính nhà nước giai đoạn 2021-2030." }],
    quiz: [{ q: "[Mẫu] Câu hỏi về cải cách hành chính sẽ được cập nhật sau.", options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], correct: 0, why: "Đây là câu hỏi mẫu — thay bằng nội dung thật." }],
  },
];

function shuffleOnce(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Junta flashcards e questões de todos os chuyên đề do Vòng 1 num só baralho/
// simulado embaralhado — igual à prova de verdade, que mistura tudo.
const COMBINED_SUBJECT = {
  id: "tong-hop-vong1", type: "deck",
  name: "Ôn tập tổng hợp",
  ref: "Trộn ngẫu nhiên toàn bộ 6 chuyên đề · giống cấu trúc đề thi thật",
  icon: Trophy,
  flashcards: shuffleOnce(STAGE1_SUBJECTS.flatMap((s) => s.flashcards)),
  quiz: shuffleOnce(STAGE1_SUBJECTS.flatMap((s) => s.quiz)),
};

const WRITING_SUBJECT = {
  id: "viet-dich-thuat", type: "writing",
  name: "Kỹ năng viết – Dịch thuật (Lần 2)",
  ref: "Vòng thi thứ 2 · Bài thi viết tiếng Bồ Đào Nha · 180 phút · 35 điểm (tối thiểu 17,5)",
  icon: BookOpen,
  timeLimitMinutes: 180,
  maxScore: 35,
  passScore: 17.5,
  content: {
    readingText: "[Nội dung mẫu — thay bằng bài báo tiếng Bồ Đào Nha thật, khoảng 1200–1500 từ, về quan hệ quốc tế/đối ngoại]",
    questions: [
      "[Mẫu] Câu hỏi 1 về nội dung bài đọc",
      "[Mẫu] Câu hỏi 2 về nội dung bài đọc",
      "[Mẫu] Câu hỏi 3 về nội dung bài đọc",
    ],
    excerptToVietnamese: "[Đoạn trích mẫu bằng tiếng Bồ Đào Nha để dịch sang tiếng Việt — khoảng 300–350 từ]",
    sourceToPortuguese: "[Bài viết mẫu bằng tiếng Việt để dịch sang tiếng Bồ Đào Nha — khoảng 500 từ, chủ đề đối ngoại]",
  },
};

const CHECKLIST_CRITERIA = [
  "Nội dung đầy đủ, đúng trọng tâm bài đọc",
  "Từ ngữ chính xác, đúng thuật ngữ chuyên ngành đối ngoại",
  "Ngữ pháp chính xác",
  "Văn phong phù hợp, mạch lạc",
  "Chính tả không sai",
  "Không chép nguyên văn từ bài gốc",
  "Không có sai sót về chức danh lãnh đạo, tên cơ quan",
];

const TIPS = [
  { icon: Brain, title: "Hiệu ứng kiểm tra", body: "Cố nhớ lại kiến thức — kể cả khi sai — giúp ghi nhớ tốt hơn nhiều so với chỉ đọc lại. Bạn vừa áp dụng kỹ thuật này." },
  { icon: RotateCcw, title: "Lặp lại ngắt quãng", body: "Ôn tập theo khoảng cách tăng dần (1 ngày, 3 ngày, 1 tuần...) là phương pháp có bằng chứng khoa học mạnh nhất cho trí nhớ dài hạn." },
  { icon: Layers, title: "Học xen kẽ", body: "Trộn nhiều chuyên đề trong một buổi học, thay vì học một chủ đề đến kiệt sức, giúp bạn phân biệt tốt hơn khi nào áp dụng kiến thức nào." },
  { icon: Star, title: "Giấc ngủ củng cố trí nhớ", body: "Ngủ đủ sau khi học giúp chuyển kiến thức từ trí nhớ ngắn hạn sang dài hạn. Thức khuya mà ngủ không đủ sẽ làm giảm hiệu quả công sức bạn bỏ ra." },
  { icon: Target, title: "Độ khó cần thiết", body: "Cảm thấy khó nhớ lại câu trả lời là dấu hiệu việc học đang diễn ra sâu hơn — đừng nản lòng vì điều đó." },
  { icon: Sparkles, title: "Hiệu ứng tự tạo", body: "Tự mình đưa ra câu trả lời (như trong flash card) tạo ra trí nhớ mạnh hơn nhiều so với chỉ đọc đáp án có sẵn." },
  { icon: Zap, title: "Vòng lặp thói quen", body: "Những chiến thắng nhỏ liên tục (như buổi học này) huấn luyện não bộ liên kết việc học với phần thưởng — đó là cách thói quen thực sự hình thành." },
  { icon: Award, title: "Tư duy phát triển", body: "Coi trọng nỗ lực và chiến lược học tập — chứ không chỉ kết quả — là điều giúp duy trì động lực khi kỳ thi vẫn còn xa." },
  { icon: BookOpen, title: "Học rải đều thắng học dồn", body: "30 phút mỗi ngày trong 10 ngày mang lại hiệu quả ghi nhớ tốt hơn 5 tiếng liền trong một ngày. Đều đặn quan trọng hơn cường độ." },
  { icon: Flame, title: "Đường cong lãng quên", body: "Không ôn tập, bạn sẽ quên phần lớn nội dung chỉ sau vài ngày (đường cong Ebbinghaus). Ôn lại đúng lúc sắp quên sẽ 'reset' đường cong này hiệu quả nhất." },
];

const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');";

const COLORS = {
  bg: "#12162A", surface: "#1B2140", surfaceAlt: "#232A4D", border: "#333c66",
  gold: "#D6AE3D", teal: "#3EB489", red: "#E0667A", text: "#EDEAE2", muted: "#8891A8",
};

const LIGHT = {
  bg: "#F4F5FA", surface: "#FFFFFF", surfaceAlt: "#F7F8FC", border: "#E7E8F2",
  text: "#20233A", muted: "#8A8FA3", gold: "#C79A2E", teal: "#2E9A76",
  red: "#D9536B", purple: "#6C63FF",
};

const displayFont = { fontFamily: "'Fraunces', serif" };
const bodyFont = { fontFamily: "'IBM Plex Sans', sans-serif" };
const monoFont = { fontFamily: "'IBM Plex Mono', monospace" };

const xpMaxFor = (level) => 100 + (level - 1) * 40;
const WEEKDAYS_VI = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const inputStyle = { width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", color: COLORS.text, fontSize: 13.5, marginBottom: 12, boxSizing: "border-box", ...bodyFont };
const textareaStyle = { ...inputStyle, minHeight: 90, resize: "vertical", fontFamily: "'IBM Plex Sans', sans-serif", lineHeight: 1.5 };

function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const rawDay = firstDay.getDay();
  const startWeekday = (rawDay + 6) % 7;
  const numDays = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= numDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function toDateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / 86400000);
}

function fullCountdown(dateStr, timeStr) {
  if (!dateStr) return null;
  const target = new Date(`${dateStr}T${timeStr || "08:00"}:00`).getTime();
  const diff = target - Date.now();
  if (diff <= 0) return { passed: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    passed: false,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function last7Days() {
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ key, label: WEEKDAYS_VI[(d.getDay() + 6) % 7], isToday: i === 0 });
  }
  return out;
}

const DAILY_MISSIONS = [
  { id: "flashcard", label: "Hoàn thành 1 bộ flash card", target: 1, key: "flashcardDecks" },
  { id: "quiz", label: "Làm 1 đề thi thử", target: 1, key: "quizzes" },
  { id: "subjects", label: "Học từ 2 chuyên đề khác nhau", target: 2, key: "subjectsTouched" },
];

function missionValue(mp, mission) {
  if (!mp) return 0;
  return mission.key === "subjectsTouched" ? mp.subjectsTouched.length : mp[mission.key];
}

function freshMissionDay(dateKey) {
  return { date: dateKey, flashcardDecks: 0, quizzes: 0, subjectsTouched: [], claimed: false };
}

// Se o dia mudou, "vira a página" das missões. Se o dia anterior não foi
// concluído (e reivindicado), zera só a sequência de bônus — nunca XP/nível.
function rolloverMissions(p, dateKey) {
  if (p.missionProgress && p.missionProgress.date === dateKey) {
    return { missionProgress: p.missionProgress, missionStreak: p.missionStreak || 0 };
  }
  const hadPrevious = !!p.missionProgress;
  const wasClaimed = hadPrevious && p.missionProgress.claimed;
  const missionStreak = hadPrevious && !wasClaimed ? 0 : (p.missionStreak || 0);
  return { missionProgress: freshMissionDay(dateKey), missionStreak };
}

function computeAward(p, amount) {
  let xp = p.xp + amount, level = p.level, xpMax = xpMaxFor(level), didLevelUp = false;
  while (xp >= xpMax) { xp -= xpMax; level += 1; xpMax = xpMaxFor(level); didLevelUp = true; }
  const unseen = TIPS.map((_, i) => i).filter((i) => !p.tipsSeen.includes(i));
  const pool = unseen.length ? unseen : TIPS.map((_, i) => i);
  const pickIdx = pool[Math.floor(Math.random() * pool.length)];
  const tipsSeen = p.tipsSeen.includes(pickIdx) ? p.tipsSeen : [...p.tipsSeen, pickIdx];
  return { next: { ...p, xp, level, tipsSeen, totalSessions: p.totalSessions + 1 }, didLevelUp, pickIdx };
}

const STORAGE_KEY = "trilha-do-aprovado-progress";

const DEFAULT_PROGRESS = {
  name: null, examDate: null, examTime: "08:00",
  level: 1, xp: 0, streakDays: 1, lastActiveDate: null,
  tipsSeen: [], totalSessions: 0, sessionDates: [],
  writingDraft: null,
  missionProgress: null, missionStreak: 0,
  dailyXp: {}, subjectsEverTouched: [], totalCardsReviewed: 0,
  quizStats: { correct: 0, total: 0 },
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Lỗi khi đọc tiến trình đã lưu:", e);
  }
  return DEFAULT_PROGRESS;
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("login"); // login | dashboard | settings | subject | flashcards | quiz | writing | reward
  const [subjectId, setSubjectId] = useState(null);
  const [leveledUp, setLeveledUp] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const [rewardTip, setRewardTip] = useState(null);

  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const accumRef = useRef(0);
  const quizAccumRef = useRef(0);
  const quizCorrectRef = useRef(0);
  const draftSaveTimeout = useRef(null);
  const progressRef = useRef(null);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  const [searchQuery, setSearchQuery] = useState("");

  const [nameInput, setNameInput] = useState("");
  const [examDateInput, setExamDateInput] = useState("");
  const [examTimeInput, setExamTimeInput] = useState("08:00");
  const [dashboardTick, setDashboardTick] = useState(0);

  const [writingStarted, setWritingStarted] = useState(false);
  const [writingStartTs, setWritingStartTs] = useState(null);
  const [tick, setTick] = useState(0);
  const [summaryText, setSummaryText] = useState("");
  const [answers, setAnswers] = useState(["", "", ""]);
  const [translationVi, setTranslationVi] = useState("");
  const [translationPt, setTranslationPt] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState(null);
  const [feedbackError, setFeedbackError] = useState(false);
  const [checklist, setChecklist] = useState({});

  useEffect(() => {
    setView(progress.name ? "dashboard" : "login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (view !== "writing" || !writingStarted) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [view, writingStarted]);

  useEffect(() => {
    if (view !== "dashboard") return;
    const id = setInterval(() => setDashboardTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [view]);

  const persist = (next) => {
    setProgress(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch (e) { console.error("Lỗi khi lưu tiến trình:", e); }
  };

  const saveDraftDebounced = (draft) => {
    if (draftSaveTimeout.current) clearTimeout(draftSaveTimeout.current);
    draftSaveTimeout.current = setTimeout(() => {
      persist({ ...progressRef.current, writingDraft: draft });
    }, 700);
  };

  const today = () => new Date().toISOString().slice(0, 10);

  const recordSession = (p) => {
    const t = today();
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const sessionDates = p.sessionDates.includes(t) ? p.sessionDates : [...p.sessionDates, t];
    return {
      ...p, sessionDates,
      streakDays: p.lastActiveDate === t ? p.streakDays : (p.lastActiveDate === yesterday ? p.streakDays + 1 : 1),
      lastActiveDate: t,
    };
  };

  const awardXp = (amount, kind, meta = {}) => {
    const t = today();
    const { missionProgress: mpBase, missionStreak: msBase } = rolloverMissions(progress, t);
    const missionProgress = { ...mpBase };
    if (kind === "flashcard") missionProgress.flashcardDecks += 1;
    if (kind === "quiz") missionProgress.quizzes += 1;
    let p = recordSession({ ...progress, missionProgress, missionStreak: msBase });
    p = {
      ...p,
      dailyXp: { ...p.dailyXp, [t]: (p.dailyXp[t] || 0) + amount },
      totalCardsReviewed: p.totalCardsReviewed + (meta.cardsReviewed || 0),
      quizStats: meta.quizTotal
        ? { correct: p.quizStats.correct + (meta.quizCorrect || 0), total: p.quizStats.total + meta.quizTotal }
        : p.quizStats,
    };
    const { next, didLevelUp, pickIdx } = computeAward(p, amount);
    setLeveledUp(didLevelUp);
    setSessionXp(amount);
    setRewardTip(TIPS[pickIdx]);
    persist(next);
    setView("reward");
  };

  const claimMissionReward = () => {
    const t = today();
    const { missionProgress, missionStreak } = rolloverMissions(progress, t);
    const allDone = DAILY_MISSIONS.every((m) => missionValue(missionProgress, m) >= m.target);
    if (!allDone || missionProgress.claimed) return;
    const bonus = 20 + Math.min(missionStreak, 5) * 4;
    let p = recordSession({ ...progress, missionProgress: { ...missionProgress, claimed: true }, missionStreak: missionStreak + 1 });
    p = { ...p, dailyXp: { ...p.dailyXp, [t]: (p.dailyXp[t] || 0) + bonus } };
    const { next, didLevelUp, pickIdx } = computeAward(p, bonus);
    setLeveledUp(didLevelUp);
    setSessionXp(bonus);
    setRewardTip(TIPS[pickIdx]);
    persist(next);
    setView("reward");
  };

  if (loading || !progress) {
    return (
      <div style={{ ...bodyFont, background: COLORS.bg, color: COLORS.muted, minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16 }}>
        <style>{FONT_IMPORT}</style>
        Đang tải lộ trình của bạn...
      </div>
    );
  }

  const subject = STAGE1_SUBJECTS.find((s) => s.id === subjectId) || (subjectId === COMBINED_SUBJECT.id ? COMBINED_SUBJECT : undefined);
  const xpMax = xpMaxFor(progress.level);
  const xpPct = Math.min(100, Math.round((progress.xp / xpMax) * 100));

  const openDeckSubject = (id) => {
    const t = today();
    const { missionProgress, missionStreak } = rolloverMissions(progress, t);
    const subjectsTouched = missionProgress.subjectsTouched.includes(id) ? missionProgress.subjectsTouched : [...missionProgress.subjectsTouched, id];
    const subjectsEverTouched = progress.subjectsEverTouched.includes(id) ? progress.subjectsEverTouched : [...progress.subjectsEverTouched, id];
    persist({ ...progress, missionStreak, missionProgress: { ...missionProgress, subjectsTouched }, subjectsEverTouched });
    setSubjectId(id); setView("subject");
  };
  const openWriting = () => {
    const t = today();
    const { missionProgress, missionStreak } = rolloverMissions(progress, t);
    const subjectsTouched = missionProgress.subjectsTouched.includes(WRITING_SUBJECT.id) ? missionProgress.subjectsTouched : [...missionProgress.subjectsTouched, WRITING_SUBJECT.id];
    const subjectsEverTouched = progress.subjectsEverTouched.includes(WRITING_SUBJECT.id) ? progress.subjectsEverTouched : [...progress.subjectsEverTouched, WRITING_SUBJECT.id];
    persist({ ...progress, missionStreak, missionProgress: { ...missionProgress, subjectsTouched }, subjectsEverTouched });

    const draft = progress.writingDraft;
    if (draft) {
      setWritingStarted(true);
      setWritingStartTs(draft.startedAt);
      setSummaryText(draft.summaryText || "");
      setAnswers(draft.answers || ["", "", ""]);
      setTranslationVi(draft.translationVi || "");
      setTranslationPt(draft.translationPt || "");
    } else {
      setWritingStarted(false); setWritingStartTs(null);
      setSummaryText(""); setAnswers(["", "", ""]); setTranslationVi(""); setTranslationPt("");
    }
    setFeedbackText(null); setFeedbackError(false); setChecklist({});
    setView("writing");
  };
  const startFlashcards = () => { setCardIndex(0); setFlipped(false); setView("flashcards"); };
  const startQuiz = () => { setQIndex(0); setSelected(null); quizAccumRef.current = 0; quizCorrectRef.current = 0; setView("quiz"); };

  const openSettings = () => {
    setNameInput(progress.name || "");
    setExamDateInput(progress.examDate || "");
    setExamTimeInput(progress.examTime || "08:00");
    setView("settings");
  };
  const saveSettings = () => {
    if (!nameInput.trim()) return;
    persist({ ...progress, name: nameInput.trim(), examDate: examDateInput || null, examTime: examTimeInput || "08:00" });
    setView("dashboard");
  };

  const now = new Date();
  const calYear = now.getFullYear(), calMonth = now.getMonth();
  const calCells = buildCalendarGrid(calYear, calMonth);
  const todayKey = toDateKey(calYear, calMonth, now.getDate());
  void dashboardTick; // força recálculo a cada segundo
  const countdown = fullCountdown(progress.examDate, progress.examTime);
  const { missionProgress: missionsToday, missionStreak } = rolloverMissions(progress, today());
  const missionsAllDone = DAILY_MISSIONS.every((m) => missionValue(missionsToday, m) >= m.target);

  const weekData = last7Days().map((d) => ({ ...d, xp: progress.dailyXp[d.key] || 0 }));
  const weekMax = Math.max(1, ...weekData.map((d) => d.xp));
  const vong1Pct = Math.round((progress.subjectsEverTouched.filter((id) => STAGE1_SUBJECTS.some((s) => s.id === id)).length / STAGE1_SUBJECTS.length) * 100);
  const quizAccuracyPct = progress.quizStats.total > 0 ? Math.round((progress.quizStats.correct / progress.quizStats.total) * 100) : null;
  const allSubjectCards = [COMBINED_SUBJECT, ...STAGE1_SUBJECTS, WRITING_SUBJECT];
  const filteredSubjects = searchQuery.trim()
    ? allSubjectCards.filter((s) => s.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : null;

  const remainingSeconds = writingStarted
    ? Math.max(0, WRITING_SUBJECT.timeLimitMinutes * 60 - Math.floor((Date.now() - writingStartTs) / 1000))
    : WRITING_SUBJECT.timeLimitMinutes * 60;
  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const ss = String(remainingSeconds % 60).padStart(2, "0");

  const isDash = view === "dashboard";

  return (
    <div style={{ ...bodyFont, background: isDash ? LIGHT.bg : COLORS.bg, color: isDash ? LIGHT.text : COLORS.text, borderRadius: 20, padding: isDash ? 0 : "24px 20px 28px", maxWidth: isDash ? 720 : 560, margin: "0 auto", minHeight: 560, position: "relative", overflow: "hidden" }}>
      <style>{FONT_IMPORT}</style>
      {!isDash && (
        <svg width="100%" height="100%" viewBox="0 0 560 560" style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none" }}>
          {[80, 140, 210, 290, 370, 450].map((r, i) => <circle key={i} cx="480" cy="60" r={r} fill="none" stroke={COLORS.gold} strokeWidth="1" />)}
        </svg>
      )}

      {/* LOGIN */}
      {view === "login" && (
        <div style={{ position: "relative", textAlign: "center", paddingTop: 40 }}>
          <div style={{ ...displayFont, fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Trilha do Aprovado</div>
          <div style={{ color: COLORS.muted, fontSize: 13, marginBottom: 28 }}>Chào mừng! Nhập tên để cá nhân hóa lộ trình học của bạn.</div>
          <div style={{ maxWidth: 320, margin: "0 auto", textAlign: "left" }}>
            <label style={{ fontSize: 11.5, color: COLORS.muted, display: "block", marginBottom: 6 }}>Tên của bạn</label>
            <input style={inputStyle} value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Ví dụ: Minh" />
            <label style={{ fontSize: 11.5, color: COLORS.muted, display: "block", marginBottom: 6 }}>Ngày thi (không bắt buộc)</label>
            <input type="date" style={inputStyle} value={examDateInput} onChange={(e) => setExamDateInput(e.target.value)} />
            <label style={{ fontSize: 11.5, color: COLORS.muted, display: "block", marginBottom: 6 }}>Giờ thi</label>
            <input type="time" style={inputStyle} value={examTimeInput} onChange={(e) => setExamTimeInput(e.target.value)} />
            <button
              disabled={!nameInput.trim()}
              onClick={() => { persist({ ...progress, name: nameInput.trim(), examDate: examDateInput || null, examTime: examTimeInput || "08:00" }); setView("dashboard"); }}
              style={{ ...btnStyle(COLORS.gold, true), opacity: nameInput.trim() ? 1 : 0.4, marginTop: 6 }}
            >
              Bắt đầu hành trình <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {view === "settings" && (
        <div style={{ position: "relative" }}>
          <button onClick={() => setView("dashboard")} style={backBtnStyle}><ArrowLeft size={13} /> Lộ trình</button>
          <div style={{ ...displayFont, fontSize: 18, fontWeight: 600, margin: "12px 0 16px" }}>Cài đặt</div>
          <label style={{ fontSize: 11.5, color: COLORS.muted, display: "block", marginBottom: 6 }}>Tên của bạn</label>
          <input style={inputStyle} value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
          <label style={{ fontSize: 11.5, color: COLORS.muted, display: "block", marginBottom: 6 }}>Ngày thi</label>
          <input type="date" style={inputStyle} value={examDateInput} onChange={(e) => setExamDateInput(e.target.value)} />
          <label style={{ fontSize: 11.5, color: COLORS.muted, display: "block", marginBottom: 6 }}>Giờ thi</label>
          <input type="time" style={inputStyle} value={examTimeInput} onChange={(e) => setExamTimeInput(e.target.value)} />
          <button disabled={!nameInput.trim()} onClick={saveSettings} style={{ ...btnStyle(COLORS.gold, true), opacity: nameInput.trim() ? 1 : 0.4 }}>Lưu thay đổi</button>
        </div>
      )}

      {/* HEADER (telas escuras: subject/flashcards/quiz/writing/reward) */}
      {view !== "login" && view !== "settings" && view !== "dashboard" && (
        <>
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div style={{ ...displayFont, fontSize: 22, fontWeight: 600, letterSpacing: 0.2 }}>Trilha do Aprovado</div>
              <div style={{ color: COLORS.muted, fontSize: 12.5, marginTop: 2 }}>Chào, {progress.name}!</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 999, padding: "6px 12px" }}>
                <Flame size={15} color={COLORS.gold} />
                <span style={{ ...monoFont, fontSize: 13 }}>{progress.streakDays} ngày</span>
              </div>
            </div>
          </div>

          <div style={{ position: "relative", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: COLORS.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trophy size={15} color={COLORS.bg} />
                </div>
                <span style={{ ...displayFont, fontWeight: 600, fontSize: 15 }}>Cấp {progress.level}</span>
              </div>
              <span style={{ ...monoFont, fontSize: 12, color: COLORS.muted }}>{progress.xp} / {xpMax} XP</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: COLORS.bg, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${xpPct}%`, background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.gold})`, transition: "width .5s ease" }} />
            </div>
          </div>
        </>
      )}

      {(view === "subject" || view === "flashcards" || view === "quiz" || view === "writing") && (
        <button onClick={() => setView(view === "subject" || view === "writing" ? "dashboard" : "subject")} style={backBtnStyle}>
          <ArrowLeft size={13} /> {view === "subject" || view === "writing" ? "Lộ trình" : subject?.name}
        </button>
      )}

      {/* DASHBOARD */}
      {view === "dashboard" && (
        <div style={{ padding: "18px 16px 28px" }}>
          {/* Nav de ícones (equivalente à sidebar, em formato horizontal pra caber no celular) */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 2 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: LIGHT.gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Trophy size={16} color="#fff" />
            </div>
            {[
              { icon: Home, label: "Trang chủ", active: true, action: () => {} },
              { icon: Layers, label: "Vòng 1", action: () => openDeckSubject(COMBINED_SUBJECT.id) },
              { icon: BookOpen, label: "Vòng 2", action: openWriting },
              { icon: Settings, label: "Cài đặt", action: openSettings },
              { icon: LogOut, label: "Đăng xuất", action: () => setView("login") },
            ].map((it, i) => {
              const Icon = it.icon;
              return (
                <button key={i} onClick={it.action} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flexShrink: 0,
                  background: it.active ? LIGHT.surfaceAlt : "transparent", border: `1px solid ${it.active ? LIGHT.gold : "transparent"}`,
                  borderRadius: 10, padding: "6px 10px", cursor: "pointer",
                }}>
                  <Icon size={15} color={it.active ? LIGHT.gold : LIGHT.muted} />
                  <span style={{ fontSize: 9, color: it.active ? LIGHT.gold : LIGHT.muted, ...bodyFont }}>{it.label}</span>
                </button>
              );
            })}
          </div>

          {/* Saudação + busca */}
          <div style={{ ...displayFont, fontSize: 21, fontWeight: 600, marginBottom: 2 }}>Chào, {progress.name}!</div>
          <div style={{ color: LIGHT.muted, fontSize: 12, marginBottom: 14 }}>hành trình chinh phục kỳ thi công chức</div>
          <div style={{ position: "relative", marginBottom: 18 }}>
            <Search size={14} color={LIGHT.muted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm chuyên đề..."
              style={{ width: "100%", background: LIGHT.surface, border: `1px solid ${LIGHT.border}`, borderRadius: 10, padding: "10px 12px 10px 34px", fontSize: 13, color: LIGHT.text, boxSizing: "border-box", ...bodyFont }}
            />
          </div>

          {filteredSubjects ? (
            <>
              <div style={{ fontSize: 11.5, color: LIGHT.muted, marginBottom: 10 }}>{filteredSubjects.length} kết quả cho "{searchQuery}"</div>
              {filteredSubjects.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.id} onClick={() => (s.type === "writing" ? openWriting() : openDeckSubject(s.id))} style={lightCardStyle}>
                    <div style={lightIconBox}><Icon size={16} color={LIGHT.teal} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...displayFont, fontWeight: 600, fontSize: 13.5 }}>{s.name}</div>
                      <div style={{ color: LIGHT.muted, fontSize: 10.5, marginTop: 2 }}>{s.ref}</div>
                    </div>
                    <ChevronRight size={15} color={LIGHT.muted} />
                  </button>
                );
              })}
            </>
          ) : (
            <>
              {/* Hôm nay (countdown) */}
              <button onClick={openSettings} style={{ ...lightCardBlock, textAlign: "left", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: countdown ? 10 : 0 }}>
                  <Clock size={15} color={LIGHT.gold} />
                  <span style={{ fontSize: 12, color: LIGHT.muted }}>Hôm nay</span>
                </div>
                {countdown === null ? (
                  <div style={{ fontSize: 13, color: LIGHT.muted }}>Chưa đặt ngày thi — nhấn để đặt</div>
                ) : countdown.passed ? (
                  <div style={{ fontSize: 14, color: LIGHT.gold, fontWeight: 600 }}>Đã đến ngày thi! Chúc may mắn 🍀</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 12 }}>
                    {[["Ngày", countdown.days], ["Giờ", countdown.hours], ["Phút", countdown.minutes], ["Giây", countdown.seconds]].map(([label, val]) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ ...monoFont, fontSize: 19, fontWeight: 700, color: LIGHT.text }}>{String(val).padStart(2, "0")}</div>
                        <div style={{ fontSize: 9.5, color: LIGHT.muted }}>{label}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: 16, borderTop: `1px solid ${LIGHT.border}`, paddingTop: 10, marginTop: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: LIGHT.muted }}><Flame size={13} color={LIGHT.gold} /> {progress.streakDays} ngày liên tiếp</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: LIGHT.muted }}><Target size={13} color={LIGHT.teal} /> {DAILY_MISSIONS.filter((m) => missionValue(missionsToday, m) >= m.target).length}/3 nhiệm vụ</div>
                </div>
              </button>

              {/* Biểu đồ hoạt động */}
              <div style={lightCardBlock}>
                <div style={{ fontSize: 12, color: LIGHT.muted, marginBottom: 12 }}>Hoạt động 7 ngày qua</div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 70, gap: 6 }}>
                  {weekData.map((d) => (
                    <div key={d.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                      <div style={{ width: "100%", maxWidth: 20, height: Math.max(4, (d.xp / weekMax) * 54), borderRadius: 4, background: d.isToday ? LIGHT.gold : LIGHT.purple, opacity: d.isToday ? 1 : 0.55 }} />
                      <span style={{ fontSize: 9, color: LIGHT.muted, ...monoFont }}>{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nhiệm vụ hôm nay */}
              <div style={lightCardBlock}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Target size={14} color={LIGHT.teal} />
                    <span style={{ ...displayFont, fontWeight: 600, fontSize: 13 }}>Nhiệm vụ hôm nay</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, ...monoFont, fontSize: 11.5, color: LIGHT.gold }}>
                    <Flame size={12} color={LIGHT.gold} /> {missionStreak}
                  </div>
                </div>
                {DAILY_MISSIONS.map((m) => {
                  const val = missionValue(missionsToday, m);
                  const done = val >= m.target;
                  return (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 12, color: done ? LIGHT.text : LIGHT.muted }}>
                      {done ? <CheckCircle2 size={14} color={LIGHT.teal} /> : <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${LIGHT.border}`, flexShrink: 0 }} />}
                      <span style={{ flex: 1 }}>{m.label}</span>
                      <span style={{ ...monoFont, fontSize: 10.5 }}>{Math.min(val, m.target)}/{m.target}</span>
                    </div>
                  );
                })}
                {missionsAllDone && !missionsToday.claimed && (
                  <button onClick={claimMissionReward} style={{ ...lightBtnStyle(LIGHT.gold), marginTop: 6 }}>
                    Nhận thưởng (+{20 + Math.min(missionStreak, 5) * 4} XP)
                  </button>
                )}
                {missionsAllDone && missionsToday.claimed && (
                  <div style={{ textAlign: "center", fontSize: 11, color: LIGHT.teal, marginTop: 6 }}>Đã nhận thưởng hôm nay ✓</div>
                )}
                <div style={{ fontSize: 10, color: LIGHT.muted, marginTop: 10, lineHeight: 1.5 }}>
                  Bỏ lỡ nhiệm vụ chỉ làm mất chuỗi thưởng 🔥 — không mất XP hay cấp độ đã có.
                </div>
              </div>

              {/* Thống kê */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div style={{ ...lightCardBlock, marginBottom: 0, textAlign: "center" }}>
                  <RingStat pct={vong1Pct} color={LIGHT.teal} label="Tiến độ Vòng 1" sub={`${progress.subjectsEverTouched.filter((id) => STAGE1_SUBJECTS.some((s) => s.id === id)).length}/${STAGE1_SUBJECTS.length} chuyên đề`} />
                </div>
                <div style={{ ...lightCardBlock, marginBottom: 0, textAlign: "center" }}>
                  <RingStat pct={quizAccuracyPct ?? 0} color={LIGHT.purple} label="Độ chính xác" sub={quizAccuracyPct === null ? "Chưa có dữ liệu" : `${progress.quizStats.correct}/${progress.quizStats.total} câu`} showDash={quizAccuracyPct === null} />
                </div>
              </div>
              <div style={{ ...lightCardBlock, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: LIGHT.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trophy size={16} color="#fff" />
                  </div>
                  <div>
                    <div style={{ ...displayFont, fontWeight: 600, fontSize: 14 }}>Cấp {progress.level}</div>
                    <div style={{ fontSize: 10.5, color: LIGHT.muted }}>{progress.xp} / {xpMax} XP · {progress.totalCardsReviewed} thẻ đã ôn</div>
                  </div>
                </div>
                <div style={{ width: 60, height: 6, borderRadius: 999, background: LIGHT.border, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${xpPct}%`, background: LIGHT.gold }} />
                </div>
              </div>

              {/* Chuyên đề */}
              <div style={{ ...displayFont, fontSize: 12.5, fontWeight: 600, margin: "18px 0 8px", color: LIGHT.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Vòng 1 · Kiến thức chung</div>
              <button onClick={() => openDeckSubject(COMBINED_SUBJECT.id)} style={{ ...lightCardStyle, border: `1px solid ${LIGHT.gold}` }}>
                <div style={{ ...lightIconBox, background: "#FBF1DC" }}><Trophy size={16} color={LIGHT.gold} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...displayFont, fontWeight: 600, fontSize: 13.5 }}>{COMBINED_SUBJECT.name}</div>
                  <div style={{ color: LIGHT.muted, fontSize: 10.5, marginTop: 2 }}>{COMBINED_SUBJECT.ref}</div>
                </div>
                <ChevronRight size={15} color={LIGHT.muted} />
              </button>
              <div style={{ fontSize: 10.5, color: LIGHT.muted, margin: "12px 0 8px" }}>Hoặc luyện riêng từng chuyên đề:</div>
              {STAGE1_SUBJECTS.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.id} onClick={() => openDeckSubject(s.id)} style={lightCardStyle}>
                    <div style={lightIconBox}><Icon size={16} color={LIGHT.teal} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...displayFont, fontWeight: 600, fontSize: 13.5 }}>{s.name}</div>
                      <div style={{ color: LIGHT.muted, fontSize: 10.5, marginTop: 2 }}>{s.ref}</div>
                    </div>
                    <ChevronRight size={15} color={LIGHT.muted} />
                  </button>
                );
              })}

              <div style={{ ...displayFont, fontSize: 12.5, fontWeight: 600, margin: "18px 0 8px", color: LIGHT.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Vòng 2 · Kỹ năng ngôn ngữ</div>
              <button onClick={openWriting} style={lightCardStyle}>
                <div style={lightIconBox}><WRITING_SUBJECT.icon size={16} color={LIGHT.teal} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...displayFont, fontWeight: 600, fontSize: 13.5 }}>{WRITING_SUBJECT.name}</div>
                  <div style={{ color: LIGHT.muted, fontSize: 10.5, marginTop: 2 }}>{WRITING_SUBJECT.ref}</div>
                </div>
                <ChevronRight size={15} color={LIGHT.muted} />
              </button>

              {/* Mini calendário */}
              <div style={lightCardBlock}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <CalendarDays size={14} color={LIGHT.teal} />
                  <span style={{ ...displayFont, fontWeight: 600, fontSize: 13 }}>Tháng {calMonth + 1}, {calYear}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
                  {WEEKDAYS_VI.map((w) => <div key={w} style={{ textAlign: "center", fontSize: 9.5, color: LIGHT.muted, ...monoFont }}>{w}</div>)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                  {calCells.map((d, i) => {
                    if (!d) return <div key={i} />;
                    const key = toDateKey(calYear, calMonth, d);
                    const studied = progress.sessionDates.includes(key);
                    const isToday = key === todayKey;
                    return (
                      <div key={i} style={{
                        aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, fontSize: 10.5,
                        ...monoFont, color: isToday ? "#fff" : LIGHT.text,
                        background: isToday ? LIGHT.gold : studied ? "rgba(46,154,118,0.12)" : "transparent",
                        border: studied && !isToday ? `1px solid ${LIGHT.teal}` : "1px solid transparent",
                        fontWeight: isToday ? 700 : 400,
                      }}>{d}</div>
                    );
                  })}
                </div>
              </div>

              {/* Bảng thành tích */}
              <div style={{ ...displayFont, fontSize: 13.5, fontWeight: 600, margin: "20px 0 10px" }}>Bảng thành tích</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {TIPS.map((tip, i) => {
                  const Icon = tip.icon;
                  const unlocked = progress.tipsSeen.includes(i);
                  return (
                    <div key={i} title={unlocked ? tip.title : "Chưa mở khóa"} style={{
                      aspectRatio: "1", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                      background: unlocked ? "#FBF1DC" : LIGHT.surface,
                      border: `1px solid ${unlocked ? LIGHT.gold : LIGHT.border}`, opacity: unlocked ? 1 : 0.45,
                    }}>
                      <Icon size={14} color={unlocked ? LIGHT.gold : LIGHT.muted} />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* SUBJECT (deck) */}
      {view === "subject" && subject && (
        <div>
          <div style={{ ...displayFont, fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{subject.name}</div>
          <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 20 }}>{subject.ref}</div>
          <button onClick={startFlashcards} style={subjectCardStyle}>
            <div style={iconBoxStyle}><Layers size={17} color={COLORS.teal} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ ...displayFont, fontWeight: 600, fontSize: 14.5 }}>Flash card</div>
              <div style={{ color: COLORS.muted, fontSize: 11.5, marginTop: 2 }}>{subject.flashcards.length} thẻ · +5 đến 15 XP/thẻ</div>
            </div>
            <ChevronRight size={16} color={COLORS.muted} />
          </button>
          <button onClick={startQuiz} style={subjectCardStyle}>
            <div style={iconBoxStyle}><BookOpen size={17} color={COLORS.teal} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ ...displayFont, fontWeight: 600, fontSize: 14.5 }}>Đề thi thử</div>
              <div style={{ color: COLORS.muted, fontSize: 11.5, marginTop: 2 }}>{subject.quiz.length} câu hỏi · tối đa +{subject.quiz.length * 15} XP</div>
            </div>
            <ChevronRight size={16} color={COLORS.muted} />
          </button>
        </div>
      )}

      {/* FLASHCARDS */}
      {view === "flashcards" && subject && (
        <div>
          <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 10, ...monoFont }}>thẻ {cardIndex + 1} / {subject.flashcards.length}</div>
          <div onClick={() => setFlipped((f) => !f)} style={{ background: flipped ? COLORS.surfaceAlt : COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, minHeight: 170, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 22, cursor: "pointer", marginBottom: 16 }}>
            <div style={{ ...displayFont, fontSize: flipped ? 15 : 17, fontWeight: 500, lineHeight: 1.5 }}>{flipped ? subject.flashcards[cardIndex].back : subject.flashcards[cardIndex].front}</div>
          </div>
          <div style={{ textAlign: "center", color: COLORS.muted, fontSize: 11.5, marginBottom: 16 }}>{flipped ? "Chạm để xem câu hỏi" : "Chạm vào thẻ để lật"}</div>
          {flipped && (
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => advanceCard(false, subject)} style={btnStyle(COLORS.red)}><XCircle size={15} /> Chưa nhớ</button>
              <button onClick={() => advanceCard(true, subject)} style={btnStyle(COLORS.teal)}><CheckCircle2 size={15} /> Đã nhớ!</button>
            </div>
          )}
        </div>
      )}

      {/* QUIZ */}
      {view === "quiz" && subject && (
        <div>
          <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 10, ...monoFont }}>câu {qIndex + 1} / {subject.quiz.length}</div>
          <div style={{ ...displayFont, fontSize: 15.5, fontWeight: 500, marginBottom: 14, lineHeight: 1.5 }}>{subject.quiz[qIndex].q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {subject.quiz[qIndex].options.map((opt, i) => {
              const isCorrect = i === subject.quiz[qIndex].correct, isSelected = selected === i;
              let border = COLORS.border, bg = "transparent";
              if (selected !== null) {
                if (isCorrect) { border = COLORS.teal; bg = "rgba(62,180,137,0.12)"; }
                else if (isSelected) { border = COLORS.red; bg = "rgba(224,102,122,0.12)"; }
              }
              return (
                <button key={i} disabled={selected !== null} onClick={() => setSelected(i)} style={{ textAlign: "left", padding: "11px 14px", borderRadius: 10, border: `1px solid ${border}`, background: bg, color: COLORS.text, cursor: selected === null ? "pointer" : "default", fontSize: 13.5, ...bodyFont }}>{opt}</button>
              );
            })}
          </div>
          {selected !== null && <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 12, fontSize: 12.5, color: COLORS.muted, marginBottom: 14 }}>{subject.quiz[qIndex].why}</div>}
          {selected !== null && <button onClick={() => advanceQuiz(subject)} style={btnStyle(COLORS.gold, true)}>{qIndex === subject.quiz.length - 1 ? "Xem kết quả" : "Câu tiếp theo"} <ChevronRight size={15} /></button>}
        </div>
      )}

      {/* WRITING (Vòng 2) */}
      {view === "writing" && (
        <div>
          <div style={{ ...displayFont, fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{WRITING_SUBJECT.name}</div>
          <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 18 }}>{WRITING_SUBJECT.ref}</div>

          {!writingStarted && !feedbackText && (
            <div>
              <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16, fontSize: 12.5, color: COLORS.muted, lineHeight: 1.7, marginBottom: 16 }}>
                Bài thi gồm 3 phần: (1) đọc hiểu + tóm tắt + trả lời câu hỏi, (2) dịch trích đoạn sang tiếng Việt, (3) dịch một bài viết sang tiếng Bồ Đào Nha. Thời gian làm bài: {WRITING_SUBJECT.timeLimitMinutes} phút. Khi nộp bài, bạn có thể nhận phản hồi từ AI hoặc tự chấm theo checklist.
              </div>
              <button onClick={() => {
                const startedAt = Date.now();
                const draft = { startedAt, summaryText: "", answers: ["", "", ""], translationVi: "", translationPt: "" };
                setWritingStarted(true); setWritingStartTs(startedAt);
                persist({ ...progress, writingDraft: draft });
              }} style={btnStyle(COLORS.gold, true)}>Bắt đầu làm bài ({WRITING_SUBJECT.timeLimitMinutes} phút)</button>
            </div>
          )}

          {writingStarted && !feedbackText && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", background: COLORS.surface, border: `1px solid ${remainingSeconds === 0 ? COLORS.red : COLORS.gold}`, borderRadius: 12, padding: "10px 14px", marginBottom: 18, ...monoFont, fontSize: 16 }}>
                <Clock size={15} color={remainingSeconds === 0 ? COLORS.red : COLORS.gold} /> {mm}:{ss} {remainingSeconds === 0 && <span style={{ fontSize: 11, color: COLORS.red }}>(Hết giờ)</span>}
              </div>

              <SectionTitle>Phần 1 · Đọc hiểu, tóm tắt & trả lời câu hỏi</SectionTitle>
              <TextBlock>{WRITING_SUBJECT.content.readingText}</TextBlock>
              <label style={labelStyle}>Tóm tắt (250–300 từ)</label>
              <textarea style={textareaStyle} value={summaryText} onChange={(e) => { const v = e.target.value; setSummaryText(v); saveDraftDebounced({ startedAt: writingStartTs, summaryText: v, answers, translationVi, translationPt }); }} placeholder="Viết tóm tắt ở đây..." />
              {WRITING_SUBJECT.content.questions.map((q, i) => (
                <div key={i}>
                  <label style={labelStyle}>{q}</label>
                  <textarea style={{ ...textareaStyle, minHeight: 60 }} value={answers[i]} onChange={(e) => { const next = [...answers]; next[i] = e.target.value; setAnswers(next); saveDraftDebounced({ startedAt: writingStartTs, summaryText, answers: next, translationVi, translationPt }); }} />
                </div>
              ))}

              <SectionTitle>Phần 2 · Dịch sang tiếng Việt</SectionTitle>
              <TextBlock>{WRITING_SUBJECT.content.excerptToVietnamese}</TextBlock>
              <label style={labelStyle}>Bản dịch tiếng Việt</label>
              <textarea style={textareaStyle} value={translationVi} onChange={(e) => { const v = e.target.value; setTranslationVi(v); saveDraftDebounced({ startedAt: writingStartTs, summaryText, answers, translationVi: v, translationPt }); }} placeholder="Viết bản dịch ở đây..." />

              <SectionTitle>Phần 3 · Dịch sang tiếng Bồ Đào Nha</SectionTitle>
              <TextBlock>{WRITING_SUBJECT.content.sourceToPortuguese}</TextBlock>
              <label style={labelStyle}>Bản dịch tiếng Bồ Đào Nha</label>
              <textarea style={textareaStyle} value={translationPt} onChange={(e) => { const v = e.target.value; setTranslationPt(v); saveDraftDebounced({ startedAt: writingStartTs, summaryText, answers, translationVi, translationPt: v }); }} placeholder="Escreva a tradução aqui..." />

              <button onClick={requestFeedback} disabled={feedbackLoading} style={{ ...btnStyle(COLORS.gold, true), opacity: feedbackLoading ? 0.6 : 1 }}>
                {feedbackLoading ? "Đang chấm bài..." : "Nộp bài & nhận phản hồi"}
              </button>
            </div>
          )}

          {feedbackText && (
            <div>
              <div style={{ ...displayFont, fontSize: 14, fontWeight: 600, color: COLORS.gold, marginBottom: 10 }}>
                {feedbackError ? "Không thể chấm bằng AI — tự đánh giá theo checklist:" : "Phản hồi từ AI"}
              </div>
              {!feedbackError && (
                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16, fontSize: 12.5, color: COLORS.text, lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 16 }}>
                  {feedbackText}
                </div>
              )}
              {feedbackError && (
                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16, marginBottom: 16 }}>
                  {CHECKLIST_CRITERIA.map((c, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, marginBottom: 8, cursor: "pointer" }}>
                      <input type="checkbox" checked={!!checklist[i]} onChange={() => setChecklist({ ...checklist, [i]: !checklist[i] })} />
                      {c}
                    </label>
                  ))}
                </div>
              )}
              <button onClick={() => awardXp(40)} style={btnStyle(COLORS.gold, true)}>Hoàn tất buổi luyện tập (+40 XP)</button>
            </div>
          )}
        </div>
      )}

      {/* REWARD */}
      {view === "reward" && rewardTip && (
        <div style={{ textAlign: "center", padding: "8px 4px" }}>
          {leveledUp && <div style={{ ...displayFont, color: COLORS.gold, fontSize: 13, fontWeight: 600, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>✦ Bạn đã lên cấp! ✦</div>}
          <div style={{ ...displayFont, fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Hoàn thành phiên học</div>
          <div style={{ ...monoFont, color: COLORS.teal, fontSize: 16, marginBottom: 20 }}>+{sessionXp} XP</div>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.gold}`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.surfaceAlt, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <rewardTip.icon size={19} color={COLORS.gold} />
            </div>
            <div style={{ ...displayFont, fontSize: 14, fontWeight: 600, marginBottom: 6, color: COLORS.gold }}>Mở khóa phần thưởng: {rewardTip.title}</div>
            <div style={{ fontSize: 12.5, color: COLORS.muted, lineHeight: 1.6 }}>{rewardTip.body}</div>
          </div>
          <button onClick={() => setView("dashboard")} style={btnStyle(COLORS.gold, true)}><ArrowLeft size={15} /> Về lộ trình</button>
        </div>
      )}
    </div>
  );

  function advanceCard(knew, subj) {
    const xp = knew ? 15 : 5;
    if (cardIndex + 1 < subj.flashcards.length) { accumRef.current += xp; setCardIndex((i) => i + 1); setFlipped(false); }
    else { awardXp(xp + accumRef.current + 10, "flashcard", { cardsReviewed: subj.flashcards.length }); accumRef.current = 0; }
  }

  function advanceQuiz(subj) {
    const correct = selected === subj.quiz[qIndex].correct;
    const gained = correct ? 15 : 3;
    if (qIndex + 1 < subj.quiz.length) {
      quizAccumRef.current += gained;
      if (correct) quizCorrectRef.current += 1;
      setQIndex((i) => i + 1); setSelected(null);
    } else {
      const total = quizAccumRef.current + gained;
      const totalCorrect = quizCorrectRef.current + (correct ? 1 : 0);
      quizAccumRef.current = 0; quizCorrectRef.current = 0;
      awardXp(total, "quiz", { quizCorrect: totalCorrect, quizTotal: subj.quiz.length });
    }
  }

  async function requestFeedback() {
    // Nota: chamada direta à API da Anthropic. Só funciona dentro do preview
    // de artifacts do Claude.ai (que injeta a autenticação). Rodando local via
    // `npm run dev`, essa chamada falha e o app cai no checklist de autoavaliação.
    setFeedbackLoading(true);
    setFeedbackError(false);
    const prompt = `Bạn là giám khảo chấm bài thi viết tiếng Bồ Đào Nha (vòng 2) cho kỳ thi công chức ngoại giao Việt Nam.
Tiêu chí: nội dung đầy đủ và đúng trọng tâm, từ ngữ chính xác (đặc biệt thuật ngữ đối ngoại), ngữ pháp, văn phong, chính tả, không chép nguyên văn, không sai chức danh/tên cơ quan. Thang điểm: 35 điểm, tối thiểu 17,5 để đạt.

Bài làm của thí sinh:
--- Phần 1: Tóm tắt ---
${summaryText || "(chưa trả lời)"}
--- Phần 1: Trả lời câu hỏi ---
${answers.map((a, i) => `${i + 1}. ${a || "(chưa trả lời)"}`).join("\n")}
--- Phần 2: Dịch sang tiếng Việt ---
${translationVi || "(chưa trả lời)"}
--- Phần 3: Dịch sang tiếng Bồ Đào Nha ---
${translationPt || "(chưa trả lời)"}

Hãy nhận xét ngắn gọn từng phần bằng tiếng Việt, nêu điểm mạnh, điểm cần cải thiện, và ước tính điểm mỗi phần cùng tổng điểm ước tính trên 35. Ghi rõ đây chỉ là ước tính tham khảo.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await response.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
      if (!text) throw new Error("empty");
      setFeedbackText(text);
      persist({ ...progressRef.current, writingDraft: null });
    } catch (e) {
      console.error("Lỗi khi lấy phản hồi AI:", e);
      setFeedbackError(true);
      setFeedbackText(" ");
      persist({ ...progressRef.current, writingDraft: null });
    } finally {
      setFeedbackLoading(false);
    }
  }
}

function SectionTitle({ children }) {
  return <div style={{ ...displayFont, fontSize: 13.5, fontWeight: 600, margin: "18px 0 8px", color: COLORS.gold }}>{children}</div>;
}
function TextBlock({ children }) {
  return <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 14, fontSize: 12, color: COLORS.muted, lineHeight: 1.6, marginBottom: 10 }}>{children}</div>;
}
function RingStat({ pct, color, label, sub, showDash }) {
  return (
    <>
      <div style={{ width: 54, height: 54, borderRadius: "50%", margin: "0 auto 8px", background: `conic-gradient(${color} ${pct * 3.6}deg, ${LIGHT.border} 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: LIGHT.surface, display: "flex", alignItems: "center", justifyContent: "center", ...monoFont, fontSize: 11, fontWeight: 700, color: LIGHT.text }}>
          {showDash ? "--" : `${pct}%`}
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: LIGHT.text }}>{label}</div>
      <div style={{ fontSize: 9.5, color: LIGHT.muted, marginTop: 2 }}>{sub}</div>
    </>
  );
}

const labelStyle = { fontSize: 11.5, color: COLORS.muted, display: "block", marginBottom: 6, marginTop: 4 };
const backBtnStyle = { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: COLORS.muted, fontSize: 12.5, cursor: "pointer", padding: 0, marginBottom: 16, ...bodyFont };
const subjectCardStyle = { width: "100%", display: "flex", alignItems: "center", gap: 14, textAlign: "left", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer", color: COLORS.text };
const iconBoxStyle = { width: 38, height: 38, borderRadius: 10, background: COLORS.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };

const lightCardStyle = { width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left", background: LIGHT.surface, border: `1px solid ${LIGHT.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 9, cursor: "pointer", color: LIGHT.text, boxShadow: "0 1px 2px rgba(20,23,50,0.04)" };
const lightIconBox = { width: 34, height: 34, borderRadius: 9, background: LIGHT.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const lightCardBlock = { background: LIGHT.surface, border: `1px solid ${LIGHT.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 14, boxShadow: "0 1px 2px rgba(20,23,50,0.04)" };
function lightBtnStyle(color) {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 16px", borderRadius: 10, border: "none", background: color, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif" };
}

function btnStyle(color, full) {
  return { flex: full ? "unset" : 1, width: full ? "100%" : "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 16px", borderRadius: 10, border: `1px solid ${color}`, background: "transparent", color, fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif" };
}
