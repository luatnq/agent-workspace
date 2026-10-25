/* Marketing Foundation — shared quiz component (same contract as llm-foundation/assets/quiz.js).
 *
 * Markup contract (author writes options in ANY order; the component shuffles):
 *
 *   <div class="quiz" data-quiz>
 *     <p class="quiz-q">Question text</p>
 *     <ul class="quiz-options">
 *       <li data-correct>Right answer</li>
 *       <li>Wrong answer</li>
 *       <li>Wrong answer</li>
 *     </ul>
 *     <p class="quiz-explain">Why the right answer is right.</p>
 *   </div>
 *
 * Rules enforced by this file:
 *   - options are shuffled at render time with Math.random() (Fisher–Yates),
 *     so position never leaks the answer;
 *   - the correct option is identified by the data-correct attribute, never by index;
 *   - one click locks the quiz and reveals the explanation (tight feedback loop).
 *
 * Optional: <div data-quiz-score></div> anywhere on the page shows a running score.
 */
(function () {
  "use strict";

  function shuffle(nodes) {
    for (var i = nodes.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = nodes[i]; nodes[i] = nodes[j]; nodes[j] = t;
    }
    return nodes;
  }

  var total = 0, answered = 0, correct = 0;

  function updateScore() {
    var el = document.querySelector("[data-quiz-score]");
    if (!el) return;
    el.textContent = "Kết quả: " + correct + "/" + answered + " đúng" +
      (answered < total ? " (còn " + (total - answered) + " câu)" : "");
  }

  function init(quiz) {
    var list = quiz.querySelector(".quiz-options");
    if (!list) return;
    var items = shuffle(Array.prototype.slice.call(list.children));
    list.innerHTML = "";
    items.forEach(function (li) { list.appendChild(li); });

    var verdict = document.createElement("p");
    verdict.className = "quiz-verdict";
    var explain = quiz.querySelector(".quiz-explain");
    if (explain) quiz.insertBefore(verdict, explain); else quiz.appendChild(verdict);

    total++;

    items.forEach(function (li) {
      li.setAttribute("role", "button");
      li.setAttribute("tabindex", "0");
      function pick() {
        if (quiz.classList.contains("answered")) return;
        quiz.classList.add("answered");
        var right = li.hasAttribute("data-correct");
        items.forEach(function (o) {
          if (o.hasAttribute("data-correct")) o.classList.add("is-correct");
          else if (o === li) o.classList.add("is-wrong");
        });
        quiz.classList.add(right ? "correct" : "wrong");
        verdict.textContent = right ? "Đúng." : "Chưa đúng — đáp án đúng được tô xanh.";
        answered++; if (right) correct++;
        updateScore();
      }
      li.addEventListener("click", pick);
      li.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); }
      });
    });
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-quiz]"), init);
    updateScore();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
