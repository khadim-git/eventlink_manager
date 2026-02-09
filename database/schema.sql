-- EventLink Manager Database Schema

CREATE DATABASE IF NOT EXISTS eventlink_manager;
USE eventlink_manager;

-- Users Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('Admin', 'Editor') DEFAULT 'Editor',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Websites Table
CREATE TABLE Websites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    WebsiteCode VARCHAR(50) NOT NULL UNIQUE,
    BaseURL VARCHAR(255) NOT NULL,
    Status ENUM('Active', 'Inactive') DEFAULT 'Active',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE Events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    EventCode VARCHAR(50) NOT NULL UNIQUE,
    EventName VARCHAR(255) NOT NULL,
    EventDate DATE,
    Location VARCHAR(255),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Website-Event Linking Table
CREATE TABLE WebsiteEvents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    website_id INT NOT NULL,
    event_id INT NOT NULL,
    Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (website_id) REFERENCES Websites(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_website_event (website_id, event_id)
);

-- Event Change Log (for tracking changes requiring approval)
CREATE TABLE EventChanges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    change_type ENUM('Date', 'Location', 'Name', 'Other') NOT NULL,
    old_value TEXT,
    new_value TEXT,
    Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO Users (username, password, email, role) 
VALUES ('admin', '$2b$10$rKvVJKhPZqKXbF8xVqF8Ue5YJ5YqF5YqF5YqF5YqF5YqF5YqF5Yq.', 'admin@eventlink.com', 'Admin');
