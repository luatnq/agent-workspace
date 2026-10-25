/* LLM Foundation — shared Mermaid loader.
 *
 * Include once, at the end of <body>, only on pages that contain
 * <pre class="mermaid"> blocks:
 *
 *   <script src="../assets/diagram.js"></script>
 *
 * What it does:
 *   - loads a pinned Mermaid build from jsDelivr (one place to bump the version);
 *   - themes Mermaid from the CSS tokens in styles.css, so diagrams match the
 *     lesson in light and dark mode;
 *   - if the CDN is unreachable (offline), leaves the Mermaid source visible
 *     as a readable fallback and says why.
 *
 * Inline SVG diagrams need no script; they only use assets/diagram.css.
 */
(function () {
  "use strict";

  var MERMAID_SRC = "https://cdn.jsdelivr.net/npm/mermaid@12.0.0/dist/mermaid.min.js";

  function token(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function offline() {
    Array.prototype.forEach.call(document.querySelectorAll("pre.mermaid"), function (pre) {
      var note = document.createElement("p");
      note.className = "diagram-offline";
      note.textContent = "(Không tải được Mermaid — đang hiển thị mã nguồn của sơ đồ. Mở lại khi có mạng để xem hình.)";
      pre.parentNode.insertBefore(note, pre.nextSibling);
    });
  }

  function render() {
    var bg = token("--bg"), fg = token("--fg"), muted = token("--muted");
    var soft = token("--accent-soft"), accent = token("--accent"), code = token("--code-bg");
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      fontFamily: token("--sans"),
      themeVariables: {
        background: bg,
        primaryColor: code,
        primaryBorderColor: muted,
        primaryTextColor: fg,
        secondaryColor: soft,
        secondaryBorderColor: accent,
        tertiaryColor: bg,
        lineColor: muted,
        textColor: fg,
        clusterBkg: bg,
        clusterBorder: muted,
        edgeLabelBackground: bg,
        actorBkg: code,
        actorBorder: muted,
        actorTextColor: fg,
        signalColor: fg,
        signalTextColor: fg,
        noteBkgColor: soft,
        noteBorderColor: accent,
        noteTextColor: fg,
        fontSize: "14px"
      }
    });
    window.mermaid.run({ querySelector: "pre.mermaid" });
  }

  function boot() {
    if (!document.querySelector("pre.mermaid")) return;
    var s = document.createElement("script");
    s.src = MERMAID_SRC;
    s.onload = render;
    s.onerror = offline;
    document.head.appendChild(s);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
