import { useState } from "react";
import { BookOpen, Home, Layers, ListChecks, LogOut, Mic, Search, Settings, Shuffle, Trophy } from "lucide-react";
import { LIGHT, bodyFont, displayFont } from "../../theme.js";
import { lightPagePadding } from "../../styles.js";
import { SubjectRow } from "../../components/ui.jsx";
import { COMBINED_SUBJECT, DECK_SUBJECTS, WRITING_SUBJECT } from "../../data/subjects.js";
import OverviewColumn from "./OverviewColumn.jsx";
import SubjectsColumn from "./SubjectsColumn.jsx";

const SEARCHABLE_SUBJECTS = [...DECK_SUBJECTS, WRITING_SUBJECT];

// actions: { navigate, openDeck, openWriting, openInterview, openSettings, claimMissions }
export default function DashboardView({ progress, actions }) {
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();
  const openSubject = (s) => (s.type === "writing" ? actions.openWriting() : actions.openDeck(s.id));

  const navItems = [
    { icon: Home, label: "Trang chủ", active: true },
    { icon: ListChecks, label: "Tiến độ", action: () => actions.navigate("plan") },
    { icon: Layers, label: "Vòng 1", action: () => actions.openDeck(COMBINED_SUBJECT.id) },
    { icon: BookOpen, label: "Vòng 2", action: actions.openWriting },
    { icon: Mic, label: "Phỏng vấn", action: actions.openInterview },
    { icon: Shuffle, label: "Đổi kỳ thi", action: () => actions.navigate("track") },
    { icon: Settings, label: "Cài đặt", action: actions.openSettings },
    { icon: LogOut, label: "Đăng xuất", action: () => actions.navigate("login") },
  ];

  return (
    <div style={lightPagePadding}>
      <DashboardNav items={navItems} />

      <div style={{ ...displayFont, fontSize: 24, fontWeight: 600, marginBottom: 2 }}>Chào, {progress.name}!</div>
      <div style={{ color: LIGHT.muted, fontSize: 14, marginBottom: 14 }}>hành trình chinh phục kỳ thi công chức</div>
      <div style={{ position: "relative", marginBottom: 18 }}>
        <Search size={14} color={LIGHT.muted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
        <input
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm chuyên đề..."
          style={{ width: "100%", background: LIGHT.surface, border: `1px solid ${LIGHT.border}`, borderRadius: 10, padding: "10px 12px 10px 34px", fontSize: 15, color: LIGHT.text, boxSizing: "border-box", ...bodyFont }}
        />
      </div>

      {query ? (
        <SearchResults query={searchQuery} results={SEARCHABLE_SUBJECTS.filter((s) => s.name.toLowerCase().includes(query))} onOpen={openSubject} />
      ) : (
        <div className="tda-dash-grid">
          <OverviewColumn progress={progress} actions={actions} />
          <SubjectsColumn progress={progress} actions={actions} />
        </div>
      )}
    </div>
  );
}

// Nav de ícones (equivalente à sidebar, em formato horizontal pra caber no celular).
function DashboardNav({ items }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 2 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: LIGHT.gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Trophy size={16} color="#fff" />
      </div>
      {items.map(({ icon: Icon, label, active, action }) => {
        const color = active ? LIGHT.gold : LIGHT.muted;
        return (
          <button key={label} onClick={action} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flexShrink: 0,
            background: active ? LIGHT.surfaceAlt : "transparent", border: `1px solid ${active ? LIGHT.gold : "transparent"}`,
            borderRadius: 10, padding: "6px 10px", cursor: "pointer",
          }}>
            <Icon size={15} color={color} />
            <span style={{ fontSize: 10.5, color, ...bodyFont }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SearchResults({ query, results, onOpen }) {
  return (
    <>
      <div style={{ fontSize: 13, color: LIGHT.muted, marginBottom: 10 }}>{results.length} kết quả cho "{query}"</div>
      {results.map((s) => <SubjectRow key={s.id} subject={s} onClick={() => onOpen(s)} />)}
    </>
  );
}
