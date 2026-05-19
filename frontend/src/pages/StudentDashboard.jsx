import { useState, useEffect } from 'react';
import SettingsPage from './SettingsPage';

const API = 'http://localhost:5000/api';
const apiFetch = (path) => {
  const token = localStorage.getItem('token');
  return fetch(`${API}${path}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  }).then(r => r.json());
};

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat'];
const NAV = [
  { id:'dashboard', icon:'⊞', label:'Dashboard' },
  { id:'grades',    icon:'✦', label:'My Grades' },
  { id:'schedule',  icon:'◫', label:'Schedule' },
  { id:'subjects',  icon:'⊕', label:'Subjects' },
  { id:'announcements', icon:'◉', label:'Announcements' },
  { id:'settings',  icon:'◎', label:'Settings' },
];

export default function StudentDashboard({ user, onLogout }) {
  const [page, setPage]         = useState('dashboard');
  const [dashData, setDashData] = useState(null);
  const [grades, setGrades]     = useState([]);
  const [schedule, setSchedule] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]   = useState(true);

  const initials = `${user?.firstName?.[0]||''}${user?.lastName?.[0]||''}`.toUpperCase();

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [d, g, s, sub, ann] = await Promise.all([
        apiFetch('/dashboard/me'),
        apiFetch('/grades/me'),
        apiFetch('/schedule/me'),
        apiFetch('/subjects'),
        apiFetch('/announcements'),
      ]);
      if (d.success)   setDashData(d.data);
      if (g.success)   setGrades(g.data.grades || []);
      if (s.success)   setSchedule(s.data.timetable || {});
      if (sub.success) setSubjects(sub.data || []);
      if (ann.success) setAnnouncements(ann.data || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const gradeColor = (g) => {
    if (!g) return '#999';
    if (g <= 1.5) return '#10b981';
    if (g <= 2.0) return '#3b82f6';
    if (g <= 2.5) return '#f59e0b';
    if (g <= 3.0) return '#f97316';
    return '#ef4444';
  };

  const gradeLabel = (g) => {
    if (!g) return 'IP';
    if (g <= 1.5) return 'Excellent';
    if (g <= 2.0) return 'Very Good';
    if (g <= 2.5) return 'Good';
    if (g <= 3.0) return 'Satisfactory';
    return 'Failed';
  };

  return (
    <div style={s.root}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.brand}>
            <div style={s.brandIcon}>A</div>
            <span style={s.brandText}>AcadTrack</span>
          </div>
          <nav style={s.nav}>
            {NAV.map(n => (
              <button key={n.id} style={{...s.navBtn, ...(page===n.id ? s.navActive : {})}}
                onClick={() => setPage(n.id)}>
                <span style={s.navIcon}>{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div style={s.sideBottom}>
          <div style={s.userChip}>
            <div style={s.avatar}>{initials}</div>
            <div>
              <div style={s.userName}>{user?.firstName} {user?.lastName}</div>
              <div style={s.userRole}>Student · Gr. {user?.yearLevel}</div>
            </div>
          </div>
          <button style={s.logoutBtn} onClick={onLogout}>⏻ Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {loading && page !== 'settings' ? (
          <div style={s.loadWrap}><div style={s.spinner}/><p>Loading…</p></div>
        ) : (
          <>
            {/* ── DASHBOARD ── */}
            {page === 'dashboard' && dashData && (
              <div style={s.content}>
                <div style={s.pageHeader}>
                  <div>
                    <h2 style={s.pageTitle}>Welcome back, {user?.firstName}! 👋</h2>
                    <p style={s.pageSub}>Here's your academic overview</p>
                  </div>
                </div>

                {/* Stats */}
                <div style={s.statsGrid}>
                  {[
                    { label:'Enrolled Subjects', val: dashData.stats?.enrolledSubjects ?? '—', icon:'📚', color:'#6c63ff' },
                    { label:'Total Units',        val: dashData.stats?.enrolledUnits ?? '—',    icon:'⚡', color:'#10b981' },
                    { label:'Cumulative GPA',     val: dashData.stats?.cumulativeGpa ?? '—',    icon:'🎯', color:'#f59e0b' },
                    { label:'Completed Units',    val: dashData.stats?.totalCompletedUnits ?? '—', icon:'✅', color:'#3b82f6' },
                  ].map(stat => (
                    <div key={stat.label} style={s.statCard}>
                      <div style={{...s.statIcon, background:`${stat.color}20`, color:stat.color}}>{stat.icon}</div>
                      <div style={{...s.statVal, color:stat.color}}>{stat.val}</div>
                      <div style={s.statLabel}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div style={s.twoCol}>
                  {/* Today's Classes */}
                  <div style={s.card}>
                    <h3 style={s.cardTitle}>📅 Today's Classes <span style={s.badge}>{dashData.today}</span></h3>
                    {dashData.todayClasses?.length ? dashData.todayClasses.map((c,i) => (
                      <div key={i} style={s.classRow}>
                        <div style={s.classTime}>{c.startTime} – {c.endTime}</div>
                        <div>
                          <div style={s.className}>{c.code} · {c.name}</div>
                          <div style={s.classSub}>{c.room} · {c.instructor}</div>
                        </div>
                      </div>
                    )) : <p style={s.empty}>No classes today 🎉</p>}
                  </div>

                  {/* Announcements */}
                  <div style={s.card}>
                    <h3 style={s.cardTitle}>📢 Announcements</h3>
                    {dashData.announcements?.slice(0,4).map((a,i) => (
                      <div key={i} style={s.annRow}>
                        <div style={{...s.annDot, background: a.type==='exam'?'#ef4444':a.type==='deadline'?'#f97316':'#6c63ff'}}/>
                        <div>
                          <div style={s.annTitle}>{a.title}</div>
                          <div style={s.annType}>{a.type}</div>
                        </div>
                      </div>
                    )) || <p style={s.empty}>No announcements</p>}
                  </div>
                </div>

                {/* Current Subjects */}
                <div style={s.card}>
                  <h3 style={s.cardTitle}>📖 Current Subjects</h3>
                  <div style={s.subjectGrid}>
                    {dashData.currentSubjects?.map((sub,i) => (
                      <div key={i} style={s.subCard}>
                        <div style={s.subHeader}>
                          <span style={s.subCode}>{sub.code}</span>
                          {sub.grade && <span style={{...s.subGrade, color:gradeColor(sub.grade)}}>{sub.grade}</span>}
                        </div>
                        <div style={s.subName}>{sub.name}</div>
                        <div style={s.subInstr}>{sub.instructor}</div>
                        <div style={s.progressBar}>
                          <div style={{...s.progressFill, width:`${sub.progress||0}%`, background:gradeColor(sub.grade)}}/>
                        </div>
                        <div style={s.progressLabel}>{sub.progress||0}% progress</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── GRADES ── */}
            {page === 'grades' && (
              <div style={s.content}>
                <div style={s.pageHeader}>
                  <h2 style={s.pageTitle}>My Grades</h2>
                </div>
                <div style={s.card}>
                  <table style={s.table}>
                    <thead>
                      <tr>{['Subject Code','Subject Name','Units','Midterm','Final','Grade','Remarks','Progress'].map(h=>(
                        <th key={h} style={s.th}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {grades.length ? grades.map((g,i) => (
                        <tr key={i} style={i%2===0?{}:{background:'#f8f8ff'}}>
                          <td style={s.td}><b>{g.code}</b></td>
                          <td style={s.td}>{g.name}</td>
                          <td style={{...s.td,textAlign:'center'}}>{g.units}</td>
                          <td style={{...s.td,textAlign:'center'}}>{g.midtermGrade ?? '—'}</td>
                          <td style={{...s.td,textAlign:'center'}}>{g.finalGrade ?? '—'}</td>
                          <td style={{...s.td,textAlign:'center'}}>
                            <span style={{color:gradeColor(g.grade),fontWeight:700}}>{g.grade ?? 'IP'}</span>
                          </td>
                          <td style={s.td}>
                            <span style={{...s.pill, background:`${gradeColor(g.grade)}20`, color:gradeColor(g.grade)}}>
                              {g.remarks}
                            </span>
                          </td>
                          <td style={s.td}>
                            <div style={s.progressBar}>
                              <div style={{...s.progressFill, width:`${g.progress||0}%`, background:gradeColor(g.grade)}}/>
                            </div>
                            <span style={{fontSize:11,color:'#888'}}>{g.progress||0}%</span>
                          </td>
                        </tr>
                      )) : <tr><td colSpan={8} style={{...s.td,textAlign:'center',color:'#aaa'}}>No grade records found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── SCHEDULE ── */}
            {page === 'schedule' && (
              <div style={s.content}>
                <div style={s.pageHeader}>
                  <h2 style={s.pageTitle}>My Weekly Schedule</h2>
                </div>
                <div style={s.card}>
                  <div style={s.scheduleGrid}>
                    {DAYS.map(day => (
                      <div key={day} style={s.dayCol}>
                        <div style={s.dayHeader}>{day}</div>
                        {(schedule[day]||[]).length ? (schedule[day]||[]).map((c,i) => (
                          <div key={i} style={s.schedSlot}>
                            <div style={s.schedTime}>{c.startTime}–{c.endTime}</div>
                            <div style={s.schedCode}>{c.code}</div>
                            <div style={s.schedName}>{c.name}</div>
                            <div style={s.schedRoom}>📍 {c.room}</div>
                          </div>
                        )) : <div style={s.noClass}>—</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── SUBJECTS ── */}
            {page === 'subjects' && (
              <div style={s.content}>
                <div style={s.pageHeader}>
                  <h2 style={s.pageTitle}>Available Subjects</h2>
                </div>
                <div style={s.subjectGrid}>
                  {subjects.map((sub,i) => (
                    <div key={i} style={s.subCard}>
                      <div style={s.subHeader}>
                        <span style={s.subCode}>{sub.code}</span>
                        <span style={{...s.pill, background: sub.isOpen?'#d1fae5':'#fee2e2', color:sub.isOpen?'#065f46':'#991b1b'}}>
                          {sub.isOpen?'Open':'Closed'}
                        </span>
                      </div>
                      <div style={s.subName}>{sub.name}</div>
                      <div style={s.subInstr}>👨‍🏫 {sub.instructorName || 'TBA'}</div>
                      <div style={s.subInstr}>⚡ {sub.units} units · {sub.type}</div>
                      <div style={s.subInstr}>👥 {sub.currentSlots}/{sub.maxSlots} slots</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ANNOUNCEMENTS ── */}
            {page === 'announcements' && (
              <div style={s.content}>
                <div style={s.pageHeader}>
                  <h2 style={s.pageTitle}>Announcements</h2>
                </div>
                {announcements.map((a,i) => (
                  <div key={i} style={{...s.card, marginBottom:12, borderLeft:`4px solid ${a.type==='exam'?'#ef4444':a.type==='deadline'?'#f97316':'#6c63ff'}`}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      {a.isPinned && <span style={s.pin}>📌 Pinned</span>}
                      <span style={{...s.pill, background:'#f3f4f6',color:'#666'}}>{a.type}</span>
                    </div>
                    <h3 style={{margin:'0 0 6px',fontSize:16,color:'#1a1a2e'}}>{a.title}</h3>
                    <p style={{margin:0,fontSize:14,color:'#555',lineHeight:1.6}}>{a.body}</p>
                    <p style={{margin:'8px 0 0',fontSize:12,color:'#aaa'}}>
                      {a.postedBy ? `Posted by ${a.postedBy.firstName} ${a.postedBy.lastName}` : ''} · {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ── SETTINGS ── */}
            {page === 'settings' && (
              <SettingsPage user={user} onBack={() => setPage('dashboard')} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

const s = {
  root:     { display:'flex', minHeight:'100vh', fontFamily:"'Segoe UI',sans-serif", background:'#f0f2f8' },
  sidebar:  { width:240, background:'#1a1a2e', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'0 0 16px', flexShrink:0 },
  sideTop:  { display:'flex', flexDirection:'column' },
  brand:    { display:'flex', alignItems:'center', gap:10, padding:'20px 20px 16px' },
  brandIcon:{ width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#6c63ff,#e06c75)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,color:'#fff' },
  brandText:{ fontSize:18,fontWeight:800,color:'#fff',letterSpacing:-0.3 },
  nav:      { display:'flex', flexDirection:'column', gap:4, padding:'0 12px' },
  navBtn:   { display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,border:'none',cursor:'pointer',background:'transparent',color:'rgba(255,255,255,0.65)',fontSize:14,fontWeight:500,textAlign:'left',transition:'all .15s' },
  navActive:{ background:'rgba(108,99,255,0.25)',color:'#fff' },
  navIcon:  { fontSize:16,width:20,textAlign:'center' },
  sideBottom:{ padding:'0 12px' },
  userChip: { display:'flex',alignItems:'center',gap:10,padding:'12px',background:'rgba(255,255,255,0.07)',borderRadius:12,marginBottom:8 },
  avatar:   { width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#6c63ff,#e06c75)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff',flexShrink:0 },
  userName: { fontSize:13,fontWeight:600,color:'#fff' },
  userRole: { fontSize:11,color:'rgba(255,255,255,0.5)' },
  logoutBtn:{ width:'100%',padding:'9px',borderRadius:10,border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'rgba(255,255,255,0.6)',fontSize:13,cursor:'pointer' },
  main:     { flex:1, overflow:'auto', padding:0 },
  loadWrap: { display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:16,color:'#888' },
  spinner:  { width:40,height:40,border:'3px solid #e0e0e0',borderTop:'3px solid #6c63ff',borderRadius:'50%',animation:'spin 0.8s linear infinite' },
  content:  { padding:32 },
  pageHeader:{ marginBottom:28 },
  pageTitle:{ margin:'0 0 4px',fontSize:26,fontWeight:800,color:'#1a1a2e' },
  pageSub:  { margin:0,fontSize:14,color:'#888' },
  statsGrid:{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24 },
  statCard: { background:'#fff',borderRadius:16,padding:20,boxShadow:'0 2px 12px rgba(0,0,0,0.06)',textAlign:'center' },
  statIcon: { width:48,height:48,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,margin:'0 auto 12px' },
  statVal:  { fontSize:28,fontWeight:800,marginBottom:4 },
  statLabel:{ fontSize:12,color:'#888' },
  twoCol:   { display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:24 },
  card:     { background:'#fff',borderRadius:16,padding:24,boxShadow:'0 2px 12px rgba(0,0,0,0.06)',marginBottom:0 },
  cardTitle:{ margin:'0 0 16px',fontSize:16,fontWeight:700,color:'#1a1a2e',display:'flex',alignItems:'center',gap:8 },
  badge:    { background:'#f0edff',color:'#6c63ff',fontSize:11,padding:'2px 8px',borderRadius:20,fontWeight:600 },
  classRow: { display:'flex',alignItems:'flex-start',gap:12,padding:'10px 0',borderBottom:'1px solid #f5f5f5' },
  classTime:{ fontSize:11,color:'#6c63ff',fontWeight:600,whiteSpace:'nowrap',background:'#f0edff',padding:'3px 7px',borderRadius:6 },
  className:{ fontSize:13,fontWeight:600,color:'#1a1a2e' },
  classSub: { fontSize:12,color:'#888' },
  annRow:   { display:'flex',alignItems:'flex-start',gap:10,padding:'8px 0',borderBottom:'1px solid #f5f5f5' },
  annDot:   { width:8,height:8,borderRadius:'50%',flexShrink:0,marginTop:5 },
  annTitle: { fontSize:13,fontWeight:600,color:'#1a1a2e' },
  annType:  { fontSize:11,color:'#aaa',textTransform:'capitalize' },
  subjectGrid:{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:16 },
  subCard:  { background:'#fff',borderRadius:16,padding:20,boxShadow:'0 2px 12px rgba(0,0,0,0.06)' },
  subHeader:{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 },
  subCode:  { fontSize:12,fontWeight:700,color:'#6c63ff',background:'#f0edff',padding:'2px 8px',borderRadius:6 },
  subGrade: { fontSize:20,fontWeight:800 },
  subName:  { fontSize:14,fontWeight:600,color:'#1a1a2e',marginBottom:4 },
  subInstr: { fontSize:12,color:'#888',marginBottom:2 },
  progressBar:{ height:6,background:'#f0f0f0',borderRadius:99,overflow:'hidden',marginTop:8,marginBottom:2 },
  progressFill:{ height:'100%',borderRadius:99,transition:'width .3s' },
  progressLabel:{ fontSize:11,color:'#aaa' },
  table:    { width:'100%',borderCollapse:'collapse',fontSize:14 },
  th:       { padding:'10px 12px',textAlign:'left',fontSize:12,color:'#888',fontWeight:600,borderBottom:'2px solid #f0f0f0',whiteSpace:'nowrap' },
  td:       { padding:'10px 12px',borderBottom:'1px solid #f5f5f5',color:'#333',verticalAlign:'middle' },
  pill:     { fontSize:11,padding:'3px 9px',borderRadius:99,fontWeight:600,display:'inline-block' },
  scheduleGrid:{ display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:12,overflowX:'auto' },
  dayCol:   { minWidth:120 },
  dayHeader:{ background:'#1a1a2e',color:'#fff',textAlign:'center',padding:'8px',borderRadius:'8px 8px 0 0',fontSize:13,fontWeight:700 },
  schedSlot:{ background:'#f0edff',borderRadius:8,padding:10,marginTop:4,borderLeft:'3px solid #6c63ff' },
  schedTime:{ fontSize:10,color:'#6c63ff',fontWeight:700,marginBottom:2 },
  schedCode:{ fontSize:12,fontWeight:700,color:'#1a1a2e' },
  schedName:{ fontSize:11,color:'#555' },
  schedRoom:{ fontSize:11,color:'#888',marginTop:2 },
  noClass:  { textAlign:'center',color:'#ccc',padding:'20px 0',fontSize:20 },
  pin:      { fontSize:11,color:'#f59e0b',fontWeight:600 },
  empty:    { color:'#aaa',fontSize:13,textAlign:'center',padding:'20px 0' },
};