# Xây personal AI workspace với Claude Code: ai đã làm, pattern nào hiệu quả

Ngày: 2026-09-08
Câu hỏi: Cấu hình skills / agents / context cho repo `my-agent` sao cho dùng hiệu quả nhất. Đã có ai làm chưa, họ học được gì?

Phương pháp: 3 nhánh nghiên cứu song song — (1) tài liệu chính thức của Anthropic (docs, engineering blog, repo `anthropics/skills`), (2) 22 ví dụ cộng đồng có repo/bài viết thật, (3) pattern thiết kế skill/agent từ `anthropics/skills`, `obra/superpowers`, oh-my-claudecode và community. Kèm số đo thực tế của workspace hiện tại.

---

## 1. TL;DR

1. **Có, rất nhiều người đã làm** và đây là hướng dùng chính thống: telemetry của Anthropic (06/2026) cho thấy phần "writing + data analysis" trong Claude Code tăng gấp đôi lên ~20% session, và chuyên môn lĩnh vực quan trọng hơn kỹ năng code.
2. **Stack "sống sót" được sau vài tháng rất gọn**: CLAUDE.md ≤200 dòng chỉ *định tuyến*; index 1 dòng/mục + file chi tiết; `raw/` bất biến + tầng tổng hợp do model viết; **write-back bắt buộc cuối phiên**; git là memory; audit định kỳ để xoá; một nhúm skill mà mỗi cái *thấy rõ* thay đổi output.
3. **Bài học lớn nhất từ Anthropic 07/2026**: họ cắt >80% system prompt của Claude Code cho thế hệ Claude 5 mà không mất điểm eval, kết luận "chúng tôi đã *overconstrain* cả trong system prompt lẫn CLAUDE.md và skills". Với repo này, đòn bẩy cao nhất là **xoá bớt**, không phải thêm.
4. **Workspace hiện tại đã đúng xương sống** (memory index + file, output/ theo skill, phân định skill theo mục đích). Ba chỗ cần sửa: (a) chi phí context luôn-nạp quá lớn và phần lớn không nằm trong repo này, (b) skill description dài, không dùng `disable-model-invocation`, (c) hai hệ memory chạy song song, trùng dữ liệu.

---

## 2. Khái niệm chính: cơ chế nào tốn gì

Tài liệu chính thức (`features-overview`, `context-window`) đưa bảng chi phí. Đây là nền cho mọi quyết định:

| Cơ chế | Nạp khi nào | Chi phí context | Dùng cho |
|---|---|---|---|
| **CLAUDE.md** (+ mọi `@import`) | Session start | **Mọi request**, cả khi spawn subagent | Fact phải giữ mọi phiên; `@import` chỉ để tổ chức, **không giảm** context |
| **`.claude/rules/*.md`** | Session start, hoặc khi mở file khớp `paths:` | Mọi request (không scope) / theo nhu cầu (có `paths:`) | Quy ước theo loại file/thư mục |
| **Skill** | Description: session start. Body: khi kích hoạt | Description luôn nạp, tổng listing bị **cap ~1% context window**; vượt cap thì **tự cắt skill ít dùng nhất, không báo** | Quy trình, kiến thức dùng-khi-cần |
| **Skill `disable-model-invocation: true`** | Chỉ khi gõ `/name` | **Zero** cho đến khi gọi | Skill có side effect hoặc luôn gọi tay |
| **Subagent** | Khi spawn | Context riêng; chỉ bản tóm tắt cuối về parent. Description của mọi agent chia chung budget 15k token | Việc nhiều output không cần đọc lại, giới hạn tool, chọn model rẻ |
| **Hook** | Theo lifecycle event | Zero, trừ khi in output vào context | Việc phải xảy ra *mọi lần*, deterministic |
| **MCP** | Tool name lúc start, schema khi dùng | Thấp cho tới khi gọi | Trạng thái/hành động bên ngoài ("query, fetch, current state") |
| **Plugin** | — | = tổng những gì nó gói | Chỉ khi cần phân phối sang repo/người khác |

Ba con số hay bị bỏ qua:

- Chỉ **200 dòng đầu hoặc 25KB** của `MEMORY.md` được nạp; phần sau bị bỏ im lặng.
- Skill description cap **1.536 ký tự**/skill, cắt từ cuối. Nên đặt trigger phrase ở câu đầu.
- Subagent ví dụ trong docs đọc 4 file, trả về parent **420 token**. Đó là toàn bộ lý do tồn tại của subagent.

