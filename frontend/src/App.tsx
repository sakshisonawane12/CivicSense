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
          <nav className="navbar">
            <Link to="/home" className="logo">
              🏛️ CivicSense
            </Link>
            <div className="nav-links">
              <Link to="/home">Home</Link>
              {user.role === "citizen" && (
                <>
                  <Link to="/submit">Submit</Link>
                  <Link to="/track">Track</Link>
                  <Link to="/my-complaints">My Complaints</Link>
                  <Link to="/leaderboard">🏆 Leaderboard</Link>
                </>
              )}
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/map">🗺️ Map</Link>
              <Link to="/team">Team</Link>
              <Link to="/profile">Profile</Link>
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
      </div>
    </Router>
  );
}

export default App;
