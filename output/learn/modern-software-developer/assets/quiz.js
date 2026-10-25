/* Modern Software Developer — shared quiz component with in-browser auto-logging & reporting.
 *
 * Markup contract:
 *   <div class="quiz" data-quiz>
 *     <p class="quiz-q">Question text</p>
 *     <ul class="quiz-options">
 *       <li data-correct>Right answer</li>
 *       <li>Wrong answer</li>
 *     </ul>
 *     <p class="quiz-explain">Explanation</p>
 *   </div>
 *
 * Features:
 *   - Auto persistence: Stores every answer immediately in localStorage (per lesson).
 *   - Session restoration: Preserves answered state, selections, and explanations on reload.
 *   - Cross-lesson history: Tracks completed quizzes in 'msd_quiz_history'.
 *   - Auto-summary panel: Displays score tally, wrong answer breakdown, and actions.
 *   - One-click report copy: Generates formatted Markdown to paste into chat with the Agent.
 *   - Reset / Retake: Clears saved record and reshuffles questions cleanly.
 */
(function () {
  "use strict";

  var STORAGE_PREFIX = "msd_quiz_";
  var HISTORY_KEY = "msd_quiz_history";

  function getSlug() {
    var path = window.location.pathname || "";
    var slug = path.split("/").pop().replace(/\.html$/, "");
    return slug || "msd-lesson";
  }

  function getLessonTitle() {
    var h1 = document.querySelector("h1");
    if (h1) return h1.textContent.trim();
    return (document.title || "").replace(/\s*—.*$/, "").trim() || "Bài học";
  }

  function safeStorageGet(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn("msd-quiz: localStorage read error", e);
      return null;
    }
  }

  function safeStorageSet(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn("msd-quiz: localStorage write error", e);
    }
  }

  function safeStorageRemove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("msd-quiz: localStorage remove error", e);
    }
  }

  function updateGlobalHistory(slug, title, correct, total) {
    var history = safeStorageGet(HISTORY_KEY) || [];
    var idx = -1;
    for (var i = 0; i < history.length; i++) {
      if (history[i].slug === slug) { idx = i; break; }
    }
    var entry = {
      slug: slug,
      title: title,
      correct: correct,
      total: total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
      updatedAt: new Date().toISOString()
    };
    if (idx >= 0) history[idx] = entry;
    else history.push(entry);
    safeStorageSet(HISTORY_KEY, history);
  }

  function shuffle(nodes) {
    for (var i = nodes.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = nodes[i]; nodes[i] = nodes[j]; nodes[j] = t;
    }
    return nodes;
  }

  var quizInstances = [];
  var slug = getSlug();
  var lessonTitle = "";

  function getSavedState() {
    return safeStorageGet(STORAGE_PREFIX + slug) || {
      slug: slug,
      title: lessonTitle,
      answers: {},
      updatedAt: null
    };
  }

  function formatTime(isoStr) {
    if (!isoStr) return "";
    var d = new Date(isoStr);
    if (isNaN(d.getTime())) return "";
    var pad = function (n) { return n < 10 ? "0" + n : n; };
    return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear() + " " +
           pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  function updateScoreElements() {
    var total = quizInstances.length;
    var answered = 0;
    var correct = 0;
    quizInstances.forEach(function (inst) {
      if (inst.isAnswered()) {
        answered++;
        if (inst.isCorrect()) correct++;
      }
    });

    var pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    var remaining = total - answered;

    var scoreEls = document.querySelectorAll("[data-quiz-score]");
    scoreEls.forEach(function (el) {
      if (answered === 0) {
        el.innerHTML = '<span class="quiz-score-muted">Chưa làm câu nào (tổng số ' + total + ' câu)</span>';
      } else {
        var statusText = 'Kết quả: <strong>' + correct + '/' + answered + '</strong> đúng (' + pct + '%)' +
                         (remaining > 0 ? ' — còn ' + remaining + ' câu' : ' — Đã hoàn thành');
        el.innerHTML = '<span class="quiz-score-badge">' + statusText + '</span>' +
                       '<span class="quiz-score-saved" title="Dữ liệu đã tự động lưu vào LocalStorage">💾 Đã lưu</span>';
      }
    });

    renderSummaryPanel(answered, correct, total, pct);
  }

  function generateMarkdownReport() {
    var total = quizInstances.length;
    var answered = 0;
    var correct = 0;
    quizInstances.forEach(function (inst) {
      if (inst.isAnswered()) {
        answered++;
        if (inst.isCorrect()) correct++;
      }
    });

    var pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    var state = getSavedState();
    var timeStr = formatTime(state.updatedAt || new Date().toISOString());

    var lines = [];
    lines.push("### 📝 Báo cáo kết quả trắc nghiệm: " + (lessonTitle || slug));
    lines.push("- **Kết quả**: " + correct + "/" + total + " câu đúng (" + pct + "%)" +
               (answered < total ? " [Chưa xong: còn " + (total - answered) + " câu]" : " [Đã hoàn thành]"));
    lines.push("- **Thời gian**: " + timeStr);
    lines.push("- **Chi tiết từng câu**:");

    quizInstances.forEach(function (inst, idx) {
      var num = idx + 1;
      var qLabel = (idx === 0) ? "Câu 1 (Khởi động)" : ("Câu " + num);
      if (!inst.isAnswered()) {
        lines.push("  " + num + ". " + qLabel + ": ⏳ Chưa trả lời");
        return;
      }
      if (inst.isCorrect()) {
        lines.push("  " + num + ". " + qLabel + ": ✅ Đúng");
      } else {
        var info = inst.getAnswerInfo();
        lines.push("  " + num + ". " + qLabel + ": ❌ Sai");
        lines.push("     - Đã chọn: \"" + (info.selectedText || "").replace(/\n/g, " ") + "\"");
        lines.push("     - Đáp án đúng: \"" + (info.correctText || "").replace(/\n/g, " ") + "\"");
      }
    });

    return lines.join("\n");
  }

  function copyToClipboard(text, btn) {
    function onSuccess() {
      var original = btn.innerHTML;
      btn.innerHTML = "✅ Đã sao chép! Dán vào chat với Agent";
      btn.classList.add("quiz-btn-copied");
      setTimeout(function () {
        btn.innerHTML = original;
        btn.classList.remove("quiz-btn-copied");
      }, 3000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess, fallback);
    } else {
      fallback();
    }

    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        var ok = document.execCommand("copy");
        if (ok) onSuccess();
        else alert("Vui lòng tự sao chép văn bản bên dưới:\n\n" + text);
      } catch (err) {
        alert("Vui lòng tự sao chép văn bản bên dưới:\n\n" + text);
      }
      document.body.removeChild(ta);
    }
  }

  function renderSummaryPanel(answered, correct, total, pct) {
    var panel = document.getElementById("quiz-summary-card");
    if (!panel) {
      var scoreEls = document.querySelectorAll("[data-quiz-score]");
      var anchor = scoreEls.length > 0 ? scoreEls[scoreEls.length - 1] : null;
      if (!anchor && quizInstances.length > 0) {
        anchor = quizInstances[quizInstances.length - 1].element;
      }
      if (!anchor) return;

      panel = document.createElement("div");
      panel.id = "quiz-summary-card";
      panel.className = "quiz-summary-card";
      anchor.parentNode.insertBefore(panel, anchor.nextSibling);
    }

    if (answered === 0) {
      panel.style.display = "none";
      return;
    }
    panel.style.display = "block";

    var state = getSavedState();
    var timeStr = formatTime(state.updatedAt);

    var wrongList = [];
    quizInstances.forEach(function (inst, idx) {
      if (inst.isAnswered() && !inst.isCorrect()) {
        wrongList.push({
          num: idx + 1,
          label: idx === 0 ? "Câu 1 (Khởi động)" : ("Câu " + (idx + 1)),
          info: inst.getAnswerInfo()
        });
      }
    });

    var wrongHtml = "";
    if (wrongList.length > 0) {
      wrongHtml = '<div class="quiz-summary-wrong-section">' +
        '<div class="quiz-summary-wrong-title">⚠️ Câu trả lời chưa chính xác (' + wrongList.length + ' câu):</div>' +
        '<ul class="quiz-summary-wrong-list">' +
        wrongList.map(function (item) {
          return '<li>' +
            '<strong>' + item.label + ':</strong> ' + escapeHtml(item.info.question) + '<br/>' +
            '<span class="quiz-text-bad">✘ Đã chọn:</span> ' + escapeHtml(item.info.selectedText) + '<br/>' +
            '<span class="quiz-text-ok">✔ Đáp án đúng:</span> ' + escapeHtml(item.info.correctText) +
            '</li>';
        }).join("") +
        '</ul>' +
        '</div>';
    } else if (answered === total) {
      wrongHtml = '<div class="quiz-summary-perfect">🎉 Tuyệt vời! Bạn đã trả lời chính xác tất cả các câu hỏi!</div>';
    }

    panel.innerHTML =
      '<div class="quiz-summary-header">' +
        '<div class="quiz-summary-title">' +
          '<span class="quiz-summary-icon">📊</span> ' +
          '<strong>Bảng tổng kết trắc nghiệm</strong>' +
        '</div>' +
        '<div class="quiz-summary-meta">' +
          '<span class="quiz-save-pill">💾 Tự động lưu LocalStorage</span>' +
          (timeStr ? '<span class="quiz-time-pill">' + timeStr + '</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="quiz-summary-body">' +
        '<div class="quiz-metric-row">' +
          '<div class="quiz-metric-stat">' +
            '<span class="quiz-metric-num">' + correct + '/' + total + '</span>' +
            '<span class="quiz-metric-desc">câu đúng (' + pct + '%)</span>' +
          '</div>' +
          '<div class="quiz-bar-container">' +
            '<div class="quiz-bar-fill" style="width: ' + pct + '%;"></div>' +
          '</div>' +
        '</div>' +
        wrongHtml +
        '<div class="quiz-actions-row">' +
          '<button type="button" class="quiz-btn quiz-btn-primary" id="quiz-btn-copy">' +
            '📋 Sao chép báo cáo kết quả gửi Agent' +
          '</button>' +
          '<button type="button" class="quiz-btn quiz-btn-secondary" id="quiz-btn-reset">' +
            '🔄 Làm lại bài' +
          '</button>' +
          '<button type="button" class="quiz-btn quiz-btn-ghost" id="quiz-btn-history">' +
            '📜 Lịch sử các bài' +
          '</button>' +
        '</div>' +
        '<div class="quiz-history-drawer" id="quiz-history-drawer" style="display: none;"></div>' +
      '</div>';

    var copyBtn = panel.querySelector("#quiz-btn-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var report = generateMarkdownReport();
        copyToClipboard(report, copyBtn);
      });
    }

    var resetBtn = panel.querySelector("#quiz-btn-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (confirm("Bạn có chắc chắn muốn xóa kết quả đã lưu và làm lại bài này không?")) {
          resetAll();
        }
      });
    }

    var historyBtn = panel.querySelector("#quiz-btn-history");
    var drawer = panel.querySelector("#quiz-history-drawer");
    if (historyBtn && drawer) {
      historyBtn.addEventListener("click", function () {
        if (drawer.style.display === "none") {
          renderHistoryDrawer(drawer);
          drawer.style.display = "block";
          historyBtn.textContent = "Ẩn lịch sử";
        } else {
          drawer.style.display = "none";
          historyBtn.textContent = "📜 Lịch sử các bài";
        }
      });
    }
  }

  function renderHistoryDrawer(drawer) {
    var history = safeStorageGet(HISTORY_KEY) || [];
    if (history.length === 0) {
      drawer.innerHTML = '<div class="quiz-history-empty">Chưa có lịch sử làm bài nào được lưu.</div>';
      return;
    }
    history.sort(function (a, b) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    var rows = history.map(function (item) {
      var isCurrent = item.slug === slug;
      var time = formatTime(item.updatedAt);
      return '<tr' + (isCurrent ? ' class="quiz-history-current"' : '') + '>' +
        '<td>' + (isCurrent ? '👉 ' : '') + escapeHtml(item.title || item.slug) + '</td>' +
        '<td style="text-align: center;"><strong>' + item.correct + '/' + item.total + '</strong> (' + item.percentage + '%)</td>' +
        '<td style="font-size: 0.82rem; color: var(--muted);">' + time + '</td>' +
        '</tr>';
    }).join("");

    drawer.innerHTML =
      '<div class="quiz-history-box">' +
        '<h4>Lịch sử làm bài trắc nghiệm (LocalStorage):</h4>' +
        '<table class="quiz-history-table">' +
          '<thead><tr><th>Bài học</th><th>Kết quả</th><th>Thời gian</th></tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>' +
      '</div>';
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
  }

  function resetAll() {
    safeStorageRemove(STORAGE_PREFIX + slug);
    quizInstances.forEach(function (inst) {
      inst.reset();
    });
    updateScoreElements();
  }

  function createQuizInstance(quizEl, index) {
    var list = quizEl.querySelector(".quiz-options");
    var qEl = quizEl.querySelector(".quiz-q");
    var questionText = qEl ? qEl.textContent.trim() : ("Câu hỏi " + (index + 1));
    var verdict = quizEl.querySelector(".quiz-verdict");
    if (!verdict) {
      verdict = document.createElement("p");
      verdict.className = "quiz-verdict";
      var explain = quizEl.querySelector(".quiz-explain");
      if (explain) quizEl.insertBefore(verdict, explain);
      else quizEl.appendChild(verdict);
    }

    var correctLi = list ? list.querySelector("li[data-correct]") : null;
    var correctText = correctLi ? correctLi.textContent.trim() : "";

    var answeredState = false;
    var isCorrectAnswer = false;
    var selectedText = "";

    function getItems() {
      return list ? Array.prototype.slice.call(list.children) : [];
    }

    function applyAnswer(li, shouldSave) {
      if (quizEl.classList.contains("answered")) return;
      quizEl.classList.add("answered");
      answeredState = true;
      selectedText = li.textContent.trim();
      var right = li.hasAttribute("data-correct");
      isCorrectAnswer = right;

      var items = getItems();
      items.forEach(function (o) {
        if (o.hasAttribute("data-correct")) o.classList.add("is-correct");
        else if (o === li) o.classList.add("is-wrong");
      });

      quizEl.classList.add(right ? "correct" : "wrong");
      verdict.textContent = right ? "Đúng." : "Chưa đúng — đáp án đúng được tô xanh.";

      if (shouldSave) {
        var state = getSavedState();
        state.title = lessonTitle;
        state.updatedAt = new Date().toISOString();
        state.answers[index] = {
          question: questionText,
          selectedText: selectedText,
          correctText: correctText,
          isCorrect: right,
          answeredAt: state.updatedAt
        };
        safeStorageSet(STORAGE_PREFIX + slug, state);

        var total = quizInstances.length;
        var answered = 0;
        var correct = 0;
        quizInstances.forEach(function (inst) {
          if (inst.isAnswered()) {
            answered++;
            if (inst.isCorrect()) correct++;
          }
        });
        updateGlobalHistory(slug, lessonTitle, correct, total);
      }

      updateScoreElements();
    }

    function setupOptions() {
      if (!list) return;
      var items = shuffle(getItems());
      list.innerHTML = "";
      items.forEach(function (li) {
        list.appendChild(li);
        li.setAttribute("role", "button");
        li.setAttribute("tabindex", "0");

        function pick() { applyAnswer(li, true); }
        li.onclick = pick;
        li.onkeydown = function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            pick();
          }
        };
      });
    }

    function restoreFromState(savedAns) {
      if (!savedAns || !list) return;
      var items = getItems();
      for (var i = 0; i < items.length; i++) {
        if (items[i].textContent.trim() === savedAns.selectedText.trim()) {
          applyAnswer(items[i], false);
          break;
        }
      }
    }

    function reset() {
      answeredState = false;
      isCorrectAnswer = false;
      selectedText = "";
      quizEl.classList.remove("answered", "correct", "wrong");
      verdict.textContent = "";
      var items = getItems();
      items.forEach(function (li) {
        li.classList.remove("is-correct", "is-wrong");
      });
      setupOptions();
    }

    setupOptions();

    return {
      element: quizEl,
      index: index,
      isAnswered: function () { return answeredState; },
      isCorrect: function () { return isCorrectAnswer; },
      getAnswerInfo: function () {
        return {
          question: questionText,
          selectedText: selectedText,
          correctText: correctText,
          isCorrect: isCorrectAnswer
        };
      },
      restore: restoreFromState,
      reset: reset
    };
  }

  function boot() {
    lessonTitle = getLessonTitle();
    var elements = document.querySelectorAll("[data-quiz]");
    quizInstances = [];

    var savedState = getSavedState();

    elements.forEach(function (el, idx) {
      var inst = createQuizInstance(el, idx);
      quizInstances.push(inst);
      if (savedState && savedState.answers && savedState.answers[idx]) {
        inst.restore(savedState.answers[idx]);
      }
    });

    updateScoreElements();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
