const axios = require('axios');
const https = require('https');

class HttpClient {
  constructor() {
    this.timeout = 10000;
    this.httpsAgent = new https.Agent({ rejectUnauthorized: false });
  }

  async get(url, options = {}) {
    return axios.get(url, {
      timeout: this.timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        ...options.headers
      },
      validateStatus: () => true,
      httpsAgent: this.httpsAgent,
      ...options
    });
  }

  async post(url, data, options = {}) {
    return axios.post(url, data, {
      timeout: this.timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        ...options.headers
      },
      httpsAgent: this.httpsAgent,
      ...options
    });
  }

  isValidResponse(response) {
    return response && response.data && response.status < 400;
  }
}

module.exports = new HttpClient();
