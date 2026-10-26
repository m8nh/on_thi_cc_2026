import { Brain, RotateCcw, Layers, Star, Target, Sparkles, Zap, Award, BookOpen, Flame } from "lucide-react";

// Cada sessão concluída desbloqueia uma dica (também é o "Bảng thành tích" do dashboard).
export const TIPS = [
  { icon: Brain, title: "Hiệu ứng kiểm tra", body: "Cố nhớ lại kiến thức — kể cả khi sai — giúp ghi nhớ tốt hơn nhiều so với chỉ đọc lại. Bạn vừa áp dụng kỹ thuật này." },
  { icon: RotateCcw, title: "Lặp lại ngắt quãng", body: "Ôn tập theo khoảng cách tăng dần (1 ngày, 3 ngày, 1 tuần...) là phương pháp có bằng chứng khoa học mạnh nhất cho trí nhớ dài hạn." },
  { icon: Layers, title: "Học xen kẽ", body: "Trộn nhiều chuyên đề trong một buổi học, thay vì học một chủ đề đến kiệt sức, giúp bạn phân biệt tốt hơn khi nào áp dụng kiến thức nào." },
  { icon: Star, title: "Giấc ngủ củng cố trí nhớ", body: "Ngủ đủ sau khi học giúp chuyển kiến thức từ trí nhớ ngắn hạn sang dài hạn. Thức khuya mà ngủ không đủ sẽ làm giảm hiệu quả công sức bạn bỏ ra." },
  { icon: Target, title: "Độ khó cần thiết", body: "Cảm thấy khó nhớ lại câu trả lời là dấu hiệu việc học đang diễn ra sâu hơn — đừng nản lòng vì điều đó." },
  { icon: Sparkles, title: "Hiệu ứng tự tạo", body: "Tự mình đưa ra câu trả lời (như trong flash card) tạo ra trí nhớ mạnh hơn nhiều so với chỉ đọc đáp án có sẵn." },
  { icon: Zap, title: "Vòng lặp thói quen", body: "Những chiến thắng nhỏ liên tục (như buổi học này) huấn luyện não bộ liên kết việc học với phần thưởng — đó là cách thói quen thực sự hình thành." },
  { icon: Award, title: "Tư duy phát triển", body: "Coi trọng nỗ lực và chiến lược học tập — chứ không chỉ kết quả — là điều giúp duy trì động lực khi kỳ thi vẫn còn xa." },
  { icon: BookOpen, title: "Học rải đều thắng học dồn", body: "30 phút mỗi ngày trong 10 ngày mang lại hiệu quả ghi nhớ tốt hơn 5 tiếng liền trong một ngày. Đều đặn quan trọng hơn cường độ." },
  { icon: Flame, title: "Đường cong lãng quên", body: "Không ôn tập, bạn sẽ quên phần lớn nội dung chỉ sau vài ngày (đường cong Ebbinghaus). Ôn lại đúng lúc sắp quên sẽ 'reset' đường cong này hiệu quả nhất." },
];
