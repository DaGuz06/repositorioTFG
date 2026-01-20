import { promisePool } from './db';

const createTableQuery = `
CREATE TABLE IF NOT EXISTS chef_profiles (
  user_id INT PRIMARY KEY,
  specialties TEXT,
  work_zone VARCHAR(255),
  has_vehicle TINYINT DEFAULT 0,
  bio TEXT,
  rating DECIMAL(3,1) DEFAULT 5.0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

const run = async () => {
    try {
        await promisePool.query(createTableQuery);
        console.log('Table chef_profiles created successfully or already exists.');
        process.exit(0);
    } catch (err) {
        console.error('Error creating table:', err);
        process.exit(1);
    }
};

run();
