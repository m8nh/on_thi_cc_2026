import { useEffect, useState } from "react";
import { COLORS, FONT_IMPORT, LIGHT, RESPONSIVE_CSS, bodyFont } from "./theme.js";
import { BackButton } from "./components/ui.jsx";
import DarkHeader from "./components/DarkHeader.jsx";
import { INTERVIEW_SUBJECT_ID, WRITING_SUBJECT, findDeckSubject } from "./data/subjects.js";
import { allMissionsDone, applySessionXp, loadProgress, missionBonus, rolloverMissions, saveProgress, touchSubject } from "./lib/progress.js";
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

// Telas no tema claro (largas); as demais usam o tema escuro centralizado.
const LIGHT_VIEWS = new Set(["track", "hai-quan", "dashboard", "plan", "interview"]);
// Telas escuras de estudo, que mostram o cabeçalho com nível/XP.
const STUDY_VIEWS = new Set(["subject", "flashcards", "quiz", "writing", "reward"]);

const INITIAL_INTERVIEW_UI = { tab: "ban-do", filter: "all", deck: "all", prepMin: 5, talkMin: 5 };

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [view, setView] = useState(() => (progress.name ? "track" : "login"));
  const [subjectId, setSubjectId] = useState(null);
  const [reward, setReward] = useState(null); // { xp, leveledUp, tip, returnTo }
  const [interviewUi, setInterviewUi] = useState(INITIAL_INTERVIEW_UI);

  useEffect(() => { saveProgress(progress); }, [progress]);

  const subject = findDeckSubject(subjectId);

  /* ---------- Navegação ---------- */

  const openDeck = (id) => {
    setProgress((p) => touchSubject(p, id));
    setSubjectId(id);
    setView("subject");
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

  // kind: flashcard | quiz | interview — conta para as missões diárias e estatísticas.
  const awardXp = (amount, { kind, cardsReviewed = 0, quizCorrect = 0, quizTotal = 0, patch } = {}, returnTo = "dashboard") => {
    const { missionProgress: mp, missionStreak } = rolloverMissions(progress);
    const missionProgress = {
      ...mp,
      flashcardDecks: mp.flashcardDecks + (kind === "flashcard" ? 1 : 0),
      quizzes: mp.quizzes + (kind === "quiz" ? 1 : 0),
    };
    const p = { ...progress, ...patch, missionProgress, missionStreak };
    finishSession({
      ...p,
      totalCardsReviewed: p.totalCardsReviewed + cardsReviewed,
      quizStats: quizTotal ? { correct: p.quizStats.correct + quizCorrect, total: p.quizStats.total + quizTotal } : p.quizStats,
    }, amount, returnTo);
  };

  const claimMissionReward = () => {
    const { missionProgress, missionStreak } = rolloverMissions(progress);
    if (!allMissionsDone(missionProgress) || missionProgress.claimed) return;
    finishSession({
      ...progress,
      missionProgress: { ...missionProgress, claimed: true },
      missionStreak: missionStreak + 1,
    }, missionBonus(missionStreak), "dashboard");
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
  }[view];

  return (
    <div
      className={isLight ? "tda-root tda-wide" : "tda-root"}
      style={{
        ...bodyFont,
        background: isLight ? LIGHT.bg : COLORS.bg,
        color: isLight ? LIGHT.text : COLORS.text,
        borderRadius: 20,
        padding: isLight ? 0 : "28px 28px 32px",
        maxWidth: isLight ? 1440 : 900,
        margin: "0 auto", minHeight: "100vh", boxSizing: "border-box", position: "relative", overflow: "hidden",
      }}
    >
      <style>{FONT_IMPORT + RESPONSIVE_CSS}</style>
      {!isLight && <BackgroundRings />}
      {STUDY_VIEWS.has(view) && <DarkHeader progress={progress} />}
      {backTo && <BackButton onClick={() => setView(backTo[0])}>{backTo[1]}</BackButton>}
      {renderView()}
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
