import { promisePool } from './db';

const tables = ['users', 'chef_profiles', 'menus', 'reviews', 'reservations'];

const run = async () => {
    try {
        for (const table of tables) {
            try {
                const [rows] = await promisePool.query(`SHOW CREATE TABLE ${table}`);
                console.log(`\n--- ${table} ---`);
                console.log((rows as any)[0]['Create Table']);
            } catch (ignore) {
                console.log(`\n--- ${table} (Not Found) ---`);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

run();
