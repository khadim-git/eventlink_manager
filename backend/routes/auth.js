const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { MESSAGES } = require('../constants');
const router = express.Router();

router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const [users] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
  
  if (users.length === 0 || !await bcrypt.compare(password, users[0].password)) {
    return ApiResponse.unauthorized(res, MESSAGES.INVALID_CREDENTIALS);
  }

  const user = users[0];
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  ApiResponse.success(res, {
    token,
    user: { id: user.id, username: user.username, role: user.role, email: user.email }
  }, 'Login successful');
}));

module.exports = router;
