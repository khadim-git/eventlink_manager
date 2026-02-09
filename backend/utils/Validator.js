class Validator {
  static isRequired(value, fieldName) {
    if (!value || (typeof value === 'string' && !value.trim())) {
      throw new Error(`${fieldName} is required`);
    }
    return true;
  }

  static isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    return true;
  }

  static isUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      throw new Error('Invalid URL format');
    }
  }

  static minLength(value, length, fieldName) {
    if (value.length < length) {
      throw new Error(`${fieldName} must be at least ${length} characters`);
    }
    return true;
  }

  static validateWebsite(data) {
    this.isRequired(data.WebsiteCode, 'Website Code');
    this.isRequired(data.BaseURL, 'Base URL');
    this.isUrl(data.BaseURL);
    return true;
  }

  static validateUser(data) {
    this.isRequired(data.username, 'Username');
    this.isRequired(data.email, 'Email');
    this.isEmail(data.email);
    if (data.password) {
      this.minLength(data.password, 6, 'Password');
    }
    return true;
  }

  static validateEvent(data) {
    this.isRequired(data.EventCode, 'Event Code');
    this.isRequired(data.EventName, 'Event Name');
    return true;
  }
}

module.exports = Validator;
