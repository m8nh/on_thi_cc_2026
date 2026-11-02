import { useEffect, useState } from "react";
import { COLORS, FONT_IMPORT, LIGHT, RESPONSIVE_CSS, bodyFont } from "./theme.js";
import { BackButton } from "./components/ui.jsx";
import { lightPagePadding } from "./styles.js";
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
import TemasView from "./views/vong2/TemasView.jsx";
import DichView from "./views/vong2/DichView.jsx";
import PhongVanView from "./views/vong2/PhongVanView.jsx";
import DeCuongView from "./views/vong2/DeCuongView.jsx";
import { PRACTICE_XP } from "./data/vong2.js";
import { todayKey } from "./lib/dates.js";

// Telas que montam o próprio layout (padding, cabeçalho, botão voltar).
const SELF_LAYOUT_VIEWS = new Set(["track", "hai-quan", "dashboard", "plan", "interview"]);
// Telas de estudo, que mostram o cabeçalho com nível/XP.
const STUDY_VIEWS = new Set([
  "subject", "flashcards", "quiz", "writing", "reward",
  "ktc-subject", "ktc-quiz", "ktc-cards", "ktc-loading", "ktc-key", "ktc-goc",
  "v2-temas", "v2-dich", "v2-phongvan", "v2-decuong",
]);

const INITIAL_INTERVIEW_UI = { tab: "ban-do", filter: "all", deck: "all", prepMin: 5, talkMin: 5 };

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [view, setView] = useState(() => (progress.name ? "track" : "login"));
  const [subjectId, setSubjectId] = useState(null);
  const [reward, setReward] = useState(null); // { xp, leveledUp, tip, returnTo }
  const [interviewUi, setInterviewUi] = useState(INITIAL_INTERVIEW_UI);
  const [ktcSession, setKtcSession] = useState(null); // { mode, items | cards }
  const [writingTopic, setWritingTopic] = useState(null); // đề do banco Vòng 2 aberto na redação

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
    const patch = { qStats: recordAnswers(progress.qStats, results), mockExamsPassed: progress.mockExamsPassed + (passed ? 1 : 0) };
    awardXp(xp, { kind: "quiz", ...meta, patch }, isExam ? "dashboard" : "ktc-subject");
  };
  const finishKtcCards = (xp, meta) => {
    awardXp(xp, { ...meta, patch: { cardStats: recordCards(progress.cardStats, meta.cardResults) } }, "ktc-subject");
  };
  const openWriting = () => {
    setProgress((p) => touchSubject(p, WRITING_SUBJECT.id));
    setWritingTopic(null);
    setView("writing");
  };
  const openTopicWriting = (topic) => {
    setProgress((p) => touchSubject(p, WRITING_SUBJECT.id));
    setWritingTopic(topic);
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
    finishSession({
      ...p,
      writingsDone: p.writingsDone + (kind === "writing" ? 1 : 0),
      totalCardsReviewed: p.totalCardsReviewed + cardsReviewed,
      quizStats: quizTotal ? { correct: p.quizStats.correct + quizCorrect, total: p.quizStats.total + quizTotal } : p.quizStats,
    }, amount, returnTo);
  };

  // Recebe o XP de todas as missões concluídas e ainda não resgatadas.
  const claimMissionReward = () => {
    const { missionProgress, missionStreak } = rolloverMissions(progress);
    const { pending, xp, reachesStreak } = pendingMissionReward(missionProgress, missionStreak);
    if (!pending.length) return;
    const nextStreak = missionStreak + (reachesStreak ? 1 : 0);
    finishSession({
      ...progress,
      missionProgress: {
        ...missionProgress,
        claimedIds: [...missionProgress.claimedIds, ...pending.map((m) => m.id)],
        streakCounted: missionProgress.streakCounted || reachesStreak,
      },
      missionStreak: nextStreak,
      bestMissionStreak: Math.max(progress.bestMissionStreak, nextStreak),
    }, xp, "dashboard");
  };

  // "Đã luyện" de um cartão do Vòng 2: conta sem sair do baralho; XP só na 1ª vez do dia por cartão.
  const practiceCard = (id) => {
    const today = todayKey();
    const log = progress.v2Practice[id];
    const v2Practice = { ...progress.v2Practice, [id]: { count: (log?.count || 0) + 1, last: today } };
    if (log?.last === today) { setProgress({ ...progress, v2Practice }); return; }
    const { missionProgress: mp, missionStreak } = rolloverMissions(progress);
    const missionProgress = recordMissionSession(mp, { kind: "interview", cardsReviewed: 1, xp: PRACTICE_XP });
    setProgress(applySessionXp({
      ...progress, v2Practice, missionProgress, missionStreak,
      totalCardsReviewed: progress.totalCardsReviewed + 1,
    }, PRACTICE_XP).next);
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
        return (
          <WritingView
            key={writingTopic?.id || "exam"}
            topic={writingTopic}
            progress={progress}
            setProgress={setProgress}
            onComplete={(xp, meta) => awardXp(xp, meta, writingTopic ? "v2-temas" : "dashboard")}
          />
        );
      case "v2-temas":
        return <TemasView topicDrafts={progress.topicDrafts} onWrite={openTopicWriting} />;
      case "v2-dich":
        return <DichView drafts={progress.translationDrafts} setProgress={setProgress} />;
      case "v2-phongvan":
        return <PhongVanView practice={progress.v2Practice} onPractice={practiceCard} />;
      case "v2-decuong":
        return <DeCuongView done={progress.deCuongDone} setProgress={setProgress} />;
      case "reward":
        return reward && <RewardView reward={reward} onContinue={() => setView(reward.returnTo)} />;
      default:
        return null;
    }
  };

  const backTo = {
    subject: ["dashboard", "Lộ trình"],
    writing: writingTopic ? ["v2-temas", "Đề luận & Tình huống"] : ["dashboard", "Lộ trình"],
    "v2-temas": ["dashboard", "Trang chủ"],
    "v2-dich": ["dashboard", "Trang chủ"],
    "v2-phongvan": ["dashboard", "Trang chủ"],
    "v2-decuong": ["dashboard", "Trang chủ"],
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
        ...bodyFont, background: LIGHT.bg, color: LIGHT.text, borderRadius: 20, maxWidth: 1440,
        margin: "0 auto", minHeight: "100vh", boxSizing: "border-box", position: "relative", overflow: "hidden",
      }}
    >
      <style>{FONT_IMPORT + RESPONSIVE_CSS}</style>
      {SELF_LAYOUT_VIEWS.has(view) ? renderView() : (
        <div style={lightPagePadding}>
          {STUDY_VIEWS.has(view) && <DarkHeader progress={progress} />}
          {backTo && <BackButton onClick={() => setView(backTo[0])}>{backTo[1]}</BackButton>}
          {renderView()}
        </div>
      )}
    </div>
  );
}

