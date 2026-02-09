const express = require('express');
const FormData = require('form-data');
const db = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HttpClient = require('../utils/HttpClient');
const { STATUS, CHANGE_TYPES } = require('../constants');
const router = express.Router();

// Get upcoming events
router.get('/upcoming', authMiddleware, asyncHandler(async (req, res) => {
  const [events] = await db.query(`
    SELECT e.*, 
      (SELECT COUNT(*) FROM EventChanges WHERE event_id = e.id AND Status = ?) as pending_changes
    FROM Events e
    WHERE e.EventDate >= CURDATE()
    ORDER BY e.EventDate ASC
  `, [STATUS.PENDING]);
  
  ApiResponse.success(res, events);
}));

// Get all events
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM Events WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (EventCode LIKE ? OR EventName LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY EventDate DESC';
  const [events] = await db.query(query, params);
  ApiResponse.success(res, events);
}));

// Get linked websites for an event
router.get('/:eventCode/websites', authMiddleware, asyncHandler(async (req, res) => {
  const [results] = await db.query(`
    SELECT w.*, we.Status as LinkStatus, we.id as LinkId, we.RelatedEventLink
    FROM Websites w
    INNER JOIN WebsiteEvents we ON w.id = we.website_id
    INNER JOIN Events e ON we.event_id = e.id
    WHERE e.EventCode = ?
  `, [req.params.eventCode]);
  
  ApiResponse.success(res, results);
}));

// Sync events from external API
router.post('/sync', authMiddleware, asyncHandler(async (req, res) => {
  const events = req.body.events || [];
  const synced = [];
  const changes = [];

  for (const event of events) {
    const [existing] = await db.query('SELECT * FROM Events WHERE EventCode = ?', [event.EventCode]);
    
    if (existing.length === 0) {
      const [result] = await db.query(
        'INSERT INTO Events (EventCode, EventName, EventDate, Location) VALUES (?, ?, ?, ?)',
        [event.EventCode, event.EventName, event.EventDate, event.Location]
      );
      synced.push({ id: result.insertId, ...event });
    } else {
      const old = existing[0];
      const changeTypes = [
        { field: 'EventDate', type: CHANGE_TYPES.DATE },
        { field: 'Location', type: CHANGE_TYPES.LOCATION },
        { field: 'EventName', type: CHANGE_TYPES.NAME }
      ];

      for (const { field, type } of changeTypes) {
        if (old[field] !== event[field]) {
          await db.query(
            'INSERT INTO EventChanges (event_id, change_type, old_value, new_value) VALUES (?, ?, ?, ?)',
            [old.id, type, old[field], event[field]]
          );
        }
      }

      if (changeTypes.some(({ field }) => old[field] !== event[field])) {
        changes.push({ EventCode: event.EventCode, changes: 'Pending approval' });
      }
    }
  }

  ApiResponse.success(res, { synced, changes }, 'Sync completed');
}));

// Get pending changes
router.get('/changes/pending', authMiddleware, asyncHandler(async (req, res) => {
  const [changes] = await db.query(`
    SELECT ec.*, e.EventCode, e.EventName
    FROM EventChanges ec
    INNER JOIN Events e ON ec.event_id = e.id
    WHERE ec.Status = ?
    ORDER BY ec.CreatedAt DESC
  `, [STATUS.PENDING]);
  
  ApiResponse.success(res, changes);
}));

// Approve/Reject change
router.put('/changes/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { status } = req.body;
  const [changes] = await db.query('SELECT * FROM EventChanges WHERE id = ?', [req.params.id]);
  
  if (changes.length === 0) {
    return ApiResponse.notFound(res, 'Change not found');
  }

  const change = changes[0];
  const fieldMap = {
    [CHANGE_TYPES.DATE]: 'EventDate',
    [CHANGE_TYPES.LOCATION]: 'Location',
    [CHANGE_TYPES.NAME]: 'EventName'
  };

  if (status === STATUS.APPROVED) {
    const field = fieldMap[change.change_type];
    await db.query(`UPDATE Events SET ${field} = ? WHERE id = ?`, [change.new_value, change.event_id]);
  }

  await db.query('UPDATE EventChanges SET Status = ? WHERE id = ?', [status, req.params.id]);
  ApiResponse.success(res, null, `Change ${status.toLowerCase()}`);
}));

// Link event to website
router.post('/link', authMiddleware, asyncHandler(async (req, res) => {
  const { website_id, event_id, RelatedEventLink } = req.body;
  
  const [result] = await db.query(
    'INSERT INTO WebsiteEvents (website_id, event_id, RelatedEventLink, Status) VALUES (?, ?, ?, ?)',
    [website_id, event_id, RelatedEventLink, STATUS.PENDING]
  );
  
  ApiResponse.created(res, { 
    id: result.insertId, 
    website_id, 
    event_id, 
    RelatedEventLink, 
    Status: STATUS.PENDING 
  });
}));

// Check event across all websites
router.post('/check-my-websites', authMiddleware, asyncHandler(async (req, res) => {
  const { eventName } = req.body;
  
  if (!eventName) {
    return ApiResponse.badRequest(res, 'Event name is required');
  }

  const [websites] = await db.query('SELECT WebsiteCode, BaseURL FROM Websites WHERE Status = ?', [STATUS.ACTIVE]);

  const promises = websites.map(async (website) => {
    try {
      const response = await HttpClient.get(`${website.BaseURL}/api/upcoming-events`);
      
      if (!HttpClient.isValidResponse(response)) return null;

      const searchLower = eventName.toLowerCase();
      const foundEvent = response.data.find(e => 
        e.eventlink?.toLowerCase().includes(searchLower) ||
        e.EventLink?.toLowerCase().includes(searchLower)
      );

      return foundEvent ? {
        WebsiteCode: website.WebsiteCode,
        BaseURL: website.BaseURL,
        EventId: foundEvent.id || foundEvent.ID,
        EventName: foundEvent.eventname || foundEvent.EventName || '-',
        EventLink: foundEvent.eventlink || foundEvent.EventLink || '',
        EventDate: foundEvent.eventdate || foundEvent.EventDate || '-',
        Status: 'Found'
      } : null;
    } catch {
      return null;
    }
  });

  const results = (await Promise.all(promises)).filter(Boolean);
  ApiResponse.success(res, results);
}));

// Update event date on website's API
router.post('/update-date-on-website', authMiddleware, asyncHandler(async (req, res) => {
  const { websiteUrl, eventId, newDate } = req.body;
  
  if (!websiteUrl || !eventId || !newDate) {
    return ApiResponse.badRequest(res, 'Missing required fields');
  }

  const cleanUrl = websiteUrl.endsWith('/') ? websiteUrl.slice(0, -1) : websiteUrl;
  const formData = new FormData();
  formData.append('eventdate', newDate);
  
  await HttpClient.post(
    `${cleanUrl}/api/upcoming-events/update/${eventId}`,
    formData,
    { headers: formData.getHeaders() }
  );
  
  ApiResponse.success(res, { websiteUpdated: true }, 'Date updated successfully');
}));

module.exports = router;
