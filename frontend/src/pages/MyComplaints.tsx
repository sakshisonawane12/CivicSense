import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/complaints';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchComplaints(token);
  }, [navigate]);

  const fetchComplaints = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/my-complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-200 text-yellow-900';
      case 'in-progress': return 'bg-blue-200 text-blue-900';
      case 'resolved': return 'bg-green-200 text-green-900';
      default: return 'bg-gray-200 text-gray-900';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-700 font-bold';
      case 'Medium': return 'text-orange-700 font-bold';
      case 'Low': return 'text-green-700 font-bold';
      default: return 'text-gray-700 font-bold';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Complaints</h1>
              <p className="text-gray-600">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {complaints.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No complaints found</p>
              <button
                onClick={() => navigate('/submit')}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit New Complaint
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Complaint ID</span>
                      <p className="text-2xl font-bold text-blue-600">#{complaint.id}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Category</span>
                      <p className="font-medium text-gray-800">{complaint.category}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Priority</span>
                      <p className={`font-bold ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Department</span>
                      <p className="font-medium text-gray-800">{complaint.department}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Location</span>
                      <p className="font-medium text-gray-800">{complaint.location}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Complaint</span>
                    <p className="text-gray-700 mt-1">{complaint.complaint_text}</p>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Submitted: {new Date(complaint.created_at).toLocaleString()}</span>
                    <span>Updated: {new Date(complaint.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
