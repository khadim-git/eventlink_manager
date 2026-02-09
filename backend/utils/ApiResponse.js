const { HTTP_STATUS } = require('../constants');

class ApiResponse {
  static success(res, data, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static error(res, message = 'Error', statusCode = HTTP_STATUS.SERVER_ERROR, error = null) {
    const response = { success: false, message };
    if (error && process.env.NODE_ENV === 'development') {
      response.error = error;
    }
    return res.status(statusCode).json(response);
  }

  static created(res, data, message = 'Created successfully') {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, HTTP_STATUS.NOT_FOUND);
  }

  static badRequest(res, message = 'Bad request') {
    return this.error(res, message, HTTP_STATUS.BAD_REQUEST);
  }

  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, HTTP_STATUS.FORBIDDEN);
  }
}

module.exports = ApiResponse;