**Nguyên tắc chọn cơ chế** (bảng "build your setup over time" của Anthropic): Claude sai một quy ước 2 lần → CLAUDE.md. Gõ lại cùng prompt mở đầu → skill user-invoked. Paste cùng playbook lần thứ 3 → skill. Copy dữ liệu từ hệ thống Claude không thấy → MCP. Việc phụ làm ngập hội thoại → subagent. Muốn xảy ra mọi lần không cần hỏi → hook. Repo thứ hai cần cùng setup → plugin.

**Guardrail phải là hook, không phải câu chữ**: "An instruction like 'never edit .env' in CLAUDE.md is a request, not a guarantee. A PreToolUse hook that blocks the edit is enforcement."

---

## 3. Ai đã làm: các ví dụ đáng học

Độ tin cậy: **[A]** tác giả mô tả hệ thống đang dùng thật, có chi tiết; **[B]** repo thật nhưng chỉ có README; **[C]** mỏng/quảng cáo. Đã loại bỏ các bài content-farm SEO.

| Ví dụ | Mục tiêu | Ý đáng lấy | Tin cậy |
|---|---|---|---|
| **Karpathy "LLM Wiki"** | Knowledge base nghiên cứu | `raw/` bất biến (model chỉ đọc) → `wiki/` model chỉ viết → CLAUDE.md là schema. Chạy tới ~400k từ vẫn tốt hơn RAG | A (gián tiếp) |
| **Hadi Javeed `personal-os`** | Life OS | **"Compiled truth"**: mỗi trang có phần tổng hợp hiện tại (viết lại toàn bộ khi có tin mới) + timeline append-only bên dưới. Chỉ **6 slash command** + CLAUDE.md 318 dòng. Từ chối auto-capture email/Slack vì "sinh slop" | A |
| **Karthik Kamalakannan** (CTO) | Second brain bền | **Tách 2 repo** personal / engineering vì vault gộp "nói dối về việc đang đội mũ nào". Noun folders (`cloudflare/`) thay vì PARA. **Write-back bắt buộc**: "Chat is disposable. The note is not." | A |
| **seandavi `lifeos-template`** | Life OS cho lead/researcher | **Feedback layer**: `/morning`, `/end-of-day`, `/weekly-review`, `/audit` hàng tháng (chấm điểm vault, tìm orphan), `/decide` + `/decide-revisit` so dự đoán vs kết quả. Claim: template không có vòng phản hồi **mục rữa sau 2–3 tháng** | B+ |
| **Rafferty Uy "Pepper"** | Assistant trên Obsidian vault | Tách lãnh thổ: `_agent/` (memory, skill agent tự gọi) vs `.claude/skills/` (user gọi). Session-start ritual. SQLite FTS5 thay embeddings. Sửa CLAUDE.md thay vì sửa trong chat | A |
| **Kenneth Reitz** | Vault 467 file | Coi **CLAUDE.md như API contract**: quy ước, cái *không* làm, ranh giới dữ liệu nhạy cảm | A |
| **Matt Stockton** | Chạy consulting business | Mono-repo, mỗi client một folder có **nested CLAUDE.md** + work log append-only. Bootstrap CLAUDE.md bằng ghi âm rồi để Claude phỏng vấn lại. **Tránh MCP vì token cost** | A |
| **kaszubski `engineering-leader-skills`** | Lead team | Chỉ **4 skill**, có `evals/`: `repo-xray` (review concentration, knowledge silo, time-to-first-review), `pr-review` (coupling/reviewability, không nit style), `coaching-calibrator`, `retro-facilitator`. Nguyên tắc: "No framework theatre" | B+ |
| **ftvision `system-design-skill`** | Luyện phỏng vấn | 4 mode `mock/learn/postmortem/generate`. State `runs.md`, `weaknesses.md`, `level.md`; **phiên sau tự lệch về điểm yếu đã ghi** | B |
| **`english-coach` + `english-log`** | Học tiếng Anh | Sửa lỗi tiếng Anh *trong lúc làm việc bình thường*, phân loại Grammar/Vocab, log thành bảng = deck ôn tập, không cần bước capture riêng | B |
| **coleam00 `second-brain-starter`** | PRD cho assistant | Từ vựng memory: episodic (`daily/`) vs semantic (`MEMORY.md`, `USER.md`). Hook `SessionStart`/`PreCompact`/`SessionEnd`. Đo: local markdown **$0.05/run vs $0.38 với MCP** | B |
| **`workshop`** | Memory cho coding | Phản đề: SQLite + auto-capture quyết định kèm lý do. Hợp cho *quyết định kỹ thuật trong codebase*; không hợp cho personal knowledge | B |
| **`LifeOS-OSS`** (14 persona), **`second-brain-starter-kit`** (101 skill) | — | **Ví dụ cảnh báo**: kiến trúc hoành tráng, không có audit loop, không có bằng chứng dùng bền. Vercel eval: skill không kích hoạt trong 56% case | B− |

