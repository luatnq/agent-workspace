# Claude Code — phần riêng

Instruction dùng chung (ngôn ngữ, bộ nhớ, skill, cấu trúc thư mục) nằm ở `AGENTS.md`. File này chỉ chứa phần riêng của Claude Code.

@AGENTS.md

## Context

@context/profile.md
@context/conventions.md
@memory/MEMORY.md

## Điều phối agent

Với việc lớn hoặc cần chuyên môn, giao cho agent sẵn có (mức user, `~/.claude/agents/`) thay vì tự làm:

| Loại việc | Agent |
|---|---|
| Nghiên cứu công nghệ, lập kế hoạch kỹ thuật | `technical-research-planner` |
| Viết code, refactor | `senior-software-engineer` |
| Review code | `multi-language-code-reviewer` |
| Test / QA | `qa-engineer-expert` |
| Commit / push git | `git-operations-specialist` |
| Viết tài liệu kỹ thuật | `technical-documentation-specialist` |
| Thiết kế kiến trúc hệ thống | `system-architect` |
| Phân tích yêu cầu | `requirements-analyst` |
| Chia nhỏ & điều phối task lớn | `task-orchestrator` |

Việc nhỏ (sửa vài dòng, trả lời câu hỏi, cập nhật file trong repo này) làm trực tiếp, không cần giao việc.

## Đồng bộ với Antigravity

- Thêm/sửa skill: chỉ sửa trong `.claude/skills/`. Antigravity tự nạp qua `.agents/skills.json`; skill chỉ chạy được trên Claude Code thì thêm tên vào `exclude` của file đó.
- Đổi quy tắc chung: sửa `AGENTS.md`, không sửa ở đây.
