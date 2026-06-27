/**
 * app.js — orchestration: scene switching, search, breadcrumb, detail panel,
 * animated counters and wiring between the Hero and KnowledgeGraph engines.
 *
 * In the Next.js migration this becomes the page-level container component
 * holding shared state (focusId, scene) and passing callbacks down.
 */
(function (global) {
  "use strict";
  const D = global.DCI_DATA;
  const $ = function (s, r) { return (r || document).querySelector(s); };
  const $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  const state = { scene: "hero", graph: null, hero: null };

  /* ---------------- company logos ----------------
   * Google favicon (primary) -> DuckDuckGo (fallback) -> monogram tile.
   * Returns an HTML string; the monogram sits behind the <img> and is
   * revealed automatically if both remote sources fail. */
  function initials(label) {
    return label.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean)
      .slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase() || "•";
  }
  function logoHTML(node, size) {
    const g = D.GROUPS[node.group] || D.GROUPS.core;
    const style = "--c:" + g.glow + (size ? ";width:" + size + "px;height:" + size + "px" : "");
    const mono = '<span class="mono">' + initials(node.label) + "</span>";
    if (!node.domain) return '<span class="logo" style="' + style + '">' + mono + "</span>";
    const primary = "https://www.google.com/s2/favicons?domain=" + node.domain + "&sz=128";
    const fb = "https://icons.duckduckgo.com/ip3/" + node.domain + ".ico";
    return '<span class="logo" style="' + style + '">' + mono +
      '<img alt="" loading="lazy" src="' + primary + '" data-fb="' + fb + '" onerror="window.dciLogoFail(this)"></span>';
  }
  window.dciLogoFail = function (img) {
    if (img.dataset.fb) { img.src = img.dataset.fb; img.dataset.fb = ""; }
    else { img.style.display = "none"; }
  };

  /* ---------------- scene switching ---------------- */
  function showScene(name, focusId) {
    state.scene = name;
    $("#scene-hero").classList.toggle("hidden", name !== "hero");
    $("#scene-graph").classList.toggle("hidden", name !== "graph");
    $$(".nav-tabs button").forEach(function (b) { b.classList.toggle("active", b.dataset.scene === name); });

    const graphChrome = ["#breadcrumb", ".hintbar", ".legend", "#reset"];
    graphChrome.forEach(function (s) { const el = $(s); if (el) el.style.display = name === "graph" ? "" : "none"; });

    if (name === "graph") {
      state.graph.start();
      if (focusId) state.graph.focus(focusId);
    } else {
      $("#detail").classList.remove("open");
      // (graph keeps running cheaply; could stop to save CPU)
      if (state.hero && !state.hero.built) state.hero.build();
      if (!document.hidden) animateCounters();
    }
  }

  /* ---------------- breadcrumb ---------------- */
  function renderBreadcrumb(id) {
    const path = D.path(id);
    const bc = $("#breadcrumb");
    bc.innerHTML = "";
    path.forEach(function (n, i) {
      if (i > 0) { const s = document.createElement("span"); s.className = "sep"; s.textContent = "›"; bc.appendChild(s); }
      const c = document.createElement("span");
      c.className = "crumb" + (i === path.length - 1 ? " current" : "");
      c.textContent = n.label;
      c.addEventListener("click", function () { state.graph.focus(n.id); });
      bc.appendChild(c);
    });
  }

  /* ---------------- detail panel ---------------- */
  function renderDetail(id) {
    const n = D.INDEX[id];
    const g = D.GROUPS[n.group] || D.GROUPS.core;
    const panel = $("#detail");
    panel.style.setProperty("--accent", g.glow);

    $("#d-kind", panel).textContent = (g.label || "Node");
    $("#d-title", panel).textContent = n.label;
    $("#d-desc", panel).textContent = n.summary || "";

    // logo header — large logo for companies, group mark otherwise
    $("#d-logo", panel).innerHTML = logoHTML(n);
    const web = $("#d-web", panel);
    if (n.domain) { web.style.display = ""; web.textContent = n.domain + " ↗"; web.href = "https://" + n.domain; }
    else { web.style.display = "none"; }

    // "View full profile" — companies only
    const pbtn = $("#d-profile", panel);
    if (n.group === "supplier") { pbtn.style.display = ""; pbtn.dataset.id = id; }
    else { pbtn.style.display = "none"; }

    const m = $("#d-metrics", panel);
    m.innerHTML = "";
    (n.metrics || []).forEach(function (mm) {
      const el = document.createElement("div"); el.className = "metric";
      el.innerHTML = '<div class="mv">' + mm.value + '</div><div class="mk">' + mm.label + '</div>';
      m.appendChild(el);
    });
    m.style.display = (n.metrics && n.metrics.length) ? "" : "none";

    const cwrap = $("#d-children", panel);
    const clabel = $("#d-children-label", panel);
    cwrap.innerHTML = "";
    if (n.children.length) {
      clabel.style.display = ""; clabel.textContent = n.children.length + " connected nodes";
      n.children.forEach(function (c) {
        const cg = D.GROUPS[c.group] || D.GROUPS.core;
        const el = document.createElement("div"); el.className = "child";
        const mark = (c.group === "supplier")
          ? logoHTML(c, 26)
          : '<span class="dot" style="color:' + cg.glow + '"></span>';
        const tail = c.children.length ? '<span class="ca">→</span>'
          : (c.domain ? '<span class="leaf-tag">company</span>' : '<span class="leaf-tag">leaf</span>');
        el.innerHTML = mark + '<span class="cl">' + c.label + '</span>' + tail;
        el.addEventListener("click", function () { state.graph.focus(c.id); });
        cwrap.appendChild(el);
      });
    } else {
      clabel.style.display = "none";
      // for leaves (suppliers), show a back affordance
      if (n.parent) {
        clabel.style.display = ""; clabel.textContent = "Part of";
        const p = D.INDEX[n.parent];
        const el = document.createElement("div"); el.className = "child";
        const pg = D.GROUPS[p.group] || D.GROUPS.core;
        el.innerHTML = '<span class="dot" style="color:' + pg.glow + '"></span><span class="cl">' + p.label + '</span><span class="ca">↑</span>';
        el.addEventListener("click", function () { state.graph.focus(p.id); });
        cwrap.appendChild(el);
      }
    }
    panel.classList.add("open");
  }

  function onSelect(id) {
    renderBreadcrumb(id);
    renderDetail(id);
  }

  /* ---------------- search ---------------- */
  function setupSearch() {
    const input = $("#search");
    const box = $("#results");
    let sel = -1, current = [];

    function close() { box.classList.remove("open"); sel = -1; }
    function open() { box.classList.add("open"); }

    function run(q) {
      q = q.trim().toLowerCase();
      box.innerHTML = "";
      if (!q) { close(); return; }
      current = D.FLAT.filter(function (n) {
        return n.label.toLowerCase().indexOf(q) >= 0 ||
               (n.summary && n.summary.toLowerCase().indexOf(q) >= 0) ||
               (D.GROUPS[n.group] && D.GROUPS[n.group].label.toLowerCase().indexOf(q) >= 0);
      }).slice(0, 9);

      if (!current.length) { box.innerHTML = '<div class="empty">No matches for “' + q + '”</div>'; open(); return; }
      current.forEach(function (n, i) {
        const g = D.GROUPS[n.group] || D.GROUPS.core;
        const crumb = D.path(n.id).map(function (p) { return p.label; }).slice(0, -1).join(" › ");
        const row = document.createElement("div"); row.className = "row"; row.dataset.i = i;
        const mark = (n.group === "supplier")
          ? logoHTML(n, 22)
          : '<span class="dot" style="color:' + g.glow + '"></span>';
        row.innerHTML = mark +
          '<span class="lbl">' + hl(n.label, q) + '</span>' +
          '<span class="crumb">' + (crumb || "Data Center") + '</span>';
        row.addEventListener("click", function () { go(n.id); });
        box.appendChild(row);
      });
      open();
    }
    function hl(text, q) {
      const i = text.toLowerCase().indexOf(q); if (i < 0) return text;
      return text.substring(0, i) + '<b style="color:#7dd3fc">' + text.substring(i, i + q.length) + '</b>' + text.substring(i + q.length);
    }
    function go(id) {
      close(); input.value = "";
      if (state.scene !== "graph") showScene("graph");
      state.graph.focus(id);
    }

    input.addEventListener("input", function () { run(input.value); });
    input.addEventListener("keydown", function (e) {
      const rows = $$(".row", box);
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, rows.length - 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); }
      else if (e.key === "Enter") { if (current[sel]) go(current[sel].id); else if (current[0]) go(current[0].id); return; }
      else if (e.key === "Escape") { close(); input.blur(); return; }
      rows.forEach(function (r, i) { r.classList.toggle("sel", i === sel); });
      if (rows[sel]) rows[sel].scrollIntoView({ block: "nearest" });
    });
    document.addEventListener("click", function (e) { if (!e.target.closest(".searchbox")) close(); });

    // global "/" focus shortcut
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== input) { e.preventDefault(); input.focus(); }
      if (e.key === "Escape" && state.scene === "graph") { $("#detail").classList.remove("open"); }
    });
  }

  /* ---------------- counters ---------------- */
  function animateCounters() {
    $$(".stat .v").forEach(function (el) {
      const target = parseFloat(el.dataset.value);
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const dec = parseInt(el.dataset.dec || "0", 10);
      const dur = 1400; const t0 = performance.now();
      function step(now) {
        const p = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        const val = target * e;
        el.textContent = prefix + val.toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------------- init ---------------- */
  function init() {
    // company profile overlay
    state.profile = new global.CompanyProfile({
      onNavigate: function (id) {
        if (state.scene !== "graph") showScene("graph");
        state.graph.focus(id);
      }
    });

    // graph engine
    const canvas = $("#graph-canvas");
    state.graph = new global.KnowledgeGraph(canvas, {
      onSelect: onSelect,
      onProfile: function (id) { state.profile.open(id); }
    });
    state.graph.start();

    // hero
    state.hero = new global.Hero($(".flow-wrap"), {
      onEnter: function (focusId) { showScene("graph", focusId || "dc"); }
    });
    state.hero.build();

    // nav
    $$(".nav-tabs button").forEach(function (b) {
      b.addEventListener("click", function () { showScene(b.dataset.scene, b.dataset.scene === "graph" ? "dc" : null); });
    });
    $("#enter-btn").addEventListener("click", function () { showScene("graph", "dc"); });
    $(".brand").addEventListener("click", function () { showScene("hero"); });
    $("#reset").addEventListener("click", function () { state.graph.focus("dc"); });
    $("#detail .close").addEventListener("click", function () { $("#detail").classList.remove("open"); });
    $("#d-profile").addEventListener("click", function () {
      const id = this.dataset.id; if (id) state.profile.open(id);
    });

    setupSearch();
    showScene("hero");          // showScene triggers the counters for the hero
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && state.scene === "hero") animateCounters();
    });
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})(window);
