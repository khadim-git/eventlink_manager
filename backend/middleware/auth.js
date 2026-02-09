const jwt = require('jsonwebtoken');
const { ROLES, MESSAGES, HTTP_STATUS } = require('../constants');
const ApiResponse = require('../utils/ApiResponse');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return ApiResponse.unauthorized(res, MESSAGES.NO_TOKEN);
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, MESSAGES.INVALID_TOKEN);
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN) {
    return ApiResponse.forbidden(res, MESSAGES.ADMIN_REQUIRED);
  }
  next();
};

module.exports = { authMiddleware, adminOnly };
