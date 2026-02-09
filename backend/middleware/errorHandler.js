const { HTTP_STATUS } = require('../constants');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Duplicate entry. This record already exists.'
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Invalid reference. Related record does not exist.'
    });
  }

  const statusCode = err.statusCode || HTTP_STATUS.SERVER_ERROR;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
