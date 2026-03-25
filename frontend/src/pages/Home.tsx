import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [stats, setStats] = useState<any>({});
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    axios.get("http://localhost:5000/api/complaints/stats")
      .then(r => setStats(r.data.stats || {}))
      .catch(() => {});
  }, []);

  const features = [
    { emoji: "🤖", title: "AI Classification", desc: "Gemini AI auto-classifies complaints into Sanitation, Infrastructure & Safety", color: "#667eea" },
    { emoji: "📍", title: "Map Analytics", desc: "Real-time heatmap showing complaint hotspots across Pune city", color: "#f59e0b" },
    { emoji: "🔍", title: "Duplicate Detection", desc: "Smart 70% similarity algorithm prevents spam and groups related issues", color: "#10b981" },
    { emoji: "🌐", title: "Multi-lingual", desc: "Submit complaints in English, Hindi or Marathi with AI translation", color: "#ef4444" },
    { emoji: "🎙️", title: "Voice & Image", desc: "Record audio complaints or upload photos as evidence", color: "#8b5cf6" },
    { emoji: "🏆", title: "Reward System", desc: "Earn points and badges for civic contributions and climb the leaderboard", color: "#ec4899" },
  ];

  return (
    <div style={{ color: "white", maxWidth: "1200px", margin: "0 auto" }}>

      {/* Hero Section */}
      <div style={{ textAlign: "center", padding: "4rem 2rem 3rem" }}>
        <div style={{
          display: "inline-block",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "50px",
          padding: "0.5rem 1.5rem",
          marginBottom: "1.5rem",
          fontSize: "0.9rem"
        }}>
          🚀 AI-Powered Civic Platform for Pune
        </div>

        <h1 style={{
          fontSize: "clamp(3rem, 8vw, 6rem)",
          fontWeight: "900",
          margin: "0 0 1rem",
          background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #60a5fa 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-2px",
          lineHeight: 1.1,
          fontFamily: "'Segoe UI', system-ui, sans-serif"
        }}>
          CivicSense
        </h1>

        <p style={{
          fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
          opacity: 0.9,
          marginBottom: "0.75rem",
          fontWeight: "300",
          letterSpacing: "0.5px"
        }}>
          AI-Driven Issue Redressal & Prioritization
        </p>

        <p style={{ fontSize: "1rem", opacity: 0.6, marginBottom: "2.5rem", maxWidth: "600px", margin: "0 auto 2.5rem" }}>
          Report civic issues instantly with voice, text, or images. Our AI automatically classifies, prioritizes and routes your complaint to the right department.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {user?.role === "citizen" && (
            <Link to="/submit" style={{
              padding: "1rem 2.5rem",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.1rem",
              boxShadow: "0 8px 32px rgba(102,126,234,0.4)",
              transition: "transform 0.2s",
            }}>
              📝 Submit Complaint
            </Link>
          )}
          <Link to="/dashboard" style={{
            padding: "1rem 2.5rem",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            color: "white",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.1rem",
            border: "1px solid rgba(255,255,255,0.3)",
          }}>
            📊 View Dashboard
          </Link>
          <Link to="/map" style={{
            padding: "1rem 2.5rem",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            color: "white",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.1rem",
            border: "1px solid rgba(255,255,255,0.3)",
          }}>
            🗺️ View Map
          </Link>
        </div>
      </div>

      {/* Live Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem",
        margin: "2rem 1rem",
      }}>
        {[
          { label: "Total Complaints", value: stats.total || 0, emoji: "📋", color: "#667eea" },
          { label: "High Priority", value: stats.high_priority || 0, emoji: "🚨", color: "#ef4444" },
          { label: "Pending", value: stats.pending || 0, emoji: "⏳", color: "#f59e0b" },
          { label: "Resolved", value: stats.resolved || 0, emoji: "✅", color: "#10b981" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "1.5rem",
            textAlign: "center",
            border: `1px solid ${s.color}44`,
            borderTop: `3px solid ${s.color}`,
          }}>
            <p style={{ fontSize: "2rem", margin: "0 0 0.25rem" }}>{s.emoji}</p>
            <p style={{ fontSize: "2.5rem", fontWeight: "900", color: s.color, margin: "0" }}>{s.value}</p>
            <p style={{ margin: "0.25rem 0 0", opacity: 0.7, fontSize: "0.85rem" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div style={{ padding: "2rem 1rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "0.5rem", fontWeight: "800" }}>
          ✨ Platform Features
        </h2>
        <p style={{ textAlign: "center", opacity: 0.6, marginBottom: "2rem" }}>
          Everything you need for smart civic management
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.25rem",
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "1.75rem",
              border: "1px solid rgba(255,255,255,0.1)",
              transition: "transform 0.2s, border-color 0.2s",
              cursor: "default",
              borderLeft: `4px solid ${f.color}`,
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{f.emoji}</div>
              <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", fontWeight: "700", color: f.color }}>{f.title}</h3>
              <p style={{ margin: 0, opacity: 0.7, lineHeight: 1.6, fontSize: "0.9rem" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ padding: "2rem 1rem 3rem" }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "0.5rem", fontWeight: "800" }}>
          ⚡ How It Works
        </h2>
        <p style={{ textAlign: "center", opacity: 0.6, marginBottom: "2rem" }}>3 simple steps</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          {[
            { step: "01", title: "Submit", desc: "Report your civic issue with text, voice or image in any language", emoji: "📝", color: "#667eea" },
            { step: "02", title: "AI Processes", desc: "Gemini AI classifies, prioritizes and routes to the right department", emoji: "🤖", color: "#a78bfa" },
            { step: "03", title: "Track & Resolve", desc: "Track your complaint status and earn reward points when resolved", emoji: "✅", color: "#10b981" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.07)",
              borderRadius: "20px",
              padding: "2rem",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.1)",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "1rem", right: "1rem",
                fontSize: "4rem", fontWeight: "900", opacity: 0.05, color: s.color,
                lineHeight: 1
              }}>{s.step}</div>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{s.emoji}</div>
              <h3 style={{ color: s.color, margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: "700" }}>{s.title}</h3>
              <p style={{ opacity: 0.7, margin: 0, lineHeight: 1.6, fontSize: "0.9rem" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
