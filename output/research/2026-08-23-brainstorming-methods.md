# Nghiên cứu: Brainstorming methods để thiết kế skill trợ lý AI cá nhân

> Ngày: 2026-08-23. Mục đích: làm nền cho skill `brainstorm` trong workspace này.
> Nguồn: tổng hợp từ ~30 lượt web search/fetch, mọi khẳng định gắn nguồn ở cuối file.

## 0. Bốn phát hiện định hình toàn bộ thiết kế

**(1) Solo + AI không phải bản kém của brainstorm nhóm — nó tốt hơn về mặt cấu trúc.** Diehl & Stroebe (1987) và meta-analysis Mullen et al. (1991): nominal groups (mỗi người nghĩ riêng rồi gộp) tạo ra nhiều hơn và chất lượng hơn nhóm brainstorm tương tác, do ba cơ chế — production blocking (phải chờ tới lượt nói), evaluation apprehension (sợ bị đánh giá), social loafing. Một người + AI loại bỏ cả ba.

**(2) LLM làm giảm đa dạng ý tưởng — rủi ro lớn nhất của skill này.** Meincke, Nave & Terwiesch (*Nature Human Behaviour*, 2025), 5 thí nghiệm: ChatGPT nâng chất lượng từng ý tưởng nhưng **giảm đáng kể độ đa dạng của tập ý tưởng — có ý nghĩa thống kê ở 37/45 phép so sánh**. Doshi & Hauser (*Science Advances*, 2024) cùng chiều. Cơ chế không phải fixation cá nhân mà là LLM gợi ý những thứ na ná nhau cho mọi người.

→ **Hệ quả bắt buộc: người dùng viết ý tưởng của mình TRƯỚC, AI bổ sung SAU.** Đây là quy tắc số 1.

**(3) Ý tưởng hay nằm ở nửa sau — serial order effect.** Một trong những phát hiện bền nhất của creativity research (Parnes & Meadow 1959; Beaty & Silvia 2012): ý tưởng sinh ra muộn thì original hơn, vì lúc đầu ta chỉ rút từ schema có sẵn. IDEO đặt mục tiêu **100 ý tưởng / 60 phút**. → Phải ép qua đợt đầu, không dừng ở 5–7 ý.

**(4) Có cấu trúc thắng không cấu trúc; viết thắng nói.** NN/g: chỉ **15%** UX pro thấy quy trình ideation của mình "very effective"; trong nhóm tự thấy kém, **95% chỉ dùng thảo luận tự do**. Nhóm "very effective" dùng written ideation gấp đôi (40% vs 20%). → Luôn *chọn và tuyên bố một method*, không bao giờ "chat tự do về ý tưởng".

---

## 1. Shortlist 12 method theo phase

### PHASE A — FRAME: định khung vấn đề

#### A1. Question Burst (Hal Gregersen, HBR 2018)
**Mô tả:** Sinh *câu hỏi* thay vì câu trả lời — 4 phút, ≥ 15 câu, tuyệt đối không trả lời câu nào.

