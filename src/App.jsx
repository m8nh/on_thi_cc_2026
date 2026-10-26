import { useState, useEffect, useRef, Fragment } from "react";
import {
  Flame, Trophy, BookOpen, Layers, Brain, CheckCircle2, XCircle,
  Sparkles, Award, ArrowLeft, ChevronRight, Star, Zap, Target, RotateCcw,
  Settings, Clock, CalendarDays, LogOut, Search, Home,
  ListChecks, PlayCircle, FileText, Scale, ExternalLink,
  Mic, Shuffle, Eye, PenLine, Timer,
} from "lucide-react";
import { INTERVIEW_QUESTIONS, INTERVIEW_INTRO, PROFILE_QUESTIONS, INTERVIEW_DOC_URL, INTERVIEW_GROUPS, INTERVIEW_CARDS } from "./interviewData.js";

/* ---------------------------------------------------------
   NỘI DUNG — thay bằng flash card / câu hỏi / bài đọc thật
--------------------------------------------------------- */
const STAGE1_SUBJECTS = [
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
const FOUNDATION_SUBJECT = {
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

const MATERIAL_BASE = import.meta.env.BASE_URL;

/* ---------------------------------------------------------
   LỘ TRÌNH HỌC — đi từ nền tảng đến đề thi tổng hợp
   type: video | doc | deck | law | note
--------------------------------------------------------- */
const STUDY_PLAN = [
  {
    id: "b1-nen-tang", phase: "Nền tảng", title: "Bản đồ hệ thống chính trị Việt Nam",
    goal: "Nắm cơ chế vận hành, các cơ quan nhà nước, chính quyền 2 cấp, MTTQ và thứ bậc văn bản trước khi học từng luật.",
    subjectId: "nen-tang-he-thong",
    materials: [
      { type: "video", label: "Video giảng giải (giọng Nhật Phong, 2:42)", url: `${MATERIAL_BASE}materials/ban-do-he-thong-chinh-tri-nhat-phong.mp4` },
      { type: "doc", label: "Bài đọc: tóm tắt nhanh + bài chi tiết + bẫy trắc nghiệm", url: "https://claude.ai/artifact/JhM87xXupuVyjMHB2QNCGK" },
      { type: "deck", label: "12 flash card + 12 câu trắc nghiệm", subjectId: "nen-tang-he-thong" },
      { type: "law", label: "Nghị quyết 203/2025/QH15 sửa đổi Hiến pháp", url: "https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Nghi-quyet-sua-doi-Hien-phap-2013-655275.aspx" },
    ],
  },
  {
    id: "b2-hien-phap", phase: "Vòng 1", title: "Hiến pháp 2013 (sửa đổi, bổ sung 2025)",
    goal: "Đọc theo chương; ghi flash card cho định nghĩa, vị trí cơ quan, quyền và nghĩa vụ cơ bản.",
    subjectId: "nha-nuoc-phap-luat",
    materials: [
      { type: "note", label: "Bản hợp nhất Hiến pháp (NXB Chính trị quốc gia Sự thật, 2025)" },
      { type: "law", label: "Nghị quyết 203/2025/QH15 (các điều được sửa)", url: "https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Nghi-quyet-sua-doi-Hien-phap-2013-655275.aspx" },
      { type: "deck", label: "Bộ thẻ Nhà nước & Pháp luật", subjectId: "nha-nuoc-phap-luat" },
    ],
  },
  {
    id: "b3-bo-may", phase: "Vòng 1", title: "Tổ chức bộ máy nhà nước",
    goal: "Luật tổ chức Quốc hội, Chính phủ, chính quyền địa phương: ai có thẩm quyền gì, nhiệm kỳ, cơ cấu.",
    subjectId: "to-chuc-bo-may",
    materials: [
      { type: "note", label: "Luật Tổ chức chính quyền địa phương số 72/2025/QH15" },
      { type: "law", label: "NQ 202/2025/QH15: 34 đơn vị hành chính cấp tỉnh", url: "https://luatvietnam.vn/hanh-chinh/nghi-quyet-202-2025-qh15-cua-quoc-hoi-ve-viec-sap-xep-don-vi-hanh-chinh-cap-tinh-402728-d1.html" },
      { type: "deck", label: "Bộ thẻ Tổ chức bộ máy nhà nước", subjectId: "to-chuc-bo-may" },
    ],
  },
  {
    id: "b4-cbcc", phase: "Vòng 1", title: "Cán bộ, công chức",
    goal: "Luật Cán bộ, công chức 2025 (thay thế Luật 2008/2019): khái niệm, tuyển dụng, đánh giá, kỷ luật.",
    subjectId: "can-bo-cong-chuc",
    materials: [
      { type: "law", label: "Luật Cán bộ, công chức số 80/2025/QH15", url: "https://luatvietnam.vn/can-bo/luat-can-bo-cong-chuc-2025-so-80-2025-qh15-404140-d1.html" },
      { type: "deck", label: "Bộ thẻ Cán bộ, công chức", subjectId: "can-bo-cong-chuc" },
    ],
  },
  {
    id: "b5-lao-dong-vbqppl", phase: "Vòng 1", title: "Lao động & Văn bản quy phạm pháp luật",
    goal: "Thứ bậc 15 loại văn bản và thẩm quyền ban hành; các điểm chính của Bộ luật Lao động 2019.",
    subjectId: "lao-dong-vb-phap-luat",
    materials: [
      { type: "law", label: "15 loại văn bản QPPL theo Luật 87/2025/QH15", url: "https://luatvietnam.vn/tin-van-ban-moi/da-co-luat-sua-doi-luat-ban-hanh-van-ban-quy-pham-phap-luat-2025-so-87-2025-qh15-186-102714-article.html" },
      { type: "deck", label: "Bộ thẻ Lao động & VBQPPL", subjectId: "lao-dong-vb-phap-luat" },
    ],
  },
  {
    id: "b6-cchc", phase: "Vòng 1", title: "Cải cách hành chính",
    goal: "Mục tiêu, nhiệm vụ và giải pháp của Chương trình tổng thể CCHC 2021-2030.",
    subjectId: "cai-cach-hanh-chinh",
    materials: [
      { type: "note", label: "Nghị quyết 76/NQ-CP ngày 15/7/2021" },
      { type: "deck", label: "Bộ thẻ Cải cách hành chính", subjectId: "cai-cach-hanh-chinh" },
    ],
  },
  {
    id: "b7-llct", phase: "Vòng 1", title: "Lý luận chính trị",
    goal: "Học thuộc công thức chính xác từng chữ; làm thẻ so sánh các cặp diễn đạt gần giống nhau.",
    subjectId: "ly-luan-chinh-tri",
    materials: [
      { type: "note", label: "Chuyên đề 3: Hệ thống chính trị và phương thức lãnh đạo của Đảng" },
      { type: "deck", label: "Bộ thẻ Lý luận chính trị", subjectId: "ly-luan-chinh-tri" },
    ],
  },
  {
    id: "b8-tong-hop", phase: "Vòng 1", title: "Ôn tập tổng hợp & thi thử",
    goal: "Trộn toàn bộ chuyên đề như đề thật; mỗi câu sai ghi lý do vào sổ lỗi.",
    subjectId: "tong-hop-vong1",
    materials: [
      { type: "deck", label: "Đề tổng hợp ngẫu nhiên 6 chuyên đề", subjectId: "tong-hop-vong1" },
    ],
  },
  {
    id: "b9-vong2", phase: "Vòng 2", title: "Viết & dịch tiếng Bồ Đào Nha",
    goal: "Tóm tắt bài đọc, dịch Bồ → Việt, dịch Việt → Bồ; luyện với văn bản song ngữ và đồng hồ 180 phút.",
    subjectId: "viet-dich-thuat",
    materials: [
      { type: "note", label: "Văn bản song ngữ: tuyên bố chung, thông cáo của Bộ Ngoại giao / Itamaraty" },
      { type: "note", label: "Sổ thuật ngữ đối ngoại Việt - Bồ tự xây dựng" },
      { type: "deck", label: "Bài luyện viết 180 phút", subjectId: "viet-dich-thuat" },
    ],
  },
  {
    id: "b10-phong-van", phase: "Vòng 2", title: "Phỏng vấn vòng 2",
    goal: "20 câu đối ngoại có dàn ý và 26 câu về hồ sơ, tình huống, tiếng Bồ; luyện bốc thăm có đồng hồ như phòng thi.",
    subjectId: "phong-van",
    materials: [
      { type: "deck", label: "Tab Phỏng vấn: bốc thăm, dàn ý, tự chấm", subjectId: "phong-van" },
      { type: "doc", label: "Dàn ý ôn vòng 2 (20 câu, bản tài liệu)", url: INTERVIEW_DOC_URL },
    ],
  },
];

const PLAN_STATUS = {
  todo: { label: "Chưa học", next: "doing" },
  doing: { label: "Đang học", next: "done" },
  done: { label: "Đã xong", next: "todo" },
};
const MATERIAL_ICON = { video: PlayCircle, doc: FileText, deck: Layers, law: Scale, note: BookOpen };
const MATERIAL_TAG = { video: "Video", doc: "Bài đọc", deck: "Luyện tập", law: "Văn bản", note: "Tài liệu" };

function shuffleOnce(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Junta flashcards e questões de todos os chuyên đề do Vòng 1 num só baralho/
// simulado embaralhado — igual à prova de verdade, que mistura tudo.
const COMBINED_SUBJECT = {
  id: "tong-hop-vong1", type: "deck",
  name: "Ôn tập tổng hợp",
  ref: "Trộn ngẫu nhiên toàn bộ 6 chuyên đề · giống cấu trúc đề thi thật",
  icon: Trophy,
  flashcards: shuffleOnce(STAGE1_SUBJECTS.flatMap((s) => s.flashcards)),
  quiz: shuffleOnce(STAGE1_SUBJECTS.flatMap((s) => s.quiz)),
};

const WRITING_SUBJECT = {
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

const CHECKLIST_CRITERIA = [
  "Nội dung đầy đủ, đúng trọng tâm bài đọc",
  "Từ ngữ chính xác, đúng thuật ngữ chuyên ngành đối ngoại",
  "Ngữ pháp chính xác",
  "Văn phong phù hợp, mạch lạc",
  "Chính tả không sai",
  "Không chép nguyên văn từ bài gốc",
  "Không có sai sót về chức danh lãnh đạo, tên cơ quan",
];

const TIPS = [
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

const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');";

const COLORS = {
  bg: "#12162A", surface: "#1B2140", surfaceAlt: "#232A4D", border: "#333c66",
  gold: "#D6AE3D", teal: "#3EB489", red: "#E0667A", text: "#EDEAE2", muted: "#8891A8",
};

const LIGHT = {
  bg: "#F4F5FA", surface: "#FFFFFF", surfaceAlt: "#F7F8FC", border: "#E7E8F2",
  text: "#20233A", muted: "#8A8FA3", gold: "#C79A2E", teal: "#2E9A76",
  red: "#D9536B", purple: "#6C63FF",
};

const RESPONSIVE_CSS = `
.tda-dash-grid, .tda-plan-grid { display: grid; grid-template-columns: 1fr; column-gap: 24px; align-items: start; }
@media (min-width: 900px) {
  .tda-wide > div { padding-left: 32px !important; padding-right: 32px !important; }
  .tda-dash-grid, .tda-plan-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 900px) { .tda-root { border-radius: 0 !important; } }
.tda-card-back ol { margin: 0; padding-left: 22px; } .tda-card-back li { margin-bottom: 6px; } .tda-card-back p { margin: 0 0 8px; }
`;

const displayFont = { fontFamily: "'Fraunces', serif" };
const bodyFont = { fontFamily: "'IBM Plex Sans', sans-serif" };
const monoFont = { fontFamily: "'IBM Plex Mono', monospace" };

const xpMaxFor = (level) => 100 + (level - 1) * 40;
const WEEKDAYS_VI = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const inputStyle = { width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", color: COLORS.text, fontSize: 15.5, marginBottom: 12, boxSizing: "border-box", ...bodyFont };
const textareaStyle = { ...inputStyle, minHeight: 90, resize: "vertical", fontFamily: "'IBM Plex Sans', sans-serif", lineHeight: 1.5 };

function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const rawDay = firstDay.getDay();
  const startWeekday = (rawDay + 6) % 7;
  const numDays = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= numDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function toDateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / 86400000);
}

function fullCountdown(dateStr, timeStr) {
  if (!dateStr) return null;
  const target = new Date(`${dateStr}T${timeStr || "08:00"}:00`).getTime();
  const diff = target - Date.now();
  if (diff <= 0) return { passed: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    passed: false,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function last7Days() {
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ key, label: WEEKDAYS_VI[(d.getDay() + 6) % 7], isToday: i === 0 });
  }
  return out;
}

const DAILY_MISSIONS = [
  { id: "flashcard", label: "Hoàn thành 1 bộ flash card", target: 1, key: "flashcardDecks" },
  { id: "quiz", label: "Làm 1 đề thi thử", target: 1, key: "quizzes" },
  { id: "subjects", label: "Học từ 2 chuyên đề khác nhau", target: 2, key: "subjectsTouched" },
];

function missionValue(mp, mission) {
  if (!mp) return 0;
  return mission.key === "subjectsTouched" ? mp.subjectsTouched.length : mp[mission.key];
}

function freshMissionDay(dateKey) {
  return { date: dateKey, flashcardDecks: 0, quizzes: 0, subjectsTouched: [], claimed: false };
}

// Se o dia mudou, "vira a página" das missões. Se o dia anterior não foi
// concluído (e reivindicado), zera só a sequência de bônus — nunca XP/nível.
function rolloverMissions(p, dateKey) {
  if (p.missionProgress && p.missionProgress.date === dateKey) {
    return { missionProgress: p.missionProgress, missionStreak: p.missionStreak || 0 };
  }
  const hadPrevious = !!p.missionProgress;
  const wasClaimed = hadPrevious && p.missionProgress.claimed;
  const missionStreak = hadPrevious && !wasClaimed ? 0 : (p.missionStreak || 0);
  return { missionProgress: freshMissionDay(dateKey), missionStreak };
}

function computeAward(p, amount) {
  let xp = p.xp + amount, level = p.level, xpMax = xpMaxFor(level), didLevelUp = false;
  while (xp >= xpMax) { xp -= xpMax; level += 1; xpMax = xpMaxFor(level); didLevelUp = true; }
  const unseen = TIPS.map((_, i) => i).filter((i) => !p.tipsSeen.includes(i));
  const pool = unseen.length ? unseen : TIPS.map((_, i) => i);
  const pickIdx = pool[Math.floor(Math.random() * pool.length)];
  const tipsSeen = p.tipsSeen.includes(pickIdx) ? p.tipsSeen : [...p.tipsSeen, pickIdx];
  return { next: { ...p, xp, level, tipsSeen, totalSessions: p.totalSessions + 1 }, didLevelUp, pickIdx };
}

const STORAGE_KEY = "trilha-do-aprovado-progress";

const DEFAULT_PROGRESS = {
  name: null, examDate: null, examTime: "08:00",
  level: 1, xp: 0, streakDays: 1, lastActiveDate: null,
  tipsSeen: [], totalSessions: 0, sessionDates: [],
  writingDraft: null,
  missionProgress: null, missionStreak: 0,
  dailyXp: {}, subjectsEverTouched: [], totalCardsReviewed: 0,
  quizStats: { correct: 0, total: 0 },
  planStatus: {}, materialsDone: {},
  interview: { ratings: {}, notes: {}, prepared: {} },
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch (e) {
    console.error("Lỗi khi đọc tiến trình đã lưu:", e);
  }
  return DEFAULT_PROGRESS;
}

// Abrir o baralho de um passo marca esse passo como "Đang học" (se ainda estava "Chưa học").
function markStepStarted(planStatus, subjectId) {
  const ps = planStatus || {};
  const step = STUDY_PLAN.find((st) => st.subjectId === subjectId);
  if (!step || (ps[step.id] && ps[step.id] !== "todo")) return ps;
  return { ...ps, [step.id]: "doing" };
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("login"); // login | dashboard | settings | subject | flashcards | quiz | writing | reward
  const [subjectId, setSubjectId] = useState(null);
  const [leveledUp, setLeveledUp] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const [rewardTip, setRewardTip] = useState(null);

  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const accumRef = useRef(0);
  const quizAccumRef = useRef(0);
  const quizCorrectRef = useRef(0);
  const draftSaveTimeout = useRef(null);
  const progressRef = useRef(null);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  const [searchQuery, setSearchQuery] = useState("");

  const [rewardReturn, setRewardReturn] = useState("dashboard");
  const [ivTab, setIvTab] = useState("ban-do"); // ban-do | flash | doi-ngoai | ho-so
  const [ivOpen, setIvOpen] = useState(null);
  const [ivOpenP, setIvOpenP] = useState(null);
  const [mapHide, setMapHide] = useState(false);
  const [ivIntro, setIvIntro] = useState(false);
  const [mapShown, setMapShown] = useState({});
  const [fcDeck, setFcDeck] = useState("all"); // all | doi-ngoai | ho-so | A..H
  const [fcQueue, setFcQueue] = useState(null);
  const [fcIdx, setFcIdx] = useState(0);
  const [fcFlip, setFcFlip] = useState(false);
  const [fcStats, setFcStats] = useState({ known: 0, total: 0 });
  const [ivFilter, setIvFilter] = useState("all"); // all | new | weak
  const [ivDraw, setIvDraw] = useState(null); // { n, phase: prep|talk|review, ts }
  const [ivPrepMin, setIvPrepMin] = useState(5);
  const [ivTalkMin, setIvTalkMin] = useState(5);

  const [nameInput, setNameInput] = useState("");
  const [examDateInput, setExamDateInput] = useState("");
  const [examTimeInput, setExamTimeInput] = useState("08:00");
  const [dashboardTick, setDashboardTick] = useState(0);

  const [writingStarted, setWritingStarted] = useState(false);
  const [writingStartTs, setWritingStartTs] = useState(null);
  const [tick, setTick] = useState(0);
  const [summaryText, setSummaryText] = useState("");
  const [answers, setAnswers] = useState(["", "", ""]);
  const [translationVi, setTranslationVi] = useState("");
  const [translationPt, setTranslationPt] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState(null);
  const [feedbackError, setFeedbackError] = useState(false);
  const [checklist, setChecklist] = useState({});

  useEffect(() => {
    setView(progress.name ? "dashboard" : "login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (view !== "writing" || !writingStarted) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [view, writingStarted]);

  useEffect(() => {
    if (view !== "interview" || !ivDraw || ivDraw.phase === "review") return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [view, ivDraw]);

  useEffect(() => {
    if (view !== "dashboard") return;
    const id = setInterval(() => setDashboardTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [view]);

  const persist = (next) => {
    setProgress(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch (e) { console.error("Lỗi khi lưu tiến trình:", e); }
  };

  const saveDraftDebounced = (draft) => {
    if (draftSaveTimeout.current) clearTimeout(draftSaveTimeout.current);
    draftSaveTimeout.current = setTimeout(() => {
      persist({ ...progressRef.current, writingDraft: draft });
    }, 700);
  };

  const today = () => new Date().toISOString().slice(0, 10);

  const recordSession = (p) => {
    const t = today();
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const sessionDates = p.sessionDates.includes(t) ? p.sessionDates : [...p.sessionDates, t];
    return {
      ...p, sessionDates,
      streakDays: p.lastActiveDate === t ? p.streakDays : (p.lastActiveDate === yesterday ? p.streakDays + 1 : 1),
      lastActiveDate: t,
    };
  };

  const awardXp = (amount, kind, meta = {}) => {
    const t = today();
    const { missionProgress: mpBase, missionStreak: msBase } = rolloverMissions(progress, t);
    const missionProgress = { ...mpBase };
    if (kind === "flashcard") missionProgress.flashcardDecks += 1;
    if (kind === "quiz") missionProgress.quizzes += 1;
    let p = recordSession({ ...progress, ...(meta.patch || {}), missionProgress, missionStreak: msBase });
    p = {
      ...p,
      dailyXp: { ...p.dailyXp, [t]: (p.dailyXp[t] || 0) + amount },
      totalCardsReviewed: p.totalCardsReviewed + (meta.cardsReviewed || 0),
      quizStats: meta.quizTotal
        ? { correct: p.quizStats.correct + (meta.quizCorrect || 0), total: p.quizStats.total + meta.quizTotal }
        : p.quizStats,
    };
    const { next, didLevelUp, pickIdx } = computeAward(p, amount);
    setLeveledUp(didLevelUp);
    setSessionXp(amount);
    setRewardTip(TIPS[pickIdx]);
    persist(next);
    setView("reward");
  };

  const claimMissionReward = () => {
    const t = today();
    const { missionProgress, missionStreak } = rolloverMissions(progress, t);
    const allDone = DAILY_MISSIONS.every((m) => missionValue(missionProgress, m) >= m.target);
    if (!allDone || missionProgress.claimed) return;
    const bonus = 20 + Math.min(missionStreak, 5) * 4;
    let p = recordSession({ ...progress, missionProgress: { ...missionProgress, claimed: true }, missionStreak: missionStreak + 1 });
    p = { ...p, dailyXp: { ...p.dailyXp, [t]: (p.dailyXp[t] || 0) + bonus } };
    const { next, didLevelUp, pickIdx } = computeAward(p, bonus);
    setLeveledUp(didLevelUp);
    setSessionXp(bonus);
    setRewardTip(TIPS[pickIdx]);
    persist(next);
    setView("reward");
  };

  if (loading || !progress) {
    return (
      <div style={{ ...bodyFont, background: COLORS.bg, color: COLORS.muted, minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16 }}>
        <style>{FONT_IMPORT}</style>
        Đang tải lộ trình của bạn...
      </div>
    );
  }

  const subject = [...STAGE1_SUBJECTS, FOUNDATION_SUBJECT, COMBINED_SUBJECT].find((s) => s.id === subjectId);
  const xpMax = xpMaxFor(progress.level);
  const xpPct = Math.min(100, Math.round((progress.xp / xpMax) * 100));

  const openDeckSubject = (id) => {
    const t = today();
    const { missionProgress, missionStreak } = rolloverMissions(progress, t);
    const subjectsTouched = missionProgress.subjectsTouched.includes(id) ? missionProgress.subjectsTouched : [...missionProgress.subjectsTouched, id];
    const subjectsEverTouched = progress.subjectsEverTouched.includes(id) ? progress.subjectsEverTouched : [...progress.subjectsEverTouched, id];
    persist({ ...progress, missionStreak, missionProgress: { ...missionProgress, subjectsTouched }, subjectsEverTouched, planStatus: markStepStarted(progress.planStatus, id) });
    setSubjectId(id); setView("subject");
  };
  const openWriting = () => {
    const t = today();
    const { missionProgress, missionStreak } = rolloverMissions(progress, t);
    const subjectsTouched = missionProgress.subjectsTouched.includes(WRITING_SUBJECT.id) ? missionProgress.subjectsTouched : [...missionProgress.subjectsTouched, WRITING_SUBJECT.id];
    const subjectsEverTouched = progress.subjectsEverTouched.includes(WRITING_SUBJECT.id) ? progress.subjectsEverTouched : [...progress.subjectsEverTouched, WRITING_SUBJECT.id];
    persist({ ...progress, missionStreak, missionProgress: { ...missionProgress, subjectsTouched }, subjectsEverTouched, planStatus: markStepStarted(progress.planStatus, WRITING_SUBJECT.id) });

    const draft = progress.writingDraft;
    if (draft) {
      setWritingStarted(true);
      setWritingStartTs(draft.startedAt);
      setSummaryText(draft.summaryText || "");
      setAnswers(draft.answers || ["", "", ""]);
      setTranslationVi(draft.translationVi || "");
      setTranslationPt(draft.translationPt || "");
    } else {
      setWritingStarted(false); setWritingStartTs(null);
      setSummaryText(""); setAnswers(["", "", ""]); setTranslationVi(""); setTranslationPt("");
    }
    setFeedbackText(null); setFeedbackError(false); setChecklist({});
    setView("writing");
  };
  const startFlashcards = () => { setCardIndex(0); setFlipped(false); setView("flashcards"); };
  const startQuiz = () => { setQIndex(0); setSelected(null); quizAccumRef.current = 0; quizCorrectRef.current = 0; setView("quiz"); };

  const openSettings = () => {
    setNameInput(progress.name || "");
    setExamDateInput(progress.examDate || "");
    setExamTimeInput(progress.examTime || "08:00");
    setView("settings");
  };
  const saveSettings = () => {
    if (!nameInput.trim()) return;
    persist({ ...progress, name: nameInput.trim(), examDate: examDateInput || null, examTime: examTimeInput || "08:00" });
    setView("dashboard");
  };

  const now = new Date();
  const calYear = now.getFullYear(), calMonth = now.getMonth();
  const calCells = buildCalendarGrid(calYear, calMonth);
  const todayKey = toDateKey(calYear, calMonth, now.getDate());
  void dashboardTick; // força recálculo a cada segundo
  const countdown = fullCountdown(progress.examDate, progress.examTime);
  const { missionProgress: missionsToday, missionStreak } = rolloverMissions(progress, today());
  const missionsAllDone = DAILY_MISSIONS.every((m) => missionValue(missionsToday, m) >= m.target);

  const weekData = last7Days().map((d) => ({ ...d, xp: progress.dailyXp[d.key] || 0 }));
  const weekMax = Math.max(1, ...weekData.map((d) => d.xp));
  const vong1Pct = Math.round((progress.subjectsEverTouched.filter((id) => STAGE1_SUBJECTS.some((s) => s.id === id)).length / STAGE1_SUBJECTS.length) * 100);
  const quizAccuracyPct = progress.quizStats.total > 0 ? Math.round((progress.quizStats.correct / progress.quizStats.total) * 100) : null;
  const allSubjectCards = [FOUNDATION_SUBJECT, COMBINED_SUBJECT, ...STAGE1_SUBJECTS, WRITING_SUBJECT];
  const filteredSubjects = searchQuery.trim()
    ? allSubjectCards.filter((s) => s.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : null;

  const planStatus = progress.planStatus || {};
  const materialsDone = progress.materialsDone || {};
  const stepStatus = (st) => planStatus[st.id] || "todo";
  const planDoneCount = STUDY_PLAN.filter((st) => stepStatus(st) === "done").length;
  const totalMaterials = STUDY_PLAN.reduce((n, st) => n + st.materials.length, 0);
  const materialsDoneCount = STUDY_PLAN.reduce((n, st) => n + st.materials.filter((_, i) => materialsDone[`${st.id}:${i}`]).length, 0);
  const planPct = Math.round(((planDoneCount + materialsDoneCount / Math.max(1, totalMaterials)) / (STUDY_PLAN.length + 1)) * 100);
  const currentStep = STUDY_PLAN.find((st) => stepStatus(st) === "doing") || STUDY_PLAN.find((st) => stepStatus(st) !== "done") || null;
  const cycleStepStatus = (st) => persist({ ...progress, planStatus: { ...planStatus, [st.id]: PLAN_STATUS[stepStatus(st)].next } });
  const toggleMaterial = (st, i) => {
    const key = `${st.id}:${i}`;
    const nextDone = { ...materialsDone, [key]: !materialsDone[key] };
    const nextStatus = stepStatus(st) === "todo" && nextDone[key] ? { ...planStatus, [st.id]: "doing" } : planStatus;
    persist({ ...progress, materialsDone: nextDone, planStatus: nextStatus });
  };
  const iv = progress.interview || { ratings: {}, notes: {}, prepared: {} };
  const openInterview = () => {
    persist({ ...progress, planStatus: markStepStarted(progress.planStatus, "phong-van") });
    setView("interview");
  };
  const openStepSubject = (sid) => (sid === "phong-van" ? openInterview() : sid === WRITING_SUBJECT.id ? openWriting() : openDeckSubject(sid));
  const saveIv = (patch) => persist({ ...progress, interview: { ...iv, ...patch } });
  const setIvRating = (n, r) => saveIv({ ratings: { ...iv.ratings, [n]: iv.ratings[n] === r ? undefined : r } });
  const setIvNote = (key, text) => saveIv({ notes: { ...iv.notes, [key]: text } });
  const toggleIvPrepared = (key) => saveIv({ prepared: { ...iv.prepared, [key]: !iv.prepared[key] } });
  const ivRatedCount = INTERVIEW_QUESTIONS.filter((q) => iv.ratings[q.n]).length;
  const ivGoodCount = INTERVIEW_QUESTIONS.filter((q) => iv.ratings[q.n] === "good").length;
  const ivWeakCount = INTERVIEW_QUESTIONS.filter((q) => iv.ratings[q.n] === "weak").length;
  const profileKeys = PROFILE_QUESTIONS.flatMap((g, gi) => g.items.map((_, i) => `p${gi}-${i}`));
  const ivPreparedCount = profileKeys.filter((k) => iv.prepared[k]).length;
  const drawQuestion = () => {
    const weak = INTERVIEW_QUESTIONS.filter((q) => iv.ratings[q.n] === "weak");
    const fresh = INTERVIEW_QUESTIONS.filter((q) => !iv.ratings[q.n]);
    const notGood = INTERVIEW_QUESTIONS.filter((q) => iv.ratings[q.n] !== "good");
    // Prioriza o que você nunca treinou e o que marcou como fraco, como no sorteio real tudo pode cair.
    const pool = Math.random() < 0.7 && (weak.length || fresh.length) ? [...weak, ...fresh] : (notGood.length ? notGood : INTERVIEW_QUESTIONS);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setIvDraw({ n: pick.n, phase: "prep", ts: Date.now() });
  };
  const finishDraw = (rating) => {
    const q = INTERVIEW_QUESTIONS.find((x) => x.n === ivDraw.n);
    setIvDraw(null);
    setRewardReturn("interview");
    awardXp(rating === "good" ? 25 : 20, "interview", { patch: { interview: { ...iv, ratings: { ...iv.ratings, [q.n]: rating } } } });
  };
  const ivElapsed = ivDraw ? Math.floor((Date.now() - ivDraw.ts) / 1000) : 0;
  const ivLimit = ivDraw ? (ivDraw.phase === "prep" ? ivPrepMin : ivTalkMin) * 60 : 0;
  const ivLeft = ivLimit - ivElapsed;
  const fmtClock = (sec) => `${sec < 0 ? "+" : ""}${String(Math.floor(Math.abs(sec) / 60)).padStart(2, "0")}:${String(Math.abs(sec) % 60).padStart(2, "0")}`;
  // Flash card phỏng vấn: Leitner 6 hộp, khoảng ôn 0-1-3-7-14-30 ngày.
  const FC_GAPS = [0, 1, 3, 7, 14, 30];
  const fcState = iv.cards || {};
  const todayStr = today();
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const fcInDeck = (c) => fcDeck === "all" || c.deck === fcDeck || c.group === fcDeck;
  const fcIsDue = (c) => !fcState[c.id] || fcState[c.id].due <= todayStr;
  const fcDeckCards = INTERVIEW_CARDS.filter(fcInDeck);
  const fcDueCount = fcDeckCards.filter(fcIsDue).length;
  const fcNewCount = fcDeckCards.filter((c) => !fcState[c.id]).length;
  const fcLearned = INTERVIEW_CARDS.filter((c) => (fcState[c.id]?.box || 0) >= 3).length;
  const startFc = (onlyDue) => {
    const pool = fcDeckCards.filter((c) => (onlyDue ? fcIsDue(c) : true));
    const ids = [...pool].sort(() => Math.random() - 0.5).slice(0, 20).map((c) => c.id);
    setFcQueue(ids); setFcIdx(0); setFcFlip(false); setFcStats({ known: 0, total: 0 });
  };
  const answerFc = (grade) => {
    const id = fcQueue[fcIdx];
    const cur = fcState[id] || { box: 0 };
    const box = grade === "know" ? Math.min(5, cur.box + 1) : grade === "hard" ? Math.max(1, cur.box) : 0;
    const due = grade === "again" ? todayStr : addDays(FC_GAPS[box] || 1);
    saveIv({ cards: { ...fcState, [id]: { box, due } } });
    const queue = grade === "again" && fcQueue.filter((x) => x === id).length < 3 ? [...fcQueue, id] : fcQueue;
    setFcQueue(queue);
    setFcStats((st) => ({ known: st.known + (grade === "know" ? 1 : 0), total: st.total + 1 }));
    setFcIdx(fcIdx + 1); setFcFlip(false);
  };
  const finishFc = () => {
    const xp = Math.min(40, 10 + fcStats.known * 2);
    const reviewed = fcStats.total;
    setFcQueue(null);
    setRewardReturn("interview");
    awardXp(xp, "flashcard", { cardsReviewed: reviewed });
  };
  const fcCurrent = fcQueue && fcIdx < fcQueue.length ? INTERVIEW_CARDS.find((c) => c.id === fcQueue[fcIdx]) : null;

  const ivVisible = INTERVIEW_QUESTIONS.filter((q) => (ivFilter === "new" ? !iv.ratings[q.n] : ivFilter === "weak" ? iv.ratings[q.n] === "weak" : true));
  const statusColor = (k) => (k === "done" ? LIGHT.teal : k === "doing" ? LIGHT.gold : LIGHT.muted);

  const remainingSeconds = writingStarted
    ? Math.max(0, WRITING_SUBJECT.timeLimitMinutes * 60 - Math.floor((Date.now() - writingStartTs) / 1000))
    : WRITING_SUBJECT.timeLimitMinutes * 60;
  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const ss = String(remainingSeconds % 60).padStart(2, "0");

  const isDash = view === "dashboard" || view === "plan" || view === "interview";

  return (
    <div className={isDash ? "tda-root tda-wide" : "tda-root"} style={{ ...bodyFont, background: isDash ? LIGHT.bg : COLORS.bg, color: isDash ? LIGHT.text : COLORS.text, borderRadius: 20, padding: isDash ? 0 : "28px 28px 32px", maxWidth: isDash ? 1440 : 900, margin: "0 auto", minHeight: "100vh", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
      <style>{FONT_IMPORT + RESPONSIVE_CSS}</style>
      {!isDash && (
        <svg width="100%" height="100%" viewBox="0 0 560 560" style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none" }}>
          {[80, 140, 210, 290, 370, 450].map((r, i) => <circle key={i} cx="480" cy="60" r={r} fill="none" stroke={COLORS.gold} strokeWidth="1" />)}
        </svg>
      )}

      {/* LOGIN */}
      {view === "login" && (
        <div style={{ position: "relative", textAlign: "center", paddingTop: 40 }}>
          <div style={{ ...displayFont, fontSize: 27.5, fontWeight: 600, marginBottom: 6 }}>Trilha do Aprovado</div>
          <div style={{ color: COLORS.muted, fontSize: 15, marginBottom: 28 }}>Chào mừng! Nhập tên để cá nhân hóa lộ trình học của bạn.</div>
          <div style={{ maxWidth: 320, margin: "0 auto", textAlign: "left" }}>
            <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 6 }}>Tên của bạn</label>
            <input style={inputStyle} value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Ví dụ: Minh" />
            <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 6 }}>Ngày thi (không bắt buộc)</label>
            <input type="date" style={inputStyle} value={examDateInput} onChange={(e) => setExamDateInput(e.target.value)} />
            <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 6 }}>Giờ thi</label>
            <input type="time" style={inputStyle} value={examTimeInput} onChange={(e) => setExamTimeInput(e.target.value)} />
            <button
              disabled={!nameInput.trim()}
              onClick={() => { persist({ ...progress, name: nameInput.trim(), examDate: examDateInput || null, examTime: examTimeInput || "08:00" }); setView("dashboard"); }}
              style={{ ...btnStyle(COLORS.gold, true), opacity: nameInput.trim() ? 1 : 0.4, marginTop: 6 }}
            >
              Bắt đầu hành trình <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {view === "settings" && (
        <div style={{ position: "relative" }}>
          <button onClick={() => setView("dashboard")} style={backBtnStyle}><ArrowLeft size={13} /> Lộ trình</button>
          <div style={{ ...displayFont, fontSize: 20.5, fontWeight: 600, margin: "12px 0 16px" }}>Cài đặt</div>
          <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 6 }}>Tên của bạn</label>
          <input style={inputStyle} value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
          <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 6 }}>Ngày thi</label>
          <input type="date" style={inputStyle} value={examDateInput} onChange={(e) => setExamDateInput(e.target.value)} />
          <label style={{ fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 6 }}>Giờ thi</label>
          <input type="time" style={inputStyle} value={examTimeInput} onChange={(e) => setExamTimeInput(e.target.value)} />
          <button disabled={!nameInput.trim()} onClick={saveSettings} style={{ ...btnStyle(COLORS.gold, true), opacity: nameInput.trim() ? 1 : 0.4 }}>Lưu thay đổi</button>
        </div>
      )}

      {/* HEADER (telas escuras: subject/flashcards/quiz/writing/reward) */}
      {view !== "login" && view !== "settings" && view !== "dashboard" && view !== "plan" && view !== "interview" && (
        <>
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div style={{ ...displayFont, fontSize: 25.5, fontWeight: 600, letterSpacing: 0.2 }}>Trilha do Aprovado</div>
              <div style={{ color: COLORS.muted, fontSize: 14.5, marginTop: 2 }}>Chào, {progress.name}!</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 999, padding: "6px 12px" }}>
                <Flame size={15} color={COLORS.gold} />
                <span style={{ ...monoFont, fontSize: 15 }}>{progress.streakDays} ngày</span>
              </div>
            </div>
          </div>

          <div style={{ position: "relative", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: COLORS.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trophy size={15} color={COLORS.bg} />
                </div>
                <span style={{ ...displayFont, fontWeight: 600, fontSize: 17 }}>Cấp {progress.level}</span>
              </div>
              <span style={{ ...monoFont, fontSize: 14, color: COLORS.muted }}>{progress.xp} / {xpMax} XP</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: COLORS.bg, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${xpPct}%`, background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.gold})`, transition: "width .5s ease" }} />
            </div>
          </div>
        </>
      )}

      {(view === "subject" || view === "flashcards" || view === "quiz" || view === "writing") && (
        <button onClick={() => setView(view === "subject" || view === "writing" ? "dashboard" : "subject")} style={backBtnStyle}>
          <ArrowLeft size={13} /> {view === "subject" || view === "writing" ? "Lộ trình" : subject?.name}
        </button>
      )}

      {/* PHỎNG VẤN VÒNG 2 */}
      {view === "interview" && (
        <div style={{ padding: "18px 16px 28px" }}>
          <button onClick={() => { setIvDraw(null); setView("dashboard"); }} style={{ ...backBtnStyle, color: LIGHT.muted }}><ArrowLeft size={13} /> Trang chủ</button>
          <div style={{ ...displayFont, fontSize: 24, fontWeight: 600, marginBottom: 2 }}>Phỏng vấn vòng 2</div>
          <div style={{ color: LIGHT.muted, fontSize: 14, marginBottom: 14 }}>Tối đa 30 phút · 100 điểm · không phúc khảo. Hội đồng chấm cấu trúc và lập trường hơn độ dài.</div>

          <div className="tda-dash-grid">
            <div style={lightCardBlock}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Mic size={16} color={LIGHT.gold} />
                <span style={{ ...displayFont, fontWeight: 600, fontSize: 15 }}>Tiến độ ôn phỏng vấn</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, textAlign: "center", marginBottom: 12 }}>
                {[["Đã luyện", `${ivRatedCount}/20`, LIGHT.text], ["Tốt", ivGoodCount, LIGHT.teal], ["Cần ôn", ivWeakCount, LIGHT.red], ["Câu hồ sơ", `${ivPreparedCount}/${profileKeys.length}`, LIGHT.purple]].map(([l, v, c]) => (
                  <div key={l}>
                    <div style={{ ...monoFont, fontSize: 20, fontWeight: 700, color: c }}>{v}</div>
                    <div style={{ fontSize: 11.5, color: LIGHT.muted }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: 7, borderRadius: 999, background: LIGHT.border, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ height: "100%", width: `${Math.round(((ivRatedCount + ivPreparedCount) / (20 + profileKeys.length)) * 100)}%`, background: `linear-gradient(90deg, ${LIGHT.teal}, ${LIGHT.gold})` }} />
              </div>
              <button onClick={() => setIvIntro(!ivIntro)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: LIGHT.purple, fontSize: 13, fontWeight: 600, marginBottom: ivIntro ? 8 : 0, display: "block", fontFamily: "'IBM Plex Sans', sans-serif" }}>{ivIntro ? "Ẩn cách dùng" : "Cách dùng và điểm mới bắt buộc phải nhắc"}</button>
              {ivIntro && INTERVIEW_INTRO.map((b, i) => <OutlineBlock key={i} b={b} />)}
              <a href={INTERVIEW_DOC_URL} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: LIGHT.purple, marginTop: 4 }}>Mở bản tài liệu đầy đủ <ExternalLink size={12} /></a>
            </div>

            <div style={{ ...lightCardBlock, border: `1px solid ${LIGHT.gold}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Shuffle size={16} color={LIGHT.gold} />
                <span style={{ ...displayFont, fontWeight: 600, fontSize: 15 }}>Bốc thăm như phòng thi</span>
              </div>
              {!ivDraw && (
                <>
                  <div style={{ fontSize: 13.5, color: LIGHT.muted, lineHeight: 1.6, marginBottom: 12 }}>
                    Bốc ngẫu nhiên một câu (ưu tiên câu chưa luyện và câu cần ôn), chuẩn bị rồi trình bày to thành tiếng theo đồng hồ. Dàn ý chỉ hiện sau khi bạn trình bày xong.
                  </div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 12, fontSize: 13, color: LIGHT.muted, alignItems: "center", flexWrap: "wrap" }}>
                    <label>Chuẩn bị <select value={ivPrepMin} onChange={(e) => setIvPrepMin(Number(e.target.value))} style={selectStyle}>{[3, 5, 7, 10].map((m) => <option key={m} value={m}>{m} phút</option>)}</select></label>
                    <label>Trình bày <select value={ivTalkMin} onChange={(e) => setIvTalkMin(Number(e.target.value))} style={selectStyle}>{[3, 5, 7].map((m) => <option key={m} value={m}>{m} phút</option>)}</select></label>
                  </div>
                  <button onClick={drawQuestion} style={lightBtnStyle(LIGHT.gold)}><Shuffle size={15} /> Bốc thăm câu hỏi</button>
                </>
              )}
              {ivDraw && (() => {
                const q = INTERVIEW_QUESTIONS.find((x) => x.n === ivDraw.n);
                return (
                  <>
                    <div style={{ fontSize: 12, color: LIGHT.muted, ...monoFont, marginBottom: 4 }}>CÂU {q.n} · {q.part}</div>
                    <div style={{ ...displayFont, fontWeight: 600, fontSize: 17, lineHeight: 1.45, marginBottom: 12 }}>{q.question}</div>
                    {ivDraw.phase !== "review" && (
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <Timer size={18} color={ivLeft < 0 ? LIGHT.red : LIGHT.gold} />
                        <span style={{ ...monoFont, fontSize: 30, fontWeight: 700, color: ivLeft < 0 ? LIGHT.red : LIGHT.text }}>{fmtClock(ivLeft)}</span>
                        <span style={{ fontSize: 13, color: LIGHT.muted }}>{ivDraw.phase === "prep" ? "chuẩn bị" : "trình bày"}{ivLeft < 0 ? " · quá giờ" : ""}</span>
                      </div>
                    )}
                    {ivDraw.phase === "prep" && (
                      <>
                        <div style={{ fontSize: 13, color: LIGHT.muted, marginBottom: 10 }}>Ghi ra giấy: câu chốt, 3 ý, liên hệ Việt Nam.</div>
                        <button onClick={() => setIvDraw({ ...ivDraw, phase: "talk", ts: Date.now() })} style={lightBtnStyle(LIGHT.gold)}><Mic size={15} /> Bắt đầu trình bày</button>
                      </>
                    )}
                    {ivDraw.phase === "talk" && (
                      <button onClick={() => setIvDraw({ ...ivDraw, phase: "review" })} style={lightBtnStyle(LIGHT.teal)}><Eye size={15} /> Kết thúc, xem dàn ý</button>
                    )}
                    {ivDraw.phase === "review" && (
                      <>
                        <div style={{ maxHeight: 380, overflowY: "auto", borderTop: `1px solid ${LIGHT.border}`, paddingTop: 10, marginBottom: 12 }}>
                          <AnswerSections q={q} />
                        </div>
                        <div style={{ fontSize: 13, color: LIGHT.muted, marginBottom: 8 }}>So với dàn ý, bạn trả lời thế nào?</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                          <button onClick={() => finishDraw("good")} style={lightBtnStyle(LIGHT.teal)}>Tốt</button>
                          <button onClick={() => finishDraw("ok")} style={lightBtnStyle(LIGHT.gold)}>Tạm được</button>
                          <button onClick={() => finishDraw("weak")} style={lightBtnStyle(LIGHT.red)}>Cần ôn lại</button>
                        </div>
                      </>
                    )}
                    <button onClick={() => setIvDraw(null)} style={{ background: "none", border: "none", color: LIGHT.muted, fontSize: 12.5, marginTop: 10, cursor: "pointer", ...bodyFont }}>Hủy lượt này</button>
                  </>
                );
              })()}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, margin: "8px 0 14px", flexWrap: "wrap" }}>
            {[["ban-do", "Bản đồ ghi nhớ"], ["flash", `Flash card (${INTERVIEW_CARDS.length})`], ["doi-ngoai", "20 câu đối ngoại"], ["ho-so", `Câu về hồ sơ & tình huống (${profileKeys.length})`]].map(([k, l]) => (
              <button key={k} onClick={() => setIvTab(k)} style={pillStyle(ivTab === k)}>{l}</button>
            ))}
            {ivTab === "doi-ngoai" && (
              <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                {[["all", "Tất cả"], ["new", "Chưa luyện"], ["weak", "Cần ôn"]].map(([k, l]) => (
                  <button key={k} onClick={() => setIvFilter(k)} style={{ ...pillStyle(ivFilter === k), fontSize: 12.5, padding: "6px 12px" }}>{l}</button>
                ))}
              </div>
            )}
          </div>

          {ivTab === "ban-do" && (
            <>
              <div style={{ ...lightCardBlock, fontSize: 14, lineHeight: 1.65 }}>
                <div style={{ ...displayFont, fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Nhớ 20 câu bằng 2 vế × 4 nhóm</div>
                Vế trái là <strong>Thế giới</strong> (câu 1 đến 10), vế phải là <strong>Việt Nam</strong> (câu 11 đến 20). Mỗi nhóm có một <strong>câu hỏi gợi nhớ</strong>: khi bốc thăm, hỏi mình câu đó là biết ngay đề thuộc khối kiến thức nào, rồi dùng mẹo ghi nhớ của từng câu để mở dàn ý. Đọc theo thứ tự trong nhóm: các câu trong một nhóm dùng chung kiến thức.
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => { setMapHide(!mapHide); setMapShown({}); }} style={pillStyle(mapHide)}>{mapHide ? "Hiện lại tên câu" : "Tự kiểm tra: ẩn tên câu"}</button>
                </div>
              </div>
              <div className="tda-dash-grid">
                {["Thế giới", "Việt Nam"].map((side) => (
                  <div key={side}>
                    <div style={{ ...displayFont, fontSize: 14, fontWeight: 600, margin: "8px 0 8px", color: LIGHT.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{side}</div>
                    {INTERVIEW_GROUPS.filter((g) => g.side === side).map((g) => (
                      <div key={g.id} style={lightCardBlock}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
                          <span style={{ ...monoFont, fontSize: 18, fontWeight: 700, color: LIGHT.gold }}>{g.id}</span>
                          <span style={{ ...displayFont, fontWeight: 600, fontSize: 16 }}>{g.name}</span>
                          <span style={{ fontSize: 13, color: LIGHT.purple, fontStyle: "italic", marginLeft: "auto" }}>"{g.hook}?"</span>
                        </div>
                        {g.qs.map(([n, t]) => {
                          const key = `${g.id}-${n}`;
                          const hidden = mapHide && !mapShown[key];
                          const r = iv.ratings[n];
                          return (
                            <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderTop: `1px solid ${LIGHT.border}` }}>
                              <span style={{ ...monoFont, fontSize: 13, fontWeight: 700, minWidth: 28, color: LIGHT.text }}>{n}</span>
                              {hidden ? (
                                <button onClick={() => setMapShown({ ...mapShown, [key]: true })} style={{ flex: 1, textAlign: "left", background: LIGHT.surfaceAlt, border: `1px dashed ${LIGHT.border}`, borderRadius: 8, padding: "4px 10px", color: LIGHT.muted, fontSize: 13, cursor: "pointer", ...bodyFont }}>Câu {n} hỏi gì? Nhấn để xem</button>
                              ) : (
                                <button onClick={() => { setIvTab("doi-ngoai"); setIvFilter("all"); setIvOpen(n); }} style={{ flex: 1, textAlign: "left", background: "none", border: "none", padding: 0, color: LIGHT.text, fontSize: 14, cursor: "pointer", ...bodyFont }}>{t}</button>
                              )}
                              {r && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, color: "#fff", background: RATING[r].color }}>{RATING[r].label}</span>}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {ivTab === "flash" && (
            <>
              {!fcQueue && (
                <div className="tda-dash-grid">
                  <div style={lightCardBlock}>
                    <div style={{ ...displayFont, fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Flash card phỏng vấn</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, textAlign: "center", marginBottom: 12 }}>
                      {[["Đến hạn", fcDueCount, LIGHT.gold], ["Thẻ mới", fcNewCount, LIGHT.purple], ["Đã thuộc", `${fcLearned}/${INTERVIEW_CARDS.length}`, LIGHT.teal]].map(([l, v, c]) => (
                        <div key={l}><div style={{ ...monoFont, fontSize: 22, fontWeight: 700, color: c }}>{v}</div><div style={{ fontSize: 12, color: LIGHT.muted }}>{l}</div></div>
                      ))}
                    </div>
                    <div style={{ fontSize: 13.5, color: LIGHT.muted, lineHeight: 1.6, marginBottom: 12 }}>
                      Mỗi câu đối ngoại có thẻ <strong>câu chốt</strong> và thẻ <strong>dàn ý</strong> (nêu đủ các ý); câu so sánh có thẻ cho từng tiêu chí. Thẻ nhớ rõ sẽ quay lại sau 1, 3, 7, 14, 30 ngày; thẻ quên quay lại ngay trong buổi.
                    </div>
                    <label style={{ fontSize: 13, color: LIGHT.muted }}>Bộ thẻ
                      <select value={fcDeck} onChange={(e) => setFcDeck(e.target.value)} style={{ ...selectStyle, marginLeft: 8 }}>
                        <option value="all">Tất cả</option>
                        <option value="doi-ngoai">20 câu đối ngoại</option>
                        <option value="ho-so">Câu hồ sơ & tình huống</option>
                        {INTERVIEW_GROUPS.map((g) => <option key={g.id} value={g.id}>Nhóm {g.id} · {g.name}</option>)}
                      </select>
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
                      <button disabled={!fcDueCount} onClick={() => startFc(true)} style={{ ...lightBtnStyle(LIGHT.gold), opacity: fcDueCount ? 1 : 0.4 }}><Layers size={15} /> Ôn thẻ đến hạn ({Math.min(20, fcDueCount)})</button>
                      <button onClick={() => startFc(false)} style={lightBtnStyle(LIGHT.teal)}><Shuffle size={15} /> Trộn ngẫu nhiên 20 thẻ</button>
                    </div>
                  </div>
                  <div style={lightCardBlock}>
                    <div style={{ ...displayFont, fontWeight: 600, fontSize: 15, marginBottom: 10 }}>Tiến độ theo nhóm</div>
                    {INTERVIEW_GROUPS.map((g) => {
                      const cs = INTERVIEW_CARDS.filter((c) => c.group === g.id);
                      const ok = cs.filter((c) => (fcState[c.id]?.box || 0) >= 3).length;
                      return (
                        <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: 13 }}>
                          <span style={{ ...monoFont, fontWeight: 700, color: LIGHT.gold, width: 16 }}>{g.id}</span>
                          <span style={{ width: 170, color: LIGHT.text }}>{g.name}</span>
                          <div style={{ flex: 1, height: 6, borderRadius: 999, background: LIGHT.border, overflow: "hidden" }}><div style={{ height: "100%", width: `${Math.round((ok / Math.max(1, cs.length)) * 100)}%`, background: LIGHT.teal }} /></div>
                          <span style={{ ...monoFont, color: LIGHT.muted, width: 44, textAlign: "right" }}>{ok}/{cs.length}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {fcQueue && fcCurrent && (
                <div style={{ maxWidth: 820, margin: "0 auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: LIGHT.muted, marginBottom: 8 }}>
                    <span>Thẻ {fcIdx + 1}/{fcQueue.length} · {fcCurrent.deck === "doi-ngoai" ? `Nhóm ${fcCurrent.group} · ${fcCurrent.label}` : fcCurrent.group}</span>
                    <button onClick={() => setFcQueue(null)} style={{ background: "none", border: "none", color: LIGHT.muted, cursor: "pointer", fontSize: 13, ...bodyFont }}>Dừng</button>
                  </div>
                  <div style={{ height: 5, borderRadius: 999, background: LIGHT.border, overflow: "hidden", marginBottom: 12 }}><div style={{ height: "100%", width: `${(fcIdx / fcQueue.length) * 100}%`, background: LIGHT.gold }} /></div>
                  <div onClick={() => setFcFlip(true)} style={{ ...lightCardBlock, minHeight: 260, cursor: fcFlip ? "default" : "pointer", border: `1px solid ${fcFlip ? LIGHT.teal : LIGHT.gold}`, padding: "22px 26px" }}>
                    <div style={{ fontSize: 17, lineHeight: 1.6, ...displayFont, fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: fcCurrent.front }} />
                    {!fcFlip && <div style={{ marginTop: 24, fontSize: 13, color: LIGHT.muted }}>Trả lời to thành tiếng, rồi nhấn vào thẻ để lật.</div>}
                    {fcFlip && <div className="tda-card-back" style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${LIGHT.border}`, fontSize: 14.5, lineHeight: 1.65, color: LIGHT.text }} dangerouslySetInnerHTML={{ __html: fcCurrent.back }} />}
                  </div>
                  {fcFlip && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      <button onClick={() => answerFc("again")} style={lightBtnStyle(LIGHT.red)}>Quên</button>
                      <button onClick={() => answerFc("hard")} style={lightBtnStyle(LIGHT.gold)}>Nhớ mang máng</button>
                      <button onClick={() => answerFc("know")} style={lightBtnStyle(LIGHT.teal)}>Nhớ rõ</button>
                    </div>
                  )}
                </div>
              )}

              {fcQueue && !fcCurrent && (
                <div style={{ ...lightCardBlock, maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
                  <div style={{ ...displayFont, fontWeight: 600, fontSize: 18, marginBottom: 6 }}>Xong buổi ôn</div>
                  <div style={{ fontSize: 14, color: LIGHT.muted, marginBottom: 14 }}>{fcStats.known}/{fcStats.total} lượt nhớ rõ. Thẻ quên sẽ quay lại hôm nay, thẻ nhớ rõ giãn dần lịch ôn.</div>
                  <button onClick={finishFc} style={lightBtnStyle(LIGHT.gold)}><Trophy size={15} /> Nhận +{Math.min(40, 10 + fcStats.known * 2)} XP</button>
                </div>
              )}
            </>
          )}

          {ivTab === "doi-ngoai" && (
            <>
              {ivVisible.length === 0 && <div style={{ fontSize: 14, color: LIGHT.muted, padding: "12px 0" }}>Không có câu nào trong bộ lọc này.</div>}
              {ivVisible.map((q, idx) => {
                const open = ivOpen === q.n;
                const r = iv.ratings[q.n];
                const showPart = idx === 0 || ivVisible[idx - 1].part !== q.part;
                return (
                  <Fragment key={q.n}>
                    {showPart && <div style={{ ...displayFont, fontSize: 14, fontWeight: 600, margin: "16px 0 8px", color: LIGHT.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{q.part}</div>}
                    <div style={{ ...lightCardBlock, padding: 0, overflow: "hidden", border: `1px solid ${open ? LIGHT.gold : LIGHT.border}` }}>
                      <button onClick={() => setIvOpen(open ? null : q.n)} style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left", background: "none", border: "none", padding: "14px 16px", cursor: "pointer", color: LIGHT.text, ...bodyFont }}>
                        <div style={{ ...monoFont, fontSize: 13, fontWeight: 700, color: LIGHT.gold, minWidth: 30, paddingTop: 2 }}>{q.n}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.5 }}>{q.question}</div>
                          <div style={{ fontSize: 12.5, color: LIGHT.muted, marginTop: 3 }}>{q.title}</div>
                        </div>
                        {r && <span style={{ fontSize: 11.5, fontWeight: 600, padding: "3px 9px", borderRadius: 999, color: "#fff", background: RATING[r].color, flexShrink: 0 }}>{RATING[r].label}</span>}
                        <ChevronRight size={16} color={LIGHT.muted} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .2s", flexShrink: 0, marginTop: 3 }} />
                      </button>
                      {open && (
                        <div style={{ padding: "0 16px 16px 58px" }}>
                          <AnswerSections q={q} />
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: LIGHT.muted, margin: "14px 0 6px" }}><PenLine size={14} /> Ghi chú của bạn (số liệu cập nhật, ví dụ riêng)</div>
                          <textarea value={iv.notes[`q${q.n}`] || ""} onChange={(e) => setIvNote(`q${q.n}`, e.target.value)} placeholder="Viết ý của bạn ở đây..." style={lightTextarea} />
                          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                            {Object.entries(RATING).map(([k, v]) => (
                              <button key={k} onClick={() => setIvRating(q.n, k)} style={{ border: `1px solid ${v.color}`, background: r === k ? v.color : "transparent", color: r === k ? "#fff" : v.color, borderRadius: 999, padding: "6px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", ...bodyFont }}>{v.label}</button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Fragment>
                );
              })}
            </>
          )}

          {ivTab === "ho-so" && (
            <>
              <div style={{ fontSize: 13.5, color: LIGHT.muted, lineHeight: 1.6, marginBottom: 6 }}>
                Không có đáp án mẫu: tự soạn câu trả lời ngắn, trung thực, có cấu trúc. Với câu tình huống, hướng đúng gần như luôn là báo cáo cấp có thẩm quyền và làm đúng quy trình.
              </div>
              {PROFILE_QUESTIONS.map((g, gi) => (
                <Fragment key={gi}>
                  <div style={{ ...displayFont, fontSize: 14, fontWeight: 600, margin: "16px 0 8px", color: LIGHT.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{g.group}</div>
                  <div className="tda-plan-grid">
                    {g.items.map((it, i) => {
                      const key = `p${gi}-${i}`;
                      const done = !!iv.prepared[key];
                      return (
                        <div key={key} style={{ ...lightCardBlock, opacity: done ? 0.85 : 1 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <button onClick={() => toggleIvPrepared(key)} title="Đánh dấu đã chuẩn bị" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", marginTop: 2 }}>
                              {done ? <CheckCircle2 size={18} color={LIGHT.teal} /> : <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${LIGHT.border}` }} />}
                            </button>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.5 }}>{it.q}</div>
                              {it.hint && <div style={{ fontSize: 12.5, color: LIGHT.muted, marginTop: 4, fontStyle: "italic", lineHeight: 1.5 }}>{it.hint}</div>}
                            </div>
                          </div>
                          <button onClick={() => setIvOpenP(ivOpenP === key ? null : key)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: 0, marginTop: 10, cursor: "pointer", color: LIGHT.purple, fontSize: 13, fontWeight: 600, ...bodyFont }}>
                            <Eye size={14} /> {ivOpenP === key ? "Ẩn gợi ý" : "Xem gợi ý trả lời, mẹo và lý do"}
                          </button>
                          {ivOpenP === key && <div style={{ marginTop: 10 }}><AnswerSections q={it} /></div>}
                          <textarea value={iv.notes[key] || ""} onChange={(e) => setIvNote(key, e.target.value)} placeholder="Câu trả lời của bạn..." style={{ ...lightTextarea, marginTop: 10, minHeight: 70 }} />
                        </div>
                      );
                    })}
                  </div>
                </Fragment>
              ))}
            </>
          )}
        </div>
      )}

      {/* TIẾN ĐỘ HỌC TẬP */}
      {view === "plan" && (
        <div style={{ padding: "18px 16px 28px" }}>
          <button onClick={() => setView("dashboard")} style={{ ...backBtnStyle, color: LIGHT.muted }}><ArrowLeft size={13} /> Trang chủ</button>
          <div style={{ ...displayFont, fontSize: 24, fontWeight: 600, marginBottom: 2 }}>Tiến độ học tập</div>
          <div style={{ color: LIGHT.muted, fontSize: 14, marginBottom: 14 }}>Lộ trình {STUDY_PLAN.length} bước, từ nền tảng đến đề thi tổng hợp</div>

          <div style={lightCardBlock}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 14, color: LIGHT.muted }}>Hoàn thành</span>
              <span style={{ ...monoFont, fontSize: 15, fontWeight: 700, color: LIGHT.gold }}>{planPct}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: LIGHT.border, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ height: "100%", width: `${planPct}%`, background: `linear-gradient(90deg, ${LIGHT.teal}, ${LIGHT.gold})`, transition: "width .4s ease" }} />
            </div>
            <div style={{ fontSize: 12.5, color: LIGHT.muted }}>{planDoneCount}/{STUDY_PLAN.length} bước đã xong · {materialsDoneCount}/{totalMaterials} tài liệu đã học</div>
            {currentStep && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${LIGHT.border}`, fontSize: 14.5 }}>
                <span style={{ color: LIGHT.muted }}>Bạn đang ở: </span>
                <span style={{ ...displayFont, fontWeight: 600 }}>Bước {STUDY_PLAN.indexOf(currentStep) + 1} · {currentStep.title}</span>
              </div>
            )}
          </div>

          <div className="tda-plan-grid">
          {STUDY_PLAN.map((st, idx) => {
            const k = stepStatus(st);
            const isCurrent = currentStep && currentStep.id === st.id;
            const showPhase = idx === 0 || STUDY_PLAN[idx - 1].phase !== st.phase;
            return (
              <Fragment key={st.id}>
                {showPhase && (
                  <div style={{ ...displayFont, fontSize: 14.5, fontWeight: 600, margin: "18px 0 8px", color: LIGHT.muted, textTransform: "uppercase", letterSpacing: 0.5, gridColumn: "1 / -1" }}>{st.phase}</div>
                )}
                <div style={{ ...lightCardBlock, border: `1px solid ${isCurrent ? LIGHT.gold : LIGHT.border}`, opacity: k === "done" ? 0.85 : 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: k === "done" ? LIGHT.teal : k === "doing" ? LIGHT.gold : LIGHT.surfaceAlt, color: k === "todo" ? LIGHT.muted : "#fff", border: k === "todo" ? `1px solid ${LIGHT.border}` : "none", ...monoFont, fontSize: 14, fontWeight: 700 }}>
                      {k === "done" ? <CheckCircle2 size={15} color="#fff" /> : idx + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...displayFont, fontWeight: 600, fontSize: 16 }}>{st.title}</div>
                      <div style={{ fontSize: 12.5, color: LIGHT.muted, marginTop: 3, lineHeight: 1.5 }}>{st.goal}</div>
                    </div>
                    <button onClick={() => cycleStepStatus(st)} title="Đổi trạng thái" style={{ flexShrink: 0, border: `1px solid ${statusColor(k)}`, color: statusColor(k), background: "transparent", borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", ...bodyFont }}>
                      {PLAN_STATUS[k].label}
                    </button>
                  </div>

                  <div style={{ marginTop: 12, borderTop: `1px solid ${LIGHT.border}`, paddingTop: 8 }}>
                    {st.materials.map((m, i) => {
                      const Icon = MATERIAL_ICON[m.type] || BookOpen;
                      const done = !!materialsDone[`${st.id}:${i}`];
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                          <button onClick={() => toggleMaterial(st, i)} title="Đánh dấu đã học" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex" }}>
                            {done ? <CheckCircle2 size={16} color={LIGHT.teal} /> : <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${LIGHT.border}` }} />}
                          </button>
                          <Icon size={14} color={done ? LIGHT.muted : LIGHT.purple} style={{ flexShrink: 0 }} />
                          {m.url ? (
                            <a href={m.url} target="_blank" rel="noreferrer" style={{ flex: 1, fontSize: 14, color: LIGHT.text, textDecoration: done ? "line-through" : "none", display: "flex", alignItems: "center", gap: 4 }}>
                              {m.label} <ExternalLink size={11} color={LIGHT.muted} />
                            </a>
                          ) : m.subjectId ? (
                            <button onClick={() => openStepSubject(m.subjectId)} style={{ flex: 1, textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 14, color: LIGHT.text, textDecoration: done ? "line-through" : "underline", ...bodyFont }}>
                              {m.label}
                            </button>
                          ) : (
                            <span style={{ flex: 1, fontSize: 14, color: LIGHT.text, textDecoration: done ? "line-through" : "none" }}>{m.label}</span>
                          )}
                          <span style={{ fontSize: 11, color: LIGHT.muted, ...monoFont, flexShrink: 0 }}>{MATERIAL_TAG[m.type]}</span>
                        </div>
                      );
                    })}
                  </div>

                  {st.subjectId && (
                    <button onClick={() => openStepSubject(st.subjectId)} style={{ ...lightBtnStyle(isCurrent ? LIGHT.gold : LIGHT.teal), marginTop: 10 }}>
                      Học ngay <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </Fragment>
            );
          })}
          </div>
          <div style={{ fontSize: 11.5, color: LIGHT.muted, marginTop: 6, lineHeight: 1.5 }}>
            Nhấn vào nhãn trạng thái để chuyển Chưa học → Đang học → Đã xong. Mở một bộ thẻ sẽ tự chuyển bước đó sang Đang học.
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {view === "dashboard" && (
        <div style={{ padding: "18px 16px 28px" }}>
          {/* Nav de ícones (equivalente à sidebar, em formato horizontal pra caber no celular) */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 2 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: LIGHT.gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Trophy size={16} color="#fff" />
            </div>
            {[
              { icon: Home, label: "Trang chủ", active: true, action: () => {} },
              { icon: ListChecks, label: "Tiến độ", action: () => setView("plan") },
              { icon: Layers, label: "Vòng 1", action: () => openDeckSubject(COMBINED_SUBJECT.id) },
              { icon: BookOpen, label: "Vòng 2", action: openWriting },
              { icon: Mic, label: "Phỏng vấn", action: openInterview },
              { icon: Settings, label: "Cài đặt", action: openSettings },
              { icon: LogOut, label: "Đăng xuất", action: () => setView("login") },
            ].map((it, i) => {
              const Icon = it.icon;
              return (
                <button key={i} onClick={it.action} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flexShrink: 0,
                  background: it.active ? LIGHT.surfaceAlt : "transparent", border: `1px solid ${it.active ? LIGHT.gold : "transparent"}`,
                  borderRadius: 10, padding: "6px 10px", cursor: "pointer",
                }}>
                  <Icon size={15} color={it.active ? LIGHT.gold : LIGHT.muted} />
                  <span style={{ fontSize: 10.5, color: it.active ? LIGHT.gold : LIGHT.muted, ...bodyFont }}>{it.label}</span>
                </button>
              );
            })}
          </div>

          {/* Saudação + busca */}
          <div style={{ ...displayFont, fontSize: 24, fontWeight: 600, marginBottom: 2 }}>Chào, {progress.name}!</div>
          <div style={{ color: LIGHT.muted, fontSize: 14, marginBottom: 14 }}>hành trình chinh phục kỳ thi công chức</div>
          <div style={{ position: "relative", marginBottom: 18 }}>
            <Search size={14} color={LIGHT.muted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm chuyên đề..."
              style={{ width: "100%", background: LIGHT.surface, border: `1px solid ${LIGHT.border}`, borderRadius: 10, padding: "10px 12px 10px 34px", fontSize: 15, color: LIGHT.text, boxSizing: "border-box", ...bodyFont }}
            />
          </div>

          {filteredSubjects ? (
            <>
              <div style={{ fontSize: 13, color: LIGHT.muted, marginBottom: 10 }}>{filteredSubjects.length} kết quả cho "{searchQuery}"</div>
              {filteredSubjects.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.id} onClick={() => (s.type === "writing" ? openWriting() : openDeckSubject(s.id))} style={lightCardStyle}>
                    <div style={lightIconBox}><Icon size={16} color={LIGHT.teal} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...displayFont, fontWeight: 600, fontSize: 15.5 }}>{s.name}</div>
                      <div style={{ color: LIGHT.muted, fontSize: 12, marginTop: 2 }}>{s.ref}</div>
                    </div>
                    <ChevronRight size={15} color={LIGHT.muted} />
                  </button>
                );
              })}
            </>
          ) : (
            <div className="tda-dash-grid">
              <div>
              {/* Lộ trình: đang ở đâu */}
              <button onClick={() => setView("plan")} style={{ ...lightCardBlock, width: "100%", textAlign: "left", cursor: "pointer", border: `1px solid ${LIGHT.gold}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ListChecks size={15} color={LIGHT.gold} />
                    <span style={{ fontSize: 14, color: LIGHT.muted }}>Tiến độ học tập</span>
                  </div>
                  <span style={{ ...monoFont, fontSize: 14, color: LIGHT.gold }}>{planPct}%</span>
                </div>
                <div style={{ ...displayFont, fontWeight: 600, fontSize: 16.5, color: LIGHT.text }}>
                  {currentStep ? `Bạn đang ở: Bước ${STUDY_PLAN.indexOf(currentStep) + 1} · ${currentStep.title}` : "Đã hoàn thành toàn bộ lộ trình"}
                </div>
                <div style={{ height: 6, borderRadius: 999, background: LIGHT.border, overflow: "hidden", margin: "10px 0 6px" }}>
                  <div style={{ height: "100%", width: `${planPct}%`, background: `linear-gradient(90deg, ${LIGHT.teal}, ${LIGHT.gold})` }} />
                </div>
                <div style={{ fontSize: 12, color: LIGHT.muted }}>{planDoneCount}/{STUDY_PLAN.length} bước · {materialsDoneCount}/{totalMaterials} tài liệu · nhấn để xem lộ trình</div>
              </button>

              {/* Hôm nay (countdown) */}
              <button onClick={openSettings} style={{ ...lightCardBlock, width: "100%", textAlign: "left", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: countdown ? 10 : 0 }}>
                  <Clock size={15} color={LIGHT.gold} />
                  <span style={{ fontSize: 14, color: LIGHT.muted }}>Hôm nay</span>
                </div>
                {countdown === null ? (
                  <div style={{ fontSize: 15, color: LIGHT.muted }}>Chưa đặt ngày thi — nhấn để đặt</div>
                ) : countdown.passed ? (
                  <div style={{ fontSize: 16, color: LIGHT.gold, fontWeight: 600 }}>Đã đến ngày thi! Chúc may mắn 🍀</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 12 }}>
                    {[["Ngày", countdown.days], ["Giờ", countdown.hours], ["Phút", countdown.minutes], ["Giây", countdown.seconds]].map(([label, val]) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ ...monoFont, fontSize: 22, fontWeight: 700, color: LIGHT.text }}>{String(val).padStart(2, "0")}</div>
                        <div style={{ fontSize: 11, color: LIGHT.muted }}>{label}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: 16, borderTop: `1px solid ${LIGHT.border}`, paddingTop: 10, marginTop: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: LIGHT.muted }}><Flame size={13} color={LIGHT.gold} /> {progress.streakDays} ngày liên tiếp</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: LIGHT.muted }}><Target size={13} color={LIGHT.teal} /> {DAILY_MISSIONS.filter((m) => missionValue(missionsToday, m) >= m.target).length}/3 nhiệm vụ</div>
                </div>
              </button>

              {/* Biểu đồ hoạt động */}
              <div style={lightCardBlock}>
                <div style={{ fontSize: 14, color: LIGHT.muted, marginBottom: 12 }}>Hoạt động 7 ngày qua</div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 70, gap: 6 }}>
                  {weekData.map((d) => (
                    <div key={d.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                      <div style={{ width: "100%", maxWidth: 20, height: Math.max(4, (d.xp / weekMax) * 54), borderRadius: 4, background: d.isToday ? LIGHT.gold : LIGHT.purple, opacity: d.isToday ? 1 : 0.55 }} />
                      <span style={{ fontSize: 10.5, color: LIGHT.muted, ...monoFont }}>{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nhiệm vụ hôm nay */}
              <div style={lightCardBlock}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Target size={14} color={LIGHT.teal} />
                    <span style={{ ...displayFont, fontWeight: 600, fontSize: 15 }}>Nhiệm vụ hôm nay</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, ...monoFont, fontSize: 13, color: LIGHT.gold }}>
                    <Flame size={12} color={LIGHT.gold} /> {missionStreak}
                  </div>
                </div>
                {DAILY_MISSIONS.map((m) => {
                  const val = missionValue(missionsToday, m);
                  const done = val >= m.target;
                  return (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 14, color: done ? LIGHT.text : LIGHT.muted }}>
                      {done ? <CheckCircle2 size={14} color={LIGHT.teal} /> : <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${LIGHT.border}`, flexShrink: 0 }} />}
                      <span style={{ flex: 1 }}>{m.label}</span>
                      <span style={{ ...monoFont, fontSize: 12 }}>{Math.min(val, m.target)}/{m.target}</span>
                    </div>
                  );
                })}
                {missionsAllDone && !missionsToday.claimed && (
                  <button onClick={claimMissionReward} style={{ ...lightBtnStyle(LIGHT.gold), marginTop: 6 }}>
                    Nhận thưởng (+{20 + Math.min(missionStreak, 5) * 4} XP)
                  </button>
                )}
                {missionsAllDone && missionsToday.claimed && (
                  <div style={{ textAlign: "center", fontSize: 12.5, color: LIGHT.teal, marginTop: 6 }}>Đã nhận thưởng hôm nay ✓</div>
                )}
                <div style={{ fontSize: 11.5, color: LIGHT.muted, marginTop: 10, lineHeight: 1.5 }}>
                  Bỏ lỡ nhiệm vụ chỉ làm mất chuỗi thưởng 🔥 — không mất XP hay cấp độ đã có.
                </div>
              </div>

              {/* Thống kê */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div style={{ ...lightCardBlock, marginBottom: 0, textAlign: "center" }}>
                  <RingStat pct={vong1Pct} color={LIGHT.teal} label="Tiến độ Vòng 1" sub={`${progress.subjectsEverTouched.filter((id) => STAGE1_SUBJECTS.some((s) => s.id === id)).length}/${STAGE1_SUBJECTS.length} chuyên đề`} />
                </div>
                <div style={{ ...lightCardBlock, marginBottom: 0, textAlign: "center" }}>
                  <RingStat pct={quizAccuracyPct ?? 0} color={LIGHT.purple} label="Độ chính xác" sub={quizAccuracyPct === null ? "Chưa có dữ liệu" : `${progress.quizStats.correct}/${progress.quizStats.total} câu`} showDash={quizAccuracyPct === null} />
                </div>
              </div>
              <div style={{ ...lightCardBlock, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: LIGHT.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trophy size={16} color="#fff" />
                  </div>
                  <div>
                    <div style={{ ...displayFont, fontWeight: 600, fontSize: 16 }}>Cấp {progress.level}</div>
                    <div style={{ fontSize: 12, color: LIGHT.muted }}>{progress.xp} / {xpMax} XP · {progress.totalCardsReviewed} thẻ đã ôn</div>
                  </div>
                </div>
                <div style={{ width: 60, height: 6, borderRadius: 999, background: LIGHT.border, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${xpPct}%`, background: LIGHT.gold }} />
                </div>
              </div>

              </div>
              <div>
              {/* Chuyên đề */}
              <div style={{ ...displayFont, fontSize: 14.5, fontWeight: 600, margin: "18px 0 8px", color: LIGHT.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Vòng 1 · Kiến thức chung</div>
              <button onClick={() => openDeckSubject(COMBINED_SUBJECT.id)} style={{ ...lightCardStyle, border: `1px solid ${LIGHT.gold}` }}>
                <div style={{ ...lightIconBox, background: "#FBF1DC" }}><Trophy size={16} color={LIGHT.gold} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...displayFont, fontWeight: 600, fontSize: 15.5 }}>{COMBINED_SUBJECT.name}</div>
                  <div style={{ color: LIGHT.muted, fontSize: 12, marginTop: 2 }}>{COMBINED_SUBJECT.ref}</div>
                </div>
                <ChevronRight size={15} color={LIGHT.muted} />
              </button>
              <div style={{ fontSize: 12, color: LIGHT.muted, margin: "12px 0 8px" }}>Hoặc luyện riêng từng chuyên đề:</div>
              {STAGE1_SUBJECTS.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.id} onClick={() => openDeckSubject(s.id)} style={lightCardStyle}>
                    <div style={lightIconBox}><Icon size={16} color={LIGHT.teal} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...displayFont, fontWeight: 600, fontSize: 15.5 }}>{s.name}</div>
                      <div style={{ color: LIGHT.muted, fontSize: 12, marginTop: 2 }}>{s.ref}</div>
                    </div>
                    <ChevronRight size={15} color={LIGHT.muted} />
                  </button>
                );
              })}

              <div style={{ ...displayFont, fontSize: 14.5, fontWeight: 600, margin: "18px 0 8px", color: LIGHT.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Vòng 2 · Kỹ năng ngôn ngữ</div>
              <button onClick={openWriting} style={lightCardStyle}>
                <div style={lightIconBox}><WRITING_SUBJECT.icon size={16} color={LIGHT.teal} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...displayFont, fontWeight: 600, fontSize: 15.5 }}>{WRITING_SUBJECT.name}</div>
                  <div style={{ color: LIGHT.muted, fontSize: 12, marginTop: 2 }}>{WRITING_SUBJECT.ref}</div>
                </div>
                <ChevronRight size={15} color={LIGHT.muted} />
              </button>

              {/* Mini calendário */}
              <div style={lightCardBlock}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <CalendarDays size={14} color={LIGHT.teal} />
                  <span style={{ ...displayFont, fontWeight: 600, fontSize: 15 }}>Tháng {calMonth + 1}, {calYear}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
                  {WEEKDAYS_VI.map((w) => <div key={w} style={{ textAlign: "center", fontSize: 11, color: LIGHT.muted, ...monoFont }}>{w}</div>)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                  {calCells.map((d, i) => {
                    if (!d) return <div key={i} />;
                    const key = toDateKey(calYear, calMonth, d);
                    const studied = progress.sessionDates.includes(key);
                    const isToday = key === todayKey;
                    return (
                      <div key={i} style={{
                        aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, fontSize: 12,
                        ...monoFont, color: isToday ? "#fff" : LIGHT.text,
                        background: isToday ? LIGHT.gold : studied ? "rgba(46,154,118,0.12)" : "transparent",
                        border: studied && !isToday ? `1px solid ${LIGHT.teal}` : "1px solid transparent",
                        fontWeight: isToday ? 700 : 400,
                      }}>{d}</div>
                    );
                  })}
                </div>
              </div>

              {/* Bảng thành tích */}
              <div style={{ ...displayFont, fontSize: 15.5, fontWeight: 600, margin: "20px 0 10px" }}>Bảng thành tích</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {TIPS.map((tip, i) => {
                  const Icon = tip.icon;
                  const unlocked = progress.tipsSeen.includes(i);
                  return (
                    <div key={i} title={unlocked ? tip.title : "Chưa mở khóa"} style={{
                      aspectRatio: "1", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                      background: unlocked ? "#FBF1DC" : LIGHT.surface,
                      border: `1px solid ${unlocked ? LIGHT.gold : LIGHT.border}`, opacity: unlocked ? 1 : 0.45,
                    }}>
                      <Icon size={14} color={unlocked ? LIGHT.gold : LIGHT.muted} />
                    </div>
                  );
                })}
              </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBJECT (deck) */}
      {view === "subject" && subject && (
        <div>
          <div style={{ ...displayFont, fontSize: 20.5, fontWeight: 600, marginBottom: 4 }}>{subject.name}</div>
          <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 20 }}>{subject.ref}</div>
          <button onClick={startFlashcards} style={subjectCardStyle}>
            <div style={iconBoxStyle}><Layers size={17} color={COLORS.teal} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ ...displayFont, fontWeight: 600, fontSize: 16.5 }}>Flash card</div>
              <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>{subject.flashcards.length} thẻ · +5 đến 15 XP/thẻ</div>
            </div>
            <ChevronRight size={16} color={COLORS.muted} />
          </button>
          <button onClick={startQuiz} style={subjectCardStyle}>
            <div style={iconBoxStyle}><BookOpen size={17} color={COLORS.teal} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ ...displayFont, fontWeight: 600, fontSize: 16.5 }}>Đề thi thử</div>
              <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>{subject.quiz.length} câu hỏi · tối đa +{subject.quiz.length * 15} XP</div>
            </div>
            <ChevronRight size={16} color={COLORS.muted} />
          </button>
        </div>
      )}

      {/* FLASHCARDS */}
      {view === "flashcards" && subject && (
        <div>
          <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 10, ...monoFont }}>thẻ {cardIndex + 1} / {subject.flashcards.length}</div>
          <div onClick={() => setFlipped((f) => !f)} style={{ background: flipped ? COLORS.surfaceAlt : COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, minHeight: 170, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 22, cursor: "pointer", marginBottom: 16 }}>
            <div style={{ ...displayFont, fontSize: flipped ? 15 : 17, fontWeight: 500, lineHeight: 1.5 }}>{flipped ? subject.flashcards[cardIndex].back : subject.flashcards[cardIndex].front}</div>
          </div>
          <div style={{ textAlign: "center", color: COLORS.muted, fontSize: 13, marginBottom: 16 }}>{flipped ? "Chạm để xem câu hỏi" : "Chạm vào thẻ để lật"}</div>
          {flipped && (
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => advanceCard(false, subject)} style={btnStyle(COLORS.red)}><XCircle size={15} /> Chưa nhớ</button>
              <button onClick={() => advanceCard(true, subject)} style={btnStyle(COLORS.teal)}><CheckCircle2 size={15} /> Đã nhớ!</button>
            </div>
          )}
        </div>
      )}

      {/* QUIZ */}
      {view === "quiz" && subject && (
        <div>
          <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 10, ...monoFont }}>câu {qIndex + 1} / {subject.quiz.length}</div>
          <div style={{ ...displayFont, fontSize: 18, fontWeight: 500, marginBottom: 14, lineHeight: 1.5 }}>{subject.quiz[qIndex].q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {subject.quiz[qIndex].options.map((opt, i) => {
              const isCorrect = i === subject.quiz[qIndex].correct, isSelected = selected === i;
              let border = COLORS.border, bg = "transparent";
              if (selected !== null) {
                if (isCorrect) { border = COLORS.teal; bg = "rgba(62,180,137,0.12)"; }
                else if (isSelected) { border = COLORS.red; bg = "rgba(224,102,122,0.12)"; }
              }
              return (
                <button key={i} disabled={selected !== null} onClick={() => setSelected(i)} style={{ textAlign: "left", padding: "11px 14px", borderRadius: 10, border: `1px solid ${border}`, background: bg, color: COLORS.text, cursor: selected === null ? "pointer" : "default", fontSize: 15.5, ...bodyFont }}>{opt}</button>
              );
            })}
          </div>
          {selected !== null && <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 12, fontSize: 14.5, color: COLORS.muted, marginBottom: 14 }}>{subject.quiz[qIndex].why}</div>}
          {selected !== null && <button onClick={() => advanceQuiz(subject)} style={btnStyle(COLORS.gold, true)}>{qIndex === subject.quiz.length - 1 ? "Xem kết quả" : "Câu tiếp theo"} <ChevronRight size={15} /></button>}
        </div>
      )}

      {/* WRITING (Vòng 2) */}
      {view === "writing" && (
        <div>
          <div style={{ ...displayFont, fontSize: 20.5, fontWeight: 600, marginBottom: 4 }}>{WRITING_SUBJECT.name}</div>
          <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 18 }}>{WRITING_SUBJECT.ref}</div>

          {!writingStarted && !feedbackText && (
            <div>
              <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16, fontSize: 14.5, color: COLORS.muted, lineHeight: 1.7, marginBottom: 16 }}>
                Bài thi gồm 3 phần: (1) đọc hiểu + tóm tắt + trả lời câu hỏi, (2) dịch trích đoạn sang tiếng Việt, (3) dịch một bài viết sang tiếng Bồ Đào Nha. Thời gian làm bài: {WRITING_SUBJECT.timeLimitMinutes} phút. Khi nộp bài, bạn có thể nhận phản hồi từ AI hoặc tự chấm theo checklist.
              </div>
              <button onClick={() => {
                const startedAt = Date.now();
                const draft = { startedAt, summaryText: "", answers: ["", "", ""], translationVi: "", translationPt: "" };
                setWritingStarted(true); setWritingStartTs(startedAt);
                persist({ ...progress, writingDraft: draft });
              }} style={btnStyle(COLORS.gold, true)}>Bắt đầu làm bài ({WRITING_SUBJECT.timeLimitMinutes} phút)</button>
            </div>
          )}

          {writingStarted && !feedbackText && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", background: COLORS.surface, border: `1px solid ${remainingSeconds === 0 ? COLORS.red : COLORS.gold}`, borderRadius: 12, padding: "10px 14px", marginBottom: 18, ...monoFont, fontSize: 18.5 }}>
                <Clock size={15} color={remainingSeconds === 0 ? COLORS.red : COLORS.gold} /> {mm}:{ss} {remainingSeconds === 0 && <span style={{ fontSize: 12.5, color: COLORS.red }}>(Hết giờ)</span>}
              </div>

              <SectionTitle>Phần 1 · Đọc hiểu, tóm tắt & trả lời câu hỏi</SectionTitle>
              <TextBlock>{WRITING_SUBJECT.content.readingText}</TextBlock>
              <label style={labelStyle}>Tóm tắt (250–300 từ)</label>
              <textarea style={textareaStyle} value={summaryText} onChange={(e) => { const v = e.target.value; setSummaryText(v); saveDraftDebounced({ startedAt: writingStartTs, summaryText: v, answers, translationVi, translationPt }); }} placeholder="Viết tóm tắt ở đây..." />
              {WRITING_SUBJECT.content.questions.map((q, i) => (
                <div key={i}>
                  <label style={labelStyle}>{q}</label>
                  <textarea style={{ ...textareaStyle, minHeight: 60 }} value={answers[i]} onChange={(e) => { const next = [...answers]; next[i] = e.target.value; setAnswers(next); saveDraftDebounced({ startedAt: writingStartTs, summaryText, answers: next, translationVi, translationPt }); }} />
                </div>
              ))}

              <SectionTitle>Phần 2 · Dịch sang tiếng Việt</SectionTitle>
              <TextBlock>{WRITING_SUBJECT.content.excerptToVietnamese}</TextBlock>
              <label style={labelStyle}>Bản dịch tiếng Việt</label>
              <textarea style={textareaStyle} value={translationVi} onChange={(e) => { const v = e.target.value; setTranslationVi(v); saveDraftDebounced({ startedAt: writingStartTs, summaryText, answers, translationVi: v, translationPt }); }} placeholder="Viết bản dịch ở đây..." />

              <SectionTitle>Phần 3 · Dịch sang tiếng Bồ Đào Nha</SectionTitle>
              <TextBlock>{WRITING_SUBJECT.content.sourceToPortuguese}</TextBlock>
              <label style={labelStyle}>Bản dịch tiếng Bồ Đào Nha</label>
              <textarea style={textareaStyle} value={translationPt} onChange={(e) => { const v = e.target.value; setTranslationPt(v); saveDraftDebounced({ startedAt: writingStartTs, summaryText, answers, translationVi, translationPt: v }); }} placeholder="Escreva a tradução aqui..." />

              <button onClick={requestFeedback} disabled={feedbackLoading} style={{ ...btnStyle(COLORS.gold, true), opacity: feedbackLoading ? 0.6 : 1 }}>
                {feedbackLoading ? "Đang chấm bài..." : "Nộp bài & nhận phản hồi"}
              </button>
            </div>
          )}

          {feedbackText && (
            <div>
              <div style={{ ...displayFont, fontSize: 16, fontWeight: 600, color: COLORS.gold, marginBottom: 10 }}>
                {feedbackError ? "Không thể chấm bằng AI — tự đánh giá theo checklist:" : "Phản hồi từ AI"}
              </div>
              {!feedbackError && (
                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16, fontSize: 14.5, color: COLORS.text, lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 16 }}>
                  {feedbackText}
                </div>
              )}
              {feedbackError && (
                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16, marginBottom: 16 }}>
                  {CHECKLIST_CRITERIA.map((c, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, marginBottom: 8, cursor: "pointer" }}>
                      <input type="checkbox" checked={!!checklist[i]} onChange={() => setChecklist({ ...checklist, [i]: !checklist[i] })} />
                      {c}
                    </label>
                  ))}
                </div>
              )}
              <button onClick={() => awardXp(40)} style={btnStyle(COLORS.gold, true)}>Hoàn tất buổi luyện tập (+40 XP)</button>
            </div>
          )}
        </div>
      )}

      {/* REWARD */}
      {view === "reward" && rewardTip && (
        <div style={{ textAlign: "center", padding: "8px 4px" }}>
          {leveledUp && <div style={{ ...displayFont, color: COLORS.gold, fontSize: 15, fontWeight: 600, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>✦ Bạn đã lên cấp! ✦</div>}
          <div style={{ ...displayFont, fontSize: 23, fontWeight: 600, marginBottom: 4 }}>Hoàn thành phiên học</div>
          <div style={{ ...monoFont, color: COLORS.teal, fontSize: 18.5, marginBottom: 20 }}>+{sessionXp} XP</div>
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.gold}`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.surfaceAlt, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <rewardTip.icon size={19} color={COLORS.gold} />
            </div>
            <div style={{ ...displayFont, fontSize: 16, fontWeight: 600, marginBottom: 6, color: COLORS.gold }}>Mở khóa phần thưởng: {rewardTip.title}</div>
            <div style={{ fontSize: 14.5, color: COLORS.muted, lineHeight: 1.6 }}>{rewardTip.body}</div>
          </div>
          <button onClick={() => { setView(rewardReturn); setRewardReturn("dashboard"); }} style={btnStyle(COLORS.gold, true)}><ArrowLeft size={15} /> {rewardReturn === "interview" ? "Về phần phỏng vấn" : "Về lộ trình"}</button>
        </div>
      )}
    </div>
  );

  function advanceCard(knew, subj) {
    const xp = knew ? 15 : 5;
    if (cardIndex + 1 < subj.flashcards.length) { accumRef.current += xp; setCardIndex((i) => i + 1); setFlipped(false); }
    else { awardXp(xp + accumRef.current + 10, "flashcard", { cardsReviewed: subj.flashcards.length }); accumRef.current = 0; }
  }

  function advanceQuiz(subj) {
    const correct = selected === subj.quiz[qIndex].correct;
    const gained = correct ? 15 : 3;
    if (qIndex + 1 < subj.quiz.length) {
      quizAccumRef.current += gained;
      if (correct) quizCorrectRef.current += 1;
      setQIndex((i) => i + 1); setSelected(null);
    } else {
      const total = quizAccumRef.current + gained;
      const totalCorrect = quizCorrectRef.current + (correct ? 1 : 0);
      quizAccumRef.current = 0; quizCorrectRef.current = 0;
      awardXp(total, "quiz", { quizCorrect: totalCorrect, quizTotal: subj.quiz.length });
    }
  }

  async function requestFeedback() {
    // Nota: chamada direta à API da Anthropic. Só funciona dentro do preview
    // de artifacts do Claude.ai (que injeta a autenticação). Rodando local via
    // `npm run dev`, essa chamada falha e o app cai no checklist de autoavaliação.
    setFeedbackLoading(true);
    setFeedbackError(false);
    const prompt = `Bạn là giám khảo chấm bài thi viết tiếng Bồ Đào Nha (vòng 2) cho kỳ thi công chức ngoại giao Việt Nam.
Tiêu chí: nội dung đầy đủ và đúng trọng tâm, từ ngữ chính xác (đặc biệt thuật ngữ đối ngoại), ngữ pháp, văn phong, chính tả, không chép nguyên văn, không sai chức danh/tên cơ quan. Thang điểm: 35 điểm, tối thiểu 17,5 để đạt.

Bài làm của thí sinh:
--- Phần 1: Tóm tắt ---
${summaryText || "(chưa trả lời)"}
--- Phần 1: Trả lời câu hỏi ---
${answers.map((a, i) => `${i + 1}. ${a || "(chưa trả lời)"}`).join("\n")}
--- Phần 2: Dịch sang tiếng Việt ---
${translationVi || "(chưa trả lời)"}
--- Phần 3: Dịch sang tiếng Bồ Đào Nha ---
${translationPt || "(chưa trả lời)"}

Hãy nhận xét ngắn gọn từng phần bằng tiếng Việt, nêu điểm mạnh, điểm cần cải thiện, và ước tính điểm mỗi phần cùng tổng điểm ước tính trên 35. Ghi rõ đây chỉ là ước tính tham khảo.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await response.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
      if (!text) throw new Error("empty");
      setFeedbackText(text);
      persist({ ...progressRef.current, writingDraft: null });
    } catch (e) {
      console.error("Lỗi khi lấy phản hồi AI:", e);
      setFeedbackError(true);
      setFeedbackText(" ");
      persist({ ...progressRef.current, writingDraft: null });
    } finally {
      setFeedbackLoading(false);
    }
  }
}

