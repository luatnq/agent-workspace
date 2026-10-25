# Notes

## Sở thích học (phiên đầu, 2026-09-21)
- Kế thừa từ `llm-foundation`: senior backend, ví dụ bám Java/Spring/K8s; thích trade-off trước rồi mới khuyến nghị; thuật ngữ tiếng Anh giữ nguyên.
- Riêng khóa này: **mỗi bài kết thúc bằng một artifact thật cho side project** (chọn "thêm bài tập thực hành trên sản phẩm thật"). Không lý thuyết suông.
- ~2h/tuần, song song với LLM foundation → bài ≤ 45 phút, 1 bài/tuần.
- Marketing là lĩnh vực mới với Luật: thuật ngữ cần định nghĩa chặt, nhưng không cần "giải thích như cho người mới" về phần công nghệ.

## Bối cảnh sản phẩm
- Side project: "AI agent / tool cho developer" — **chưa có mô tả cụ thể**. Ô 0 của worksheet bài 1 dùng để ép ra mô tả; khi có, cập nhật MISSION.md (mục Constraints) và cân nhắc B2B vs dev-tool PLG.
- Mục tiêu: user thử đầu tiên trong 1–3 tháng (tức đến ~12/2026).

## Ghi chú vận hành
- Slug workspace: `marketing-foundation`. Accent màu teal (#0f6e6e) để phân biệt với khóa LLM (nâu).
- Assets: `styles.css` + `quiz.js` copy từ llm-foundation (cùng contract); thêm `worksheet.js` (autosave localStorage, copy Markdown) cho bài tập artifact — tái dụng cho ICP, landing copy, kịch bản phỏng vấn ở các bài sau.
- Verify: `python3 -m http.server 8766` trong `$WORKSPACE` + Chrome headless `--dump-dom`/`--screenshot`; đếm `quiz-verdict` (= số quiz) và `role="button"` (= số option). Script node đếm số từ option quiz — phiên này bắt được 2 câu lệch, đã sửa.
- Đừng bịa ví dụ sản phẩm thật; ví dụ chạy suốt bài 1 là agent K8s giả định, ghi rõ "giả định".

## Lộ trình dự kiến (điều chỉnh theo canvas v0 và learning records)
1. ✅ Positioning canvas v0 (Dunford) — đã giao 2026-09-21, chờ Luật dán canvas + số quiz.
2. Mom Test: biến ô ít-tin-nhất của canvas thành 5 câu hỏi phỏng vấn; artifact = kịch bản phỏng vấn + danh sách 5 người. Tạo glossary sau bài này.
3. Target market → ICP cụ thể cho dev tool (DuVander: dev không điền form); artifact = ICP one-pager.
4. Messaging & landing page copy từ canvas; artifact = landing v0.
5. Chọn kênh: Bullseye (Traction) lọc 19 kênh cho dev tool; artifact = 3 kênh test rẻ + kế hoạch Show HN.
6. Funnel & đo lường cơ bản (activation cho dev tool). Cần tìm nguồn (xem Gaps trong RESOURCES.md).
7. Pricing sơ bộ — cần tìm nguồn.

## Tiến độ
- 2026-09-21: tạo workspace, MISSION, RESOURCES (đã verify qua web), assets, bài 0001, reference/positioning-canvas.html. Chưa có learning record (chưa có evidence).
