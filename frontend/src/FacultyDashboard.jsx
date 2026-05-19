import { useState } from "react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --white:#F0EDE6; --white2:#E8E4DC; --ink:#1A1A1F; --ink2:#2E2E36; --ink3:#45454F;
  --sage:#4A7C6F; --sage2:#5E9E8F; --sage3:#D4EAE5;
  --terra:#C46D52; --terra2:#E08A6E; --terra3:#F5DDD6;
  --slate:#3D5A8A; --slate2:#5275A8; --slate3:#D0DAF0;
  --purple:#6B4E8A; --purple2:#8B6EAA; --purple3:#EDE3F5;
  --muted:#9E9B94; --border:#D8D4CB;
  --shadow:0 2px 12px rgba(26,26,31,0.08); --shadow2:0 8px 32px rgba(26,26,31,0.12);
  --r:12px; --r2:18px;
}
html { font-size:16px; }
body { background:var(--white); color:var(--ink); font-family:'Outfit',sans-serif; -webkit-font-smoothing:antialiased; }
.layout { display:flex; min-height:100vh; }

.sidebar { width:260px; flex-shrink:0; background:var(--ink); display:flex; flex-direction:column; position:fixed; inset:0 auto 0 0; z-index:100; transition:transform 0.3s cubic-bezier(.4,0,.2,1); }
.sidebar-logo { padding:32px 28px 24px; border-bottom:1px solid rgba(240,237,230,0.08); }
.logo-mark { display:flex; align-items:center; gap:10px; margin-bottom:4px; }
.logo-box { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,var(--slate),var(--purple)); display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-weight:700; font-size:18px; color:white; flex-shrink:0; }
.logo-name { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:700; color:var(--white); letter-spacing:-0.3px; }
.logo-sub { font-size:9.5px; color:rgba(240,237,230,0.35); letter-spacing:2.5px; text-transform:uppercase; margin-left:46px; }
.role-badge { display:inline-block; margin-top:6px; margin-left:46px; font-size:9px; padding:2px 8px; border-radius:4px; background:rgba(107,78,138,0.2); color:var(--purple2); text-transform:uppercase; letter-spacing:1.5px; font-weight:700; }

.nav-group { padding:20px 16px 0; }
.nav-group-label { font-size:9px; letter-spacing:2.5px; text-transform:uppercase; color:rgba(240,237,230,0.25); padding:0 12px; margin-bottom:6px; }
.nav-btn { width:100%; display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:10px; color:rgba(240,237,230,0.5); font-size:13.5px; font-weight:500; cursor:pointer; border:none; background:none; font-family:'Outfit',sans-serif; transition:all 0.15s; text-align:left; margin-bottom:2px; }
.nav-btn:hover { background:rgba(240,237,230,0.06); color:rgba(240,237,230,0.85); }
.nav-btn.active { background:rgba(107,78,138,0.2); color:var(--purple2); }
.nav-btn.active .nav-dot { background:var(--purple2); }
.nav-dot { width:7px; height:7px; border-radius:50%; background:rgba(240,237,230,0.2); flex-shrink:0; transition:background 0.15s; }
.nav-ico { font-size:15px; width:20px; text-align:center; flex-shrink:0; }
.sidebar-footer { margin-top:auto; padding:16px; border-top:1px solid rgba(240,237,230,0.07); }
.user-chip { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:12px; background:rgba(240,237,230,0.05); border:1px solid rgba(240,237,230,0.08); }
.avatar { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,var(--slate),var(--purple)); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:white; flex-shrink:0; font-family:'Outfit',sans-serif; }
.user-name { font-size:13px; font-weight:600; color:var(--white); }
.user-id { font-size:10.5px; color:rgba(240,237,230,0.35); font-family:'JetBrains Mono',monospace; }

.main { margin-left:260px; flex:1; display:flex; flex-direction:column; min-height:100vh; background:var(--white); }
.topbar { background:var(--white); border-bottom:1px solid var(--border); height:64px; padding:0 36px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:50; }
.page-heading { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:700; color:var(--ink); letter-spacing:-0.5px; }
.topbar-actions { display:flex; align-items:center; gap:10px; }
.role-tag { font-size:11px; font-weight:700; padding:5px 14px; border-radius:20px; background:var(--purple3); color:var(--purple); font-family:'JetBrains Mono',monospace; letter-spacing:0.3px; border:1px solid var(--purple2); }
.icon-btn { width:38px; height:38px; border-radius:10px; border:1.5px solid var(--border); background:white; color:var(--ink3); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:15px; transition:all 0.15s; }
.icon-btn:hover { border-color:var(--slate); color:var(--slate); background:var(--slate3); }
.menu-btn { display:none; width:38px; height:38px; border-radius:10px; border:1.5px solid var(--border); background:white; cursor:pointer; font-size:18px; align-items:center; justify-content:center; }
.content { padding:32px 36px; flex:1; }

.stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
.stat-card { background:white; border:1.5px solid var(--border); border-radius:var(--r2); padding:22px 20px; position:relative; overflow:hidden; transition:transform 0.2s,box-shadow 0.2s; }
.stat-card:hover { transform:translateY(-3px); box-shadow:var(--shadow2); }
.stat-accent-bar { position:absolute; top:0; left:0; right:0; height:3.5px; border-radius:var(--r2) var(--r2) 0 0; }
.stat-card.sage .stat-accent-bar { background:linear-gradient(90deg,var(--sage),var(--sage2)); }
.stat-card.terra .stat-accent-bar { background:linear-gradient(90deg,var(--terra),var(--terra2)); }
.stat-card.slate .stat-accent-bar { background:linear-gradient(90deg,var(--slate),var(--slate2)); }
.stat-card.purple .stat-accent-bar { background:linear-gradient(90deg,var(--purple),var(--purple2)); }
.stat-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; }
.stat-label { font-size:10.5px; text-transform:uppercase; letter-spacing:1.5px; color:var(--muted); font-weight:600; }
.stat-badge { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:15px; }
.stat-card.sage .stat-badge { background:var(--sage3); }
.stat-card.terra .stat-badge { background:var(--terra3); }
.stat-card.slate .stat-badge { background:var(--slate3); }
.stat-card.purple .stat-badge { background:var(--purple3); }
.stat-val { font-family:'Cormorant Garamond',serif; font-size:38px; font-weight:700; color:var(--ink); line-height:1; margin-bottom:5px; }
.stat-desc { font-size:11.5px; color:var(--muted); }

.panel { background:white; border:1.5px solid var(--border); border-radius:var(--r2); overflow:hidden; box-shadow:var(--shadow); margin-bottom:24px; }
.panel-head { padding:18px 22px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
.panel-title { font-size:14px; font-weight:700; color:var(--ink); display:flex; align-items:center; gap:8px; }
.panel-title-ico { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:13px; }
.ico-sage { background:var(--sage3); } .ico-terra { background:var(--terra3); } .ico-slate { background:var(--slate3); } .ico-purple { background:var(--purple3); }
.panel-link { font-size:12px; font-weight:600; color:var(--slate); cursor:pointer; }
.panel-link:hover { text-decoration:underline; }

.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; }

.data-table { width:100%; border-collapse:collapse; }
.data-table th { padding:10px 20px; text-align:left; font-size:9.5px; text-transform:uppercase; letter-spacing:1.5px; color:var(--muted); font-weight:700; border-bottom:1px solid var(--border); }
.data-table td { padding:12px 20px; font-size:13px; border-bottom:1px solid var(--white2); vertical-align:middle; }
.data-table tr:last-child td { border-bottom:none; }
.data-table tbody tr { transition:background 0.12s; }
.data-table tbody tr:hover td { background:var(--white); }
.code-tag { font-family:'JetBrains Mono',monospace; font-size:10.5px; padding:3px 9px; border-radius:6px; background:var(--slate3); color:var(--slate); font-weight:500; white-space:nowrap; }
.status-chip { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; }
.chip-green { background:var(--sage3); color:var(--sage); }
.chip-red { background:var(--terra3); color:var(--terra); }
.chip-blue { background:var(--slate3); color:var(--slate); }
.chip-purple { background:var(--purple3); color:var(--purple); }

