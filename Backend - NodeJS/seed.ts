import { promisePool } from './db';
import bcrypt from 'bcrypt';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const seed = async () => {
    try {
        console.log('Starting seeder...');


        //Seed Users
        const password = await bcrypt.hash('123456', 10);

        // Chef User
        const chefEmail = 'chef@test.com';
        const [existingChef] = await promisePool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [chefEmail]);
        let chefId;

        if (existingChef.length === 0) {
            const [result] = await promisePool.query<ResultSetHeader>(
                'INSERT INTO users (name, email, password, phone, role_id, active, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                ['Jose Antonio Salado', chefEmail, password, '+34123456789', 1, 1]
            );
            chefId = result.insertId;
            console.log(`Chef user created with ID: ${chefId}`);
        } else {
            chefId = existingChef[0].id;
            console.log(`Chef user already exists with ID: ${chefId}`);
        }

        // Diner User (Comensal)
        const dinerEmail = 'diner@test.com';
        const [existingDiner] = await promisePool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [dinerEmail]);

        if (existingDiner.length === 0) {
           await promisePool.query(
                'INSERT INTO users (name, email, password, phone, role_id, active, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                ['Pedro Perez', dinerEmail, password, '+34123456789', 2, 1]
            );
            console.log('Diner user created.');
        } else {
            console.log('Diner user already exists.');
        }

        //Seed Chef Profile
        if (chefId) {
            const [existingProfile] = await promisePool.query<RowDataPacket[]>('SELECT user_id FROM chef_profiles WHERE user_id = ?', [chefId]);

            if (existingProfile.length === 0) {
                await promisePool.query(
                    'INSERT INTO chef_profiles (user_id, specialties, work_zone, has_vehicle, bio, rating) VALUES (?, ?, ?, ?, ?, ?)',
                    [chefId, 'Italiana', 'Palmete', 1, 'Pasta y poco mas', 4.8]
                );
                console.log('Chef profile created.');
            } else {
                console.log('Chef profile already exists.');
            }
        }

        console.log('Seeding completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
