const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Validator = require('../utils/Validator');
const { ROLES } = require('../constants');
const router = express.Router();

router.get('/', authMiddleware, adminOnly, asyncHandler(async (req, res) => {
  const [users] = await db.query('SELECT id, username, email, role, CreatedAt FROM Users');
  ApiResponse.success(res, users);
}));

router.post('/', authMiddleware, adminOnly, asyncHandler(async (req, res) => {
  const { username, password, email, role = ROLES.EDITOR } = req.body;
  
  Validator.validateUser({ username, password, email });
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO Users (username, password, email, role) VALUES (?, ?, ?, ?)',
    [username, hashedPassword, email, role]
  );
  
  ApiResponse.created(res, { id: result.insertId, username, email, role });
}));

router.put('/:id', authMiddleware, adminOnly, asyncHandler(async (req, res) => {
  const { username, email, role, password } = req.body;
  
  Validator.validateUser({ username, email, password: password || 'dummy' });
  
  let query = 'UPDATE Users SET username = ?, email = ?, role = ?';
  const params = [username, email, role];

  if (password) {
    query += ', password = ?';
    params.push(await bcrypt.hash(password, 10));
  }
  
  query += ' WHERE id = ?';
  params.push(req.params.id);

  await db.query(query, params);
  ApiResponse.success(res, { id: req.params.id, username, email, role }, 'User updated');
}));

router.delete('/:id', authMiddleware, adminOnly, asyncHandler(async (req, res) => {
  await db.query('DELETE FROM Users WHERE id = ?', [req.params.id]);
  ApiResponse.success(res, null, 'User deleted');
}));

module.exports = router;
