import express from 'express';
import * as roomController from '../controllers/roomController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.array('images', 5), roomController.createRoom);
router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoom);

export default router;
