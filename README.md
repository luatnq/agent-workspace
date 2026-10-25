# Agent Workspace — Multi-Harness Personal AI Coding Agent

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Harness: Claude Code](https://img.shields.io/badge/Harness-Claude%20Code-purple.svg)](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)
[![Harness: Google Antigravity](https://img.shields.io/badge/Harness-Google%20Antigravity-blue.svg)](https://github.com/google/antigravity)

**Agent Workspace** là bộ khung workspace trợ lý kỹ thuật cá nhân (Personal AI Agent Workspace) dành cho kỹ sư phần mềm (Senior SWE / Tech Lead / DevOps). 

Hệ thống được thiết kế theo kiến trúc **Multi-harness**, hoạt động liền mạch trên cả **Claude Code** (Anthropic) và **Antigravity** (Google DeepMind/AGY) cùng chung một Single Source of Truth (SSOT).

---

## 🌟 Điểm nổi bật về kiến trúc

### 1. Kiến trúc chỉ dẫn phân tầng (Multi-Harness Architecture)
- **`AGENTS.md` (SSOT):** Quy định nền tảng dùng chung cho mọi agent harness (vai trò, quy ước commit, cấu trúc thư mục, quy tắc giao tiếp).
- **`CLAUDE.md`:** Mapping điều phối subagent và cú pháp nạp context riêng của Claude Code (`@path`).
- **`GEMINI.md` + `.agents/skills.json`:** Catalog khai báo skill và bảng quy đổi tool tương đương trên Google Antigravity.

### 2. Bộ nhớ hai tầng (2-tier Index-Detail Memory)
Khác với cơ chế auto-memory nhồi nhét làm phình context window, workspace áp dụng nguyên tắc **Progressive Disclosure**:
- **Tầng Index (`memory/MEMORY.md`):** Chỉ lưu danh mục con trỏ (1 dòng/mục), giới hạn ngân sách chặt chẽ (5–8 con trỏ/nhóm). Tự động nạp đầu mỗi phiên làm việc.
- **Tầng Detail (`memory/*.md`, `memory/episodes/*.md`):** Lưu trữ kiến thức chuyên sâu, chỉ nạp lười (lazy-load) khi ngữ cảnh yêu cầu.
- **Eviction Policy:** Cơ chế chống ký ức lỗi thời (stale memory) — thông tin quá hạn hoặc thay đổi được lưu trữ vào `memory/archive/`.

### 3. Kỹ năng tích hợp sẵn (Integrated Skills)
Nằm trong `.claude/skills/`, dùng chung cho cả Claude Code và Antigravity:

| Kỹ năng | Slash Command | Mô tả |
|---|---|---|
| **Agent Readiness Audit** | `/agent-ready` | Audit và chấm điểm codebase định lượng theo Scorecard 100 điểm trên 4 trụ cột kỹ thuật (Hermetic build, feedback loop <15s, CLI linter, guardrails, explicit contracts). Xuất báo cáo chi tiết kèm Quick Wins & Strategic roadmap. |
| **Interactive Teaching Engine** | `/teach` | Khởi tạo workspace học tập tương tác cho bất kỳ chủ đề kỹ thuật nào (tự động render giáo trình HTML trực quan, quiz trắc nghiệm, glossary và checklist bài học). |

> **Mở rộng skill:** Bạn có thể dễ dàng bổ sung skill mới bằng cách tạo thư mục `.claude/skills/<tên-skill>/SKILL.md`. Cả Claude Code và Antigravity sẽ tự động nhận diện.

### 4. Giáo trình tự học tích hợp sẵn (`output/learn/`)
Workspace đi kèm giáo trình học tập dạng web app tĩnh (HTML + CSS + Interactive Quiz) được xây dựng bởi engine `/teach`:
- **`llm-foundation`:** Cơ chế hàm stateless trên token, nguyên nhân hallucination, tool-use loop, prompt caching TTL trượt, RAG vs Fine-tune, benchmark & eval.
- **`modern-software-developer`:** Kiến trúc bên trong coding agent, giải phẫu system prompt, RePPIT & spec-driven, giao thức Model Context Protocol (MCP), thiết kế tool, guardrail hooks, subagents & multi-agent patterns, agent-ready audit.

---

## 📂 Cấu trúc thư mục

```
agent-workspace/
├── AGENTS.md                  # Instruction dùng chung (SSOT)
├── CLAUDE.md                  # Cấu hình riêng cho Claude Code
├── GEMINI.md                  # Cấu hình riêng cho Google Antigravity
├── .agents/
│   └── skills.json            # Khai báo catalog skills cho Antigravity
├── context/
│   ├── profile.md             # Hồ sơ năng lực, tech stack và phong cách làm việc
│   └── conventions.md         # Quy ước commit, viết lách và kỹ thuật
├── memory/
│   ├── MEMORY.md              # Chỉ mục bộ nhớ (2-tier Index)
│   ├── archive/               # Ký ức đã hết hạn / lưu trữ
│   └── episodes/              # Bài học và sự cố kỹ thuật tích lũy
├── docs/specs/                # Tài liệu thiết kế kiến trúc workspace
├── .claude/skills/            # Kho kỹ năng (agent-ready, teach)
└── output/                    # Kết quả sinh ra từ các phiên làm việc
    ├── learn/                 # Giáo trình học tương tác (LLM Foundation, Modern SWE)
    ├── research/              # Kết quả nghiên cứu công nghệ
    └── reports/               # Báo cáo kỹ thuật và audit
```

---

## 🚀 Hướng dẫn bắt đầu

### 1. Clone workspace
```bash
git clone git@github.com:luatnq/agent-workspace.git
cd agent-workspace
```

### 2. Tùy biến thông tin cá nhân
Mở file `context/profile.md` và chỉnh sửa các thông tin:
- Tên và vai trò của bạn.
- Tech stack quen dùng (ngôn ngữ, framework, DB, cloud).
- Phong cách làm việc mong muốn từ AI (Senior, trade-off first, đi thẳng vào vấn đề).

### 3. Chạy với Coding Agent của bạn

- **Với Claude Code:**
  ```bash
  claude
  ```
  Claude sẽ tự động đọc `CLAUDE.md` và nạp toàn bộ context của workspace.

- **Với Google Antigravity:**
  ```bash
  agy
  ```
  Antigravity sẽ tự động nạp `AGENTS.md`, `GEMINI.md` và catalog `.agents/skills.json`.

---

## 🛡️ Nguyên tắc an toàn & Bảo mật (Security Guardrails)
- Toàn bộ dữ liệu cá nhân, CV ứng viên thật, trích đoạn mã nguồn nội bộ hoặc bản nháp tạm đều được quy hoạch vào `.gitignore` (`output/cv/`, `output/reviews/`, `output/mock-interviews/`, `output/drafts/`).
- Quy ước cứng: Agent không được tự ý thực hiện `git commit` hoặc `git push` nếu người dùng chưa yêu cầu rõ ràng.

---

## 📄 License
Phát hành theo giấy phép [MIT License](LICENSE).
