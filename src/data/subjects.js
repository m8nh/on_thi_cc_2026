import { BookOpen, ListChecks } from "lucide-react";
import { NGHIEP_VU_SUBJECT } from "./nghiepVu.js";

export { NGHIEP_VU_SUBJECT } from "./nghiepVu.js";

/* ---------------------------------------------------------
   NỀN TẢNG — bộ thẻ từ bài "Bản đồ hệ thống chính trị Việt Nam"
   (cập nhật theo Hiến pháp sửa đổi 2025, NQ 202/2025, Luật 87/2025)
--------------------------------------------------------- */
export const FOUNDATION_SUBJECT = {
  id: "nen-tang-he-thong", type: "deck",
  name: "Nền tảng: Bản đồ hệ thống chính trị",
  ref: "Cơ chế vận hành · các cơ quan nhà nước · chính quyền 2 cấp · MTTQ · thứ bậc văn bản",
  icon: ListChecks,
  flashcards: [
    { front: "Cơ chế vận hành của hệ thống chính trị Việt Nam là gì?", back: "Đảng lãnh đạo, Nhà nước quản lý, Nhân dân làm chủ." },
    { front: "Theo Điều 2 Hiến pháp, quyền lực nhà nước được tổ chức thế nào?", back: "Thống nhất, có sự phân công, phối hợp, kiểm soát giữa các cơ quan trong việc thực hiện quyền lập pháp, hành pháp, tư pháp. Không phải tam quyền phân lập." },
    { front: "Cơ quan quyền lực nhà nước cao nhất?", back: "Quốc hội (Điều 69): cơ quan đại biểu cao nhất của Nhân dân, cơ quan quyền lực nhà nước cao nhất." },
    { front: "Vị trí của Chính phủ theo Hiến pháp?", back: "Cơ quan hành chính nhà nước cao nhất, thực hiện quyền hành pháp, là cơ quan chấp hành của Quốc hội (Điều 94)." },
    { front: "Ai là người đứng đầu Nhà nước, thay mặt nước về đối nội và đối ngoại?", back: "Chủ tịch nước (Điều 86). Thủ tướng đứng đầu Chính phủ." },
    { front: "Cơ quan nào thực hiện quyền tư pháp? Viện kiểm sát làm gì?", back: "Tòa án nhân dân là cơ quan xét xử, thực hiện quyền tư pháp (Điều 102). Viện kiểm sát thực hành quyền công tố, kiểm sát hoạt động tư pháp (Điều 107)." },
    { front: "Chủ tịch nước và Thủ tướng được bầu như thế nào?", back: "Đều do Quốc hội bầu trong số đại biểu Quốc hội. Nhiệm kỳ Quốc hội: 5 năm." },
    { front: "Từ 01/7/2025, chính quyền địa phương có mấy cấp?", back: "2 cấp: cấp tỉnh và cấp xã (xã, phường, đặc khu). Cấp huyện kết thúc hoạt động (NQ 203/2025/QH15)." },
    { front: "Sau sắp xếp 2025, cả nước có bao nhiêu đơn vị hành chính cấp tỉnh?", back: "34: 28 tỉnh và 6 thành phố (NQ 202/2025/QH15), trước đây là 63." },
    { front: "Theo Hiến pháp sửa đổi 2025, Công đoàn và 4 tổ chức chính trị - xã hội khác có vị trí gì?", back: "Trực thuộc Mặt trận Tổ quốc Việt Nam: Công đoàn, Hội Nông dân, Đoàn TNCS Hồ Chí Minh, Hội LHPN, Hội Cựu chiến binh (Điều 9)." },
    { front: "Văn bản QPPL của Chính phủ, Thủ tướng, Bộ trưởng lần lượt tên là gì?", back: "Chính phủ: nghị định, nghị quyết. Thủ tướng: quyết định. Bộ trưởng: thông tư." },
    { front: "Hệ thống văn bản QPPL hiện nay gồm bao nhiêu loại?", back: "15 loại (Luật 64/2025/QH15, sửa đổi bởi Luật 87/2025/QH15, hiệu lực 01/7/2025). Luật 2015 có 26 hình thức." },
  ],
  quiz: [
    { q: "Cơ chế vận hành của hệ thống chính trị Việt Nam là gì?", options: ["Đảng lãnh đạo, Nhà nước quản lý, Nhân dân làm chủ", "Đảng quản lý, Nhà nước lãnh đạo, Nhân dân làm chủ", "Nhà nước lãnh đạo, Đảng quản lý, Nhân dân giám sát", "Đảng lãnh đạo, Quốc hội quản lý, Nhân dân làm chủ"], correct: 0, why: "Thứ tự cố định: Đảng lãnh đạo, Nhà nước quản lý, Nhân dân làm chủ." },
    { q: "Theo Điều 2 Hiến pháp, quyền lực nhà nước được tổ chức như thế nào?", options: ["Phân chia thành ba nhánh độc lập, đối trọng nhau", "Thống nhất, có sự phân công, phối hợp, kiểm soát giữa các cơ quan", "Tập trung toàn bộ vào Chính phủ", "Thống nhất, có sự phân công và giám sát của Nhân dân"], correct: 1, why: "Ba từ khóa: phân công, phối hợp, kiểm soát. Không phải tam quyền phân lập." },
    { q: "Cơ quan quyền lực nhà nước cao nhất là cơ quan nào?", options: ["Chính phủ", "Chủ tịch nước", "Quốc hội", "Ủy ban Thường vụ Quốc hội"], correct: 2, why: "Điều 69 Hiến pháp." },
    { q: "Chính phủ có vị trí gì theo Hiến pháp?", options: ["Cơ quan quyền lực nhà nước cao nhất", "Cơ quan hành chính nhà nước cao nhất, thực hiện quyền hành pháp", "Cơ quan đại biểu cao nhất của Nhân dân", "Cơ quan thực hiện quyền tư pháp"], correct: 1, why: "Điều 94 Hiến pháp." },
    { q: "Ai là người đứng đầu Nhà nước, thay mặt nước về đối nội và đối ngoại?", options: ["Thủ tướng Chính phủ", "Chủ tịch Quốc hội", "Chủ tịch nước", "Tổng Bí thư"], correct: 2, why: "Điều 86. Thủ tướng đứng đầu Chính phủ." },
    { q: "Cơ quan nào thực hiện quyền tư pháp?", options: ["Viện kiểm sát nhân dân", "Tòa án nhân dân", "Bộ Tư pháp", "Bộ Công an"], correct: 1, why: "Điều 102. Viện kiểm sát thực hành quyền công tố, kiểm sát hoạt động tư pháp." },
    { q: "Chủ tịch nước và Thủ tướng được bầu như thế nào?", options: ["Do Nhân dân bầu trực tiếp", "Do Quốc hội bầu trong số đại biểu Quốc hội", "Do Ban Chấp hành Trung ương bầu", "Do Ủy ban Thường vụ Quốc hội bổ nhiệm"], correct: 1, why: "Cả hai đều do Quốc hội bầu trong số đại biểu Quốc hội." },
    { q: "Từ 01/7/2025, chính quyền địa phương được tổ chức mấy cấp?", options: ["3 cấp: tỉnh, huyện, xã", "2 cấp: tỉnh và huyện", "2 cấp: tỉnh và xã", "1 cấp: tỉnh"], correct: 2, why: "NQ 203/2025/QH15: cấp huyện kết thúc hoạt động." },
    { q: "Sau sắp xếp năm 2025, cả nước có bao nhiêu đơn vị hành chính cấp tỉnh?", options: ["63", "34 (28 tỉnh, 6 thành phố)", "34 (29 tỉnh, 5 thành phố)", "28"], correct: 1, why: "NQ 202/2025/QH15." },
    { q: "Theo Hiến pháp sửa đổi 2025, Công đoàn Việt Nam có vị trí như thế nào?", options: ["Tổ chức độc lập, ngang hàng với Mặt trận", "Cơ quan nhà nước", "Tổ chức chính trị - xã hội trực thuộc Mặt trận Tổ quốc Việt Nam", "Tổ chức trực thuộc Chính phủ"], correct: 2, why: "Điều 9 sửa đổi năm 2025." },
    { q: "Văn bản quy phạm pháp luật của Chính phủ có tên là gì?", options: ["Thông tư", "Quyết định", "Pháp lệnh", "Nghị định, nghị quyết"], correct: 3, why: "Thủ tướng: quyết định. Bộ trưởng: thông tư. UBTVQH: pháp lệnh." },
    { q: "Hệ thống văn bản quy phạm pháp luật hiện nay gồm bao nhiêu loại?", options: ["26 loại", "14 loại", "15 loại", "12 loại"], correct: 2, why: "Luật 64/2025 có 14 loại; Luật 87/2025 nâng lên 15 loại từ 01/7/2025." },
  ],
};

