import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { modernStyles, injectGlobalStyles } from '../styles/modernStyles';
import { useApi } from '../hooks/useApi';
import { useModal } from '../hooks/useModal';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import Table from '../components/Table';

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', password: '', email: '', role: 'Editor' });
  
  const { loading, execute } = useApi();
  const modal = useModal();
  const { toast, showSuccess, showError } = useToast();

  useEffect(() => {
    injectGlobalStyles();
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    execute(
      () => userService.getAll(),
      (data) => setAllUsers(data.data || data)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiCall = modal.data
      ? () => userService.update(modal.data.id, formData)
      : () => userService.create(formData);

    execute(apiCall, () => {
      showSuccess(`User ${modal.data ? 'updated' : 'created'} successfully`);
      modal.close();
      setFormData({ username: '', password: '', email: '', role: 'Editor' });
      fetchUsers();
    }, showError);
  };

  const handleEdit = (user) => {
    setFormData({ username: user.username, password: '', email: user.email, role: user.role });
    modal.open(user);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      execute(
        () => userService.delete(id),
        () => {
          showSuccess('User deleted successfully');
          fetchUsers();
        },
        showError
      );
    }
  };

  const columns = [
    { header: 'Username', field: 'username' },
    { header: 'Email', field: 'email' },
    {
      header: 'Role',
      render: (row) => (
        <span style={{
          ...modernStyles.badge,
          background: row.role === 'Admin' ? '#212121' : '#616161',
          color: 'white'
        }}>
          {row.role}
        </span>
      )
    }
  ];

  return (
    <div style={modernStyles.pageContainer}>
      <div style={modernStyles.pageHeader}>
        <h1 style={modernStyles.pageTitle}>
          <span className="material-icons" style={{fontSize: '28px'}}>people</span>
          User Management
        </h1>
        <p style={modernStyles.pageSubtitle}>Manage user accounts and permissions</p>
      </div>

      <div style={modernStyles.card}>
        <div style={{ marginBottom: '24px' }}>
          <button onClick={() => { modal.open(); setFormData({ username: '', password: '', email: '', role: 'Editor' }); }} style={modernStyles.successBtn}>
            <span className="material-icons" style={{fontSize: '18px'}}>add</span>
            Add User
          </button>
        </div>

        <Table
          columns={columns}
          data={allUsers}
          actions={(row) => (
            <>
              <button onClick={() => handleEdit(row)} style={{...modernStyles.infoBtn, marginRight: '8px'}}>
                <span className="material-icons" style={{fontSize: '18px'}}>edit</span>
                Edit
              </button>
              <button onClick={() => handleDelete(row.id)} style={modernStyles.dangerBtn}>
                <span className="material-icons" style={{fontSize: '18px'}}>delete</span>
                Delete
              </button>
            </>
          )}
        />
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title={modal.data ? 'Edit User' : 'Add User'}
        icon={modal.data ? 'edit' : 'add'}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            style={{...modernStyles.input, marginBottom: '15px'}}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{...modernStyles.input, marginBottom: '15px'}}
            required
          />
          <input
            type="password"
            placeholder={modal.data ? 'Password (leave blank to keep current)' : 'Password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{...modernStyles.input, marginBottom: '15px'}}
            required={!modal.data}
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{...modernStyles.select, marginBottom: '15px', width: '100%'}}
          >
            <option value="Editor">Editor</option>
            <option value="Admin">Admin</option>
          </select>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="submit" style={modernStyles.successBtn} disabled={loading}>
              <span className="material-icons" style={{fontSize: '18px'}}>check</span>
              Save
            </button>
            <button type="button" onClick={modal.close} style={{...modernStyles.dangerBtn, background: '#757575'}}>
              <span className="material-icons" style={{fontSize: '18px'}}>close</span>
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} />
    </div>
  );
};

export default Users;
