import { promisePool } from './db';

const createTableQuery = `
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  chef_id INT NULL,
  date DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const run = async () => {
    try {
        await promisePool.query(createTableQuery);
        console.log('Table reservations created successfully or already exists.');
        process.exit(0);
    } catch (err) {
        console.error('Error creating table:', err);
        process.exit(1);
    }
};

run();
