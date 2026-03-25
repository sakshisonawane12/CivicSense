import { useState } from 'react';
import { complaintService } from '../services/api';
import { Send, Mic, Image, CheckCircle } from 'lucide-react';
import LocationPicker from './LocationPicker';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({ citizen_name: '', citizen_phone: '', complaint_text: '', location: '', language: 'en' });
  const [image, setImage] = useState<any>(null);
  const [audio, setAudio] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState<any>(null);
  const [recording, setRecording] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, (formData as any)[key]));
    if (image) data.append('image', image);
    if (audio) data.append('audio', audio);
    try {
      const response = await complaintService.createComplaint(data);
      setComplaintId(response.complaint?.id);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false); setComplaintId(null);
        setFormData({ citizen_name: '', citizen_phone: '', complaint_text: '', location: '', language: 'en' });
        setImage(null); setAudio(null);
      }, 5000);
    } catch { alert('Error submitting complaint'); }
    finally { setLoading(false); }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: any[] = [];
      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudio(new File([blob], 'recording.webm', { type: 'audio/webm' }));
      };
      mediaRecorder.start();
      setRecording(true);
      setTimeout(() => { mediaRecorder.stop(); stream.getTracks().forEach(t => t.stop()); setRecording(false); }, 10000);
    } catch { alert('Microphone access denied'); }
  };

  if (success) {
    return (
      <div style={{ maxWidth: '500px', margin: '3rem auto', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '3rem', textAlign: 'center', border: '1px solid rgba(16,185,129,0.3)', color: 'white', fontFamily: 'Inter,sans-serif' }}>
        <CheckCircle size={64} color="#34d399" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ color: '#34d399', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Submitted Successfully!</h2>
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ color: '#6ee7b7', fontWeight: 800, fontSize: '1.25rem', margin: '0 0 0.25rem' }}>Complaint ID: #{complaintId}</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.875rem' }}>Save this ID to track your complaint</p>
        </div>
        <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Your complaint has been registered and will be processed soon.</p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'white',
    fontSize: '1rem', fontFamily: 'Inter,sans-serif', outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.85rem', fontWeight: 600,
    color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem',
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', color: 'white', fontFamily: 'Inter,sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>📝 Submit Complaint</h1>
      <p style={{ opacity: 0.6, marginBottom: '2rem', fontSize: '0.9rem' }}>Report a civic issue and our AI will classify and route it automatically</p>

      <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Your Name</label>
              <input style={inputStyle} type="text" placeholder="Enter your name" value={formData.citizen_name} onChange={e => setFormData({ ...formData, citizen_name: e.target.value })} required />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input style={inputStyle} type="tel" placeholder="Enter phone number" value={formData.citizen_phone} onChange={e => setFormData({ ...formData, citizen_phone: e.target.value })} required />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Describe Your Complaint</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }} placeholder="Describe the civic issue in detail..." value={formData.complaint_text} onChange={e => setFormData({ ...formData, complaint_text: e.target.value })} required rows={4} />
          </div>

          <div>
            <label style={labelStyle}>Location</label>
            <LocationPicker onLocationSelect={address => setFormData({ ...formData, location: address })} />
          </div>

          <div>
            <label style={labelStyle}>Language</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={formData.language} onChange={e => setFormData({ ...formData, language: e.target.value })}>
              <option value="en" style={{ background: '#1e1b4b' }}>🇬🇧 English</option>
              <option value="hi" style={{ background: '#1e1b4b' }}>🇮🇳 Hindi</option>
              <option value="mr" style={{ background: '#1e1b4b' }}>🇮🇳 Marathi</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.05)', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', cursor: 'pointer', color: image ? '#34d399' : 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' }}>
              <Image size={20} />
              <span>{image ? '✅ Image Added' : 'Upload Image'}</span>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImage(e.target.files?.[0])} />
            </label>
            <button type="button" onClick={startRecording} disabled={recording} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem 1rem', background: recording ? 'rgba(239,68,68,0.2)' : audio ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', border: `2px solid ${recording ? 'rgba(239,68,68,0.4)' : audio ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}`, borderRadius: '12px', color: recording ? '#f87171' : audio ? '#34d399' : '#fbbf24', fontWeight: 600, fontSize: '0.9rem', cursor: recording ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif' }}>
              <Mic size={20} />
              <span>{recording ? '🔴 Recording...' : audio ? '✅ Audio Added' : 'Record Audio'}</span>
            </button>
          </div>

          <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '1.05rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Inter,sans-serif', transition: 'opacity 0.2s' }}>
            <Send size={20} />
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}
