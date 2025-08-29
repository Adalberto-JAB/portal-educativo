import API from './axiosConfig';

const historyAndHolidaysService = {
    getHistoricalFactsForWeek: async (startMonth, startDay) => {
        try {
            const response = await API.get(`/history/week/${startMonth}/${startDay}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching historical facts for week starting ${startMonth}/${startDay}:`, error);
            throw error;
        }
    },

    getHolidays: async (year) => {
        try {
            const response = await API.get(`/holidays/${year}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching holidays for year ${year}:`, error);
            throw error;
        }
    }
};

export default historyAndHolidaysService;