Lưu ý thành thật: gần như không ai có retrospective 12 tháng. Javeed là người duy nhất nói hệ của mình "mới vài ngày, chưa qua thử thách thời gian".

---

## 4. Pattern lặp lại và anti-pattern

### Pattern (xuất hiện ở ≥3 nguồn độc lập)

1. **Ba tầng tri thức**: `raw/` bất biến → tầng tổng hợp do model viết → CLAUDE.md là schema.
2. **Index + detail**: một file định tuyến, nội dung đọc khi cần. Cả auto-memory của Anthropic lẫn `memory/MEMORY.md` của repo này đều là pattern này.
3. **Write-back là memory thật**: kết thúc phiên = bước "compile": ghi quyết định vào đúng file, cập nhật index, commit. Assistant phải xác nhận "đã ghi X → file Y" (receipts).
4. **Git là persistence + sync**. Không DB, không cloud.
5. **Nhịp review** ngày / tuần / tháng / quý, trong đó tháng và quý là để **xoá**.
6. **Tách vai** (repo personal vs work) và **tách lãnh thổ** (thứ máy viết vs thứ người viết).
7. **Skill phải "kiếm được" chỗ đứng**: workflow lặp lại nhiều lần mới được thăng thành skill; cắt skill không đổi output.
8. **Full-text search thắng embeddings** ở quy mô cá nhân (FTS5, QMD, grep).

### Anti-pattern (có người trả giá thật)

1. **CLAUDE.md phình**: ~200 dòng là ngưỡng tốt; >500 cần cấu trúc; ~1000 model bắt đầu "sample và diễn giải" thay vì đọc. LLM tuân thủ ổn định ~150–200 instruction, system prompt của Claude Code đã dùng ~50.
2. **Skill không bao giờ kích hoạt**: description mô tả (passive) đạt 37% activation, description chỉ thị ("Use when…") đạt 100% trong 650 trial. Claude cũng *không* tra skill cho việc đơn giản một bước.
3. **Vault rữa sau 2–3 tháng** nếu không có audit loop.
4. **Auto-capture sinh slop**: "một transcript chưa phải tri thức cho tới khi con người quyết định nó đáng nhớ".
5. **Nghi thức trước khi có đau**: persona, badge, folder quarantine thêm trước khi có friction.
6. **MCP đắt** (~7x) nếu gọi mỗi phiên.
7. **Description tóm tắt workflow** → agent làm theo description và bỏ qua body (superpowers đo được).
8. **"Don't X" phản tác dụng** với vấn đề *hình dạng* output: recipe dương tính thắng prohibition (superpowers test head-to-head).

### Hai trường phái về description, và cách hoà giải

- `skill-creator` (Anthropic): description nên "pushy", nêu cả what + when, vì Claude undertrigger.
- `superpowers`: description **chỉ nêu when**, không tóm tắt quy trình.
- Hoà giải theo loại skill: **capability skill** (docx, review-java, po — Claude không làm tốt nếu thiếu) → dạng Anthropic + negative trigger. **Process/discipline skill** (TDD, debugging, checklist) → dạng superpowers, body mới là giá trị.

---

## 5. Đối chiếu với workspace hiện tại

### Số đo (đo ngày 2026-09-08)

| Thành phần luôn nạp | Kích thước | Ghi chú |
|---|---|---|
| `~/.claude/CLAUDE.md` (OMC sinh) | ~2.000 từ / 17 KB | Gấp ~2 lần toàn bộ context của repo này, nạp vào mọi project và mọi subagent |
| `CLAUDE.md` + `profile.md` + `conventions.md` + `MEMORY.md` | ~1.100 từ | Trong ngưỡng, nhưng CLAUDE.md có bảng thư mục + bảng output là "the obvious" |
| 10 skill description (project) | ~3.900 ký tự | `brainstorm`, `review-java` 813 ký tự; `po` 727 |
| 9 agent description (user-level) | ~12.600 ký tự | Trung bình 1.400 ký tự/agent; `multi-language-code-reviewer` 2.237 |
| Plugin: superpowers ~15 skill, OMC ~40 skill + ~25 agent, 4 MCP | không đo được từ shell | Chắc chắn vượt budget 1% → có skill đang bị cắt description mà không ai biết |
| Auto-memory `~/.claude/projects/.../memory/` | có `user-profile-luat.md` | **Trùng** với `context/profile.md`, cả hai nạp mọi phiên |

