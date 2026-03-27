import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

/* ─── types ─── */
interface Stats {
  total?: number;
  high_priority?: number;
  pending?: number;
  resolved?: number;
}

;

/* ─── city SVG for map preview ─── */
const CityGrid = () => (
  <svg style={{ position: "absolute", inset: 0, opacity: 0.15 }} viewBox="0 0 400 130" preserveAspectRatio="xMidYMid slice">
    {Array.from({ length: 13 }).map((_, c) =>
      Array.from({ length: 4 }).map((_, r) => (
        <rect key={`${c}-${r}`} x={c * 31 + 3} y={r * 30 + 5} width={24} height={22} rx={2}
          fill="#3730A3" opacity={(Math.sin(c * r + 1) + 1) * 0.4 + 0.1} />
      ))
    )}
    {[
      { cx: 80, cy: 65, r: 9, c: "#E8472A" },
      { cx: 195, cy: 45, r: 7, c: "#E8472A" },
      { cx: 310, cy: 85, r: 6, c: "#D97706" },
      { cx: 135, cy: 105, r: 8, c: "#E8472A" },
      { cx: 255, cy: 28, r: 5, c: "#0D9488" },
      { cx: 360, cy: 60, r: 6, c: "#0D9488" },
    ].map((p, i) => (
      <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.c} opacity={0.85} />
    ))}
  </svg>
);

/* ─── data ─── */
const FEED = [
  { dot: "#E8472A", title: "Pothole — FC Road, Shivajinagar", meta: "Infrastructure · High priority · 3 min ago", badge: "Urgent", bg: "#FEF0EC", fg: "#9A1E0D" },
  { dot: "#0D9488", title: "Streetlight fixed — Baner Road", meta: "Infrastructure · Resolved in 2h", badge: "Resolved", bg: "#F0FDFA", fg: "#0D6B62" },
  { dot: "#D97706", title: "Overflowing bin — Kothrud", meta: "Sanitation · Assigned · 18 min ago", badge: "Pending", bg: "#FFFBEB", fg: "#7C4D00" },
  { dot: "#3730A3", title: "Duplicate merged — Water leak #2847", meta: "Smart dedup · 31 min ago", badge: "Merged", bg: "#EEF2FF", fg: "#2D2589" },
  { dot: "#0D9488", title: "Pothole cluster resolved — Aundh", meta: "Infrastructure · Resolved in 6h", badge: "Resolved", bg: "#F0FDFA", fg: "#0D6B62" },
  { dot: "#D97706", title: "Damaged footpath — Camp", meta: "Infrastructure · Pending · 1h ago", badge: "Pending", bg: "#FFFBEB", fg: "#7C4D00" },
];

const FEATURES = [
  { emoji: "🤖", name: "AI classification", desc: "Our AI reads your complaint and instantly routes it to the right department.", bg: "#EEF2FF" },
  { emoji: "📍", name: "Live city map", desc: "Real-time heatmap of complaint hotspots across every Pune ward.", bg: "#F0FDFA" },
  { emoji: "🔍", name: "Duplicate detection", desc: "70% similarity threshold groups related issues — no spam, no double-work.", bg: "#F0FDF4" },
  { emoji: "🌐", name: "Hindi · Marathi · English", desc: "File in any language. AI translates before processing — zero language barrier.", bg: "#FFFBEB" },
  { emoji: "🎙️", name: "Voice & photo", desc: "Record audio or attach a photo. No typing required on mobile.", bg: "#FEF0EC" },
  { emoji: "🏆", name: "Rewards & leaderboard", desc: "Earn points every time you report. Climb the city-wide civic leaderboard.", bg: "#F5F3FF" },
];

