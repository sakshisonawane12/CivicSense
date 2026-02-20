import { useState } from 'react';
import { complaintService } from '../services/api';
import { Send, Mic, Image, CheckCircle } from 'lucide-react';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    citizen_name: '',
    citizen_phone: '',
    complaint_text: '',
    location: '',
    language: 'en'
  });
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState(null);
  const [recording, setRecording] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);
    if (audio) data.append('audio', audio);

    try {
      const response = await complaintService.createComplaint(data);
      setComplaintId(response.complaint.id);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setComplaintId(null);
        setFormData({ citizen_name: '', citizen_phone: '', complaint_text: '', location: '', language: 'en' });
        setImage(null);
        setAudio(null);
      }, 5000);
    } catch (error) {
      alert('Error submitting complaint');
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudio(new File([blob], 'recording.webm', { type: 'audio/webm' }));
      };

      mediaRecorder.start();
      setRecording(true);

      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        setRecording(false);
      }, 10000);
    } catch (error) {
      alert('Microphone access denied');
    }
  };

  if (success) {
    return (
      <div className="success-message">
        <CheckCircle size={64} color="#10b981" />
        <h2 style={{color: '#10b981'}}>Complaint Submitted Successfully!</h2>
        <div style={{background: '#f0fdf4', padding: '1rem', borderRadius: '10px', margin: '1rem 0'}}>
          <p style={{color: '#166534', fontWeight: 'bold', fontSize: '1.2rem'}}>Your Complaint ID: #{complaintId}</p>
          <p style={{color: '#15803d', marginTop: '0.5rem'}}>Save this ID to track your complaint</p>
        </div>
        <p style={{color: '#666'}}>Your complaint has been registered and will be processed soon.</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Submit Your Complaint</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={formData.citizen_name}
          onChange={(e) => setFormData({ ...formData, citizen_name: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.citizen_phone}
          onChange={(e) => setFormData({ ...formData, citizen_phone: e.target.value })}
          required
        />
        <textarea
          placeholder="Describe your complaint..."
          value={formData.complaint_text}
          onChange={(e) => setFormData({ ...formData, complaint_text: e.target.value })}
          required
          rows={5}
        />
        <select
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
          style={{padding: '1rem', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem'}}
        >
          <option value="">Select Location in Pune</option>
          <option value="Shivaji Nagar, Pune">Shivaji Nagar</option>
          <option value="Kothrud, Pune">Kothrud</option>
          <option value="Deccan, Pune">Deccan</option>
          <option value="FC Road, Pune">FC Road</option>
          <option value="MG Road, Pune">MG Road</option>
          <option value="Hadapsar, Pune">Hadapsar</option>
          <option value="Wakad, Pune">Wakad</option>
          <option value="Hinjewadi, Pune">Hinjewadi</option>
          <option value="Baner, Pune">Baner</option>
          <option value="Aundh, Pune">Aundh</option>
        </select>
        <select
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
        </select>

        <div className="file-inputs">
          <label className="file-label">
            <Image size={20} />
            <span>Upload Image</span>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </label>
          
          <button type="button" onClick={startRecording} disabled={recording} className="record-btn">
            <Mic size={20} />
            <span>{recording ? 'Recording...' : 'Record Audio'}</span>
          </button>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          <Send size={20} />
          <span>{loading ? 'Submitting...' : 'Submit Complaint'}</span>
        </button>
      </form>
    </div>
  );
}