Frontmatter đang dùng: chỉ `name`, `description`, `argument-hint`. Chưa dùng `disable-model-invocation`, `paths`, `context: fork`, `.claude/rules/`, `.claude/settings.json`.

### Đang đúng (giữ)

- `memory/MEMORY.md` 1 dòng/mục + file chi tiết: đúng y pattern chính thức. Câu "kiểm tra memory còn đúng không trước khi dùng" đang làm việc thật.
- `output/<skill>/` với cột commit/ignore: đúng pattern "skill khai báo nơi output".
- Phân định `brainstorm` / `po` / design **theo mục đích** kèm negative trigger trong description: đúng cách disambiguate.
- `research` giao cho agent sẵn có thay vì tạo agent mới: đúng "don't add before pain".
- Không biến thành plugin: đúng, trigger duy nhất của Anthropic là "repo thứ hai cần cùng setup".

### Cần sửa

1. **Thuế context nằm ngoài repo**: `~/.claude/CLAUDE.md` của OMC và 9 agent user-level. Bảng điều phối 9 agent trong CLAUDE.md của repo lại chồng với ~25 agent OMC (`code-reviewer` vs `multi-language-code-reviewer` vs `senior-software-engineer`…): đây đúng là lỗi "ambiguous decision points" mà Anthropic nêu tên.
2. **CLAUDE.md chứa "the obvious"**: cây thư mục và bảng output (git đã encode trong `.gitignore`). Hai bảng định tuyến là *decision procedure*, docs nói đưa vào skill/rule chứ không ở always-on.
3. **Skill description**: dài, chưa có `disable-model-invocation` cho skill luôn gọi tay (`translate`, `polish`, `report`, `remember`, `cv-review`, `skill-creator`, `gitcommit`).
4. **Skill dài** (`brainstorm` 2.8k từ, `po` 1.9k, `review-java` 1.4k + 13 file, `cv-review`): theo guidance 07/2026 đang overconstrain Claude 5; phần *đặc thù của tôi* (chuẩn banking, gu review) giữ, phần mô tả phương pháp chung → `references/` hoặc xoá.
5. **Hai hệ memory**: repo `memory/` (portable, có git) và auto-memory (machine-local, Claude tự viết). Chưa có ranh giới.
6. **Dữ liệu nhạy cảm** (`output/cv/`, `output/reviews/`, `output/mock-interviews/`) chỉ được bảo vệ bằng `.gitignore` + một câu trong CLAUDE.md: là request, không phải enforcement.
7. **Chưa có feedback layer**: không có audit định kỳ để xoá memory/skill rữa, không có `SessionStart matcher: compact` để sống qua phiên dài.
8. **Thiếu mảng học tập** dù mục tiêu 3 tháng phỏng vấn tiếng Anh đã ghi trong memory.

---

## 6. Khuyến nghị

Nguyên tắc chung: **xoá trước, thêm sau**; mỗi thay đổi phải đo được (`/context`, `/skill-doctor`, `/doctor`).

### Bước 1: Đo và cắt (1 buổi, tác động cao nhất)

- Chạy `/context` (đọc block Memory files + Skills), `/skill-doctor`, `/doctor`. Lấy số thật trước khi sửa.
- CLAUDE.md của repo: bỏ cây thư mục và bảng output; giữ mục đích repo, ngôn ngữ, quy tắc memory, và 3–4 "gotcha" thật. Áp câu hỏi của docs cho từng dòng: *"Bỏ dòng này Claude có sai không?"*
- Thêm `disable-model-invocation: true` cho 7 skill gọi tay kể trên. Riêng việc này giảm listing đi hơn nửa với chi phí zero.
- Rút description còn lại: trigger phrase ở câu đầu, negative trigger ở câu cuối, ≤400 ký tự.
- Với 9 agent user-level: rút description xuống 1–2 câu "khi nào delegate", chuyển chi tiết xuống body. Cân nhắc xoá agent trùng với OMC.

