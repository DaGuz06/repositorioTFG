import { Request, Response } from 'express';
import { promisePool } from '../db';
import { RowDataPacket } from 'mysql2';

// Helper to map DB result to Chef interface
const mapChef = (row: any) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    specialties: row.specialties ? row.specialties.split(',') : [],
    work_zone: row.work_zone || '',
    has_vehicle: !!row.has_vehicle,
    bio: row.bio || '',
    rating: row.rating || 5.0,
    image: `https://placehold.co/400x300?text=${encodeURIComponent(row.name)}`
});

export const getChefs = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT u.id, u.name, u.email, cp.specialties, cp.work_zone, cp.has_vehicle, cp.bio, cp.rating 
            FROM users u
            LEFT JOIN chef_profiles cp ON u.id = cp.user_id
            WHERE u.role_id = 1
        `;
        const [rows] = await promisePool.query<RowDataPacket[]>(query);
        const chefs = rows.map(mapChef);
        res.json(chefs);
    } catch (error) {
        console.error('Error fetching chefs:', error);
        res.status(500).json({ message: 'Error fetching chefs' });
    }
};

export const getChefById = async (req: Request, res: Response) => {
    const id = parseInt(req.params['id']);
    try {
        const query = `
            SELECT u.id, u.name, u.email, cp.specialties, cp.work_zone, cp.has_vehicle, cp.bio, cp.rating 
            FROM users u
            LEFT JOIN chef_profiles cp ON u.id = cp.user_id
            WHERE u.id = ? AND u.role_id = 1
        `;
        const [rows] = await promisePool.query<RowDataPacket[]>(query, [id]);

        if (rows.length > 0) {
            res.json(mapChef(rows[0]));
        } else {
            res.status(404).json({ message: 'Chef not found' });
        }
    } catch (error) {
        console.error('Error fetching chef:', error);
        res.status(500).json({ message: 'Error fetching chef' });
    }
};

export const createProfile = async (req: Request, res: Response) => {
    const { user_id, specialties, work_zone, has_vehicle, bio } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const query = `
            INSERT INTO chef_profiles (user_id, specialties, work_zone, has_vehicle, bio)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            specialties = VALUES(specialties),
            work_zone = VALUES(work_zone),
            has_vehicle = VALUES(has_vehicle),
            bio = VALUES(bio)
        `;

        await promisePool.query(query, [user_id, specialties, work_zone, has_vehicle ? 1 : 0, bio]);
        res.json({ message: 'Profile updated successfully', success: true });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};
