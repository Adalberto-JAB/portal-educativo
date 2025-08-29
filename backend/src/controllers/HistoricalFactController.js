import asyncHandler from 'express-async-handler';
import HistoricalFactService from '../services/HistoricalFactService.js';

const HistoricalFactController = {
    getFactsForDateRange: asyncHandler(async (req, res) => {
        const { startMonth, startDay, numDays } = req.params;
        const facts = await HistoricalFactService.getHistoricalFactsForDateRange(parseInt(startMonth), parseInt(startDay), numDays ? parseInt(numDays) : undefined);
        res.json(facts);
    })
};

export default HistoricalFactController;