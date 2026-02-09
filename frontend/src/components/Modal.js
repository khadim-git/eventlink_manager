import React from 'react';
import { modernStyles } from '../styles/modernStyles';

const Modal = ({ isOpen, onClose, title, children, icon = 'edit' }) => {
  if (!isOpen) return null;

  return (
    <div style={modernStyles.modal} onClick={onClose}>
      <div style={modernStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 style={modernStyles.modalTitle}>
          <span className="material-icons">{icon}</span>
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
};

export default Modal;
