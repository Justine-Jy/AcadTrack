import { useState } from "react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --white:  #F0EDE6;
  --white2: #E8E4DC;
  --ink:    #1A1A1F;
  --ink2:   #2E2E36;
  --ink3:   #45454F;
  --sage:   #4A7C6F;
  --sage2:  #5E9E8F;
  --sage3:  #D4EAE5;
  --terra:  #C46D52;
  --terra3: #F5DDD6;
  --slate:  #3D5A8A;
  --slate3: #D0DAF0;
  --gold:   #B8860B;
  --gold2:  #DAA520;
  --gold3:  #FFF8DC;
  --muted:  #9E9B94;
  --border: #D8D4CB;
}

body { background: var(--white); font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; }

.auth-page { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }

.auth-left {
  display: flex; flex-direction: column;
  justify-content: space-between;
  padding: 48px; position: relative; overflow: hidden;
}
.auth-left.student-left { background: var(--ink); }
.auth-left.admin-left   { background: #12100A; }

.auth-left::before {
  content: ''; position: absolute;
  width: 500px; height: 500px; border-radius: 50%;
  top: -100px; left: -100px; pointer-events: none;
}
.student-left::before { background: radial-gradient(circle, rgba(74,124,111,0.15) 0%, transparent 70%); }
.admin-left::before   { background: radial-gradient(circle, rgba(184,134,11,0.12) 0%, transparent 70%); }

.auth-left::after {
  content: ''; position: absolute;
  width: 400px; height: 400px; border-radius: 50%;
  bottom: -80px; right: -80px; pointer-events: none;
}
.student-left::after { background: radial-gradient(circle, rgba(61,90,138,0.12) 0%, transparent 70%); }
.admin-left::after   { background: radial-gradient(circle, rgba(196,109,82,0.08) 0%, transparent 70%); }

.left-logo { display: flex; align-items: center; gap: 12px; z-index: 1; }
.left-logo-box {
  width: 42px; height: 42px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-weight: 700; color: white;
}
.student-logo-box { background: linear-gradient(135deg, var(--sage), var(--slate)); }
.admin-logo-box   { background: linear-gradient(135deg, var(--terra), var(--gold2)); }

.left-logo-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px; font-weight: 700;
  color: var(--white); letter-spacing: -0.3px;
}
.left-content { z-index: 1; }
.left-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 48px; font-weight: 700;
  color: var(--white); line-height: 1.15;
  letter-spacing: -1px; margin-bottom: 20px;
}
.student-title-accent { color: var(--sage2); }
.admin-title-accent   { color: var(--gold2); }

.left-desc { font-size: 15px; color: rgba(240,237,230,0.55); line-height: 1.7; max-width: 340px; margin-bottom: 40px; }
.left-features { display: flex; flex-direction: column; gap: 14px; }
.feature-row { display: flex; align-items: center; gap: 12px; }
.feature-dot {
  width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 14px;
}
.fd-sage  { background: rgba(74,124,111,0.2); }
.fd-terra { background: rgba(196,109,82,0.2); }
.fd-slate { background: rgba(61,90,138,0.2); }
.fd-ink   { background: rgba(240,237,230,0.08); }
.fd-gold  { background: rgba(184,134,11,0.2); }
.feature-text { font-size: 13px; color: rgba(240,237,230,0.6); }

.left-footer {
  font-size: 11px; color: rgba(240,237,230,0.2);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 1px; z-index: 1;
}

.auth-right {
  background: var(--white);
  display: flex; align-items: center; justify-content: center;
  padding: 48px 56px;
}
.auth-box { width: 100%; max-width: 400px; animation: fadeUp 0.4s ease both; }

.portal-switcher { display: flex; gap: 8px; margin-bottom: 28px; }
.portal-btn {
  flex: 1; padding: 10px 16px;
  border-radius: 10px; border: 1.5px solid var(--border);
  font-size: 12.5px; font-weight: 700;
  cursor: pointer; font-family: 'Outfit', sans-serif;
  transition: all 0.2s; background: white; color: var(--muted);
}
.portal-btn.student-active { background: var(--ink); color: white; border-color: var(--ink); }
.portal-btn.admin-active   { background: linear-gradient(135deg, var(--terra), var(--gold2)); color: white; border-color: var(--gold2); }

.auth-tabs {
  display: flex; background: var(--white2);
  border-radius: 12px; padding: 4px; margin-bottom: 32px;
}
.auth-tab {
  flex: 1; padding: 10px;
  border-radius: 9px; border: none;
  font-size: 13.5px; font-weight: 600;
  cursor: pointer; font-family: 'Outfit', sans-serif;
  transition: all 0.2s; color: var(--muted); background: none;
}
.auth-tab.active { background: white; color: var(--ink); box-shadow: 0 2px 8px rgba(26,26,31,0.1); }

