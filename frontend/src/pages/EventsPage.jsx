import React, { useState, useEffect } from 'react';
import conferenceService from '../services/conferenceService';
import Loader from '../components/Loader';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaClock, FaInfoCircle, FaUsers, FaChalkboardTeacher, FaDollarSign, FaPhone } from 'react-icons/fa';

// --- Componente Modal ---
const ConferenceModal = ({ conference, onClose }) => {
  if (!conference) return null;

  const baseUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api';
  const coverUrl = conference.cover ? `${baseUrl}/covers/${conference.cover._id}` : 'https://via.placeholder.com/400x200';

  const DetailItem = ({ icon, label, children }) => (
    <div className="flex items-start">
      <span className="mr-3 text-accent-primary mt-1 flex-shrink-0">{icon}</span>
      <div className="flex-1">
        <strong className="text-text-primary">{label}:</strong>
        <span className="ml-2 text-text-secondary">{children}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-bg-secondary rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <img src={coverUrl} alt={conference.title} className="w-full h-64 object-cover"/>
          <button onClick={onClose} className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75">&times;</button>
        </div>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-text-primary mb-6">{conference.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <DetailItem icon={<FaUser />} label="Organizador">{conference.organizer}</DetailItem>
            <DetailItem icon={<FaCalendarAlt />} label="Fecha">{new Date(conference.startDate).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</DetailItem>
            <DetailItem icon={<FaClock />} label="Duración">{conference.duration} minutos</DetailItem>
            <DetailItem icon={<FaInfoCircle />} label="Tipo">{conference.type}</DetailItem>
            {conference.type === 'Virtual' && <DetailItem icon={<FaMapMarkerAlt />} label="URL"><a href={conference.url} target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">{conference.url}</a></DetailItem>}
            <DetailItem icon={<FaUsers />} label="Audiencia">{conference.audience || 'General'}</DetailItem>
            <DetailItem icon={<FaChalkboardTeacher />} label="Ponentes">{conference.speakers?.join(', ') || 'N/A'}</DetailItem>
            <DetailItem icon={<FaDollarSign />} label="Costo">{conference.isFree ? 'Gratis' : `${conference.cost}`}</DetailItem>
            <DetailItem icon={<FaPhone />} label="Contacto">{conference.phoneNumber || 'N/A'}</DetailItem>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Componente Card ---
const ConferenceCard = ({ conference, onSelect }) => {
  const baseUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api';
  const coverUrl = conference.cover ? `${baseUrl}/covers/${conference.cover._id}` : 'https://via.placeholder.com/400x200';

  return (
    <div className="bg-bg-secondary rounded-lg shadow-lg overflow-hidden border border-border-color transform hover:-translate-y-1 transition-transform duration-300">
      <img src={coverUrl} alt={conference.title} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col">
        <h3 className="text-xl font-bold text-text-primary mb-2 flex-grow h-14">{conference.title}</h3>
        <div className="text-text-secondary space-y-2 mb-4">
          <p className="flex items-center"><FaCalendarAlt className="mr-2 text-accent-primary"/> {new Date(conference.startDate).toLocaleDateString('es-ES')}</p>
          <p className="flex items-center"><FaInfoCircle className="mr-2 text-accent-primary"/> {conference.type}</p>
        </div>
        <button onClick={() => onSelect(conference)} className="w-full bg-accent-primary text-white py-2 rounded-md hover:bg-blue-700 transition-colors mt-auto">
          Ver más
        </button>
      </div>
    </div>
  );
};

// --- Página Principal ---
const EventsPage = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConference, setSelectedConference] = useState(null);

  useEffect(() => {
    const fetchApprovedConferences = async () => {
      try {
        setLoading(true);
        const data = await conferenceService.getConferences();
        const approved = data.filter(conf => conf.isApproved);
        setConferences(approved);
      } catch (err) {
        setError('No se pudieron cargar los eventos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedConferences();
  }, []);

  if (loading) {
    return <div className="pt-20 flex justify-center items-center min-h-screen"><Loader /></div>;
  }

  if (error) {
    return <div className="pt-20 text-center text-red-500"><p>{error}</p></div>;
  }

  return (
    <div className="pt-20 p-8 min-h-screen bg-bg-primary text-text-primary">
      <h1 className="text-4xl font-bold mb-2 text-center">Congresos y Eventos</h1>
      <p className="text-lg text-text-secondary text-center mb-12">Descubre los próximos congresos, seminarios y talleres educativos.</p>
      
      {conferences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {conferences.map(conf => (
            <ConferenceCard key={conf._id} conference={conf} onSelect={setSelectedConference} />
          ))}
        </div>
      ) : (
        <p className="text-center text-text-secondary">No hay eventos disponibles en este momento.</p>
      )}

      {selectedConference && <ConferenceModal conference={selectedConference} onClose={() => setSelectedConference(null)} />}
    </div>
  );
};

export default EventsPage;
