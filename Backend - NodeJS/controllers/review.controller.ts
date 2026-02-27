import { Request, Response } from 'express';
import { pool } from '../db';

export const getReviews = async (req: Request, res: Response) => {
    const queryChefId = req.query['chefId'];

    try {
        let query = 'SELECT r.*, u.name as user_name, u.profile_picture FROM reviews r JOIN users u ON r.user_id = u.id';
        const params: any[] = [];

        if (queryChefId) {
            query += ' WHERE r.chef_id = $1';
            params.push(parseInt(queryChefId as string));
        }

        query += ' ORDER BY r.created_at DESC';

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};

export const addReview = async (req: Request, res: Response) => {
    const { chefId, userId, text, rating } = req.body;

    if (!chefId || !userId || !rating) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    if (Number(chefId) === Number(userId)) {
        res.status(400).json({ message: 'Un chef no puede dejarse una reseña a sí mismo' });
        return;
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Insert the new review
        const { rows } = await client.query(
            'INSERT INTO reviews (chef_id, user_id, text, rating) VALUES ($1, $2, $3, $4) RETURNING id',
            [chefId, userId, text, rating]
        );

        // 2. Calculate the new average rating for the chef
        const { rows: avgRows } = await client.query(
            'SELECT AVG(rating) as "avgRating" FROM reviews WHERE chef_id = $1',
            [chefId]
        );

        const newAvgRating = avgRows[0]?.avgRating || rating;

        // 3. Update the chef's profile with the new average rating
        await client.query(
            'UPDATE chef_profiles SET rating = $1 WHERE user_id = $2',
            [newAvgRating, chefId]
        );

        await client.query('COMMIT');

        const newReview = {
            id: rows[0].id,
            chefId,
            userId,
            text,
            rating,
            created_at: new Date()
        };

        res.status(201).json(newReview);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review' });
    } finally {
        client.release();
    }
};
