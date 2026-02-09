import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Websites from './pages/Websites';
import Events from './pages/Events';
import Users from './pages/Users';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
        <Sidebar user={user} />
        <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Topbar onLogout={handleLogout} />
          <div style={{ marginTop: '64px', flex: 1 }}>
            <Routes>
              <Route path="/" element={<Websites />} />
              <Route path="/events" element={<Events />} />
              <Route path="/users" element={user.role === 'Admin' ? <Users /> : <Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