**Các bước:**
- User mô tả vấn đề ≤ 2 phút, kèm "nếu giải được thì điều gì tốt lên"
- Luật: chỉ đặt câu hỏi; không giải thích, không trả lời, không biện minh
- Bắn liên tiếp ≥ 15 câu trong 4 phút, ghi verbatim
- Chuyển dần từ mô tả (what's working?) sang suy đoán (what if?)
- Chọn 3–5 *catalytic questions* — câu làm lung lay giả định
- Cam kết theo đuổi 1 câu

**Hợp với:** vấn đề mơ hồ, "thấy sai sai mà không gọi tên được", vấn đề team/con người, khi nghi mình đang giải sai bài.

**Mạnh/yếu:** Cực rẻ, phá định nghĩa vấn đề bị đóng sớm. Yếu: cảm giác "chưa làm gì cả"; người quen giải quyết vấn đề rất muốn trả lời — phải chặn.

**AI chạy với solo user:** Method *tốt nhất* cho AI — thay đúng vai "2–3 người không quen vấn đề" mà Gregersen yêu cầu. AI bắn câu hỏi liên tiếp, **không chờ trả lời**. User chỉ ngồi ghi. Sau đó hỏi: "câu nào làm anh khó chịu nhất?" — khó chịu thường là trúng.

#### A2. First Principles + 5 Whys có nhánh
**Mô tả:** Bóc vấn đề xuống các sự thật nền tảng không suy giảm thêm được, thay vì lập luận bằng analogy ("người ta vẫn làm thế").

**Các bước:**
- Viết phát biểu vấn đề và các giả định ngầm trong đó
- Hỏi từng giả định: "đúng vì đây là định luật vật lý/hợp đồng, hay vì là thói quen ngành?"
- Bóc bằng "vì sao" — nhưng **phân nhánh**, mỗi tầng ép ≥ 2 nhánh
- Dừng khi chạm thứ không bóc thêm được (băng thông, chi phí/GB, ràng buộc pháp lý, số người trong team)
- Dựng lại giải pháp từ các mảnh nền tảng

**Hợp với:** quyết định kiến trúc, build-vs-buy, chi phí hạ tầng, khi giải pháp mặc định của ngành có vẻ nặng quá mức.

**Mạnh/yếu:** Phá cargo-culting. **Cảnh báo về 5 Whys:** nó ép về **một chuỗi nhân quả tuyến tính duy nhất**, che mất bản chất multi-causal của hệ phức tạp, kết quả phụ thuộc nặng vào người dẫn (Allspaw). → Dùng dạng **cây**, không bao giờ gọi kết quả là "the root cause".

**AI chạy với solo user:** AI hỏi "vì sao" kiên trì, mỗi tầng ép ≥ 2 nhánh, không cho đi một nhánh duy nhất. AI gọi tên các giả định user không nói ra — chỗ AI mạnh hơn tự vấn.

#### A3. How Might We (IDEO / Stanford d.school)
**Mô tả:** Biến vấn đề/insight thành câu hỏi mở "Làm sao chúng ta có thể…" ở đúng độ cao.

**Các bước:**
- Lấy pain point/insight từ phase trên
- Viết 5–10 biến thể theo pattern IDEO: khuếch đại cái tốt; loại bỏ cái xấu; khám phá điều ngược lại; chất vấn giả định; nhắm vào tính từ; tìm nguồn lực bất ngờ; tạo analogy; đánh ngược đề bài; thay đổi status quo; chẻ nhỏ POV
- Kiểm độ cao: quá rộng ("HMW làm hệ thống tốt hơn") → vô dụng; quá hẹp ("HMW thêm Redis cache") → đã chứa sẵn giải pháp
- Chọn 1–2 HMW làm đề bài

**Hợp với:** mọi vấn đề product và phần lớn vấn đề kỹ thuật; bắt buộc trước khi diverge.

**Mạnh/yếu:** Chuyển "vấn đề" thành "cơ hội". Yếu: rất dễ viết HMW đã cài sẵn đáp án — lỗi phổ biến nhất.

**AI chạy với solo user:** AI sinh 8–10 biến thể ở **các độ cao khác nhau**, nói rõ độ cao từng cái. Chỗ hiếm hoi AI được đi trước — output là *đề bài*, không phải *ý tưởng*, rủi ro anchoring thấp.

### PHASE B — DIVERGE: sinh số lượng

#### B1. Solo Brainwriting Burst (động cơ của phase này)
**Mô tả:** User viết im lặng, theo timebox, có mục tiêu số lượng — bản một người của 6-3-5 (Rohrbach 1968) và Crazy 8s (Knapp, GV Design Sprint).

**Các bước:**
- Chốt 1 HMW làm đề bài
- Vòng 1 (8'): **tối thiểu 15–20 ý**, mỗi ý một dòng, không giải thích. **AI im lặng hoàn toàn** — chỉ đếm và giữ giờ
- Vòng 2 (8'): ép qua serial order effect — "đợt hay nhất bắt đầu từ đây". AI có thể đưa constraint/analogy nhưng **chưa đưa ý tưởng**
- Vòng 3: AI bổ sung, **gắn nhãn rõ là của AI**, ưu tiên vùng user chưa chạm
- Hitchhiking: chọn 3 ý, sinh 3 biến thể mỗi cái

**Hợp với:** mọi bài toán sau khi có đề bài rõ. Method mặc định.

**Mạnh/yếu:** Khai thác trực tiếp nominal group + written ideation + serial order effect. Yếu: mệt; cần AI giữ kỷ luật timebox.

**AI chạy với solo user:** Vai trò AI là **thư ký + đồng hồ + người đếm** cho tới vòng 3. Đây chính là mitigation cho phát hiện (2).

#### B2. SCAMPER (Bob Eberle 1971; phổ biến qua Michalko, *Thinkertoys*)
**Mô tả:** Checklist 7 phép biến đổi áp lên thứ đang tồn tại: Substitute, Combine, Adapt, Modify/Magnify, Put to another use, Eliminate, Reverse/Rearrange.

**Các bước:**
- Chọn đối tượng cụ thể: một service, pipeline, quy trình team, API
- Đi lần lượt từng chữ, ép **≥ 2 ý mỗi chữ** (tối thiểu 14 ý)
- Không bỏ chữ nào vì "không hợp" — chữ khó nhất thường ra ý lạ nhất
- Đánh dấu 3 ý đáng đào

**Hợp với:** cải tiến cái đã có (refactor, tối ưu chi phí hạ tầng, quy trình release, quy trình review của team). **Không hợp** bài toán từ số không.

**Mạnh/yếu:** Rất hợp người thiên phân tích — là checklist, không đòi "cảm hứng". Yếu: chủ yếu ra cải tiến tăng dần.

**AI chạy với solo user:** **Hỏi từng chữ một, không dồn 7 chữ vào một message.** Chữ nào user bí, AI đưa ví dụ minh hoạ từ domain khác — không phải đáp án cho vấn đề của họ.

#### B3. Forced Analogy / Synectics (Gamestorming; W.J.J. Gordon)
**Mô tả:** Ép ánh xạ vấn đề sang domain hoàn toàn khác để phá fixation — "làm cái quen thành lạ, cái lạ thành quen".

**Các bước:**
- Chọn domain xa: hàng không, nhà hàng, kiểm soát dịch bệnh, giao thông đô thị, quân đội, sinh học
- Hỏi: "domain này giải bài toán *cùng cấu trúc* thế nào?"
- Liệt kê 3–5 cơ chế cụ thể của domain đó
- Ánh xạ ngược từng cơ chế về bài gốc, kể cả khi vụng
- Lặp với 2–3 domain

**Hợp với:** khi bí, khi mọi giải pháp nghĩ ra đều giống nhau, khi cần bước nhảy chứ không phải cải tiến.

**Mạnh/yếu:** Franke et al.: người từ domain xa-nhưng-tương-tự cho giải pháp sáng tạo hơn. Nhưng bằng chứng **không nhất quán** (Enkel & Gassmann không thấy lợi thế). Rào cản: trí nhớ người bám *surface similarity*.

**AI chạy với solo user:** **Giá trị cao nhất, rủi ro anchoring thấp nhất.** AI đưa *domain* và *cơ chế*, user làm việc ánh xạ. Bù đúng điểm yếu cấu trúc của trí nhớ người, đồng thời là thuốc chống homogenization vì cưỡng bức đẩy ra khỏi vùng ý tưởng trung bình của LLM.

### PHASE C — DEEPEN / PROVOKE

#### C1. Inversion / Reverse Brainstorming (+ Worst Possible Idea)
**Mô tả:** Thay vì hỏi "làm sao thành công", hỏi "làm sao đảm bảo thất bại" — rồi lật ngược.

**Các bước:**
- Đảo đề: "Làm thế nào để chắc chắn hệ thống này sập / dự án này trượt / team này rã?"
- Sinh 10–15 cách phá hoại, càng cụ thể càng tốt
- Với mỗi cách: "hiện tại mình đang vô tình làm điều này ở mức nào?"
- Lật mỗi cách phá thành một biện pháp
- Biến thể *Worst Possible Idea*: nghĩ ý tệ nhất, rồi tìm hạt nhân dùng được

**Hợp với:** risk analysis, hệ chịu lỗi, vấn đề team/quản lý ("làm sao chắc chắn mất người giỏi?"), khi user bị chặn vì sợ sai.

**Mạnh/yếu:** Hạ rào cản tâm lý cực mạnh — nghĩ ý tệ thì không sợ sai. Munger dùng inversion như công cụ tư duy nền. Yếu: dễ trượt thành phàn nàn nếu không lật ngược lại.

**AI chạy với solo user:** AI giữ khung "vẫn đang phá hoại, chưa được đề xuất giải pháp" — user sẽ tự động nhảy sang chữa cháy. AI cũng là nơi an toàn để nói những cách phá hoại mang tính chính trị nội bộ.

#### C2. Six Thinking Hats (de Bono 1985) — persona tuần tự
**Mô tả:** Xét vấn đề qua 6 góc nhìn tách rời, mỗi lúc một góc: Trắng (dữ kiện), Đỏ (cảm xúc), Vàng (lợi ích), Đen (rủi ro), Xanh lá (sáng tạo), Xanh dương (điều phối).

**Các bước:**
- Xanh dương: chốt mục tiêu và thứ tự mũ
- Trắng: dữ kiện đã biết và chỗ thiếu dữ liệu
- Đỏ: phản ứng cảm tính, không cần biện minh (quan trọng hơn vẻ ngoài với quyết định kỹ thuật)
- Xanh lá: phương án mới → Vàng: vì sao thắng → Đen: gãy ở đâu
- Xanh dương: chốt và bước tiếp theo

**Hợp với:** đánh giá phương án *đã có* (không phải sinh phương án), quyết định nhiều bên liên quan, quyết định về con người.

**Mạnh/yếu:** Chống thiên lệch một chiều, đặc biệt với người mặc định "mũ đen" — dân backend/ops thường vậy. **Hạn chế cần nói thẳng: gần như không có bằng chứng thực nghiệm.** Dùng như *khung tổ chức*, không như *phương pháp đã chứng minh*.

**AI chạy với solo user:** AI đóng lần lượt từng mũ và tuyên bố rõ đang đội mũ nào — điều một người ngồi một mình rất khó tự làm. **Cảnh báo:** persona prompting là dao hai lưỡi — persona đặt sai có thể *làm giảm* chất lượng suy luận của LLM. Định nghĩa ngắn, cụ thể, không màu mè.

#### C3. Morphological Analysis / Zwicky Box (Fritz Zwicky)
**Mô tả:** Chẻ giải pháp thành tham số độc lập, liệt kê giá trị mỗi tham số, duyệt tổ hợp — làm toàn bộ không gian giải pháp hiện ra.

**Các bước:**
- Phát biểu bài toán dạng câu hỏi mở
- Xác định **5–7 tham số độc lập** (vd ingest pipeline: transport, delivery guarantee, storage, partitioning, backpressure, schema evolution)
- Liệt kê **3–5 giá trị** mỗi tham số
- Dựng ma trận, vẽ các đường tổ hợp
- **Cross-Consistency Assessment:** loại cặp giá trị mâu thuẫn
- Đánh giá tổ hợp còn sống sót

**Hợp với:** **method hợp nhất với quyết định kiến trúc.** Chọn message broker, caching layer, chiến lược migration, mô hình deploy K8s. Phơi ra tổ hợp chưa từng nghĩ tới vì đầu chỉ giữ được 2–3 phương án quen.

**Mạnh/yếu:** Tường minh, kiểm chứng được, ra ADR luôn. Yếu: bùng nổ tổ hợp (5 tham số × 4 giá trị = 1024) — cần cross-consistency để cắt. Không hợp bài toán mềm/con người.

**AI chạy với solo user:** Xuất sắc. AI giữ ma trận, tính tổ hợp, chạy cross-consistency máy móc, chỉ ra tổ hợp hợp lệ user chưa nhắc. Rủi ro homogenization thấp vì output là *cấu trúc*, không phải *ý tưởng*.

### PHASE D — CONVERGE / DECIDE

#### D1. Affinity clustering + chấm điểm tường minh (KJ — Kawakita; NUF — Dave Gray)
**Mô tả:** Gom ý tưởng thô thành theme, rồi chấm theo tiêu chí công khai thay vì cảm tính.

**Các bước:**
- Gom thành 4–7 cụm theo điểm chung tự nhiên; **đặt tên cụm sau khi gom**, không định nghĩa trước
- Chọn 1–2 ứng viên mạnh nhất mỗi cụm → còn ~6–10 phương án
- Chấm **NUF: New / Useful / Feasible**, thang 1–10
- Hoặc đặt lên **Impact–Effort matrix** 2×2: quick wins / big bets / fill-ins / bỏ
- Chốt 1–3 thứ, **nói rõ cái bị loại và vì sao**

**Hợp với:** mọi phiên, ở cuối.

**Mạnh/yếu:** Chống converge sớm. **Lưu ý solo:** dot voting **gần như vô nghĩa với một người**; NN/g nêu 3 vấn đề của nó ngay cả trong nhóm (bandwagon/social proof, authority bias, primacy effect). Với solo thay bằng **tiêu chí tường minh có trọng số**.

**AI chạy với solo user:** AI đề xuất cách gom nhưng **user chốt tên cụm** (insight nằm ở tên cụm). AI ép nêu tiêu chí *trước* khi chấm, cảnh báo khi user đổi tiêu chí giữa chừng để hợp thức hoá phương án đã thích sẵn.

#### D2. Premortem (Gary Klein, HBR 2007)
**Mô tả:** Giả định phương án đã chọn *đã thất bại* sau 12 tháng, rồi viết lý do — dựa trên *prospective hindsight*.

**Các bước:**
- "Bây giờ là 12 tháng sau. Phương án này đã thất bại hoàn toàn. Ai cũng biết."
- Viết độc lập 5–10 phút, **mọi lý do** đã dẫn tới thất bại
- Xếp theo mức đáng tin
- Top 3: phát hiện sớm bằng tín hiệu nào? giảm nhẹ ra sao?
- Sửa phương án trước khi bắt đầu

**Hợp với:** trước mọi cam kết lớn — migration, đổi kiến trúc, tái cấu trúc team, cam kết deadline.

**Mạnh/yếu:** Prospective hindsight (Mitchell, Russo & Pennington 1989): giả định sự kiện *đã xảy ra* làm tăng **~30%** khả năng nêu đúng lý do. Rẻ (20–30 phút). Yếu: cần thành thật; dễ thành nghi thức.

**AI chạy với solo user:** Rất hợp — bỏ hẳn nỗi ngại chính trị khi phải nói "dự án này sẽ trượt" trước mặt người khác. AI ép giữ **thì quá khứ** ("nó đã sập vì…"), không cho tuột về "nó có thể sập nếu…". Với dân backend/ops, nối tiếp bằng **FMEA** (Severity × Occurrence × Detection) cho 3 failure mode đầu.

#### D3. Ghi quyết định: one-way/two-way door + ADR / decision journal
**Mô tả:** Đóng phiên bằng bản ghi kiểm chứng lại được, điều chỉnh độ nặng quy trình theo tính đảo ngược.

**Các bước:**
- Phân loại: **two-way door** (đảo được → quyết nhanh với ~70% thông tin) hay **one-way door** (khó đảo → chậm, kỹ, premortem bắt buộc)
- Ghi: bối cảnh, phương án đã cân nhắc, phương án chọn, **lý do**, hệ quả (cả tốt lẫn xấu)
- Thêm kiểu decision journal: **giả định chính, kết quả kỳ vọng, mức tự tin** — ghi *trước khi biết kết quả*
- Đặt mốc review lại

**Hợp với:** kết thúc mọi phiên có ra quyết định; đặc biệt quyết định kiến trúc (ra thẳng ADR).

**Mạnh/yếu:** Bezos: Type 2 nên quyết nhanh vì chi phí trì hoãn lớn hơn chi phí sai-mà-sửa-được. Decision journal chỉ có tác dụng nếu ghi *trước* khi biết kết quả. Yếu: cần kỷ luật review.

**AI chạy với solo user:** Chỗ hoàn hảo cho AI — tự sinh bản ghi từ transcript, đúng format ADR, lưu vào workspace để phiên sau đối chiếu.

### Nhóm hai (nên có, không cần vào lõi)

| Method | Dùng khi | Ghi chú |
|---|---|---|
| **Starbursting** (5W1H) | Kiểm độ phủ của một ý tưởng đã có | Nhẹ hơn Question Burst |
| **Lotus Blossom** (Matsumura) | Đào sâu có hệ thống | 1 → 8 → 64 ý |
| **Disney Method** (Dilts) | Ý hay nhưng chưa rõ có làm được không | Mơ mộng → Thực tế → Phê phán; Six Hats gọn hơn |
| **Mind mapping** (Buzan) | Bản đồ hoá không gian vấn đề | Yếu với text-only; hợp hơn nếu skill xuất mermaid |
| **TRIZ** (Altshuller) | Mâu thuẫn kỹ thuật cứng ("nhanh hơn *và* rẻ hơn") | 40 inventive principles. Nặng. Đừng nhầm với **Liberating Structures TRIZ** — inversion tập thể, khác hẳn |
| **Force Field Analysis** (Lewin) | Thay đổi tổ chức/team | Insight cốt lõi: *giảm lực cản hiệu quả hơn tăng lực đẩy* |
| **Random word** (de Bono) | Bí hoàn toàn | AI đưa từ ngẫu nhiên, ép nối với vấn đề |

---

## 2. Flow phiên brainstorm khuyến nghị

Xương sống: **Double Diamond** (Design Council 2004; bản *Framework for Innovation* 2019). Kim cương 1 mở rồi khép *không gian vấn đề*, kim cương 2 mở rồi khép *không gian giải pháp*. Sai lầm phổ biến nhất là nhảy thẳng vào kim cương 2.

```
[0] TRIAGE (2 phút)
     ├─ Phân loại vấn đề (bảng routing bên dưới)
     ├─ Two-way door hay one-way door?
     └─ Tuyên bố: "sẽ chạy phase X bằng method Y"   ← luôn nói ra để user override

[A] FRAME ── kim cương 1 ────────────────────────────
     Question Burst → First Principles → chốt 1–2 HMW
     Gate: user xác nhận "đây đúng là bài toán cần giải"

[B] DIVERGE ── kim cương 2, nửa mở ──────────────────
     Vòng 1: user viết một mình, AI im lặng (8')      ← chống anchoring
     Vòng 2: ép qua serial order effect (8')
     Vòng 3: AI bổ sung, gắn nhãn rõ ràng
     + 1 method kích thích: SCAMPER hoặc Forced Analogy

[C] PROVOKE (tuỳ chọn — chỉ khi ý tưởng nhìn giống nhau)
     Inversion / Six Hats / Zwicky Box

     ⚠️ GROAN ZONE (Sam Kaner) — nhiều ý tưởng, chưa thấy đường ra.
        Chỗ này bao giờ cũng khó chịu. Đừng khép sớm.

[D] CONVERGE ── kim cương 2, nửa khép ───────────────
     Affinity clustering → NUF hoặc Impact/Effort → chọn 1–3
     Premortem trên phương án đã chọn
     Ghi ADR / decision journal
```

**Nguyên tắc chuyển phase:** không bao giờ diverge và converge cùng lúc. User bắt đầu đánh giá ý tưởng ở phase B → AI chặn: "ghi lại đã, mình chấm ở phase D."

### Chọn method theo loại vấn đề (routing bằng Cynefin — Snowden & Boone, HBR 2007)

| Loại vấn đề | Cynefin | Nhấn phase | Method chính |
|---|---|---|---|
| **Kiến trúc / chọn công nghệ** | Complicated | Frame + Converge | First Principles → **Zwicky Box** → Impact/Effort → Premortem → ADR |
| **Debug / sự cố hệ thống** | Complicated | Frame | 5 Whys **có nhánh** + Inversion + FMEA |
| **Ý tưởng product / feature** | Complex | Diverge | HMW → Brainwriting burst → SCAMPER → Forced Analogy → NUF |
| **Cải tiến cái đang có** | Complicated | Diverge | **SCAMPER** → Impact/Effort |
| **Team / con người / quản lý** | Complex | Frame + Provoke | **Question Burst** → Inversion → **Force Field Analysis** → Six Hats (mũ Đỏ quan trọng) |
| **Bí hoàn toàn** | — | Provoke | Forced Analogy + Random entry + Worst Possible Idea |
| **Đã có phương án, cần kiểm tra** | — | Converge | Six Hats / Disney → **Premortem** → ADR |
| **Khủng hoảng, cần hành động ngay** | Chaotic | — | **Không brainstorm.** Ổn định trước, brainstorm sau |

**Độ dài phiên:** NN/g — 77% phiên ideation dưới 3 giờ. Một phiên AI-facilitated 30–45 phút là hợp lý. Nếu bế tắc, đề xuất **incubation**: Sio & Ormerod (2009), meta-analysis 117 nghiên cứu, d = 0.29, **mạnh nhất khi làm việc nhẹ** chứ không phải nghỉ hẳn hay làm việc nặng. "Đi ăn trưa rồi quay lại" là nước đi hợp lệ.

---

## 3. Nguyên tắc DO / DON'T

### DO

| Nguyên tắc | Nguồn |
|---|---|
| **User viết trước, AI bổ sung sau.** Không thương lượng | Meincke/Nave/Terwiesch 2025; Doshi & Hauser 2024 |
| Hoãn phán xét trong diverge — "evaluation stifles creativity" | Osborn 1953; NN/g |
| Số lượng trước chất lượng; đặt mục tiêu số cụ thể (IDEO: 100 ý/60') | Osborn; IDEO 7 rules |
| Ép qua đợt ý tưởng đầu tiên | Parnes & Meadow 1959; Beaty & Silvia 2012 |
| Mỗi lần một câu hỏi | IDEO "one conversation at a time" |
| Luôn chọn và **tuyên bố** một method có cấu trúc | NN/g: 95% nhóm kém chỉ thảo luận tự do |
| Viết ra, đừng chỉ nói | NN/g: 40% vs 20% |
| Tách bạch diverge/converge; tôn trọng groan zone | Double Diamond; Kaner |
| Thêm ràng buộc có chủ đích — nhưng vừa phải | Acar, Tarakci & van Knippenberg 2019: **chữ U ngược** |
| Nêu tiêu chí trước khi chấm điểm | NUF; Kaner |
| Premortem trước mọi one-way door | Klein 2007 (+30%) |
| Gắn nhãn ý tưởng của AI vs của user | Hệ quả của bằng chứng anchoring |
| Xuất artifact (ADR/decision journal) ghi cả phương án bị loại | Farnam Street; ADR practice |

### DON'T

| Tránh | Vì sao |
|---|---|
| **AI xả 20 ý tưởng ngay khi user vừa mô tả vấn đề** | Failure mode nghiêm trọng nhất — neo toàn bộ phiên |
| Nhảy thẳng vào giải pháp, bỏ qua frame | Kim cương 1 tồn tại chính vì điều này |
| Dừng ở 5–7 ý tưởng đầu | Serial order effect |
| Đánh giá ý tưởng ngay khi vừa sinh ra | Osborn; NN/g |
| Dùng 5 Whys dạng dây thẳng, gọi kết quả là "the root cause" | Critique linear causality; Allspaw |
| Dot voting cho phiên một người | Vô nghĩa khi solo; NN/g nêu 3 vấn đề ngay cả trong nhóm |
| Trình bày Six Thinking Hats như phương pháp đã chứng minh | Gần như không có bằng chứng thực nghiệm |
| Persona role-play màu mè, dài dòng | Persona sai làm *giảm* reasoning của LLM |
| AI nói như thể ý tưởng của nó là "câu trả lời đúng" | Automation bias — option generator, không phải oracle |
| Ràng buộc quá nhiều | Chữ U ngược: gây fixation, giảm động lực |
| Brainstorm khi đang khủng hoảng | Cynefin chaotic: hành động ổn định trước |

---

## 4. Ba lưu ý riêng khi viết skill

**(a) Xung đột tên.** Môi trường đã có `superpowers:brainstorming` — nhưng nó **không phải** skill ideation: nó là cổng gác bắt buộc trước khi implement code. Đặt tên `brainstorming` sẽ tranh trigger → dùng tên `brainstorm`, description nhấn mạnh *khám phá/sinh ý tưởng*.

**(b) Ba pattern đáng mượn từ skill đó:** phân loại và *tuyên bố* path ngay từ đầu để user override; bảng "Red Flags" đối chiếu suy nghĩ sai với thực tế; quy tắc một câu hỏi mỗi message.

**(c) Tăng đa dạng ý tưởng của chính AI ở vòng 3:** Girotra, Meincke & Terwiesch (2024, "Prompting Diverse Ideas"): **chain-of-thought prompting cho độ đa dạng cao nhất**, tiệm cận mức nhóm người. AI nên suy luận ra *các trục khác biệt* trước rồi mới sinh ý tưởng theo từng trục, thay vì liệt kê thẳng.

---

## 5. Nguồn tham khảo

**Tổ chức thiết kế / thực hành**
- NN/g — [Ideation for Everyday Design Challenges](https://www.nngroup.com/articles/ux-ideation/) · [Ideation in Practice](https://www.nngroup.com/articles/ideation-in-practice/) · [Ideation for a One-Person UX Team](https://www.nngroup.com/videos/ideation-one-person-ux-team/) · [Dot Voting: 3 Common Problems](https://www.nngroup.com/videos/dot-voting-problems/) · [How to Prioritize Ideas](https://www.nngroup.com/videos/prioritize-ideas-ux-brainstorming/)
- [Design Council — Framework for Innovation (Double Diamond)](https://www.designcouncil.org.uk/resources/framework-for-innovation/)
- [IDEO U — 7 Simple Rules of Brainstorming](https://www.ideou.com/blogs/inspiration/7-simple-rules-of-brainstorming)
- Gamestorming — [NUF Test](https://gamestorming.com/nuf-test/) · [Forced Analogy](https://gamestorming.com/forced-analogy/)
- [De Bono Group — Six Thinking Hats](https://www.debonogroup.com/services/core-programs/six-thinking-hats/)
- SessionLab — [Brainstorm Rules](https://www.sessionlab.com/methods/brainstorm-rules) · [NUF Test](https://www.sessionlab.com/methods/nuf-test)

**HBR / MIT Sloan**
- Klein — [Performing a Project Premortem](http://homepages.se.edu/cvonbergen/files/2013/01/Performing-a-Project-Premortem.pdf) (HBR 2007)
- Gregersen — [Better Brainstorming](https://hbr.org/2018/03/better-brainstorming) (HBR 2018)
- [MIT Sloan — How 'question bursts' make better brainstorms](https://mitsloan.mit.edu/ideas-made-to-matter/heres-how-question-bursts-make-better-brainstorms)
- De Freitas, Nave & Puntoni — [When Used Correctly, LLMs Can Unlock More Creative Ideas](https://hbr.org/2025/12/research-when-used-correctly-llms-can-unlock-more-creative-ideas) (HBR 2025)

**Nghiên cứu thực nghiệm — brainstorming cổ điển**
- Diehl & Stroebe — [Productivity Loss in Brainstorming Groups](https://www.uni-muenster.de/imperia/md/content/psyifp/aeechterhoff/wintersemester2011-12/seminarthemenfelderdersozialpsychologie/08_diehl_stoebe_productivityloss-brainstorming_jpsp1987.pdf) (JPSP 1987)
- Mullen, Johnson & Salas — [Meta-Analytic Integration](https://dynamic.decorrespondent.nl/downloads/michiel-de-hoog/Mullen-1991-Productivity-Loss-in-Brainstorming-Groups.pdf) (1991)
- [Production blocking (Wikipedia)](https://en.wikipedia.org/wiki/Production_blocking)
- Beaty & Silvia — [Why do ideas get more creative across time?](http://libres.uncg.edu/ir/uncg/f/p_silvia_why_2012.pdf) (2012)
- Sio & Ormerod — [Does incubation enhance problem solving?](https://www.semanticscholar.org/paper/Does-incubation-enhance-problem-solving-A-review.-Sio-Ormerod/76c6ce0abf6f67f2c089df372261203989b43903) (Psych. Bulletin 2009)
- Acar, Tarakci & van Knippenberg — [Creativity and Innovation Under Constraints](https://openaccess.city.ac.uk/20459/1/Acar%2C%20Tarakci%20and%20van%20Knippenberg%20%28in%20press%29_Creativity%20and%20Innovation%20under%20Constraints.pdf) (J. of Management 2019)
- [Effectiveness of Brainwriting Techniques: Nominal Groups vs Real Teams](https://link.springer.com/chapter/10.1007/978-0-85729-224-7_22)

**LLM + ideation (quan trọng nhất)**
- Meincke, Nave & Terwiesch — [ChatGPT decreases idea diversity in brainstorming](https://www.nature.com/articles/s41562-025-02173-x) (*Nature Human Behaviour* 2025) · [tóm tắt Mack Institute](https://mackinstitute.wharton.upenn.edu/2025/new-in-nature-chatgpt-decreases-idea-diversity-in-brainstorming/)
- Doshi & Hauser — [Generative AI enhances individual creativity but reduces collective diversity](https://pmc.ncbi.nlm.nih.gov/articles/PMC11244532/) (*Science Advances* 2024)
- Girotra, Meincke, Terwiesch & Ulrich — [Prompting Diverse Ideas: Increasing AI Idea Variance](https://arxiv.org/abs/2402.01727) (2024)
- Terwiesch et al. — [AI and Its Impact on Creativity and Diversity (SSRN)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4526071)
- [AI-Augmented Brainwriting: LLMs in group ideation](https://arxiv.org/abs/2402.14978)
- [Homogenization Effects of LLMs on Human Creative Ideation](https://arxiv.org/pdf/2402.01536)
- [Persona is a Double-edged Sword](https://arxiv.org/html/2408.08631v2)
- [LLM-powered Devil's Advocate in Group Decision Making](https://mingyin.org/paper/IUI-24/devil.pdf) (IUI 2024)

**Method cụ thể**
- [SCAMPER (Wikipedia)](https://en.wikipedia.org/wiki/SCAMPER) · [Toolshero — Bob Eberle](https://www.toolshero.com/creativity/scamper-technique-bob-eberle/)
- [6-3-5 Brainwriting](https://en.wikipedia.org/wiki/6-3-5_Brainwriting) · [Six Thinking Hats](https://en.wikipedia.org/wiki/Six_Thinking_Hats) · [Cynefin framework](https://en.wikipedia.org/wiki/Cynefin_framework)
- [Morphological Box / Zwicky Box + Cross-Consistency Assessment](https://www.si-labs.com/en/articles/morphological-box/)
- [Lotus Blossom — Hochschule Luzern](https://rcc.hslu.ch/en/tools/three-utilities/methods/zeige/Lotus-Blossom-Technique)
- [Force Field Analysis — The Decision Lab](https://thedecisionlab.com/reference-guide/organizational-behavior/force-field-analysis)
- Farnam Street — [Reversible and Irreversible Decisions](https://fs.blog/reversible-irreversible-decisions/) · [Decision Journal](https://fs.blog/decision-journal/)
- [ATAM (Wikipedia)](https://en.wikipedia.org/wiki/Architecture_tradeoff_analysis_method) · [FMEA — Quality-One](https://quality-one.com/fmea/)
- [Allspaw — Each necessary, but only jointly sufficient](https://www.kitchensoap.com/2012/02/10/each-necessary-but-only-jointly-sufficient/) (phê phán 5 Whys)
- [SI Labs — Brainwriting](https://www.si-labs.com/en/articles/brainwriting/) · [SI Labs — Brainstorming: what research really shows](https://www.si-labs.com/en/articles/brainstorming/)
