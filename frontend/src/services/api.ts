import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const complaintService = {
  createComplaint: async (formData) => {
    const token = localStorage.getItem('token');
    const headers: any = { 'Content-Type': 'multipart/form-data' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await axios.post(`${API_URL}/complaints`, formData, { headers });
    return response.data;
  },

  getAllComplaints: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}/complaints?${params}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axios.patch(`${API_URL}/complaints/${id}/status`, { status });
    return response.data;
  },

  getHotspots: async () => {
    const response = await axios.get(`${API_URL}/complaints/hotspots`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(`${API_URL}/complaints/stats`);
    return response.data;
  }
};
