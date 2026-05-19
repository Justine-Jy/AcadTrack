import { useState } from 'react';
import { api } from '../api'; // fixed: was `import { login } from '../api'`

export default function LoginPage({ onLogin }) {
  const [tab, setTab] = useState('student'); // 'student' | 'admin'
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login(studentId, password); // fixed: was login(...)

      if (!data.success) throw new Error(data.message || 'Login failed');

      const userData = data.user;
      const token = data.token;

      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Check role matches tab
      if (tab === 'admin' && userData.role !== 'admin') {
        throw new Error('This is not an admin account. Please use the Student tab.');
      }
      if (tab === 'student' && userData.role === 'admin') {
        throw new Error('This is an admin account. Please use the Admin tab.');
      }

      // Call parent callback
      onLogin(userData);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = tab === 'admin';

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        {/* Brand */}
        <div style={s.brand}>
          <div style={s.logo}>A</div>
          <h1 style={s.title}>AcadTrack</h1>
          <p style={s.sub}>Academic Information System</p>
          <p style={s.school}>Westfield High School · A.Y. 2025–2026</p>
        </div>

        {/* Tab switcher */}
        <div style={s.tabs}>
          <button
            style={{ ...s.tab, ...(tab === 'student' ? s.tabActive : {}) }}
            onClick={() => {
              setTab('student');
              setError('');
              setStudentId('');
              setPassword('');
            }}
          >
            🎓 Student Login
          </button>
          <button
            style={{
              ...s.tab,
              ...(tab === 'admin' ? { ...s.tabActive, ...s.tabAdmin } : {}),
            }}
            onClick={() => {
              setTab('admin');
              setError('');
              setStudentId('');
              setPassword('');
            }}
          >
            🔐 Admin Login
          </button>
        </div>

        {/* Hint box */}
        <div
          style={{
            ...s.hintBox,
            background: isAdmin ? '#fef3c7' : '#eff6ff',
            borderColor: isAdmin ? '#fcd34d' : '#bfdbfe',
          }}
        >
          {tab === 'student' ? (
            <p style={s.hintText}>
              👋 Enter your <b>Student ID</b> (e.g. <code>2025-HS-00101</code>) and password
              provided by your school registrar.
            </p>
          ) : (
            <p style={s.hintText}>
              🔒 Admin access only. Use your <b>Admin ID</b> (e.g. <code>ADMIN-001</code>) and admin
              password.
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>{isAdmin ? 'Admin ID' : 'Student ID'}</label>
            <input
              style={{ ...s.input, borderColor: error ? '#fca5a5' : '#e0e0e0' }}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder={isAdmin ? 'e.g. ADMIN-001' : 'e.g. 2025-HS-00101'}
              required
              disabled={loading}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              style={{ ...s.input, borderColor: error ? '#fca5a5' : '#e0e0e0' }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error && <div style={s.err}>{error}</div>}

          <button
            style={{
              ...s.btn,
              background: isAdmin
                ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                : 'linear-gradient(135deg,#6c63ff,#5a54d4)',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : `Sign In as ${isAdmin ? 'Admin' : 'Student'}`}
          </button>
        </form>

        <p style={s.footer}>Forgot your credentials? Contact the school registrar.</p>
      </div>
    </div>
  );
}

const s = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',
    fontFamily: "'Segoe UI',sans-serif",
  },
  card: {
    background: '#fff',
    borderRadius: 24,
    padding: '40px 36px',
    width: 420,
    maxWidth: '92vw',
    boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
  },
  brand: { textAlign: 'center', marginBottom: 24 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    margin: '0 auto 12px',
    background: 'linear-gradient(135deg,#6c63ff,#e06c75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    fontWeight: 800,
    color: '#fff',
  },
  title: { margin: '0 0 4px', fontSize: 26, fontWeight: 800, color: '#1a1a2e', letterSpacing: -0.5 },
  sub: { margin: '0 0 2px', fontSize: 13, color: '#666' },
  school: { margin: 0, fontSize: 12, color: '#aaa', fontStyle: 'italic' },

  tabs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    marginBottom: 16,
    background: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    padding: '9px 0',
    borderRadius: 9,
    border: 'none',
    cursor: 'pointer',
    background: 'transparent',
    fontSize: 13,
    fontWeight: 600,
    color: '#888',
    transition: 'all .2s',
  },
  tabActive: {
    background: '#fff',
    color: '#6c63ff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
  },
  tabAdmin: { color: '#d97706' },

  hintBox: {
    borderRadius: 10,
    border: '1px solid',
    padding: '10px 14px',
    marginBottom: 18,
    transition: 'all .3s',
  },
  hintText: { margin: 0, fontSize: 12, color: '#555', lineHeight: 1.6 },

  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 12, fontWeight: 700, color: '#555', letterSpacing: 0.3 },
  input: {
    padding: '11px 14px',
    borderRadius: 10,
    border: '1.5px solid',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border .2s',
  },
  err: {
    background: '#fff0f0',
    border: '1px solid #ffcdd2',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    color: '#c62828',
  },
  btn: {
    padding: '13px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 0.3,
    transition: 'opacity .2s',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#bbb',
    marginTop: 20,
    marginBottom: 0,
  },
};