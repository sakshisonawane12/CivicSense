import { useState, useEffect } from "react";
import { complaintService } from "../services/api";
import { AlertCircle, TrendingUp, CheckCircle2, Clock } from "lucide-react";

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [filter, setFilter] = useState({
    department: "",
    priority: "",
    status: "",
  });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      const [complaintsData, statsData, hotspotsData] = await Promise.all([
        complaintService.getAllComplaints(filter),
        complaintService.getStats(),
        complaintService.getHotspots(),
      ]);
      setComplaints(complaintsData.complaints);
      setStats(statsData.stats);
      setHotspots(hotspotsData.hotspots);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await complaintService.updateStatus(id, status);
      loadData();
    } catch (error) {
      alert("Error updating status");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ef4444";
      case "Medium":
        return "#f59e0b";
      case "Low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <AlertCircle size={32} color="#3b82f6" />
            <div>
              <h3>{stats.total}</h3>
              <p>Total Complaints</p>
            </div>
          </div>
          <div className="stat-card">
            <TrendingUp size={32} color="#ef4444" />
            <div>
              <h3>{stats.high_priority}</h3>
              <p>High Priority</p>
            </div>
          </div>
          <div className="stat-card">
            <Clock size={32} color="#f59e0b" />
            <div>
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <CheckCircle2 size={32} color="#10b981" />
            <div>
              <h3>{stats.resolved}</h3>
              <p>Resolved</p>
            </div>
          </div>
        </div>
      )}

      <div className="filters">
        <select
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={filter.department}
          onChange={(e) => setFilter({ ...filter, department: e.target.value })}
        >
          <option value="">All Departments</option>
          <option value="Sanitation Department">Sanitation</option>
          <option value="Public Works Department">Infrastructure</option>
          <option value="Police Department">Safety</option>
        </select>
      </div>

      <div className="content-grid">
        <div className="complaints-section">
          <h2>Recent Complaints</h2>
          <div className="complaints-list">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="complaint-card">
                <div className="complaint-header">
                  <span
                    className="category-badge"
                    style={{
                      backgroundColor: getPriorityColor(complaint.priority),
                    }}
                  >
                    {complaint.priority}
                  </span>
                  <span className="category">{complaint.category}</span>
                </div>
                <p className="complaint-text">{complaint.complaint_text}</p>
                <div className="complaint-meta">
                  <span>📍 {complaint.location}</span>
                  <span>👤 {complaint.citizen_name}</span>
                  <span>🏢 {complaint.department}</span>
                </div>
                <div className="complaint-actions">
                  <select
                    value={complaint.status}
                    onChange={(e) => updateStatus(complaint.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hotspots-section">
          <h2>Hotspot Areas</h2>
          <div className="hotspots-list">
            {hotspots.map((hotspot, idx) => (
              <div key={idx} className="hotspot-card">
                <div className="hotspot-location">📍 {hotspot.location}</div>
                <div className="hotspot-category">{hotspot.category}</div>
                <div className="hotspot-count">
                  {hotspot.complaint_count} complaints
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
