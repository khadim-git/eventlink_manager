import React, { useState } from 'react';
import { authService } from '../services/api';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await authService.login(credentials);
      
      const userData = response.data.data || response.data;
      
      if (userData.token && userData.user) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData.user));
        onLogin(userData.user);
      } else {
        setError('Invalid response format');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <span className="material-icons" style={styles.icon}>lock</span>
        </div>
        <h1 style={styles.title}>EventLink Manager</h1>
        <p style={styles.subtitle}>Sign in to your account</p>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <span className="material-icons" style={styles.inputIcon}>person</span>
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <span className="material-icons" style={styles.inputIcon}>lock</span>
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          {error && (
            <p style={styles.error}>
              <span className="material-icons" style={{fontSize: '16px', marginRight: '4px'}}>error</span>
              {error}
            </p>
          )}
          <button type="submit" style={styles.button}>
            <span className="material-icons" style={{fontSize: '18px'}}>login</span>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  boyd: { margin: 0 },
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#212121' },
  card: { background: 'white', padding: '48px 40px', borderRadius: '4px', boxShadow: '0 8px 16px rgba(0,0,0,0.3)', width: '400px', maxWidth: '90%' },
  iconContainer: { textAlign: 'center', marginBottom: '24px' },
  icon: { fontSize: '48px', color: '#212121' },
  title: { fontSize: '24px', fontWeight: '500', textAlign: 'center', margin: '0 0 8px 0', color: '#212121' },
  subtitle: { textAlign: 'center', color: '#757575', marginBottom: '32px', fontSize: '14px' },
  inputGroup: { position: 'relative', marginBottom: '20px' },
  inputIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#757575', pointerEvents: 'none', zIndex: 1 },
  input: { width: '100%', padding: '12px 12px 12px 44px', border: '1px solid #bdbdbd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', transition: 'border 0.3s', fontFamily: 'Roboto, sans-serif' },
  button: { width: '100%', padding: '12px', background: '#212121', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'background 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  error: { color: '#d32f2f', fontSize: '13px', padding: '12px', background: '#ffebee', borderRadius: '4px', margin: '16px 0', display: 'flex', alignItems: 'center' }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
  input:focus { border-color: #212121 !important; }
  button:hover { background: #424242 !important; }
`;
document.head.appendChild(styleSheet);

export default Login;
