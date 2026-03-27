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
      setComplaintId(response.complaint?._id);
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
      <div className="cs-main" style={{ paddingBottom: '5rem' }}>
        <div className="cs-card" style={{ maxWidth: '500px', margin: '5rem auto', padding: '3rem', textAlign: 'center', borderTop: '4px solid var(--teal)' }}>
          <CheckCircle size={64} color="var(--teal)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="cs-h1" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Submitted Successfully!</h2>
          <div style={{ background: 'var(--teal-light)', border: '1px solid rgba(13, 148, 136, 0.2)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--teal)', fontWeight: 800, fontSize: '1.25rem', margin: '0 0 0.25rem', fontFamily: 'monospace' }}>#{complaintId}</p>
            <p style={{ color: 'var(--ink3)', margin: 0, fontSize: '0.875rem', fontFamily: 'var(--sans)' }}>Save this ID to track your complaint</p>
          </div>
          <p style={{ color: 'var(--ink2)', fontSize: '0.95rem', fontFamily: 'var(--sans)' }}>Your complaint has been registered and will be processed soon.</p>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.875rem 1rem', background: '#ffffff',
    border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--ink)',
    fontSize: '1rem', fontFamily: 'var(--sans)', outline: 'none', boxSizing: 'border-box',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)', transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.85rem', fontWeight: 600,
    color: 'var(--ink2)', marginBottom: '0.4rem', fontFamily: 'var(--sans)'
  };

  return (
    <div className="cs-main" style={{ paddingBottom: '5rem' }}>
      <section className="cs-section" style={{ maxWidth: '640px', margin: '0 auto', borderTop: 'none', paddingTop: '3rem' }}>
        <h1 className="cs-h1" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Report Issue</h1>
        <p style={{ color: 'var(--ink3)', marginBottom: '2.5rem', fontSize: '1.05rem', fontFamily: 'var(--sans)' }}>Report a civic issue and our AI will classify and route it officially.</p>

        <div className="cs-card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Your Name</label>
                <input className="cs-input" style={inputStyle} type="text" placeholder="Enter your name" value={formData.citizen_name} onChange={e => setFormData({ ...formData, citizen_name: e.target.value })} required />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input className="cs-input" style={inputStyle} type="tel" placeholder="Enter phone number" value={formData.citizen_phone} onChange={e => setFormData({ ...formData, citizen_phone: e.target.value })} required />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Describe Your Complaint</label>
              <textarea className="cs-input" style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }} placeholder="Describe the civic issue in detail..." value={formData.complaint_text} onChange={e => setFormData({ ...formData, complaint_text: e.target.value })} required rows={4} />
            </div>

            <div>
              <label style={labelStyle}>Location</label>
              <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                <LocationPicker onLocationSelect={address => setFormData({ ...formData, location: address })} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Language</label>
              <select className="cs-input" style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', background: '#fff url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231C1917%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right .75rem top 50%', backgroundSize: '.65em auto' }} value={formData.language} onChange={e => setFormData({ ...formData, language: e.target.value })}>
                <option value="en" style={{ color: 'var(--ink)' }}>English</option>
                <option value="hi" style={{ color: 'var(--ink)' }}>Hindi</option>
                <option value="mr" style={{ color: 'var(--ink)' }}>Marathi</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1rem', background: '#fff', border: '2px dashed var(--border)', borderRadius: '12px', cursor: 'pointer', color: image ? 'var(--teal)' : 'var(--ink3)', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s', fontFamily: 'var(--sans)' }}>
                <Image size={20} />
                <span>{image ? 'Image Attached' : 'Upload Image'}</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImage(e.target.files?.[0])} />
              </label>
              <button type="button" onClick={startRecording} disabled={recording} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem 1rem', background: recording ? 'var(--coral-light)' : audio ? 'var(--teal-light)' : '#fff', border: `2px solid ${recording ? 'var(--coral)' : audio ? 'var(--teal)' : 'var(--border)'}`, borderRadius: '12px', color: recording ? 'var(--coral)' : audio ? 'var(--teal)' : 'var(--ink3)', fontWeight: 600, fontSize: '0.9rem', cursor: recording ? 'not-allowed' : 'pointer', fontFamily: 'var(--sans)', transition: 'all 0.2s' }}>
                <Mic size={20} />
                <span>{recording ? 'Recording...' : audio ? 'Audio Attached' : 'Record Audio'}</span>
              </button>
            </div>

            <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--indigo)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'var(--sans)', transition: 'transform 0.2s', marginTop: '1rem', boxShadow: '0 4px 6px rgba(55,48,163,0.2)' }}>
              <Send size={20} />
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