.toolbar { display:flex; gap:10px; margin-bottom:18px; flex-wrap:wrap; }
.search-box { flex:1; min-width:200px; background:white; border:1.5px solid var(--border); border-radius:10px; padding:9px 14px; font-size:13.5px; font-family:'Outfit',sans-serif; color:var(--ink); outline:none; transition:border-color 0.15s; }
.search-box:focus { border-color:var(--slate); }
.search-box::placeholder { color:var(--muted); }
.filter-pill { padding:9px 18px; border-radius:10px; border:1.5px solid var(--border); background:white; font-size:12.5px; font-weight:600; color:var(--ink3); cursor:pointer; font-family:'Outfit',sans-serif; transition:all 0.15s; }
.filter-pill:hover { border-color:var(--slate); color:var(--slate); }
.filter-pill.active { background:var(--slate); border-color:var(--slate); color:white; }
.action-btn { padding:6px 14px; border-radius:8px; border:1.5px solid; font-size:12px; font-weight:700; cursor:pointer; font-family:'Outfit',sans-serif; transition:all 0.15s; }
.btn-primary { border-color:var(--sage); background:var(--sage3); color:var(--sage); }
.btn-primary:hover { background:var(--sage); color:white; }
.btn-slate { border-color:var(--slate); background:var(--slate3); color:var(--slate); }
.btn-slate:hover { background:var(--slate); color:white; }

.grade-input { width:70px; background:var(--white); border:1.5px solid var(--border); border-radius:7px; padding:6px 10px; font-size:13px; font-family:'JetBrains Mono',monospace; color:var(--ink); outline:none; transition:border-color 0.15s; text-align:center; }
.grade-input:focus { border-color:var(--slate); }
.save-grades-btn { padding:10px 24px; border-radius:10px; border:none; background:var(--slate); color:white; font-size:13px; font-weight:700; font-family:'Outfit',sans-serif; cursor:pointer; transition:background 0.15s; }
.save-grades-btn:hover { background:var(--slate2); }

.sched-list { padding:6px 0; }
.sched-row { display:flex; align-items:center; gap:14px; padding:11px 22px; border-bottom:1px solid var(--white2); transition:background 0.12s; }
.sched-row:last-child { border-bottom:none; }
.sched-row:hover { background:var(--white); }
.sched-time { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--muted); width:65px; flex-shrink:0; }
.sched-color { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.sched-info { flex:1; }
.sched-subj { font-size:13px; font-weight:600; color:var(--ink); }
.sched-room { font-size:11px; color:var(--muted); }
.sched-type { font-size:10px; padding:2px 9px; border-radius:5px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; }
.type-lec { background:var(--slate3); color:var(--slate); }
.type-lab { background:var(--sage3); color:var(--sage); }

/* Settings */
.settings-grid { display:grid; grid-template-columns:220px 1fr; gap:24px; }
.settings-nav { display:flex; flex-direction:column; gap:4px; }
.settings-nav-btn { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; border:none; background:none; font-family:'Outfit',sans-serif; font-size:13px; font-weight:500; color:var(--ink3); cursor:pointer; text-align:left; width:100%; transition:all 0.15s; }
.settings-nav-btn:hover { background:var(--white2); color:var(--ink); }
.settings-nav-btn.active { background:var(--purple3); color:var(--purple); font-weight:600; }
.settings-card { background:white; border:1.5px solid var(--border); border-radius:var(--r2); overflow:hidden; box-shadow:var(--shadow); }
.settings-card-head { padding:18px 24px; border-bottom:1px solid var(--border); }
.settings-card-title { font-size:14px; font-weight:700; color:var(--ink); margin-bottom:3px; }
.settings-card-sub { font-size:12px; color:var(--muted); }
.settings-card-body { padding:24px; display:flex; flex-direction:column; gap:18px; }
.settings-row { display:flex; align-items:center; justify-content:space-between; gap:20px; }
.settings-row-label { font-size:13px; font-weight:600; color:var(--ink); }
.settings-row-desc { font-size:11.5px; color:var(--muted); margin-top:2px; }
.settings-input { flex:1; background:var(--white); border:1.5px solid var(--border); border-radius:9px; padding:9px 14px; font-size:13px; font-family:'Outfit',sans-serif; color:var(--ink); outline:none; transition:border-color 0.15s; min-width:0; }
.settings-input:focus { border-color:var(--slate); }
.settings-input:disabled { opacity:0.5; cursor:not-allowed; }
.settings-select { flex:1; background:var(--white); border:1.5px solid var(--border); border-radius:9px; padding:9px 14px; font-size:13px; font-family:'Outfit',sans-serif; color:var(--ink); outline:none; cursor:pointer; }
.toggle { width:44px; height:24px; border-radius:12px; background:var(--border); position:relative; transition:background 0.2s; flex-shrink:0; cursor:pointer; }
.toggle.on { background:var(--slate); }
.toggle-thumb { position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:white; transition:left 0.2s; box-shadow:0 1px 4px rgba(0,0,0,0.15); }
.toggle.on .toggle-thumb { left:23px; }
.settings-save-btn { align-self:flex-start; padding:10px 24px; border-radius:10px; border:none; background:var(--slate); color:white; font-size:13px; font-weight:700; font-family:'Outfit',sans-serif; cursor:pointer; transition:background 0.15s; }
.settings-save-btn:hover { background:var(--slate2); }
.settings-divider { border:none; border-top:1px solid var(--border); margin:0; }
.save-toast { position:fixed; bottom:28px; right:28px; background:var(--ink); color:white; padding:12px 20px; border-radius:12px; font-size:13px; font-weight:600; box-shadow:var(--shadow2); animation:fadeUp 0.3s ease; z-index:200; }

.week-scroll { overflow-x:auto; }
.week-table { width:100%; border-collapse:collapse; min-width:640px; }
.week-table th { padding:12px 8px; text-align:center; font-size:10px; text-transform:uppercase; letter-spacing:1.5px; color:var(--muted); font-weight:700; border-bottom:1.5px solid var(--border); background:var(--white); }
.week-table td { border:1px solid var(--white2); vertical-align:top; padding:4px; height:56px; font-size:11px; }
.week-table td:first-child { width:64px; text-align:center; padding-top:8px; font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--muted); background:var(--white); border-right:1.5px solid var(--border); }
.class-blk { border-radius:7px; padding:5px 8px; height:100%; display:flex; flex-direction:column; justify-content:center; }
.blk-name { font-size:11px; font-weight:700; }
.blk-room { font-size:9.5px; margin-top:1px; opacity:0.7; }