### Bước 2: Quyết định hai việc có trade-off (cần tôi chốt)

**(a) Memory: gộp hay tách?**

| Phương án | Ưu | Nhược |
|---|---|---|
| **Gộp**: `autoMemoryDirectory` trỏ vào `memory/` của repo | Auto-capture của Claude 5 (Anthropic khuyến nghị 07/2026) + portable qua git | Claude tự viết vào git, phải review trước commit; rủi ro slop mà Javeed cảnh báo |
| **Tách**: `autoMemoryEnabled: false` cho repo | Một bộ não duy nhất, do tôi curate, sạch | Mất capture tự động; phải tự gọi `/remember` |
| **Phân tầng** (khuyến nghị): auto-memory giữ nguyên (máy-local, đổi ý liên tục, feedback/correction); `memory/` chỉ giữ fact bền, portable; `/remember` chỉ nhắm tầng bền; xoá bản trùng profile trong auto-memory | Đúng phân biệt của Warp: "skill là thủ tục ổn định, memory tự viết và không ngừng đổi"; không phải review git noise | Hai nơi phải nhớ ranh giới; cần một dòng trong CLAUDE.md nói rõ tầng nào ghi gì |

**(b) Skill cá nhân đặt ở đâu?**

`translate`, `polish`, `research`, `remember` là của *tôi*, không phải của repo này; để trong `.claude/skills/` thì chỉ chạy khi cwd là repo này. Đưa lên `~/.claude/skills/` thì dùng được mọi project (precedence: personal > project). Đổi lại mất version control, trừ khi symlink từ repo hoặc `claude plugin init` trong `~/.claude/skills/` (skills-dir plugin, không cần marketplace). Skill workspace-specific (`report`, `po`, `cv-review`, `review-java`) ở lại project. Tương tự `conventions.md` → `~/.claude/rules/conventions.md` áp cho mọi repo.

Khuyến nghị: symlink `~/.claude/skills/<name>` → `.claude/skills/<name>` trong repo để vừa global vừa có git.

### Bước 3: Thêm phần còn thiếu, theo thứ tự "có đau mới thêm"

1. **`.claude/settings.json` committed**: `permissions.deny` `Read`/`Edit` cho 3 thư mục nhạy cảm; `allow` vài lệnh read-only hay dùng. Biến request thành enforcement.
2. **Hook** `SessionStart` với `matcher: "compact"` in "focus hiện tại"; hook `Notification` cho phiên research dài. Cân nhắc `Stop` hook đề xuất memory update từ transcript (pattern chính thức trong docs large-codebases), nhưng chỉ *đề xuất*, con người duyệt.
3. **Write-back cuối phiên** vào quy trình: một dòng trong CLAUDE.md "kết thúc việc lớn → ghi quyết định vào memory/output, cập nhật index, báo 'đã ghi X → Y'". Đây là pattern có bằng chứng bền nhất trong corpus.
4. **Feedback layer**: mở rộng `/report` tuần thêm mục "memory/skill nào không dùng 30 ngày → đề xuất xoá"; quý một lần review `memory/` và skill list. Thêm PR review activity vào `/report` (chỗ công việc lead thật sự nằm, git log không thấy).
5. **Tái cấu trúc skill dài** theo progressive disclosure: `SKILL.md` <500 dòng chỉ định tuyến, phần quan trọng nhất ở đầu (compaction cắt từ cuối), `references/` có TOC nếu >300 dòng. `review-java` thêm `paths: ["**/*.java"]`.
6. **Mảng học tập** (mục tiêu 3 tháng): (a) skill kiểu `english-coach`: sửa tiếng Anh *trong lúc làm việc*, log thành `output/learning/english-log.md` làm deck ôn; (b) skill mock interview kỹ thuật bằng tiếng Anh theo mẫu ftvision với `weaknesses.md` để phiên sau lệch về điểm yếu; cả hai `disable-model-invocation: true`. Memory "đừng đề xuất luyện đề" làm negative trigger. Có thể tận dụng phần mock-interview đã có trong `cv-review` nhưng đảo vai.
7. **Mảng lead**: cân nhắc 2 skill từ kaszubski: `repo-xray` (tín hiệu sức khoẻ team từ git/PR) và `coaching-calibrator` (frame là hội thoại chẩn đoán, không phải hồ sơ ngầm về người khác).

### Không nên làm

- Không biến repo thành plugin. Không thêm persona/agent mới. Không auto-capture email/Slack. Không thêm MCP gọi mỗi phiên. Không sao chép template 100 skill.

