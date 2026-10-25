# Mẫu Báo Cáo Audit Agent-Readiness

File mẫu chuẩn cho báo cáo sinh ra tại `output/reports/agent-ready-<tên-repo>-YYYY-MM-DD.md`.

---

```markdown
# Báo cáo Audit Agent-Readiness: {{REPO_NAME}}

- **Dự án:** `{{REPO_NAME}}`
- **Đường dẫn:** `{{REPO_PATH}}`
- **Thời gian thực hiện:** {{DATE_TIME}}
- **Công nghệ chính:** {{TECH_STACK}}
- **Người đánh giá:** Skill `/agent-ready` (Modern Software Developer)

---

## 1. Kết quả chấm điểm tổng hợp (Scorecard 100 điểm)

| # | Tiêu chí đánh giá | Điểm đạt được | Điểm tối đa | Bằng chứng kỹ thuật (Evidence) & Đánh giá |
|---|---|:---:|:---:|---|
| 1 | **Instruction File (AGENTS.md)** | **{{SCORE_1}}** | 10 | {{EVIDENCE_1}} |
| 2 | **Hermetic Build & Dependencies** | **{{SCORE_2}}** | 10 | {{EVIDENCE_2}} |
| 3 | **Fast Feedback Test Loop** | **{{SCORE_3}}** | 10 | {{EVIDENCE_3}} |
| 4 | **Automated Formatting & Linting** | **{{SCORE_4}}** | 10 | {{EVIDENCE_4}} |
| 5 | **Deterministic Local Dependencies** | **{{SCORE_5}}** | 10 | {{EVIDENCE_5}} |
| 6 | **Static Typing & Explicit Contracts**| **{{SCORE_6}}** | 10 | {{EVIDENCE_6}} |
| 7 | **Package Cohesion & Boundaries** | **{{SCORE_7}}** | 10 | {{EVIDENCE_7}} |
| 8 | **Automated Guardrails & Hooks** | **{{SCORE_8}}** | 10 | {{EVIDENCE_8}} |
| 9 | **Mocking & Test Fixtures** | **{{SCORE_9}}** | 10 | {{EVIDENCE_9}} |
| 10 | **Clean Logging & Actionable Errors**| **{{SCORE_10}}** | 10 | {{EVIDENCE_10}} |
| **TỔNG ĐIỂM** | | **{{TOTAL_SCORE}} / 100** | | **Xếp loại: {{CLASSIFICATION}}** |

---

## 2. Phân tích điểm nghẽn (Bottlenecks)

1. **Điểm nghẽn gây hao tổn Token lớn nhất:**
   - {{BOTTLENECK_TOKEN}}
2. **Điểm nghẽn làm đứt gãy vòng lặp ReAct:**
   - {{BOTTLENECK_REACT}}
3. **Rủi ro an toàn hoặc rò rỉ mã nguồn:**
   - {{BOTTLENECK_SAFETY}}

---

## 3. Kế hoạch hành động cải tiến (Action Plan)

### A. Quick Wins (Hoàn thành trong 1–2 giờ — ROI cao nhất):
1. **{{QUICK_WIN_1}}**: {{DESC_1}}
2. **{{QUICK_WIN_2}}**: {{DESC_2}}

### B. Strategic Investments (Đầu tư chiến lược 1–2 ngày):
1. **{{STRATEGIC_1}}**: {{DESC_STRATEGIC_1}}
2. **{{STRATEGIC_2}}**: {{DESC_STRATEGIC_2}}

---

## 4. Dự phóng ROI sau khi chuẩn hóa

- **Tỷ lệ task hoàn thành (Pass Rate):** Dự kiến tăng từ `{{CURRENT_PASS_RATE}}%` lên `{{EXPECTED_PASS_RATE}}%`.
- **Lượng token tiêu thụ:** Dự kiến giảm `{{TOKEN_REDUCTION}}%` nhờ có instruction file súc tích và fast feedback test loop.
- **Thời gian một turn (Latency):** Dự kiến giảm từ `{{CURRENT_LATENCY}}` xuống còn `{{EXPECTED_LATENCY}}`.

---

## 5. Phụ lục: Bản Draft `AGENTS.md` tối ưu riêng cho repo

```markdown
# AGENTS.md — {{REPO_NAME}}

## Build & Test
- Build: `{{BUILD_CMD}}`
- Fast Test: `{{FAST_TEST_CMD}}`
- Format: `{{FORMAT_CMD}}`

## Non-standard Conventions
- {{CONVENTION_1}}
- {{CONVENTION_2}}

## Safety Guardrails
- {{SAFETY_RULE}}
```
```
