import { Request, Response } from 'express';
import { promisePool } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Booking {
    id: number;
    user_id: number;
    menu_id: number;
    chef_id: number;
    date_time: Date;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: Date;
}

export const createBooking = async (req: Request, res: Response) => {
    const { user_id, menu_id, chef_id, date_time } = req.body;

    if (!user_id || !menu_id || !chef_id || !date_time) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const query = 'INSERT INTO bookings (user_id, menu_id, chef_id, date_time) VALUES (?, ?, ?, ?)';
        const [result] = await promisePool.query<ResultSetHeader>(query, [user_id, menu_id, chef_id, new Date(date_time)]);
        
        res.status(201).json({ 
            message: 'Booking created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking' });
    }
};

export const getBookingsByUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.query['user_id'] as string);
    const roleId = parseInt(req.query['role_id'] as string); // 1 = Chef, 2 = Diner

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        let query = `
            SELECT b.*, m.title as menu_title, u.name as other_party_name
            FROM bookings b
            JOIN menus m ON b.menu_id = m.id
        `;
        
        if (roleId === 1) { // Chef viewing their bookings
             query += ` JOIN users u ON b.user_id = u.id WHERE b.chef_id = ?`;
        } else { // Diner viewing their bookings
             query += ` JOIN users u ON b.chef_id = u.id WHERE b.user_id = ?`;
        }
        
        query += ' ORDER BY b.date_time DESC';

        const [rows] = await promisePool.query<RowDataPacket[]>(query, [userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};
