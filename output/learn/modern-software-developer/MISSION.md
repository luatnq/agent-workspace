# Mission: The Modern Software Developer (theo outline Stanford CS146S)

## Why
Luật là senior backend (Java/Spring, K8s) đang lead team. Muốn làm chủ cách phát triển phần mềm cùng coding agent ở mức engineering. Mục tiêu có bốn tầng: tự làm việc hiệu quả hơn với agent, đưa agent vào quy trình của team một cách an toàn và có đo lường, đủ hiểu bên trong để tự build agent/tool nội bộ, và có câu chuyện thực chiến để kể khi phỏng vấn công ty nước ngoài.

## Success looks like
- Giải thích được một coding agent chạy thế nào bên dưới: agent loop, bộ tool read/write/edit/bash, system prompt. Tự lần ra được vì sao agent làm sai ở một bước cụ thể.
- Workspace `my-agent` và ít nhất một repo công việc có CLAUDE.md/AGENTS.md, hooks (lint/test gate) và subagent/skill do chính Luật viết, đang dùng hằng ngày.
- Tự viết và chạy được một MCP server hoặc skill phục vụ việc thật của team.
- Audit được một repo theo tiêu chí agent-ready và đưa ra danh sách việc cần sửa có ưu tiên.
- Đề xuất được quy trình AI code review và chính sách security (prompt injection, secret, dependency) cho team, kèm cách đo có tốt hơn không (eval).
- Trình bày được, bằng tiếng Anh nếu cần, trade-off của background agents, LLM gateway, model routing và chi phí ở quy mô team.

## Constraints
- 4–5 giờ/tuần, toàn bộ quỹ học LLM chuyển sang đây (llm-foundation dừng ở bài 8). Quỹ 45 phút/ngày cho tiếng Anh là riêng, không lấn vào.
- Mỗi bài xong trong một lần ngồi, 20–40 phút kể cả bài tập.
- Bài tập làm **trên repo thật** (my-agent hoặc repo công việc): cấu hình, viết hook/skill, audit, đọc trace. Tránh bài tập thuật toán thuần. Quiz vẫn dùng để luyện nhớ lại.
- Nền AI core/agents lấy từ `../llm-foundation/`: link sang và ôn giãn cách, không dạy lại từ đầu. Bổ sung eval vì CS146S không có.
- Trả lời bằng tiếng Việt, thuật ngữ giữ tiếng Anh.

## Out of scope
- Toán của transformer, training/pretraining.
- Xem trọn các buổi guest talk. Chỉ trích ý khi có nguồn công khai và liên quan đến mission.
- Chạy đua theo lịch học của Stanford. Đi theo nhịp riêng.
