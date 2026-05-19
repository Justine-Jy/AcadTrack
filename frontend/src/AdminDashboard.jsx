import { useState, useEffect } from "react";
import { api } from "./api";

const S = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F4F1EB;
    --surface: #FFFFFF;
    --border: #E5E0D8;
    --text: #1A1A1F;
    --muted: #7A7570;
    --primary: #4A7C6F;
    --primary-light: #EAF2EF;
    --danger: #C0392B;
    --gold: #B8860B;
    --sidebar-bg: #1A1A2E;
    --sidebar-text: #A0A8C0;
    --sidebar-active: #FFFFFF;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', sans-serif; }

  .layout { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 240px; min-height: 100vh; background: var(--sidebar-bg);
    display: flex; flex-direction: column; padding: 0;
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
    transition: transform .25s;
  }
  .sidebar-logo { padding: 28px 20px 20px; border-bottom: 1px solid rgba(255,255,255,.07); }
  .logo-mark { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
  .logo-box {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg,#6c63ff,#e06c75);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 16px; color: #fff;
  }
  .logo-name { font-size: 16px; font-weight: 700; color: #fff; }
  .logo-sub { font-size: 10px; color: var(--sidebar-text); margin-bottom: 8px; }
  .role-badge {
    display: inline-block; background: rgba(108,99,255,.2); color: #a09cf7;
    font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; letter-spacing: .5px;
  }
  .nav-group { padding: 16px 12px 0; }
  .nav-group-label { font-size: 10px; font-weight: 700; color: var(--sidebar-text); letter-spacing: 1px; padding: 0 8px; margin-bottom: 6px; }
  .nav-btn {
    display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 10px;
    border: none; border-radius: 8px; background: transparent; color: var(--sidebar-text);
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; text-align: left; position: relative;
  }
  .nav-btn:hover { background: rgba(255,255,255,.07); color: #fff; }
  .nav-btn.active { background: rgba(108,99,255,.18); color: var(--sidebar-active); font-weight: 600; }
  .nav-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: .4; flex-shrink: 0; }
  .nav-btn.active .nav-dot { opacity: 1; background: #6c63ff; }
  .nav-ico { font-size: 14px; width: 18px; text-align: center; }
  .sidebar-footer { margin-top: auto; padding: 16px 12px; border-top: 1px solid rgba(255,255,255,.07); }
  .user-chip { display: flex; align-items: center; gap: 10px; }
  .avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg,#6c63ff,#e06c75);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .user-name { font-size: 12px; font-weight: 600; color: #fff; }
  .user-id { font-size: 10px; color: var(--sidebar-text); }

  /* MAIN */
  .main { margin-left: 240px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .topbar {
    height: 56px; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; position: sticky; top: 0; z-index: 50;
  }
  .menu-btn { display: none; background: none; border: none; font-size: 20px; cursor: pointer; margin-right: 8px; }
  .page-heading { font-size: 16px; font-weight: 700; color: var(--text); }
  .topbar-actions { display: flex; align-items: center; gap: 8px; }
  .role-tag {
    background: rgba(74,124,111,.12); color: var(--primary);
    font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 20px; letter-spacing: .5px;
  }
  .icon-btn { background: none; border: none; font-size: 16px; cursor: pointer; padding: 6px; border-radius: 8px; }
  .icon-btn:hover { background: var(--bg); }
  .content { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

  /* STATS */
  .stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 18px; position: relative; overflow: hidden;
  }
  .stat-accent-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 14px 14px 0 0; }
  .stat-card.sage .stat-accent-bar { background: #4A7C6F; }
  .stat-card.terra .stat-accent-bar { background: #8B6354; }
  .stat-card.slate .stat-accent-bar { background: #4A5568; }
  .stat-card.gold .stat-accent-bar { background: #B8860B; }
  .stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .stat-label { font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: .3px; }
  .stat-badge { font-size: 18px; }
  .stat-val { font-size: 28px; font-weight: 800; color: var(--text); line-height: 1; margin-bottom: 4px; }
  .stat-desc { font-size: 11px; color: var(--muted); }

  /* PANELS */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .panel-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 22px; border-bottom: 1px solid var(--border);
  }
  .panel-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; }
  .panel-title-ico { font-size: 16px; }

  /* TABLE */
  .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .data-table th {
    background: var(--bg); padding: 10px 16px; text-align: left;
    font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: .3px;
    border-bottom: 1px solid var(--border);
  }
  .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: var(--bg); }

  /* CHIPS & TAGS */
  .status-chip { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .chip-green { background: #e8f5e9; color: #2e7d32; }
  .chip-red { background: #ffebee; color: #c62828; }
  .code-tag {
    background: var(--bg); border: 1px solid var(--border);
    padding: 2px 8px; border-radius: 6px; font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
  }

  /* BUTTONS */
  .add-btn {
    background: var(--primary); color: #fff; border: none; border-radius: 8px;
    padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer;
  }
  .add-btn:hover { opacity: .9; }
  .action-btn {
    padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border);
    font-size: 11px; font-weight: 600; cursor: pointer; background: var(--surface);
  }
  .btn-primary { color: var(--primary); border-color: var(--primary); }
  .btn-slate { color: #4A5568; border-color: #4A5568; }
  .btn-danger { color: var(--danger); border-color: var(--danger); }

  /* TOOLBAR */
  .toolbar { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
  .search-box {
    flex: 1; min-width: 180px; padding: 8px 12px; border: 1px solid var(--border);
    border-radius: 8px; font-size: 13px; outline: none; background: var(--bg);
  }
  .filter-pill {
    padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border);
    background: var(--surface); font-size: 12px; font-weight: 600; cursor: pointer; color: var(--muted);
  }
  .filter-pill.active { background: var(--primary); color: #fff; border-color: var(--primary); }

  /* SETTINGS */
  .settings-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .settings-card-head { padding: 16px 22px; border-bottom: 1px solid var(--border); }
  .settings-card-title { font-size: 15px; font-weight: 700; }
  .settings-card-body { padding: 22px; display: flex; flex-direction: column; gap: 16px; }
  .settings-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .settings-row-label { font-size: 13px; font-weight: 600; color: var(--text); }
  .settings-input {
    padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px;
    font-size: 13px; outline: none; min-width: 220px;
  }
  .settings-save-btn {
    align-self: flex-start; background: var(--primary); color: #fff; border: none;
    border-radius: 8px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer;
  }
  .save-toast {
    position: fixed; bottom: 24px; right: 24px; background: #2e7d32; color: #fff;
    padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; z-index: 999;
  }

  /* OVERLAY & RESPONSIVE */
  .overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 99; }
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
    .overlay.show { display: block; }
    .main { margin-left: 0; }
    .menu-btn { display: block; }
    .stats-row { grid-template-columns: 1fr 1fr; }
    .grid-2 { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .stats-row { grid-template-columns: 1fr; }
  }
`;

function Toggle({ on, onToggle }) {
  return <div className={`toggle ${on ? "on" : ""}`} onClick={onToggle}><div className="toggle-thumb" /></div>;
}

// ── PAGES ──────────────────────────────────────────────────
function Overview() {
  const [stats, setStats] = useState({ totalStudents: 0, totalSubjects: 0, totalFaculty: 0, totalEnrollments: 0 });
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getAdminDashboard();
      if (data.success) {
        setStats(data.data.stats);
        setRecentStudents(data.data.recentStudents || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <>
      <div className="stats-row">
        {[
          { cl: "sage", ico: "👥", label: "Total Students", val: stats.totalStudents || 0, desc: "Active students" },
          { cl: "terra", ico: "📚", label: "Total Subjects", val: stats.totalSubjects || 0, desc: "This semester" },
          { cl: "slate", ico: "👨‍🏫", label: "Faculty Members", val: stats.totalFaculty || 0, desc: "All departments" },
          { cl: "gold", ico: "📋", label: "Enrollments", val: stats.totalEnrollments || 0, desc: "Across all subjects" },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cl}`}>
            <div className="stat-accent-bar" />
            <div className="stat-top"><div className="stat-label">{s.label}</div><div className="stat-badge">{s.ico}</div></div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-desc">{s.desc}</div>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><div className="panel-title-ico">👥</div>Recent Students</div>
          </div>
          <table className="data-table">
            <thead><tr><th>Student ID</th><th>Name</th><th>Program</th><th>Status</th></tr></thead>
            <tbody>
              {recentStudents.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: 'var(--muted)' }}>No students yet</td></tr>
              )}
              {recentStudents.map(s => (
                <tr key={s.id}>
                  <td><span className="code-tag">{s.studentId}</span></td>
                  <td style={{ fontWeight: 600 }}>{s.firstName} {s.lastName}</td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{s.program}</td>
                  <td><span className={`status-chip ${s.isActive ? "chip-green" : "chip-red"}`}>{s.isActive ? "active" : "inactive"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Students() {
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState("");
  const [f, setF] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentId: '', firstName: '', lastName: '', email: '',
    password: '', program: 'BS Computer Science', yearLevel: '1'
  });

  const fetchStudents = async () => {
    try {
      const data = await api.getStudents();
      if (data.success) setStudents(data.data);
      else setStudents([]);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const data = await api.createUser(formData);
      if (data.success) {
        setShowAddModal(false);
        fetchStudents();
        setFormData({ studentId: '', firstName: '', lastName: '', email: '', password: '', program: 'BS Computer Science', yearLevel: '1' });
        alert('Student added successfully!');
      } else {
        alert(data.message || 'Error adding student');
      }
    } catch (error) {
      alert('Failed to add student');
    }
  };

  const shown = students.filter(s => {
    const term = q.toLowerCase();
    const name = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
    const id = (s.studentId || '').toLowerCase();
    const program = (s.program || '').toLowerCase();
    const matches = name.includes(term) || id.includes(term) || program.includes(term);
    if (f === "Active") return matches && s.isActive === true;
    if (f === "Inactive") return matches && s.isActive === false;
    return matches;
  });

  if (loading) return <div className="panel"><div style={{ padding: 40, textAlign: 'center' }}>Loading students...</div></div>;

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title"><span>👥</span> Student Management</div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>＋ Add Student</button>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 24, width: 500, maxWidth: '90%' }}>
            <h3 style={{ marginBottom: 16 }}>Add New Student</h3>
            <form onSubmit={handleAddStudent}>
              {[
                { ph: 'Student ID', key: 'studentId' },
                { ph: 'First Name', key: 'firstName' },
                { ph: 'Last Name', key: 'lastName' },
                { ph: 'Email', key: 'email', type: 'email' },
                { ph: 'Password', key: 'password', type: 'password' },
              ].map(f => (
                <input key={f.key} type={f.type || 'text'}
                  style={{ width: '100%', marginBottom: 10, padding: 8, border: '1px solid #ccc', borderRadius: 8 }}
                  placeholder={f.ph} value={formData[f.key]}
                  onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} required />
              ))}
              <select style={{ width: '100%', marginBottom: 10, padding: 8, border: '1px solid #ccc', borderRadius: 8 }}
                value={formData.program} onChange={e => setFormData({ ...formData, program: e.target.value })}>
                <option>BS Computer Science</option>
                <option>BS Information Technology</option>
                <option>BS Information Systems</option>
                <option>BS Computer Engineering</option>
              </select>
              <select style={{ width: '100%', marginBottom: 10, padding: 8, border: '1px solid #ccc', borderRadius: 8 }}
                value={formData.yearLevel} onChange={e => setFormData({ ...formData, yearLevel: e.target.value })}>
                {[1, 2, 3, 4].map(y => <option key={y}>{y}</option>)}
              </select>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" style={{ flex: 1, padding: 10, background: '#4A7C6F', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Save</button>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: 10, background: '#ccc', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ padding: "16px 22px 0" }}>
        <div className="toolbar">
          <input className="search-box" placeholder="Search by name, ID, or program…" value={q} onChange={e => setQ(e.target.value)} />
          {["All", "Active", "Inactive"].map(fil => (
            <button key={fil} className={`filter-pill ${f === fil ? "active" : ""}`} onClick={() => setF(fil)}>{fil}</button>
          ))}
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr><th>Student ID</th><th>Name</th><th>Program</th><th>Year</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {shown.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--muted)' }}>No students found</td></tr>
          )}
          {shown.map(s => (
            <tr key={s.id}>
              <td><span className="code-tag">{s.studentId}</span></td>
              <td style={{ fontWeight: 600 }}>{s.firstName} {s.lastName}</td>
              <td style={{ fontSize: 12, color: "var(--muted)" }}>{s.program}</td>
              <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, textAlign: "center" }}>{s.yearLevel}</td>
              <td><span className={`status-chip ${s.isActive ? "chip-green" : "chip-red"}`}>{s.isActive ? "active" : "inactive"}</span></td>
              <td>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="action-btn btn-slate">View</button>
                  <button className="action-btn btn-primary">Edit</button>
                  {s.isActive && <button className="action-btn btn-danger">Deactivate</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: "12px 22px", fontSize: 12, color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
        Showing {shown.length} of {students.length} students
      </div>
    </div>
  );
}

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [q, setQ] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ code: '', name: '', description: '', units: '3', instructorName: '', maxSlots: '50' });

  const fetchSubjects = async () => {
    try {
      const data = await api.getSubjects();
      if (data.success) setSubjects(data.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      const data = await api.createSubject(formData);
      if (data.success) {
        setShowAddModal(false);
        fetchSubjects();
        setFormData({ code: '', name: '', description: '', units: '3', instructorName: '', maxSlots: '50' });
        alert('Subject added successfully!');
      } else {
        alert(data.message || 'Error adding subject');
      }
    } catch (error) {
      alert('Failed to add subject');
    }
  };

  const shown = subjects.filter(s =>
    s.name?.toLowerCase().includes(q.toLowerCase()) || s.code?.toLowerCase().includes(q.toLowerCase())
  );

  if (loading) return <div className="panel"><div style={{ padding: 40, textAlign: 'center' }}>Loading subjects...</div></div>;

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title"><span>📚</span> Subject Management</div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>＋ Add Subject</button>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 24, width: 500, maxWidth: '90%' }}>
            <h3 style={{ marginBottom: 16 }}>Add New Subject</h3>
            <form onSubmit={handleAddSubject}>
              <input style={{ width: '100%', marginBottom: 10, padding: 8, border: '1px solid #ccc', borderRadius: 8 }}
                placeholder="Subject Code (e.g., CS 301)" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} required />
              <input style={{ width: '100%', marginBottom: 10, padding: 8, border: '1px solid #ccc', borderRadius: 8 }}
                placeholder="Subject Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              <textarea style={{ width: '100%', marginBottom: 10, padding: 8, border: '1px solid #ccc', borderRadius: 8 }}
                placeholder="Description" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              <input style={{ width: '100%', marginBottom: 10, padding: 8, border: '1px solid #ccc', borderRadius: 8 }}
                placeholder="Units" type="number" value={formData.units} onChange={e => setFormData({ ...formData, units: e.target.value })} required />
              <input style={{ width: '100%', marginBottom: 10, padding: 8, border: '1px solid #ccc', borderRadius: 8 }}
                placeholder="Instructor Name" value={formData.instructorName} onChange={e => setFormData({ ...formData, instructorName: e.target.value })} />
              <input style={{ width: '100%', marginBottom: 10, padding: 8, border: '1px solid #ccc', borderRadius: 8 }}
                placeholder="Max Slots" type="number" value={formData.maxSlots} onChange={e => setFormData({ ...formData, maxSlots: e.target.value })} required />
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" style={{ flex: 1, padding: 10, background: '#4A7C6F', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Save</button>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: 10, background: '#ccc', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ padding: "16px 22px 0" }}>
        <div className="toolbar">
          <input className="search-box" placeholder="Search subjects…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr><th>Code</th><th>Subject Name</th><th>Instructor</th><th>Units</th><th>Slots</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {shown.length === 0 && (
            <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--muted)' }}>No subjects found</td></tr>
          )}
          {shown.map(s => (
            <tr key={s.id}>
              <td><span className="code-tag">{s.code}</span></td>
              <td style={{ fontWeight: 600 }}>{s.name}</td>
              <td style={{ fontSize: 12, color: "var(--muted)" }}>{s.instructorName || '—'}</td>
              <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, textAlign: "center" }}>{s.units}</td>
              <td style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>{s.currentSlots || 0}/{s.maxSlots || 0}</td>
              <td><span className={`status-chip ${s.isOpen ? "chip-green" : "chip-red"}`}>{s.isOpen ? "open" : "closed"}</span></td>
              <td><button className="action-btn btn-primary">Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FacultyPage() {
  return <div className="panel"><div className="panel-head"><div className="panel-title">👨‍🏫 Faculty Management</div></div><div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Coming soon...</div></div>;
}
function GradesAdmin() {
  return <div className="panel"><div className="panel-head"><div className="panel-title">◆ Grade Management</div></div><div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Coming soon...</div></div>;
}
function AnnouncementsPage() {
  return <div className="panel"><div className="panel-head"><div className="panel-title">◇ Announcements</div></div><div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Coming soon...</div></div>;
}
function AdminSettings({ user }) {
  const [toast, setToast] = useState(false);
  return (
    <div className="settings-card">
      <div className="settings-card-head"><div className="settings-card-title">Admin Settings</div></div>
      <div className="settings-card-body">
        <div className="settings-row">
          <div className="settings-row-label">Admin Name</div>
          <input className="settings-input" defaultValue={user?.firstName ? `${user.firstName} ${user.lastName}` : "Admin"} />
        </div>
        <div className="settings-row">
          <div className="settings-row-label">Email</div>
          <input className="settings-input" defaultValue={user?.email || "admin@acadtrack.edu"} />
        </div>
        <button className="settings-save-btn" onClick={() => { setToast(true); setTimeout(() => setToast(false), 2500); }}>Save Changes</button>
      </div>
      {toast && <div className="save-toast">✓ Changes saved successfully</div>}
    </div>
  );
}

// ── ROOT ────────────────────────────────────────────────────
const NAV = [
  { id: "overview", ico: "◈", label: "Overview" },
  { id: "students", ico: "◉", label: "Students" },
  { id: "subjects", ico: "◷", label: "Subjects" },
  { id: "faculty", ico: "◎", label: "Faculty" },
  { id: "grades", ico: "◆", label: "Grades" },
  { id: "announcements", ico: "◇", label: "Announcements" },
];

const TITLES = {
  overview: "Admin Overview", students: "Student Management", subjects: "Subject Management",
  faculty: "Faculty Management", grades: "Grade Management", announcements: "Announcements",
  settings: "Settings",
};

export default function AdminDashboard({ user, onLogout }) {
  const [page, setPage] = useState("overview");
  const [open, setOpen] = useState(false);
  const go = id => { setPage(id); setOpen(false); };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = S;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const initials = user?.firstName ? (user.firstName[0] || "") + (user.lastName?.[0] || "") : "AD";
  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ""}` : user?.name || "Admin";

  return (
    <div className="layout">
      <div className={`overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-box">A</div>
            <div className="logo-name">AcadTrack</div>
          </div>
          <div className="logo-sub">Academic Information System</div>
          <div className="role-badge">Administrator</div>
        </div>

        <div className="nav-group">
          <div className="nav-group-label">Management</div>
          {NAV.map(n => (
            <button key={n.id} className={`nav-btn ${page === n.id ? "active" : ""}`} onClick={() => go(n.id)}>
              <div className="nav-dot" />
              <span className="nav-ico">{n.ico}</span>
              {n.label}
            </button>
          ))}
        </div>

        <div className="nav-group" style={{ marginTop: 8 }}>
          <div className="nav-group-label">Account</div>
          <button className={`nav-btn ${page === "settings" ? "active" : ""}`} onClick={() => go("settings")}>
            <div className="nav-dot" /><span className="nav-ico">⚙</span>Settings
          </button>
          <button className="nav-btn" onClick={onLogout}>
            <div className="nav-dot" /><span className="nav-ico">⏻</span>Sign Out
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{initials}</div>
            <div>
              <div className="user-name">{displayName}</div>
              <div className="user-id">{user?.studentId || "ADMIN-001"}</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="menu-btn" onClick={() => setOpen(o => !o)}>☰</button>
            <div className="page-heading">{TITLES[page]}</div>
          </div>
          <div className="topbar-actions">
            <div className="role-tag">ADMIN</div>
            <button className="icon-btn">🔔</button>
            <button className="icon-btn" onClick={() => go("settings")}>⚙</button>
          </div>
        </header>

        <main className="content" key={page}>
          {page === "overview" && <Overview />}
          {page === "students" && <Students />}
          {page === "subjects" && <SubjectsPage />}
          {page === "faculty" && <FacultyPage />}
          {page === "grades" && <GradesAdmin />}
          {page === "announcements" && <AnnouncementsPage />}
          {page === "settings" && <AdminSettings user={user} />}
        </main>
      </div>
    </div>
  );
}