# The Modern Software Developer Resources

Nguồn tin cậy cho workspace này. Nội dung bài học phải lấy từ đây, không lấy từ trí nhớ của agent. Nền LLM/agent (token, context, caching, tool loop, RAG, eval, inference) nằm ở `../llm-foundation/RESOURCES.md`, không chép lại ở đây. Cập nhật lần cuối: 2026-09-26.

## Knowledge

### Khung khóa học
- [Course: Stanford CS146S "The Modern Software Developer" — Mihail Eric (Fall 2026)](https://themodernsoftware.dev/)
  Outline 10 tuần. Tính đến 2026-09-26 mới có tài liệu cho Week 1; Week 2–10 chỉ có topic. Syllabus render bằng JS, nên WebFetch trả về trang rỗng. Dùng cho: khung lộ trình và thứ tự chủ đề.
- [Course archive: CS146S Fall 2025](https://themodernsoftware.dev/fall2025)
  Danh sách bài đọc đầy đủ cho 10 tuần (MCP, AI IDE, Claude Code patterns, security, code review, post-deployment). Dùng cho: **nguồn dự phòng** khi tuần tương ứng của 2026 chưa có bài đọc.
- [Repo: mihail911/modern-software-dev-assignments](https://github.com/mihail911/modern-software-dev-assignments)
  Bài tập Fall 2025 theo tuần. Dùng cho: ý tưởng bài tập hands-on, sau đó chuyển sang làm trên repo thật.
- [Roadmap: roadmap.sh/ai-agents](https://roadmap.sh/ai-agents) · [dữ liệu gốc trên GitHub](https://github.com/kamranahmedse/developer-roadmap/tree/master/roadmaps/ai-agents/content)
  90 topic về xây AI agent (memory, kiến trúc, observability, testing, guardrails, framework). Dùng cho: **trục "AI agents core"** lồng vào CS146S, và checklist xem còn thiếu mảng nào. Mỗi file .md của topic có link tham khảo, nhưng chất lượng không đều, nên phải lọc trước khi dùng.

### Week 1 — Bên trong coding agent
- [Video: "How to code Claude Code in ~200 lines of code" — Mihail Eric (CS146S Week 1 reading)](https://youtube.com/watch?v=s7ZzkdvCMDY) · [bài blog tương ứng: "The Emperor Has No Clothes" (01/2026)](https://www.mihaileric.com/The-Emperor-Has-No-Clothes/)
  Agent loop tối thiểu bằng Python: 3 tool (read_file, list_files, edit_file), giao thức tool dạng text `tool: NAME({json})` thay vì native function calling, edit bằng thay chuỗi. Dùng cho: bài 1, xem khung xương của agent.
- [Slides Week 1 Fall 2026 (Google Slides)](https://docs.google.com/presentation/d/1uztIhjHAG6O_9QOD1N_3wdhwhABml1fANXEN2dGwdbg) · [code hoàn chỉnh `coding_agent_from_scratch.py`, 192 dòng](https://drive.google.com/file/d/1DxKa_autBOu9s8DvItodgUAwH_pBg7aR)
  Dùng cho: đối chiếu từng dòng khi đọc code.
- [Article: "How to Build an Agent" — Thorsten Ball (Amp, 04/2025)](https://ampcode.com/notes/how-to-build-an-agent)
  Cùng ý tưởng, viết bằng Go, dùng native tool calling. Dùng cho: bản đối chiếu dễ đọc với dân backend.
- [Doc: Claude Code — Tools reference](https://code.claude.com/docs/en/tools-reference)
  Ngữ nghĩa chính thức của Read/Write/Edit/Bash/Glob/Grep. Edit có ba điều kiện: phải Read trước, `old_string` khớp chính xác, xuất hiện đúng một lần. Bash giữ `cd` nhưng không giữ env var. Dùng cho: mọi câu hỏi "tool này hành xử thế nào".
- [Doc: How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
  Vòng lặp "gather context → take action → verify results"; model và harness là hai thứ khác nhau; 5 nhóm tool; compaction, checkpoint, MCP tool deferred. Dùng cho: mô hình tư duy về harness.
- [Article: "Building agents with the Claude Agent SDK" — Thariq Shihipar (09/2025)](https://claude.com/blog/building-agents-with-the-claude-agent-sdk)
  Chọn agentic search (grep) thay vì semantic search; 3 kiểu verify (rules, visual, LLM-as-judge); subagent để cô lập context. Dùng cho: bài 1–2, và Week 4 (subagent).
- [Doc: Modifying system prompts — Agent SDK](https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts)
  Preset `claude_code` gồm hướng dẫn dùng tool, luật an toàn, context môi trường. CLAUDE.md được chèn vào conversation, không nằm trong system prompt. `excludeDynamicSections` giúp chia sẻ prompt cache giữa các phiên. Dùng cho: bài về system prompt, nối sang bài 7 của llm-foundation.
- [Article: "Raising the bar on SWE-bench Verified" — Anthropic (01/2025)](https://www.anthropic.com/engineering/swe-bench-sonnet)
  Scaffold chỉ có 2 tool (bash + edit) đạt 49%; bắt buộc đường dẫn tuyệt đối sau khi model lỗi với `cd`. Dùng cho: bằng chứng rằng bộ tool nhỏ nhưng được thiết kế kỹ là đủ.
- [Doc: Text editor tool — Anthropic](https://platform.claude.com/docs/en/agents-and-tools/tool-use/text-editor-tool)
  `str_replace` chỉ thay khi khớp đúng một chỗ, và có message lỗi mẫu khi khớp nhiều chỗ. Dùng cho: vì sao edit bằng thay chuỗi.
- [Doc: Aider edit formats](https://aider.chat/docs/more/edit-formats.html) · [Unified diffs benchmark](https://aider.chat/docs/unified-diffs.html)
  So sánh whole / SEARCH-REPLACE / udiff kèm số liệu. Line number làm model sai nhiều; bỏ flexible patching thì lỗi tăng 9×. Dùng cho: trade-off định dạng edit.
- [Prompt: OpenAI Codex CLI system prompt (open source)](https://github.com/openai/codex/blob/main/codex-rs/models-manager/prompt.md)
  System prompt production công khai: identity, tone, luật AGENTS.md, persistence, tool policy, plan tool, git safety, verify. Claude Code **không** công bố prompt; system prompt mà Anthropic công bố chỉ là của claude.ai. Dùng cho: bài giải phẫu system prompt.
- [Guide: GPT-4.1 prompting guide — OpenAI Cookbook](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide)
  Định dạng apply_patch (không line number, anchor `@@`); agentic reminders tăng SWE-bench Verified gần 20%. Dùng cho: bằng chứng định lượng cho system prompt.

## Wisdom (Communities)
- [Latent Space (podcast + Discord)](https://www.latent.space) và kênh YouTube AI Engineer
  Phỏng vấn các team build Claude Code, Cursor, Cognition. Dùng cho: nghe practitioner nói về trade-off thật.
- [Simon Willison — ai-assisted-programming](https://simonwillison.net/tags/ai-assisted-programming/)
  Thí nghiệm có thể tái lập, theo dõi thay đổi của system prompt. Dùng cho: kiểm chứng hype.
- Hacker News (thread về các bài agent) và [r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/)
  Nhiễu nhưng có người kinh nghiệm phản biện. Dùng cho: báo cáo workflow thực tế, không dùng làm ground truth.
- [Kênh YouTube CS146S](https://www.youtube.com/@modernsoftwaredeveloper)
  Có thể sẽ đăng guest talk 2026 (chưa kiểm tra).

## Gaps
- Tài liệu Fall 2026 cho Week 2–10 và buổi 9/24 (system prompt deep dive): chưa công bố. Kiểm tra lại trước mỗi tuần.
- Week 5 (agent-ready scoring), Week 8 (background agents), Week 9 (MCP portal, LLM gateway): chưa có nguồn primary tốt.
- Agent memory, observability (Langfuse/OpenLLMetry) từ roadmap.sh: cần tìm doc chính thức khi tới lượt.

## Bổ sung 2026-09-27 — Week 2 (prompting, RePPIT, spec-driven)
Fall 2026 Week 2 vẫn chưa có bài đọc (đã kiểm tra lại chunk syllabus).
- [Article: "RePPIT: A Framework to Ship Production Code 2-3X Faster" — Mihail Eric (MLOps Community, 06/2026)](https://mlops.community/blog/reppit-a-framework-to-ship-production-code-2-3x-faster)
  Nguồn gốc RePPIT, do giảng viên CS146S viết. Nêu output và luật của từng bước. Con số "2-3X" là trải nghiệm của tác giả, không có đo đạc. Dùng cho: bài 3.
- [Article: "Getting AI to Work in Complex Codebases" (ACE-FCA) — Dex Horthy, HumanLayer (08/2025)](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md)
  Research → Plan → Implement, "frequent intentional compaction", giữ context ở mức 40–60%, đòn bẩy khi review research và plan. Có một case thành công và một thất bại, nhưng chỉ là anecdote của một team. Dùng cho: vì sao phải quản lý context.
- [Doc: Claude Code — Best practices](https://code.claude.com/docs/en/best-practices) · [Claude prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
  Explore → Plan → Implement → Commit; "tả được diff trong một câu thì bỏ plan"; cho Claude cách tự kiểm tra; spec interview. Mục "đã cũ": prefill trả 400 từ 4.6, bỏ viết hoa gây sức ép, `budget_tokens` deprecated. Dùng cho: mọi câu hỏi về cách prompt.
- [Repo: github/spec-kit](https://github.com/github/spec-kit) · [Doc: Kiro Specs](https://kiro.dev/docs/specs/)
  Công cụ SDD: constitution → specify → plan → tasks → implement → converge; Kiro dùng requirements/design/tasks và EARS. Dùng cho: SDD.
- [Article: "Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl" — Birgitta Böckeler (martinfowler.com)](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
  Ba mức spec-first / spec-anchored / spec-as-source; phản biện kiểu "búa tạ đập hạt dẻ". Dùng cho: góc nhìn phản biện.
- [Paper: "Evaluating AGENTS.md" — Gloaguen et al. (2026)](https://arxiv.org/abs/2602.11988)
  Context file nhìn chung không tăng tỉ lệ thành công, nhưng tăng chi phí hơn 20%. Tổng quan repo không giúp ích; quy ước khác thường thì có ích. Dùng cho: bài 3, bài 8 (CLAUDE.md), bài 11 (agent-ready).
- [Paper: "Ambig-SWE" — Vijayvargiya et al. (ICLR 2026)](https://arxiv.org/abs/2502.13069)
  Model khó nhận ra yêu cầu thiếu; cho phép hỏi lại thì tăng tới 74%. Dùng cho: vì sao phải làm rõ yêu cầu trước.
- [Paper: METR RCT (2025)](https://arxiv.org/abs/2507.09089)
  16 developer, 246 task: dùng AI chậm hơn 19%, dù họ tin là nhanh hơn 20%. Dùng cho: công cụ không tự sinh năng suất. Lưu ý kết quả thuộc bối cảnh đầu năm 2025.
- Chưa dùng, cần kiểm tra lại: arXiv 2609.20804 (harness design, 09/2026, "planning là công cụ tiết kiệm chi phí với model mạnh"); Ravi Mehta "Specs are the new source code" (paywall).

## Bổ sung 2026-10-07 — Week 2 (MCP)
Fall 2026 Week 2 tên "Advanced Context Engineering", có buổi 10/1 "Full introduction to MCP and tool-calling" ([slides](https://docs.google.com/presentation/d/1q2cB1a7P4XsR0UJqE0RmtZFeggNOLdPaSnOpbBVewHA/edit?usp=sharing), chưa đọc). Bài đọc 2026: Context Tax, OpenSpec, Superpowers, [Enterprise MCP (Cloudflare)](https://blog.cloudflare.com/enterprise-mcp).
- [Spec: MCP 2026-07-28 (bản hiện hành)](https://modelcontextprotocol.io/specification/2026-07-28) · [changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog) · [versioning](https://modelcontextprotocol.io/specification/versioning)
  Stateless: bỏ `initialize`, bỏ `Mcp-Session-Id`, bỏ GET SSE; version + capability trong `_meta` mỗi request; `server/discover`; deprecated Sampling/Roots/Logging. Dùng cho: bài 4, mọi câu hỏi "spec nói gì". **Tutorial trước 07/2026 dạy handshake cũ.**
- [Doc: MCP Architecture overview](https://modelcontextprotocol.io/docs/learn/architecture)
  Định nghĩa host/client/server, 1 client : 1 server, data layer vs transport layer. Dùng cho: nguồn chính bài 4.
- [Doc: Claude Code — MCP](https://code.claude.com/docs/en/mcp)
  `claude mcp add`, scope local/project/user, `.mcp.json`, tool search, `MAX_MCP_OUTPUT_TOKENS` (cảnh báo 10k, cắt 25k). Dùng cho: cắm server vào Claude Code.
- [Python SDK v2](https://py.sdk.modelcontextprotocol.io/v2/get-started/first-steps/) · [migration guide](https://py.sdk.modelcontextprotocol.io/v2/migration/)
  2.0 ra 2026-07-28; `FastMCP` → `MCPServer`; `ToolError` để message tới model. Đã verify trên máy với 2.3.0. Dùng cho: bài tập.
- [Java SDK](https://github.com/modelcontextprotocol/java-sdk) · [Spring AI MCP server starter](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-server-boot-starter-docs.html)
  `io.modelcontextprotocol.sdk:mcp` v2.0.1; `@McpTool`. Chưa thấy hỗ trợ spec 2026-07-28. Chưa chạy thử. Dùng cho: khi viết server cho team Java.
- [Article: "Code execution with MCP" — Anthropic (11/2025)](https://www.anthropic.com/engineering/code-execution-with-mcp)
  Chi phí tool definition: 150k → 2k token (−98.7%) khi chuyển sang code execution. Dùng cho: vì sao tool search / defer.
- [Article: "Writing effective tools for agents" — Anthropic (09/2025)](https://www.anthropic.com/engineering/writing-tools-for-agents) · [Reilly Wood — "APIs don't make good MCP tools"](https://www.reillywood.com/blog/apis-dont-make-good-mcp-tools/)
  Dùng cho: **bài 5** (thiết kế tool, message lỗi, giới hạn output).
- [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) — cần Node ≥ 22.19 (máy Luật: 22.12).
- [Bài tập CS146S Fall 2025 W3 "Build a Custom MCP Server"](https://github.com/mihail911/modern-software-dev-assignments/blob/master/week3/assignment.md) — ý tưởng bài tập.
- Governance: MCP được tặng cho [Agentic AI Foundation (Linux Foundation)](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation), 2025-12-09.

## Bổ sung 2026-10-13 — Week 2 (thiết kế & test tool)
- [Article: "Writing effective tools for agents — with agents" — Ken Aizawa, Anthropic (2025-09-11)](https://www.anthropic.com/engineering/writing-tools-for-agents)
  Bọc endpoint là lỗi phổ biến; ít tool theo workflow; namespacing; high-signal output, định danh có nghĩa, `response_format` (72 vs 206 token); 25k token của Claude Code; message lỗi actionable; eval: task mạnh/yếu, chỉ số (runtime, số lần gọi, token, lỗi), holdout. Dùng cho: nguồn chính bài 5.
- [Article: "APIs don't make good MCP tools" — Reilly Wood (2025-08-05)](https://www.reillywood.com/blog/apis-dont-make-good-mcp-tools/)
  Nhiều tool làm model gọi kém; JSON tốn ~2× token so với CSV; tool tự gợi ý bước tiếp. Dùng cho: bài 5.
- [Python SDK v2 — Testing](https://py.sdk.modelcontextprotocol.io/v2/get-started/testing/) · [Tools](https://py.sdk.modelcontextprotocol.io/v2/servers/tools/) · [Handling errors](https://py.sdk.modelcontextprotocol.io/v2/servers/handling-errors/)
  In-memory `Client(server)`, `raise_exceptions=True` chỉ trong test; `Annotated`+`Field`, `Literal` → enum, `ToolAnnotations`. Đã chạy với 2.3.0. Dùng cho: bài tập bài 5.

## Bổ sung 2026-10-13 — Week 3 (skills)
- [Doc: Claude Code — Skills](https://code.claude.com/docs/en/skills)
  Vị trí và thứ tự ưu tiên; toàn bộ frontmatter (disable-model-invocation, context: fork, hooks, paths…); listing cắt 1.536 ký tự/skill, ngân sách 1% context, bỏ description skill ít dùng trước; nội dung skill nằm lại trong hội thoại, sau compaction 5k/skill, tổng 25k; `!`lệnh``; troubleshooting trigger. Dùng cho: bài 6.
- [Doc: Skill authoring best practices — Anthropic](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
  Concise; degrees of freedom (cầu hẹp / cánh đồng); description ngôi thứ ba, làm gì + khi nào; < 500 dòng; tham chiếu sâu 1 tầng; evaluation-driven (3 kịch bản, baseline); Claude A / Claude B; script "solve, don't punt". Dùng cho: nguồn chính bài 6.
- [Article: "Equipping agents for the real world with Agent Skills" — Zhang, Lazuka, Murag, Anthropic (2025-10-16; cập nhật 2025-12-18 thành chuẩn mở)](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
  Định nghĩa, 3 tầng, onboarding guide, code tất định, cảnh báo cài skill từ nguồn lạ. Dùng cho: bài 6, bài 15.
- [Spec: Agent Skills (chuẩn mở)](https://agentskills.io/specification)
  6 trường chuẩn (name, description, license, compatibility, metadata, allowed-tools); ~100 token metadata, < 5.000 token thân; scripts/ references/ assets/. Dùng cho: tính di động giữa harness (my-agent dùng chung với Antigravity).

## Bổ sung 2026-10-24 — Week 3 (Agent Memory)
- [Paper: "Cognitive Architectures for Language Agents" (CoALA) — Sumers, Yao, Narasimhan, Griffiths (TMLR 2024 / arXiv:2309.02427)](https://arxiv.org/abs/2309.02427)
  Khung phân loại chuẩn mực: Working, Episodic, Semantic, Procedural Memory; các thao tác Read, Write, Consolidate, Forget. Dùng cho: nền tảng lý thuyết phân ngăn nhớ của Bài 7.
- [Paper: "MemGPT: Towards LLMs as Operating Systems" — Packer et al. (arXiv:2310.08560, 2023)](https://arxiv.org/abs/2310.08560)
  Mô hình phân tầng bộ nhớ như hệ điều hành (RAM / Disk / Virtual Memory paging), model tự gọi tool để nạp/đẩy memory. Dùng cho: tư duy kiến trúc context management.
- [Paper: "Generative Agents: Interactive Simulacra of Human Behavior" — Park et al. (UIST 2023 / arXiv:2304.03442)](https://arxiv.org/abs/2304.03442)
  Dòng ký ức (Memory stream), hàm truy xuất dựa trên recency / importance / relevance, và cơ chế Reflection (đúc kết episodic thành semantic). Dùng cho: cơ chế consolidate.
- [Architecture & Guide: Mem0 (The Memory Layer for Personalized AI)](https://mem0.ai/)
  Hệ thống quản lý memory đa tầng, trích xuất fact tự động (implicit extraction), biểu diễn tri thức dạng graph/hybrid search, so sánh memory bloat và xung đột thông tin.
- [Doc: Claude Code — Project Memory](https://code.claude.com/docs/en/memory)
  Cơ chế auto-memory của Claude Code: tự duy trì file `MEMORY.md` trong project directory, nạp đầu phiên. So sánh với kiến trúc `memory/` của my-agent.

## Bổ sung 2026-10-25 — Week 4 (Tùy biến agent & repo: AGENTS.md vs CLAUDE.md)
- [Paper: "Evaluating AGENTS.md" — Gloaguen et al. (arXiv:2602.11988, 2026)](https://arxiv.org/abs/2602.11988)
  Nghiên cứu định lượng trên SWE-bench: tổng quan kiến trúc repo làm tăng token hơn 20% mà không cải thiện tỉ lệ giải quyết task; non-standard conventions đem lại ROI cao nhất. Dùng cho: luận điểm cốt lõi của Bài 8.
- [Doc: Claude Code — Best practices: Manage context with CLAUDE.md](https://code.claude.com/docs/en/best-practices)
  Hướng dẫn chính thức: giữ file ngắn gọn (&lt;200 dòng), tránh duplicate, chỉ ghi thông tin cốt lõi, đưa quy trình dài sang skill. Dùng cho: quy chuẩn thiết kế instruction file.
- [Prompt: OpenAI Codex CLI prompt.md (open source)](https://github.com/openai/codex/blob/main/codex-rs/models-manager/prompt.md)
  Cách system prompt của Codex CLI xử lý và ưu tiên `AGENTS.md` như Single Source of Truth cho toàn repo. Dùng cho: đối chiếu đa harness.
- [Guide: Anthropic Prompt Caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
  Cơ chế Prefix Caching (giảm 90% chi phí đọc prompt cache, giảm 80% TTFT): yêu cầu các block đầu prompt phải tĩnh tuyệt đối. Dùng cho: vì sao cấm đưa ngày giờ / lệnh biến động vào AGENTS.md.

## Bổ sung 2026-10-25 — Week 4 (Lifecycle Hooks: Lint gate, Test gate, Guardrail)
- [Doc: Claude Code — Hooks Reference](https://code.claude.com/docs/en/hooks)
  Tài liệu chính thức về PreToolUse, PostToolUse, Notification; cơ chế abort tool qua exit code khác 0; đưa stderr vào context làm thông báo lỗi. Dùng cho: nguồn chính Bài 9.
- [Doc: Antigravity — Lifecycle Hooks (`hooks.json`)](file:///Users/luatnq/.gemini/antigravity-cli/builtin/skills/agy-customizations/docs/hooks.md)
  Tài liệu chính thức của Antigravity về cấu hình hooks.json: PreToolUse, PostToolUse, matcher, command timeout. Dùng cho: đối chiếu đa harness của Bài 9.
- [Doc: Claude Code — Best practices: Enforcing invariants](https://code.claude.com/docs/en/best-practices)
  Nguyên lý chuyển từ "hướng dẫn mềm trong prompt" sang "cưỡng chế cứng bằng hook" khi gặp lỗi lặp lại.



