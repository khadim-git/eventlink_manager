import React, { useState } from 'react';
import { eventService } from '../services/api';
import { modernStyles } from '../styles/modernStyles';
import { useApi } from '../hooks/useApi';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import Loader from '../components/Loader';
import Table from '../components/Table';

const Events = () => {
  const [searchEventName, setSearchEventName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingDate, setEditingDate] = useState('');
  
  const { loading: searching, execute: executeSearch } = useApi();
  const { loading: updating, execute: executeUpdate } = useApi();
  const { toast, showSuccess, showError } = useToast();

  const handleSearchWebsites = (e) => {
    e.preventDefault();
    if (!searchEventName.trim()) {
      showError('Please enter a URL');
      return;
    }

    executeSearch(
      () => eventService.checkMyWebsites(searchEventName),
      (data) => setSearchResults(data.data || data),
      showError
    );
  };

  const handleEditDate = (index) => {
    setEditingIndex(index);
    setEditingDate(searchResults[index].EventDate);
  };

  const handleSaveDate = (index) => {
    const result = searchResults[index];
    
    executeUpdate(
      () => eventService.updateEventDateOnWebsite({
        websiteUrl: result.BaseURL,
        eventId: result.EventId || result.id,
        newDate: editingDate
      }),
      () => {
        const updatedResults = [...searchResults];
        updatedResults[index].EventDate = editingDate;
        setSearchResults(updatedResults);
        setEditingIndex(null);
        showSuccess('Date updated successfully');
      },
      showError
    );
  };

  const columns = [
    { header: 'Event ID', render: (row) => <strong>{row.EventId || '-'}</strong> },
    { header: 'Website Code', render: (row) => <strong>{row.WebsiteCode}</strong> },
    {
      header: 'Base URL',
      render: (row) => (
        <a href={row.BaseURL} target="_blank" rel="noopener noreferrer" style={{ color: '#212121', textDecoration: 'none', fontWeight: '500' }}>
          {row.BaseURL}
        </a>
      )
    },
    { header: 'Event Name', render: (row) => row.EventName || '-' },
    {
      header: 'Event Date',
      render: (row) => {
        const index = row.index;
        return editingIndex === index ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={editingDate}
              onChange={(e) => setEditingDate(e.target.value)}
              style={{ padding: '6px 8px', border: '1px solid #bdbdbd', borderRadius: '4px', fontSize: '13px', width: '150px' }}
            />
            <button onClick={() => handleSaveDate(index)} style={{...modernStyles.successBtn, padding: '4px 8px'}}>
              <span className="material-icons" style={{fontSize: '16px'}}>check</span>
            </button>
            <button onClick={() => setEditingIndex(null)} style={{...modernStyles.dangerBtn, padding: '4px 8px'}}>
              <span className="material-icons" style={{fontSize: '16px'}}>close</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{row.EventDate || '-'}</span>
            <button onClick={() => handleEditDate(index)} style={{...modernStyles.infoBtn, padding: '4px 8px'}} disabled={updating}>
              <span className="material-icons" style={{fontSize: '16px'}}>edit</span>
            </button>
          </div>
        );
      }
    },
    {
      header: 'Event Link',
      render: (row) => row.EventLink ? (
        <a href={row.EventLink} target="_blank" rel="noopener noreferrer" style={{ color: '#212121', textDecoration: 'none', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span className="material-icons" style={{fontSize: '16px'}}>open_in_new</span>
          View
        </a>
      ) : '-'
    }
  ];

  return (
    <div style={modernStyles.pageContainer}>
      <div style={modernStyles.pageHeader}>
        <h1 style={modernStyles.pageTitle}>
          <span className="material-icons" style={{fontSize: '28px'}}>search</span>
          Event Search
        </h1>
        <p style={modernStyles.pageSubtitle}>Search for events across all registered websites</p>
      </div>

      <div style={modernStyles.card}>
        <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '4px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #e0e0e0' }}>
          <span className="material-icons" style={{ fontSize: '24px', color: '#616161' }}>info</span>
          <div>
            <strong style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>How to Search</strong>
            <p style={{ margin: 0, fontSize: '13px', color: '#616161' }}>Enter any part of the event URL (e.g., "pfas-summit.com")</p>
          </div>
        </div>
        
        <form onSubmit={handleSearchWebsites} style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: '300px' }}>
            <span className="material-icons" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: '#757575', pointerEvents: 'none' }}>search</span>
            <input
              type="text"
              placeholder="Enter event URL to search..."
              value={searchEventName}
              onChange={(e) => setSearchEventName(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 44px', border: '1px solid #bdbdbd', borderRadius: '4px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={modernStyles.primaryBtn} disabled={searching}>
            {searching ? 'Searching...' : (
              <><span className="material-icons" style={{fontSize: '18px'}}>search</span> Search</>
            )}
          </button>
        </form>

        {searching && <Loader message="Scanning all websites..." />}

        {searchResults.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#212121', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-icons">check_circle</span>
                Search Results
              </h3>
              <div style={{ background: '#212121', color: 'white', padding: '8px 16px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500' }}>
                <span style={{ fontSize: '18px', fontWeight: '700' }}>{searchResults.length}</span>
                <span>matches</span>
              </div>
            </div>
            <Table columns={columns} data={searchResults.map((item, index) => ({ ...item, index }))} />
          </div>
        )}

        {searchResults.length === 0 && !searching && searchEventName && (
          <div style={{ textAlign: 'center', padding: '60px 40px', background: '#f5f5f5', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <span className="material-icons" style={{ fontSize: '64px', color: '#bdbdbd', marginBottom: '16px' }}>search_off</span>
            <h3 style={{ fontSize: '20px', fontWeight: '500', color: '#212121', margin: '0 0 8px 0' }}>No Matches Found</h3>
            <p style={{ fontSize: '14px', color: '#757575', margin: 0 }}>We couldn't find any events matching "{searchEventName}"</p>
          </div>
        )}
      </div>

      <Toast toast={toast} />
    </div>
  );
};

export default Events;
