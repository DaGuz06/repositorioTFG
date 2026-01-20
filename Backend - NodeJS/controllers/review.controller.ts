import { Request, Response } from 'express';
import { promisePool } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getReviews = async (req: Request, res: Response) => {
    const queryChefId = req.query['chefId'];

    try {
        let query = 'SELECT * FROM reviews';
        const params: any[] = [];

        if (queryChefId) {
            query += ' WHERE chef_id = ?';
            params.push(parseInt(queryChefId as string));
        }

        // Add ordering
        query += ' ORDER BY created_at DESC';

        const [rows] = await promisePool.query<RowDataPacket[]>(query, params);
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

    try {
        const [result] = await promisePool.query<ResultSetHeader>(
            'INSERT INTO reviews (chef_id, user_id, text, rating) VALUES (?, ?, ?, ?)',
            [chefId, userId, text, rating]
        );

        const newReview = {
            id: result.insertId,
            chefId,
            userId,
            text,
            rating,
            created_at: new Date()
        };

        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review' });
    }
};
