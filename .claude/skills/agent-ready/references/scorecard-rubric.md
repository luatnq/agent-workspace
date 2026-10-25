# Agent-Ready Scorecard Rubric (Thang điểm 100 — Đa công nghệ)

Tài liệu tham chiếu định lượng dùng để chấm điểm mức độ sẵn sàng cho AI Coding Agent (Agent-Readiness). Mỗi tiêu chí đánh giá trên thang điểm từ 0 đến 10, hỗ trợ đa nền tảng: **Java / Spring Boot**, **TypeScript / Node**, **Python**, và **Go**.

---

## 1. Instruction File (AGENTS.md / CLAUDE.md)
*Trọng số: 10 điểm*

- **10 điểm (Hoàn hảo):** Có file `AGENTS.md` ở root, độ dài < 200 dòng, tuân thủ nguyên tắc Single Source of Truth, liệt kê các lệnh CLI cốt lõi (build, fast test, format) và quy ước khác thường (non-standard conventions). Không chứa văn xuôi mô tả kiến trúc dài dòng (>20% token) hoặc ngày giờ biến động làm vỡ Prefix Cache.
- **5 điểm (Trung bình):** Có file instruction nhưng dài > 200 dòng, lẫn lộn mô tả kiến trúc chung chung của framework, hoặc thiếu các non-standard conventions thực sự cần thiết.
- **0 điểm (Kém):** Không có file instruction nào, hoặc chỉ có file `README.md` cũ kỹ viết cho người đọc từ nhiều năm trước.

---

## 2. Hermetic Build & Dependency Management
*Trọng số: 10 điểm*

- **10 điểm (Hoàn hảo):** Có wrapper script hoặc lockfile tự túc, dependency được lock rõ ràng. Bản build thực thi được ngay trong container sạch không cần cài đặt môi trường ngoài:
  - *Java:* `./gradlew` hoặc `./mvnw`.
  - *Node/TS:* `package-lock.json`, `pnpm-lock.yaml`, hoặc `yarn.lock`.
  - *Python:* `poetry.lock`, `uv.lock`, hoặc `Pipfile.lock`.
  - *Go:* `go.sum` hoặc `vendor/`.
- **5 điểm (Trung bình):** Có file build (`pom.xml`, `package.json`, `requirements.txt`) nhưng thiếu wrapper/lockfile, đòi hỏi máy chủ phải cài sẵn SDK đúng phiên bản trong PATH.
- **0 điểm (Kém):** Build thất bại do thiếu dependency, dependency nội bộ không public, hoặc script phụ thuộc vào đường dẫn tuyệt đối trên máy cá nhân.

---

## 3. Fast Feedback Test Loop
*Trọng số: 10 điểm*

- **10 điểm (Hoàn hảo):** Có câu lệnh chạy tập con kiểm thử (Unit Test subset) của một class/module hoàn thành trong **dưới 15–30 giây**:
  - *Java:* `./gradlew test --tests *UnitTest` / `mvn test -Dtest=*UnitTest`.
  - *Node/TS:* `npm test -- -t "Unit"` / `npx vitest run src/utils`.
  - *Python:* `pytest -m "unit" -q` / `pytest tests/unit/`.
  - *Go:* `go test -short ./...`.
- **5 điểm (Trung bình):** Có unit test nhưng chỉ có 1 lệnh chạy toàn bộ test suite mất từ 3 đến 10 phút, hoặc một số bài test bị flaky (chập chờn).
- **0 điểm (Kém):** Không có test tự động, hoặc test suite chạy > 15–30 phút, hoặc bài test bắt buộc phải kết nối tới database dev dùng chung bên ngoài mới chạy được.

---

## 4. Automated Formatting & Linting (CLI Actionable)
*Trọng số: 10 điểm*

- **10 điểm (Hoàn hảo):** Có công cụ format tự động gọi trực tiếp từ dòng lệnh CLI (chạy < 5 giây):
  - *Java:* `./gradlew spotlessApply` / `mvn spotless:apply`.
  - *Node/TS:* `npm run format` / `npx prettier --write .`.
  - *Python:* `ruff format . && ruff check --fix .` / `black .`.
  - *Go:* `gofmt -w .` / `golangci-lint run --fix`.
- **5 điểm (Trung bình):** Có linter nhưng chỉ có lệnh kiểm tra báo lỗi (`checkstyle:check`, `eslint .`), không có lệnh auto-fix, hoặc linter chỉ chạy trên Jenkins CI sau khi tạo Pull Request.
- **0 điểm (Kém):** Không có linter/formatter; format dựa vào mắt người review.

---

## 5. Deterministic Local Dependencies
*Trọng số: 10 điểm*

- **10 điểm (Hoàn hảo):** Mọi phụ thuộc ngoại vi (PostgreSQL, Redis, Kafka, MockServer) được định nghĩa đầy đủ trong `docker-compose.yml` hoặc Testcontainers; có file `.env.example` hoặc profile `application-local.yml` chuẩn. Khởi động môi trường dev chỉ bằng 1 lệnh.
- **5 điểm (Trung bình):** Có docker-compose nhưng thiếu biến môi trường mẫu, hoặc một số service bắt buộc phải kết nối tới server dev dùng chung trong mạng nội bộ.
- **0 điểm (Kém):** Phụ thuộc hoàn toàn vào cơ sở dữ liệu dùng chung; không có cách nào dựng môi trường chạy thử độc lập trên máy local khi mất mạng.

