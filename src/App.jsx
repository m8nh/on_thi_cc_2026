import { useEffect, useState } from "react";
import { COLORS, FONT_IMPORT, LIGHT, RESPONSIVE_CSS, bodyFont } from "./theme.js";
import { BackButton } from "./components/ui.jsx";
import DarkHeader from "./components/DarkHeader.jsx";
import { INTERVIEW_SUBJECT_ID, WRITING_SUBJECT, findDeckSubject } from "./data/subjects.js";
import { applySessionXp, loadProgress, pendingMissionReward, recordMissionSession, rolloverMissions, saveProgress, touchSubject } from "./lib/progress.js";
import { markStepStarted } from "./lib/studyPlan.js";
import LoginView from "./views/LoginView.jsx";
import SettingsView from "./views/SettingsView.jsx";
import TrackView from "./views/TrackView.jsx";
import HaiQuanView from "./views/HaiQuanView.jsx";
import DashboardView from "./views/dashboard/DashboardView.jsx";
import PlanView from "./views/PlanView.jsx";
import InterviewView from "./views/interview/InterviewView.jsx";
import SubjectView from "./views/SubjectView.jsx";
import FlashcardsView from "./views/FlashcardsView.jsx";
import QuizView from "./views/QuizView.jsx";
import WritingView from "./views/WritingView.jsx";
import RewardView from "./views/RewardView.jsx";
import KtcSubjectView from "./views/ktc/KtcSubjectView.jsx";
import KtcQuizView from "./views/ktc/KtcQuizView.jsx";
import KtcKeyView from "./views/ktc/KtcKeyView.jsx";
import KtcGocView from "./views/ktc/KtcGocView.jsx";
import { KTC_MOCK_ID, MOCK_EXAM, findKtcDoc } from "./data/ktc/vanBan.js";
import { buildMockExam, cardsOf, loadKeyCards, pickCards, pickRound, recordAnswers, recordCards } from "./lib/ktcBank.js";

// Telas no tema claro (largas); as demais usam o tema escuro centralizado.
const LIGHT_VIEWS = new Set(["track", "hai-quan", "dashboard", "plan", "interview"]);
// Telas escuras de estudo, que mostram o cabeçalho com nível/XP.
const STUDY_VIEWS = new Set([
  "subject", "flashcards", "quiz", "writing", "reward",
  "ktc-subject", "ktc-quiz", "ktc-cards", "ktc-loading", "ktc-key", "ktc-goc",
]);

