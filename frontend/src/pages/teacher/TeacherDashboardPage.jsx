import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import CustomButton from '../../components/CustomButton';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Importar servicios necesarios
import courseService from '../../services/courseService';
import documentationService from '../../services/documentationService';
import forumService from '../../services/forumService';
import conferenceService from '../../services/conferenceService';
import commentService from '../../services/commentService';

const TeacherDashboardPage = () => {
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

        const myCourses = allCourses.filter(c => c.author && c.author._id === user.id);
        const myPendingCourses = myCourses.filter(c => !c.isApproved);
        const myDocs = allDocs.filter(d => d.author && d.author._id === user.id);
        const myPendingDocs = myDocs.filter(d => !d.isApproved);
        const myForumPosts = allForumPosts.filter(p => p.author && p.author._id === user.id);
        const myPendingForumPosts = myForumPosts.filter(p => !p.isApproved);
        const myConferences = allConferences.filter(conf => conf.organizer && conf.organizer._id === user.id);
        const myPendingConferences = myConferences.filter(conf => !conf.isApproved);
        const commentsOnMyPosts = allComments.filter(comment => 
          myForumPosts.some(post => post._id === comment.forumPost)
        );

        const data = {
          myCourses,
          myPendingCourses,
          myDocs,
          myPendingDocs,
          myForumPosts,
          myPendingForumPosts,
          myConferences,
          myPendingConferences,
          commentsOnMyPosts,
        };

        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching teacher dashboard data:', err);
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Dashboard de Profesor</h1>

      {dashboardData && (
        <div className="space-y-8">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Mi Contenido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Mis Cursos ({dashboardData.myCourses.length})</h3>
              <ul className="list-disc list-inside text-text-secondary space-y-1">
                {dashboardData.myCourses.length > 0 ? (
                  dashboardData.myCourses.slice(0, 5).map(course => (
                    <li key={course._id} className="truncate">
                      <a onClick={() => navigate(`/admin/courses/edit/${course._id}`)} className="text-accent-primary hover:underline cursor-pointer">
                        {course.title} ({course.isApproved ? 'Aprobado' : 'Pendiente'})
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No has creado cursos aún.</li>
                )}
                {dashboardData.myCourses.length > 5 && (
                  <li><a onClick={() => navigate('/admin/courses')} className="text-accent-primary hover:underline cursor-pointer">Ver todos mis cursos...</a></li>
                )}
              </ul>
            </div>
            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Mi Documentación ({dashboardData.myDocs.length})</h3>
              <ul className="list-disc list-inside text-text-secondary space-y-1">
                {dashboardData.myDocs.length > 0 ? (
                  dashboardData.myDocs.slice(0, 5).map(doc => (
                    <li key={doc._id} className="truncate">
                      <a onClick={() => navigate(`/admin/documentation/edit/${doc._id}`)} className="text-accent-primary hover:underline cursor-pointer">
                        {doc.title} ({doc.isApproved ? 'Aprobado' : 'Pendiente'})
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No has creado documentos aún.</li>
                )}
                {dashboardData.myDocs.length > 5 && (
                  <li><a onClick={() => navigate('/admin/documentation')} className="text-accent-primary hover:underline cursor-pointer">Ver toda mi documentación...</a></li>
                )}
              </ul>
            </div>
            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Mis Posts en Foro ({dashboardData.myForumPosts.length})</h3>
              <ul className="list-disc list-inside text-text-secondary space-y-1">
                {dashboardData.myForumPosts.length > 0 ? (
                  dashboardData.myForumPosts.slice(0, 5).map(post => (
                    <li key={post._id} className="truncate">
                      <a onClick={() => navigate(`/admin/forums-management/edit/${post._id}`)} className="text-accent-primary hover:underline cursor-pointer">
                        {post.title} ({post.isApproved ? 'Aprobado' : 'Pendiente'})
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No has creado posts en el foro aún.</li>
                )}
                {dashboardData.myForumPosts.length > 5 && (
                  <li><a onClick={() => navigate('/admin/forums-management')} className="text-accent-primary hover:underline cursor-pointer">Ver todos mis posts...</a></li>
                )}
              </ul>
            </div>
            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Mis Congresos ({dashboardData.myConferences.length})</h3>
              <ul className="list-disc list-inside text-text-secondary space-y-1">
                {dashboardData.myConferences.length > 0 ? (
                  dashboardData.myConferences.slice(0, 5).map(conf => (
                    <li key={conf._id} className="truncate">
                      <a onClick={() => navigate(`/admin/conferences/edit/${conf._id}`)} className="text-accent-primary hover:underline cursor-pointer">
                        {conf.title} ({conf.isApproved ? 'Aprobado' : 'Pendiente'})
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No has organizado congresos aún.</li>
                )}
                {dashboardData.myConferences.length > 5 && (
                  <li><a onClick={() => navigate('/admin/conferences')} className="text-accent-primary hover:underline cursor-pointer">Ver todos mis congresos...</a></li>
                )}
              </ul>
            </div>
            {dashboardData.commentsOnMyPosts.length > 0 && (
              <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
                <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Comentarios en Mis Posts ({dashboardData.commentsOnMyPosts.length})</h3>
                <ul className="list-disc list-inside text-text-secondary space-y-1">
                  {dashboardData.commentsOnMyPosts.slice(0, 5).map(comment => (
                    <li key={comment._id} className="truncate">
                      <a onClick={() => navigate(`/admin/forums-management/edit/${comment.forumPost._id}`)} className="text-accent-primary hover:underline cursor-pointer">
                        "{comment.content?.substring(0, 30) || ''}..." ({comment.isApproved ? 'Aprobado' : 'Pendiente'})
                      </a>
                    </li>
                  ))}
                  {dashboardData.commentsOnMyPosts.length > 5 && (
                    <li><a onClick={() => navigate('/admin/forums-management')} className="text-accent-primary hover:underline cursor-pointer">Ver todos los comentarios...</a></li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mt-8">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CustomButton type="primary" className="w-full" onClick={() => navigate('/admin/courses/create')}>Crear Nuevo Curso</CustomButton>
            <CustomButton type="primary" className="w-full" onClick={() => navigate('/admin/documentation/create')}>Subir Nuevo Documento</CustomButton>
            <CustomButton type="primary" className="w-full" onClick={() => navigate('/admin/conferences/create')}>Organizar Nuevo Congreso</CustomButton>
            <CustomButton type="primary" className="w-full" onClick={() => navigate('/forums')}>Ir al Foro</CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboardPage;
