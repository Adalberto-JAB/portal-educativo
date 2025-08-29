import React, { useEffect, useState, useMemo } from 'react';
import courseService from '../services/courseService';
import subjectService from '../services/subjectService';
import Loader from '../components/Loader';
import CustomButton from '../components/CustomButton';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Componente CourseCard con validación de ID ---
const CourseCard = ({ course, onNavigate }) => {
  const baseUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api';
  const coverUrl = course.cover ? `${baseUrl}/covers/${course.cover._id}` : 'https://via.placeholder.com/400x200';

  return (
    <div className="bg-bg-secondary p-4 rounded-lg shadow-md border border-border-color flex flex-col h-full">
      <img
        src={coverUrl}
        alt={`Portada de ${course.title}`}
        className="w-full h-48 sm:h-52 md:h-60 object-cover rounded-md mb-4 bg-bg-tertiary"
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = 'https://placehold.co/400x200/cccccc/333333?text=Error'; 
        }}
      />
      <div className="flex flex-col flex-grow">
        <h2 className="text-lg sm:text-xl text-center font-semibold text-text-primary mb-4">{course.title}</h2>
        <p className="text-text-secondary mb-6 flex-grow">{course.description}</p>
        <div className="flex flex-col text-sm text-text-secondary mb-6 px-4 sm:px-6">
          <span>Autor: {course.author ? `${course.author.name} ${course.author.last_name}` : 'Desconocido'}</span>
          <span>Materia: {course.subject ? course.subject.name : 'Desconocida'}</span>
        </div>
        <CustomButton 
          type="primary" 
          className="w-full mt-auto" 
          onClick={() => onNavigate(course._id)}>
            Ver Curso
        </CustomButton>
      </div>
    </div>
  );
};

// --- Componente CoursesPage ---
const CoursesPage = () => {
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, hasRole } = useAuth();

  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [coursesData, subjectsData] = await Promise.all([
          courseService.getCourses(),
          subjectService.getSubjects()
        ]);
        
        setAllCourses(coursesData);
        setSubjects(subjectsData);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.');
        toast.error('Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const filteredAndSortedCourses = useMemo(() => {
    let currentCourses = allCourses;

    if (!isAuthenticated || user.role === 'guest') {
      currentCourses = currentCourses.filter(course => course.isGuestViewable && course.isPublished);
    } else if (hasRole(['student'])) {
      currentCourses = currentCourses.filter(course => course.isPublished);
    }

    if (selectedSubject) {
      currentCourses = currentCourses.filter(course => course.subject?._id === selectedSubject);
    }

    if (searchTerm) {
      currentCourses = currentCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return [...currentCourses].sort((a, b) => {
      const subjectNameA = a.subject?.name || '';
      const subjectNameB = b.subject?.name || '';
      if (subjectNameA < subjectNameB) return -1;
      if (subjectNameA > subjectNameB) return 1;
      return a.title.localeCompare(b.title);
    });

  }, [allCourses, selectedSubject, searchTerm, isAuthenticated, user, hasRole]);

  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader />
        <p className="mt-4">Cargando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 p-4 sm:p-6 md:p-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-base sm:text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-4 sm:p-6 md:p-8 min-h-screen bg-bg-primary text-text-primary">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-5">Nuestros Cursos</h1>
      <div className="flex justify-end items-center mb-5">
        {isAuthenticated && hasRole(['admin', 'teacher']) && (
          <CustomButton variant="primary" onClick={() => navigate('/admin/courses/create')}>
            Crear Curso
          </CustomButton>
        )}
      </div>
      <p className="text-base sm:text-lg text-center mb-8">
        Aquí encontrarás nuestros cursos disponibles. ¡Explora y aprende!
      </p>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-4 py-2 border rounded-md bg-input-bg text-text-primary border-input-border focus:outline-none focus:ring-2 focus:ring-accent-primary w-full sm:w-auto"
        >
          <option value="">Todas las Materias</option>
          {subjects.map(subject => (
            <option key={subject._id} value={subject._id}>{subject.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Buscar curso por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md bg-input-bg text-text-primary border-input-border focus:outline-none focus:ring-2 focus:ring-accent-primary w-full sm:w-auto flex-grow"
        />
      </div>

      {filteredAndSortedCourses.length === 0 ? (
        <div className="text-center text-text-secondary py-10">
          <p>No hay cursos que coincidan con tus criterios.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedCourses.map((course) => (
            <CourseCard key={course._id} course={course} onNavigate={(id) => navigate(`/courses/${id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
