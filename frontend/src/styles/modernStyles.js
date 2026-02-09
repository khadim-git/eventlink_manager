export const modernStyles = {
  pageContainer: { padding: '24px', minHeight: 'calc(100vh - 64px)', background: '#f5f5f5' },
  card: { background: 'white', padding: '24px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  pageHeader: { marginBottom: '24px' },
  pageTitle: { fontSize: '24px', fontWeight: '500', margin: '0 0 8px 0', color: '#212121', display: 'flex', alignItems: 'center', gap: '12px' },
  pageSubtitle: { fontSize: '14px', margin: '0', color: '#757575' },
  primaryBtn: { padding: '8px 16px', background: '#212121', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'background 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'inline-flex', alignItems: 'center', gap: '6px' },
  successBtn: { padding: '8px 16px', background: '#212121', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'background 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'inline-flex', alignItems: 'center', gap: '6px' },
  dangerBtn: { padding: '8px 16px', background: '#424242', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'background 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'inline-flex', alignItems: 'center', gap: '6px' },
  infoBtn: { padding: '8px 16px', background: '#616161', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'background 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'inline-flex', alignItems: 'center', gap: '6px' },
  input: { padding: '12px', border: '1px solid #bdbdbd', borderRadius: '4px', fontSize: '14px', outline: 'none', transition: 'border 0.3s', width: '100%', boxSizing: 'border-box', fontFamily: 'Roboto, sans-serif' },
  select: { padding: '12px', border: '1px solid #bdbdbd', borderRadius: '4px', fontSize: '14px', outline: 'none', transition: 'border 0.3s', background: 'white', cursor: 'pointer', fontFamily: 'Roboto, sans-serif' },
  table: { width: '100%', borderCollapse: 'collapse', background: 'white' },
  th: { padding: '16px', textAlign: 'left', background: '#fafafa', color: '#616161', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e0e0e0' },
  td: { padding: '16px', fontSize: '14px', borderBottom: '1px solid #e0e0e0', color: '#212121' },
  badge: { padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '500', display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.5px' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { background: 'white', padding: '24px', borderRadius: '4px', width: '500px', maxWidth: '90%', boxShadow: '0 11px 15px -7px rgba(0,0,0,0.2), 0 24px 38px 3px rgba(0,0,0,0.14)' },
  modalTitle: { fontSize: '20px', fontWeight: '500', marginBottom: '20px', color: '#212121', display: 'flex', alignItems: 'center', gap: '8px' }
};

export const injectGlobalStyles = () => {
  if (document.getElementById('modern-styles')) return;
  const styleSheet = document.createElement('style');
  styleSheet.id = 'modern-styles';
  styleSheet.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
    * { font-family: 'Roboto', sans-serif; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    input:focus, select:focus { border-color: #1976d2 !important; }
    button:hover:not(:disabled) { filter: brightness(0.9); }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    tr:hover { background: #fafafa !important; }
  `;
  document.head.appendChild(styleSheet);
};
