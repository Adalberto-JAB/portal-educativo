import express from 'express';
import HistoricalFactController from '../controllers/HistoricalFactController.js';

const router = express.Router();

router.get('/week/:startMonth/:startDay/:numDays?', HistoricalFactController.getFactsForDateRange);

export default router;