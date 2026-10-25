# Notes

## Sở thích học (từ phiên đầu, 2026-09-20)
- Senior backend, không cần giải thích khái niệm lập trình cơ bản. Ví dụ nên bám Java/Spring/K8s/PostgreSQL khi có thể.
- Muốn tầng engineering, không muốn toán và không muốn code lại transformer.
- Chọn: đọc + video + quiz & tự diễn đạt lại. **Không chọn** code hands-on → bài tập dạng "đọc tình huống, phán đoán, giải thích", tránh bắt viết code.
- Thích thấy trade-off trước rồi mới nhận khuyến nghị (theo `context/conventions.md`).
- Quỹ thời gian 4–5h/tuần; tiếng Anh đang chiếm 45 phút/ngày riêng — canh đừng làm đứt chuỗi tiếng Anh.

## Ghi chú vận hành
- Slug workspace: `llm-foundation`.
- Bài học viết tiếng Việt, thuật ngữ tiếng Anh giữ nguyên.

## Verify bài học (phiên 2026-09-20)
- Chrome extension (claude-in-chrome) không kết nối được trong phiên này. Cách verify hoạt động: `python3 -m http.server 8765` trong `$WORKSPACE` rồi Chrome headless `--dump-dom` / `--screenshot` (file:// bị chặn). Nhớ `pkill` server sau khi xong.
- Kiểm tra số từ của các option quiz bằng script node nhỏ trước khi ship — phiên đầu bắt được 2 câu lệch.

## Tiến độ
- Bài 0001: xong, quiz 4/5 (sai câu cache TTL) → learning record 0001. Glossary tạo với các thuật ngữ bài 1.
- Bài 0002 + 0003: Luật tự báo "đã làm cả hai, ổn" (2026-09-21, không nêu câu sai) → learning record 0002; glossary thêm mục "Hành vi của model" và "Tool use".
- Bài 0004 (workflow vs agent): Luật báo "xong" cùng ngày, không nêu quiz → LR-0003 (evidence yếu). Chưa đưa workflow/agent/5 pattern vào glossary.
- Bài 0005 (RAG vs fine-tune) + reference/rag-vs-fine-tune.html: đã giao 2026-09-21, chờ evidence. Nguồn mới: OpenAI "Optimizing LLMs for accuracy", Anthropic Contextual Retrieval, AWS Bedrock Haiku fine-tune.
- Bài 0006 (eval) + reference/eval-playbook.html: giao 2026-09-23. Mục 0 là 4 câu ôn trộn bài 2–5 (interleaving), mục 9 là 4 câu về eval. **Đã yêu cầu Luật báo hai con số riêng (ôn trộn x/4, cuối bài y/4) + câu nào sai.** Nguồn mới: Anthropic "Create strong empirical evaluations".
- Bài 0006 kết quả (2026-09-26): ôn trộn **2/4** (sai tool executor, sai KB 80k nhét prompt), cuối bài **3/4** (sai Kalai abstain) → LR-0004; LR-0002 đánh dấu partially superseded. Glossary thêm workflow, agent, LLM-as-judge, agreement. Vẫn nợ: RAG, chunk, fine-tune (chưa dùng đúng ngưỡng 200k), eval set, trace.
- Bài 0007 (context engineering & prompt caching) + reference/context-and-caching.html: giao 2026-09-26. Mục 0 là 3 câu **ôn giãn cách** hỏi lại 3 lỗ của LR-0004 dưới dạng khác (TTL 1h, ai quyết định tool result vào context, rubric nhị phân). Đã xin Luật báo x/3 và y/4.
- **Tin tức giá (2026-09-26):** cache read không còn 0.1× cho mọi model (Opus 5.5 0.05×, Fable 5.1 0.025×); Opus 5.5 giá $4/$20, Sonnet 5 giữ $2/$10 vĩnh viễn. Đã sửa glossary + token-economics. Bài học cũ (bài 1) vẫn ghi 0.1× — chấp nhận, bài 7 nói rõ đã thay đổi.
- Bài 0007 kết quả (2026-09-26): Luật báo đúng toàn bộ, **3/3 ôn giãn cách + 4/4 cuối bài** → LR-0005. Cả ba lỗ LR-0004 đúng ở lần giãn cách đầu (mới ở mức trắc nghiệm).
- Bài 0008 (self-host inference: prefill/decode, VRAM = weights + KV, vLLM, K8s routing/HPA, self-host vs API) + reference/self-host-inference.html: giao 2026-09-26, Luật chọn hướng (a). Mục 0: câu **tự diễn đạt** Kalai (lần giãn cách thứ 2, dạng recall) + 1 quiz nối prefix cache ↔ prefill. Đã xin: đoạn tự diễn đạt nguyên văn, x/1, y/4. Research do subagent làm, số liệu vLLM đọc từ code v0.30.0 vì doc lệch code.
- (cũ) Bài 0008 ứng viên: (a) quay lại lỗ Kalai lần giãn cách thứ hai nếu bài 7 câu 3 vẫn sai; (b) hạ tầng inference / self-host (gap trong RESOURCES) hoặc structured output & guardrails. Hỏi Luật trước khi chọn.
- Diagram (2026-09-26, Luật góp ý bài thiếu hình): chọn **kết hợp** Mermaid (flow/sequence) + SVG inline (tỉ lệ/timeline). Component `assets/diagram.css` + `assets/diagram.js` (Mermaid 12.0.0 pin, theme theo token, fallback offline). Bài 8 là bài thử (3 hình). Chưa retrofit bài 1–7 — hỏi Luật sau khi xem bài 8. Mermaid tự đảo thứ tự subgraph → ép bằng `A ~~~ B`. Crop screenshot bằng `sips -c H W --cropOffset Y 0` (không có PIL).
- Lưu ý soạn bài: tránh khung ASCII có ký tự tiếng Việt trong <pre> (lệch cột) — dùng pseudo-code thường + comment. Bảng 5 cột vẫn đọc được ở 1100px, đừng lên 6.
- Phiên 2026-09-23: script node đếm số từ/ký tự option quiz chạy trên 8 quiz của bài 6 → 0 lỗi; thêm rule `blockquote` vào assets/styles.css (bài 6 là bài đầu dùng trích dẫn nguyên văn).
- Phiên 2026-09-21: Chrome headless (`--headless=new --screenshot` / `--dump-dom` qua http.server 8765) chạy tốt; đếm `quiz-verdict` trong dump-dom để xác nhận quiz.js init.
- Evidence policy (từ LR-0004): không nhận "ổn"/"xong" làm evidence — luôn xin số câu đúng + câu sai.
