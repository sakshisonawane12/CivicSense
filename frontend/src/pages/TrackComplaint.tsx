import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/complaints';

export default function TrackComplaint() {
  const [searchType, setSearchType] = useState<'id' | 'phone'>('id');
  const [searchValue, setSearchValue] = useState('');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setComplaints([]);

    try {
      const params = searchType === 'id' ? { id: searchValue } : { phone: searchValue };
      const response = await axios.get(`${API_URL}/track`, { params });
      setComplaints(response.data.complaints);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to track complaint');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Track Your Complaint</h1>
          
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setSearchType('id')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  searchType === 'id' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Track by ID
              </button>
              <button
                type="button"
                onClick={() => setSearchType('phone')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  searchType === 'phone' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Track by Phone
              </button>
            </div>

            <div className="flex gap-4">
              <input
                type={searchType === 'id' ? 'number' : 'tel'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchType === 'id' ? 'Enter Complaint ID' : 'Enter Phone Number'}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {complaints.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Found {complaints.length} complaint(s)
              </h2>
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
