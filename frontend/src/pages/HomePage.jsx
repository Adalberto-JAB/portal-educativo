import React, { useState, useEffect, useCallback } from 'react';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import historyAndHolidaysService from '../services/historyAndHolidaysService';

const HomePage = () => {
  const navigate = useNavigate();

  const [holidays, setHolidays] = useState([]);
  const [historicalFacts, setHistoricalFacts] = useState([]);
  const [loadingHolidays, setLoadingHolidays] = useState(true);
  const [loadingFacts, setLoadingFacts] = useState(true);
  const [errorHolidays, setErrorHolidays] = useState(null);
  const [errorFacts, setErrorFacts] = useState(null);
  const [dateRange, setDateRange] = useState('');

  const fetchHomePageData = useCallback(async () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // Months are 0-indexed
    const currentDay = today.getDate();
    const currentYear = today.getFullYear();

    // Calculate date range for historical facts
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 6); // Add 6 days for a full week
    setDateRange(`del ${today.getDate()} de ${today.toLocaleString('es-ES', { month: 'long' })} al ${endDate.getDate()} de ${endDate.toLocaleString('es-ES', { month: 'long' })}`);

    // Fetch Holidays
    setLoadingHolidays(true);
    try {
      const fetchedHolidays = await historyAndHolidaysService.getHolidays(currentYear);
      // Filter holidays for the current month
      const currentMonthHolidays = fetchedHolidays.filter(holiday => {
        const holidayDate = new Date(holiday.fecha);
        return holidayDate.getMonth() + 1 === currentMonth;
      });
      setHolidays(currentMonthHolidays);
      setErrorHolidays(null);
    } catch (err) {
      console.error('Error fetching holidays:', err);
      setErrorHolidays('No se pudieron cargar los feriados.');
      toast.error('Error al cargar los feriados.');
    } finally {
      setLoadingHolidays(false);
    }

    // Fetch Historical Facts for the week
    setLoadingFacts(true);
    try {
      const fetchedFacts = await historyAndHolidaysService.getHistoricalFactsForWeek(currentMonth, currentDay);
      setHistoricalFacts(fetchedFacts);
      setErrorFacts(null);
    } catch (err) {
      console.error('Error fetching historical facts:', err);
      setErrorFacts('No se pudieron cargar los hechos históricos.');
      toast.error('Error al cargar los hechos históricos.');
    } finally {
      setLoadingFacts(false);
    }
  }, []);

  useEffect(() => {
    fetchHomePageData();
  }, [fetchHomePageData]);

  return (
    <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 bg-bg-primary text-text-primary">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-center">
        ¡Bienvenido al Portal Educativo!
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-center mb-8">
        Tu plataforma integral para el aprendizaje y desarrollo.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <CustomButton type="primary" onClick={() => navigate('/courses')}>
          Explorar Cursos
        </CustomButton>
        <CustomButton type="secondary" onClick={() => navigate('/register')}>
          Registrarse
        </CustomButton>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        {/* Feriados del Mes */}
        <div className="bg-bg-secondary p-4 md:p-6 rounded-lg shadow-md border border-border-color">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Feriados del Mes</h2>
          {loadingHolidays ? (
            <Loader />
          ) : errorHolidays ? (
            <p className="text-red-500">Error: {errorHolidays}</p>
          ) : holidays.length === 0 ? (
            <p>No hay feriados este mes.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="p-3 md:p-4">Fecha</th>
                    <th className="p-3 md:p-4">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.map((holiday, index) => (
                    <tr key={index} className="border-b border-border-color">
                      <td className="p-3 md:p-4 align-top font-medium whitespace-nowrap">{new Date(holiday.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</td>
                      <td className="p-3 md:p-4">{holiday.nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Hechos Históricos de la Semana */}
        <div className="bg-bg-secondary p-4 md:p-6 rounded-lg shadow-md border border-border-color">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Hechos Históricos de la Semana {dateRange}</h2>
          {loadingFacts ? (
            <Loader />
          ) : errorFacts ? (
            <p className="text-red-500">Error: {errorFacts}</p>
          ) : historicalFacts.length === 0 ? (
            <p>No hay hechos históricos registrados para esta semana.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="p-3 md:p-4">Fecha</th>
                    <th className="p-3 md:p-4">Acontecimientos</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalFacts.map((dayFacts, index) => (
                    <tr key={index} className="border-b border-border-color">
                      <td className="p-3 md:p-4 align-top font-semibold whitespace-nowrap">{dayFacts.date}</td>
                      <td className="p-3 md:p-4">
                        <ul className="list-disc pl-5 space-y-1">
                          {dayFacts.facts.map((fact, factIndex) => (
                            <li key={factIndex}>{fact}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
