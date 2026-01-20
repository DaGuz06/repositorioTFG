"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReview = exports.getReviews = void 0;
const db_1 = require("../db");
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryChefId = req.query['chefId'];
    try {
        let query = 'SELECT * FROM reviews';
        const params = [];
        if (queryChefId) {
            query += ' WHERE chef_id = ?';
            params.push(parseInt(queryChefId));
        }
        // Add ordering
        query += ' ORDER BY created_at DESC';
        const [rows] = yield db_1.promisePool.query(query, params);
        res.json(rows);
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});
exports.getReviews = getReviews;
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chefId, userId, text, rating } = req.body;
    if (!chefId || !userId || !rating) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }
    try {
        const [result] = yield db_1.promisePool.query('INSERT INTO reviews (chef_id, user_id, text, rating) VALUES (?, ?, ?, ?)', [chefId, userId, text, rating]);
        const newReview = {
            id: result.insertId,
            chefId,
            userId,
            text,
            rating,
            created_at: new Date()
        };
        res.status(201).json(newReview);
    }
    catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review' });
    }
});
exports.addReview = addReview;
