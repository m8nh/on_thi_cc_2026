import { Sparkles, BookOpen, Layers, Target, Zap, Award, ListChecks, Trophy } from "lucide-react";
import { shuffle } from "../lib/shuffle.js";

/* ---------------------------------------------------------
   NỘI DUNG — thay bằng flash card / câu hỏi / bài đọc thật
--------------------------------------------------------- */
export const STAGE1_SUBJECTS = [
  {
    id: "ly-luan-chinh-tri", type: "deck",
    name: "Lý luận chính trị",
    ref: "Hệ thống chính trị và phương thức lãnh đạo của Đảng (Chuyên đề 3)",
    icon: Sparkles,
    flashcards: [{ front: "Hệ thống chính trị ở Việt Nam gồm những thành tố nào?", back: "Đảng Cộng sản Việt Nam, Nhà nước CHXHCN Việt Nam, Mặt trận Tổ quốc và các tổ chức chính trị - xã hội." }],
    quiz: [{ q: "[Mẫu] Câu hỏi về hệ thống chính trị sẽ được cập nhật sau.", options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], correct: 0, why: "Đây là câu hỏi mẫu — thay bằng nội dung thật của chuyên đề 3." }],
  },
  {
    id: "nha-nuoc-phap-luat", type: "deck",
    name: "Nhà nước & Pháp luật",
    ref: "Giáo trình Lý luận NN&PL · Hiến pháp 2013",
    icon: BookOpen,
    flashcards: [{ front: "Hiến pháp nước CHXHCN Việt Nam hiện hành ban hành năm nào?", back: "Năm 2013." }],
    quiz: [{ q: "[Mẫu] Câu hỏi về Hiến pháp 2013 sẽ được cập nhật sau.", options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], correct: 0, why: "Đây là câu hỏi mẫu — thay bằng nội dung thật." }],
  },
  {
    id: "to-chuc-bo-may", type: "deck",
    name: "Tổ chức bộ máy nhà nước",
    ref: "Điều lệ Đảng · Luật tổ chức QH/CP · NĐ 123, 101, 81",
    icon: Layers,
    flashcards: [{ front: "Luật Tổ chức Quốc hội hiện hành ban hành ngày nào?", back: "Ngày 20/11/2014." }],
    quiz: [{ q: "[Mẫu] Câu hỏi về tổ chức bộ máy nhà nước sẽ được cập nhật sau.", options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], correct: 0, why: "Đây là câu hỏi mẫu — thay bằng nội dung thật." }],
  },
  {
    id: "can-bo-cong-chuc", type: "deck",
    name: "Cán bộ, công chức",
    ref: "Luật CBCC 2008 & sửa đổi 2019 · Luật CQ đại diện VN ở nước ngoài",
    icon: Target,
    flashcards: [{ front: "Luật Cán bộ, công chức được ban hành năm nào?", back: "Năm 2008, sửa đổi bổ sung năm 2019." }],
    quiz: [{ q: "[Mẫu] Câu hỏi về Luật Cán bộ, công chức sẽ được cập nhật sau.", options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], correct: 0, why: "Đây là câu hỏi mẫu — thay bằng nội dung thật." }],
  },
  {
    id: "lao-dong-vb-phap-luat", type: "deck",
    name: "Lao động & Văn bản pháp luật",
    ref: "Bộ luật Lao động 2019 · Luật ban hành VBQPPL 2015/2020",
    icon: Zap,
    flashcards: [{ front: "Bộ luật Lao động hiện hành được thông qua ngày nào?", back: "Ngày 20/11/2019." }],
    quiz: [{ q: "[Mẫu] Câu hỏi về Bộ luật Lao động sẽ được cập nhật sau.", options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], correct: 0, why: "Đây là câu hỏi mẫu — thay bằng nội dung thật." }],
  },
  {
    id: "cai-cach-hanh-chinh", type: "deck",
    name: "Cải cách hành chính",
    ref: "Nghị quyết 76/NQ-CP (giai đoạn 2021–2030)",
    icon: Award,
    flashcards: [{ front: "Nghị quyết 76/NQ-CP ban hành ngày nào?", back: "Ngày 15/7/2021, ban hành Chương trình tổng thể cải cách hành chính nhà nước giai đoạn 2021-2030." }],
    quiz: [{ q: "[Mẫu] Câu hỏi về cải cách hành chính sẽ được cập nhật sau.", options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], correct: 0, why: "Đây là câu hỏi mẫu — thay bằng nội dung thật." }],
  },
];

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

// Junta flashcards e questões de todos os chuyên đề do Vòng 1 num só baralho/
// simulado embaralhado — igual à prova de verdade, que mistura tudo.
export const COMBINED_SUBJECT = {
  id: "tong-hop-vong1", type: "deck",
  name: "Ôn tập tổng hợp",
  ref: "Trộn ngẫu nhiên toàn bộ 6 chuyên đề · giống cấu trúc đề thi thật",
  icon: Trophy,
  flashcards: shuffle(STAGE1_SUBJECTS.flatMap((s) => s.flashcards)),
  quiz: shuffle(STAGE1_SUBJECTS.flatMap((s) => s.quiz)),
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
export const DECK_SUBJECTS = [FOUNDATION_SUBJECT, COMBINED_SUBJECT, ...STAGE1_SUBJECTS];
export const findDeckSubject = (id) => DECK_SUBJECTS.find((s) => s.id === id);

// A entrevista não é um baralho: abre a tela própria de phỏng vấn.
export const INTERVIEW_SUBJECT_ID = "phong-van";
