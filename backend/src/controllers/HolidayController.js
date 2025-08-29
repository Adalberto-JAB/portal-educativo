import asyncHandler from 'express-async-handler';
import HolidayService from '../services/HolidayService.js';

const HolidayController = {
    getHolidaysForYear: asyncHandler(async (req, res) => {
        const { year } = req.params;
        const holidays = await HolidayService.getHolidays(year);
        res.json(holidays);
    })
};

export default HolidayController;
