/* Marketing Foundation — shared worksheet component.
 *
 * A worksheet turns a lesson's exercise into a real artifact for the side project.
 * Fields autosave to localStorage (per worksheet id) so the learner can come back,
 * and "Copy as Markdown" produces text to paste to the teacher agent for feedback.
 *
 * Markup contract:
 *
 *   <div class="worksheet" data-worksheet="positioning-v0" data-title="Positioning canvas v0">
 *     <h3>Positioning canvas v0</h3>
 *     <div class="ws-field">
 *       <label for="ws-alt">1. Competitive alternatives</label>
 *       <span class="ws-hint">Optional hint shown under the label.</span>
 *       <textarea id="ws-alt" data-field="Competitive alternatives"></textarea>
 *     </div>
 *     ...
 *     <div class="ws-actions"></div>       <!-- buttons + status are injected here -->
 *     <pre class="ws-output"></pre>        <!-- markdown preview is injected here -->
 *   </div>
 *
 * Rules enforced by this file:
 *   - every [data-field] input/textarea is saved on input, keyed by data-worksheet;
 *   - "Copy as Markdown" writes "# <title>\n\n## <field>\n<value>..." to the clipboard
 *     and shows the same text in .ws-output as a fallback;
 *   - "Clear" wipes the saved state after a confirm-free double click guard (two clicks).
 */
(function () {
  "use strict";

  function key(ws) { return "worksheet:" + location.pathname + "#" + ws.getAttribute("data-worksheet"); }

  function fields(ws) { return Array.prototype.slice.call(ws.querySelectorAll("[data-field]")); }

  function load(ws) {
    try {
      var raw = localStorage.getItem(key(ws));
      if (!raw) return;
      var data = JSON.parse(raw);
      fields(ws).forEach(function (f) {
        var name = f.getAttribute("data-field");
        if (data[name] != null) f.value = data[name];
      });
    } catch (e) { /* storage unavailable: worksheet still works, just without persistence */ }
  }

  function save(ws, status) {
    var data = {};
    fields(ws).forEach(function (f) { data[f.getAttribute("data-field")] = f.value; });
    try {
      localStorage.setItem(key(ws), JSON.stringify(data));
      if (status) status.textContent = "Đã lưu trong trình duyệt này.";
    } catch (e) {
      if (status) status.textContent = "Không lưu được (trình duyệt chặn storage) — nhớ copy trước khi đóng.";
    }
  }

  function toMarkdown(ws) {
    var title = ws.getAttribute("data-title") || "Worksheet";
    var out = "# " + title + "\n";
    fields(ws).forEach(function (f) {
      var v = (f.value || "").trim();
      out += "\n## " + f.getAttribute("data-field") + "\n" + (v || "_(chưa điền)_") + "\n";
    });
    return out;
  }

  function init(ws) {
    var actions = ws.querySelector(".ws-actions");
    var output = ws.querySelector(".ws-output");
    if (!actions) { actions = document.createElement("div"); actions.className = "ws-actions"; ws.appendChild(actions); }
    if (!output) { output = document.createElement("pre"); output.className = "ws-output"; ws.appendChild(output); }

    var status = document.createElement("span");
    status.className = "ws-status";

    var copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.textContent = "Copy dạng Markdown";

    var clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "secondary";
    clearBtn.textContent = "Xóa";
    var armed = false;

    actions.appendChild(copyBtn);
    actions.appendChild(clearBtn);
    actions.appendChild(status);

    load(ws);

    var timer = null;
    fields(ws).forEach(function (f) {
      f.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(function () { save(ws, status); }, 300);
      });
    });

    copyBtn.addEventListener("click", function () {
      var md = toMarkdown(ws);
      output.textContent = md;
      ws.classList.add("show-output");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(md).then(
          function () { status.textContent = "Đã copy — dán vào chat để tôi góp ý."; },
          function () { status.textContent = "Không copy tự động được — chọn văn bản bên dưới."; }
        );
      } else {
        status.textContent = "Không copy tự động được — chọn văn bản bên dưới.";
      }
    });

    clearBtn.addEventListener("click", function () {
      if (!armed) { armed = true; clearBtn.textContent = "Bấm lần nữa để xóa"; setTimeout(function () { armed = false; clearBtn.textContent = "Xóa"; }, 2500); return; }
      fields(ws).forEach(function (f) { f.value = ""; });
      try { localStorage.removeItem(key(ws)); } catch (e) {}
      ws.classList.remove("show-output");
      output.textContent = "";
      status.textContent = "Đã xóa.";
      armed = false; clearBtn.textContent = "Xóa";
    });
  }

  function boot() { Array.prototype.forEach.call(document.querySelectorAll("[data-worksheet]"), init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