const INITIAL_INTERVIEW_UI = { tab: "ban-do", filter: "all", deck: "all", prepMin: 5, talkMin: 5 };

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [view, setView] = useState(() => (progress.name ? "track" : "login"));
  const [subjectId, setSubjectId] = useState(null);
  const [reward, setReward] = useState(null); // { xp, leveledUp, tip, returnTo }
  const [interviewUi, setInterviewUi] = useState(INITIAL_INTERVIEW_UI);
  const [ktcSession, setKtcSession] = useState(null); // { mode, items | cards }

  useEffect(() => { saveProgress(progress); }, [progress]);

  const subject = findDeckSubject(subjectId);
  const ktcDoc = findKtcDoc(subjectId);

  /* ---------- Navegação ---------- */

  const openDeck = (id) => {
    setProgress((p) => touchSubject(p, id));
    if (id === KTC_MOCK_ID) { startMockExam(); return; }
    setSubjectId(id);
    setView(findKtcDoc(id) ? "ktc-subject" : "subject");
  };

  /* ---------- Vòng 1: ngân hàng câu hỏi ---------- */

  const startMockExam = async () => {
    setSubjectId(null);
    setView("ktc-loading");
    const items = await buildMockExam();
    if (!items.length) { setView("dashboard"); return; } // ngân hàng câu hỏi ausente neste build
    setKtcSession({ mode: "exam", items });
    setView("ktc-quiz");
  };
  const startQuizRound = (items) => {
    if (!items.length) return;
    setKtcSession({ mode: "practice", items });
    setView("ktc-quiz");
  };
  const startCardRound = (allCards) => {
    const cards = pickCards(allCards, progress.cardStats);
    if (!cards.length) return;
    setKtcSession({ mode: "cards", cards });
    setView("ktc-cards");
  };
  const startKtc = async ({ kind, items, onlyWrong, section }) => {
    switch (kind) {
      case "key": setView("ktc-key"); break;
      case "goc": setView("ktc-goc"); break;
      case "keycards": startCardRound(await loadKeyCards(ktcDoc.id)); break;
      case "cards": startCardRound(cardsOf(items)); break;
      default: startQuizRound(pickRound(items, progress.qStats, { onlyWrong, section }));
    }
  };
  const finishKtcQuiz = (results, xp, meta) => {
    const isExam = ktcSession.mode === "exam";
    const passed = isExam && meta.quizTotal > 0 && meta.quizCorrect / meta.quizTotal >= MOCK_EXAM.passRatio;
    const patch = { qStats: recordAnswers(progress.qStats, results), mockExamsPassed: (progress.mockExamsPassed || 0) + (passed ? 1 : 0) };
    awardXp(xp, { kind: "quiz", ...meta, patch }, isExam ? "dashboard" : "ktc-subject");
  };
  const finishKtcCards = (xp, meta) => {
    awardXp(xp, { ...meta, patch: { cardStats: recordCards(progress.cardStats, meta.cardResults) } }, "ktc-subject");
  };
  const openWriting = () => {
    setProgress((p) => touchSubject(p, WRITING_SUBJECT.id));
    setView("writing");
  };
  const openInterview = () => {
    setProgress((p) => ({ ...p, planStatus: markStepStarted(p.planStatus, INTERVIEW_SUBJECT_ID) }));
    setView("interview");
  };
  const openStep = (id) => {
    if (id === INTERVIEW_SUBJECT_ID) openInterview();
    else if (id === WRITING_SUBJECT.id) openWriting();
    else openDeck(id);
  };
  const saveProfile = (profile, nextView) => {
    setProgress((p) => ({ ...p, ...profile }));
    setView(nextView);
  };
  const pickTrack = (track) => {
    setProgress((p) => ({ ...p, track }));
    setView(track === "bng" ? "dashboard" : "hai-quan");
  };

  /* ---------- XP e recompensa ---------- */

  const finishSession = (p, amount, returnTo) => {
    const { next, didLevelUp, tip } = applySessionXp(p, amount);
    setProgress(next);
    setReward({ xp: amount, leveledUp: didLevelUp, tip, returnTo });
    setView("reward");
  };

  // kind: flashcard | quiz | interview | writing — conta para as missões diárias e estatísticas.
  const awardXp = (amount, { kind, cardsReviewed = 0, quizCorrect = 0, quizTotal = 0, patch } = {}, returnTo = "dashboard") => {
    const { missionProgress: mp, missionStreak } = rolloverMissions(progress);
    const missionProgress = recordMissionSession(mp, { kind, cardsReviewed, quizCorrect, quizTotal, xp: amount });
    const p = { ...progress, ...patch, missionProgress, missionStreak };
    if (kind === "writing") p.writingsDone = (p.writingsDone || 0) + 1;
    finishSession({
      ...p,
      totalCardsReviewed: p.totalCardsReviewed + cardsReviewed,
      quizStats: quizTotal ? { correct: p.quizStats.correct + quizCorrect, total: p.quizStats.total + quizTotal } : p.quizStats,
    }, amount, returnTo);
  };

  // Recebe o XP de todas as missões concluídas e ainda não resgatadas.
  const claimMissionReward = () => {
    const { missionProgress, missionStreak } = rolloverMissions(progress);
    const { pending, xp, reachesStreak } = pendingMissionReward(missionProgress, missionStreak);
    if (!pending.length) return;
    finishSession({
      ...progress,
      missionProgress: {
        ...missionProgress,
        claimedIds: [...missionProgress.claimedIds, ...pending.map((m) => m.id)],
        streakCounted: missionProgress.streakCounted || reachesStreak,
      },
      missionStreak: missionStreak + (reachesStreak ? 1 : 0),
      bestMissionStreak: Math.max(progress.bestMissionStreak || 0, missionStreak + (reachesStreak ? 1 : 0)),
    }, xp, "dashboard");
  };

  /* ---------- Render ---------- */

  const dashboardActions = {
    navigate: setView, openDeck, openWriting, openInterview,
    openSettings: () => setView("settings"),
    claimMissions: claimMissionReward,
  };

  const renderView = () => {
    switch (view) {
      case "login":
        return <LoginView progress={progress} onSubmit={(profile) => saveProfile(profile, "track")} />;
      case "settings":
        return <SettingsView progress={progress} onBack={() => setView("dashboard")} onSubmit={(profile) => saveProfile(profile, "dashboard")} />;
      case "track":
        return <TrackView progress={progress} onPick={pickTrack} onLogout={() => setView("login")} />;
      case "hai-quan":
        return <HaiQuanView onBack={() => setView("track")} />;
      case "dashboard":
        return <DashboardView progress={progress} actions={dashboardActions} />;
      case "plan":
        return <PlanView progress={progress} setProgress={setProgress} onOpenStep={openStep} onBack={() => setView("dashboard")} />;
      case "interview":
        return (
          <InterviewView
            progress={progress}
            setProgress={setProgress}
            ui={interviewUi}
            setUi={(patch) => setInterviewUi((u) => ({ ...u, ...patch }))}
            onComplete={(xp, meta) => awardXp(xp, meta, "interview")}
            onBack={() => setView("dashboard")}
          />
        );
      case "subject":
        return subject && <SubjectView subject={subject} onStartFlashcards={() => setView("flashcards")} onStartQuiz={() => setView("quiz")} />;
      case "ktc-subject":
        return ktcDoc && <KtcSubjectView doc={ktcDoc} progress={progress} onStart={startKtc} />;
      case "ktc-key":
        return ktcDoc && <KtcKeyView files={ktcDoc.keyFiles} />;
      case "ktc-goc":
        return ktcDoc && <KtcGocView doc={ktcDoc} />;
      case "ktc-loading":
        return <div style={{ color: COLORS.muted }}>Đang chuẩn bị đề thi…</div>;
      case "ktc-quiz":
        return ktcSession && (
          <KtcQuizView
            key={ktcSession.items[0].id}
            items={ktcSession.items}
            mode={ktcSession.mode}
            minutes={MOCK_EXAM.minutes}
            passRatio={MOCK_EXAM.passRatio}
            onFinish={finishKtcQuiz}
          />
        );
      case "ktc-cards":
        return ktcSession && <FlashcardsView cards={ktcSession.cards} onComplete={finishKtcCards} />;
      case "flashcards":
        return subject && <FlashcardsView subject={subject} onComplete={awardXp} />;
      case "quiz":
        return subject && <QuizView subject={subject} onComplete={awardXp} />;
      case "writing":
        return <WritingView progress={progress} setProgress={setProgress} onComplete={awardXp} />;
      case "reward":
        return reward && <RewardView reward={reward} onContinue={() => setView(reward.returnTo)} />;
      default:
        return null;
    }
  };

  const isLight = LIGHT_VIEWS.has(view);
  const backTo = {
    subject: ["dashboard", "Lộ trình"],
    writing: ["dashboard", "Lộ trình"],
    flashcards: ["subject", subject?.name],
    quiz: ["subject", subject?.name],
    "ktc-subject": ["dashboard", "Lộ trình"],
    "ktc-quiz": ktcDoc ? ["ktc-subject", ktcDoc.name] : ["dashboard", "Thoát bài thi"],
    "ktc-cards": ["ktc-subject", ktcDoc?.name],
    "ktc-key": ["ktc-subject", ktcDoc?.name],
    "ktc-goc": ["ktc-subject", ktcDoc?.name],
  }[view];

  return (
    <div
      className="tda-root tda-wide"
      style={{
        ...bodyFont,
        background: LIGHT.bg,
        color: LIGHT.text,
        borderRadius: 20,
        padding: 0,
        maxWidth: 1440,
        margin: "0 auto", minHeight: "100vh", boxSizing: "border-box", position: "relative", overflow: "hidden",
      }}
    >
      <style>{FONT_IMPORT + RESPONSIVE_CSS}</style>
      {isLight ? renderView() : (
        <div style={{ padding: "18px 16px 28px" }}>
          {STUDY_VIEWS.has(view) && <DarkHeader progress={progress} />}
          {backTo && <BackButton onClick={() => setView(backTo[0])}>{backTo[1]}</BackButton>}
          {renderView()}
        </div>
      )}
    </div>
  );
}

function BackgroundRings() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 560 560" style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none" }}>
      {[80, 140, 210, 290, 370, 450].map((r) => <circle key={r} cx="480" cy="60" r={r} fill="none" stroke={COLORS.gold} strokeWidth="1" />)}
    </svg>
  );
}