const RATING = {
  good: { label: "Tốt", color: "#2E9A76" },
  ok: { label: "Tạm được", color: "#C79A2E" },
  weak: { label: "Cần ôn", color: "#D9536B" },
};

// Os textos do documento já vêm escapados (só <strong>/<em>), por isso o innerHTML é seguro aqui.
function OutlineBlock({ b }) {
  const txt = { fontSize: 14, lineHeight: 1.65, color: LIGHT.text };
  if (b.t === "p") return <p style={{ ...txt, margin: "0 0 10px" }} dangerouslySetInnerHTML={{ __html: b.h }} />;
  if (b.t === "ol" || b.t === "ul") {
    const Tag = b.t;
    return (
      <Tag style={{ ...txt, margin: "0 0 10px", paddingLeft: 22 }}>
        {b.items.map((it, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            <span dangerouslySetInnerHTML={{ __html: it.h }} />
            {it.sub && it.sub.length > 0 && (
              <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>{it.sub.map((sh, j) => <li key={j} dangerouslySetInnerHTML={{ __html: sh }} />)}</ul>
            )}
          </li>
        ))}
      </Tag>
    );
  }
  if (b.t === "table") {
    return (
      <div style={{ overflowX: "auto", margin: "0 0 12px" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13, lineHeight: 1.5 }}>
          <tbody>
            {b.rows.map((row, ri) => (
              <tr key={ri} style={{ background: ri === 0 ? LIGHT.surfaceAlt : "transparent" }}>
                {row.map((c, ci) => (
                  <td key={ci} style={{ border: `1px solid ${LIGHT.border}`, padding: "7px 9px", verticalAlign: "top", fontWeight: ri === 0 || ci === 0 ? 600 : 400 }} dangerouslySetInnerHTML={{ __html: c }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

function AnswerSections({ q }) {
  const head = (Icon, label, color) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color, margin: "4px 0 8px" }}>
      <Icon size={14} color={color} /> {label}
    </div>
  );
  const boxText = { fontSize: 14, lineHeight: 1.65, color: LIGHT.text, margin: 0 };
  return (
    <div>
      {head(CheckCircle2, q.traloi ? "Gợi ý trả lời" : "Câu trả lời", LIGHT.teal)}
      {q.blocks ? q.blocks.map((b, i) => <OutlineBlock key={i} b={b} />) : <p style={{ ...boxText, marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: q.traloi }} />}
      {q.meo && (
        <div style={{ background: "#FBF1DC", border: `1px solid ${LIGHT.gold}`, borderRadius: 12, padding: "10px 14px", margin: "6px 0 10px" }}>
          {head(Brain, "Mẹo ghi nhớ", LIGHT.gold)}
          <p style={boxText} dangerouslySetInnerHTML={{ __html: q.meo }} />
        </div>
      )}
      {q.visao && (
        <div style={{ background: "#F1F0FF", border: "1px solid #CFCBFF", borderRadius: 12, padding: "10px 14px", margin: "0 0 6px" }}>
          {head(Target, "Vì sao trả lời như vậy", LIGHT.purple)}
          <p style={boxText} dangerouslySetInnerHTML={{ __html: q.visao }} />
        </div>
      )}
    </div>
  );
}

function pillStyle(active) {
  return { border: `1px solid ${active ? LIGHT.gold : LIGHT.border}`, background: active ? "#FBF1DC" : LIGHT.surface, color: active ? LIGHT.text : LIGHT.muted, borderRadius: 999, padding: "8px 16px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif" };
}
const selectStyle = { marginLeft: 6, padding: "5px 8px", borderRadius: 8, border: `1px solid ${LIGHT.border}`, background: LIGHT.surface, color: LIGHT.text, fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif" };
const lightTextarea = { width: "100%", minHeight: 80, boxSizing: "border-box", border: `1px solid ${LIGHT.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 14, lineHeight: 1.55, color: LIGHT.text, background: LIGHT.surfaceAlt, resize: "vertical", fontFamily: "'IBM Plex Sans', sans-serif" };

function SectionTitle({ children }) {
  return <div style={{ ...displayFont, fontSize: 15.5, fontWeight: 600, margin: "18px 0 8px", color: COLORS.gold }}>{children}</div>;
}
function TextBlock({ children }) {
  return <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 14, fontSize: 14, color: COLORS.muted, lineHeight: 1.6, marginBottom: 10 }}>{children}</div>;
}
function RingStat({ pct, color, label, sub, showDash }) {
  return (
    <>
      <div style={{ width: 54, height: 54, borderRadius: "50%", margin: "0 auto 8px", background: `conic-gradient(${color} ${pct * 3.6}deg, ${LIGHT.border} 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: LIGHT.surface, display: "flex", alignItems: "center", justifyContent: "center", ...monoFont, fontSize: 12.5, fontWeight: 700, color: LIGHT.text }}>
          {showDash ? "--" : `${pct}%`}
        </div>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: LIGHT.text }}>{label}</div>
      <div style={{ fontSize: 11, color: LIGHT.muted, marginTop: 2 }}>{sub}</div>
    </>
  );
}

const labelStyle = { fontSize: 13, color: COLORS.muted, display: "block", marginBottom: 6, marginTop: 4 };
const backBtnStyle = { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: COLORS.muted, fontSize: 14.5, cursor: "pointer", padding: 0, marginBottom: 16, ...bodyFont };
const subjectCardStyle = { width: "100%", display: "flex", alignItems: "center", gap: 14, textAlign: "left", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer", color: COLORS.text };
const iconBoxStyle = { width: 38, height: 38, borderRadius: 10, background: COLORS.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };

const lightCardStyle = { width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left", background: LIGHT.surface, border: `1px solid ${LIGHT.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 9, cursor: "pointer", color: LIGHT.text, boxShadow: "0 1px 2px rgba(20,23,50,0.04)" };
const lightIconBox = { width: 34, height: 34, borderRadius: 9, background: LIGHT.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const lightCardBlock = { background: LIGHT.surface, border: `1px solid ${LIGHT.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 14, boxShadow: "0 1px 2px rgba(20,23,50,0.04)" };
function lightBtnStyle(color) {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 16px", borderRadius: 10, border: "none", background: color, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif" };
}

function btnStyle(color, full) {
  return { flex: full ? "unset" : 1, width: full ? "100%" : "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 16px", borderRadius: 10, border: `1px solid ${color}`, background: "transparent", color, fontSize: 15.5, fontWeight: 500, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif" };
}
