import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { COLORS, displayFont } from "../theme.js";
import { BackButton } from "../components/ui.jsx";
import { exportProgressFile, importProgressFile } from "../lib/progress.js";
import { lightBtnStyle } from "../styles.js";
import ProfileForm from "./ProfileForm.jsx";

export default function SettingsView({ progress, onBack, onSubmit }) {
  const fileRef = useRef(null);
  const [msg, setMsg] = useState("");

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!window.confirm("Nhập tệp sẽ ghi đè toàn bộ tiến trình hiện tại trên thiết bị này. Tiếp tục?")) return;
    try {
      await importProgressFile(file);
      window.location.reload();
    } catch (err) {
      setMsg("Không đọc được tệp này. Hãy chọn đúng tệp đã xuất từ Trilha do Aprovado.");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <BackButton onClick={onBack}>Lộ trình</BackButton>
      <div style={{ ...displayFont, fontSize: 20.5, fontWeight: 600, margin: "12px 0 16px" }}>Cài đặt</div>
      <ProfileForm progress={progress} submitLabel="Lưu thay đổi" onSubmit={onSubmit} />

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "14px 16px", marginTop: 20 }}>
        <div style={{ ...displayFont, fontWeight: 600, fontSize: 17, marginBottom: 6 }}>Sao lưu tiến trình</div>
        <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 12, lineHeight: 1.5 }}>
          Dữ liệu chỉ lưu trong trình duyệt của thiết bị này. Xuất tệp để sao lưu hoặc chuyển sang thiết bị khác, rồi nhập tệp ở đó.
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => exportProgressFile(progress)} style={{ ...lightBtnStyle(COLORS.teal), width: "auto" }}>
            <Download size={15} /> Xuất tiến trình
          </button>
          <button onClick={() => fileRef.current?.click()} style={{ ...lightBtnStyle(COLORS.gold), width: "auto" }}>
            <Upload size={15} /> Nhập tiến trình
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={onPick} style={{ display: "none" }} />
        </div>
        {msg && <div style={{ color: COLORS.red, fontSize: 13.5, marginTop: 10 }}>{msg}</div>}
      </div>
    </div>
  );
}
