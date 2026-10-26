import { useState } from "react";
import { COLORS } from "../theme.js";
import { btnStyle, formLabelStyle, inputStyle } from "../styles.js";

// Formulário de nome + data/hora da prova (usado no login e nas configurações).
export default function ProfileForm({ progress, dateLabel = "Ngày thi", namePlaceholder, submitLabel, onSubmit, buttonStyle }) {
  const [name, setName] = useState(progress.name || "");
  const [examDate, setExamDate] = useState(progress.examDate || "");
  const [examTime, setExamTime] = useState(progress.examTime || "08:00");
  const valid = name.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    onSubmit({ name: name.trim(), examDate: examDate || null, examTime: examTime || "08:00" });
  };

  return (
    <>
      <label style={formLabelStyle}>Tên của bạn</label>
      <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder={namePlaceholder} />
      <label style={formLabelStyle}>{dateLabel}</label>
      <input type="date" style={inputStyle} value={examDate} onChange={(e) => setExamDate(e.target.value)} />
      <label style={formLabelStyle}>Giờ thi</label>
      <input type="time" style={inputStyle} value={examTime} onChange={(e) => setExamTime(e.target.value)} />
      <button disabled={!valid} onClick={submit} style={{ ...btnStyle(COLORS.gold, true), opacity: valid ? 1 : 0.4, ...buttonStyle }}>
        {submitLabel}
      </button>
    </>
  );
}