/* ─── component ─── */
export default function Home() {
  const [stats, setStats] = useState<Stats>({});
  const [activeTab, setActiveTab] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    axios.get("http://localhost:5000/api/complaints/stats")
      .then(r => setStats(r.data.stats || {}))
      .catch(() => { });
  }, []);

  const STAT_COLORS = ["#3730A3", "#E8472A", "#D97706", "#0D9488"];

  return (
    <div>
      {/* ── NAV OVERRIDE (Already handled in App.tsx) ── */}

      {/* ── HERO ── */}
      <section className="cs-hero">
        {/* left */}
        <div className="cs-hero-left">
          <div className="cs-pill">
            <span className="cs-pill-dot" />
            AI-powered · Pune civic platform
          </div>
          <h1 className="cs-h1">
            Your city.<br />Your voice.<br /><em>Fixed faster.</em>
          </h1>
          <p className="cs-hero-sub">
            Spot a pothole, broken light, or garbage pile? Report it in 10 seconds
            using text, voice, or a photo — in Hindi, Marathi, or English.
            The AI classifies and routes it instantly.
          </p>
          <div className="cs-cta-row">
            {user?.role === "citizen" && (
              <Link to="/submit" className="cs-btn-primary">📝 Submit complaint</Link>
            )}
            <Link to="/dashboard" className="cs-btn-secondary">📊 Dashboard</Link>
            <Link to="/map" className="cs-btn-secondary">🗺️ Map</Link>
          </div>

          {/* stat strip */}
          <div className="cs-stats-strip">
            {[
              { label: "Total", val: stats.total },
              { label: "High priority", val: stats.high_priority },
              { label: "Pending", val: stats.pending },
              { label: "Resolved", val: stats.resolved },
            ].map((s, i) => (
              <div key={i} className="cs-stat">
                <div className="cs-stat-label">{s.label}</div>
                <div className="cs-stat-val" style={{ color: STAT_COLORS[i] }}>
                  {s.val ?? "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right panel */}
        <div className="cs-hero-right">
          <div className="cs-panel-header">
            <span className="cs-panel-title">Live activity feed</span>
            <span className="cs-live-badge">
              <span className="cs-live-dot" /> Live
            </span>
          </div>
          <div className="cs-cat-tabs">
            {["All", "Infrastructure", "Sanitation", "Safety"].map((t, i) => (
              <button key={t}
                className={`cs-cat-tab${activeTab === i ? " active" : ""}`}
                onClick={() => setActiveTab(i)}>
                {t}
              </button>
            ))}
          </div>
          <div className="cs-feed">
            {FEED.map((f, i) => (
              <div key={i} className="cs-feed-item">
                <div className="cs-feed-dot" style={{ background: f.dot }} />
                <div className="cs-feed-body">
                  <div className="cs-feed-title">{f.title}</div>
                  <div className="cs-feed-meta">{f.meta}</div>
                </div>
                <span className="cs-feed-badge"
                  style={{ background: f.bg, color: f.fg }}>
                  {f.badge}
                </span>
              </div>
            ))}
          </div>
          <div className="cs-map-prev">
            <CityGrid />
            <span className="cs-map-label">Pune heatmap</span>
            <Link to="/map" className="cs-map-link">Open full map →</Link>
          </div>
        </div>
      </section>

      {/* ── MAIN ── */}
      <div className="cs-main">

        {/* features */}
        <section className="cs-section">
          <div className="cs-eyebrow">Platform capabilities</div>
          <div className="cs-section-title">Built for every citizen</div>
          <div className="cs-section-sub">Simple enough for anyone. Powerful enough to run a city.</div>
          <div className="cs-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="cs-feat">
                <div className="cs-feat-icon" style={{ background: f.bg }}>{f.emoji}</div>
                <div className="cs-feat-name">{f.name}</div>
                <div className="cs-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* how it works */}
        <section className="cs-section">
          <div className="cs-eyebrow">How it works</div>
          <div className="cs-section-title">Three steps, zero friction</div>
          <div className="cs-hiw">
            {[
              { n: "I", title: "You report the issue", desc: "Text, voice recording, or a photo. Works in Hindi, Marathi, or English from any device." },
              { n: "II", title: "AI handles it instantly", desc: "Our AI model classifies, deduplicates, sets priority, and routes to the right municipal department." },
              { n: "III", title: "Track & earn rewards", desc: "Watch your complaint status update live. Earn reward points the moment it's resolved." },
            ].map((s, i) => (
              <div key={i} className="cs-hiw-step">
                <div className="cs-hiw-num">{s.n}</div>
                <div className="cs-hiw-title">{s.title}</div>
                <div className="cs-hiw-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section style={{ padding: "0 0 5rem" }}>
          <div className="cs-cta-band">
            <div>
              <div className="cs-cta-h">Make Pune work <em>better</em>.</div>
              <div className="cs-cta-p">Every complaint filed is a step toward a cleaner, safer city.</div>
            </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              {user?.role === "citizen" && (
                <Link to="/submit" className="cs-btn-white">📝 Report now</Link>
              )}
              <Link to="/dashboard" className="cs-btn-ghost-white">View dashboard</Link>
            </div>
          </div>
        </section>
      </div>

      {/* footer */}
      <div style={{ borderTop: "1px solid rgba(28,25,23,0.07)", padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto" }}>
        <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 600, fontSize: "0.95rem", color: "#1C1917" }}>CivicSense</span>
        <span style={{ fontSize: "0.75rem", color: "#78716C" }}>AI-powered civic platform · Pune Municipal Corporation</span>
      </div>

      {/* ── FLOATING DOCK (Already handled in App.tsx) ── */}
    </div>
  );
}