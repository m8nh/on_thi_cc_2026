import { Landmark, Building2, ScrollText, Flag, Briefcase, Network, Gavel, Users, UserCheck, ShieldAlert, GraduationCap, FileText, Workflow, HardHat } from "lucide-react";
import COUNTS from "./counts.json";
import KEY_PAGES from "./keyPages.json";
import KEY_COUNTS from "./keyCardCounts.json";

/* ---------------------------------------------------------
   VÒNG 1 · KIẾN THỨC CHUNG — 14 văn bản theo danh mục tài liệu 2026
   (60 câu trắc nghiệm trên máy, 60 phút, đúng từ 50% vào Vòng 2)
   priority: 3 = rất cao, 2 = cao, 1 = trung bình
--------------------------------------------------------- */
export const KTC_GROUPS = [
  {
    id: "g1", no: "I", title: "Bộ Ngoại giao · cơ quan đại diện",
    goal: "Văn bản gắn trực tiếp với Bộ: NĐ 306/2026 (ưu tiên rất cao) và Luật Cơ quan đại diện. Học kỹ cơ cấu tổ chức và các con số.",
  },
  {
    id: "g2", no: "II", title: "Hiến pháp · hệ thống chính trị · bộ máy nhà nước",
    goal: "Hiến pháp, Điều lệ Đảng, Luật TCCP, NĐ 303, Luật TCQH: vị trí, thẩm quyền, nhiệm kỳ, tỷ lệ biểu quyết, số lượng cấp phó.",
  },
  {
    id: "g3", no: "III", title: "Cán bộ, công chức · đạo đức công vụ",
    goal: "Luật CBCC 2025 và 3 nghị định 170/300, 172/251, 171: điều kiện tuyển dụng, thi tuyển, kỷ luật, thời hiệu, đào tạo.",
  },
  {
    id: "g4", no: "IV", title: "Xây dựng pháp luật · cải cách hành chính",
    goal: "Luật Ban hành VBQPPL (15 loại văn bản, thẩm quyền, hiệu lực) và NQ 76 về cải cách hành chính (6 nội dung).",
  },
  {
    id: "g5", no: "V", title: "Lao động",
    goal: "Bộ luật Lao động: hợp đồng, thời giờ làm việc, nghỉ ngơi, kỷ luật lao động. Ưu tiên thấp nhất trong 14 văn bản.",
  },
];

