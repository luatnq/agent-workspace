---
name: agent-ready
description: Audit và chấm điểm định lượng mức độ sẵn sàng cho AI Coding Agent (Agent-Readiness) của một codebase theo Scorecard 100 điểm trên 4 trụ cột kỹ thuật. Quét instruction files (AGENTS.md, CLAUDE.md), hermetic build (wrapper), feedback loop (<15s test subset), CLI linter/formatter, local containerization, guardrails và explicit contracts. Xuất báo cáo audit chi tiết kèm action items có thứ tự ưu tiên (Quick Wins vs Strategic) và draft sẵn file AGENTS.md tối ưu cho repo. Dùng khi muốn đánh giá codebase, kiểm tra xem repo có thân thiện với agent không, tìm nguyên nhân agent chạy chậm hoặc tốn token, hay chuẩn bị repo trước khi giao việc cho coding agent — kể cả khi chỉ nói "audit repo này", "check agent-ready", "codebase này AI chạy được không". Chỉ KHÔNG dùng khi muốn review chất lượng logic mã nguồn/business logic (dùng review-java) hoặc audit lỗ hổng bảo mật chuyên sâu.
argument-hint: "[đường dẫn repo cần audit (mặc định: repo hiện tại)]"
---

# Agent-Ready Codebase Audit & Scoring

Audit định lượng một repository theo khung đánh giá **Agent-Ready Scorecard (100 điểm)** từ Bài 11 (Module 5), giúp Tech Lead xác định điểm nghẽn và cải tiến codebase thành môi trường phát triển lý tưởng cho Autonomous Coding Agent.

- Tham chiếu thang điểm chi tiết (hỗ trợ Java, TS, Python, Go): `references/scorecard-rubric.md`.
- Mẫu báo cáo chuẩn: `references/report-template.md`.

---

## Nguyên tắc An toàn Cốt lõi
> **Mặc định là Phân tích Tĩnh (Static Analysis Only):** Quá trình audit chỉ đọc cấu trúc thư mục, đếm dòng mã, và kiểm tra file cấu hình. **Tuyệt đối KHÔNG tự ý thực thi các lệnh build hoặc test nặng** (tránh làm treo phiên làm việc hoặc gây tác dụng phụ lên database).

---

## Bước 1: Xác định đối tượng Audit & Quét nhanh bằng script tất định

1. **Xác định đường dẫn target:**
   - Đọc tham số `$ARGUMENTS` (hoặc đường dẫn được nhắc đến trong câu lệnh của người dùng).
   - Nếu có đường dẫn: kiểm tra thư mục đó có tồn tại hay không.
   - Nếu để trống: mặc định audit chính thư mục làm việc hiện tại (current workspace).
