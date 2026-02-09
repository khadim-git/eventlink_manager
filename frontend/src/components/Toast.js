import React from 'react';

const Toast = ({ toast }) => {
  if (!toast) return null;

  const colors = {
    success: '#4caf50',
    error: '#f44336',
    info: '#2196f3'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      padding: '16px 24px',
      background: colors[toast.type] || colors.info,
      color: 'white',
      borderRadius: '4px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 9999,
      fontSize: '14px',
      fontWeight: '500',
      animation: 'slideIn 0.3s ease'
    }}>
      {toast.message}
    </div>
  );
};

export default Toast;
