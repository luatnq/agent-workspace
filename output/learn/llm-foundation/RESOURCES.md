# LLM Foundation Resources

Nguồn tin cậy cho workspace này. Kiến thức trong bài học phải trích từ đây, không từ trí nhớ của agent. Cập nhật lần cuối: 2026-09-26 (phiên 7: self-host inference).

## Knowledge

### Mental model tổng thể
- [Video: "Deep Dive into LLMs like ChatGPT" — Andrej Karpathy (3h31m, 2025)](https://www.youtube.com/watch?v=7xTGNNLPyMI)
  Giải thích toàn bộ stack từ pretraining → SFT → RL cho người không chuyên, kèm các mental model đắt giá (context window = working memory, params = vague recollection, hallucination, "models need tokens to think"). Dùng cho: mọi câu hỏi "vì sao model hành xử thế này". Xem theo chapter trong mô tả video, không cần xem liền một lúc.
- [Video: "But what is a GPT? Visual intro to transformers" — 3Blue1Brown (27 phút, 2024)](https://www.youtube.com/watch?v=yMQPQuz5WpA)
  Trực quan hóa transformer ở mức khái niệm, đủ để hiểu attention làm gì mà không cần toán. Dùng cho: khi cần hình dung "bên trong hộp đen" một lần cho biết.
- [Article: "2025: The year in LLMs" — Simon Willison](https://simonwillison.net/2025/Dec/31/the-year-in-llms/)
  Tổng kết năm của một practitioner độc lập, uy tín. Dùng cho: nắm bức tranh reasoning models, agents, open-weight models; đọc để biết "bây giờ đang ở đâu".

### Doc chính thức (tầng API / engineering)
- [Doc: Anthropic Glossary](https://platform.claude.com/docs/en/about-claude/glossary)
  Định nghĩa chuẩn: context window, tokens, temperature, TTFT, RAG, RLHF, pretraining, fine-tuning. Dùng cho: mọi định nghĩa trong glossary của workspace.
- [Doc: Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows)
  Cái gì tính vào context, thinking/tool use tính thế nào, context rot, hành vi khi tràn (400 vs `model_context_window_exceeded`). Dùng cho: mọi bài về context, memory, agent loop.
- [Doc: Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
  Bảng giá theo model, multiplier cache (1.25x/2x write, 0.1x read), batch 50%, chi phí tool use, rule of thumb 1 token ≈ 4 ký tự ≈ 0.75 từ tiếng Anh. Dùng cho: ước lượng cost.
- [Doc: Reducing latency](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency)
  Baseline latency vs TTFT; 3 đòn bẩy: chọn model, cắt token in/out, streaming. Dùng cho: bài về latency.
- [Doc: Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
  Schema tool, tool_choice, vòng lặp tool_use → tool_result. Dùng cho: bài về agent loop.
- [Doc: Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)
  Luật format tool_result (ngay sau tool_use, đứng trước text, một message cho parallel), is_error, cảnh báo untrusted content. Dùng cho: debug 400 trong agent loop.
- [Doc: Parallel tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use)
  Nhiều tool_use trong một response; trả tất cả result trong một user message. Dùng cho: bài 3, hiệu năng agent.
- [Article: "Writing effective tools for agents — with agents" — Anthropic Engineering (2025)](https://www.anthropic.com/engineering/writing-tools-for-agents)
  Nguyên tắc thiết kế tool: gộp theo workflow, search thay list, namespace, trả ngữ nghĩa thay UUID, response_format, error có hướng dẫn, mô tả như cho new hire, eval bằng task thật. Dùng cho: review bộ tool của team.
- [Doc: Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
  Prefix tools → system → messages, ≤4 breakpoint, lookback 20 block, TTL 5m/1h refresh khi hit, ngưỡng tối thiểu theo model (512–4.096), bảng invalidation, usage fields, cô lập theo workspace. Dùng cho: bài 7, debug cache hit = 0. **Lưu ý (2026-09-26):** cache read không còn 0.1× cho mọi model — Opus 5.5 0.05×, Fable/Mythos 5.1 0.025×; luôn kiểm lại khi có model mới.
- [Doc: Context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing) · [Compaction](https://platform.claude.com/docs/en/build-with-claude/compaction) · [Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)
  Tính năng API cho context dài: xoá tool result/thinking cũ (beta, làm mất cache), tóm tắt server-side, memory tool client-side. Dùng cho: agent chạy dài.
- [Research: "Context Rot" — Chroma (07/2025)](https://www.trychroma.com/research/context-rot)
  18 model, accuracy giảm theo độ dài input kể cả task đơn giản; haystack mạch lạc gây nhiễu hơn haystack xáo trộn. Dùng cho: bằng chứng thực nghiệm cho context rot.

### Hallucination
- [Doc: Reduce hallucinations — Anthropic](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)
  Danh sách kỹ thuật chính thức: cho phép "I don't know", grounding bằng quote, citations, chain-of-thought, best-of-N, giới hạn nguồn. Dùng cho: checklist mitigation ở tầng prompt/app.
- [Paper: "Why Language Models Hallucinate" — Kalai, Nachum, Vempala, Zhang (OpenAI, 2025)](https://arxiv.org/abs/2509.04664)
  Lập luận hallucination sinh ra tự nhiên từ pretraining và dai dẳng vì eval thưởng đoán mò hơn abstain. Dùng cho: giải thích "vì sao không sửa được bằng prompt", thiết kế eval có thưởng abstention.
- [Article: "Extrinsic Hallucinations in LLMs" — Lilian Weng (2024)](https://lilianweng.github.io/posts/2024-07-07-hallucination/)
  Survey: in-context vs extrinsic hallucination, nguyên nhân (kể cả fine-tune fact mới làm tăng hallucination — Gekhman et al. 2024), các nhóm mitigation. Dùng cho: khung phân loại và quyết định RAG vs fine-tune.

### RAG vs fine-tune
- [Doc: "Optimizing LLMs for accuracy" — OpenAI](https://developers.openai.com/api/docs/guides/optimizing-llm-accuracy)
  Framework 2 trục: context optimization (model thiếu kiến thức → RAG) vs LLM optimization (model sai hành vi → fine-tune); thứ tự prompt → RAG → fine-tune, eval set trước; các kỹ thuật "stack" chứ không loại trừ. Dùng cho: khung quyết định RAG vs fine-tune (đóng gap cũ).
- [Article: "Introducing Contextual Retrieval" — Anthropic Engineering (2024)](https://www.anthropic.com/engineering/contextual-retrieval)
  Ngưỡng 200k token (~500 trang) thì nhét hết vào prompt + prompt caching thay vì RAG; cơ chế RAG (chunk, embedding, BM25, top-K); chunk mất context và contextual retrieval giảm 35–67% retrieval failure; 20 chunk tốt hơn 5–10. Dùng cho: cơ chế RAG và failure mode ở tầng retrieval.
- [Blog: Fine-tuning Claude 3 Haiku in Amazon Bedrock — AWS (11/2024)](https://aws.amazon.com/blogs/aws/fine-tuning-for-anthropics-claude-3-haiku-model-in-amazon-bedrock-is-now-generally-available/)
  Thực tế: Claude chỉ fine-tune được Claude 3 Haiku, chỉ qua Bedrock. Dùng cho: nhắc rằng với stack Claude, fine-tune gần như không nằm trên bàn; kiểm tra lại khi có model mới.

### Thiết kế agent & context
- [Article: "Building effective agents" — Anthropic Engineering (2024)](https://www.anthropic.com/engineering/building-effective-agents)
  Phân biệt workflow vs agent; 5 pattern workflow (prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer). Dùng cho: quyết định "có cần agent không" và chọn pattern.
- [Article: "Effective context engineering for AI agents" — Anthropic Engineering (2025)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
  Context là tài nguyên hữu hạn; compaction, structured note-taking, sub-agent. Dùng cho: bài về context management trong agent dài.
- [Article: "LLM Powered Autonomous Agents" — Lilian Weng (2023)](https://lilianweng.github.io/posts/2023-06-23-agent/)
  Survey kinh điển: agent = LLM + planning + memory + tool use. Dùng cho: khung phân loại thành phần của agent; citation anchor.

### Eval
- [Doc: "Create strong empirical evaluations" — Anthropic](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)
  Ba nguyên tắc (task-specific, automate, volume over quality); 6 phương pháp chấm (exact match, cosine similarity, ROUGE-L, LLM judge Likert/nhị phân, người) kèm trade-off và code mẫu; danh sách edge case bắt buộc; khuyến nghị dùng model khác để chấm; metric nhiều chiều. Dùng cho: chọn grader và thiết kế bộ test.

### Đưa vào production
- [Article: "Patterns for Building LLM-based Systems & Products" — Eugene Yan (2023)](https://eugeneyan.com/writing/llm-patterns/)
  7 pattern: evals, RAG, fine-tuning, caching, guardrails, defensive UX, feedback. Dùng cho: bản đồ "cần gì để ra product", chọn RAG vs fine-tune.
- [Article: "Your AI Product Needs Evals" — Hamel Husain (2024)](https://hamel.dev/blog/posts/evals/)
  3 tầng eval: unit test/assertion, human + LLM-judge có tracing, A/B. Dùng cho: bài về eval, đo "có tốt hơn không".
- [Book: _AI Engineering: Building Applications with Foundation Models_ — Chip Huyen (O'Reilly, 2025)](https://huyenchip.com/books/)
  Sách nền tảng cho AI engineer: adaptation (prompt/RAG/fine-tune), eval, deployment. Dùng cho: đọc sâu theo chương khi một bài học cần mở rộng; [repo kèm sách](https://github.com/chiphuyen/aie-book).

### Công cụ thực hành (không cần code)
- [Tool: Tiktokenizer](https://tiktokenizer.vercel.app/)
  Dán text, thấy tokenizer cắt thế nào. Dùng cho: cảm nhận token của tiếng Việt, code, JSON.

### Hạ tầng inference (self-host)
- [Blog: "LLM Inference Performance Engineering: Best Practices" — Databricks (2023)](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices)
  Định nghĩa TTFT, TPOT, throughput; latency = TTFT + TPOT × output; decode nghẽn băng thông ở batch nhỏ; trade-off batch (14× throughput / 4× latency, static batching 2023). Dùng cho: primary source bài 8.
- [Blog: "Mastering LLM Techniques: Inference Optimization" — NVIDIA](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/)
  Prefill compute-bound vs decode memory-bound. **Lưu ý:** công thức KV của bài dùng `num_heads`, không tính GQA — tính dư 4–8× với Llama 3.
- [Paper: PagedAttention — Kwon et al. (SOSP 2023)](https://arxiv.org/abs/2309.06180)
  Hệ thống cũ chỉ dùng 20,4–38,2% KV cache cho token thật; vLLM lãng phí &lt;4%, throughput 2–4×. Dùng cho: vì sao paged KV là mặc định.
- [Doc: vLLM](https://docs.vllm.ai/en/latest/) — [engine args](https://docs.vllm.ai/en/latest/configuration/engine_args.html) · [optimization](https://docs.vllm.ai/en/latest/configuration/optimization.html) · [prefix caching](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching.html) · [metrics](https://docs.vllm.ai/en/latest/usage/metrics.html) · [quantization](https://docs.vllm.ai/en/latest/features/quantization/)
  Knob, preemption RECOMPUTE, chunked prefill, tên metric Prometheus, FP8/INT4/KV FP8. **Lưu ý (v0.30.0, 2026-09-22):** `gpu_memory_utilization` default 0.92 (cũ 0.9), prefix caching bật mặc định (trang APC còn ghi phải bật tay — doc đi sau code), metric đổi tên `gpu_cache_usage_perc` → `kv_cache_usage_perc`, AutoAWQ deprecated → llm-compressor.
- [Paper: "The Llama 3 Herd of Models" — Meta (2024)](https://arxiv.org/abs/2407.21783)
  Bảng 3: layers, KV heads, model dim của 8B/70B/405B. Dùng cho: tính KV/token khi `config.json` trên HF bị gated.
- [Doc: GKE — Best practices for autoscaling LLM inference](https://docs.cloud.google.com/kubernetes-engine/docs/best-practices/machine-learning/inference/autoscaling)
  Vì sao CPU / GPU util / GPU memory là tín hiệu scale tồi; khuyến nghị queue size (throughput) hoặc batch size (latency). Áp dụng cho K8s nói chung.
- [Blog: Introducing Gateway API Inference Extension — Kubernetes (06/2025)](https://kubernetes.io/blog/2025/06/05/introducing-gateway-api-inference-extension/) · [project site](https://gateway-api-inference-extension.sigs.k8s.io/)
  "Partially stateful" — vì sao round-robin hỏng với LLM; InferencePool + Endpoint Picker. v1 (v1.6.2, 2026-09-17). Liên quan: [llm-d](https://llm-d.ai/docs/architecture) (v0.9), [vLLM production-stack](https://docs.vllm.ai/projects/production-stack/en/latest/), [KServe](https://kserve.github.io/website/docs/intro).
- [Article: "What We Learned from a Year of Building with LLMs" — Yan, Husain, Bischof et al.](https://applied-llms.org/#start-with-inference-apis-but-dont-be-afraid-of-self-hosting)
  "No GPUs before PMF"; lý do self-host: dữ liệu không rời mạng (finance/y tế), né rate limit/deprecation, cost ở quy mô lớn. Dùng cho: quyết định self-host vs API.
- GPU spec: trang sản phẩm NVIDIA [L4](https://www.nvidia.com/en-us/data-center/l4/) · [A100](https://www.nvidia.com/en-us/data-center/a100/) · [H100](https://www.nvidia.com/en-us/data-center/h100/) · [H200](https://www.nvidia.com/en-us/data-center/h200/).

## Wisdom (Communities)

- [Latent Space Discord + newsletter (swyx)](https://www.latent.space/)
  Cộng đồng AI engineer ứng dụng, nhiều practitioner. Dùng cho: hỏi về kiến trúc LLM app thực tế, theo dõi xu hướng.
- [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/)
  Kỹ thuật cao về inference, quantization, open-weight model. Dùng cho: khi cân nhắc self-host thay vì API.
- [Hacker News](https://news.ycombinator.com/)
  Thảo luận chất lượng quanh mỗi paper/blog lớn (ví dụ thread video Karpathy). Dùng cho: đọc phản biện của practitioner.
- Chưa hỏi Luật có muốn tham gia community nào không — hỏi khi có câu hỏi cần "wisdom".

## Gaps

- ~~RAG vs fine-tune framework~~ — đã đóng bằng OpenAI "Optimizing LLMs for accuracy" (phiên 4).
- ~~Hạ tầng inference~~ — đã đóng bằng Databricks + vLLM docs + GKE autoscaling (phiên 7).
- Chưa có nguồn primary, vendor-neutral cho **ngưỡng hoà vốn self-host vs API** (các blog tìm được lệch nhau hàng chục lần, không trích). Chương deployment trong sách Chip Huyen có thể lấp — paywall.
- Chưa có nguồn tiếng Việt chất lượng — chấp nhận đọc tiếng Anh.
- Chưa có mốc timestamp chính xác cho các chapter của video Karpathy — bài học chỉ trỏ tên chapter.