2. **Chạy script quét nhanh đa nền tảng (`quick-scan.js`):**
   - Chạy lệnh CLI: `node .claude/skills/agent-ready/scripts/quick-scan.js "<target_path>"`
   - *(Script này viết bằng Node.js thuần không phụ thuộc npm package, chạy mượt mà trên cả Windows cmd/PowerShell, macOS, và Linux).*
   - Thu thập kết quả JSON tóm tắt:
     - Số dòng các file instruction (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`).
     - Sự tồn tại của build wrapper (`gradlew`, `mvnw`, `package-lock.json`, `poetry.lock`, `go.sum`).
     - File infra local (`docker-compose.yml`, `.env.example`).
     - Cấu hình linters & formatters (Spotless, Prettier, Checkstyle, Ruff, Golangci).
     - Guardrails (`hooks.json`, `.githooks`).
     - Số lượng file mã nguồn, file test, và danh sách các "God Class" (>1.500 dòng).

---

## Bước 2: Chấm điểm 10 tiêu chí theo Rubric (Thang điểm 100)

Dựa trên dữ liệu JSON từ `quick-scan.js` và đọc thêm các file cấu hình liên quan, đối chiếu với `references/scorecard-rubric.md` để chấm điểm từng mục từ 0 đến 10:

1. **Instruction File (AGENTS.md / CLAUDE.md):** (0–10đ)
   - File có <200 dòng không? Có Single Source of Truth không? Có chứa non-standard conventions không? Có bị nhồi nhét văn xuôi thừa làm vỡ Prefix Cache không?
2. **Hermetic Build & Dependency Management:** (0–10đ)
   - Có wrapper script / lockfile tự túc không? Có build độc lập trong container được không?
3. **Fast Feedback Test Loop:** (0–10đ)
   - Có lệnh chạy subset test của 1 class/package hoàn thành trong <15–30s không?
4. **Automated Formatting & Linting (CLI Actionable):** (0–10đ)
   - Có công cụ auto-format CLI không (chạy <5s, ví dụ `spotlessApply`, `npm run format`, `ruff format`)?
5. **Deterministic Local Dependencies:** (0–10đ)
   - Có `docker-compose.yml` dựng DB/Redis/MQ local và file `.env.example` không?
6. **Static Typing & Explicit Contracts:** (0–10đ)
   - Kiểu tĩnh, DTO có validation annotations, API có schema/OpenAPI rõ ràng không?
7. **Package Cohesion & Architecture Boundaries:** (0–10đ)
   - Bố cục chuẩn không? Có circular dependencies không? Có bao nhiêu file >1.500 dòng?
8. **Automated Guardrails & Lifecycle Hooks:** (0–10đ)
   - Có `hooks.json` hoặc pre-commit hook chặn sửa file migration / commit secret không?
9. **Mocking & Test Fixtures Readiness:** (0–10đ)
   - Có thư viện mock và bộ dữ liệu mẫu (fixtures) để viết test độc lập không?
10. **Clean Logging & Actionable Error Output:** (0–10đ)
    - Cấu hình logging có gọn gàng không, có nuốt exception hoặc xả stacktrace rác không?

---

## Bước 3: Phân loại cấp độ (Classification)

Tính tổng điểm trên thang 100 và xếp loại:
- **0 – 39 điểm:** **Agent-Hostile** (Thù địch — agent vào là kẹt, dễ làm hỏng code hoặc tốn token vô ích).
- **40 – 70 điểm:** **Agent-Tolerant** (Chấp nhận được — agent giải quyết được task nhỏ nhưng cần giám sát).
- **71 – 90 điểm:** **Agent-Friendly** (Thân thiện — agent tự hành tốt, tự sửa lỗi cú pháp và verify).
- **91 – 100 điểm:** **Agent-Native** (Tự hành hoàn hảo — codebase vận hành như một API lý tưởng).

---

## Bước 4: Lập Kế hoạch hành động cải tiến (Prioritized Action Plan)

Phân tách rõ ràng:
1. **Quick Wins (Hoàn thành trong 1–2 giờ — ROI cao nhất):**
   - Tạo/rút gọn file `AGENTS.md` chuẩn súc tích (<150 dòng).
   - Tích hợp lệnh auto-format CLI (Spotless, Prettier, Ruff) vào script dự án.
2. **Strategic Investments (Đầu tư chiến lược 1–2 ngày):**
   - Tách Fast Test Subset runner.
   - Thêm `docker-compose.yml` cho local infra.
   - Cấu hình Lifecycle Hooks bảo vệ file migration và tài nguyên nhạy cảm.

---

## Bước 5: Soạn thảo Draft `AGENTS.md` tối ưu riêng cho repo

Dựa trên công nghệ và lệnh build/test phát hiện được từ repo, sinh ra một file `AGENTS.md` mẫu hoàn chỉnh (dưới 150 dòng), có thể copy vào root dùng ngay.

---

## Bước 6: Xuất Báo cáo & Phản hồi

1. **Ghi file báo cáo Markdown** dựa trên mẫu `references/report-template.md` vào:
   `output/reports/agent-ready-<tên-repo>-YYYY-MM-DD.md`
2. **Phản hồi súc tích trong chat** cho Tech Lead:
   - Điểm số tổng hợp /100 và cấp độ xếp loại.
   - 3 điểm nghẽn lớn nhất gây hao tổn token / cản trở agent.
   - 2 Quick Wins có ROI cao nhất cần làm ngay.
   - Đường dẫn mở file báo cáo chi tiết.
