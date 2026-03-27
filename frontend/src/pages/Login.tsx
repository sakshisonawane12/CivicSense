import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'var(--sans)' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: '#fff', borderRadius: '24px', padding: '3rem 2.5rem', border: '1px solid var(--border)', boxShadow: '0 12px 24px rgba(0,0,0,0.03)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '64px', height: '64px', margin: '0 auto 1.25rem', background: formData.role === 'department' ? 'var(--teal-light)' : 'var(--indigo-light)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: formData.role === 'department' ? 'var(--teal)' : 'var(--indigo)' }}>
            {formData.role === 'department' ? '🏢' : '👤'}
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.25rem', fontFamily: 'var(--serif)' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--ink3)', fontSize: '0.95rem' }}>
            {formData.role === 'department' ? 'Department Portal' : 'Citizen Portal'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--coral-light)', border: '1px solid rgba(232,71,42,0.2)', color: 'var(--coral)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
              <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', background: '#fff url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231C1917%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right .75rem top 50%', backgroundSize: '.65em auto' }} value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                <option value="citizen" style={{ color: 'var(--ink)' }}>👤 Citizen</option>
                <option value="department" style={{ color: 'var(--ink)' }}>🏢 Department</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ padding: '1rem', background: formData.role === 'department' ? 'var(--teal)' : 'var(--indigo)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.05rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'var(--sans)', marginTop: '0.5rem', transition: 'transform 0.2s', boxShadow: `0 4px 12px ${formData.role === 'department' ? 'rgba(13,148,136,0.3)' : 'rgba(55,48,163,0.3)'}` }}>
            {loading ? 'Please wait...' : isLogin ? 'Login →' : 'Create Account →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--ink3)', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--sans)' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span style={{ color: formData.role === 'department' ? 'var(--teal)' : 'var(--indigo)', fontWeight: 700 }}>{isLogin ? 'Register' : 'Login'}</span>
          </button>
        </div>

        {isLogin && (
          <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--ink3)', textAlign: 'center' }}>
            <p style={{ fontWeight: 700, color: 'var(--ink2)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>Demo Accounts</p>
            <p style={{ margin: '0.25rem 0' }}>sanitation@civic.gov / admin123</p>
            <p style={{ margin: '0.25rem 0' }}>pwd@civic.gov / admin123</p>
            <p style={{ margin: '0.25rem 0' }}>police@civic.gov / admin123</p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--ink3)', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--sans)', fontWeight: 600 }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
