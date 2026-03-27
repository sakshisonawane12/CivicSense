import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";

import TrackComplaint from "./pages/TrackComplaint";
import Login from "./pages/Login";
import MyComplaints from "./pages/MyComplaints";
import Profile from "./pages/Profile";
import MapAnalytics from "./pages/MapAnalytics";
import Leaderboard from "./pages/Leaderboard";
import ComplaintForm from "./components/ComplaintForm";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <Router>
      <div className="app">
        {user && (
          <nav className="cs-nav">
            <Link to="/home" className="cs-brand">
              <div className="cs-brand-icon">🏛️</div>
              CivicSense
            </Link>
            <div className="cs-nav-links">
              <Link to="/home" className="cs-nav-link">Home</Link>
              <Link to="/dashboard" className="cs-nav-link">Dashboard</Link>
              <Link to="/map" className="cs-nav-link">Live Map</Link>
              <Link to="/leaderboard" className="cs-nav-link">Leaderboard</Link>
              {user.role === "citizen" && (
                <>
                  <Link to="/track" className="cs-nav-link">Track Status</Link>
                  <Link to="/my-complaints" className="cs-nav-link">My Logs</Link>
                  <Link to="/profile" className="cs-nav-link">Profile</Link>
                  <Link to="/submit" className="cs-nav-cta">📝 Report Issue</Link>
                </>
              )}
              {user.role === "department" && (
                <Link to="/profile" className="cs-nav-link">Profile</Link>
              )}
            </div>
          </nav>
        )}

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/home" /> : <LandingPage />}
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={user ? <Home /> : <Navigate to="/" />}
            />
            <Route
              path="/submit"
              element={user ? <ComplaintForm /> : <Navigate to="/login" />}
            />
            <Route path="/track" element={<TrackComplaint />} />
            <Route
              path="/my-complaints"
              element={user ? <MyComplaints /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/map"
              element={user ? <MapAnalytics /> : <Navigate to="/login" />}
            />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>

        {user && (
          <div className="cs-dock">
            <span className="cs-dock-label">System</span>
            {user.role === "citizen" && (
              <Link to="/submit" className="cs-dock-btn primary">📝 Report Issue</Link>
            )}
            <Link to="/dashboard" className="cs-dock-btn ghost">📊 Dashboard</Link>
            <Link to="/map" className="cs-dock-btn ghost">🗺️ Map</Link>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
