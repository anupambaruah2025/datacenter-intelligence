/**
 * profile.js — premium company profile overlay.
 *
 * Everything shown is derived from the existing knowledge-graph dataset —
 * no fabricated financials, employees or project names. A company recurs
 * across branches, so we aggregate every appearance to build:
 *   • where it operates (systems / disciplines)
 *   • peers & competitors (sibling vendors)
 *   • supply-chain position (graph paths)
 *
 * Wrapped as window.CompanyProfile.{open(node), close()}.
 * opts: { onNavigate(id) } — jump the graph to a node when a chip is clicked.
 */
(function (global) {
  "use strict";
  const D = global.DCI_DATA;

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

  function CompanyProfile(opts) {
    this.opts = opts || {};
    this.el = document.getElementById("profile");
    const self = this;
    this.el.addEventListener("click", function (e) {
      if (e.target === self.el || e.target.closest(".pclose")) self.close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && self.el.classList.contains("open")) self.close();
    });
  }

  /* Aggregate every appearance of this company (matched by domain, else id). */
  CompanyProfile.prototype._aggregate = function (node) {
    const appearances = node.domain
      ? D.FLAT.filter(function (n) { return n.group === "supplier" && n.domain === node.domain; })
      : [node];

    const systems = {};      // parent system id -> { node, discipline }
    const peers = {};        // domain -> peer node
    const disciplines = {};  // discipline id -> node

    appearances.forEach(function (ap) {
      const p = D.path(ap.id);
      const discipline = p[1];                 // top discipline under Data Center
      const parent = D.INDEX[ap.parent];       // immediate system
      if (parent) systems[parent.id] = { node: parent, discipline: discipline };
      if (discipline) disciplines[discipline.id] = discipline;
      // peers = sibling suppliers under same parent
      if (parent) parent.children.forEach(function (sib) {
        if (sib.group === "supplier" && sib.domain !== node.domain) {
          peers[sib.domain || sib.id] = sib;
        }
      });
    });

    return {
      appearances: appearances,
      systems: Object.keys(systems).map(function (k) { return systems[k]; }),
      disciplines: Object.keys(disciplines).map(function (k) { return disciplines[k]; }),
      peers: Object.keys(peers).map(function (k) { return peers[k]; })
    };
  };

  /* Build a radial ego-network: company at centre, surrounded by the
   * systems it supplies and its peers — all derived, all clickable. */
  CompanyProfile.prototype._ego = function (node, agg, g) {
    const items = [];
    agg.systems.slice(0, 5).forEach(function (s) {
      const dg = D.GROUPS[s.discipline ? s.discipline.group : node.group] || g;
      items.push({ id: s.node.id, label: s.node.label, kind: "system", color: dg.glow });
    });
    agg.peers.slice(0, 5).forEach(function (p) {
      items.push({ id: p.id, label: p.label, kind: "peer", node: p });
    });
    if (!items.length) return "";

    const K = items.length, rx = 39, ry = 36;
    let lines = "", nodes = "";
    items.forEach(function (it, i) {
      const a = (-90 + i * 360 / K) * Math.PI / 180;
      const x = 50 + rx * Math.cos(a), y = 50 + ry * Math.sin(a);
      const col = it.color || (D.GROUPS[it.node.group] || g).glow;
      lines += '<line x1="50" y1="50" x2="' + x.toFixed(2) + '" y2="' + y.toFixed(2) +
        '" stroke="' + col + '" stroke-opacity="0.4" stroke-width="1" vector-effect="non-scaling-stroke"></line>';
      const mark = it.kind === "peer"
        ? logoHTML(it.node, 30)
        : '<span class="dot2" style="color:' + col + '"></span>';
      nodes += '<div class="ego-node" data-id="' + it.id + '" style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%">' +
        '<span class="nd">' + mark + '</span><span class="el">' + it.label + '</span></div>';
    });

    return '<div class="ego">' +
      '<svg viewBox="0 0 100 100" preserveAspectRatio="none">' + lines + '</svg>' +
      '<div class="ego-center" style="left:50%;top:50%">' +
        '<span class="cc" style="--accent:' + g.glow + '">' + logoHTML(node, 60) + '</span>' +
        '<span class="el">' + node.label + '</span></div>' +
      nodes +
    '</div>';
  };

  /* Researched key-facts section (only renders if enrichment exists). */
  CompanyProfile.prototype._facts = function (node) {
    const E = global.DCI_ENRICH || {};
    const f = node.domain ? E[node.domain] : null;
    if (!f) return "";
    let cards = "";
    if (f.founded)   cards += '<div class="pfact"><div class="fv">' + f.founded + '</div><div class="fk">Founded</div></div>';
    if (f.hq)        cards += '<div class="pfact"><div class="fv">' + f.hq + '</div><div class="fk">Headquarters</div></div>';
    if (f.employees) cards += '<div class="pfact"><div class="fv">' + f.employees + '</div><div class="fk">Employees</div></div>';
    if (f.revenue)   cards += '<div class="pfact rev"><div class="fv">' + f.revenue + '</div><div class="fk">Revenue · ' + (f.revenueFY || "") + '</div></div>';
    if (f.extra)     cards += '<div class="pfact"><div class="fv">' + f.extra + '</div><div class="fk">Scale</div></div>';
    const src = f.source
      ? '<div class="psource">Source: <a href="' + f.source + '" target="_blank" rel="noopener">' + (f.sourceLabel || f.source) + ' ↗</a></div>'
      : "";
    return '<div class="profile-section"><h3>Key Facts <span class="verified">✓ Researched</span></h3>' +
      '<div class="pfacts">' + cards + '</div>' + src + '</div>';
  };

  CompanyProfile.prototype.open = function (node) {
    if (typeof node === "string") node = D.INDEX[node];
    if (!node) return;
    const g = D.GROUPS[node.group] || D.GROUPS.core;
    const agg = this._aggregate(node);
    const self = this;

    const seg = (node.metrics && node.metrics[0]) ? node.metrics[0].value : (g.label);

    // ----- systems chips -----
    const sysChips = agg.systems.map(function (s) {
      const dg = D.GROUPS[s.discipline ? s.discipline.group : node.group] || g;
      return '<span class="pchip" data-id="' + s.node.id + '">' +
        '<span class="dot" style="color:' + dg.glow + '"></span>' +
        s.node.label + ' <span class="sub">' + (s.discipline ? s.discipline.label : "") + '</span></span>';
    }).join("");

    // ----- discipline pills -----
    const discPills = agg.disciplines.map(function (d) {
      const dg = D.GROUPS[d.group] || g;
      return '<span class="pchip" data-id="' + d.id + '"><span class="dot" style="color:' + dg.glow + '"></span>' + d.label + '</span>';
    }).join("");

    // ----- peers -----
    const peerCards = agg.peers.slice(0, 12).map(function (p) {
      const pseg = (p.metrics && p.metrics[0]) ? p.metrics[0].value : "Vendor";
      return '<div class="ppeer" data-id="' + p.id + '">' + logoHTML(p, 30) +
        '<span class="pn">' + p.label + '<small>' + pseg + '</small></span></div>';
    }).join("");

    const html =
      '<div class="profile-card" style="--accent:' + g.glow + '">' +
        '<div class="pclose">✕</div>' +
        '<div class="profile-hero">' +
          logoHTML(node, 0) +
          '<div class="pmeta">' +
            '<div class="ptag">' + g.label + ' · Company Profile</div>' +
            '<h1>' + node.label + '</h1>' +
            '<div class="psub">' +
              '<span class="pill">' + seg + '</span>' +
              (node.domain ? '<a class="pill" href="https://' + node.domain + '" target="_blank" rel="noopener">' + node.domain + ' ↗</a>' : "") +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="profile-body">' +
          '<div class="profile-section"><h3>Overview</h3><p class="lead">' + (node.summary || "") + '</p></div>' +

          this._facts(node) +

          (this._ego(node, agg, g) ? '<div class="profile-section"><h3>Relationship Map</h3>' + this._ego(node, agg, g) + '</div>' : "") +

          '<div class="profile-section"><h3>Footprint</h3>' +
            '<div class="pstats">' +
              '<div class="pstat"><div class="v">' + agg.disciplines.length + '</div><div class="k">Disciplines active in</div></div>' +
              '<div class="pstat"><div class="v">' + agg.systems.length + '</div><div class="k">Systems supplied</div></div>' +
              '<div class="pstat"><div class="v">' + agg.peers.length + '</div><div class="k">Tracked competitors</div></div>' +
            '</div>' +
          '</div>' +

          (sysChips ? '<div class="profile-section"><h3>Supplies into <span class="count">' + agg.systems.length + '</span></h3><div class="pchips">' + sysChips + '</div></div>' : "") +

          (discPills ? '<div class="profile-section"><h3>Disciplines</h3><div class="pchips">' + discPills + '</div></div>' : "") +

          (peerCards ? '<div class="profile-section"><h3>Peers &amp; Competitors <span class="count">' + agg.peers.length + '</span></h3><div class="ppeers">' + peerCards + '</div></div>' : "") +

          '<div class="profile-section" style="opacity:.6"><h3>Note</h3><p class="lead" style="font-size:12.5px;color:var(--t-3)">' +
            ((global.DCI_ENRICH && node.domain && global.DCI_ENRICH[node.domain])
              ? 'Key facts researched from primary filings &amp; investor releases (FY2025–FY2026). Relationships derived from the platform knowledge graph. Named customer projects intentionally omitted.'
              : 'Profile generated from the platform knowledge graph (relationships, segment &amp; positioning). Detailed facts for this company are not yet researched; named projects are intentionally omitted.') +
          '</p></div>' +
        '</div>' +
      '</div>';

    this.el.innerHTML = html;
    // wire navigation chips
    this.el.querySelectorAll("[data-id]").forEach(function (el) {
      el.addEventListener("click", function () {
        const id = el.getAttribute("data-id");
        if (D.INDEX[id] && D.INDEX[id].group === "supplier") { self.open(id); }     // open peer profile
        else { self.close(); if (self.opts.onNavigate) self.opts.onNavigate(id); }  // jump graph to system/discipline
      });
    });
    this.el.classList.add("open");
    this.el.querySelector(".profile-card").scrollTop = 0;
  };

  CompanyProfile.prototype.close = function () { this.el.classList.remove("open"); };

  global.CompanyProfile = CompanyProfile;
})(window);
