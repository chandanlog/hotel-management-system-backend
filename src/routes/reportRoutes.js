import express from 'express';
import * as reportController from '../controllers/reportController.js';

const router = express.Router();

router.get('/', reportController.getIncentiveReport);

export default router;