export const WRITING_SUBJECT = {
  id: "viet-dich-thuat", type: "writing",
  name: "Kỹ năng viết – Dịch thuật (Lần 2)",
  ref: "Vòng thi thứ 2 · Bài thi viết tiếng Bồ Đào Nha · 180 phút · 35 điểm (tối thiểu 17,5)",
  icon: BookOpen,
  timeLimitMinutes: 180,
  maxScore: 35,
  passScore: 17.5,
  content: {
    readingText: "[Nội dung mẫu — thay bằng bài báo tiếng Bồ Đào Nha thật, khoảng 1200–1500 từ, về quan hệ quốc tế/đối ngoại]",
    questions: [
      "[Mẫu] Câu hỏi 1 về nội dung bài đọc",
      "[Mẫu] Câu hỏi 2 về nội dung bài đọc",
      "[Mẫu] Câu hỏi 3 về nội dung bài đọc",
    ],
    excerptToVietnamese: "[Đoạn trích mẫu bằng tiếng Bồ Đào Nha để dịch sang tiếng Việt — khoảng 300–350 từ]",
    sourceToPortuguese: "[Bài viết mẫu bằng tiếng Việt để dịch sang tiếng Bồ Đào Nha — khoảng 500 từ, chủ đề đối ngoại]",
  },
};

export const CHECKLIST_CRITERIA = [
  "Nội dung đầy đủ, đúng trọng tâm bài đọc",
  "Từ ngữ chính xác, đúng thuật ngữ chuyên ngành đối ngoại",
  "Ngữ pháp chính xác",
  "Văn phong phù hợp, mạch lạc",
  "Chính tả không sai",
  "Không chép nguyên văn từ bài gốc",
  "Không có sai sót về chức danh lãnh đạo, tên cơ quan",
];

// Tudo que abre na tela de baralho (flash card + đề thi thử).
export const DECK_SUBJECTS = [FOUNDATION_SUBJECT, NGHIEP_VU_SUBJECT];
export const findDeckSubject = (id) => DECK_SUBJECTS.find((s) => s.id === id);

// A entrevista não é um baralho: abre a tela própria de phỏng vấn.
export const INTERVIEW_SUBJECT_ID = "phong-van";
