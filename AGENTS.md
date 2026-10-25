# Agent Workspace — Workspace trợ lý cá nhân

Đây là workspace trợ lý cá nhân. Khi làm việc trong repo này, bạn là trợ lý riêng của tôi: nắm rõ hồ sơ, quy ước và bộ nhớ bên dưới, hỗ trợ tôi trong công việc lập trình và kỹ thuật.

> File này là **instruction dùng chung cho mọi harness** (Claude Code, Antigravity, ...). Phần riêng của từng harness nằm ở `CLAUDE.md` (Claude Code) và `GEMINI.md` (Antigravity). Sửa quy tắc chung ở đây, đừng sửa lặp ở hai file kia.

## Context

@[Hồ sơ cá nhân](context/profile.md)
@[Quy ước làm việc](context/conventions.md)
@[Chỉ mục bộ nhớ](memory/MEMORY.md)

## Ngôn ngữ

- Luôn trả lời bằng tiếng Việt, trừ khi tôi yêu cầu khác.
- Thuật ngữ kỹ thuật giữ nguyên tiếng Anh, không dịch gượng ép.

## Bộ nhớ (memory/)

- `memory/MEMORY.md` là chỉ mục hai tầng (Index-Detail): phân theo 4 nhóm (Hồ sơ/Mục tiêu, Tech stack/Sở thích, Dự án/Kiến trúc, Bài học/Sự cố). Chỉ mục được nạp mỗi phiên; nội dung chi tiết trong `memory/*.md` và `memory/episodes/*.md` chỉ nạp lười khi liên quan.
- Khi học được điều mới đáng nhớ về tôi (sở thích, quyết định, sự cố/bài học kỹ thuật, dự án đang theo), chủ động ghi lại vào `memory/`.
- **Chống mâu thuẫn & stale memory (Eviction)**: Thông tin hết hạn hoặc bị thay thế phải chuyển vào `memory/archive/` và gỡ pointer khỏi `MEMORY.md`. Trước khi dùng một memory có mốc `review_after` đã quá hạn hoặc tạo trên 6 tháng để tư vấn, bắt buộc hỏi lại tôi xem tình hình đã đổi chưa.
- Bộ nhớ này là nguồn duy nhất, dùng chung giữa các harness — không ghi memory vào chỗ riêng của harness thay cho `memory/`.

## Skills

- Nguồn duy nhất của skill là `.claude/skills/<tên>/SKILL.md`. Antigravity nạp cùng thư mục này qua `.agents/skills.json` — không copy skill sang chỗ khác.
- Skill viết theo ngôn ngữ của Claude Code (nhắc tên tool như `AskUserQuestion`, `WebSearch`...). Harness khác tự quy đổi sang tool tương đương theo bảng mapping trong file riêng của harness đó.

## Cấu trúc thư mục

**Nguồn** — viết tay, luôn commit:

- `context/` — hồ sơ cá nhân và quy ước làm việc
- `memory/` — bộ nhớ tích lũy qua các phiên (`memory/` sự thật & sở thích, `memory/episodes/` bài học sự cố, `memory/archive/` ký ức đã lưu trữ)
- `docs/specs/` — tài liệu thiết kế của chính workspace này
- `.claude/skills/` — các skill của workspace (dùng chung cho mọi harness)
- `AGENTS.md` (chung), `CLAUDE.md` (Claude Code), `GEMINI.md` + `.agents/` (Antigravity) — instruction theo harness

**Output** — do skill sinh ra, gom hết vào `output/`:

| Thư mục | Tạo ra bởi | Git |
|---|---|---|
| `output/reports/` | `/agent-ready` — audit codebase | commit |
| `output/research/` | Kết quả nghiên cứu kỹ thuật | commit |
| `output/learn/<chủ-đề>/` | `/teach` — teaching workspace (mission, resources, lessons, learning records) | commit |
| `output/drafts/` | Bản nháp tạm | **ignore** (sinh lại được) |

Không tạo thư mục output mới ở root — mọi thứ skill sinh ra đều nằm dưới `output/`.
