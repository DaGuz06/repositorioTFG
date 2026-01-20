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
exports.createProfile = exports.getChefById = exports.getChefs = void 0;
const db_1 = require("../db");
// Helper to map DB result to Chef interface
const mapChef = (row) => ({
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
const getChefs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
            SELECT u.id, u.name, u.email, cp.specialties, cp.work_zone, cp.has_vehicle, cp.bio, cp.rating 
            FROM users u
            LEFT JOIN chef_profiles cp ON u.id = cp.user_id
            WHERE u.role_id = 1
        `;
        const [rows] = yield db_1.promisePool.query(query);
        const chefs = rows.map(mapChef);
        res.json(chefs);
    }
    catch (error) {
        console.error('Error fetching chefs:', error);
        res.status(500).json({ message: 'Error fetching chefs' });
    }
});
exports.getChefs = getChefs;
const getChefById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params['id']);
    try {
        const query = `
            SELECT u.id, u.name, u.email, cp.specialties, cp.work_zone, cp.has_vehicle, cp.bio, cp.rating 
            FROM users u
            LEFT JOIN chef_profiles cp ON u.id = cp.user_id
            WHERE u.id = ? AND u.role_id = 1
        `;
        const [rows] = yield db_1.promisePool.query(query, [id]);
        if (rows.length > 0) {
            res.json(mapChef(rows[0]));
        }
        else {
            res.status(404).json({ message: 'Chef not found' });
        }
    }
    catch (error) {
        console.error('Error fetching chef:', error);
        res.status(500).json({ message: 'Error fetching chef' });
    }
});
exports.getChefById = getChefById;
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield db_1.promisePool.query(query, [user_id, specialties, work_zone, has_vehicle ? 1 : 0, bio]);
        res.json({ message: 'Profile updated successfully', success: true });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});
exports.createProfile = createProfile;
