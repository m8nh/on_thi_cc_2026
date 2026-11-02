import { ClipboardCheck, Languages, MessageCircleQuestion, PenLine } from "lucide-react";

/* ---------------------------------------------------------
   VÒNG 2 — bộ 10 đề của tailieuonthi.io.vn.
   O conteúdo gerado do PDF fica em ./vong2/*.json (fora do git, como os bancos do Vòng 1):
     temas.json    { id, de, q, chuyenDe, tipo, enunciado[], dapAn[] | null }
     dich.json     { id, de, nhan, chuyenDe, tiengViet[], tiengAnh[] }
     phongvan.json { id, de, chuDe, front, y[] }
     decuong.json  { ten, items: [{ id, text }] }
--------------------------------------------------------- */

export const V2_SOURCE = "Nguồn: tailieuonthi.io.vn";
export const DAP_AN_NOTICE = "Đáp án do bên thứ ba biên soạn, chỉ dùng để tham khảo cấu trúc. Một số nội dung có sai sót, xem ghi chú bên dưới.";
export const TIPO_LABEL = { "phan-tich": "Phân tích", "binh-luan": "Bình luận", "tinh-huong": "Tình huống" };
export const PRACTICE_XP = 5;

// Linhas do painel Vòng 2; view é a rota aberta pelo App.
export const V2_SUBJECTS = [
  { view: "v2-temas", name: "Đề luận & Tình huống", ref: "Phần 1 · Phân tích, bình luận, xử lý tình huống · viết 180 phút", icon: PenLine },
  { view: "v2-dich", name: "Dịch Việt → Bồ", ref: "Phần 1 · Đoạn trích tiếng Việt, dịch sang tiếng Bồ Đào Nha", icon: Languages },
  { view: "v2-phongvan", name: "Câu hỏi phỏng vấn", ref: "Phần 2 · Flash card câu hỏi ngắn theo đề 1, 5, 9", icon: MessageCircleQuestion },
  { view: "v2-decuong", name: "Đề cương ôn tập", ref: "Danh sách kiến thức cần ôn, đánh dấu từng mục", icon: ClipboardCheck },
];

// de: đề(s) a cujo gabarito a nota se liga; null = đề cương.
export const V2_NOTES = [
  { de: [4], label: "Đề 4 Q3", text: "'Hộp xanh' (Green Box) thuộc Hiệp định Nông nghiệp WTO, không áp dụng cho trợ cấp công nghiệp (pin mặt trời, xe điện). Căn cứ đúng là Hiệp định SCM. Ngoài ra, cần kiểm tra lại việc đưa vụ chống bán phá giá vào cơ chế giải quyết tranh chấp EVFTA." },
  { de: [4], label: "Đề 4 Q1", text: "Canada không thuộc Mỹ La-tinh. Các thành viên Mỹ La-tinh của CPTPP là Mexico, Peru, Chile." },
  { de: [9], label: "Đề 9 Q5 (bản tiếng Anh)", text: "Cụm 'historical maritime claims' sai lập trường Việt Nam. Việt Nam chỉ dựa trên UNCLOS 1982, không viện dẫn 'quyền lịch sử' đối với EEZ." },
  { de: [2], label: "Đề 2 Q4", text: "Trích dẫn 'Điều 5(4) BLTTDS 2015' về thẩm quyền xét xử quốc gia nước ngoài chưa được xác minh, không dùng trong bài thi. Việt Nam chưa phê chuẩn Công ước LHQ 2004 về quyền miễn trừ quốc gia." },
  { de: [3], label: "Đề 3 Q2", text: "Sơ đồ xếp chỗ mâu thuẫn. Theo kiểu Pháp có đồng chủ tiệc: Đại sứ A ngồi bên phải Bộ trưởng, Đại sứ B ngồi bên phải Thứ trưởng (ngồi đối diện Bộ trưởng)." },
  { de: [4, 7], label: "Đề 4 Q5, Đề 7 Q5", text: "Bộ Thông tin và Truyền thông đã hợp nhất vào Bộ Khoa học và Công nghệ (2025). Quản lý ODA thuộc Bộ Tài chính, không phải Bộ Ngoại giao." },
  { de: null, label: "Đề cương", text: "Cần bổ sung Văn kiện Đại hội XIV và Nghị quyết 59-NQ/TW (24/01/2025) về hội nhập quốc tế trong tình hình mới. Kiểm tra lại Nghị định 26/2022/NĐ-CP (có thể đã được thay thế sau sắp xếp bộ máy 2025)." },
];

export const notesForDe = (de) => V2_NOTES.filter((n) => n.de?.includes(de));
export const DE_CUONG_NOTES = V2_NOTES.filter((n) => n.de === null);
