# Mission: LLM Foundation

## Why
Luật là senior backend engineer (Java/Spring, K8s) đang lead team và tự xây agent cá nhân. Mục tiêu là hiểu LLM ở **tầng engineering** đủ sâu để (1) ra quyết định kiến trúc đúng khi team tích hợp LLM — chọn model, cân cost/latency, quyết RAG hay fine-tune, đánh giá đề xuất của người khác — và (2) build agent/LLM app chắc tay, biết trước các failure mode thay vì vấp rồi mới học.

## Success looks like
- Nhìn một tính năng LLM đề xuất, ước lượng được cost + latency theo tokens và chỉ ra rủi ro chính trước khi code.
- Giải thích được cho team (bằng lời, không cần toán) vì sao model hallucinate, vì sao context window là tài nguyên khan hiếm, vì sao output không deterministic.
- Chọn được giữa prompt engineering / RAG / fine-tune / agent loop cho một bài toán cụ thể, có lý do trade-off.
- Thiết kế được tool-calling agent với eval cơ bản, biết đo "có tốt hơn không" thay vì cảm tính.
- Đọc pricing page / model card / release note của một model mới và biết nó thay đổi gì cho hệ thống của mình.

## Constraints
- ~4–5 giờ/tuần. Đang chạy song song quỹ 45 phút/ngày cho tiếng Anh (mục tiêu phỏng vấn) — không lấn vào quỹ đó.
- Học bằng đọc + video + quiz/tự diễn đạt lại. **Không** thích hands-on code thuần; bài tập nếu có phải là đọc-và-phán-đoán, không phải viết code.
- Mỗi bài học phải xong trong một lần ngồi (15–30 phút), có primary source đi kèm.
- Trả lời bằng tiếng Việt, thuật ngữ giữ tiếng Anh.

## Out of scope
- Toán của attention / backprop, implement transformer từ đầu.
- Training / pretraining pipeline ở mức chi tiết (chỉ cần biết tồn tại và ảnh hưởng gì).
- Luyện phỏng vấn AI — đã có quỹ riêng cho tiếng Anh, không gộp vào đây.