const DOCS = [
  {
    id: "vb01", no: 1, group: "g1", priority: 3, icon: Landmark,
    name: "NĐ 306/2026 về Bộ Ngoại giao",
    ref: "Chức năng, nhiệm vụ, quyền hạn, cơ cấu tổ chức · hiệu lực 03/8/2026 · thay thế NĐ 28/2025",
    video: { file: "nd306-2026-bo-ngoai-giao-nhat-phong.mp4", length: "8:58" },
    focus: [
      "Vị trí, chức năng: thống nhất quản lý nhà nước về đối ngoại; tham mưu cho BCH Trung ương, Bộ Chính trị, Ban Bí thư (Điều 1).",
      "Nhiệm vụ về pháp luật, chiến lược; quản lý thống nhất hoạt động đối ngoại, hội nghị quốc tế tại Việt Nam (Điều 2, khoản 1–7).",
      "Các lĩnh vực: nghiên cứu, lễ tân nhà nước, đa phương, ngoại giao kinh tế, văn hóa, đối ngoại địa phương, thông tin đối ngoại (khoản 8–15).",
      "Lãnh sự, bảo hộ công dân, di cư, người Việt Nam ở nước ngoài, biên giới lãnh thổ (khoản 16–19).",
      "Cơ quan đại diện VN ở nước ngoài và cơ quan đại diện nước ngoài tại VN; điều ước quốc tế (khoản 20–25).",
      "Cơ cấu: 12 vụ, Văn phòng Bộ, 05 cục, Sở Ngoại vụ TP.HCM, Ủy ban Biên giới quốc gia, Ủy ban NN về người VN ở nước ngoài, Học viện Ngoại giao, Báo Thế giới và Việt Nam (Điều 3).",
    ],
  },
  {
    id: "vb02", no: 2, group: "g1", priority: 2, icon: Building2,
    name: "Luật Cơ quan đại diện VN ở nước ngoài",
    ref: "Luật 33/2009, sửa đổi 2017 và 08/2026 · VBHN 108/VBHN-VPQH",
    focus: [
      "Cơ quan đại diện: ngoại giao, lãnh sự, tại tổ chức quốc tế (Điều 1, 2, 4).",
      "Nguyên tắc: chịu chỉ đạo của Chủ tịch nước, Chính phủ, Thủ tướng; Bộ Ngoại giao quản lý trực tiếp; chế độ thủ trưởng (Điều 3).",
      "Chức năng, nhiệm vụ: chính trị, phát triển đất nước, văn hóa, lãnh sự, bảo hộ công dân, cộng đồng người VN (Điều 5–9).",
      "Chính phủ thành lập, Bộ Ngoại giao quản lý (Điều 13); chức vụ ngoại giao, lãnh sự (Điều 18).",
      "UBTVQH phê chuẩn Đại sứ đặc mệnh toàn quyền (Điều 19, 20); nhiệm kỳ công tác 36 tháng (Điều 27).",
    ],
  },
  {
    id: "vb03", no: 3, group: "g2", priority: 3, icon: ScrollText,
    name: "Hiến pháp 2013 (sửa đổi 2025)",
    ref: "Sửa đổi bởi NQ 203/2025/QH15 · VBHN 52/VBHN-VPQH ngày 21/7/2025",
    focus: [
      "Chế độ chính trị: Điều 2, 4, 6, 8, 9; đường lối đối ngoại (Điều 12).",
      "Quyền con người, quyền công dân (Điều 14–49); người VN định cư ở nước ngoài (Điều 18).",
      "Quốc hội (Điều 69–74), Chủ tịch nước (Điều 86, 88), Chính phủ (Điều 94–99).",
      "Tòa án (Điều 102–106), Viện kiểm sát (Điều 107–109).",
      "Chính quyền địa phương hai cấp (Điều 110–114); Hội đồng bầu cử quốc gia, Kiểm toán nhà nước (Điều 117, 118).",
    ],
  },
  {
    id: "vb04", no: 4, group: "g2", priority: 2, icon: Flag,
    name: "Điều lệ Đảng Cộng sản Việt Nam",
    ref: "Đại hội XI thông qua 19/01/2011",
    focus: [
      "Đảng viên: tiêu chuẩn, nhiệm vụ, quyền, kết nạp, dự bị 12 tháng (Điều 1–8).",
      "Tập trung dân chủ (Điều 9); hệ thống tổ chức, đại hội, cấp ủy (Điều 10–14).",
      "Cấp Trung ương: Đại hội, BCH Trung ương, Bộ Chính trị, Tổng Bí thư, Ban Bí thư (Điều 15–17).",
      "Kiểm tra, giám sát, Ủy ban Kiểm tra; khen thưởng, kỷ luật (Điều 30–40).",
      "Chỉ Đại hội đại biểu toàn quốc có quyền sửa đổi Điều lệ (Điều 48).",
    ],
  },
  {
    id: "vb05", no: 5, group: "g2", priority: 3, icon: Briefcase,
    name: "Luật Tổ chức Chính phủ 2025",
    ref: "Luật 63/2025/QH15 · VBHN 27/VBHN-VPQH năm 2026 · hiệu lực 01/3/2025",
    focus: [
      "Vị trí, cơ cấu, thành viên, nhiệm kỳ; Thủ tướng (Điều 1–4); nguyên tắc tổ chức (Điều 5).",
      "Phân định thẩm quyền: phân quyền, phân cấp, ủy quyền (Điều 6–9).",
      "Nhiệm vụ, quyền hạn của Chính phủ, Thủ tướng, Phó Thủ tướng (Điều 10–15).",
      "Bộ trưởng, Thủ trưởng cơ quan ngang bộ; bộ, cơ quan ngang bộ (Điều 16–24).",
      "Họp thường kỳ mỗi tháng một phiên; phiên họp cần ít nhất 2/3 thành viên (Điều 25–28).",
    ],
  },
  {
    id: "vb06", no: 6, group: "g2", priority: 3, icon: Network,
    name: "NĐ 303/2025 về cơ cấu bộ, cơ quan ngang bộ",
    ref: "Hiệu lực 20/11/2025 · thay thế NĐ 123/2016 và NĐ 101/2020",
    focus: [
      "Bộ trưởng chịu trách nhiệm toàn diện về mọi hoạt động của bộ (Điều 3).",
      "Cơ cấu: vụ; văn phòng; thanh tra; cục; đơn vị sự nghiệp công lập (Điều 5).",
      "Vụ, Văn phòng, Cục loại 1, cục loại 2 (Điều 6, 7, 9); tiêu chí thành lập phòng (Điều 10).",
      "Cấp phó: vụ, văn phòng, thanh tra, cục loại 2, ĐVSN bình quân không quá 03; cục loại 1 không quá 04 (Điều 11); phòng thuộc vụ không quá 03 (Điều 12).",
      "Đơn vị sự nghiệp công lập không có chức năng quản lý nhà nước (Điều 13).",
    ],
  },
  {
    id: "vb07", no: 7, group: "g2", priority: 2, icon: Gavel,
    name: "Luật Tổ chức Quốc hội",
    ref: "Luật 57/2014, sửa đổi 2020, 2023, 2025 · VBHN 48/VBHN-VPQH",
    focus: [
      "Nhiệm kỳ 05 năm (Điều 1, 2); làm luật (Điều 5); giám sát tối cao (Điều 6).",
      "Bầu, phê chuẩn, miễn nhiệm, bãi nhiệm; lấy phiếu tín nhiệm (Điều 8–12).",
      "Quyết định chiến tranh và hòa bình (Điều 17); điều ước quốc tế (Điều 18); trưng cầu ý dân (Điều 19).",
      "Đại biểu Quốc hội: tổng số không quá 500 (Điều 23); chất vấn (Điều 32); quyền miễn trừ (Điều 37).",
      "UBTVQH, Chủ tịch Quốc hội (Điều 44–65); Hội đồng dân tộc, các Ủy ban (Điều 66–68a).",
    ],
  },
  {
    id: "vb08", no: 8, group: "g3", priority: 3, icon: Users,
    name: "Luật Cán bộ, công chức 2025",
    ref: "Luật 80/2025/QH15 · hiệu lực 01/7/2025 · thay thế Luật 2008",
    focus: [
      "Khái niệm, nguyên tắc thi hành công vụ, nguyên tắc quản lý (Điều 1–5).",
      "Nghĩa vụ, quyền (Điều 6–11); đạo đức công vụ, văn hóa giao tiếp, việc không được làm (Điều 12–14).",
      "Tuyển dụng: điều kiện đăng ký (01 quốc tịch VN, cư trú tại VN, đủ 18 tuổi…) (Điều 18–24).",
      "Đánh giá, xếp loại 04 mức (Điều 25, 26); điều động, luân chuyển, biệt phái, bổ nhiệm (Điều 30, 31).",
      "Kỷ luật: cán bộ (khiển trách, cảnh cáo, cách chức, bãi nhiệm); công chức (khiển trách, cảnh cáo, cách chức, buộc thôi việc); thời hiệu 5/10 năm (Điều 35–37).",
    ],
  },
  {
    id: "vb09", no: 9, group: "g3", priority: 3, icon: UserCheck,
    name: "NĐ 170/2025 & NĐ 300/2026 (tuyển dụng, sử dụng công chức)",
    ref: "VBHN 10/2026/VBHN-NĐ-BNV · NĐ 300 hiệu lực 01/8/2026",
    focus: [
      "Điều kiện dự tuyển, xét tuyển, ưu tiên (Điều 4–6).",
      "Thi tuyển chuyên viên: Vòng 1 trắc nghiệm máy 60 câu, 60 phút, đúng từ 50%; Vòng 2 nghiệp vụ chuyên ngành (Điều 9).",
      "Xác định trúng tuyển, bằng điểm (Điều 10); quyết định tuyển dụng, nhận việc, xếp lương (Điều 19, 20).",
      "Điều động, biệt phái, bổ nhiệm, bổ nhiệm lại (Điều 25–41); luân chuyển (Điều 42–51).",
      "Thôi giữ chức vụ, từ chức, miễn nhiệm, thôi việc, nghỉ hưu (Điều 51a–63).",
    ],
  },
  {
    id: "vb10", no: 10, group: "g3", priority: 2, icon: ShieldAlert,
    name: "NĐ 172/2025 & NĐ 251/2025 (kỷ luật CBCC)",
    ref: "VBHN 01/VBHN-BNV ngày 10/11/2025",
    focus: [
      "Nguyên tắc: mỗi hành vi chỉ xử lý một lần; không thay kỷ luật bằng xử phạt hành chính (Điều 2).",
      "Chưa xem xét, loại trừ, miễn kỷ luật (Điều 3, 4); thời hiệu 05/10 năm (Điều 5).",
      "Hành vi và hình thức kỷ luật; áp dụng từng hình thức (Điều 6–12).",
      "Thẩm quyền, trình tự với cán bộ, công chức; Hội đồng kỷ luật (Điều 13–21).",
      "Người đã thôi việc, nghỉ hưu; tạm giữ, tạm giam; khiếu nại (Điều 22–27).",
    ],
  },
  {
    id: "vb11", no: 11, group: "g3", priority: 2, icon: GraduationCap,
    name: "NĐ 171/2025 (đào tạo, bồi dưỡng công chức)",
    ref: "Văn bản gốc, 30/6/2025",
    focus: [
      "Nguyên tắc; trách nhiệm của công chức khi tham gia (Điều 2, 3).",
      "Cử đi đào tạo sau đại học: đủ 03 năm công tác, 02 năm liền kề hoàn thành tốt, không quá 45 tuổi, cam kết phục vụ gấp 03 lần thời gian đào tạo (Điều 4, 5).",
      "Đền bù chi phí đào tạo: các trường hợp, cách tính, miễn giảm, Hội đồng xét (Điều 6–13).",
      "Nội dung bồi dưỡng: lý luận chính trị, QP-AN, QLNN, theo vị trí việc làm, KHCN và kỹ năng số (Điều 14).",
    ],
  },
  {
    id: "vb12", no: 12, group: "g4", priority: 3, icon: FileText,
    name: "Luật Ban hành VBQPPL 2025",
    ref: "Luật 64/2025, sửa đổi bởi Luật 87/2025 · VBHN 54/VBHN-VPQH",
    focus: [
      "Khái niệm; hệ thống 15 loại văn bản (Điều 2–4); nguyên tắc (Điều 5).",
      "Thẩm quyền, hình thức từng loại văn bản (Điều 10–22).",
      "Quy trình xây dựng luật (Điều 23–43); văn bản của Chính phủ, Thủ tướng, bộ (Điều 44–49); trình tự rút gọn (Điều 50, 51).",
      "Hiệu lực: thời điểm, không gian, hiệu lực trở về trước (Điều 53–58).",
      "Giải thích, giám sát, kiểm tra, rà soát, hợp nhất (Điều 60–65).",
    ],
  },
  {
    id: "vb13", no: 13, group: "g4", priority: 2, icon: Workflow,
    name: "NQ 76/NQ-CP (CCHC 2021–2030)",
    ref: "Chương trình tổng thể cải cách hành chính nhà nước · 15/7/2021",
    focus: [
      "05 quan điểm chỉ đạo (mục I).",
      "Mục tiêu: nền hành chính dân chủ, chuyên nghiệp, hiện đại, tinh gọn, hiệu lực, hiệu quả, liêm chính, phục vụ nhân dân (mục II).",
      "06 nội dung: thể chế; TTHC; tổ chức bộ máy; chế độ công vụ; tài chính công; Chính phủ điện tử, Chính phủ số (mục III).",
      "06 nhóm giải pháp và kinh phí (mục IV, V).",
    ],
  },
  {
    id: "vb14", no: 14, group: "g5", priority: 1, icon: HardHat,
    name: "Bộ luật Lao động 2019",
    ref: "Luật 45/2019/QH14 · VBHN 18/VBHN-VPQH ngày 12/02/2026",
    focus: [
      "Hợp đồng lao động: không xác định thời hạn; xác định thời hạn không quá 36 tháng (Điều 20); thử việc (Điều 24).",
      "Chấm dứt, đơn phương chấm dứt hợp đồng (Điều 34–41).",
      "Thời giờ làm việc không quá 08 giờ/ngày, 48 giờ/tuần (Điều 105); làm thêm giờ (Điều 107).",
      "Nghỉ hằng tuần, lễ tết, nghỉ hằng năm 12 ngày (Điều 111–113).",
      "Kỷ luật lao động: 04 hình thức (Điều 124); tuổi nghỉ hưu nam 62 vào năm 2028 (Điều 169).",
    ],
  },
];

export const KTC_DOCS = DOCS.map((d) => ({
  ...d,
  type: "ktc",
  counts: COUNTS[d.id] || { mcq: 0, tf: 0, fill: 0 },
  keyFiles: KEY_PAGES[d.id] || [],
  keyCards: KEY_COUNTS[d.id] || 0,
}));

export const KTC_MOCK_ID = "thi-thu-vong1";
export const MOCK_EXAM = { questions: 60, minutes: 60, passRatio: 0.5 };

export const findKtcDoc = (id) => KTC_DOCS.find((d) => d.id === id);
export const ktcDocsInGroup = (groupId) => KTC_DOCS.filter((d) => d.group === groupId);
export const ktcQuestionTotal = (d) => d.counts.mcq + d.counts.tf;
export const KTC_TOTAL_QUESTIONS = KTC_DOCS.reduce((n, d) => n + ktcQuestionTotal(d), 0);
export const priorityStars = (priority) => "★".repeat(priority) + "☆".repeat(3 - priority);
