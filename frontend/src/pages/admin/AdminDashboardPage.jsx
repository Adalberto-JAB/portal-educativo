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
import userService from '../../services/userService';
import commentService from '../../services/commentService';

const AdminDashboardPage = () => {
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
        const allUsers = await userService.getUsers();
        const pendingCourses = allCourses.filter(c => !c.isApproved);
        const pendingDocs = allDocs.filter(d => !d.isApproved);
        const pendingForumPosts = allForumPosts.filter(p => !p.isApproved);
        const pendingComments = await commentService.getComments();
        const commentsNeedingApproval = pendingComments.filter(c => !c.isApproved);
        const pendingConferences = allConferences.filter(conf => !conf.isApproved);

        const data = {
          totalUsers: allUsers.length,
          totalCourses: allCourses.length,
          totalDocuments: allDocs.length,
          totalForumPosts: allForumPosts.length,
          totalConferences: allConferences.length,
          pendingCourses,
          pendingDocs,
          pendingForumPosts,
          commentsNeedingApproval,
          pendingConferences,
        };

        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Dashboard de Administrador</h1>

      {dashboardData && (
        <div className="space-y-8">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Resumen General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Total Usuarios</h3>
              <p className="text-3xl sm:text-4xl font-bold text-accent-primary">{dashboardData.totalUsers}</p>
            </div>
            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Total Cursos</h3>
              <p className="text-3xl sm:text-4xl font-bold text-accent-primary">{dashboardData.totalCourses}</p>
            </div>
            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Total Documentos</h3>
              <p className="text-3xl sm:text-4xl font-bold text-accent-primary">{dashboardData.totalDocuments}</p>
            </div>
            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Total Foros</h3>
              <p className="text-3xl sm:text-4xl font-bold text-accent-primary">{dashboardData.totalForumPosts}</p>
            </div>
            <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Total Congresos</h3>
              <p className="text-3xl sm:text-4xl font-bold text-accent-primary">{dashboardData.totalConferences}</p>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mt-8">Contenido Pendiente de Aprobación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.pendingCourses.length > 0 && (
              <div className="bg-bg-secondary p-4 sm:p-6 rounded-lg shadow-md border border-border-color">
                <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Cursos Pendientes ({dashboardData.pendingCourses.length})</h3>
                <ul className="list-disc list-inside text-text-secondary space-y-1">
                  {dashboardData.pendingCourses.slice(0, 5).map(item => (
                    <li key={item._id} className="truncate">
                      <a onClick={() => navigate(`/admin/courses/edit/${item._id}`)} className="text-accent-primary hover:underline cursor-pointer">
                        {item.title}
                      </a>
                    </li>
                  ))}
                  {dashboardData.pendingCourses.length > 5 && (
                    <li><a onClick={() => navigate('/admin/courses')} className="text-accent-primary hover:underline cursor-pointer">Ver más...</a></li>
                  )}
                </ul>
              </div>
            )}
            {/* ... (repeat for other pending items) ... */}
            {dashboardData.pendingCourses.length === 0 &&
             dashboardData.pendingDocs.length === 0 &&
             dashboardData.pendingForumPosts.length === 0 &&
             dashboardData.commentsNeedingApproval.length === 0 &&
             dashboardData.pendingConferences.length === 0 && (
              <p className="text-text-secondary col-span-full text-center">No hay contenido pendiente de aprobación.</p>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mt-8">Gestión Rápida</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <CustomButton type="secondary" className="w-full" onClick={() => navigate('/admin/users')}>Gestionar Usuarios</CustomButton>
            <CustomButton type="secondary" className="w-full" onClick={() => navigate('/admin/courses')}>Gestionar Cursos</CustomButton>
            <CustomButton type="secondary" className="w-full" onClick={() => navigate('/admin/documentation')}>Gestionar Documentos</CustomButton>
            <CustomButton type="secondary" className="w-full" onClick={() => navigate('/admin/forums-management')}>Gestionar Foros</CustomButton>
            <CustomButton type="secondary" className="w-full" onClick={() => navigate('/admin/conferences')}>Gestionar Congresos</CustomButton>
            <CustomButton type="secondary" className="w-full" onClick={() => navigate('/admin/subjects')}>Gestionar Materias</CustomButton>
            <CustomButton type="secondary" className="w-full" onClick={() => navigate('/admin/niveles')}>Gestionar Niveles</CustomButton>
            <CustomButton type="secondary" className="w-full" onClick={() => navigate('/admin/covers')}>Gestionar Portadas</CustomButton>
            <CustomButton type="secondary" className="w-full" onClick={() => navigate('/admin/facultades')}>Gestionar Facultades</CustomButton>
            <CustomButton type="secondary" className="w-full" onClick={() => navigate('/admin/carreras')}>Gestionar Carreras</CustomButton>
            <CustomButton type="secondary" className="w-full" onClick={() => navigate('/admin/subject-areas')}>Gestionar Áreas Temáticas</CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
