-- Create Database
CREATE DATABASE IF NOT EXISTS chef_pro;
USE chef_pro;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role_id INT NOT NULL,  -- 1: Chef, 2: Diner (Comensal)
  active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chef Profiles Table
CREATE TABLE IF NOT EXISTS chef_profiles (
  user_id BIGINT PRIMARY KEY,
  specialties TEXT,
  work_zone VARCHAR(255),
  has_vehicle TINYINT DEFAULT 0,
  bio TEXT,
  rating DECIMAL(3,1) DEFAULT 5.0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Optional: Roles Table (for clarity, though app uses IDs directly)
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  chef_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  text TEXT,
  rating INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chef_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT IGNORE INTO roles (id, name) VALUES (1, 'Chef'), (2, 'Comensal');

-- Sample Data (Optional) can be added here if requested, but this serves the "login" requirement.
