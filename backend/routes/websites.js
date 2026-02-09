const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const db = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Validator = require('../utils/Validator');
const { STATUS } = require('../constants');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const { search, status } = req.query;
  let query = 'SELECT * FROM Websites WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (WebsiteCode LIKE ? OR BaseURL LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (status) {
    query += ' AND Status = ?';
    params.push(status);
  }

  query += ' ORDER BY CreatedAt DESC';
  const [websites] = await db.query(query, params);
  ApiResponse.success(res, websites);
}));

router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const [websites] = await db.query('SELECT * FROM Websites WHERE id = ?', [req.params.id]);
  
  if (websites.length === 0) {
    return ApiResponse.notFound(res, 'Website not found');
  }
  
  ApiResponse.success(res, websites[0]);
}));

router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  const { WebsiteCode, BaseURL, Status = STATUS.ACTIVE } = req.body;
  
  Validator.validateWebsite({ WebsiteCode, BaseURL });
  
  const [result] = await db.query(
    'INSERT INTO Websites (WebsiteCode, BaseURL, Status) VALUES (?, ?, ?)',
    [WebsiteCode, BaseURL, Status]
  );
  
  ApiResponse.created(res, { id: result.insertId, WebsiteCode, BaseURL, Status });
}));

router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { WebsiteCode, BaseURL, Status } = req.body;
  
  Validator.validateWebsite({ WebsiteCode, BaseURL });
  
  await db.query(
    'UPDATE Websites SET WebsiteCode = ?, BaseURL = ?, Status = ? WHERE id = ?',
    [WebsiteCode, BaseURL, Status, req.params.id]
  );
  
  ApiResponse.success(res, { id: req.params.id, WebsiteCode, BaseURL, Status }, 'Website updated');
}));

router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  await db.query('DELETE FROM Websites WHERE id = ?', [req.params.id]);
  ApiResponse.success(res, null, 'Website deleted');
}));

router.post('/import/csv', authMiddleware, upload.single('file'), asyncHandler(async (req, res) => {
  const results = [];
  const errors = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', resolve)
      .on('error', reject);
  });

  for (const row of results) {
    try {
      await db.query(
        'INSERT INTO Websites (WebsiteCode, BaseURL, Status) VALUES (?, ?, ?)',
        [row.WebsiteCode, row.BaseURL, row.Status || STATUS.ACTIVE]
      );
    } catch (error) {
      errors.push({ row, error: error.message });
    }
  }

  fs.unlinkSync(req.file.path);
  ApiResponse.success(res, { imported: results.length - errors.length, errors }, 'CSV import completed');
}));

module.exports = router;
