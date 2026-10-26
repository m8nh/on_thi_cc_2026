import { displayFont } from "../theme.js";
import { BackButton } from "../components/ui.jsx";
import ProfileForm from "./ProfileForm.jsx";

export default function SettingsView({ progress, onBack, onSubmit }) {
  return (
    <div style={{ position: "relative" }}>
      <BackButton onClick={onBack}>Lộ trình</BackButton>
      <div style={{ ...displayFont, fontSize: 20.5, fontWeight: 600, margin: "12px 0 16px" }}>Cài đặt</div>
      <ProfileForm progress={progress} submitLabel="Lưu thay đổi" onSubmit={onSubmit} />
    </div>
  );
}
