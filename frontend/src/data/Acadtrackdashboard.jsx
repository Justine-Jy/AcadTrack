import { useState } from "react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --white:   #F0EDE6;
  --white2:  #E8E4DC;
  --white3:  #DDD9D0;
  --ink:     #1A1A1F;
  --ink2:    #2E2E36;
  --ink3:    #45454F;
  --sage:    #4A7C6F;
  --sage2:   #5E9E8F;
  --sage3:   #D4EAE5;
  --terra:   #C46D52;
  --terra2:  #E08A6E;
  --terra3:  #F5DDD6;
  --slate:   #3D5A8A;
  --slate2:  #5275A8;
  --slate3:  #D0DAF0;
  --muted:   #9E9B94;
  --border:  #D8D4CB;
  --shadow:  0 2px 12px rgba(26,26,31,0.08);
  --shadow2: 0 8px 32px rgba(26,26,31,0.12);
  --r:       12px;
  --r2:      18px;
}

html { font-size: 16px; }
body { background: var(--white); color: var(--ink); font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; }

.layout { display: flex; min-height: 100vh; }

.sidebar {
  width: 260px; flex-shrink: 0;
  background: var(--ink);
  display: flex; flex-direction: column;
  position: fixed; inset: 0 auto 0 0;
  z-index: 100;
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
}
.sidebar-logo { padding: 32px 28px 24px; border-bottom: 1px solid rgba(240,237,230,0.08); }
.logo-mark { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.logo-box {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, var(--sage), var(--slate));
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700; font-size: 18px; color: var(--white); flex-shrink: 0;
}
.logo-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: var(--white); letter-spacing: -0.3px; }
.logo-sub { font-size: 9.5px; color: rgba(240,237,230,0.35); letter-spacing: 2.5px; text-transform: uppercase; margin-left: 46px; }

.nav-group { padding: 20px 16px 0; }
.nav-group-label { font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(240,237,230,0.25); padding: 0 12px; margin-bottom: 6px; }
.nav-btn {
  width: 100%; display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 10px;
  color: rgba(240,237,230,0.5); font-size: 13.5px; font-weight: 500;
  cursor: pointer; border: none; background: none;
  font-family: 'Outfit', sans-serif;
  transition: all 0.15s; text-align: left; margin-bottom: 2px;
}
.nav-btn:hover { background: rgba(240,237,230,0.06); color: rgba(240,237,230,0.85); }
.nav-btn.active { background: rgba(74,124,111,0.2); color: var(--sage2); }
.nav-btn.active .nav-dot { background: var(--sage2); }
.nav-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(240,237,230,0.2); flex-shrink: 0; transition: background 0.15s; }
.nav-ico { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; }

.sidebar-footer { margin-top: auto; padding: 16px; border-top: 1px solid rgba(240,237,230,0.07); }
.user-chip { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; background: rgba(240,237,230,0.05); border: 1px solid rgba(240,237,230,0.08); }
.avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--terra), var(--slate)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: white; flex-shrink: 0; font-family: 'Outfit', sans-serif; }
.user-name { font-size: 13px; font-weight: 600; color: var(--white); }
.user-id { font-size: 10.5px; color: rgba(240,237,230,0.35); font-family: 'JetBrains Mono', monospace; }

.main { margin-left: 260px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; background: var(--white); }

.topbar { background: var(--white); border-bottom: 1px solid var(--border); height: 64px; padding: 0 36px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
.page-heading { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 700; color: var(--ink); letter-spacing: -0.5px; }
.topbar-actions { display: flex; align-items: center; gap: 10px; }
.sem-tag { font-size: 11px; font-weight: 600; padding: 5px 14px; border-radius: 20px; background: var(--slate3); color: var(--slate); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.3px; }
.icon-btn { width: 38px; height: 38px; border-radius: 10px; border: 1.5px solid var(--border); background: white; color: var(--ink3); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 15px; transition: all 0.15s; }
.icon-btn:hover { border-color: var(--sage); color: var(--sage); background: var(--sage3); }
.menu-btn { display: none; width: 38px; height: 38px; border-radius: 10px; border: 1.5px solid var(--border); background: white; cursor: pointer; font-size: 18px; align-items: center; justify-content: center; }

.content { padding: 32px 36px; flex: 1; }

.stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 28px; }
.stat-card { background: white; border: 1.5px solid var(--border); border-radius: var(--r2); padding: 22px 20px; position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; cursor: default; }
.stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow2); }
.stat-accent-bar { position: absolute; top: 0; left: 0; right: 0; height: 3.5px; border-radius: var(--r2) var(--r2) 0 0; }
.stat-card.sage .stat-accent-bar { background: linear-gradient(90deg, var(--sage), var(--sage2)); }
.stat-card.terra .stat-accent-bar { background: linear-gradient(90deg, var(--terra), var(--terra2)); }
.stat-card.slate .stat-accent-bar { background: linear-gradient(90deg, var(--slate), var(--slate2)); }
.stat-card.ink .stat-accent-bar { background: linear-gradient(90deg, var(--ink2), var(--ink3)); }
.stat-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
.stat-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); font-weight: 600; }
.stat-badge { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
.stat-card.sage .stat-badge { background: var(--sage3); }
.stat-card.terra .stat-badge { background: var(--terra3); }
.stat-card.slate .stat-badge { background: var(--slate3); }
.stat-card.ink .stat-badge { background: var(--white2); }
.stat-val { font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 700; color: var(--ink); line-height: 1; margin-bottom: 5px; }
.stat-desc { font-size: 11.5px; color: var(--muted); }

.grid-2-1 { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; margin-bottom: 24px; }
.grid-1-1 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }

