import { PlayCircle, FileText, Layers, Scale, BookOpen } from "lucide-react";
import { INTERVIEW_DOC_URL } from "./interviewData.js";

const MATERIAL_BASE = import.meta.env.BASE_URL;

/* ---------------------------------------------------------
   LỘ TRÌNH HỌC — đi từ nền tảng đến đề thi tổng hợp
   type: video | doc | deck | law | note
--------------------------------------------------------- */
export const STUDY_PLAN = [
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

export const PLAN_STATUS = {
  todo: { label: "Chưa học", next: "doing" },
  doing: { label: "Đang học", next: "done" },
  done: { label: "Đã xong", next: "todo" },
};
export const MATERIAL_ICON = { video: PlayCircle, doc: FileText, deck: Layers, law: Scale, note: BookOpen };
export const MATERIAL_TAG = { video: "Video", doc: "Bài đọc", deck: "Luyện tập", law: "Văn bản", note: "Tài liệu" };
