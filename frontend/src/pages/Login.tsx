import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'white',
  fontSize: '1rem', fontFamily: 'Inter,sans-serif', outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.85rem', fontWeight: 600,
  color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem',
};

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: roleParam || 'citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (roleParam) setFormData(prev => ({ ...prev, role: roleParam }));
  }, [roleParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await axios.post(`${API_URL}${endpoint}`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (response.data.user.role === 'department') navigate('/dashboard');
      else navigate('/home');
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Inter,sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {formData.role === 'department' ? '🏢' : '👤'}
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', margin: '0 0 0.25rem' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            {formData.role === 'department' ? 'Department Portal' : 'Citizen Portal'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your name" required={!isLogin} />
            </div>
          )}
          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Enter your email" required />
          </div>
          {!isLogin && (
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter your phone" />
            </div>
          )}
          <div>
            <label style={labelStyle}>Password</label>
            <input style={inputStyle} type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Enter your password" required />
          </div>
          {!isLogin && (
            <div>
              <label style={labelStyle}>Role</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                <option value="citizen" style={{ background: '#1e1b4b' }}>👤 Citizen</option>
                <option value="department" style={{ background: '#1e1b4b' }}>🏢 Department</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ padding: '0.9rem', background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Inter,sans-serif', marginTop: '0.5rem' }}>
            {loading ? 'Please wait...' : isLogin ? 'Login →' : 'Create Account →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Inter,sans-serif' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span style={{ color: '#a78bfa', fontWeight: 600 }}>{isLogin ? 'Register' : 'Login'}</span>
          </button>
        </div>

        {isLogin && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
            <p style={{ fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>Demo Accounts:</p>
            <p>sanitation@civic.gov / admin123</p>
            <p>pwd@civic.gov / admin123</p>
            <p>police@civic.gov / admin123</p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Inter,sans-serif' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
