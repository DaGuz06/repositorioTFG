import { pool } from './db';
import bcrypt from 'bcrypt';

const seed = async () => {
    try {
        console.log('Starting seeder...');

        const password = await bcrypt.hash('123456', 10);

        // Chef User
        const chefEmail = 'chef@test.com';
        const { rows: existingChef } = await pool.query('SELECT id FROM users WHERE email = $1', [chefEmail]);
        let chefId;

        if (existingChef.length === 0) {
            const { rows } = await pool.query(
                'INSERT INTO users (name, email, password, phone, role_id, active, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id',
                ['Jose Antonio Salado', chefEmail, password, '+34123456789', 1, 1]
            );
            chefId = rows[0].id;
            console.log(`Chef user created with ID: ${chefId}`);
        } else {
            chefId = existingChef[0].id;
            console.log(`Chef user already exists with ID: ${chefId}`);
        }

        // Diner User (Comensal)
        const dinerEmail = 'diner@test.com';
        const { rows: existingDiner } = await pool.query('SELECT id FROM users WHERE email = $1', [dinerEmail]);

        if (existingDiner.length === 0) {
            await pool.query(
                'INSERT INTO users (name, email, password, phone, role_id, active, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
                ['Pedro Perez', dinerEmail, password, '+34123456789', 2, 1]
            );
            console.log('Diner user created.');
        } else {
            console.log('Diner user already exists.');
        }

        // Seed Chef Profile
        if (chefId) {
            const { rows: existingProfile } = await pool.query('SELECT user_id FROM chef_profiles WHERE user_id = $1', [chefId]);

            if (existingProfile.length === 0) {
                await pool.query(
                    'INSERT INTO chef_profiles (user_id, specialties, work_zone, has_vehicle, bio, rating) VALUES ($1, $2, $3, $4, $5, $6)',
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
