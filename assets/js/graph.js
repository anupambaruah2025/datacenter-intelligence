/**
 * graph.js — custom canvas knowledge-graph engine (zero dependencies).
 *
 * Renders the Data Center knowledge graph as an animated radial system:
 *   - the focused node sits at centre
 *   - its children fan out on an animated ring
 *   - parents recede; siblings fade
 *   - connection lines are bezier curves with flowing energy particles
 *
 * Positions are eased every frame (lerp) so re-focusing morphs smoothly.
 * Designed to be wrapped by a React component later: construct with a
 * canvas + data, expose focus()/onSelect — no global state leakage.
 */
(function (global) {
  "use strict";

  const D = global.DCI_DATA;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeT(dt, speed) { return 1 - Math.pow(1 - speed, dt * 60); }

  function KnowledgeGraph(canvas, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.opts = opts || {};
    this.onSelect = this.opts.onSelect || function () {};
    this.onProfile = this.opts.onProfile || function () {};
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.focusId = "dc";
    this.nodes = {};            // id -> render node { x,y,tx,ty,r,tr,alpha,talpha }
    this.hoverId = null;
    this.particles = [];        // flowing energy along active edges
    this.logoCache = {};        // domain -> { img, ok, fb }
    this.t = 0;
    this.view = { x: 0, y: 0, scale: 1, tx: 0, ty: 0, tscale: 1 }; // pan/zoom
    this.drag = null;
    this.running = false;

    this._resize = this._resize.bind(this);
    this._frame = this._frame.bind(this);
    this._bind();
    this._resize();
    this.focus("dc", true);
  }

  KnowledgeGraph.prototype._bind = function () {
    const c = this.canvas, self = this;
    window.addEventListener("resize", this._resize);

    c.addEventListener("mousemove", function (e) {
      const p = self._toWorld(e);
      if (self.drag) {
        self.view.tx = self.drag.vx + (e.clientX - self.drag.sx);
        self.view.ty = self.drag.vy + (e.clientY - self.drag.sy);
        self.dragged = true;
        return;
      }
      self.hoverId = self._hit(p);
      c.style.cursor = self.hoverId ? "pointer" : "grab";
    });
    c.addEventListener("mousedown", function (e) {
      self.drag = { sx: e.clientX, sy: e.clientY, vx: self.view.tx, vy: self.view.ty };
      self.dragged = false;
    });
    window.addEventListener("mouseup", function (e) {
      if (self.drag && !self.dragged) {
        const id = self._hit(self._toWorld(e));
        if (id) self._click(id);
      }
      self.drag = null;
    });
    c.addEventListener("dblclick", function (e) {
      const id = self._hit(self._toWorld(e));
      if (!id) return;
      if (D.INDEX[id].children.length) self.focus(id);
      else if (D.INDEX[id].group === "supplier") self.onProfile(id);   // deep-dive company
    });
    c.addEventListener("wheel", function (e) {
      e.preventDefault();
      const f = e.deltaY < 0 ? 1.12 : 0.89;
      self.view.tscale = Math.max(0.45, Math.min(2.6, self.view.tscale * f));
    }, { passive: false });
  };

  KnowledgeGraph.prototype._resize = function () {
    const r = this.canvas.getBoundingClientRect();
    this.w = r.width; this.h = r.height;
    this.canvas.width = r.width * this.dpr;
    this.canvas.height = r.height * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  };

  KnowledgeGraph.prototype._toWorld = function (e) {
    const r = this.canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    return {
      x: (x - this.w / 2 - this.view.x) / this.view.scale + this.w / 2,
      y: (y - this.h / 2 - this.view.y) / this.view.scale + this.h / 2
    };
  };

  KnowledgeGraph.prototype._hit = function (p) {
    let best = null, bd = Infinity;
    for (const id in this.nodes) {
      const n = this.nodes[id];
      if (n.alpha < 0.25) continue;
      const d = Math.hypot(p.x - n.x, p.y - n.y);
      if (d < n.r + 10 && d < bd) { bd = d; best = id; }
    }
    return best;
  };

  KnowledgeGraph.prototype._click = function (id) {
    this.onSelect(id);
    // clicking a node that has children & isn't focus -> drill in
    if (id !== this.focusId && D.INDEX[id].children.length) this.focus(id);
    else if (id !== this.focusId) this.selectedId = id;
  };

  /* Compute target layout for a given focus id. */
  KnowledgeGraph.prototype.focus = function (id, instant) {
    if (!D.INDEX[id]) return;
    this.focusId = id;
    this.selectedId = id;
    this.onSelect(id);
    this.view.tx = 0; this.view.ty = 0; this.view.tscale = 1;

    const node = D.INDEX[id];
    const cx = this.w / 2, cy = this.h / 2;
    const path = D.path(id);
    const parent = node.parent ? D.INDEX[node.parent] : null;

    // Build the visible set: focus (center), its children (ring),
    // and parent (tucked above-left as a "back" anchor).
    const want = {};
    want[id] = { x: cx, y: cy, r: 44, alpha: 1, role: "focus" };

    const kids = node.children;
    const R = Math.min(this.w, this.h) * 0.31 + Math.min(kids.length * 6, 70);
    const start = -Math.PI / 2;
    kids.forEach(function (k, i) {
      const a = start + (i / Math.max(kids.length, 1)) * Math.PI * 2;
      want[k.id] = {
        x: cx + Math.cos(a) * R,
        y: cy + Math.sin(a) * R,
        r: k.children.length ? 26 : 19,
        alpha: 1, role: "child", angle: a
      };
    });

    if (parent) {
      want[parent.id] = { x: cx - R * 0.86, y: cy - R * 0.92, r: 22, alpha: 0.6, role: "parent" };
    }

    this.want = want;
    this.parentId = parent ? parent.id : null;
    this.crumbPath = path;

    // seed render nodes that don't exist yet (spawn from focus center)
    for (const wid in want) {
      if (!this.nodes[wid]) {
        const seed = this.nodes[id] || { x: cx, y: cy };
        this.nodes[wid] = { x: seed.x, y: seed.y, r: 4, alpha: 0,
          tx: want[wid].x, ty: want[wid].y, tr: want[wid].r, talpha: want[wid].alpha };
      }
    }
    // assign targets; fade out nodes not in the want set
    for (const nid in this.nodes) {
      const n = this.nodes[nid];
      if (want[nid]) { n.tx = want[nid].x; n.ty = want[nid].y; n.tr = want[nid].r; n.talpha = want[nid].alpha; n.role = want[nid].role; n.angle = want[nid].angle; }
      else { n.talpha = 0; n.tr = 3; }
    }
    if (instant) {
      for (const nid in this.nodes) { const n = this.nodes[nid]; n.x = n.tx; n.y = n.ty; n.r = n.tr; n.alpha = n.talpha; }
    }
    this._seedParticles();
  };

  KnowledgeGraph.prototype._seedParticles = function () {
    this.particles = [];
    const node = D.INDEX[this.focusId];
    const self = this;
    node.children.forEach(function (k) {
      const count = 3;
      for (let i = 0; i < count; i++) self.particles.push({ from: self.focusId, to: k.id, t: i / count, speed: 0.18 + Math.random() * 0.12 });
    });
  };

  KnowledgeGraph.prototype.start = function () {
    if (this.running) return;
    this.running = true; this.last = performance.now();
    requestAnimationFrame(this._frame);
  };
  KnowledgeGraph.prototype.stop = function () { this.running = false; };

  KnowledgeGraph.prototype._frame = function (now) {
    if (!this.running) return;
    const dt = Math.min((now - this.last) / 1000, 0.05); this.last = now; this.t += dt;
    this._update(dt); this._draw();
    requestAnimationFrame(this._frame);
  };

  KnowledgeGraph.prototype._update = function (dt) {
    const e = easeT(dt, 0.12);
    for (const id in this.nodes) {
      const n = this.nodes[id];
      n.x = lerp(n.x, n.tx, e); n.y = lerp(n.y, n.ty, e);
      n.r = lerp(n.r, n.tr, e); n.alpha = lerp(n.alpha, n.talpha, e);
      // gentle idle float for children
      if (n.role === "child" && n.angle != null) {
        n.fx = Math.cos(this.t * 0.7 + n.angle * 3) * 3;
        n.fy = Math.sin(this.t * 0.6 + n.angle * 2) * 3;
      } else { n.fx = 0; n.fy = 0; }
    }
    // prune fully-faded, non-wanted nodes
    for (const id in this.nodes) {
      if (this.nodes[id].alpha < 0.02 && this.nodes[id].talpha === 0) delete this.nodes[id];
    }
    // view ease
    const ve = easeT(dt, 0.14);
    this.view.x = lerp(this.view.x, this.view.tx, ve);
    this.view.y = lerp(this.view.y, this.view.ty, ve);
    this.view.scale = lerp(this.view.scale, this.view.tscale, ve);
    // particles
    for (const p of this.particles) { p.t += p.speed * dt; if (p.t > 1) p.t -= 1; }
  };

  function groupColor(id) {
    const node = D.INDEX[id];
    const g = D.GROUPS[node.group] || D.GROUPS.core;
    return g;
  }

  KnowledgeGraph.prototype._draw = function () {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.save();
    ctx.translate(this.w / 2 + this.view.x, this.h / 2 + this.view.y);
    ctx.scale(this.view.scale, this.view.scale);
    ctx.translate(-this.w / 2, -this.h / 2);

    const focus = this.nodes[this.focusId];

    // ---- connection lines focus -> children ----
    const node = D.INDEX[this.focusId];
    if (focus) {
      node.children.forEach((k) => {
        const cn = this.nodes[k.id]; if (!cn) return;
        this._edge(focus, cn, groupColor(k.id).glow, Math.min(focus.alpha, cn.alpha));
      });
      // parent link
      if (this.parentId && this.nodes[this.parentId]) {
        this._edge(this.nodes[this.parentId], focus, "rgba(150,170,200,0.5)", 0.4, true);
      }
    }

    // ---- flowing particles ----
    for (const p of this.particles) {
      const a = this.nodes[p.from], b = this.nodes[p.to]; if (!a || !b) continue;
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 26;
      const t = p.t, it = 1 - t;
      const x = it * it * a.x + 2 * it * t * mx + t * t * b.x;
      const y = it * it * a.y + 2 * it * t * my + t * t * b.y;
      const g = groupColor(p.to).glow;
      ctx.beginPath(); ctx.arc(x, y, 2.1, 0, 7); ctx.fillStyle = g;
      ctx.shadowBlur = 10; ctx.shadowColor = g; ctx.globalAlpha = 0.9 * Math.min(a.alpha, b.alpha);
      ctx.fill(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }

    // ---- nodes (draw children first, focus last on top) ----
    const order = Object.keys(this.nodes).sort((a, b) => (a === this.focusId ? 1 : 0) - (b === this.focusId ? 1 : 0));
    for (const id of order) this._node(id);

    ctx.restore();
  };

  KnowledgeGraph.prototype._edge = function (a, b, color, alpha, dashed) {
    const ctx = this.ctx;
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 26;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(mx, my, b.x, b.y);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = color;
    ctx.globalAlpha = (dashed ? 0.5 : 0.32) * alpha;
    if (dashed) ctx.setLineDash([4, 6]); else ctx.setLineDash([]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  };

  KnowledgeGraph.prototype._node = function (id) {
    const ctx = this.ctx;
    const n = this.nodes[id]; if (!n || n.alpha < 0.02) return;
    const data = D.INDEX[id];
    const g = groupColor(id);
    const x = n.x + (n.fx || 0), y = n.y + (n.fy || 0), r = n.r;
    const isFocus = id === this.focusId;
    const isHover = id === this.hoverId;
    const isSel = id === this.selectedId;
    const hasKids = data.children.length > 0;

    ctx.globalAlpha = n.alpha;

    // outer glow ring
    const pulse = isFocus ? 1 + Math.sin(this.t * 2) * 0.06 : 1;
    const glowR = r * (isHover ? 2.4 : 2.0) * pulse;
    const grd = ctx.createRadialGradient(x, y, r * 0.4, x, y, glowR);
    grd.addColorStop(0, hexA(g.glow, isFocus ? 0.5 : 0.32));
    grd.addColorStop(1, hexA(g.glow, 0));
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(x, y, glowR, 0, 7); ctx.fill();

    // selection / hover ring
    if (isSel || isHover) {
      ctx.beginPath(); ctx.arc(x, y, r + 7, 0, 7);
      ctx.lineWidth = 1.5; ctx.strokeStyle = hexA(g.color, isSel ? 0.9 : 0.5); ctx.stroke();
    }

    // company nodes render their logo on a white disc; everything else uses
    // the gradient core treatment.
    const logo = data.group === "supplier" ? this._logo(data) : null;
    if (logo) {
      // colored rim
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7);
      ctx.fillStyle = g.glow; ctx.shadowBlur = 16; ctx.shadowColor = g.glow; ctx.fill(); ctx.shadowBlur = 0;
      // white logo tile
      ctx.beginPath(); ctx.arc(x, y, r * 0.86, 0, 7); ctx.fillStyle = "#f8fafc"; ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(x, y, r * 0.82, 0, 7); ctx.clip();
      const s = r * 1.25;
      try { ctx.drawImage(logo, x - s / 2, y - s / 2, s, s); } catch (e) {}
      ctx.restore();
      // expandable indicator handled below; finish here (skip generic core)
      if (hasKids && !isFocus) {
        ctx.beginPath(); ctx.arc(x, y, r + 3, -0.3, 0.3);
        ctx.lineWidth = 2; ctx.strokeStyle = hexA(g.color, 0.8); ctx.stroke();
      }
      this._label(x, y, r, data, isFocus, isHover, isSel, n.alpha);
      ctx.globalAlpha = 1;
      return;
    }

    // core disc
    const core = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.2, x, y, r);
    core.addColorStop(0, lighten(g.color));
    core.addColorStop(1, g.glow);
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7);
    ctx.fillStyle = core;
    ctx.shadowBlur = isFocus ? 28 : 14; ctx.shadowColor = g.glow;
    ctx.fill(); ctx.shadowBlur = 0;

    // inner dark for non-focus to read as "ring"
    if (!isFocus) {
      // company without a loaded logo yet → show monogram initials on dark disc
      ctx.beginPath(); ctx.arc(x, y, r * 0.58, 0, 7);
      ctx.fillStyle = "rgba(7,10,18,0.82)"; ctx.fill();
      if (data.group === "supplier") {
        ctx.fillStyle = "#dbe4f0"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = "700 " + Math.max(8, r * 0.5) + "px Inter, system-ui, sans-serif";
        ctx.fillText(monogram(data.label), x, y + 1);
      } else {
        ctx.beginPath(); ctx.arc(x, y, r * 0.2, 0, 7); ctx.fillStyle = g.color; ctx.fill();
      }
    } else {
      // focus: data-center mark — concentric
      ctx.beginPath(); ctx.arc(x, y, r * 0.62, 0, 7);
      ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, 7); ctx.fillStyle = "#fff"; ctx.fill();
    }

    // expandable indicator (ring of has-children)
    if (hasKids && !isFocus) {
      ctx.beginPath(); ctx.arc(x, y, r + 3, -0.3, 0.3);
      ctx.lineWidth = 2; ctx.strokeStyle = hexA(g.color, 0.8); ctx.stroke();
    }

    this._label(x, y, r, data, isFocus, isHover, isSel, n.alpha);
    ctx.globalAlpha = 1;
  };

  KnowledgeGraph.prototype._label = function (x, y, r, data, isFocus, isHover, isSel, alpha) {
    const ctx = this.ctx;
    ctx.globalAlpha = alpha * (isFocus || isHover || isSel || r > 20 ? 1 : 0.86);
    ctx.fillStyle = isFocus ? "#fff" : "#dbe4f0";
    ctx.font = (isFocus ? "700 " : "600 ") + (isFocus ? 16 : (r > 22 ? 13 : 12)) + "px Inter, system-ui, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.shadowBlur = 6; ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.fillText(data.label, x, y + r + 7);
    ctx.shadowBlur = 0;
  };

  /* Lazy logo loader: Google favicon -> DuckDuckGo -> (null = monogram).
   * Returns the <img> once decoded, else null. The render loop redraws every
   * frame so the logo appears as soon as it finishes loading. */
  KnowledgeGraph.prototype._logo = function (node) {
    if (!node.domain) return null;
    let e = this.logoCache[node.domain];
    if (e) return e.ok ? e.img : null;
    e = { img: new Image(), ok: false, fb: false };
    this.logoCache[node.domain] = e;
    e.img.onload = function () { if (e.img.naturalWidth > 0) e.ok = true; };
    e.img.onerror = function () {
      if (!e.fb) { e.fb = true; e.img.src = "https://icons.duckduckgo.com/ip3/" + node.domain + ".ico"; }
    };
    e.img.src = "https://www.google.com/s2/favicons?domain=" + node.domain + "&sz=128";
    return null;
  };

  function monogram(label) {
    return label.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean)
      .slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase() || "•";
  }

  /* tiny colour helpers */
  function hexA(hex, a) {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16), g = parseInt(c.substring(2, 4), 16), b = parseInt(c.substring(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }
  function lighten(hex) {
    const c = hex.replace("#", "");
    let r = parseInt(c.substring(0, 2), 16), g = parseInt(c.substring(2, 4), 16), b = parseInt(c.substring(4, 6), 16);
    r = Math.min(255, r + 60); g = Math.min(255, g + 60); b = Math.min(255, b + 60);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  global.KnowledgeGraph = KnowledgeGraph;
})(window);
