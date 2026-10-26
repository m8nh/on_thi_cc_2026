import { WRITING_SUBJECT } from "../data/subjects.js";

const orEmpty = (text) => text || "(chưa trả lời)";

function buildPrompt({ summaryText, answers, translationVi, translationPt }) {
  return `Bạn là giám khảo chấm bài thi viết tiếng Bồ Đào Nha (vòng 2) cho kỳ thi công chức ngoại giao Việt Nam.
Tiêu chí: nội dung đầy đủ và đúng trọng tâm, từ ngữ chính xác (đặc biệt thuật ngữ đối ngoại), ngữ pháp, văn phong, chính tả, không chép nguyên văn, không sai chức danh/tên cơ quan. Thang điểm: ${WRITING_SUBJECT.maxScore} điểm, tối thiểu ${String(WRITING_SUBJECT.passScore).replace(".", ",")} để đạt.

Bài làm của thí sinh:
--- Phần 1: Tóm tắt ---
${orEmpty(summaryText)}
--- Phần 1: Trả lời câu hỏi ---
${answers.map((a, i) => `${i + 1}. ${orEmpty(a)}`).join("\n")}
--- Phần 2: Dịch sang tiếng Việt ---
${orEmpty(translationVi)}
--- Phần 3: Dịch sang tiếng Bồ Đào Nha ---
${orEmpty(translationPt)}

Hãy nhận xét ngắn gọn từng phần bằng tiếng Việt, nêu điểm mạnh, điểm cần cải thiện, và ước tính điểm mỗi phần cùng tổng điểm ước tính trên ${WRITING_SUBJECT.maxScore}. Ghi rõ đây chỉ là ước tính tham khảo.`;
}

// Nota: chamada direta à API da Anthropic. Só funciona dentro do preview
// de artifacts do Claude.ai (que injeta a autenticação). Rodando local via
// `npm run dev`, essa chamada falha e o app cai no checklist de autoavaliação.
export async function requestWritingFeedback(draft) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: buildPrompt(draft) }] }),
  });
  const data = await response.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  if (!text) throw new Error("empty");
  return text;
}
