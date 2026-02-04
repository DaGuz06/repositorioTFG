import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import chefRoutes from './routes/chef.routes';
import reviewRoutes from './routes/review.routes';
import menuRoutes from './routes/menu.routes';
import { initDB } from './db';

const app = express();
const PORT = process.env['PORT'] || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chefs', chefRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/menus', menuRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('ChefPro Backend is running');
});

// Initialize DB tables
initDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
