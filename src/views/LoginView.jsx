import { ChevronRight } from "lucide-react";
import { COLORS, displayFont } from "../theme.js";
import ProfileForm from "./ProfileForm.jsx";

export default function LoginView({ progress, onSubmit }) {
  return (
    <div style={{ position: "relative", textAlign: "center", paddingTop: 40 }}>
      <div style={{ ...displayFont, fontSize: 27.5, fontWeight: 600, marginBottom: 6 }}>Trilha do Aprovado</div>
      <div style={{ color: COLORS.muted, fontSize: 15, marginBottom: 28 }}>Chào mừng! Nhập tên để cá nhân hóa lộ trình học của bạn.</div>
      <div style={{ maxWidth: 320, margin: "0 auto", textAlign: "left" }}>
        <ProfileForm
          progress={progress}
          dateLabel="Ngày thi (không bắt buộc)"
          namePlaceholder="Ví dụ: Minh"
          submitLabel={<>Bắt đầu hành trình <ChevronRight size={15} /></>}
          buttonStyle={{ marginTop: 6 }}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
