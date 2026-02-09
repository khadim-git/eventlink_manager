import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: 'language', label: 'Websites' },
    { path: '/events', icon: 'search', label: 'Events' },
    ...(user?.role === 'Admin' ? [{ path: '/users', icon: 'people', label: 'Users' }] : [])
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.brand}>
        <span className="material-icons" style={styles.brandIcon}>dashboard</span>
        <span style={styles.brandText}>EventLink</span>
      </div>
      
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.menuItem,
              ...(location.pathname === item.path ? styles.menuItemActive : {})
            }}
          >
            <span className="material-icons" style={styles.menuIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div style={styles.userSection}>
        <div style={styles.userInfo}>
          <span className="material-icons" style={styles.userIcon}>account_circle</span>
          <div style={styles.userDetails}>
            <div style={styles.userName}>{user?.username}</div>
            <div style={styles.userRole}>{user?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    height: '100vh',
    background: '#212121',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
  },
  brand: {
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  brandIcon: {
    fontSize: '32px'
  },
  brandText: {
    fontSize: '20px',
    fontWeight: '500'
  },
  nav: {
    flex: 1,
    padding: '16px 0',
    overflowY: 'auto'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 20px',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    transition: 'all 0.3s',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '400'
  },
  menuItemActive: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    borderLeft: '4px solid white'
  },
  menuIcon: {
    fontSize: '24px'
  },
  userSection: {
    padding: '16px',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px'
  },
  userIcon: {
    fontSize: '40px',
    color: 'rgba(255,255,255,0.7)'
  },
  userDetails: {
    flex: 1
  },
  userName: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '4px'
  },
  userRole: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)'
  }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .sidebar a:hover {
    background: rgba(255,255,255,0.08) !important;
    color: white !important;
  }
`;
document.head.appendChild(styleSheet);

export default Sidebar;
