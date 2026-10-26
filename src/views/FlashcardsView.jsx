import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { COLORS, displayFont, monoFont } from "../theme.js";
import { btnStyle } from "../styles.js";

const XP_KNEW = 15;
const XP_FORGOT = 5;
const XP_DECK_BONUS = 10;

export default function FlashcardsView({ subject, onComplete }) {
  const cards = subject.flashcards;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [earned, setEarned] = useState(0);
  const card = cards[index];

  const advance = (knew) => {
    const xp = earned + (knew ? XP_KNEW : XP_FORGOT);
    if (index + 1 < cards.length) {
      setEarned(xp);
      setIndex(index + 1);
      setFlipped(false);
    } else {
      onComplete(xp + XP_DECK_BONUS, { kind: "flashcard", cardsReviewed: cards.length });
    }
  };

  return (
    <div>
      <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 10, ...monoFont }}>thẻ {index + 1} / {cards.length}</div>
      <div onClick={() => setFlipped((f) => !f)} style={{ background: flipped ? COLORS.surfaceAlt : COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, minHeight: 170, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 22, cursor: "pointer", marginBottom: 16 }}>
        <div style={{ ...displayFont, fontSize: flipped ? 15 : 17, fontWeight: 500, lineHeight: 1.5 }}>{flipped ? card.back : card.front}</div>
      </div>
      <div style={{ textAlign: "center", color: COLORS.muted, fontSize: 13, marginBottom: 16 }}>{flipped ? "Chạm để xem câu hỏi" : "Chạm vào thẻ để lật"}</div>
      {flipped && (
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => advance(false)} style={btnStyle(COLORS.red)}><XCircle size={15} /> Chưa nhớ</button>
          <button onClick={() => advance(true)} style={btnStyle(COLORS.teal)}><CheckCircle2 size={15} /> Đã nhớ!</button>
        </div>
      )}
    </div>
  );
}
