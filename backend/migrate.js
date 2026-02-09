const bcrypt = require('bcrypt');
const DatabaseManager = require('./utils/DatabaseManager');

const TABLES = {
  Users: `
    CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      role ENUM('Admin', 'Editor') DEFAULT 'Editor',
      CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_username (username),
      INDEX idx_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  Websites: `
    CREATE TABLE IF NOT EXISTS Websites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      WebsiteCode VARCHAR(50) NOT NULL UNIQUE,
      BaseURL VARCHAR(255) NOT NULL,
      Status ENUM('Active', 'Inactive') DEFAULT 'Active',
      CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_code (WebsiteCode),
      INDEX idx_status (Status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  Events: `
    CREATE TABLE IF NOT EXISTS Events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      EventCode VARCHAR(50) NOT NULL UNIQUE,
      EventName VARCHAR(255) NOT NULL,
      EventDate DATE,
      Location VARCHAR(255),
      EventLink VARCHAR(500),
      Image VARCHAR(500),
      HoverImage VARCHAR(500),
      CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_code (EventCode),
      INDEX idx_date (EventDate)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  WebsiteEvents: `
    CREATE TABLE IF NOT EXISTS WebsiteEvents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      website_id INT NOT NULL,
      event_id INT NOT NULL,
      RelatedEventLink VARCHAR(500),
      Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
      CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (website_id) REFERENCES Websites(id) ON DELETE CASCADE,
      FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE,
      UNIQUE KEY unique_website_event (website_id, event_id),
      INDEX idx_status (Status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  EventChanges: `
    CREATE TABLE IF NOT EXISTS EventChanges (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      change_type ENUM('Date', 'Location', 'Name', 'Other') NOT NULL,
      old_value TEXT,
      new_value TEXT,
      Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
      CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE,
      INDEX idx_status (Status),
      INDEX idx_event (event_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  
  EventDateOverrides: `
    CREATE TABLE IF NOT EXISTS EventDateOverrides (
      id INT PRIMARY KEY AUTO_INCREMENT,
      website_code VARCHAR(50) NOT NULL,
      event_link VARCHAR(500) NOT NULL,
      event_id INT NOT NULL,
      custom_date VARCHAR(100) NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_override (website_code, event_id),
      INDEX idx_website (website_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `
};

async function runMigration() {
  const db = new DatabaseManager();

  await db.executeWithConnection(async (db) => {
    console.log('🔌 Connected to MySQL server\n');

    // Create database
    await db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`📦 Database: ${process.env.DB_NAME}`);
    
    await db.query(`USE ${process.env.DB_NAME}`);

    // Create tables
    console.log('\n📋 Creating tables...');
    for (const [tableName, schema] of Object.entries(TABLES)) {
      await db.query(schema);
      console.log(`  ✅ ${tableName}`);
    }

    // Create default admin user
    console.log('\n👤 Creating default admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.query(
      'INSERT IGNORE INTO Users (username, password, email, role) VALUES (?, ?, ?, ?)',
      ['admin', hashedPassword, 'admin@eventlink.com', 'Admin']
    );
    console.log('  ✅ Admin user created');

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Migration completed successfully!');
    console.log('='.repeat(50));
    console.log('\n📝 Default Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('');
  });
}

runMigration().catch(console.error);