.panel { background: white; border: 1.5px solid var(--border); border-radius: var(--r2); overflow: hidden; box-shadow: var(--shadow); }
.panel-head { padding: 18px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.panel-title { font-size: 14px; font-weight: 700; color: var(--ink); display: flex; align-items: center; gap: 8px; }
.panel-title-ico { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 13px; }
.ico-sage { background: var(--sage3); }
.ico-terra { background: var(--terra3); }
.ico-slate { background: var(--slate3); }
.ico-ink { background: var(--white2); }
.panel-link { font-size: 12px; font-weight: 600; color: var(--slate); cursor: pointer; }
.panel-link:hover { text-decoration: underline; }

.subj-table { width: 100%; border-collapse: collapse; }
.subj-table th { padding: 10px 22px; text-align: left; font-size: 9.5px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); font-weight: 700; border-bottom: 1px solid var(--border); }
.subj-table td { padding: 13px 22px; font-size: 13px; border-bottom: 1px solid var(--white2); vertical-align: middle; }
.subj-table tr:last-child td { border-bottom: none; }
.subj-table tbody tr { transition: background 0.12s; }
.subj-table tbody tr:hover td { background: var(--white); }
.code-tag { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; padding: 3px 9px; border-radius: 6px; background: var(--slate3); color: var(--slate); font-weight: 500; white-space: nowrap; }
.subj-name { font-weight: 600; font-size: 13px; color: var(--ink); }
.subj-prof { font-size: 11px; color: var(--muted); margin-top: 1px; }
.prog-wrap { width: 90px; height: 5px; border-radius: 3px; background: var(--white2); overflow: hidden; }
.prog-fill { height: 5px; border-radius: 3px; }
.prog-txt { font-size: 10px; color: var(--muted); margin-top: 3px; font-family: 'JetBrains Mono', monospace; }
.grade-chip { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.gc-a { background: var(--sage3); color: var(--sage); }
.gc-b { background: var(--slate3); color: var(--slate); }
.gc-c { background: #FEF3C7; color: #92400E; }
.gc-d { background: var(--terra3); color: var(--terra); }

.sched-list { padding: 6px 0; }
.sched-row { display: flex; align-items: center; gap: 14px; padding: 11px 22px; border-bottom: 1px solid var(--white2); transition: background 0.12s; }
.sched-row:last-child { border-bottom: none; }
.sched-row:hover { background: var(--white); }
.sched-time { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--muted); width: 65px; flex-shrink: 0; }
.sched-color { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.sched-info { flex: 1; }
.sched-subj { font-size: 13px; font-weight: 600; color: var(--ink); }
.sched-room { font-size: 11px; color: var(--muted); }
.sched-type { font-size: 10px; padding: 2px 9px; border-radius: 5px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
.type-lec { background: var(--slate3); color: var(--slate); }
.type-lab { background: var(--sage3); color: var(--sage); }

.ann-list { padding: 4px 0; }
.ann-item { padding: 14px 22px; border-bottom: 1px solid var(--white2); cursor: pointer; transition: background 0.12s; }
.ann-item:last-child { border-bottom: none; }
.ann-item:hover { background: var(--white); }
.ann-row1 { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
.ann-badge { font-size: 9.5px; padding: 2px 8px; border-radius: 5px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
.ab-exam { background: var(--terra3); color: var(--terra); }
.ab-event { background: var(--slate3); color: var(--slate); }
.ab-deadline { background: #FEF3C7; color: #92400E; }
.ab-general { background: var(--sage3); color: var(--sage); }
.ann-date { font-size: 10.5px; color: var(--muted); font-family: 'JetBrains Mono', monospace; margin-left: auto; }
.ann-title { font-size: 13.5px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
.ann-body { font-size: 12px; color: var(--ink3); line-height: 1.5; }

.gpa-section { padding: 20px 22px; }
.gpa-ring-area { display: flex; align-items: center; gap: 24px; margin-bottom: 20px; }
.ring-wrap { position: relative; width: 110px; height: 110px; flex-shrink: 0; }
.ring-wrap svg { transform: rotate(-90deg); }
.ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.ring-val { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 700; color: var(--ink); line-height: 1; }
.ring-lbl { font-size: 9.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
.gpa-meta { flex: 1; }
.gpa-meta-title { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.gpa-meta-sub { font-size: 12px; color: var(--muted); line-height: 1.5; }
.gpa-bars { display: flex; flex-direction: column; gap: 10px; }
.gpa-bar-row { display: flex; align-items: center; gap: 10px; }
.gba-lbl { font-size: 10.5px; color: var(--muted); width: 66px; flex-shrink: 0; }
.gba-bg { flex: 1; height: 6px; border-radius: 3px; background: var(--white2); overflow: hidden; }
.gba-fill { height: 6px; border-radius: 3px; background: var(--sage); transition: width 0.8s ease; }
.gba-val { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: var(--ink3); width: 28px; text-align: right; }

.sem-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 24px; }
.sem-card { background: white; border: 1.5px solid var(--border); border-radius: var(--r2); padding: 18px 20px; cursor: pointer; transition: all 0.15s; }
.sem-card:hover { border-color: var(--sage); }
.sem-card.active { border-color: var(--sage); background: var(--sage3); }
.sem-card-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 6px; }
.sem-card-gpa { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: var(--ink); }
.sem-card-units { font-size: 11.5px; color: var(--muted); margin-top: 3px; }

.week-scroll { overflow-x: auto; }
.week-table { width: 100%; border-collapse: collapse; min-width: 640px; }
.week-table th { padding: 12px 8px; text-align: center; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); font-weight: 700; border-bottom: 1.5px solid var(--border); background: var(--white); }
.week-table td { border: 1px solid var(--white2); vertical-align: top; padding: 4px; height: 56px; font-size: 11px; }
.week-table td:first-child { width: 64px; text-align: center; padding-top: 8px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); background: var(--white); border-right: 1.5px solid var(--border); }
.class-blk { border-radius: 7px; padding: 5px 8px; height: 100%; display: flex; flex-direction: column; justify-content: center; }
.blk-name { font-size: 11px; font-weight: 700; }
.blk-room { font-size: 9.5px; margin-top: 1px; opacity: 0.7; }

.enroll-toolbar { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.search-box { flex: 1; min-width: 200px; background: white; border: 1.5px solid var(--border); border-radius: 10px; padding: 10px 16px; font-size: 13.5px; font-family: 'Outfit', sans-serif; color: var(--ink); outline: none; transition: border-color 0.15s; }
.search-box:focus { border-color: var(--sage); }
.search-box::placeholder { color: var(--muted); }
.filter-pill { padding: 9px 18px; border-radius: 10px; border: 1.5px solid var(--border); background: white; font-size: 12.5px; font-weight: 600; color: var(--ink3); cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.15s; }
.filter-pill:hover { border-color: var(--sage); color: var(--sage); }
.filter-pill.active { background: var(--sage); border-color: var(--sage); color: white; }
.enroll-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
.course-card { background: white; border: 1.5px solid var(--border); border-radius: var(--r2); padding: 20px; transition: all 0.18s; cursor: pointer; position: relative; }
.course-card:hover { border-color: var(--sage); transform: translateY(-2px); box-shadow: var(--shadow2); }
.course-card.enrolled-card { border-color: var(--sage); }
.cc-code { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--slate); margin-bottom: 7px; }
.cc-name { font-size: 14px; font-weight: 700; color: var(--ink); line-height: 1.35; margin-bottom: 4px; }
.cc-prof { font-size: 12px; color: var(--muted); margin-bottom: 14px; }
.cc-foot { display: flex; align-items: center; justify-content: space-between; }
.cc-units { font-size: 11px; color: var(--muted); font-weight: 600; }
.slots-txt { font-size: 11px; font-weight: 700; }
.slots-ok { color: var(--sage); }
.slots-warn { color: #D97706; }
.slots-full { color: var(--terra); }
.cc-btn { width: 100%; margin-top: 14px; padding: 10px; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Outfit', sans-serif; border: 1.5px solid; transition: all 0.15s; }
.cc-btn-enroll { border-color: var(--sage); background: var(--sage3); color: var(--sage); }
.cc-btn-enroll:hover { background: var(--sage); color: white; }
.cc-btn-drop { border-color: var(--terra); background: var(--terra3); color: var(--terra); }
.cc-btn-drop:hover { background: var(--terra); color: white; }
.cc-btn-full { border-color: var(--border); background: var(--white); color: var(--muted); cursor: not-allowed; }
.enrolled-tag { position: absolute; top: 14px; right: 14px; font-size: 9.5px; padding: 2px 8px; border-radius: 5px; background: var(--sage3); color: var(--sage); font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }

.tab-bar { display: flex; gap: 2px; padding: 0 22px; border-bottom: 1px solid var(--border); }
.tab-pill { padding: 12px 18px; font-size: 12.5px; font-weight: 600; color: var(--muted); cursor: pointer; border: none; background: none; border-bottom: 2.5px solid transparent; font-family: 'Outfit', sans-serif; transition: all 0.15s; }
.tab-pill:hover { color: var(--ink); }
.tab-pill.active { color: var(--sage); border-bottom-color: var(--sage); }

/* SETTINGS */
.settings-grid { display: grid; grid-template-columns: 220px 1fr; gap: 24px; }
.settings-nav { display: flex; flex-direction: column; gap: 4px; }
.settings-nav-btn { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; border: none; background: none; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500; color: var(--ink3); cursor: pointer; text-align: left; width: 100%; transition: all 0.15s; }
.settings-nav-btn:hover { background: var(--white2); color: var(--ink); }
.settings-nav-btn.active { background: var(--sage3); color: var(--sage); font-weight: 600; }
.settings-nav-ico { font-size: 14px; width: 18px; }
.settings-section { display: flex; flex-direction: column; gap: 20px; }
.settings-card { background: white; border: 1.5px solid var(--border); border-radius: var(--r2); overflow: hidden; box-shadow: var(--shadow); }
.settings-card-head { padding: 18px 24px; border-bottom: 1px solid var(--border); }
.settings-card-title { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
.settings-card-sub { font-size: 12px; color: var(--muted); }
.settings-card-body { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
.settings-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.settings-row-label { font-size: 13px; font-weight: 600; color: var(--ink); }
.settings-row-desc { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
.settings-input { flex: 1; background: var(--white); border: 1.5px solid var(--border); border-radius: 9px; padding: 9px 14px; font-size: 13px; font-family: 'Outfit', sans-serif; color: var(--ink); outline: none; transition: border-color 0.15s; min-width: 0; }
.settings-input:focus { border-color: var(--sage); }
.settings-input:disabled { opacity: 0.5; cursor: not-allowed; }
.settings-select { flex: 1; background: var(--white); border: 1.5px solid var(--border); border-radius: 9px; padding: 9px 14px; font-size: 13px; font-family: 'Outfit', sans-serif; color: var(--ink); outline: none; cursor: pointer; }
.settings-select:focus { border-color: var(--sage); }
.toggle-wrap { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.toggle { width: 44px; height: 24px; border-radius: 12px; background: var(--border); position: relative; transition: background 0.2s; flex-shrink: 0; }
.toggle.on { background: var(--sage); }
.toggle-thumb { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: left 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
.toggle.on .toggle-thumb { left: 23px; }
.settings-save-btn { align-self: flex-start; padding: 10px 24px; border-radius: 10px; border: none; background: var(--sage); color: white; font-size: 13px; font-weight: 700; font-family: 'Outfit', sans-serif; cursor: pointer; transition: background 0.15s; }
.settings-save-btn:hover { background: var(--sage2); }
.settings-danger-btn { align-self: flex-start; padding: 10px 24px; border-radius: 10px; border: 1.5px solid var(--terra); background: var(--terra3); color: var(--terra); font-size: 13px; font-weight: 700; font-family: 'Outfit', sans-serif; cursor: pointer; transition: all 0.15s; }
.settings-danger-btn:hover { background: var(--terra); color: white; }
.settings-divider { border: none; border-top: 1px solid var(--border); margin: 0; }
.avatar-large { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--terra), var(--slate)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 24px; color: white; font-family: 'Outfit', sans-serif; flex-shrink: 0; }
.save-toast { position: fixed; bottom: 28px; right: 28px; background: var(--ink); color: white; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 600; box-shadow: var(--shadow2); animation: fadeUp 0.3s ease; z-index: 200; }

@media (max-width: 1100px) {
  .enroll-grid { grid-template-columns: repeat(2,1fr); }
  .stats-row { grid-template-columns: repeat(2,1fr); }
  .grid-2-1 { grid-template-columns: 1fr; }
  .sem-cards { grid-template-columns: repeat(2,1fr); }
  .settings-grid { grid-template-columns: 1fr; }
}
@media (max-width: 860px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .main { margin-left: 0; }
  .menu-btn { display: flex; }
  .content { padding: 20px 18px; }
  .topbar { padding: 0 18px; }
  .grid-1-1 { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .stats-row { grid-template-columns: 1fr 1fr; gap: 10px; }
  .enroll-grid { grid-template-columns: 1fr; }
  .sem-cards { grid-template-columns: 1fr; }
  .stat-val { font-size: 30px; }
}

.overlay { display: none; position: fixed; inset: 0; background: rgba(26,26,31,0.4); z-index: 99; }
.overlay.show { display: block; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.content > * { animation: fadeUp 0.3s ease both; }
`;

// -- DATA --
const NAV = [
  { id:"dashboard",     ico:"◈", label:"Dashboard" },
  { id:"grades",        ico:"◉", label:"Grades" },
  { id:"schedule",      ico:"◷", label:"Schedule" },
  { id:"enrollment",    ico:"◎", label:"Enrollment" },
  { id:"announcements", ico:"◆", label:"Announcements" },
];

const SUBJECTS = [
  { code:"CS 301",  name:"Data Structures",    prof:"Prof. Santos", units:3, grade:"1.25", pct:88, let:"A" },
  { code:"MATH 241",name:"Calculus III",        prof:"Prof. Reyes",  units:4, grade:"2.00", pct:72, let:"B" },
  { code:"CS 315",  name:"Database Systems",    prof:"Prof. Cruz",   units:3, grade:"1.50", pct:82, let:"A" },
  { code:"ENG 201", name:"Technical Writing",   prof:"Prof. Lim",    units:2, grade:"1.75", pct:76, let:"A" },
  { code:"CS 320",  name:"Software Engineering",prof:"Prof. Garcia", units:3, grade:"2.25", pct:65, let:"B" },
];

const SCHEDULE_TODAY = [
  { time:"7:30 AM",  subj:"Data Structures",    room:"Room 401-A",   type:"Lec", color:"#3D5A8A" },
  { time:"9:00 AM",  subj:"Calculus III",        room:"Math Bldg 203",type:"Lec", color:"#4A7C6F" },
  { time:"11:00 AM", subj:"Database Systems",    room:"Lab 2-B",      type:"Lab", color:"#C46D52" },
  { time:"1:30 PM",  subj:"Technical Writing",   room:"Rm 108",       type:"Lec", color:"#6B5A8A" },
  { time:"3:00 PM",  subj:"Software Engineering",room:"Room 305",     type:"Lec", color:"#2E7A5A" },
];

const ANNOUNCEMENTS = [
  { type:"exam",     badge:"ab-exam",     label:"Exam",     title:"Midterm — CS 301",             body:"Coverage: Chapters 1–6. Bring ID and blue pen.",         date:"Mar 12" },
  { type:"deadline", badge:"ab-deadline", label:"Deadline", title:"Project Submission — CS 320",  body:"Submit final sprint report via portal by 11:59 PM.",      date:"Mar 14" },
  { type:"event",    badge:"ab-event",    label:"Event",    title:"University Research Symposium", body:"All 3rd-year students are encouraged to attend.",         date:"Mar 18" },
  { type:"general",  badge:"ab-general",  label:"General",  title:"Schedule of Fees — 2nd Sem",   body:"Download updated schedule from the registrar portal.",    date:"Mar 9"  },
  { type:"exam",     badge:"ab-exam",     label:"Exam",     title:"Quiz 3 — MATH 241",            body:"Covers integration techniques and polar coordinates.",     date:"Mar 11" },
];

const SEMESTERS = [
  { sem:"1st Sem 2024", gpa:"1.42", units:18, courses:[
    {code:"CS 201", name:"Algorithms",        grade:"1.25",units:3},
    {code:"MATH 131",name:"Calculus I",       grade:"1.50",units:4},
    {code:"CS 210", name:"OOP",               grade:"1.25",units:3},
    {code:"HUM 101",name:"Humanities",        grade:"2.00",units:3},
    {code:"PE 1",   name:"Physical Education",grade:"1.00",units:2},
    {code:"NSTP 1", name:"NSTP",              grade:"P",   units:3},
  ]},
  { sem:"2nd Sem 2024", gpa:"1.58", units:18, courses:[
    {code:"CS 221", name:"Discrete Math",     grade:"1.75",units:3},
    {code:"MATH 132",name:"Calculus II",      grade:"1.75",units:4},
    {code:"CS 230", name:"Computer Networks", grade:"1.50",units:3},
    {code:"SOSC 101",name:"Social Science",   grade:"1.75",units:3},
    {code:"PE 2",   name:"Physical Fitness",  grade:"1.25",units:2},
    {code:"NSTP 2", name:"NSTP",              grade:"P",   units:3},
  ]},
  { sem:"1st Sem 2025 (Current)", gpa:"1.75", units:15, courses: SUBJECTS.map(s=>({code:s.code,name:s.name,grade:s.grade,units:s.units})) },
];

const ENROLLABLE = [
  {code:"CS 401",  name:"Operating Systems",         prof:"Prof. Mendoza", units:3, slots:8,  max:35},
  {code:"CS 410",  name:"Computer Architecture",     prof:"Prof. Tan",     units:3, slots:12, max:30},
  {code:"CS 415",  name:"Artificial Intelligence",   prof:"Prof. Navarro", units:3, slots:3,  max:25},
  {code:"MATH 301",name:"Linear Algebra",            prof:"Prof. Santos",  units:3, slots:20, max:40},
  {code:"CS 420",  name:"Computer Graphics",         prof:"Prof. De Leon", units:3, slots:0,  max:25},
  {code:"CS 425",  name:"Human-Computer Interaction",prof:"Prof. Ramos",   units:2, slots:15, max:30},
  {code:"ENG 301", name:"Business Communication",    prof:"Prof. Uy",      units:2, slots:18, max:35},
  {code:"CS 430",  name:"Cloud Computing",           prof:"Prof. Flores",  units:3, slots:7,  max:20},
  {code:"MATH 302",name:"Numerical Methods",         prof:"Prof. Castillo",units:3, slots:22, max:40},
];

const WEEK = {
  Mon:[{t:0,name:"Data Structures",room:"401-A",  color:"#3D5A8A"},{t:4,name:"Tech Writing", room:"Rm 108",  color:"#6B5A8A"}],
  Tue:[{t:1,name:"Calculus III",   room:"Math 203",color:"#4A7C6F"},{t:5,name:"Soft. Eng.",   room:"Rm 305",  color:"#2E7A5A"}],
  Wed:[{t:0,name:"Data Structures",room:"401-A",  color:"#3D5A8A"},{t:3,name:"DB Systems",   room:"Lab 2-B", color:"#C46D52"}],
  Thu:[{t:1,name:"Calculus III",   room:"Math 203",color:"#4A7C6F"},{t:4,name:"Tech Writing", room:"Rm 108",  color:"#6B5A8A"}],
  Fri:[{t:0,name:"DB Systems",     room:"Lab 2-B", color:"#C46D52"},{t:3,name:"Soft. Eng.",   room:"Rm 305",  color:"#2E7A5A"}],
};
const TIMES = ["7:30","8:30","9:30","10:30","11:30","1:30","2:30","3:30"];
const DAYS  = ["Mon","Tue","Wed","Thu","Fri"];

const gradeClass = l => l==="A"?"gc-a":l==="B"?"gc-b":l==="C"?"gc-c":"gc-d";
const gradeEquiv = g => { const m={1.00:"100%",1.25:"96%",1.50:"92%",1.75:"88%",2.00:"85%",2.25:"81%",2.50:"78%",P:"Pass"}; return m[g]||"—"; };
const progColor  = p => p>80?"var(--sage)":p>65?"var(--slate)":"var(--terra)";

// Toggle component
function Toggle({ on, onToggle }) {
  return (
    <div className={`toggle ${on?"on":""}`} onClick={onToggle} style={{cursor:"pointer"}}>
      <div className="toggle-thumb"/>
    </div>
  );
}

// ── PAGES ──────────────────────────────────────────────────
function Dashboard() {
  return (
    <>
      <div className="stats-row">
        {[
          {cl:"sage",  ico:"📚", label:"Enrolled Subjects", val:"5",    desc:"15 units this semester"},
          {cl:"terra", ico:"⭐", label:"Current GPA",        val:"1.75", desc:"Cumulative Avg: 1.58"},
          {cl:"slate", ico:"✦",  label:"Units Completed",    val:"51",   desc:"of 180 total units"},
          {cl:"ink",   ico:"⚑",  label:"Pending Tasks",      val:"3",    desc:"2 submissions due soon"},
        ].map(s=>(
          <div key={s.label} className={`stat-card ${s.cl}`}>
            <div className="stat-accent-bar"/>
            <div className="stat-top">
              <div className="stat-label">{s.label}</div>
              <div className="stat-badge">{s.ico}</div>
            </div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-desc">{s.desc}</div>
          </div>
        ))}
      </div>
      <div className="grid-2-1">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><div className="panel-title-ico ico-slate">📚</div>Current Subjects</div>
            <span className="panel-link">View All</span>
          </div>
          <table className="subj-table">
            <thead><tr><th>Code</th><th>Subject</th><th>Progress</th><th>Grade</th></tr></thead>
            <tbody>
              {SUBJECTS.map(s=>(
                <tr key={s.code}>
                  <td><span className="code-tag">{s.code}</span></td>
                  <td><div className="subj-name">{s.name}</div><div className="subj-prof">{s.prof}</div></td>
                  <td><div className="prog-wrap"><div className="prog-fill" style={{width:s.pct+"%",background:progColor(s.pct)}}/></div><div className="prog-txt">{s.pct}%</div></td>
                  <td><span className={`grade-chip ${gradeClass(s.let)}`}>{s.grade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><div className="panel-title-ico ico-terra">📅</div>Today's Classes</div>
            <span style={{fontSize:11,color:"var(--muted)"}}>Tue, Mar 10</span>
          </div>
          <div className="sched-list">
            {SCHEDULE_TODAY.map((s,i)=>(
              <div className="sched-row" key={i}>
                <div className="sched-time">{s.time}</div>
                <div className="sched-color" style={{background:s.color}}/>
                <div className="sched-info"><div className="sched-subj">{s.subj}</div><div className="sched-room">{s.room}</div></div>
                <div className={`sched-type type-${s.type.toLowerCase()}`}>{s.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid-1-1">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><div className="panel-title-ico ico-sage">📢</div>Announcements</div>
            <span className="panel-link">See All</span>
          </div>
          <div className="ann-list">
            {ANNOUNCEMENTS.slice(0,3).map((a,i)=>(
              <div className="ann-item" key={i}>
                <div className="ann-row1"><span className={`ann-badge ${a.badge}`}>{a.label}</span><span className="ann-date">{a.date}</span></div>
                <div className="ann-title">{a.title}</div>
                <div className="ann-body">{a.body}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title"><div className="panel-title-ico ico-ink">🎓</div>GPA Overview</div></div>
          <div className="gpa-section">
            <div className="gpa-ring-area">
              <div className="ring-wrap">
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="44" fill="none" stroke="#E8E4DC" strokeWidth="9"/>
                  <circle cx="55" cy="55" r="44" fill="none" stroke="#4A7C6F" strokeWidth="9" strokeDasharray={`${(1-(1.75-1)/3)*276.5} 276.5`} strokeLinecap="round"/>
                </svg>
                <div className="ring-center"><div className="ring-val">1.75</div><div className="ring-lbl">GPA</div></div>
              </div>
              <div className="gpa-meta"><div className="gpa-meta-title">Very Good Standing</div><div className="gpa-meta-sub">Philippine grading scale<br/>1.0 (highest) — 5.0 (failed)</div></div>
            </div>
            <div className="gpa-bars">
              {SEMESTERS.map((s,i)=>(
                <div className="gpa-bar-row" key={i}>
                  <div className="gba-lbl">{s.sem.split(" ").slice(0,2).join(" ")}</div>
                  <div className="gba-bg"><div className="gba-fill" style={{width:`${(1-(parseFloat(s.gpa)-1)/3)*100}%`,background:i===2?"var(--sage)":i===1?"var(--slate)":"var(--terra)",opacity:i===2?1:0.5}}/></div>
                  <div className="gba-val">{s.gpa}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Grades() {
  const [active, setActive] = useState(2);
  const sem = SEMESTERS[active];
  return (
    <>
      <div className="sem-cards">
        {SEMESTERS.map((s,i)=>(
          <div key={i} className={`sem-card ${active===i?"active":""}`} onClick={()=>setActive(i)}>
            <div className="sem-card-lbl">{s.sem}</div>
            <div className="sem-card-gpa">{s.gpa}</div>
            <div className="sem-card-units">{s.units} units enrolled</div>
          </div>
        ))}
      </div>
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title"><div className="panel-title-ico ico-sage">📋</div>{sem.sem} — Grade Report</div>
          <span style={{fontSize:12,color:"var(--muted)"}}>GPA: <b style={{color:"var(--sage)"}}>{sem.gpa}</b></span>
        </div>
        <table className="subj-table" style={{width:"100%"}}>
          <thead><tr><th>Code</th><th>Course</th><th>Units</th><th>Grade</th><th>Equiv.</th></tr></thead>
          <tbody>
            {sem.courses.map((c,i)=>{
              const n=parseFloat(c.grade); const l=isNaN(n)?"B":n<=1.5?"A":n<=2.0?"B":"C";
              return (
                <tr key={i}>
                  <td><span className="code-tag">{c.code}</span></td>
                  <td><div className="subj-name">{c.name}</div></td>
                  <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"var(--muted)"}}>{c.units}</td>
                  <td><span className={`grade-chip ${gradeClass(l)}`}>{c.grade}</span></td>
                  <td style={{fontSize:12,color:"var(--muted)"}}>{gradeEquiv(c.grade)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Schedule() {
  return (
    <>
      <div className="panel" style={{marginBottom:20}}>
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
        <div className="panel-head"><div className="panel-title"><div className="panel-title-ico ico-terra">🗓</div>Today's Schedule</div><span style={{fontSize:11,color:"var(--muted)"}}>Tuesday, Mar 10</span></div>
        <div className="sched-list">
          {SCHEDULE_TODAY.map((s,i)=>(
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

function Enrollment() {
  const [list, setList] = useState(ENROLLABLE.map(e=>({...e,enrolled:false})));
  const [q, setQ] = useState("");
  const [f, setF] = useState("All");
  const toggle = code => setList(p=>p.map(s=>s.code===code?{...s,enrolled:!s.enrolled}:s));
  const shown = list.filter(s=>{
    const m=s.name.toLowerCase().includes(q.toLowerCase())||s.code.toLowerCase().includes(q.toLowerCase());
    if(f==="Available") return m&&s.slots>0&&!s.enrolled;
    if(f==="Enrolled")  return m&&s.enrolled;
    return m;
  });
  return (
    <>
      <div className="enroll-toolbar">
        <input className="search-box" placeholder="Search by subject name or code…" value={q} onChange={e=>setQ(e.target.value)}/>
        {["All","Available","Enrolled"].map(fil=>(
          <button key={fil} className={`filter-pill ${f===fil?"active":""}`} onClick={()=>setF(fil)}>{fil}</button>
        ))}
      </div>
      <div className="enroll-grid">
        {shown.map(s=>(
          <div key={s.code} className={`course-card ${s.enrolled?"enrolled-card":""}`}>
            {s.enrolled&&<div className="enrolled-tag">✓ Enrolled</div>}
            <div className="cc-code">{s.code}</div>
            <div className="cc-name">{s.name}</div>
            <div className="cc-prof">{s.prof}</div>
            <div className="cc-foot">
              <span className="cc-units">{s.units} units</span>
              <span className={`slots-txt ${s.slots===0?"slots-full":s.slots<5?"slots-warn":"slots-ok"}`}>{s.slots===0?"FULL":`${s.slots} slots`}</span>
            </div>
            <button className={`cc-btn ${s.enrolled?"cc-btn-drop":s.slots===0?"cc-btn-full":"cc-btn-enroll"}`} disabled={s.slots===0&&!s.enrolled} onClick={()=>toggle(s.code)}>
              {s.enrolled?"Drop Subject":s.slots===0?"Class Full":"Enroll Now"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function Announcements() {
  const [tab, setTab] = useState("All");
  const shown = ANNOUNCEMENTS.filter(a=>{
    if(tab==="Exams")    return a.type==="exam";
    if(tab==="Events")   return a.type==="event";
    if(tab==="Deadlines")return a.type==="deadline";
    return true;
  });
  return (
    <div className="panel">
      <div className="tab-bar">
        {["All","Exams","Events","Deadlines"].map(t=>(
          <button key={t} className={`tab-pill ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="ann-list">
        {shown.map((a,i)=>(
          <div className="ann-item" key={i}>
            <div className="ann-row1"><span className={`ann-badge ${a.badge}`}>{a.label}</span><span className="ann-date">{a.date}</span></div>
            <div className="ann-title">{a.title}</div>
            <div className="ann-body">{a.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings({ user }) {
  const [section, setSection] = useState("profile");
  const [toast, setToast]     = useState(false);
  const [profile, setProfile] = useState({
    firstName: user?.firstName || "Juan",
    lastName:  user?.lastName  || "Dela Cruz",
    email:     user?.email     || "juan.delacruz@student.edu",
    program:   user?.program   || "BS Computer Science",
    yearLevel: user?.yearLevel || "3",
  });
  const [passwords, setPasswords] = useState({ current:"", newPass:"", confirm:"" });
  const [notif, setNotif] = useState({ email:true, announcements:true, grades:true, enrollment:false });
  const [display, setDisplay] = useState({ compact:false, animations:true, language:"English" });

  const save = () => {
    setToast(true);
    setTimeout(()=>setToast(false), 2500);
  };

  const SECTIONS = [
    { id:"profile",  ico:"👤", label:"Profile" },
    { id:"password", ico:"🔒", label:"Password" },
    { id:"notif",    ico:"🔔", label:"Notifications" },
    { id:"display",  ico:"🎨", label:"Display" },
    { id:"privacy",  ico:"🛡",  label:"Privacy & Security" },
  ];

  return (
    <div className="settings-grid">
      {/* Left Nav */}
      <div className="settings-nav">
        {SECTIONS.map(s=>(
          <button key={s.id} className={`settings-nav-btn ${section===s.id?"active":""}`} onClick={()=>setSection(s.id)}>
            <span className="settings-nav-ico">{s.ico}</span>{s.label}
          </button>
        ))}
      </div>

      {/* Right Content */}
      <div className="settings-section">

        {section==="profile" && (
          <div className="settings-card">
            <div className="settings-card-head">
              <div className="settings-card-title">Profile Information</div>
              <div className="settings-card-sub">Update your personal details</div>
            </div>
            <div className="settings-card-body">
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:4}}>
                <div className="avatar-large">{(profile.firstName[0]||"")+(profile.lastName[0]||"")}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:16,color:"var(--ink)"}}>{profile.firstName} {profile.lastName}</div>
                  <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Student · {profile.program}</div>
                </div>
              </div>
              <hr className="settings-divider"/>
              <div className="settings-row">
                <div><div className="settings-row-label">First Name</div></div>
                <input className="settings-input" value={profile.firstName} onChange={e=>setProfile(p=>({...p,firstName:e.target.value}))}/>
              </div>
              <div className="settings-row">
                <div><div className="settings-row-label">Last Name</div></div>
                <input className="settings-input" value={profile.lastName} onChange={e=>setProfile(p=>({...p,lastName:e.target.value}))}/>
              </div>
              <div className="settings-row">
                <div><div className="settings-row-label">Email Address</div><div className="settings-row-desc">Used for notifications</div></div>
                <input className="settings-input" type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))}/>
              </div>
              <div className="settings-row">
                <div><div className="settings-row-label">Student ID</div><div className="settings-row-desc">Cannot be changed</div></div>
                <input className="settings-input" value={user?.studentId || "2022-CS-00412"} disabled/>
              </div>
              <div className="settings-row">
                <div><div className="settings-row-label">Program</div></div>
                <select className="settings-select" value={profile.program} onChange={e=>setProfile(p=>({...p,program:e.target.value}))}>
                  <option>BS Computer Science</option>
                  <option>BS Information Technology</option>
                  <option>BS Information Systems</option>
                </select>
              </div>
              <div className="settings-row">
                <div><div className="settings-row-label">Year Level</div></div>
                <select className="settings-select" value={profile.yearLevel} onChange={e=>setProfile(p=>({...p,yearLevel:e.target.value}))}>
                  {[1,2,3,4].map(y=><option key={y}>{y}</option>)}
                </select>
              </div>
              <button className="settings-save-btn" onClick={save}>Save Changes</button>
            </div>
          </div>
        )}

        {section==="password" && (
          <div className="settings-card">
            <div className="settings-card-head">
              <div className="settings-card-title">Change Password</div>
              <div className="settings-card-sub">Use a strong password with letters, numbers, and symbols</div>
            </div>
            <div className="settings-card-body">
              <div className="settings-row">
                <div><div className="settings-row-label">Current Password</div></div>
                <input className="settings-input" type="password" placeholder="Enter current password" value={passwords.current} onChange={e=>setPasswords(p=>({...p,current:e.target.value}))}/>
              </div>
              <div className="settings-row">
                <div><div className="settings-row-label">New Password</div></div>
                <input className="settings-input" type="password" placeholder="At least 8 characters" value={passwords.newPass} onChange={e=>setPasswords(p=>({...p,newPass:e.target.value}))}/>
              </div>
              <div className="settings-row">
                <div><div className="settings-row-label">Confirm New Password</div></div>
                <input className="settings-input" type="password" placeholder="Re-enter new password" value={passwords.confirm} onChange={e=>setPasswords(p=>({...p,confirm:e.target.value}))}/>
              </div>
              {passwords.newPass && passwords.confirm && passwords.newPass !== passwords.confirm && (
                <div style={{fontSize:12,color:"var(--terra)",fontWeight:600}}>⚠ Passwords do not match</div>
              )}
              <button className="settings-save-btn" onClick={save} disabled={!passwords.current||!passwords.newPass||passwords.newPass!==passwords.confirm} style={{opacity:(!passwords.current||!passwords.newPass||passwords.newPass!==passwords.confirm)?0.5:1}}>Update Password</button>
            </div>
          </div>
        )}

        {section==="notif" && (
          <div className="settings-card">
            <div className="settings-card-head">
              <div className="settings-card-title">Notification Preferences</div>
              <div className="settings-card-sub">Choose what you want to be notified about</div>
            </div>
            <div className="settings-card-body">
              {[
                {key:"email",         label:"Email Notifications",   desc:"Receive updates via email"},
                {key:"announcements", label:"Announcements",          desc:"New school announcements"},
                {key:"grades",        label:"Grade Updates",          desc:"When instructors post grades"},
                {key:"enrollment",    label:"Enrollment Reminders",   desc:"Enrollment period alerts"},
              ].map(n=>(
                <div key={n.key} className="settings-row">
                  <div><div className="settings-row-label">{n.label}</div><div className="settings-row-desc">{n.desc}</div></div>
                  <Toggle on={notif[n.key]} onToggle={()=>setNotif(p=>({...p,[n.key]:!p[n.key]}))}/>
                </div>
              ))}
              <button className="settings-save-btn" onClick={save}>Save Preferences</button>
            </div>
          </div>
        )}

        {section==="display" && (
          <div className="settings-card">
            <div className="settings-card-head">
              <div className="settings-card-title">Display Settings</div>
              <div className="settings-card-sub">Customize your interface</div>
            </div>
            <div className="settings-card-body">
              <div className="settings-row">
                <div><div className="settings-row-label">Compact Mode</div><div className="settings-row-desc">Reduce spacing for more content</div></div>
                <Toggle on={display.compact} onToggle={()=>setDisplay(p=>({...p,compact:!p.compact}))}/>
              </div>
              <div className="settings-row">
                <div><div className="settings-row-label">Animations</div><div className="settings-row-desc">Enable UI transitions</div></div>
                <Toggle on={display.animations} onToggle={()=>setDisplay(p=>({...p,animations:!p.animations}))}/>
              </div>
              <div className="settings-row">
                <div><div className="settings-row-label">Language</div></div>
                <select className="settings-select" value={display.language} onChange={e=>setDisplay(p=>({...p,language:e.target.value}))}>
                  <option>English</option>
                  <option>Filipino</option>
                </select>
              </div>
              <button className="settings-save-btn" onClick={save}>Apply Settings</button>
            </div>
          </div>
        )}

        {section==="privacy" && (
          <div className="settings-card">
            <div className="settings-card-head">
              <div className="settings-card-title">Privacy & Security</div>
              <div className="settings-card-sub">Manage your account security</div>
            </div>
            <div className="settings-card-body">
              <div style={{background:"var(--sage3)",border:"1.5px solid var(--sage2)",borderRadius:"var(--r)",padding:"14px 18px"}}>
                <div style={{fontWeight:700,fontSize:13,color:"var(--sage)",marginBottom:4}}>✓ Account Active</div>
                <div style={{fontSize:12,color:"var(--ink3)"}}>Your account is in good standing. Last login recorded successfully.</div>
              </div>
              <div className="settings-row">
                <div><div className="settings-row-label">Active Sessions</div><div className="settings-row-desc">You are logged in on 1 device</div></div>
                <button style={{padding:"7px 16px",borderRadius:8,border:"1.5px solid var(--border)",background:"white",fontSize:12,fontWeight:600,color:"var(--ink3)",cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>View</button>
              </div>
              <hr className="settings-divider"/>
              <div>
                <div className="settings-row-label" style={{marginBottom:6,color:"var(--terra)"}}>Danger Zone</div>
                <div className="settings-row-desc" style={{marginBottom:12}}>These actions are irreversible. Please proceed with caution.</div>
                <button className="settings-danger-btn">Deactivate Account</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && <div className="save-toast">✓ Changes saved successfully</div>}
    </div>
  );
}

// ── ROOT ────────────────────────────────────────────────────
const TITLES = {
  dashboard:"Dashboard", grades:"Academic Records",
  schedule:"Class Schedule", enrollment:"Subject Enrollment",
  announcements:"Announcements", settings:"Settings",
};

export default function AcadTrackDashboard({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(false);

  const go = id => { setPage(id); setOpen(false); };

  const initials = user?.firstName
    ? (user.firstName[0]||"")+(user.lastName?.[0]||"")
    : user?.name
      ? user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()
      : "ST";

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName||""}`
    : user?.name || "Student";

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
          </div>

          <div className="nav-group">
            <div className="nav-group-label">Navigation</div>
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
                <div className="user-id">{user?.studentId || user?.email || ""}</div>
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
              <div className="sem-tag">1st Sem · A.Y. 2025–2026</div>
              <button className="icon-btn">🔔</button>
              <button className="icon-btn" onClick={()=>go("settings")}>⚙</button>
            </div>
          </header>

          <main className="content" key={page}>
            {page==="dashboard"     && <Dashboard/>}
            {page==="grades"        && <Grades/>}
            {page==="schedule"      && <Schedule/>}
            {page==="enrollment"    && <Enrollment/>}
            {page==="announcements" && <Announcements/>}
            {page==="settings"      && <Settings user={user}/>}
          </main>
        </div>
      </div>
    </>
  );
}