import axios from 'axios';

const HolidayService = {
    getHolidays: async (year) => {
        try {
            const response = await axios.get(`https://api.argentinadatos.com/v1/feriados/${year}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching holidays for year ${year}:`, error);
            throw new Error('No se pudieron cargar los feriados.');
        }
    }
};

export default HolidayService;
