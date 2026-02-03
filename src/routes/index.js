import express from 'express';
import roomRoutes from './roomRoutes.js';
import reportRoutes from './reportRoutes.js';

const router = express.Router();

router.get('/health', (req, res) => res.send('OK'));
router.use('/rooms', roomRoutes);
router.use('/reports', reportRoutes);

export default router;
