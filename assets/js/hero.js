/**
 * hero.js — cinematic lifecycle flow for the landing hero.
 *
 * Lays the 13 lifecycle stages on a serpentine path, draws self-animating
 * SVG connectors with flowing energy, and reveals hover summaries.
 * Clicking a stage hands off to the knowledge graph (via opts.onEnter).
 */
(function (global) {
  "use strict";
  const D = global.DCI_DATA;

  function Hero(root, opts) {
    this.root = root;            // .flow-wrap
    this.svg = root.querySelector("#flow-svg");
    this.layer = root.querySelector(".flow-nodes");
    this.tip = root.querySelector(".flow-tip");
    this.opts = opts || {};
    this.built = false;
    this._resize = this._resize.bind(this);
    window.addEventListener("resize", this._debouncedResize());
  }

  Hero.prototype._debouncedResize = function () {
    const self = this; let to;
    return function () { clearTimeout(to); to = setTimeout(self._resize, 180); };
  };

  Hero.prototype.layout = function () {
    const w = this.root.clientWidth, h = this.root.clientHeight;
    const stages = D.LIFECYCLE;
    const n = stages.length;
    // serpentine: distribute across up to 3 rows depending on width
    const cols = w < 760 ? 2 : (w < 1180 ? 3 : 4);
    const rows = Math.ceil(n / cols);
    // keep wide chips off the edges on narrow screens (chip half-width ~70px)
    const padX = Math.max(w * 0.12, w < 760 ? 72 : 90), padY = h * 0.16;
    const usableW = w - padX * 2, usableH = h - padY * 2;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / cols);
      let col = i % cols;
      if (row % 2 === 1) col = cols - 1 - col; // snake
      const fx = cols === 1 ? 0.5 : col / (cols - 1);
      const fy = rows === 1 ? 0.5 : row / (rows - 1);
      pts.push({ x: padX + fx * usableW, y: padY + fy * usableH, stage: stages[i], i: i, order: i });
    }
    // reorder pts to follow snake reading order already done; ensure sequential by i
    return pts;
  };

  Hero.prototype.build = function () {
    const pts = this.layout();
    const w = this.root.clientWidth, h = this.root.clientHeight;
    this.svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    this.svg.innerHTML = "";
    this.layer.innerHTML = "";
    const NS = "http://www.w3.org/2000/svg";

    // gradient + glow defs
    const defs = document.createElementNS(NS, "defs");
    defs.innerHTML =
      '<linearGradient id="flowg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#38bdf8"/><stop offset="0.5" stop-color="#22d3ee"/><stop offset="1" stop-color="#a855f7"/></linearGradient>' +
      '<filter id="fglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    this.svg.appendChild(defs);

    // connectors (sequential)
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const cy = my + (Math.abs(b.x - a.x) > Math.abs(b.y - a.y) ? -40 : 0);
      const path = document.createElementNS(NS, "path");
      const dd = "M " + a.x + " " + a.y + " Q " + mx + " " + cy + " " + b.x + " " + b.y;
      path.setAttribute("d", dd);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "url(#flowg)");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("opacity", "0.55");
      const len = path.getTotalLength ? 600 : 600;
      path.style.strokeDasharray = "8 0";
      // self-draw
      try {
        const L = path.getTotalLength();
        path.style.strokeDasharray = L;
        path.style.strokeDashoffset = L;
        path.style.animation = "none";
        path.animate(
          [{ strokeDashoffset: L }, { strokeDashoffset: 0 }],
          { duration: 900, delay: 200 + i * 110, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" }
        );
      } catch (e) {}
      this.svg.appendChild(path);

      // flowing pulse along the connector
      const pulse = document.createElementNS(NS, "circle");
      pulse.setAttribute("r", "3");
      pulse.setAttribute("fill", "#bae6fd");
      pulse.setAttribute("filter", "url(#fglow)");
      const am = document.createElementNS(NS, "animateMotion");
      am.setAttribute("dur", (2.2 + Math.random()).toFixed(2) + "s");
      am.setAttribute("repeatCount", "indefinite");
      am.setAttribute("begin", (i * 0.18).toFixed(2) + "s");
      am.setAttribute("path", dd);
      pulse.appendChild(am);
      this.svg.appendChild(pulse);
    }

    // nodes
    const self = this;
    pts.forEach(function (p, idx) {
      const stage = p.stage;
      const g = D.GROUPS[stage.group] || D.GROUPS.core;
      const el = document.createElement("div");
      el.className = "flow-node";
      el.style.left = p.x + "px";
      el.style.top = p.y + "px";
      el.style.setProperty("--accent", g.glow);
      el.style.animationDelay = (200 + idx * 100) + "ms";
      el.innerHTML =
        '<span class="dotmark"></span>' +
        '<span class="chip">' + stage.label + '</span>' +
        '<span class="num">' + String(idx + 1).padStart(2, "0") + ' / ' + pts.length + '</span>';
      el.addEventListener("mouseenter", function () { self._showTip(p, stage); });
      el.addEventListener("mouseleave", function () { self.tip.classList.remove("show"); });
      el.addEventListener("click", function () { if (self.opts.onEnter) self.opts.onEnter(stage.linkTo); });
      self.layer.appendChild(el);
    });

    this.built = true;
  };

  Hero.prototype._showTip = function (p, stage) {
    const tip = this.tip;
    tip.innerHTML = "<b>" + stage.label + "</b>" + stage.summary;
    tip.classList.add("show");
    const w = this.root.clientWidth;
    let left = p.x + 18, top = p.y + 18;
    if (left + 300 > w) left = p.x - 298;
    tip.style.left = Math.max(8, left) + "px";
    tip.style.top = top + "px";
  };

  Hero.prototype._resize = function () { if (this.built && this.root.offsetParent !== null) this.build(); };

  global.Hero = Hero;
})(window);
