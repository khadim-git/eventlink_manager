module.exports = {
  STATUS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected'
  },
  
  ROLES: {
    ADMIN: 'Admin',
    EDITOR: 'Editor'
  },
  
  CHANGE_TYPES: {
    DATE: 'Date',
    LOCATION: 'Location',
    NAME: 'Name',
    OTHER: 'Other'
  },
  
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  },
  
  MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    NO_TOKEN: 'No token provided',
    INVALID_TOKEN: 'Invalid token',
    ADMIN_REQUIRED: 'Admin access required',
    SERVER_ERROR: 'Server error',
    NOT_FOUND: 'Resource not found',
    DUPLICATE_ENTRY: 'Entry already exists'
  }
};
