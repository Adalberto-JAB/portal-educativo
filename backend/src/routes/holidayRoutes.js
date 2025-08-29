import express from 'express';
import HolidayController from '../controllers/HolidayController.js';

const router = express.Router();

router.get('/:year', HolidayController.getHolidaysForYear);

export default router;
