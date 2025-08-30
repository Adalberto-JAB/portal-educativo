import { useEffect, useMemo, useState } from 'react';
import documentationService from '../services/documentationService';
import subjectService from '../services/subjectService';
import Loader from '../components/Loader';
import CustomButton from '../components/CustomButton';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DocumentationPage = () => {
  const navigate = useNavigate();
  const [allDocuments, setAllDocuments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, hasRole } = useAuth();

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fileTypes = [
    { value: 'Imagen', label: 'Imagen' },
    { value: 'Video', label: 'Video' },
    { value: 'PDF', label: 'PDF' },
  ];

  const baseUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const docsData = await documentationService.getAll();
        const subjectsData = await subjectService.getSubjects();
        setAllDocuments(Array.isArray(docsData) ? docsData : []);
        
        // Sort subjects alphabetically before setting them
        const sortedSubjects = Array.isArray(subjectsData)
          ? [...subjectsData].sort((a, b) => a.name.localeCompare(b.name))
          : [];
        setSubjects(sortedSubjects);
        setError(null);
      } catch (err) {
        setError('No se pudieron cargar los datos iniciales (documentos o materias). Por favor, inténtalo de nuevo más tarde.');
        toast.error('Error al cargar los datos.');
        console.log('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const filteredAndSortedDocuments = useMemo(() => {
    let currentDocuments = allDocuments;

    if (hasRole(['admin'])) {
      // Admin ve todos los documentos
    } else if (hasRole(['teacher', 'student'])) {
      currentDocuments = currentDocuments.filter(doc =>
        (doc.uploadedBy && doc.uploadedBy._id === user.id) || doc.isPublished
      );
    } else {
      currentDocuments = currentDocuments.filter(doc => doc.isPublished);
    }

    if (selectedSubject) {
      currentDocuments = currentDocuments.filter(doc =>
        doc.subject && doc.subject._id === selectedSubject
      );
    }

    if (selectedFileType) {
      currentDocuments = currentDocuments.filter(doc =>
        doc.fileType === selectedFileType
      );
    }

    if (searchTerm) {
      currentDocuments = currentDocuments.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return [...currentDocuments].sort((a, b) => {
      const titleA = a.title || '';
      const titleB = b.title || '';
      return titleA.localeCompare(titleB);
    });
  }, [allDocuments, selectedSubject, selectedFileType, searchTerm, user, hasRole]);

  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando documentación...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 md:mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-20 md:mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
    <div className="max-w-[1024px] m-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Documentación</h1>
      <div className="flex justify-end-safe items-center mb-8">
        {isAuthenticated && hasRole(['admin', 'teacher', 'student']) && (
          <CustomButton variant="primary" onClick={() => navigate('/documentation/create')}>
            Subir Nuevo Documento
          </CustomButton>
        )}
      </div>
      <p className="text-lg mb-8">
        Explora nuestra biblioteca de documentos, guías y recursos.
      </p>

      {/* Filtros y Búsqueda */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-4 py-2 border rounded-md bg-input-bg text-text-primary border-input-border focus:outline-none focus:ring-2 focus:ring-accent-primary w-full sm:w-auto"
        >
          <option value="">Todas las Materias</option>
          {Array.isArray(subjects) && subjects.map(subject => (
            <option key={subject._id} value={subject._id}>{subject.name}</option>
          ))}
        </select>
        <select
          value={selectedFileType}
          onChange={(e) => setSelectedFileType(e.target.value)}
          className="px-4 py-2 border rounded-md bg-input-bg text-text-primary border-input-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
        >
          <option value="">Todos los Tipos</option>
          {fileTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Buscar documento por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md bg-input-bg text-text-primary border-input-border focus:outline-none focus:ring-2 focus:ring-accent-primary w-full sm:w-auto flex-grow"
        />
      </div>

      {filteredAndSortedDocuments.length === 0 ? (
        <div className="text-center text-text-secondary">
          <p>No hay documentos disponibles que coincidan con tus criterios.</p>
          {!isAuthenticated && (
            <p className="mt-2">Inicia sesión o regístrate para ver más documentos.</p>
          )}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDocuments.map((doc) => (
            <div key={doc._id} className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-color flex flex-col">
              <h2 className="text-xl font-semibold text-text-primary mb-2">{doc.title}</h2>
              {doc.cover && ( // Only render if doc.cover exists
                <div className="mb-4 flex justify-center">
                  <img
                    src={`${baseUrl}/api/covers/${doc.cover?._id}`}
                    alt={`Portada de ${doc.title}`}
                    className="max-h-40 w-auto rounded-lg shadow-md object-contain"
                  />
                </div>
              )}
              <p className="text-text-secondary mb-4 flex-grow">{doc.description}</p>
              <div className="flex justify-between items-center text-sm text-text-secondary mb-4">
                <span>Autor: {doc.uploadedBy ? `${doc.uploadedBy.name} ${doc.uploadedBy.last_name}` : 'Desconocido'}</span>
                <span>Tipo: {doc.fileType || 'N/A'}</span>
              </div>
              <CustomButton 
                variant="primary" 
                className="w-full mt-auto" 
                onClick={() => navigate(`/documentation/${doc._id}`)}>
                  Ver Documento
              </CustomButton>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default DocumentationPage;