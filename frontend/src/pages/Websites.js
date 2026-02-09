import React, { useState, useEffect } from 'react';
import { websiteService } from '../services/api';
import { modernStyles, injectGlobalStyles } from '../styles/modernStyles';
import { useApi } from '../hooks/useApi';
import { useModal } from '../hooks/useModal';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import Table from '../components/Table';

const Websites = () => {
  const [allWebsites, setAllWebsites] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({ WebsiteCode: '', BaseURL: '', Status: 'Active' });
  
  const { loading, execute } = useApi();
  const modal = useModal();
  const { toast, showSuccess, showError } = useToast();

  useEffect(() => {
    injectGlobalStyles();
    fetchWebsites();
  }, []);

  const fetchWebsites = () => {
    execute(
      () => websiteService.getAll(),
      (data) => setAllWebsites(data.data || data)
    );
  };

  const filteredWebsites = allWebsites.filter(website => {
    const matchesSearch = !search || 
      website.WebsiteCode.toLowerCase().includes(search.toLowerCase()) ||
      website.BaseURL.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = !statusFilter || website.Status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiCall = modal.data 
      ? () => websiteService.update(modal.data.id, formData)
      : () => websiteService.create(formData);

    execute(apiCall, () => {
      showSuccess(`Website ${modal.data ? 'updated' : 'created'} successfully`);
      modal.close();
      setFormData({ WebsiteCode: '', BaseURL: '', Status: 'Active' });
      fetchWebsites();
    }, showError);
  };

  const handleEdit = (website) => {
    setFormData({ WebsiteCode: website.WebsiteCode, BaseURL: website.BaseURL, Status: website.Status });
    modal.open(website);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      execute(
        () => websiteService.delete(id),
        () => {
          showSuccess('Website deleted successfully');
          fetchWebsites();
        },
        showError
      );
    }
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      execute(
        () => websiteService.importCSV(file),
        (data) => {
          showSuccess(`Imported ${data.data?.imported || 0} websites`);
          fetchWebsites();
        },
        showError
      );
    }
  };

  const columns = [
    { header: 'Website Code', field: 'WebsiteCode' },
    { header: 'Base URL', field: 'BaseURL' },
    {
      header: 'Status',
      render: (row) => (
        <span style={{
          ...modernStyles.badge,
          background: row.Status === 'Active' ? '#4caf50' : '#757575',
          color: 'white'
        }}>
          {row.Status}
        </span>
      )
    }
  ];

  return (
    <div style={modernStyles.pageContainer}>
      <div style={modernStyles.pageHeader}>
        <h1 style={modernStyles.pageTitle}>
          <span className="material-icons" style={{fontSize: '28px'}}>language</span>
          Website Management
        </h1>
        <p style={modernStyles.pageSubtitle}>Manage all your websites in one place</p>
      </div>

      <div style={modernStyles.card}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{...modernStyles.input, width: '250px'}}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={modernStyles.select}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <label style={{...modernStyles.infoBtn, cursor: 'pointer'}}>
            <span className="material-icons" style={{fontSize: '18px'}}>upload_file</span>
            Import CSV
            <input type="file" accept=".csv" onChange={handleCSVImport} style={{ display: 'none' }} />
          </label>
          <button onClick={() => { modal.open(); setFormData({ WebsiteCode: '', BaseURL: '', Status: 'Active' }); }} style={modernStyles.successBtn}>
            <span className="material-icons" style={{fontSize: '18px'}}>add</span>
            Add Website
          </button>
        </div>

        <Table
          columns={columns}
          data={filteredWebsites}
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
        title={modal.data ? 'Edit Website' : 'Add Website'}
        icon={modal.data ? 'edit' : 'add'}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Website Code"
            value={formData.WebsiteCode}
            onChange={(e) => setFormData({ ...formData, WebsiteCode: e.target.value })}
            style={{...modernStyles.input, marginBottom: '15px'}}
            required
          />
          <input
            type="text"
            placeholder="Base URL"
            value={formData.BaseURL}
            onChange={(e) => setFormData({ ...formData, BaseURL: e.target.value })}
            style={{...modernStyles.input, marginBottom: '15px'}}
            required
          />
          <select
            value={formData.Status}
            onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
            style={{...modernStyles.select, marginBottom: '15px', width: '100%'}}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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

export default Websites;
