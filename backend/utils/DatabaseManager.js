const mysql = require('mysql2/promise');
require('dotenv').config();

class DatabaseManager {
  constructor() {
    this.connection = null;
  }

  async connect(useDatabase = false) {
    const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    };

    if (useDatabase) {
      config.database = process.env.DB_NAME;
    }

    this.connection = await mysql.createConnection(config);
    return this.connection;
  }

  async query(sql, params = []) {
    if (!this.connection) {
      throw new Error('Database not connected');
    }
    return this.connection.query(sql, params);
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }

  async executeWithConnection(callback, useDatabase = false) {
    try {
      await this.connect(useDatabase);
      await callback(this);
      console.log('✅ Operation completed successfully!');
    } catch (error) {
      console.error('❌ Operation failed:', error.message);
      throw error;
    } finally {
      await this.close();
    }
  }
}

module.exports = DatabaseManager;
