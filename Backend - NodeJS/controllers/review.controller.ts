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
        res.status(400).json({ message: 'Faltan campos obligatorios.' });
        return;
    }

    if (Number(chefId) === Number(userId)) {
        res.status(400).json({ message: 'Un chef no puede dejarse una reseña a sí mismo.' });
        return;
    }

    try {
        // 1. Check if user already reviewed this chef
        const { rows: existingReview } = await pool.query(
            'SELECT id FROM reviews WHERE chef_id = $1 AND user_id = $2 LIMIT 1',
            [chefId, userId]
        );

        if (existingReview.length > 0) {
            res.status(409).json({ message: 'Ya has dejado una reseña para este chef.' });
            return;
        }

        // 2. Enforce the completed reservation requirement
        const { rows: resRows } = await pool.query(
            "SELECT id FROM reservations WHERE chef_id = $1 AND user_id = $2 AND status = 'completed' LIMIT 1",
            [chefId, userId]
        );

        if (resRows.length === 0) {
            res.status(403).json({ message: 'Debes tener al menos una reserva completada con este chef para dejar una reseña.' });
            return;
        }
    } catch (error) {
        console.error('Error validating review permission:', error);
        res.status(500).json({ message: 'Error en la validación de reseña.' });
        return;
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 3. Insert the new review
        const { rows } = await client.query(
            'INSERT INTO reviews (chef_id, user_id, text, rating) VALUES ($1, $2, $3, $4) RETURNING id',
            [chefId, userId, text, rating]
        );

        // 4. Calculate the new average rating for the chef
        const { rows: avgRows } = await client.query(
            'SELECT ROUND(AVG(rating)::numeric, 1) as "avgRating", COUNT(*)::int as "totalReviews" FROM reviews WHERE chef_id = $1',
            [chefId]
        );

        const newAvgRating = avgRows[0]?.avgRating || rating;
        const totalReviews = avgRows[0]?.totalReviews || 1;

        // 5. Update the chef's profile with the new average rating
        await client.query(
            'UPDATE chef_profiles SET rating = $1 WHERE user_id = $2',
            [newAvgRating, chefId]
        );

        await client.query('COMMIT');

        res.status(201).json({
            id: rows[0].id,
            chef_id: chefId,
            user_id: userId,
            text,
            rating,
            avgRating: parseFloat(newAvgRating),
            totalReviews,
            created_at: new Date()
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error al añadir la reseña.' });
    } finally {
        client.release();
    }
};