@media (max-width:1100px) { .stats-row { grid-template-columns:repeat(2,1fr); } .grid-2 { grid-template-columns:1fr; } .settings-grid { grid-template-columns:1fr; } }
@media (max-width:860px) { .sidebar { transform:translateX(-100%); } .sidebar.open { transform:translateX(0); } .main { margin-left:0; } .menu-btn { display:flex; } .content { padding:20px 18px; } .topbar { padding:0 18px; } }
@media (max-width:600px) { .stats-row { grid-template-columns:1fr 1fr; gap:10px; } }

.overlay { display:none; position:fixed; inset:0; background:rgba(26,26,31,0.4); z-index:99; }
.overlay.show { display:block; }
@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
.content > * { animation:fadeUp 0.3s ease both; }
`;

// -- DATA --
const MY_SUBJECTS = [
  { code:"CS 301",  name:"Data Structures",    type:"Lecture",    enrolled:28, max:35, semester:"1st Sem 2025", room:"401-A",   color:"#3D5A8A" },
  { code:"CS 315",  name:"Database Systems",    type:"Laboratory", enrolled:22, max:30, semester:"1st Sem 2025", room:"Lab 2-B", color:"#4A7C6F" },
];

const CS301_STUDENTS = [
  { id:"2022-CS-00412", name:"Juan Dela Cruz",  midterm:1.50, final:null, grade:null, progress:88, remarks:"In Progress" },
  { id:"2021-CS-00287", name:"Maria Santos",    midterm:1.25, final:null, grade:null, progress:91, remarks:"In Progress" },
  { id:"2023-IT-00156", name:"Carlo Reyes",      midterm:2.00, final:null, grade:null, progress:72, remarks:"In Progress" },
  { id:"2022-IS-00389", name:"Ana Lim",          midterm:1.75, final:null, grade:null, progress:80, remarks:"In Progress" },
  { id:"2023-CS-00421", name:"Rosa Cruz",        midterm:2.25, final:null, grade:null, progress:65, remarks:"In Progress" },
];

const MY_SCHEDULE = [
  { time:"7:30 AM",  subj:"Data Structures",  room:"Room 401-A",  type:"Lec", color:"#3D5A8A", day:"Mon/Wed" },
  { time:"11:00 AM", subj:"Database Systems",  room:"Lab 2-B",     type:"Lab", color:"#4A7C6F", day:"Wed/Fri" },
];

const WEEK = {
  Mon:[{t:0,name:"Data Structures",room:"401-A",color:"#3D5A8A"}],
  Tue:[],
  Wed:[{t:0,name:"Data Structures",room:"401-A",color:"#3D5A8A"},{t:3,name:"DB Systems",room:"Lab 2-B",color:"#4A7C6F"}],
  Thu:[],
  Fri:[{t:0,name:"DB Systems",room:"Lab 2-B",color:"#4A7C6F"}],
};
const TIMES = ["7:30","8:30","9:30","10:30","11:30","1:30","2:30","3:30"];
const DAYS  = ["Mon","Tue","Wed","Thu","Fri"];

function Toggle({ on, onToggle }) {
  return <div className={`toggle ${on?"on":""}`} onClick={onToggle}><div className="toggle-thumb"/></div>;
}

// ── PAGES ──────────────────────────────────────────────────
function Overview({ user }) {
  const totalStudents = MY_SUBJECTS.reduce((s,x)=>s+x.enrolled,0);
  return (
    <>
      <div className="stats-row">
        {[
          {cl:"slate",  ico:"📚", label:"My Subjects",     val:MY_SUBJECTS.length, desc:"This semester"},
          {cl:"sage",   ico:"👥", label:"Total Students",  val:totalStudents,      desc:"Across all classes"},
          {cl:"purple", ico:"📊", label:"Grades Pending",  val:"28",               desc:"Yet to finalize"},
          {cl:"terra",  ico:"📅", label:"Classes Today",   val:"2",                desc:"Mon, Wed, Fri"},
        ].map(s=>(
          <div key={s.label} className={`stat-card ${s.cl}`}>
            <div className="stat-accent-bar"/>
            <div className="stat-top"><div className="stat-label">{s.label}</div><div className="stat-badge">{s.ico}</div></div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-desc">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><div className="panel-title-ico ico-slate">📚</div>My Subjects</div>
          </div>
          <div style={{padding:"8px 0"}}>
            {MY_SUBJECTS.map(s=>(
              <div key={s.code} style={{padding:"16px 22px",borderBottom:"1px solid var(--white2)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <span className="code-tag">{s.code}</span>
                    <div style={{fontWeight:700,fontSize:14,color:"var(--ink)",marginTop:6}}>{s.name}</div>
                    <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{s.type} · {s.room} · {s.semester}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"var(--ink)"}}>{s.enrolled}/{s.max}</div>
                    <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>enrolled</div>
                  </div>
                </div>
                <div style={{background:"var(--white2)",borderRadius:4,height:6,overflow:"hidden"}}>
                  <div style={{height:6,borderRadius:4,width:`${(s.enrolled/s.max)*100}%`,background:s.color}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><div className="panel-title-ico ico-terra">📅</div>Today's Classes</div>
            <span style={{fontSize:11,color:"var(--muted)"}}>Mon, Mar 10</span>
          </div>
          <div className="sched-list">
            {MY_SCHEDULE.map((s,i)=>(
              <div className="sched-row" key={i}>
                <div className="sched-time">{s.time}</div>
                <div className="sched-color" style={{background:s.color}}/>
                <div className="sched-info">
                  <div className="sched-subj">{s.subj}</div>
                  <div className="sched-room">{s.room} · {s.day}</div>
                </div>
                <div className={`sched-type type-${s.type.toLowerCase()}`}>{s.type}</div>
              </div>
            ))}
          </div>

          <div style={{padding:"16px 22px",borderTop:"1px solid var(--border)"}}>
            <div style={{fontWeight:700,fontSize:13,color:"var(--ink)",marginBottom:12}}>📌 Reminders</div>
            {[
              {text:"CS 301 midterm grades due in 3 days",   color:"var(--terra)"},
              {text:"CS 315 lab reports submission deadline", color:"var(--slate)"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:r.color,marginTop:5,flexShrink:0}}/>
                <div style={{fontSize:12,color:"var(--ink3)",lineHeight:1.5}}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function MyStudents() {
  const [subj, setSubj] = useState("CS 301");
  const [q, setQ] = useState("");
  const students = CS301_STUDENTS.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.id.includes(q));

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title"><div className="panel-title-ico ico-sage">👥</div>Student List</div>
        <select style={{background:"var(--white)",border:"1.5px solid var(--border)",borderRadius:9,padding:"7px 14px",fontSize:13,fontFamily:"'Outfit',sans-serif",color:"var(--ink)",outline:"none",cursor:"pointer"}}
          value={subj} onChange={e=>setSubj(e.target.value)}>
          {MY_SUBJECTS.map(s=><option key={s.code}>{s.code} — {s.name}</option>)}
        </select>
      </div>
      <div style={{padding:"16px 22px 0"}}>
        <div className="toolbar">
          <input className="search-box" placeholder="Search students…" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
      </div>
      <table className="data-table">
        <thead><tr><th>Student ID</th><th>Name</th><th>Midterm</th><th>Progress</th><th>Remarks</th></tr></thead>
        <tbody>
          {students.map(s=>(
            <tr key={s.id}>
              <td><span className="code-tag">{s.id}</span></td>
              <td style={{fontWeight:600}}>{s.name}</td>
              <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{s.midterm||"—"}</td>
              <td>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{background:"var(--white2)",borderRadius:4,height:5,width:80,overflow:"hidden"}}>
                    <div style={{height:5,borderRadius:4,width:`${s.progress}%`,background:s.progress>80?"var(--sage)":s.progress>65?"var(--slate)":"var(--terra)"}}/>
                  </div>
                  <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:"var(--muted)"}}>{s.progress}%</span>
                </div>
              </td>
              <td><span className="status-chip chip-blue">{s.remarks}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GradeSubmission() {
  const [subj, setSubj] = useState("CS 301");
  const [students, setStudents] = useState(CS301_STUDENTS.map(s=>({...s, editMidterm:s.midterm||"", editFinal:""})));
  const [saved, setSaved] = useState(false);

  const update = (id, field, val) => setStudents(p=>p.map(s=>s.id===id?{...s,[field]:val}:s));

  const save = () => {
    setSaved(true);
    setTimeout(()=>setSaved(false), 2500);
  };

  const gradeClass = g => {
    const n = parseFloat(g);
    if(isNaN(n)) return "";
    if(n<=1.5) return "chip-green";
    if(n<=2.5) return "chip-blue";
    if(n<=3.0) return "chip-purple";
    return "chip-red";
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title"><div className="panel-title-ico ico-slate">📊</div>Grade Submission</div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <select style={{background:"var(--white)",border:"1.5px solid var(--border)",borderRadius:9,padding:"7px 14px",fontSize:13,fontFamily:"'Outfit',sans-serif",color:"var(--ink)",outline:"none",cursor:"pointer"}}
            value={subj} onChange={e=>setSubj(e.target.value)}>
            {MY_SUBJECTS.map(s=><option key={s.code}>{s.code} — {s.name}</option>)}
          </select>
          <button className="save-grades-btn" onClick={save}>Save Grades</button>
        </div>
      </div>
      <div style={{padding:"12px 22px",background:"var(--slate3)",borderBottom:"1px solid var(--border)",fontSize:12,color:"var(--slate)",fontWeight:600}}>
        ℹ Philippine grading scale: 1.0 (highest) to 5.0 (failed). Enter decimal values like 1.25, 1.50, etc.
      </div>
      <table className="data-table">
        <thead><tr><th>Student ID</th><th>Name</th><th>Midterm Grade</th><th>Final Grade</th><th>Final Rating</th><th>Remarks</th></tr></thead>
        <tbody>
          {students.map(s=>{
            const mid = parseFloat(s.editMidterm);
            const fin = parseFloat(s.editFinal);
            const avg = (!isNaN(mid)&&!isNaN(fin)) ? ((mid+fin)/2).toFixed(2) : s.editMidterm||"—";
            const passed = parseFloat(avg)<=3.0;
            return (
              <tr key={s.id}>
                <td><span className="code-tag">{s.id}</span></td>
                <td style={{fontWeight:600}}>{s.name}</td>
                <td>
                  <input className="grade-input" type="number" step="0.25" min="1" max="5" placeholder="1.00–5.00"
                    value={s.editMidterm} onChange={e=>update(s.id,"editMidterm",e.target.value)}/>
                </td>
                <td>
                  <input className="grade-input" type="number" step="0.25" min="1" max="5" placeholder="1.00–5.00"
                    value={s.editFinal} onChange={e=>update(s.id,"editFinal",e.target.value)}/>
                </td>
                <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700}}>{avg}</td>
                <td>
                  {s.editFinal
                    ? <span className={`status-chip ${passed?"chip-green":"chip-red"}`}>{passed?"Passed":"Failed"}</span>
                    : <span className="status-chip chip-blue">In Progress</span>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {saved && <div className="save-toast">✓ Grades saved successfully</div>}
    </div>
  );
}

function MySchedule() {
  return (
    <>
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title"><div className="panel-title-ico ico-slate">📅</div>Weekly Timetable</div>
          <span style={{fontSize:11,color:"var(--muted)"}}>1st Sem A.Y. 2025–2026</span>
        </div>
        <div className="week-scroll" style={{padding:"0 0 4px"}}>
          <table className="week-table">
            <thead><tr><th>TIME</th>{DAYS.map(d=><th key={d}>{d}</th>)}</tr></thead>
            <tbody>
              {TIMES.map((t,ti)=>(
                <tr key={ti}>
                  <td>{t}</td>
                  {DAYS.map(d=>{
                    const blk=WEEK[d]?.find(b=>b.t===ti);
                    return <td key={d}>{blk&&<div className="class-blk" style={{background:`${blk.color}18`,borderLeft:`3px solid ${blk.color}`}}><div className="blk-name" style={{color:blk.color}}>{blk.name}</div><div className="blk-room">{blk.room}</div></div>}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><div className="panel-title"><div className="panel-title-ico ico-terra">🗓</div>Today's Classes</div></div>
        <div className="sched-list">
          {MY_SCHEDULE.map((s,i)=>(
            <div className="sched-row" key={i}>
              <div className="sched-time">{s.time}</div>
              <div className="sched-color" style={{background:s.color}}/>
              <div className="sched-info"><div className="sched-subj">{s.subj}</div><div className="sched-room">{s.room}</div></div>
              <div className={`sched-type type-${s.type.toLowerCase()}`}>{s.type}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function FacultySettings({ user }) {
  const [section, setSection] = useState("profile");
  const [toast, setToast] = useState(false);
  const [notif, setNotif] = useState({ email:true, gradeAlerts:true, scheduleChanges:true });
  const save = () => { setToast(true); setTimeout(()=>setToast(false),2500); };

  return (
    <div className="settings-grid">
      <div className="settings-nav">
        {[{id:"profile",ico:"👤",label:"Profile"},{id:"password",ico:"🔒",label:"Password"},{id:"notif",ico:"🔔",label:"Notifications"}].map(s=>(
          <button key={s.id} className={`settings-nav-btn ${section===s.id?"active":""}`} onClick={()=>setSection(s.id)}>
            <span style={{fontSize:14}}>{s.ico}</span>{s.label}
          </button>
        ))}
      </div>
      <div>
        {section==="profile" && (
          <div className="settings-card">
            <div className="settings-card-head"><div className="settings-card-title">Faculty Profile</div><div className="settings-card-sub">Manage your information</div></div>
            <div className="settings-card-body">
              <div className="settings-row"><div><div className="settings-row-label">Full Name</div></div><input className="settings-input" defaultValue={user?.firstName ? `${user.firstName} ${user.lastName}` : "Prof. Santos"}/></div>
              <div className="settings-row"><div><div className="settings-row-label">Email</div></div><input className="settings-input" type="email" defaultValue={user?.email||"faculty@acadtrack.edu"}/></div>
              <div className="settings-row"><div><div className="settings-row-label">Department</div></div><select className="settings-select"><option>Computer Science</option><option>Mathematics</option><option>English</option><option>Information Technology</option></select></div>
              <div className="settings-row"><div><div className="settings-row-label">Faculty ID</div><div className="settings-row-desc">Cannot be changed</div></div><input className="settings-input" value={user?.studentId||"FAC-001"} disabled/></div>
              <button className="settings-save-btn" onClick={save}>Save Changes</button>
            </div>
          </div>
        )}
        {section==="password" && (
          <div className="settings-card">
            <div className="settings-card-head"><div className="settings-card-title">Change Password</div></div>
            <div className="settings-card-body">
              <div className="settings-row"><div><div className="settings-row-label">Current Password</div></div><input className="settings-input" type="password" placeholder="Current password"/></div>
              <div className="settings-row"><div><div className="settings-row-label">New Password</div></div><input className="settings-input" type="password" placeholder="New password"/></div>
              <div className="settings-row"><div><div className="settings-row-label">Confirm Password</div></div><input className="settings-input" type="password" placeholder="Confirm password"/></div>
              <button className="settings-save-btn" onClick={save}>Update Password</button>
            </div>
          </div>
        )}
        {section==="notif" && (
          <div className="settings-card">
            <div className="settings-card-head"><div className="settings-card-title">Notification Preferences</div></div>
            <div className="settings-card-body">
              {[{key:"email",label:"Email Notifications",desc:"General email alerts"},{key:"gradeAlerts",label:"Grade Submission Reminders",desc:"Deadline alerts for grade submission"},{key:"scheduleChanges",label:"Schedule Changes",desc:"Alerts for schedule modifications"}].map(n=>(
                <div key={n.key} className="settings-row">
                  <div><div className="settings-row-label">{n.label}</div><div className="settings-row-desc">{n.desc}</div></div>
                  <Toggle on={notif[n.key]} onToggle={()=>setNotif(p=>({...p,[n.key]:!p[n.key]}))}/>
                </div>
              ))}
              <button className="settings-save-btn" onClick={save}>Save Preferences</button>
            </div>
          </div>
        )}
      </div>
      {toast && <div className="save-toast">✓ Changes saved successfully</div>}
    </div>
  );
}

// ── ROOT ────────────────────────────────────────────────────
const NAV = [
  { id:"overview",  ico:"◈", label:"Overview" },
  { id:"students",  ico:"◉", label:"My Students" },
  { id:"grades",    ico:"◷", label:"Grade Submission" },
  { id:"schedule",  ico:"◎", label:"My Schedule" },
];

const TITLES = {
  overview:"Faculty Overview", students:"My Students",
  grades:"Grade Submission", schedule:"My Schedule",
  settings:"Settings",
};

export default function FacultyDashboard({ user, onLogout }) {
  const [page, setPage] = useState("overview");
  const [open, setOpen] = useState(false);
  const go = id => { setPage(id); setOpen(false); };

  const initials = user?.firstName
    ? (user.firstName[0]||"")+(user.lastName?.[0]||"")
    : "PR";

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName||""}`
    : user?.name || "Prof.";

  return (
    <>
      <style>{S}</style>
      <div className="layout">
        <div className={`overlay ${open?"show":""}`} onClick={()=>setOpen(false)}/>

        <aside className={`sidebar ${open?"open":""}`}>
          <div className="sidebar-logo">
            <div className="logo-mark">
              <div className="logo-box">A</div>
              <div className="logo-name">AcadTrack</div>
            </div>
            <div className="logo-sub">Academic Information System</div>
            <div className="role-badge">Faculty</div>
          </div>

          <div className="nav-group">
            <div className="nav-group-label">Teaching</div>
            {NAV.map(n=>(
              <button key={n.id} className={`nav-btn ${page===n.id?"active":""}`} onClick={()=>go(n.id)}>
                <div className="nav-dot"/>
                <span className="nav-ico">{n.ico}</span>
                {n.label}
              </button>
            ))}
          </div>

          <div className="nav-group" style={{marginTop:8}}>
            <div className="nav-group-label">Account</div>
            <button className={`nav-btn ${page==="settings"?"active":""}`} onClick={()=>go("settings")}><div className="nav-dot"/><span className="nav-ico">⚙</span>Settings</button>
            <button className="nav-btn" onClick={onLogout}><div className="nav-dot"/><span className="nav-ico">⏻</span>Sign Out</button>
          </div>

          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="avatar">{initials}</div>
              <div>
                <div className="user-name">{displayName}</div>
                <div className="user-id">{user?.studentId||user?.email||"FAC-001"}</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button className="menu-btn" onClick={()=>setOpen(o=>!o)}>☰</button>
              <div className="page-heading">{TITLES[page]}</div>
            </div>
            <div className="topbar-actions">
              <div className="role-tag">FACULTY</div>
              <button className="icon-btn">🔔</button>
              <button className="icon-btn" onClick={()=>go("settings")}>⚙</button>
            </div>
          </header>

          <main className="content" key={page}>
            {page==="overview"  && <Overview user={user}/>}
            {page==="students"  && <MyStudents/>}
            {page==="grades"    && <GradeSubmission/>}
            {page==="schedule"  && <MySchedule/>}
            {page==="settings"  && <FacultySettings user={user}/>}
          </main>
        </div>
      </div>
    </>
  );
}