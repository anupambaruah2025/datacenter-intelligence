/**
 * data.js — Knowledge graph + lifecycle dataset for the
 * Data Center Market Intelligence Platform.
 *
 * Populated from industry research: every discipline drills down through
 * real sub-systems to named market-leading vendors. Each company node
 * carries a `domain` used to resolve its logo at render time.
 *
 * Portable, framework-free module → maps 1:1 to `lib/data.ts` in the
 * future Next.js migration. Pure data, no DOM, no side effects.
 */
(function (global) {
  "use strict";

  /* ----------------------------------------------------------------------
   * GROUPS — visual identity per node family.
   * -------------------------------------------------------------------- */
  const GROUPS = {
    core:        { color: "#e2e8f0", glow: "#a5b4fc", label: "Core" },
    electrical:  { color: "#38bdf8", glow: "#0ea5e9", label: "Electrical" },
    mechanical:  { color: "#22d3ee", glow: "#06b6d4", label: "Mechanical / Cooling" },
    civil:       { color: "#f59e0b", glow: "#d97706", label: "Civil / Structural" },
    ict:         { color: "#a855f7", glow: "#9333ea", label: "ICT / Networking" },
    fire:        { color: "#ef4444", glow: "#dc2626", label: "Fire & Life Safety" },
    security:    { color: "#f43f5e", glow: "#e11d48", label: "Security" },
    automation:  { color: "#34d399", glow: "#10b981", label: "Automation / BMS" },
    ops:         { color: "#60a5fa", glow: "#3b82f6", label: "Operations" },
    finance:     { color: "#4ade80", glow: "#22c55e", label: "Finance" },
    legal:       { color: "#fbbf24", glow: "#f59e0b", label: "Legal / Authorities" },
    sustain:     { color: "#2dd4bf", glow: "#14b8a6", label: "Sustainability" },
    supplier:    { color: "#c084fc", glow: "#a855f7", label: "Supply Chain" }
  };

  /* ----------------------------------------------------------------------
   * Factory helpers — keep the tree compact & readable.
   * co()  -> company / supplier node (carries logo domain + segment)
   * sys() -> system / subsystem node
   * -------------------------------------------------------------------- */
  let _uid = 0;
  function co(label, domain, summary, segment) {
    return {
      id: "co-" + (++_uid),
      label: label, group: "supplier", domain: domain, summary: summary,
      metrics: segment ? [{ label: "Segment", value: segment }] : []
    };
  }
  function sys(id, label, group, summary, children, metrics) {
    return { id: id, label: label, group: group, summary: summary, metrics: metrics || [], children: children || [] };
  }

  /* ----------------------------------------------------------------------
   * LIFECYCLE — the 13 stages rendered in the cinematic hero flow.
   * -------------------------------------------------------------------- */
  const LIFECYCLE = [
    { id: "lc-feasibility",  label: "Feasibility",     group: "finance",    summary: "Market study, site selection scoring, capacity demand modelling and go/no-go investment thesis.", linkTo: "finance" },
    { id: "lc-land",         label: "Land",            group: "legal",      summary: "Acquisition, due diligence, zoning, power & water availability and grid proximity analysis.", linkTo: "legal" },
    { id: "lc-finance",      label: "Finance",         group: "finance",    summary: "Capex/opex modelling, debt structuring, PPA negotiation and IRR sensitivity.", linkTo: "finance" },
    { id: "lc-design",       label: "Design",          group: "ict",        summary: "Concept → schematic → detailed design across all disciplines, Tier topology and redundancy.", linkTo: "civil" },
    { id: "lc-authorities",  label: "Authorities",     group: "legal",      summary: "Permits, environmental clearance, utility interconnection and building approvals.", linkTo: "legal" },
    { id: "lc-procurement",  label: "Procurement",     group: "supplier",   summary: "Long-lead equipment, vendor qualification, supply-chain de-risking and logistics.", linkTo: "electrical" },
    { id: "lc-construction", label: "Construction",    group: "civil",      summary: "Civil works, MEP installation, modular prefab integration and QA/QC on site.", linkTo: "civil" },
    { id: "lc-testing",      label: "Testing",         group: "automation", summary: "Factory & site acceptance testing, IST, point-to-point and functional verification.", linkTo: "automation" },
    { id: "lc-commissioning",label: "Commissioning",   group: "mechanical", summary: "Levels 1–5 Cx, integrated systems test under simulated full IT load.", linkTo: "mechanical" },
    { id: "lc-operations",   label: "Operations",      group: "ops",        summary: "24/7 NOC, maintenance regimes, SLA management, capacity & energy optimisation.", linkTo: "ops" },
    { id: "lc-expansion",    label: "Expansion",       group: "core",       summary: "Phased build-out, brownfield upgrades, density increase and AI/HPC retrofits.", linkTo: "dc" },
    { id: "lc-decommission", label: "Decommissioning", group: "sustain",    summary: "Asset recovery, secure data destruction, circular reuse and site remediation.", linkTo: "sustain" }
  ];

  /* ----------------------------------------------------------------------
   * GRAPH — hierarchical knowledge graph. Center = DATA CENTER.
   * -------------------------------------------------------------------- */
  const GRAPH = {
    id: "dc",
    label: "Data Center",
    group: "core",
    summary: "The complete digital infrastructure ecosystem — every discipline, system and supplier connected. Drill any branch from facility down to the vendors that build it.",
    metrics: [
      { label: "Disciplines", value: "11" },
      { label: "Global Market", value: "$418B" },
      { label: "CAGR", value: "11.2%" }
    ],
    children: [

      /* ============================ ELECTRICAL ============================ */
      sys("electrical", "Electrical", "electrical",
        "Power chain from utility intake to the rack PDU — the most capital-intensive system in the facility.",
        [
          sys("ups", "UPS System", "electrical",
            "Uninterruptible power supply bridging utility loss to generator start — the heartbeat of availability.",
            [
              sys("battery", "Battery Energy Storage", "electrical",
                "Energy storage holding the critical bus during the transfer window.",
                [
                  sys("lithium", "Lithium-ion", "electrical",
                    "LFP chemistry now dominates new builds — smaller footprint, longer life, higher temp tolerance vs VRLA.",
                    [
                      co("Samsung SDI", "samsungsdi.com", "Tier-1 lithium cell manufacturer supplying ESS modules.", "Li-ion cells"),
                      co("LG Energy Solution", "lgensol.com", "Global cell maker with data-center ESS portfolio.", "Li-ion cells"),
                      co("CATL", "catl.com", "World's largest battery cell producer; LFP ESS racks.", "Li-ion cells"),
                      co("Saft", "saftbatteries.com", "TotalEnergies subsidiary; industrial Li-ion systems.", "Li-ion systems"),
                      co("Narada", "naradapower.com", "Backup power & lithium ESS for data centers.", "Li-ion ESS")
                    ]),
                  sys("vrla", "VRLA", "electrical", "Valve-regulated lead-acid — legacy low-capex option, shorter life and larger footprint.",
                    [
                      co("EnerSys", "enersys.com", "Leading stored-energy / lead-acid battery maker.", "Lead-acid"),
                      co("C&D Technologies", "cdtechno.com", "VRLA standby battery systems.", "Lead-acid"),
                      co("Exide", "exidegroup.com", "Industrial standby battery manufacturer.", "Lead-acid")
                    ])
                ]),
              sys("static-switch", "Static Transfer Switch", "electrical", "Sub-cycle transfer between sources without break to the critical load.",
                [
                  co("ASCO Power", "ascopower.com", "Transfer switch & critical power specialist.", "STS / ATS"),
                  co("Russelectric", "russelectric.com", "Power control & transfer switch systems.", "STS / switchgear"),
                  co("Cyberex", "cyberex.com", "Static transfer switches & RPPs.", "STS / RPP")
                ]),
              co("Vertiv", "vertiv.com", "Tier-1 critical power OEM — UPS, lithium cabinets, integrated power modules.", "UPS OEM"),
              co("Eaton", "eaton.com", "Global electrical OEM; 93PM / 9395X lithium-ready UPS line.", "UPS OEM"),
              co("Schneider Electric", "se.com", "Galaxy VXL UPS + EcoStruxure power architecture.", "UPS OEM"),
              co("ABB", "abb.com", "MegaFlex / DPA UPS and power protection.", "UPS OEM"),
              co("Huawei", "huawei.com", "Modular UPS5000 & PowerPOD prefabricated power.", "UPS OEM"),
              co("Mitsubishi Electric", "mitsubishielectric.com", "High-efficiency 9900 series UPS.", "UPS OEM")
            ]),
          sys("genset", "Generators", "electrical",
            "Standby diesel / HVO gensets providing prime backup beyond battery autonomy.",
            [
              co("Caterpillar", "cat.com", "Market-leading data-center genset packages up to 3.5 MVA.", "Gensets"),
              co("Cummins", "cummins.com", "HSK / QSK series gensets; hydrogen-ready roadmap.", "Gensets"),
              co("Rolls-Royce mtu", "mtu-solutions.com", "High-power gensets & integrated power systems.", "Gensets"),
              co("Kohler", "kohlerpower.com", "Industrial standby generators & switchgear.", "Gensets"),
              co("Generac", "generac.com", "Large-format industrial gensets.", "Gensets"),
              co("Aggreko", "aggreko.com", "Temporary & rental power for builds and bridging.", "Rental power")
            ]),
          sys("switchgear", "Switchgear & Distribution", "electrical",
            "MV/LV switchgear, transformers, busway and PDUs distributing power to white space.",
            [
              sys("transformers", "Transformers", "electrical", "Step-down from grid MV to facility LV.",
                [
                  co("ABB", "abb.com", "Distribution & dry-type transformers.", "Transformers"),
                  co("Siemens", "siemens.com", "GEAFOL cast-resin transformers.", "Transformers"),
                  co("Hitachi Energy", "hitachienergy.com", "Power & distribution transformers.", "Transformers"),
                  co("GE Vernova", "gevernova.com", "Grid transformers & substations.", "Transformers")
                ]),
              sys("busway", "Busway", "electrical", "Overhead track busbar for flexible, dense rack power delivery.",
                [
                  co("Legrand Starline", "legrand.com", "Track busway — the data-center standard.", "Busway"),
                  co("Universal Electric", "uecorp.com", "Starline overhead busway systems.", "Busway"),
                  co("Schneider Electric", "se.com", "Canalis / I-Line busway.", "Busway")
                ]),
              sys("pdu", "PDU / RPP", "electrical", "Remote power panels and rack PDUs with branch-circuit metering.",
                [
                  co("Vertiv", "vertiv.com", "Geist & MPH2 rack PDUs.", "Rack PDU"),
                  co("Legrand", "legrand.com", "Raritan & Server Technology PDUs.", "Rack PDU"),
                  co("Raritan", "raritan.com", "Intelligent metered rack PDUs.", "Rack PDU"),
                  co("Server Technology", "servertech.com", "HDOT switched PDUs.", "Rack PDU"),
                  co("CyberPower", "cyberpowersystems.com", "Metered & switched PDUs.", "Rack PDU")
                ]),
              co("Siemens", "siemens.com", "MV/LV switchgear & SIVACON distribution.", "Switchgear"),
              co("Eaton", "eaton.com", "Magnum / xEnergy switchgear & busway.", "Switchgear"),
              co("Schneider Electric", "se.com", "PremSet & Blokset switchgear.", "Switchgear")
            ])
        ],
        [{ label: "% of Capex", value: "~43%" }, { label: "Typical Tier", value: "III / IV" }]),

      /* ============================ COOLING ============================ */
      sys("cooling", "Cooling", "mechanical",
        "Heat-rejection chain. As rack densities climb past 50 kW, liquid cooling is overtaking air.",
        [
          sys("liquid", "Liquid Cooling", "mechanical",
            "Direct-to-chip and immersion for AI / HPC densities of 100+ kW per rack.",
            [
              sys("d2c", "Direct-to-Chip", "mechanical", "Cold plates on CPU/GPU; warm-water loops to CDUs.",
                [
                  co("CoolIT Systems", "coolitsystems.com", "Coldplate + CDU specialist scaling for hyperscale AI.", "Coldplate / CDU"),
                  co("Motivair", "motivaircorp.com", "High-density CDUs & coolant distribution (Schneider).", "CDU / coldplate"),
                  co("Boyd", "boydcorp.com", "Liquid cold plates & thermal systems.", "Coldplate"),
                  co("Asetek", "asetek.com", "Direct-to-chip liquid cooling.", "Coldplate"),
                  co("JetCool", "jetcool.com", "Microconvective direct-liquid cooling.", "Coldplate")
                ]),
              sys("immersion", "Immersion", "mechanical", "Single/two-phase dielectric tanks — highest density, lowest PUE potential.",
                [
                  co("GRC", "grcooling.com", "Green Revolution Cooling — single-phase immersion.", "Immersion"),
                  co("Submer", "submer.com", "SmartPod immersion cooling.", "Immersion"),
                  co("LiquidStack", "liquidstack.com", "Two-phase & single-phase immersion.", "Immersion"),
                  co("Iceotope", "iceotope.com", "Precision chassis-level immersion.", "Immersion")
                ]),
              sys("cdu", "Coolant Distribution (CDU)", "mechanical", "Isolates the technology cooling loop from facility water.",
                [
                  co("CoolIT Systems", "coolitsystems.com", "Rack & row CDUs.", "CDU"),
                  co("Motivair", "motivaircorp.com", "High-capacity CDUs.", "CDU"),
                  co("nVent", "nvent.com", "Liquid cooling CDUs & manifolds.", "CDU / manifold"),
                  co("Vertiv", "vertiv.com", "XDU coolant distribution units.", "CDU")
                ])
            ]),
          sys("air", "Air Cooling", "mechanical",
            "CRAC/CRAH + containment — still the volume workhorse below 30 kW/rack.",
            [
              sys("crah", "CRAH / CRAC", "mechanical", "Computer-room air handlers/conditioners with EC fans.",
                [
                  co("Vertiv", "vertiv.com", "Liebert precision cooling.", "CRAH / CRAC"),
                  co("STULZ", "stulz.com", "Precision air conditioning specialist.", "CRAH / CRAC"),
                  co("Schneider Electric", "se.com", "APC / Uniflair room cooling.", "CRAH / CRAC"),
                  co("Munters", "munters.com", "Evaporative & air handling.", "Air handling")
                ]),
              sys("chiller", "Chillers", "mechanical", "Air/water-cooled chillers, often with free-cooling economisers.",
                [
                  co("Trane", "trane.com", "High-efficiency centrifugal & screw chillers.", "Chillers"),
                  co("Carrier", "carrier.com", "AquaEdge chillers with free-cooling.", "Chillers"),
                  co("Daikin", "daikin.com", "Applied chillers & air handling.", "Chillers"),
                  co("Johnson Controls", "johnsoncontrols.com", "YORK chillers & thermal systems.", "Chillers")
                ]),
              sys("heatreject", "Heat Rejection", "mechanical", "Cooling towers, dry coolers & condensers rejecting heat to ambient.",
                [
                  co("Evapco", "evapco.com", "Cooling towers & evaporative equipment.", "Cooling towers"),
                  co("Baltimore Aircoil", "baltimoreaircoil.com", "BAC cooling towers & closed circuit coolers.", "Cooling towers"),
                  co("SPX Cooling", "spxcooling.com", "Marley cooling towers.", "Cooling towers")
                ])
            ])
        ],
        [{ label: "% of facility energy", value: "30–40%" }, { label: "Trend", value: "Liquid ↑" }]),

      /* ============================ ICT ============================ */
      sys("ict", "ICT & Networking", "ict",
        "The IT payload the facility exists to serve — compute, storage, fabric and structured cabling.",
        [
          sys("compute", "Compute / AI", "ict", "GPU & CPU server fleets — the AI build-out driving the current super-cycle.",
            [
              co("NVIDIA", "nvidia.com", "GB200 / Blackwell racks defining modern AI data-hall design.", "AI compute"),
              co("AMD", "amd.com", "EPYC CPUs & Instinct MI accelerators.", "CPU / GPU"),
              co("Intel", "intel.com", "Xeon CPUs & Gaudi AI accelerators.", "CPU / AI"),
              co("Dell Technologies", "dell.com", "PowerEdge AI factory rack-scale systems.", "Servers"),
              co("HPE", "hpe.com", "ProLiant & Cray AI servers.", "Servers"),
              co("Supermicro", "supermicro.com", "Liquid-cooled AI rack-scale systems.", "Servers"),
              co("Lenovo", "lenovo.com", "ThinkSystem Neptune liquid-cooled servers.", "Servers")
            ]),
          sys("network", "Network Fabric", "ict", "Spine-leaf switching, 400/800G optics and DCI interconnect.",
            [
              co("Cisco", "cisco.com", "Nexus switching & Silicon One.", "Switching"),
              co("Arista", "arista.com", "Cloud-scale spine-leaf switching.", "Switching"),
              co("Juniper", "juniper.net", "QFX/PTX fabric & AI-native networking.", "Switching"),
              co("NVIDIA Networking", "nvidia.com", "Spectrum-X & Quantum InfiniBand.", "AI fabric"),
              co("Broadcom", "broadcom.com", "Tomahawk / Jericho switch silicon & optics.", "Silicon / optics"),
              co("Nokia", "nokia.com", "Data-center fabric & SR Linux.", "Switching")
            ]),
          sys("cabling", "Structured Cabling", "ict", "Fibre & copper backbone, pathways and connectivity to meet-me rooms.",
            [
              co("CommScope", "commscope.com", "Fibre & copper structured cabling systems.", "Cabling"),
              co("Corning", "corning.com", "Optical fibre & connectivity.", "Fibre"),
              co("Panduit", "panduit.com", "Cabling, pathways & connectivity.", "Cabling"),
              co("Belden", "belden.com", "High-performance cabling & connectivity.", "Cabling")
            ]),
          sys("storage", "Storage", "ict", "Primary, backup and AI data-lake storage platforms.",
            [
              co("Dell Technologies", "dell.com", "PowerStore / PowerScale storage.", "Storage"),
              co("NetApp", "netapp.com", "ONTAP all-flash & AI data storage.", "Storage"),
              co("Pure Storage", "purestorage.com", "All-flash FlashArray / FlashBlade.", "Storage"),
              co("IBM", "ibm.com", "FlashSystem & Storage Scale.", "Storage")
            ])
        ],
        [{ label: "Refresh cycle", value: "3–5 yr" }]),

      /* ============================ CIVIL ============================ */
      sys("civil", "Civil & Structural", "civil",
        "Shell & core, foundations, slabs, modular prefab and the EPC/design teams that deliver them.",
        [
          sys("gc", "General Contractors / EPC", "civil", "Self-perform and management contractors delivering the build.",
            [
              co("Turner Construction", "turnerconstruction.com", "Major mission-critical GC.", "GC / EPC"),
              co("DPR Construction", "dpr.com", "Leading mission-critical builder.", "GC / EPC"),
              co("Holder Construction", "holderconstruction.com", "Hyperscale data-center GC.", "GC / EPC"),
              co("Mortenson", "mortenson.com", "Data-center & energy construction.", "GC / EPC"),
              co("Mercury", "mercuryeng.com", "European hyperscale engineering contractor.", "M&E EPC"),
              co("Fluor", "fluor.com", "Global EPC for large programmes.", "EPC")
            ]),
          sys("modular", "Modular / Prefab", "civil", "Factory-built skids & pods compressing the construction schedule.",
            [
              co("Vertiv", "vertiv.com", "Prefabricated modular power & cooling.", "Modular"),
              co("Schneider Electric", "se.com", "EcoStruxure prefabricated modules.", "Modular"),
              co("Compass Datacenters", "compassdatacenters.com", "Prefab data-center components.", "Modular"),
              co("Huawei", "huawei.com", "Prefabricated all-in-one data centers.", "Modular"),
              co("BladeRoom", "bladeroom.com", "Modular data-center systems.", "Modular")
            ]),
          sys("design", "Design & Engineering", "civil", "MEP and structural consultants setting the topology.",
            [
              co("Arup", "arup.com", "Global multidisciplinary engineering.", "Design / MEP"),
              co("AECOM", "aecom.com", "Infrastructure design & programme.", "Design / EPC"),
              co("Jacobs", "jacobs.com", "Critical facilities engineering.", "Design"),
              co("HDR", "hdrinc.com", "Mission-critical architecture & MEP.", "Design"),
              co("Burns & McDonnell", "burnsmcd.com", "EPC & critical facilities design.", "Design / EPC"),
              co("Syska Hennessy", "syska.com", "Data-center MEP specialist.", "MEP design")
            ]),
          sys("rfloor", "Raised Floor & Structure", "civil", "Access flooring, cladding and structural systems.",
            [
              co("Tate", "tateinc.com", "Access floors & airflow management.", "Raised floor"),
              co("Kingspan", "kingspan.com", "Raised access floors & envelope.", "Raised floor / envelope"),
              co("Lindner", "lindner-group.com", "Access flooring & interior systems.", "Raised floor")
            ])
        ]),

      /* ============================ FIRE ============================ */
      sys("fire", "Fire & Life Safety", "fire",
        "Detection, suppression and compartmentation protecting people and uptime.",
        [
          sys("detection", "Detection", "fire", "Very-early aspirating smoke detection sampling the air stream.",
            [
              co("Honeywell", "honeywell.com", "Xtralis VESDA aspirating detection.", "Detection"),
              co("Siemens", "siemens.com", "Sinteso fire detection.", "Detection"),
              co("Bosch", "bosch.com", "Aspirating & point detection.", "Detection"),
              co("Johnson Controls", "johnsoncontrols.com", "Autocall / Simplex detection.", "Detection")
            ]),
          sys("suppression", "Suppression", "fire", "Inert gas / clean-agent and pre-action sprinkler systems.",
            [
              co("Fike", "fike.com", "Clean-agent & inert gas suppression.", "Suppression"),
              co("Victaulic", "victaulic.com", "Fire protection piping & valves.", "Piping / valves"),
              co("Minimax", "minimax.com", "Industrial fire suppression.", "Suppression"),
              co("Marioff", "marioff.com", "HI-FOG water mist suppression.", "Water mist"),
              co("Kidde", "kidde.com", "Clean-agent suppression systems.", "Suppression")
            ]),
          sys("sprinkler", "Sprinkler / Pre-action", "fire", "Double-interlock pre-action protecting the white space.",
            [
              co("Viking", "vikinggroupinc.com", "Sprinkler & pre-action systems.", "Sprinkler"),
              co("Tyco", "johnsoncontrols.com", "TYCO sprinkler & fire products (JCI).", "Sprinkler"),
              co("Reliable", "reliablesprinkler.com", "Fire sprinkler manufacturer.", "Sprinkler")
            ])
        ]),

      /* ============================ SECURITY ============================ */
      sys("security", "Security", "security",
        "Layered physical security — perimeter to cabinet — plus operational resilience.",
        [
          sys("access", "Access Control", "security", "Multi-factor mantraps, biometrics and anti-tailgating.",
            [
              co("HID Global", "hidglobal.com", "Readers, credentials & identity.", "Access control"),
              co("Genetec", "genetec.com", "Unified Security Center platform.", "Access / VMS"),
              co("LenelS2", "lenels2.com", "OnGuard access control (Carrier).", "Access control"),
              co("Gallagher", "gallagher.com", "High-security access & perimeter.", "Access / perimeter"),
              co("Suprema", "supremainc.com", "Biometric access control.", "Biometrics")
            ]),
          sys("cctv", "Surveillance", "security", "AI-analytics CCTV with full audit retention.",
            [
              co("Axis", "axis.com", "Network surveillance cameras.", "Surveillance"),
              co("Hanwha Vision", "hanwhavision.com", "AI surveillance cameras & VMS.", "Surveillance"),
              co("Bosch", "bosch.com", "Video systems & analytics.", "Surveillance"),
              co("Avigilon", "avigilon.com", "AI video security (Motorola).", "Surveillance"),
              co("Milestone", "milestonesys.com", "XProtect video management.", "VMS")
            ]),
          sys("perimeter", "Perimeter Detection", "security", "Fence, buried and microwave intrusion detection.",
            [
              co("Senstar", "senstar.com", "Perimeter intrusion detection.", "Perimeter"),
              co("Southwest Microwave", "southwestmicrowave.com", "Microwave & buried-cable detection.", "Perimeter")
            ])
        ]),

      /* ============================ AUTOMATION ============================ */
      sys("automation", "Automation & BMS", "automation",
        "BMS, DCIM and EPMS — the nervous system tying every asset into one operational view.",
        [
          sys("dcim", "DCIM", "automation", "Asset, capacity, power & thermal management software.",
            [
              co("Schneider Electric", "se.com", "EcoStruxure IT DCIM.", "DCIM"),
              co("Vertiv", "vertiv.com", "Environet / Trellis DCIM.", "DCIM"),
              co("Nlyte", "nlyte.com", "DCIM & asset lifecycle.", "DCIM"),
              co("Sunbird", "sunbirddcim.com", "DCIM monitoring & operations.", "DCIM"),
              co("Hyperview", "hyperviewhq.com", "Cloud-native DCIM.", "DCIM")
            ]),
          sys("bms", "BMS / EPMS", "automation", "Building and electrical power monitoring & control.",
            [
              co("Schneider Electric", "se.com", "EcoStruxure Building & Power.", "BMS / EPMS"),
              co("Siemens", "siemens.com", "Desigo BMS.", "BMS"),
              co("Honeywell", "honeywell.com", "Building management systems.", "BMS"),
              co("Johnson Controls", "johnsoncontrols.com", "Metasys BMS.", "BMS"),
              co("ABB", "abb.com", "Power & automation control.", "EPMS")
            ]),
          sys("powermon", "Power Monitoring", "automation", "Branch-level metering and power quality analytics.",
            [
              co("Schneider Electric", "se.com", "PowerLogic metering.", "Power monitoring"),
              co("Eaton", "eaton.com", "Power Xpert monitoring.", "Power monitoring"),
              co("ABB", "abb.com", "Power quality & metering.", "Power monitoring")
            ])
        ]),

      /* ============================ OPERATIONS ============================ */
      sys("ops", "Operations", "ops",
        "Running the asset: 24/7 monitoring, maintenance, SLAs and continuous optimisation.",
        [
          sys("operators", "Colocation Operators", "ops", "Owner-operators running facilities at scale.",
            [
              co("Equinix", "equinix.com", "Global interconnection & colocation leader.", "Colo operator"),
              co("Digital Realty", "digitalrealty.com", "Global data-center REIT.", "Colo operator"),
              co("NTT", "ntt.com", "Global data-center services.", "Colo operator"),
              co("Vantage", "vantage-dc.com", "Hyperscale campus developer-operator.", "Colo operator"),
              co("CyrusOne", "cyrusone.com", "Enterprise & hyperscale colocation.", "Colo operator")
            ]),
          sys("fm", "Facility Management", "ops", "Critical facilities O&M and managed services.",
            [
              co("CBRE", "cbre.com", "Data-center facilities management.", "FM / O&M"),
              co("JLL", "jll.com", "Critical environments management.", "FM / O&M"),
              co("Cushman & Wakefield", "cushmanwakefield.com", "Data-center FM services.", "FM / O&M"),
              co("Salute", "salutemc.com", "Mission-critical operations services.", "O&M"),
              co("ABM", "abm.com", "Technical & facility services.", "FM")
            ])
        ]),

      /* ============================ FINANCE ============================ */
      sys("finance", "Finance", "finance",
        "Capital structure, returns and the commercial engine of the project.",
        [
          sys("capital", "Capital Providers", "finance", "Equity, debt and infrastructure funds behind builds.",
            [
              co("Blackstone", "blackstone.com", "Largest data-center investor (QTS, AirTrunk).", "Infra capital"),
              co("Brookfield", "brookfield.com", "Infrastructure & digital investment.", "Infra capital"),
              co("KKR", "kkr.com", "Digital infrastructure investment.", "Infra capital"),
              co("DigitalBridge", "digitalbridge.com", "Digital infrastructure specialist.", "Infra capital"),
              co("GI Partners", "gipartners.com", "Data-center & digital infra investing.", "Infra capital")
            ]),
          sys("cost", "Cost Consultants", "finance", "Benchmarking, cost management and QS for capex control.",
            [
              co("Turner & Townsend", "turnerandtownsend.com", "Programme & cost management.", "Cost / QS"),
              co("Linesight", "linesight.com", "Data-center cost management.", "Cost / QS"),
              co("CBRE", "cbre.com", "Project & cost advisory.", "Advisory"),
              co("Cushman & Wakefield", "cushmanwakefield.com", "Project & development services.", "Advisory")
            ]),
          sys("ppa", "Power & PPA", "finance", "Power purchase agreements and energy cost strategy.",
            [
              co("Edison Energy", "edisonenergy.com", "Energy advisory & PPA structuring.", "Energy advisory"),
              co("LevelTen Energy", "leveltenenergy.com", "PPA marketplace & analytics.", "PPA marketplace"),
              co("NextEra Energy", "nexteraenergy.com", "Renewable PPA counterparty.", "Power offtake")
            ])
        ]),

      /* ============================ LEGAL ============================ */
      sys("legal", "Legal & Authorities", "legal",
        "Land, permits, contracts and regulatory compliance across jurisdictions.",
        [
          sys("land", "Land & Site Selection", "legal", "Site sourcing, due diligence and acquisition advisory.",
            [
              co("CBRE", "cbre.com", "Data-center site selection & advisory.", "Site selection"),
              co("JLL", "jll.com", "Data-center capital markets & site advisory.", "Site selection"),
              co("Cushman & Wakefield", "cushmanwakefield.com", "Site selection & advisory.", "Site selection"),
              co("Newmark", "newmark.com", "Data-center advisory & transactions.", "Advisory")
            ]),
          sys("permits", "Permits & Environmental", "legal", "Environmental clearance, impact assessment and approvals.",
            [
              co("ERM", "erm.com", "Environmental & permitting consultancy.", "Environmental"),
              co("WSP", "wsp.com", "Environmental & engineering consultancy.", "Environmental"),
              co("Ramboll", "ramboll.com", "Environment & infrastructure consultancy.", "Environmental"),
              co("AECOM", "aecom.com", "Environmental & permitting.", "Environmental")
            ]),
          sys("contracts", "Legal Advisors", "legal", "EPC, O&M, lease and regulatory counsel.",
            [
              co("DLA Piper", "dlapiper.com", "Global data-center legal practice.", "Legal"),
              co("Baker McKenzie", "bakermckenzie.com", "Cross-border infrastructure counsel.", "Legal"),
              co("Pinsent Masons", "pinsentmasons.com", "Construction & infrastructure law.", "Legal")
            ])
        ]),

      /* ============================ SUSTAINABILITY ============================ */
      sys("sustain", "Sustainability", "sustain",
        "PUE, WUE, carbon and circularity — now a board-level licence to operate.",
        [
          sys("renewable", "Renewable Energy", "sustain", "On/off-site renewables, RECs and 24/7 carbon-free matching.",
            [
              co("NextEra Energy", "nexteraenergy.com", "World's largest renewables generator.", "Renewables"),
              co("Ørsted", "orsted.com", "Offshore wind & green energy.", "Renewables"),
              co("Engie", "engie.com", "Renewables & energy services.", "Renewables"),
              co("Iberdrola", "iberdrola.com", "Global renewable energy.", "Renewables"),
              co("RWE", "rwe.com", "Renewables & power generation.", "Renewables")
            ]),
          sys("heatreuse", "Heat Reuse & District", "sustain", "Exporting waste heat to district networks and industry.",
            [
              co("Fortum", "fortum.com", "District heating & heat-reuse partner.", "District energy"),
              co("Vattenfall", "vattenfall.com", "Heat networks & clean energy.", "District energy"),
              co("Danfoss", "danfoss.com", "Heat recovery & energy efficiency.", "Heat recovery")
            ]),
          sys("certification", "Certification & Standards", "sustain", "Resilience, energy and environmental certification.",
            [
              co("Uptime Institute", "uptimeinstitute.com", "Tier certification & operational standards.", "Certification"),
              co("USGBC", "usgbc.org", "LEED green-building certification.", "Certification"),
              co("BREEAM", "breeam.com", "Sustainability assessment method.", "Certification")
            ])
        ],
        [{ label: "Target PUE", value: "<1.25" }, { label: "Renewable", value: "100% goal" }])
    ]
  };

  /* ----------------------------------------------------------------------
   * Index { id -> node } + parent pointers for navigation, breadcrumbs, search.
   * -------------------------------------------------------------------- */
  const INDEX = {};
  (function buildIndex(node, parent) {
    node.parent = parent ? parent.id : null;
    node.metrics = node.metrics || [];
    node.children = node.children || [];
    INDEX[node.id] = node;
    node.children.forEach(function (c) { buildIndex(c, node); });
  })(GRAPH, null);

  function path(id) {
    const out = [];
    let n = INDEX[id];
    while (n) { out.unshift(n); n = n.parent ? INDEX[n.parent] : null; }
    return out;
  }

  const FLAT = Object.keys(INDEX).map(function (k) { return INDEX[k]; });

  global.DCI_DATA = {
    GROUPS: GROUPS,
    LIFECYCLE: LIFECYCLE,
    GRAPH: GRAPH,
    INDEX: INDEX,
    FLAT: FLAT,
    path: path
  };
})(window);