.auth-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px; font-weight: 700;
  color: var(--ink); margin-bottom: 6px; letter-spacing: -0.5px;
}
.auth-sub { font-size: 13.5px; color: var(--muted); margin-bottom: 28px; line-height: 1.5; }

.admin-portal-header {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
  background: var(--gold3); border: 1.5px solid var(--gold2);
  border-radius: 12px; margin-bottom: 24px;
}
.admin-portal-icon {
  width: 38px; height: 38px; border-radius: 10px;
  background: linear-gradient(135deg, var(--terra), var(--gold2));
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.admin-portal-title { font-size: 13px; font-weight: 700; color: var(--gold); }
.admin-portal-sub   { font-size: 11.5px; color: var(--gold); opacity: 0.8; margin-top: 1px; }

.form-group { margin-bottom: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-label {
  display: block; font-size: 11.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px;
  color: var(--ink3); margin-bottom: 7px;
}
.form-input {
  width: 100%; padding: 11px 14px;
  background: white; border: 1.5px solid var(--border);
  border-radius: 10px; font-size: 13.5px;
  font-family: 'Outfit', sans-serif; color: var(--ink);
  outline: none; transition: border-color 0.15s, box-shadow 0.15s;
}
.form-input.student-focus:focus { border-color: var(--sage); box-shadow: 0 0 0 3px rgba(74,124,111,0.1); }
.form-input.admin-focus:focus   { border-color: var(--gold2); box-shadow: 0 0 0 3px rgba(184,134,11,0.1); }
.form-input::placeholder { color: var(--muted); }
.form-input.error { border-color: var(--terra); }
.input-wrap { position: relative; }
.input-wrap .form-input { padding-right: 42px; }
.eye-btn {
  position: absolute; right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: var(--muted); font-size: 16px; padding: 0; transition: color 0.15s;
}
.eye-btn:hover { color: var(--ink); }
.error-msg { font-size: 11.5px; color: var(--terra); margin-top: 5px; }

.submit-btn {
  width: 100%; padding: 13px; border: none; border-radius: 11px;
  font-size: 14px; font-weight: 700; font-family: 'Outfit', sans-serif;
  cursor: pointer; transition: all 0.2s; margin-top: 8px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.student-btn { background: var(--ink); color: var(--white); }
.student-btn:hover { background: var(--ink2); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(26,26,31,0.2); }
.admin-btn { background: linear-gradient(135deg, var(--terra), var(--gold2)); color: white; }
.admin-btn:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(184,134,11,0.3); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.divider {
  display: flex; align-items: center; gap: 12px;
  margin: 20px 0; color: var(--muted); font-size: 12px;
}
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.demo-btn {
  width: 100%; padding: 11px;
  background: white; border: 1.5px solid var(--border);
  border-radius: 11px; font-size: 13px; font-weight: 600;
  font-family: 'Outfit', sans-serif; color: var(--ink3);
  cursor: pointer; transition: all 0.15s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.demo-btn.student-demo:hover { border-color: var(--sage); color: var(--sage); background: var(--sage3); }
.demo-btn.admin-demo:hover   { border-color: var(--gold2); color: var(--gold); background: var(--gold3); }

.api-error {
  background: var(--terra3); border: 1.5px solid var(--terra);
  border-radius: 10px; padding: 12px 14px;
  font-size: 12.5px; color: var(--terra); margin-bottom: 16px;
}
.api-success {
  background: var(--sage3); border: 1.5px solid var(--sage);
  border-radius: 10px; padding: 12px 14px;
  font-size: 12.5px; color: var(--sage); margin-bottom: 16px;
}

.terms-note {
  font-size: 11px; color: var(--muted);
  text-align: center; margin-top: 16px; line-height: 1.6;
}
.terms-note a { color: var(--slate); text-decoration: none; }
.terms-note a:hover { text-decoration: underline; }
.security-note { font-size: 11px; color: var(--muted); text-align: center; margin-top: 16px; }

@media (max-width: 860px) {
  .auth-page { grid-template-columns: 1fr; }
  .auth-left { display: none; }
  .auth-right { padding: 32px 24px; }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

const API = 'http://localhost:5000/api';

export default function AuthPage({ onLogin }) {
  const [portal, setPortal] = useState('student');
  const [tab, setTab]       = useState('login');
  const [showPw, setShowPw]   = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError,   setApiError]   = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [loginData, setLoginData] = useState({ studentId: '', password: '' });
  const [loginErr,  setLoginErr]  = useState({});
  const [regData, setRegData] = useState({
    studentId: '', firstName: '', lastName: '',
    email: '', password: '', confirmPassword: '',
    program: 'BS Computer Science', yearLevel: '1',
  });
  const [regErr, setRegErr] = useState({});

  const isAdmin = portal === 'admin';
  const focusCls = isAdmin ? 'admin-focus' : 'student-focus';

  const switchPortal = (p) => {
    setPortal(p); setTab('login');
    setApiError(''); setApiSuccess('');
    setLoginErr({}); setRegErr({});
    setLoginData({ studentId: '', password: '' });
  };

  const switchTab = (t) => {
    setTab(t); setApiError(''); setApiSuccess('');
    setLoginErr({}); setRegErr({});
  };

  const validateLogin = () => {
    const e = {};
    if (!loginData.studentId.trim()) e.studentId = 'ID is required';
    if (!loginData.password)         e.password  = 'Password is required';
    setLoginErr(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (ev) => {
    ev.preventDefault();
    if (!validateLogin()) return;
    setLoading(true); setApiError('');
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: loginData.studentId, password: loginData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Support both data.data and data.user response formats
      const userData = data.data || data.user;
      if (!userData) throw new Error('Invalid server response');

      if (isAdmin && userData.role !== 'admin') {
        throw new Error('Access denied. This portal is for administrators only.');
      }
      if (!isAdmin && userData.role === 'admin') {
        throw new Error('Please use the Admin Portal to sign in.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(userData));
      if (onLogin) onLogin(userData);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fixed: all demo accounts use 'admin123'
  const fillDemo = () => {
    if (isAdmin) {
      setLoginData({ studentId: 'ADMIN-001', password: 'admin123' });
    } else {
      setLoginData({ studentId: '2022-CS-00412', password: 'admin123' });
    }
    setApiError(''); setLoginErr({});
  };

  const validateReg = () => {
    const e = {};
    if (!regData.studentId.trim()) e.studentId = 'Student ID is required';
    if (!regData.firstName.trim()) e.firstName = 'First name is required';
    if (!regData.lastName.trim())  e.lastName  = 'Last name is required';
    if (!regData.email.trim())     e.email     = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(regData.email)) e.email = 'Invalid email format';
    if (!regData.password)         e.password  = 'Password is required';
    else if (regData.password.length < 6) e.password = 'Minimum 6 characters';
    if (regData.password !== regData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setRegErr(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (ev) => {
    ev.preventDefault();
    if (!validateReg()) return;
    setLoading(true); setApiError(''); setApiSuccess('');
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: regData.studentId,
          firstName: regData.firstName,
          lastName:  regData.lastName,
          email:     regData.email,
          password:  regData.password,
          program:   regData.program,
          yearLevel: Number(regData.yearLevel),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setApiSuccess('Account created! You can now sign in.');
      setRegData({ studentId:'', firstName:'', lastName:'', email:'', password:'', confirmPassword:'', program:'BS Computer Science', yearLevel:'1' });
      setTimeout(() => switchTab('login'), 1800);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const upL = (f) => (e) => { setLoginData(p => ({...p, [f]: e.target.value})); setLoginErr(p => ({...p, [f]: ''})); };
  const upR = (f) => (e) => { setRegData(p => ({...p, [f]: e.target.value}));   setRegErr(p => ({...p, [f]: ''})); };

  return (
    <>
      <style>{S}</style>
      <div className="auth-page">

        {/* LEFT PANEL */}
        <div className={`auth-left ${isAdmin ? 'admin-left' : 'student-left'}`}>
          <div className="left-logo">
            <div className={`left-logo-box ${isAdmin ? 'admin-logo-box' : 'student-logo-box'}`}>A</div>
            <div className="left-logo-name">AcadTrack</div>
          </div>

          <div className="left-content">
            {isAdmin ? (
              <>
                <div className="left-title">Admin<br/><span className="admin-title-accent">Control Panel.</span></div>
                <div className="left-desc">Manage students, faculty, subjects, grades, and announcements from a single powerful dashboard.</div>
                <div className="left-features">
                  {[
                    { ico:'👥', cl:'fd-sage',  text:'Manage all student accounts' },
                    { ico:'📚', cl:'fd-gold',  text:'Control subject enrollment slots' },
                    { ico:'👨‍🏫', cl:'fd-terra', text:'Oversee faculty and courses' },
                    { ico:'📢', cl:'fd-ink',   text:'Post system-wide announcements' },
                  ].map((f,i) => (
                    <div className="feature-row" key={i}>
                      <div className={`feature-dot ${f.cl}`}>{f.ico}</div>
                      <div className="feature-text">{f.text}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="left-title">Your Academic<br/>Journey <span className="student-title-accent">Tracked.</span></div>
                <div className="left-desc">A complete academic information system — manage your subjects, grades, schedule, and enrollment all in one place.</div>
                <div className="left-features">
                  {[
                    { ico:'📚', cl:'fd-sage',  text:'View and manage enrolled subjects' },
                    { ico:'📊', cl:'fd-terra', text:'Track grades across all semesters' },
                    { ico:'📅', cl:'fd-slate', text:'Weekly class schedule at a glance' },
                    { ico:'📝', cl:'fd-ink',   text:'Enroll and drop subjects easily' },
                  ].map((f,i) => (
                    <div className="feature-row" key={i}>
                      <div className={`feature-dot ${f.cl}`}>{f.ico}</div>
                      <div className="feature-text">{f.text}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="left-footer">ACADTRACK · ACADEMIC INFORMATION SYSTEM · A.Y. 2025–2026</div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <div className="auth-box">

            <div className="portal-switcher">
              <button className={`portal-btn ${!isAdmin ? 'student-active' : ''}`} onClick={() => switchPortal('student')}>
                🎓 Student Portal
              </button>
              <button className={`portal-btn ${isAdmin ? 'admin-active' : ''}`} onClick={() => switchPortal('admin')}>
                ⚙ Admin Portal
              </button>
            </div>

            {isAdmin && (
              <div className="admin-portal-header">
                <div className="admin-portal-icon">⚙</div>
                <div>
                  <div className="admin-portal-title">Administrator Access</div>
                  <div className="admin-portal-sub">Restricted to authorized personnel only</div>
                </div>
              </div>
            )}

            {!isAdmin && (
              <div className="auth-tabs">
                <button className={`auth-tab ${tab==='login'?'active':''}`}    onClick={()=>switchTab('login')}>Sign In</button>
                <button className={`auth-tab ${tab==='register'?'active':''}`} onClick={()=>switchTab('register')}>Register</button>
              </div>
            )}

            {/* STUDENT LOGIN */}
            {!isAdmin && tab === 'login' && (
              <>
                <div className="auth-heading">Welcome back</div>
                <div className="auth-sub">Sign in with your Student ID to continue.</div>
                {apiError && <div className="api-error">⚠ {apiError}</div>}
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label className="form-label">Student ID</label>
                    <input className={`form-input ${focusCls} ${loginErr.studentId?'error':''}`}
                      placeholder="e.g. 2022-CS-00412" value={loginData.studentId} onChange={upL('studentId')}
                      style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13}}/>
                    {loginErr.studentId && <div className="error-msg">⚠ {loginErr.studentId}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-wrap">
                      <input className={`form-input ${focusCls} ${loginErr.password?'error':''}`}
                        type={showPw?'text':'password'} placeholder="Enter your password"
                        value={loginData.password} onChange={upL('password')}/>
                      <button type="button" className="eye-btn" onClick={()=>setShowPw(p=>!p)}>{showPw?'🙈':'👁'}</button>
                    </div>
                    {loginErr.password && <div className="error-msg">⚠ {loginErr.password}</div>}
                  </div>
                  <button type="submit" className="submit-btn student-btn" disabled={loading}>
                    {loading ? 'Signing in…' : '→ Sign In'}
                  </button>
                </form>
                <div className="divider">or</div>
                <button className="demo-btn student-demo" onClick={fillDemo}>🎓 Fill Demo Credentials</button>
                <div className="terms-note" style={{marginTop:20}}>
                  Don't have an account?{' '}
                  <a href="#" onClick={e=>{e.preventDefault();switchTab('register')}}>Create one here</a>
                </div>
              </>
            )}

            {/* STUDENT REGISTER */}
            {!isAdmin && tab === 'register' && (
              <>
                <div className="auth-heading">Create account</div>
                <div className="auth-sub">Register with your student details to get started.</div>
                {apiError   && <div className="api-error">⚠ {apiError}</div>}
                {apiSuccess && <div className="api-success">✓ {apiSuccess}</div>}
                <form onSubmit={handleRegister}>
                  <div className="form-group">
                    <label className="form-label">Student ID</label>
                    <input className={`form-input ${focusCls} ${regErr.studentId?'error':''}`}
                      placeholder="e.g. 2023-CS-00123" value={regData.studentId} onChange={upR('studentId')}
                      style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13}}/>
                    {regErr.studentId && <div className="error-msg">⚠ {regErr.studentId}</div>}
                  </div>
                  <div className="form-group form-row">
                    <div>
                      <label className="form-label">First Name</label>
                      <input className={`form-input ${focusCls} ${regErr.firstName?'error':''}`} placeholder="Juan" value={regData.firstName} onChange={upR('firstName')}/>
                      {regErr.firstName && <div className="error-msg">⚠ {regErr.firstName}</div>}
                    </div>
                    <div>
                      <label className="form-label">Last Name</label>
                      <input className={`form-input ${focusCls} ${regErr.lastName?'error':''}`} placeholder="Dela Cruz" value={regData.lastName} onChange={upR('lastName')}/>
                      {regErr.lastName && <div className="error-msg">⚠ {regErr.lastName}</div>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className={`form-input ${focusCls} ${regErr.email?'error':''}`} type="email" placeholder="juan@student.edu" value={regData.email} onChange={upR('email')}/>
                    {regErr.email && <div className="error-msg">⚠ {regErr.email}</div>}
                  </div>
                  <div className="form-group form-row">
                    <div>
                      <label className="form-label">Program</label>
                      <select className={`form-input ${focusCls}`} value={regData.program} onChange={upR('program')} style={{cursor:'pointer'}}>
                        <option>BS Computer Science</option>
                        <option>BS Information Technology</option>
                        <option>BS Computer Engineering</option>
                        <option>BS Information Systems</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Year Level</label>
                      <select className={`form-input ${focusCls}`} value={regData.yearLevel} onChange={upR('yearLevel')} style={{cursor:'pointer'}}>
                        {[1,2,3,4,5].map(y=><option key={y} value={y}>Year {y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-wrap">
                      <input className={`form-input ${focusCls} ${regErr.password?'error':''}`}
                        type={showPw?'text':'password'} placeholder="Minimum 6 characters"
                        value={regData.password} onChange={upR('password')}/>
                      <button type="button" className="eye-btn" onClick={()=>setShowPw(p=>!p)}>{showPw?'🙈':'👁'}</button>
                    </div>
                    {regErr.password && <div className="error-msg">⚠ {regErr.password}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-wrap">
                      <input className={`form-input ${focusCls} ${regErr.confirmPassword?'error':''}`}
                        type={showPw2?'text':'password'} placeholder="Re-enter password"
                        value={regData.confirmPassword} onChange={upR('confirmPassword')}/>
                      <button type="button" className="eye-btn" onClick={()=>setShowPw2(p=>!p)}>{showPw2?'🙈':'👁'}</button>
                    </div>
                    {regErr.confirmPassword && <div className="error-msg">⚠ {regErr.confirmPassword}</div>}
                  </div>
                  <button type="submit" className="submit-btn student-btn" disabled={loading}>
                    {loading ? 'Creating account…' : '→ Create Account'}
                  </button>
                </form>
                <div className="terms-note">
                  Already have an account?{' '}
                  <a href="#" onClick={e=>{e.preventDefault();switchTab('login')}}>Sign in here</a>
                </div>
              </>
            )}

            {/* ADMIN LOGIN */}
            {isAdmin && (
              <>
                <div className="auth-heading">Admin Sign In</div>
                <div className="auth-sub">Enter your administrator credentials to access the control panel.</div>
                {apiError && <div className="api-error">⚠ {apiError}</div>}
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label className="form-label">Admin ID</label>
                    <input className={`form-input ${focusCls} ${loginErr.studentId?'error':''}`}
                      placeholder="e.g. ADMIN-001" value={loginData.studentId} onChange={upL('studentId')}
                      style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13}}/>
                    {loginErr.studentId && <div className="error-msg">⚠ {loginErr.studentId}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-wrap">
                      <input className={`form-input ${focusCls} ${loginErr.password?'error':''}`}
                        type={showPw?'text':'password'} placeholder="Enter admin password"
                        value={loginData.password} onChange={upL('password')}/>
                      <button type="button" className="eye-btn" onClick={()=>setShowPw(p=>!p)}>{showPw?'🙈':'👁'}</button>
                    </div>
                    {loginErr.password && <div className="error-msg">⚠ {loginErr.password}</div>}
                  </div>
                  <button type="submit" className="submit-btn admin-btn" disabled={loading}>
                    {loading ? 'Verifying…' : '→ Access Admin Panel'}
                  </button>
                </form>
                <div className="divider">or</div>
                <button className="demo-btn admin-demo" onClick={fillDemo}>⚙ Fill Admin Credentials</button>
                <div className="security-note">🔒 Secured access · Authorized personnel only</div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}