# Thiết kế: Workspace trợ lý cá nhân (my-agent)

Ngày: 2026-08-22

## Mục tiêu

Biến repo `~/workspace/my-agent` thành workspace trợ lý cá nhân: khi mở Claude Code tại đây, Claude nắm hồ sơ, quy ước làm việc và bộ nhớ tích lũy của tôi, đồng thời có bộ skill hỗ trợ viết lách và điều phối các agent dev sẵn có ở mức user.

## Phạm vi

- **Lập trình**: điều phối các agent sẵn có (`senior-software-engineer`, `multi-language-code-reviewer`, `qa-engineer-expert`, `git-operations-specialist`, ...) và nghiên cứu công nghệ.
- **Viết lách**: dịch Việt↔Anh, trau chuốt văn bản, báo cáo/tổng kết.
- **Context**: hồ sơ cá nhân, quy ước làm việc, bộ nhớ tích lũy dần qua các phiên.
- Chỉ hoạt động trong repo này (không cài lên `~/.claude`).

## Kiến trúc

Không tạo subagent mới. "Agent cá nhân" = Claude Code chạy trong workspace, nạp context qua `CLAUDE.md` (import các file con bằng cú pháp `@path`).

```
my-agent/
├── CLAUDE.md                  # context chính: import hồ sơ, quy ước, memory; quy tắc điều phối
├── context/
│   ├── profile.md             # hồ sơ cá nhân (tôi tự điền/cập nhật)
│   └── conventions.md         # quy ước làm việc
├── memory/
│   └── MEMORY.md              # chỉ mục bộ nhớ; mỗi fact là một file .md riêng
├── .claude/skills/
│   ├── translate/SKILL.md     # /translate — dịch Việt↔Anh
│   ├── polish/SKILL.md        # /polish — trau chuốt văn bản
│   ├── report/SKILL.md        # /report — báo cáo tổng kết ngày/tuần
│   ├── research/SKILL.md      # /research — nghiên cứu công nghệ
│   └── remember/SKILL.md      # /remember — ghi vào bộ nhớ
└── output/                    # mọi output do skill sinh ra
    ├── reports/               # output của /report
    ├── research/              # output của /research
    └── drafts/                # văn bản đang dịch/trau chuốt (gitignore)
```

## Quyết định chính

- Bộ nhớ dạng file-per-fact + chỉ mục `MEMORY.md` được import vào mọi phiên; nội dung chi tiết đọc khi cần (progressive disclosure).
- Skill viết lách (`translate`, `polish`) cho phép Claude tự kích hoạt; `report`/`research`/`remember` chủ yếu gọi tay qua slash command nhưng vẫn cho model tự gọi khi khớp ngữ cảnh.
- `research` giao việc cho agent `technical-research-planner` sẵn có thay vì tạo agent mới.
- Repo được quản lý bằng git; `.omc/` (state của oh-my-claudecode) đưa vào `.gitignore`.
