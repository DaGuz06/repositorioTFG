-- PostgreSQL Schema for ChefPro
-- Run: psql -U postgres -d chef_pro -f chef_pro_final.sql

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

INSERT INTO roles (id, name) VALUES
(1, 'Chef'),
(2, 'Comensal'),
(3, 'Admin')
ON CONFLICT (id) DO NOTHING;

-- Sync sequence after explicit id inserts
SELECT setval('roles_id_seq', (SELECT COALESCE(MAX(id), 0) FROM roles));

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  profile_picture TEXT DEFAULT NULL,
  role_id INTEGER NOT NULL,
  active SMALLINT DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chef_profiles (
  user_id BIGINT NOT NULL PRIMARY KEY,
  specialties TEXT DEFAULT NULL,
  work_zone VARCHAR(255) DEFAULT NULL,
  has_vehicle SMALLINT DEFAULT 0,
  bio TEXT DEFAULT NULL,
  rating DECIMAL(3,1) DEFAULT 5.0,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS menus (
  id BIGSERIAL PRIMARY KEY,
  chef_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chef_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  chef_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  text TEXT DEFAULT NULL,
  rating INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chef_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reservations (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  chef_id BIGINT DEFAULT NULL,
  date TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chef_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Test Data (Password: 123456)
INSERT INTO users (id, name, email, password, role_id, active) VALUES
(1, 'Pedro', 'chef@test.com', '$2b$10$.FnPjXUYLoljPcOmngwmwuzA9Kv3ZkDfoPzT.BsY5e1DVBKSaGyBm', 1, 1),
(2, 'Pepe', 'cliente@test.com', '$2b$10$.FnPjXUYLoljPcOmngwmwuzA9Kv3ZkDfoPzT.BsY5e1DVBKSaGyBm', 2, 1),
(3, 'David', 'admin@test.com', '$2b$10$.FnPjXUYLoljPcOmngwmwuzA9Kv3ZkDfoPzT.BsY5e1DVBKSaGyBm', 3, 1)
ON CONFLICT (id) DO NOTHING;

-- Sync sequence after explicit id inserts
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 0) FROM users));

-- Chef Profile for Pedro
INSERT INTO chef_profiles (user_id, specialties, work_zone, has_vehicle, bio, rating) VALUES
(1, 'Española, Japonesa', 'Sevilla', 1, 'Apasionado de la cocina, Autodidacta', 3)
ON CONFLICT (user_id) DO NOTHING;
