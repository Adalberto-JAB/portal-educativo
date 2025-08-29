import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import Loader from '../../components/Loader';
import { FaEye, FaEyeSlash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

// Componente para los botones de acción simplificado para administradores
const ActionButtons = ({ course, onPublish, onGuestViewable }) => {
  return (
    <div className="flex items-center justify-end space-x-3">
      {/* Botón de Publicar/Despublicar */}
      <button
        onClick={() => onPublish(course._id, course)}
        className={`text-2xl ${course.isPublished ? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
        title={course.isPublished ? 'Despublicar Curso' : 'Publicar Curso'}
      >
        {course.isPublished ? <FaToggleOn /> : <FaToggleOff />}
      </button>

      {/* Botón de Visibilidad para Invitados */}
      <button
        onClick={() => onGuestViewable(course._id, course.isGuestViewable)}
        className={`text-2xl ${course.isGuestViewable ? 'text-blue-500 hover:text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
        title={course.isGuestViewable ? 'Ocultar para Invitados' : 'Hacer Visible para Invitados'}
      >
        {course.isGuestViewable ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  );
};

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasRole } = useAuth();

  const isAdmin = hasRole(['admin']);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      // Los administradores ven todos los cursos
      const data = await courseService.getCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('No se pudieron cargar los cursos.');
      toast.error('Error al cargar los cursos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // La ruta ya está protegida para admins, pero mantenemos la verificación por seguridad
    if (isAdmin) {
      fetchCourses();
    }
  }, [isAdmin, fetchCourses]);

  const handleGuestViewableToggle = async (id, currentStatus) => {
    try {
      await courseService.updateCourse(id, { isGuestViewable: !currentStatus });
      toast.success(`Visibilidad para invitados actualizada.`);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al cambiar la visibilidad.');
    }
  };

  const handlePublishToggle = async (id, course) => {
    const { isPublished } = course;
    const newPublishStatus = !isPublished;
    
    let payload = { isPublished: newPublishStatus };

    // Si se despublica, también se oculta para invitados
    if (!newPublishStatus) {
      payload.isGuestViewable = false;
    }

    try {
      await courseService.updateCourse(id, payload);
      toast.success(`Curso ${newPublishStatus ? 'publicado' : 'despublicado'}.`);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al cambiar el estado de publicación.');
    }
  };

  if (loading && !courses.length) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader />
        <p className="mt-4">Cargando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="pt-20 p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Acceso Denegado</h1>
        <p className="text-lg">No tienes permiso para ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-screen bg-bg-primary text-text-primary">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Publicación de Cursos</h1>
      </div>

      {courses.length === 0 ? (
        <div className="text-center text-text-secondary py-10">
          <p>No hay cursos disponibles para gestionar.</p>
        </div>
      ) : (
        <div className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-color">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-color">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Autor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Publicado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Visible p/ Invitados</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-bg-secondary divide-y divide-border-color">
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-text-primary font-medium">{course.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{course.author ? `${course.author.name} ${course.author.last_name}` : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {course.isPublished ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.isGuestViewable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {course.isGuestViewable ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ActionButtons 
                        course={course} 
                        onPublish={handlePublishToggle} 
                        onGuestViewable={handleGuestViewableToggle} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagementPage;
