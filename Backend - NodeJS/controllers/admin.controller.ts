import { Request, Response } from 'express';
import { promisePool } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const [rows] = await promisePool.query<RowDataPacket[]>(
            'SELECT id, name, email, role_id, active, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ success: true, users: rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get all chefs with profile info
export const getAllChefs = async (req: Request, res: Response) => {
    try {
        const [rows] = await promisePool.query<RowDataPacket[]>(`
            SELECT u.id as user_id, u.name, u.email, 
                   cp.specialties, cp.work_zone, cp.rating
            FROM users u
            INNER JOIN chef_profiles cp ON u.id = cp.user_id
            WHERE u.role_id = 1
            ORDER BY u.created_at DESC
        `);
        res.json({ success: true, chefs: rows });
    } catch (error) {
        console.error('Error fetching chefs:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get all reviews with user and chef names
export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const [rows] = await promisePool.query<RowDataPacket[]>(`
            SELECT r.id, r.chef_id, r.user_id, r.text, r.rating, r.created_at,
                   u1.name as chef_name, u2.name as user_name
            FROM reviews r
            LEFT JOIN users u1 ON r.chef_id = u1.id
            LEFT JOIN users u2 ON r.user_id = u2.id
            ORDER BY r.created_at DESC
        `);
        res.json({ success: true, reviews: rows });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update user status (active/inactive)
export const updateUserStatus = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { active } = req.body;

    if (active === undefined) {
        res.status(400).json({ success: false, message: 'Active status is required' });
        return;
    }

    try {
        await promisePool.query(
            'UPDATE users SET active = ? WHERE id = ?',
            [active, userId]
        );
        res.json({ success: true, message: 'User status updated successfully' });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        // Check if user is admin
        const [user] = await promisePool.query<RowDataPacket[]>(
            'SELECT role_id FROM users WHERE id = ?',
            [userId]
        );

        if (user.length > 0 && user[0].role_id === 3) {
            res.status(403).json({ success: false, message: 'Cannot delete admin users' });
            return;
        }

        await promisePool.query('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete review
export const deleteReview = async (req: Request, res: Response) => {
    const { reviewId } = req.params;

    try {
        await promisePool.query('DELETE FROM reviews WHERE id = ?', [reviewId]);
        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
