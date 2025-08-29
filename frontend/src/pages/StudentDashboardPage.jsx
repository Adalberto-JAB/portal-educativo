import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import CustomButton from '../components/CustomButton';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Importar servicios necesarios
import courseService from '../services/courseService';
import documentationService from '../services/documentationService';
import forumService from '../services/forumService';
import conferenceService from '../services/conferenceService';
import enrollmentService from '../services/enrollmentService';
import commentService from '../services/commentService';

const StudentDashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authLoading || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const allCourses = await courseService.getCourses();
        const allDocs = await documentationService.getAll();
        const allForumPosts = await forumService.getForumPosts();
        const allConferences = await conferenceService.getConferences();
        const allComments = await commentService.getComments();

        const myEnrollments = await enrollmentService.getEnrollments(user.id);
        const enrolledCourseIds = myEnrollments.map(e => e.course._id);
        const enrolledCourses = allCourses.filter(c => enrolledCourseIds.includes(c._id));
        const coursesWithProgress = enrolledCourses.map(course => ({ ...course, progress: Math.floor(Math.random() * 100) }));
        const approvedDocs = allDocs.filter(d => d.isApproved);
        const upcomingApprovedConferences = allConferences.filter(conf => conf.isApproved && new Date(conf.date) > new Date());
        const myForumPosts = allForumPosts.filter(p => p.author && p.author._id === user.id && p.isApproved);
        const myApprovedComments = allComments.filter(c => c.author && c.author._id === user.id && c.isApproved);

        const data = {
          enrolledCourses: coursesWithProgress,
          recentDocuments: approvedDocs.slice(0, 3),
          upcomingEvents: upcomingApprovedConferences.slice(0, 3),
          myRecentForumPosts: myForumPosts.slice(0, 3),
          myRecentComments: myApprovedComments.slice(0, 3),
        };

        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching student dashboard data:', err);
        setError('Could not load dashboard data. Please try again later.');
        toast.error('Error loading dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando datos del dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 p-4 sm:p-6 md:p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-4 sm:p-6 md:p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Dashboard de Estudiante</h1>

      {dashboardData && (
        <div className="space-y-8">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Mi Aprendizaje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color col-span-full">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Cursos Inscritos ({dashboardData.enrolledCourses.length})</h3>
              {dashboardData.enrolledCourses.length > 0 ? (
                <ul className="space-y-4">
                  {dashboardData.enrolledCourses.map((course) => (
                    <li key={course._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-bg-primary p-3 rounded-md shadow-sm gap-3">
                      <span className="font-semibold text-text-primary mb-2 sm:mb-0 flex-grow">{course.title}</span>
                      <div className="w-full sm:w-auto sm:ml-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="w-full sm:w-48 flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-accent-primary h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                          </div>
                          <span className="text-sm text-text-secondary">{course.progress}%</span>
                        </div>
                        <CustomButton type="secondary" className="text-sm py-1 px-3" onClick={() => navigate(`/courses/${course._id}`)}>Continuar</CustomButton>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-text-secondary">No estás inscrito en ningún curso aún. ¡Explora nuestros <a onClick={() => navigate('/courses')} className="text-accent-primary hover:underline cursor-pointer">cursos</a>!</p>
              )}
            </div>

            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Documentos Recientes ({dashboardData.recentDocuments.length})</h3>
              <ul className="list-disc list-inside text-text-secondary space-y-1">
                {dashboardData.recentDocuments.length > 0 ? (
                  dashboardData.recentDocuments.map(doc => (
                    <li key={doc._id} className="truncate">
                      <a onClick={() => navigate(`/documentation/${doc._id}`)} className="text-accent-primary hover:underline cursor-pointer">
                        {doc.title}
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No hay documentos recientes.</li>
                )}
                {dashboardData.recentDocuments.length > 5 && (
                  <li><a onClick={() => navigate('/documentation')} className="text-accent-primary hover:underline cursor-pointer">Ver más documentos...</a></li>
                )}
              </ul>
            </div>

            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Próximos Eventos ({dashboardData.upcomingEvents.length})</h3>
              <ul className="list-disc list-inside text-text-secondary space-y-1">
                {dashboardData.upcomingEvents.length > 0 ? (
                  dashboardData.upcomingEvents.map(event => (
                    <li key={event._id} className="truncate">
                      <a onClick={() => navigate(`/events/${event._id}`)} className="text-accent-primary hover:underline cursor-pointer">
                        {event.title} ({new Date(event.date).toLocaleDateString()})
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No hay eventos próximos.</li>
                )}
                {dashboardData.upcomingEvents.length > 5 && (
                  <li><a onClick={() => navigate('/events')} className="text-accent-primary hover:underline cursor-pointer">Ver más eventos...</a></li>
                )}
              </ul>
            </div>

            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Mi Actividad Reciente en Foro (Posts) ({dashboardData.myRecentForumPosts.length})</h3>
              <ul className="list-disc list-inside text-text-secondary space-y-1">
                {dashboardData.myRecentForumPosts.length > 0 ? (
                  dashboardData.myRecentForumPosts.map(post => (
                    <li key={post._id} className="truncate">
                      <a onClick={() => navigate(`/forums/${post._id}`)} className="text-accent-primary hover:underline cursor-pointer">
                        {post.title}
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No has creado posts recientemente.</li>
                )}
              </ul>
            </div>

            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Mis Comentarios Recientes ({dashboardData.myRecentComments.length})</h3>
              <ul className="list-disc list-inside text-text-secondary space-y-1">
                {dashboardData.myRecentComments.length > 0 ? (
                  dashboardData.myRecentComments.map(comment => (
                    <li key={comment._id} className="truncate">
                      <a onClick={() => navigate(`/forums/${comment.forumPost._id}`)} className="text-accent-primary hover:underline cursor-pointer">
                        "{comment.content?.substring(0, 30) || ''}..."
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No has hecho comentarios recientemente.</li>
                )}
              </ul>
            </div>

            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Explorar y Descubrir</h3>
              <ul className="list-disc list-inside text-text-secondary space-y-1">
                <li><a onClick={() => navigate('/courses')} className="text-accent-primary hover:underline cursor-pointer">Ver todos los cursos</a></li>
                <li><a onClick={() => navigate('/documentation')} className="text-accent-primary hover:underline cursor-pointer">Explorar documentación</a></li>
                <li><a onClick={() => navigate('/forums')} className="text-accent-primary hover:underline cursor-pointer">Participar en foros</a></li>
                <li><a onClick={() => navigate('/events')} className="text-accent-primary hover:underline cursor-pointer">Ver todos los eventos</a></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboardPage;
