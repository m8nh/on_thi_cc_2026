import { PlayCircle, FileText, Layers, Scale, BookOpen } from "lucide-react";
import { INTERVIEW_DOC_URL } from "./interviewData.js";
import { KTC_GROUPS, KTC_MOCK_ID, MOCK_EXAM, ktcDocsInGroup, ktcQuestionTotal, priorityStars } from "./ktc/vanBan.js";

const MATERIAL_BASE = import.meta.env.BASE_URL;

// "1. NĐ 306/2026 … ★★★ · 180 câu" — văn bản sem ngân hàng mostram "trọng tâm".
function ktcMaterialLabel(doc) {
  const total = ktcQuestionTotal(doc);
  return `${doc.no}. ${doc.name} ${priorityStars(doc.priority)} · ${total ? `${total} câu` : "trọng tâm"}`;
}

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
  ...KTC_GROUPS.map((g, i) => {
    const docs = ktcDocsInGroup(g.id);
    return {
      id: `k${i + 1}-${g.id}`, phase: "Vòng 1", title: g.title, goal: g.goal,
      subjectId: docs[0].id,
      materials: docs.flatMap((d) => [
        ...(d.video ? [{ type: "video", label: `Video ${d.name} (giọng Nhật Phong, ${d.video.length})`, url: `${MATERIAL_BASE}materials/${d.video.file}` }] : []),
        { type: "deck", label: ktcMaterialLabel(d), subjectId: d.id },
      ]),
    };
  }),
  {
    id: "k6-thi-thu", phase: "Vòng 1", title: `Thi thử Vòng 1 (${MOCK_EXAM.questions} câu / ${MOCK_EXAM.minutes} phút)`,
    goal: "Làm đề trộn như thi thật; mục tiêu ổn định trên 45/60 để có biên an toàn so với mức đạt 30/60. Sau mỗi đề, ôn lại câu sai theo từng văn bản.",
    subjectId: KTC_MOCK_ID,
    materials: [
      { type: "deck", label: `Đề thi thử ngẫu nhiên ${MOCK_EXAM.questions} câu`, subjectId: KTC_MOCK_ID },
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
    id: "b9b-nghiep-vu", phase: "Vòng 2", title: "Nghiệp vụ ngoại giao",
    goal: "Công ước Viên 1961/1963 (ưu đãi, miễn trừ; ngoại giao khác lãnh sự), lễ tân, đàm phán và \"Dĩ bất biến, ứng vạn biến\" để dùng làm luận điểm cho bài viết và phỏng vấn.",
    subjectId: "nghiep-vu-ngoai-giao",
    materials: [
      { type: "deck", label: "29 flash card + 18 câu trắc nghiệm", subjectId: "nghiep-vu-ngoai-giao" },
      { type: "note", label: "Công ước Viên 1961 về quan hệ ngoại giao (Điều 3, 4, 9, 14, 22-41)" },
      { type: "note", label: "Công ước Viên 1963 về quan hệ lãnh sự (Điều 31-43)" },
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
