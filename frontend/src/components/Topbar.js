import React from 'react';

const Topbar = ({ onLogout }) => {
  return (
    <div style={styles.topbar}>
      <div style={styles.spacer}></div>
      <button onClick={onLogout} style={styles.logoutBtn}>
        <span className="material-icons" style={styles.icon}>logout</span>
        <span>Logout</span>
      </button>
    </div>
  );
};

const styles = {
  topbar: {
    height: '64px',
    background: 'white',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 24px',
    position: 'fixed',
    top: 0,
    left: '260px',
    right: 0,
    zIndex: 100,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  spacer: {
    flex: 1
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#212121',
    transition: 'all 0.3s'
  },
  icon: {
    fontSize: '20px'
  }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  button:hover {
    background: #f5f5f5 !important;
  }
`;
document.head.appendChild(styleSheet);

export default Topbar;
