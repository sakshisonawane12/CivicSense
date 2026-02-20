import { useNavigate } from 'react-router-dom';
import { Users, Building2, Shield, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in">
            🏛️ CivicSense
          </h1>
          <p className="text-2xl text-purple-200 mb-8">
            AI-Powered Civic Complaint Management System
          </p>
          <p className="text-lg text-purple-300 max-w-2xl mx-auto">
            Transforming citizen grievances into actionable insights with intelligent triage, 
            automated routing, and predictive analytics
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Citizen Login */}
          <div 
            onClick={() => navigate('/login?role=citizen')}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/20 hover:border-white/40 transition-all cursor-pointer hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-full">
                <Users size={48} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Citizen Portal
            </h2>
            <p className="text-purple-200 text-center mb-6">
              Submit complaints, track status, and view your complaint history
            </p>
            <ul className="space-y-2 text-purple-100 mb-6">
              <li>✓ Submit complaints with AI classification</li>
              <li>✓ Track complaint status in real-time</li>
              <li>✓ View your complaint history</li>
              <li>✓ Upload images and voice recordings</li>
            </ul>
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-800 transition">
              Login as Citizen
            </button>
          </div>

          {/* Department Login */}
          <div 
            onClick={() => navigate('/login?role=department')}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/20 hover:border-white/40 transition-all cursor-pointer hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-6 rounded-full">
                <Building2 size={48} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Department Portal
            </h2>
            <p className="text-purple-200 text-center mb-6">
              Manage complaints, update status, and view analytics
            </p>
            <ul className="space-y-2 text-purple-100 mb-6">
              <li>✓ View all assigned complaints</li>
              <li>✓ Update complaint status</li>
              <li>✓ Access hotspot analytics</li>
              <li>✓ Priority-based filtering</li>
            </ul>
            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-800 transition">
              Login as Department
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <Shield size={40} className="text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AI-Powered Classification</h3>
            <p className="text-purple-200">
              Automatic categorization using Google Gemini AI with sentiment analysis
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <TrendingUp size={40} className="text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Predictive Analytics</h3>
            <p className="text-purple-200">
              Identify hotspot areas and predict recurring issues
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <Users size={40} className="text-pink-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Multi-Channel Support</h3>
            <p className="text-purple-200">
              Text, voice, and image submissions with multi-lingual support
            </p>
          </div>
        </div>

        {/* Quick Access */}
        <div className="text-center mt-12">
          <p className="text-purple-200 mb-4">Don't have an account?</p>
          <button
            onClick={() => navigate('/login')}
            className="text-white underline hover:text-purple-300 transition"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
