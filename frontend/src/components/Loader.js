import React from 'react';

const Loader = ({ message = 'Loading...' }) => (
  <div style={{
    textAlign: 'center',
    padding: '40px',
    background: '#f5f5f5',
    borderRadius: '4px',
    border: '1px solid #e0e0e0'
  }}>
    <div style={{
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #212121',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 20px'
    }} />
    <p style={{ color: '#212121', fontSize: '16px', fontWeight: '500', margin: 0 }}>
      {message}
    </p>
  </div>
);

export default Loader;
