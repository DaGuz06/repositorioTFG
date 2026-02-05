import { promisePool } from './db';

const run = async () => {
    try {
        const [rows] = await promisePool.query('DESCRIBE reservations');
        console.log('Reservations Table Structure:', rows);
        process.exit(0);
    } catch (err) {
        console.error('Error describing table:', err);
        process.exit(1);
    }
};

run();
