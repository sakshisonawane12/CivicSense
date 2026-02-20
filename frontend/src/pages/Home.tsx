import { Link } from "react-router-dom";
import { FileText, BarChart3, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>CIVICSENSE</h1>
        <p className="tagline">AI-Driven Issue Redressal & Prioritization</p>
        <p className="subtitle">
          Report civic issues instantly with voice, text, or images
        </p>
      </div>

      <div className="features">
        <div className="feature-card">
          <FileText size={48} color="#3b82f6" />
          <h3>Multi-Channel Reporting</h3>
          <p>
            Submit complaints via text, voice, or images in multiple languages
          </p>
        </div>
        <div className="feature-card">
          <Shield size={48} color="#10b981" />
          <h3>AI Classification</h3>
          <p>Automatic categorization and priority assignment using NLP</p>
        </div>
        <div className="feature-card">
          <BarChart3 size={48} color="#f59e0b" />
          <h3>Smart Analytics</h3>
          <p>Identify hotspots and predict emerging civic issues</p>
        </div>
      </div>

      <div className="cta-buttons">
        <Link to="/submit" className="cta-primary">
          Submit Complaint
        </Link>
        <Link to="/dashboard" className="cta-secondary">
          View Dashboard
        </Link>
        <Link to="/team" className="cta-secondary">
          Meet Our Team
        </Link>
      </div>
    </div>
  );
}
