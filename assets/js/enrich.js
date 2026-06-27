/**
 * enrich.js — researched company facts, keyed by domain.
 *
 * Sourced from primary filings / investor releases (FY2025–FY2026, current
 * as of mid-2026). Each entry: { founded, hq, employees, revenue, revenueFY,
 * extra, source, sourceLabel }. Fields are optional — the profile renders
 * only what's present. Extend this map to enrich more companies over time.
 *
 * Figures are point-in-time and carry their fiscal year. No estimates are
 * stored: a field is omitted rather than guessed.
 */
(function (global) {
  "use strict";

  const ENRICH = {
    "se.com": {
      founded: 1836, hq: "Rueil-Malmaison, France", employees: "~160,000",
      revenue: "€40.2B", revenueFY: "FY2025",
      source: "https://www.se.com/ww/en/assets/564/document/528237/release-fy-results-2025.pdf",
      sourceLabel: "Schneider Electric FY2025 results"
    },
    "vertiv.com": {
      founded: 2016, hq: "Westerville, Ohio, USA", employees: "~35,000",
      revenue: "$10.2B", revenueFY: "FY2025",
      source: "https://investors.vertiv.com/",
      sourceLabel: "Vertiv FY2025 Q4 results"
    },
    "eaton.com": {
      founded: 1911, hq: "Dublin, Ireland", employees: "~97,000",
      revenue: "$27.4B", revenueFY: "FY2025",
      source: "https://www.eaton.com/us/en-us/company/news-insights.html",
      sourceLabel: "Eaton FY2025 annual report"
    },
    "nvidia.com": {
      founded: 1993, hq: "Santa Clara, California, USA",
      revenue: "$215.9B", revenueFY: "FY2026",
      source: "https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026",
      sourceLabel: "NVIDIA FY2026 results"
    },
    "abb.com": {
      founded: 1988, hq: "Zürich, Switzerland", employees: "~110,000",
      revenue: "$33.2B", revenueFY: "FY2025",
      source: "https://new.abb.com/news/detail/132985/q4-2025-results",
      sourceLabel: "ABB Q4 / FY2025 results"
    },
    "siemens.com": {
      founded: 1847, hq: "Munich, Germany", employees: "~318,000",
      revenue: "€78.9B", revenueFY: "FY2025",
      source: "https://press.siemens.com/global/en/pressrelease/earnings-release-and-financial-results-q4-fy-2025",
      sourceLabel: "Siemens FY2025 results"
    },
    "cat.com": {
      founded: 1925, hq: "Irving, Texas, USA", employees: "~118,000",
      revenue: "$67.6B", revenueFY: "FY2025",
      source: "https://www.caterpillar.com/en/news/corporate-press-releases/h/4q25-results-caterpillar-inc.html",
      sourceLabel: "Caterpillar FY2025 results"
    },
    "cummins.com": {
      founded: 1919, hq: "Columbus, Indiana, USA", employees: "~70,000",
      revenue: "$33.7B", revenueFY: "FY2025",
      source: "https://investor.cummins.com/news/detail/689/cummins-reports-strong-fourth-quarter-and-full-year-2025",
      sourceLabel: "Cummins FY2025 results"
    },
    "equinix.com": {
      founded: 1998, hq: "Redwood City, California, USA", employees: "~14,000",
      revenue: "$9.22B", revenueFY: "FY2025", extra: "280 data centers · 77 metros",
      source: "https://investor.equinix.com/",
      sourceLabel: "Equinix 2025 annual report"
    },
    "digitalrealty.com": {
      founded: 2004, hq: "Dallas, Texas, USA", employees: "~4,300",
      revenue: "$6.11B", revenueFY: "FY2025",
      source: "https://investor.digitalrealty.com/news-releases/news-release-details/digital-realty-reports-fourth-quarter-2025-results",
      sourceLabel: "Digital Realty FY2025 results"
    },
    "dell.com": {
      founded: 1984, hq: "Round Rock, Texas, USA",
      revenue: "$95.6B", revenueFY: "FY2025",
      source: "https://investors.delltechnologies.com/",
      sourceLabel: "Dell Technologies FY2025 results"
    },
    "cisco.com": {
      founded: 1984, hq: "San Jose, California, USA", employees: "~85,000",
      revenue: "$56.7B", revenueFY: "FY2025",
      source: "https://investor.cisco.com/news/news-details/2025/CISCO-REPORTS-FOURTH-QUARTER-AND-FISCAL-YEAR-2025-EARNINGS/default.aspx",
      sourceLabel: "Cisco FY2025 results"
    },
    "trane.com": {
      founded: 1913, hq: "Swords, Ireland", employees: "~45,000",
      revenue: "$21.3B", revenueFY: "FY2025",
      source: "https://investors.tranetechnologies.com/",
      sourceLabel: "Trane Technologies FY2025 results"
    },
    "johnsoncontrols.com": {
      founded: 1885, hq: "Cork, Ireland", employees: "~87,000",
      revenue: "$23.6B", revenueFY: "FY2025",
      source: "https://www.prnewswire.com/news-releases/johnson-controls-reports-q4-and-fy25-results-initiates-fy26-guidance-302604936.html",
      sourceLabel: "Johnson Controls FY2025 results"
    }
  };

  global.DCI_ENRICH = ENRICH;
})(window);
