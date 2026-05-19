import { useState, useEffect } from "react";
import AuthPage from "./AuthPage";
import AcadTrackDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./AdminDashboard";
import FacultyDashboard from "./FacultyDashboard";

export default function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const saved = localStorage.getItem('user');
      if (token && saved) {
        setUser(JSON.parse(saved));
      } else {
        setUser(null);
      }
    } catch {
      localStorage.clear();
      setUser(null);
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Loading screen
  if (user === undefined) return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:'#F0EDE6'
    }}>
      <div style={{textAlign:'center'}}>
        <div style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:28, fontWeight:700, color:'#1A1A1F', marginBottom:8
        }}>AcadTrack</div>
        <div style={{color:'#9E9B94', fontSize:14}}>Loading…</div>
      </div>
    </div>
  );

  // Not logged in → show auth page
  if (user === null) return <AuthPage onLogin={handleLogin} />;

  // Route by role
  const role = user?.role;

  if (role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  if (role === 'faculty') {
    return <FacultyDashboard user={user} onLogout={handleLogout} />;
  }

  // Default: student
  return <AcadTrackDashboard user={user} onLogout={handleLogout} />;
}