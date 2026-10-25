# Antigravity — phần riêng

Instruction dùng chung (hồ sơ, quy ước, bộ nhớ, skill, cấu trúc thư mục) nằm ở `AGENTS.md` và được Antigravity nạp tự động. File này chỉ chứa phần riêng khi chạy trên Antigravity (IDE hoặc CLI `agy`).

## Skills

- Skill của workspace nằm ở `.claude/skills/`, được khai báo qua `.agents/skills.json` — gọi bằng `/<tên>` như bình thường (`/agent-ready`, `/teach`).
- Muốn tạo thêm skill mới, tạo trực tiếp trong `.claude/skills/<tên>/SKILL.md` để cả hai harness (Claude Code & Antigravity) cùng dùng.

## Quy đổi tool

Skill viết theo tên tool của Claude Code. Khi gặp, quy đổi như sau:

| Skill nhắc đến | Trên Antigravity |
|---|---|
| `AskUserQuestion` | Hỏi trong chat, **từng câu một**, liệt kê option đánh số (A/B/C...) kèm mô tả ngắn; option khuyến nghị để đầu và ghi "(khuyến nghị)". Dừng chờ tôi trả lời rồi mới hỏi câu tiếp. |
| `WebSearch` / `WebFetch` | Tool tìm kiếm web / đọc URL có sẵn của Antigravity. |
| Agent subagent của Claude Code | Việc lớn dùng subagent của Antigravity (`self` cho việc cần sửa file, `research` cho việc chỉ đọc) kèm prompt mô tả đúng vai trò đó; việc vừa thì tự làm. |
| TodoWrite / task list | Task artifact (checklist markdown), cập nhật `- [x]` khi xong từng bước. |
| "thư mục chứa `CLAUDE.md`" | Root của repo (vẫn đúng — `CLAUDE.md` nằm ở root). |

## Bộ nhớ

- Ghi nhớ vào `memory/` — **không** dựa vào Knowledge Items tự sinh của Antigravity, vì Claude Code không đọc được chúng.
- Quy ước commit, không commit/push khi chưa được yêu cầu: giữ nguyên như `context/conventions.md`.
