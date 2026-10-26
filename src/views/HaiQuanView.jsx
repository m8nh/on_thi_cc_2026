import { Landmark } from "lucide-react";
import { LIGHT, displayFont } from "../theme.js";
import { lightCardBlock, lightPagePadding } from "../styles.js";
import { BackButton } from "../components/ui.jsx";

// Ôn thi HQ: nội dung sẽ cập nhật sau.
export default function HaiQuanView({ onBack }) {
  return (
    <div style={lightPagePadding}>
      <BackButton light onClick={onBack}>Chọn kỳ thi</BackButton>
      <div style={{ ...lightCardBlock, textAlign: "center", padding: "56px 24px", maxWidth: 640, margin: "24px auto 0" }}>
        <Landmark size={40} color={LIGHT.gold} />
        <div style={{ ...displayFont, fontSize: 24, fontWeight: 600, margin: "12px 0 6px" }}>Ôn thi HQ</div>
        <div style={{ fontSize: 15, color: LIGHT.muted }}>Chưa có nội dung. Phần này sẽ được cập nhật sau.</div>
      </div>
    </div>
  );
}
