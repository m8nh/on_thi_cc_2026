import { useState } from "react";
import { Layers, Shuffle, Trophy } from "lucide-react";
import { LIGHT, displayFont, monoFont } from "../../theme.js";
import { lightBtnStyle, lightCardBlock, plainBtn, selectStyle } from "../../styles.js";
import { ProgressBar, StatGrid } from "../../components/ui.jsx";
import { INTERVIEW_CARDS, INTERVIEW_GROUPS } from "../../data/interviewData.js";
import { FC_SESSION_SIZE, LEARNED_BOX, cardBox, flashSessionXp, gradeCard, isCardDue } from "../../lib/interview.js";
import { shuffle } from "../../lib/shuffle.js";

const MAX_REPEATS_PER_SESSION = 3;

// cards: estado Leitner salvo { [id]: { box, due } }; deck: all | doi-ngoai | ho-so | A..H
export default function FlashcardTab({ cards, deck, setDeck, saveIv, onComplete }) {
  const [queue, setQueue] = useState(null);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ known: 0, total: 0 });

  const deckCards = INTERVIEW_CARDS.filter((c) => deck === "all" || c.deck === deck || c.group === deck);
  const dueCount = deckCards.filter((c) => isCardDue(cards, c.id)).length;
  const current = queue && idx < queue.length ? INTERVIEW_CARDS.find((c) => c.id === queue[idx]) : null;

  const start = (onlyDue) => {
    const pool = onlyDue ? deckCards.filter((c) => isCardDue(cards, c.id)) : deckCards;
    setQueue(shuffle(pool).slice(0, FC_SESSION_SIZE).map((c) => c.id));
    setIdx(0); setFlipped(false); setStats({ known: 0, total: 0 });
  };

  const answer = (grade) => {
    const id = queue[idx];
    saveIv({ cards: { ...cards, [id]: gradeCard(cards[id], grade) } });
    // Thẻ quên quay lại cuối hàng (tối đa 3 lần trong một buổi).
    if (grade === "again" && queue.filter((x) => x === id).length < MAX_REPEATS_PER_SESSION) setQueue([...queue, id]);
    setStats((st) => ({ known: st.known + (grade === "know" ? 1 : 0), total: st.total + 1 }));
    setIdx(idx + 1); setFlipped(false);
  };

  const finish = () => {
    setQueue(null);
    onComplete(flashSessionXp(stats.known), { kind: "flashcard", cardsReviewed: stats.total });
  };

  if (!queue) {
    return <DeckOverview cards={cards} deck={deck} setDeck={setDeck} deckCards={deckCards} dueCount={dueCount} onStart={start} />;
  }

  if (!current) {
    return (
      <div style={{ ...lightCardBlock, maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{ ...displayFont, fontWeight: 600, fontSize: 18, marginBottom: 6 }}>Xong buổi ôn</div>
        <div style={{ fontSize: 14, color: LIGHT.muted, marginBottom: 14 }}>{stats.known}/{stats.total} lượt nhớ rõ. Thẻ quên sẽ quay lại hôm nay, thẻ nhớ rõ giãn dần lịch ôn.</div>
        <button onClick={finish} style={lightBtnStyle(LIGHT.gold)}><Trophy size={15} /> Nhận +{flashSessionXp(stats.known)} XP</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: LIGHT.muted, marginBottom: 8 }}>
        <span>Thẻ {idx + 1}/{queue.length} · {current.deck === "doi-ngoai" ? `Nhóm ${current.group} · ${current.label}` : current.group}</span>
        <button onClick={() => setQueue(null)} style={{ ...plainBtn, color: LIGHT.muted, fontSize: 13 }}>Dừng</button>
      </div>
      <ProgressBar pct={(idx / queue.length) * 100} height={5} style={{ marginBottom: 12 }} />
      <div onClick={() => setFlipped(true)} style={{ ...lightCardBlock, minHeight: 260, cursor: flipped ? "default" : "pointer", border: `1px solid ${flipped ? LIGHT.teal : LIGHT.gold}`, padding: "22px 26px" }}>
        <div style={{ fontSize: 17, lineHeight: 1.6, ...displayFont, fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: current.front }} />
        {!flipped && <div style={{ marginTop: 24, fontSize: 13, color: LIGHT.muted }}>Trả lời to thành tiếng, rồi nhấn vào thẻ để lật.</div>}
        {flipped && <div className="tda-card-back" style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${LIGHT.border}`, fontSize: 14.5, lineHeight: 1.65, color: LIGHT.text }} dangerouslySetInnerHTML={{ __html: current.back }} />}
      </div>
      {flipped && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          <button onClick={() => answer("again")} style={lightBtnStyle(LIGHT.red)}>Quên</button>
          <button onClick={() => answer("hard")} style={lightBtnStyle(LIGHT.gold)}>Nhớ mang máng</button>
          <button onClick={() => answer("know")} style={lightBtnStyle(LIGHT.teal)}>Nhớ rõ</button>
        </div>
      )}
    </div>
  );
}

function DeckOverview({ cards, deck, setDeck, deckCards, dueCount, onStart }) {
  const newCount = deckCards.filter((c) => !cards[c.id]).length;
  const learned = INTERVIEW_CARDS.filter((c) => cardBox(cards, c.id) >= LEARNED_BOX).length;
  return (
    <div className="tda-dash-grid">
      <div style={lightCardBlock}>
        <div style={{ ...displayFont, fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Flash card phỏng vấn</div>
        <StatGrid valueSize={22} labelSize={12} items={[
          ["Đến hạn", dueCount, LIGHT.gold],
          ["Thẻ mới", newCount, LIGHT.purple],
          ["Đã thuộc", `${learned}/${INTERVIEW_CARDS.length}`, LIGHT.teal],
        ]} />
        <div style={{ fontSize: 13.5, color: LIGHT.muted, lineHeight: 1.6, marginBottom: 12 }}>
          Mỗi câu đối ngoại có thẻ <strong>câu chốt</strong> và thẻ <strong>dàn ý</strong> (nêu đủ các ý); câu so sánh có thẻ cho từng tiêu chí. Thẻ nhớ rõ sẽ quay lại sau 1, 3, 7, 14, 30 ngày; thẻ quên quay lại ngay trong buổi.
        </div>
        <label style={{ fontSize: 13, color: LIGHT.muted }}>Bộ thẻ
          <select value={deck} onChange={(e) => setDeck(e.target.value)} style={{ ...selectStyle, marginLeft: 8 }}>
            <option value="all">Tất cả</option>
            <option value="doi-ngoai">20 câu đối ngoại</option>
            <option value="ho-so">Câu hồ sơ & tình huống</option>
            {INTERVIEW_GROUPS.map((g) => <option key={g.id} value={g.id}>Nhóm {g.id} · {g.name}</option>)}
          </select>
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
          <button disabled={!dueCount} onClick={() => onStart(true)} style={{ ...lightBtnStyle(LIGHT.gold), opacity: dueCount ? 1 : 0.4 }}><Layers size={15} /> Ôn thẻ đến hạn ({Math.min(FC_SESSION_SIZE, dueCount)})</button>
          <button onClick={() => onStart(false)} style={lightBtnStyle(LIGHT.teal)}><Shuffle size={15} /> Trộn ngẫu nhiên {FC_SESSION_SIZE} thẻ</button>
        </div>
      </div>
      <div style={lightCardBlock}>
        <div style={{ ...displayFont, fontWeight: 600, fontSize: 15, marginBottom: 10 }}>Tiến độ theo nhóm</div>
        {INTERVIEW_GROUPS.map((g) => {
          const groupCards = INTERVIEW_CARDS.filter((c) => c.group === g.id);
          const ok = groupCards.filter((c) => cardBox(cards, c.id) >= LEARNED_BOX).length;
          return (
            <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: 13 }}>
              <span style={{ ...monoFont, fontWeight: 700, color: LIGHT.gold, width: 16 }}>{g.id}</span>
              <span style={{ width: 170, color: LIGHT.text }}>{g.name}</span>
              <ProgressBar pct={Math.round((ok / Math.max(1, groupCards.length)) * 100)} height={6} fill={LIGHT.teal} style={{ flex: 1 }} />
              <span style={{ ...monoFont, color: LIGHT.muted, width: 44, textAlign: "right" }}>{ok}/{groupCards.length}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