---

## 7. Nguồn

**Anthropic chính thức**
- The new rules of context engineering for Claude 5 (2026-07-24): https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models
- How Claude remembers your project (CLAUDE.md, rules, auto-memory): https://code.claude.com/docs/en/memory
- Skills: https://code.claude.com/docs/en/skills · Spec: https://agentskills.io/specification
- Subagents: https://code.claude.com/docs/en/sub-agents
- Extend Claude Code (bảng chi phí context): https://code.claude.com/docs/en/features-overview
- Context window: https://code.claude.com/docs/en/context-window
- Best practices: https://code.claude.com/docs/en/best-practices
- Large codebases / layered instructions: https://code.claude.com/docs/en/large-codebases
- Hooks: https://code.claude.com/docs/en/hooks-guide · Permissions: https://code.claude.com/docs/en/permissions
- Plugins: https://code.claude.com/docs/en/plugins · `.claude` layout: https://code.claude.com/docs/en/claude-directory
- Steering Claude Code (2026-06-18): https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more
- Usage research (2026-06-16): https://www.anthropic.com/research/claude-code-expertise
- Effective context engineering (2025-09-29): https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Agent Skills (2025-10-16): https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- Writing tools for agents (2025-09-11): https://www.anthropic.com/engineering/writing-tools-for-agents
- Warp self-improving agents (2026-08-26): https://claude.com/blog/how-warp-builds-self-improving-agents-on-claude
- Harness design for long-running apps (2026-03-24): https://www.anthropic.com/engineering/harness-design-long-running-apps
- anthropics/skills (skill-creator, docx…): https://github.com/anthropics/skills

**Cộng đồng**
- Hadi Javeed, personal-os: https://www.hadijaveed.me/2026/04/15/i-tried-karpathys-llm-knowledge-base/
- Karthik Kamalakannan, second brain: https://imkarthikk.com/blog/how-i-manage-my-second-brain
- seandavi/lifeos-template: https://github.com/seandavi/lifeos-template
- davidhariri/life-system: https://github.com/davidhariri/life-system
- Rafferty Uy, Pepper: https://raffertyuy.com/raztype/personal-assistant/
- Kenneth Reitz, Obsidian + Claude Code: https://kennethreitz.org/essays/2026-03-06-obsidian_vaults_and_claude_code
- Stefan Imhoff, vault 6.000 note: https://www.stefanimhoff.de/writing/agentic-note-taking-obsidian-claude-code/
- carlvellotti/carls-product-os: https://github.com/carlvellotti/carls-product-os
- Matt Stockton, non-technical work: https://mattstockton.com/2026/01/07/claude-code-for-non-technical-work.html
- kaszubski/engineering-leader-skills: https://github.com/kaszubski/engineering-leader-skills
- ftvision/system-design-skill: https://github.com/ftvision/system-design-skill
- tianmind-studio/english-coach: https://github.com/tianmind-studio/english-coach
- hluaguo/learn-faster-kit: https://github.com/hluaguo/learn-faster-kit
- coleam00/second-brain-starter: https://github.com/coleam00/second-brain-starter
- zachswift615/workshop: https://github.com/zachswift615/workshop
- AgriciDaniel/claude-obsidian: https://github.com/AgriciDaniel/claude-obsidian
- Cảnh báo: kcwoodfield/LifeOS-OSS, tonydzi/second-brain-starter-kit
- Karpathy LLM Wiki (qua bài dẫn): https://www.kunalganglani.com/blog/llm-wiki-karpathy-local-knowledge-base
- Stop bloating your CLAUDE.md (Vercel eval, HumanLayer <60 dòng): https://alexop.dev/posts/stop-bloating-your-claude-md-progressive-disclosure-ai-coding-tools/
- Skill không trigger, 650 trial: https://dev.to/lizechengnet/why-claude-code-skills-dont-trigger-and-how-to-fix-them-in-2026-o7h
- obra/superpowers (writing-skills, persuasion-principles): https://github.com/obra/superpowers
- Yeachan-Heo/oh-my-claudecode: https://github.com/Yeachan-Heo/oh-my-claudecode
- JoaquinCampo/skill-doctor: https://github.com/JoaquinCampo/skill-doctor

Ghi chú: docs Claude Code đã chuyển từ `docs.claude.com/en/docs/claude-code/*` sang `code.claude.com/docs/en/*`; link cũ trong workspace nên cập nhật.
