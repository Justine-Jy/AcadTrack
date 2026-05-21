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
  const [faculty, setFaculty] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ studentId: '', firstName: '', lastName: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);

  const fetchFaculty = async () => {
    try {
      const data = await api.getFacultyList();
      if (data.success) setFaculty(data.data);
    } catch (e) {
      console.error('Error fetching faculty:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaculty(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await api.createUser({ ...form, role: 'faculty' });
      if (data.success) {
        setShowModal(false);
        setForm({ studentId: '', firstName: '', lastName: '', email: '', password: '' });
        fetchFaculty();
      } else {
        alert(data.message || 'Error adding faculty');
      }
    } catch (err) {
      alert(err.message || 'Failed to add faculty');
    } finally {
      setSaving(false);
    }
  };

  const shown = faculty.filter(f =>
    `${f.firstName} ${f.lastName} ${f.studentId} ${f.email}`
      .toLowerCase().includes(q.toLowerCase())
  );

  if (loading) return <div className="panel"><div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Loading faculty...</div></div>;

  return (
    <>
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 460, maxWidth: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 700 }}>Add Faculty Member</h3>
            <form onSubmit={handleAdd}>
              {[
                { key: 'studentId', label: 'Faculty ID', placeholder: 'e.g. FAC-001' },
                { key: 'firstName', label: 'First Name', placeholder: 'First name' },
                { key: 'lastName',  label: 'Last Name',  placeholder: 'Last name' },
                { key: 'email',     label: 'Email',      placeholder: 'email@school.edu', type: 'email' },
                { key: 'password',  label: 'Password',   placeholder: 'Temporary password', type: 'password' },
              ].map(({ key, label, placeholder, type = 'text' }) => (
                <div key={key} style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 4 }}>{label}</label>
                  <input
                    type={type} required placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--bg)' }}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="submit" disabled={saving}
                  style={{ flex: 1, padding: 10, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                  {saving ? 'Adding…' : 'Add Faculty'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: 10, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">👨‍🏫 Faculty Management</div>
          <button className="add-btn" onClick={() => setShowModal(true)}>＋ Add Faculty</button>
        </div>
        <div style={{ padding: '14px 22px 0' }}>
          <div className="toolbar">
            <input className="search-box" placeholder="Search by name, ID, or email…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Faculty ID</th><th>Name</th><th>Email</th><th>Status</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {shown.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>No faculty members found</td></tr>
            )}
            {shown.map(f => (
              <tr key={f.id}>
                <td><span className="code-tag">{f.studentId}</span></td>
                <td style={{ fontWeight: 600 }}>{f.firstName} {f.lastName}</td>
                <td style={{ fontSize: 12, color: 'var(--muted)' }}>{f.email}</td>
                <td><span className={`status-chip ${f.isActive ? 'chip-green' : 'chip-red'}`}>{f.isActive ? 'active' : 'inactive'}</span></td>
                <td style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(f.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '10px 22px', fontSize: 12, color: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
          Showing {shown.length} of {faculty.length} faculty members
        </div>
      </div>
    </>
  );
}

function GradesAdmin() {
  const [report, setReport] = useState([]);
  const [selected, setSelected] = useState(null);
  const [subjectGrades, setSubjectGrades] = useState([]);
  const [loadingReport, setLoadingReport] = useState(true);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [editing, setEditing] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getGradesReport()
      .then(d => { if (d.success) setReport(d.data); })
      .catch(console.error)
      .finally(() => setLoadingReport(false));
  }, []);

  const openSubject = async (subj) => {
    setSelected(subj);
    setLoadingGrades(true);
    try {
      const d = await api.getSubjectGrades(subj.id);  // GET /api/grades/subject/:id
      if (d.success) setSubjectGrades(d.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGrades(false);
    }
  };

  const saveGrade = async (gradeId) => {
    if (!editing[gradeId]) return;
    setSaving(true);
    try {
      await api.postGrade(gradeId, editing[gradeId]);
      const d = await api.getSubjectGrades(selected.id);
      if (d.success) setSubjectGrades(d.data);
      setEditing(prev => { const n = { ...prev }; delete n[gradeId]; return n; });
    } catch (e) {
      alert(e.message || 'Failed to save grade');
    } finally {
      setSaving(false);
    }
  };

  if (loadingReport) return <div className="panel"><div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Loading grades...</div></div>;

  if (selected) {
    return (
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">
            <button onClick={() => setSelected(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, marginRight: 4, color: 'var(--muted)' }}>←</button>
            ◆ {selected.code} — {selected.name}
          </div>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{subjectGrades.length} students enrolled</span>
        </div>
        {loadingGrades ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Loading student grades...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Student ID</th><th>Name</th><th>Midterm</th><th>Final</th><th>Grade</th><th>Remarks</th><th>Action</th></tr>
            </thead>
            <tbody>
              {subjectGrades.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>No grade records</td></tr>
              )}
              {subjectGrades.map(g => {
                const ed = editing[g.id] || {};
                return (
                  <tr key={g.id}>
                    <td><span className="code-tag">{g.studentId}</span></td>
                    <td style={{ fontWeight: 600 }}>{g.firstName} {g.lastName}</td>
                    <td>
                      <input type="number" step="0.25" min="1" max="5" placeholder="—"
                        defaultValue={g.midtermGrade ?? ''}
                        onChange={e => setEditing(prev => ({ ...prev, [g.id]: { ...prev[g.id], midtermGrade: e.target.value } }))}
                        style={{ width: 60, padding: '4px 6px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, textAlign: 'center' }}
                      />
                    </td>
                    <td>
                      <input type="number" step="0.25" min="1" max="5" placeholder="—"
                        defaultValue={g.finalGrade ?? ''}
                        onChange={e => setEditing(prev => ({ ...prev, [g.id]: { ...prev[g.id], finalGrade: e.target.value } }))}
                        style={{ width: 60, padding: '4px 6px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, textAlign: 'center' }}
                      />
                    </td>
                    <td>
                      <input type="number" step="0.25" min="1" max="5" placeholder="—"
                        defaultValue={g.grade ?? ''}
                        onChange={e => setEditing(prev => ({ ...prev, [g.id]: { ...prev[g.id], grade: e.target.value } }))}
                        style={{ width: 60, padding: '4px 6px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, textAlign: 'center', fontWeight: 700 }}
                      />
                    </td>
                    <td>
                      <span className={`status-chip ${!g.grade ? '' : g.grade <= 3.0 ? 'chip-green' : 'chip-red'}`}>
                        {g.remarks || 'In Progress'}
                      </span>
                    </td>
                    <td>
                      {editing[g.id] && (
                        <button className="action-btn btn-primary" disabled={saving} onClick={() => saveGrade(g.id)}>
                          {saving ? '…' : 'Save'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title">◆ Grade Management</div>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>Click a subject to manage grades</span>
      </div>
      <table className="data-table">
        <thead>
          <tr><th>Code</th><th>Subject</th><th>Students</th><th>Avg Grade</th><th>Pass Rate</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {report.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>No grade data available</td></tr>
          )}
          {report.map(r => (
            <tr key={r.id}>
              <td><span className="code-tag">{r.code}</span></td>
              <td style={{ fontWeight: 600 }}>{r.name}</td>
              <td style={{ fontSize: 12, fontFamily: 'monospace', textAlign: 'center' }}>{r.count}</td>
              <td style={{ fontWeight: 700, color: r.avgGrade <= 3.0 ? '#2e7d32' : '#c62828' }}>
                {r.avgGrade ?? '—'}
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${r.passRate || 0}%`, background: '#4A7C6F', borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--muted)', minWidth: 32 }}>{r.passRate ?? 0}%</span>
                </div>
              </td>
              <td>
                <button className="action-btn btn-primary" onClick={() => openSubject(r)}>Manage</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', type: 'general', targetAudience: 'all', expiresAt: '' });

  const TYPE_COLORS = { exam: '#c62828', deadline: '#e65100', general: '#1565c0', event: '#6a1b9a' };

  const fetchAnnouncements = async () => {
    try {
      const d = await api.getAnnouncements();
      if (d.success) setAnnouncements(d.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, expiresAt: form.expiresAt || null };
      const d = await api.createAnnouncement(payload);
      if (d.success) {
        setShowModal(false);
        setForm({ title: '', content: '', type: 'general', targetAudience: 'all', expiresAt: '' });
        fetchAnnouncements();
      } else {
        alert(d.message || 'Error creating announcement');
      }
    } catch (err) {
      alert(err.message || 'Failed to create announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await api.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      alert('Failed to delete announcement');
    }
  };

  if (loading) return <div className="panel"><div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Loading announcements...</div></div>;

  return (
    <>
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 500, maxWidth: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 700 }}>New Announcement</h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 4 }}>Title</label>
                <input required placeholder="Announcement title"
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--bg)' }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 4 }}>Content</label>
                <textarea required rows={4} placeholder="Announcement body…"
                  value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--bg)', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 4 }}>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, background: 'var(--bg)' }}>
                    <option value="general">General</option>
                    <option value="exam">Exam</option>
                    <option value="deadline">Deadline</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 4 }}>Audience</label>
                  <select value={form.targetAudience} onChange={e => setForm({ ...form, targetAudience: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, background: 'var(--bg)' }}>
                    <option value="all">Everyone</option>
                    <option value="students">Students only</option>
                    <option value="faculty">Faculty only</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 4 }}>Expires At (optional)</label>
                <input type="datetime-local" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, background: 'var(--bg)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" disabled={saving}
                  style={{ flex: 1, padding: 10, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                  {saving ? 'Posting…' : 'Post Announcement'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: 10, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">◇ Announcements</div>
          <button className="add-btn" onClick={() => setShowModal(true)}>＋ New Announcement</button>
        </div>

        {announcements.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>No announcements yet</div>
        ) : (
          <div style={{ padding: '8px 0' }}>
            {announcements.map(a => (
              <div key={a.id} style={{
                padding: '16px 22px', borderBottom: '1px solid var(--border)',
                borderLeft: `3px solid ${TYPE_COLORS[a.type] || '#4A5568'}`,
                display: 'flex', gap: 16, alignItems: 'flex-start'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    {a.isPinned && <span style={{ fontSize: 11, fontWeight: 700, color: '#B8860B', background: '#fffbe6', padding: '1px 7px', borderRadius: 20 }}>📌 Pinned</span>}
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
                      background: `${TYPE_COLORS[a.type] || '#4A5568'}15`,
                      color: TYPE_COLORS[a.type] || '#4A5568',
                      textTransform: 'capitalize'
                    }}>{a.type || 'general'}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {a.targetAudience === 'all' ? 'Everyone' : a.targetAudience}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{a.content || a.body}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
                    {new Date(a.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button className="action-btn btn-danger" onClick={() => handleDelete(a.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
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