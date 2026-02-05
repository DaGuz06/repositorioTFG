import { promisePool } from './db';

const updateTableQuery = `
ALTER TABLE reservations 
ADD COLUMN contact_number VARCHAR(20) NOT NULL AFTER street,
ADD COLUMN chef_id INT NULL AFTER contact_number,
ADD CONSTRAINT fk_reservation_chef FOREIGN KEY (chef_id) REFERENCES users(id) ON DELETE SET NULL;
`;

const run = async () => {
    try {
        await promisePool.query(updateTableQuery);
        console.log('Table reservations updated successfully.');
        process.exit(0);
    } catch (err: any) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Columns already exist, skipping update.');
            process.exit(0);
        }
        console.error('Error updating table:', err);
        process.exit(1);
    }
};

run();