---

## 6. Static Typing & Explicit Contracts
*Trọng số: 10 điểm*

- **10 điểm (Hoàn hảo):** Tận dụng tối đa kiểu tĩnh và validation contracts:
  - *Java:* Bean Validation (`@NotNull`, `@Valid`), OpenAPI / Swagger, JPA constraints.
  - *Node/TS:* TypeScript strict mode, Zod / TypeBox schema validation, tRPC / OpenAPI.
  - *Python:* Pydantic v2 models, type hints đầy đủ (`mypy` / `pyright`), FastAPI OpenAPI.
  - *Go:* Struct tags validation, explicit interfaces, Protobuf / gRPC contracts.
- **5 điểm (Trung bình):** Dùng ngôn ngữ kiểu tĩnh nhưng lạm dụng kiểu lỏng lẻo (`Map<String, Object>`, `any`), thiếu validation annotations, thiếu API schema.
- **0 điểm (Kém):** Kiểu dữ liệu động lỏng lẻo, cấu trúc payload không được định nghĩa, runtime dễ văng lỗi ngầm (NullPointer, TypeCastException).

---

## 7. Package Cohesion & Architecture Boundaries
*Trọng số: 10 điểm*

- **10 điểm (Hoàn hảo):** Tuân thủ bố cục thư mục tiêu chuẩn (`src/main/java`, `src/`, `pkg/`, `internal/`). Phân tách rõ ràng giữa Domain logic, Adapter hạ tầng và DTO. Không có quan hệ phụ thuộc vòng tròn (circular dependency).
- **5 điểm (Trung bình):** Phân lớp cơ bản nhưng ranh giới module bị thủng (Service gọi chéo nhau tùy tiện), một số file "God Class" phình to > 1.500 dòng mã.
- **0 điểm (Kém):** Cấu trúc hỗn loạn, mã nguồn đặt lẫn lộn ở root, các module phụ thuộc vòng tròn phức tạp.

---

## 8. Automated Guardrails & Lifecycle Hooks
*Trọng số: 10 điểm*

- **10 điểm (Hoàn hảo):** Có Lifecycle Hooks (`hooks.json` hoặc pre-commit scripts / Husky) chủ động chặn đứng agent trước khi sửa các file nhạy cảm (`db/migration/*.sql`, credentials, build scripts cốt lõi). Có tool tự động quét secret (gitleaks).
- **5 điểm (Trung bình):** Có file `.gitignore` tốt và có quy tắc hướng dẫn mềm trong `AGENTS.md` ("không được sửa migration"), nhưng chưa có hook cứng cưỡng chế ở tầng harness.
- **0 điểm (Kém):** Hoàn toàn không có chốt chặn; agent có thể tự do chỉnh sửa file migration database hoặc vô tình commit API key lên git.

---

## 9. Mocking & Test Fixtures Readiness
*Trọng số: 10 điểm*

- **10 điểm (Hoàn hảo):** Có sẵn bộ test fixtures mẫu và mock engine tái sử dụng:
  - *Java:* Mockito, WireMock, MockMvc.
  - *Node/TS:* Vitest / Jest mocks, MSW (Mock Service Worker).
  - *Python:* `unittest.mock`, `pytest-mock`, `responses`.
  - *Go:* `gomock`, `testify/mock`, `httptest`.
- **5 điểm (Trung bình):** Có thư viện mock nhưng thiếu fixtures chuẩn; mỗi bài test phải tự khởi tạo đối tượng thủ công dài dòng.
- **0 điểm (Kém):** Thiếu công cụ mocking; các bài test đều đòi hỏi kết nối mạng hoặc database thật.

---

## 10. Clean Logging & Actionable Error Output
*Trọng số: 10 điểm*

- **10 điểm (Hoàn hảo):** Thông báo lỗi biên dịch và test failure được định dạng gọn gàng, súc tích, chỉ hiển thị đúng nguyên nhân gốc (root cause). Không xả log thừa làm tràn context window của agent.
- **5 điểm (Trung bình):** Thông báo lỗi đầy đủ nhưng in quá nhiều dòng log DEBUG/INFO không cần thiết làm ô nhiễm ngữ cảnh.
- **0 điểm (Kém):** Lỗi bị nuốt chửng (empty catch block) hoặc xả stacktrace dài hàng vạn dòng khiến agent mất phương hướng hoặc làm đầy context.

---

## Bảng xếp loại cấp độ Agent-Readiness

| Tổng điểm | Cấp độ | Nhận định kỹ thuật |
|---|---|---|
| **0 – 39 điểm** | **Agent-Hostile** | Codebase thù địch: agent vào là kẹt, dễ làm hỏng mã nguồn hoặc gây cháy ngân sách token. Cần can thiệp Quick Wins ngay. |
| **40 – 70 điểm** | **Agent-Tolerant** | Mức chấp nhận được: agent giải quyết được các task đơn giản nhưng cần người dùng giám sát chặt chẽ, chi phí token cao. |
| **71 – 90 điểm** | **Agent-Friendly** | Thân thiện: agent tự hành tốt, tự sửa lỗi cú pháp/linter và verify qua test nhanh. Năng suất tăng 2–3 lần. |
| **91 – 100 điểm** | **Agent-Native** | Tự hành hoàn hảo: codebase vận hành như một API lý tưởng cho AI. Agent tự tạo PR hoàn chỉnh và chuẩn mực. |
