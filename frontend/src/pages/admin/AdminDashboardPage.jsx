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
import { FaUsers, FaBook, FaFileAlt, FaComments, FaChalkboardTeacher, FaHourglassStart, FaFileExcel, FaCommentsDollar, FaRegCommentDots, FaChalkboard } from 'react-icons/fa';

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
    <div className="mt-24 p-4 sm:p-6 md:p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <h1 className="text-2xl text-center sm:text-3xl font-bold mb-6">Dashboard de Administrador</h1>

      {dashboardData && (
        <div className="space-y-8">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Resumen General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Total Usuarios */}
            <div className="bg-blue-100 dark:bg-blue-800 p-4 sm:p-6 rounded-lg shadow-md border border-blue-200 dark:border-blue-700">
              <div className="flex justify-between items-start">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-800 dark:text-blue-100 mb-2">Total Usuarios</h3>
                <FaUsers className="text-3xl text-blue-500 dark:text-blue-300" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-blue-900 dark:text-blue-200">{dashboardData.totalUsers}</p>
            </div>

            {/* Total Cursos */}
            <div className="bg-green-100 dark:bg-green-800 p-4 sm:p-6 rounded-lg shadow-md border border-green-200 dark:border-green-700">
              <div className="flex justify-between items-start">
                <h3 className="text-lg sm:text-xl font-semibold text-green-800 dark:text-green-100 mb-2">Total Cursos</h3>
                <FaBook className="text-3xl text-green-500 dark:text-green-300" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-green-900 dark:text-green-200">{dashboardData.totalCourses}</p>
            </div>

            {/* Total Documentos */}
            <div className="bg-yellow-100 dark:bg-yellow-800 p-4 sm:p-6 rounded-lg shadow-md border border-yellow-200 dark:border-yellow-700">
              <div className="flex justify-between items-start">
                <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 dark:text-yellow-100 mb-2">Total Documentos</h3>
                <FaFileAlt className="text-3xl text-yellow-500 dark:text-yellow-300" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-yellow-900 dark:text-yellow-200">{dashboardData.totalDocuments}</p>
            </div>

            {/* Total Foros */}
            <div className="bg-purple-100 dark:bg-purple-800 p-4 sm:p-6 rounded-lg shadow-md border border-purple-200 dark:border-purple-700">
              <div className="flex justify-between items-start">
                <h3 className="text-lg sm:text-xl font-semibold text-purple-800 dark:text-purple-100 mb-2">Total Foros</h3>
                <FaComments className="text-3xl text-purple-500 dark:text-purple-300" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-purple-900 dark:text-purple-200">{dashboardData.totalForumPosts}</p>
            </div>

            {/* Total Congresos */}
            <div className="bg-indigo-100 dark:bg-indigo-800 p-4 sm:p-6 rounded-lg shadow-md border border-indigo-200 dark:border-indigo-700">
              <div className="flex justify-between items-start">
                <h3 className="text-lg sm:text-xl font-semibold text-indigo-800 dark:text-indigo-100 mb-2">Total Congresos</h3>
                <FaChalkboardTeacher className="text-3xl text-indigo-500 dark:text-indigo-300" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-indigo-900 dark:text-indigo-200">{dashboardData.totalConferences}</p>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mt-8">Contenido Pendiente de Aprobación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cursos Pendientes */}
            {dashboardData.pendingCourses.length > 0 && (
              <div className="bg-orange-100 dark:bg-orange-800 p-4 sm:p-6 rounded-lg shadow-md border border-orange-200 dark:border-orange-700">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg sm:text-xl font-semibold text-orange-800 dark:text-orange-100 mb-2">Cursos Pendientes ({dashboardData.pendingCourses.length})</h3>
                  <FaHourglassStart className="text-3xl text-orange-500 dark:text-orange-300" />
                </div>
                <ul className="list-disc list-inside text-orange-700 dark:text-orange-200 space-y-1">
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

            {/* Documentos Pendientes */}
            {dashboardData.pendingDocs.length > 0 && (
              <div className="bg-teal-100 dark:bg-teal-800 p-4 sm:p-6 rounded-lg shadow-md border border-teal-200 dark:border-teal-700">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg sm:text-xl font-semibold text-teal-800 dark:text-teal-100 mb-2">Documentos Pendientes ({dashboardData.pendingDocs.length})</h3>
                  <FaFileExcel className="text-3xl text-teal-500 dark:text-teal-300" />
                </div>
                <ul className="list-disc list-inside text-teal-700 dark:text-teal-200 space-y-1">
                  {dashboardData.pendingDocs.slice(0, 5).map(item => (
                    <li key={item._id} className="truncate">
                      <a onClick={() => navigate(`/admin/documentation/edit/${item._id}`)} className="text-accent-primary hover:underline cursor-pointer">
                        {item.title}
                      </a>
                    </li>
                  ))}
                  {dashboardData.pendingDocs.length > 5 && (
                    <li><a onClick={() => navigate('/admin/documentation')} className="text-accent-primary hover:underline cursor-pointer">Ver más...</a></li>
                  )}
                </ul>
              </div>
            )}

            {/* Posts de Foro Pendientes */}
            {dashboardData.pendingForumPosts.length > 0 && (
              <div className="bg-cyan-100 dark:bg-cyan-800 p-4 sm:p-6 rounded-lg shadow-md border border-cyan-200 dark:border-cyan-700">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg sm:text-xl font-semibold text-cyan-800 dark:text-cyan-100 mb-2">Posts de Foro Pendientes ({dashboardData.pendingForumPosts.length})</h3>
                  <FaCommentsDollar className="text-3xl text-cyan-500 dark:text-cyan-300" />
                </div>
                <ul className="list-disc list-inside text-cyan-700 dark:text-cyan-200 space-y-1">
                  {dashboardData.pendingForumPosts.slice(0, 5).map(item => (
                    <li key={item._id} className="truncate">
                      <a onClick={() => navigate(`/admin/forums-management/edit/${item._id}`)} className="text-accent-primary hover:underline cursor-pointer">
                        {item.title}
                      </a>
                    </li>
                  ))}
                  {dashboardData.pendingForumPosts.length > 5 && (
                    <li><a onClick={() => navigate('/admin/forums-management')} className="text-accent-primary hover:underline cursor-pointer">Ver más...</a></li>
                  )}
                </ul>
              </div>
            )}

            {/* Comentarios Pendientes */}
            {dashboardData.commentsNeedingApproval.length > 0 && (
              <div className="bg-lime-100 dark:bg-lime-800 p-4 sm:p-6 rounded-lg shadow-md border border-lime-200 dark:border-lime-700">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg sm:text-xl font-semibold text-lime-800 dark:text-lime-100 mb-2">Comentarios Pendientes ({dashboardData.commentsNeedingApproval.length})</h3>
                  <FaRegCommentDots className="text-3xl text-lime-500 dark:text-lime-300" />
                </div>
                <ul className="list-disc list-inside text-lime-700 dark:text-lime-200 space-y-1">
                  {dashboardData.commentsNeedingApproval.slice(0, 5).map(item => (
                    <li key={item._id} className="truncate">
                      <a onClick={() => navigate(`/admin/forums-management`)} className="text-accent-primary hover:underline cursor-pointer">
                        "{item.content.substring(0, 20)}..."
                      </a>
                    </li>
                  ))}
                  {dashboardData.commentsNeedingApproval.length > 5 && (
                    <li><a onClick={() => navigate('/admin/forums-management')} className="text-accent-primary hover:underline cursor-pointer">Ver más...</a></li>
                  )}
                </ul>
              </div>
            )}

            {/* Congresos Pendientes */}
            {dashboardData.pendingConferences.length > 0 && (
              <div className="bg-fuchsia-100 dark:bg-fuchsia-800 p-4 sm:p-6 rounded-lg shadow-md border border-fuchsia-200 dark:border-fuchsia-700">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg sm:text-xl font-semibold text-fuchsia-800 dark:text-fuchsia-100 mb-2">Congresos Pendientes ({dashboardData.pendingConferences.length})</h3>
                  <FaChalkboard className="text-3xl text-fuchsia-500 dark:text-fuchsia-300" />
                </div>
                <ul className="list-disc list-inside text-fuchsia-700 dark:text-fuchsia-200 space-y-1">
                  {dashboardData.pendingConferences.slice(0, 5).map(item => (
                    <li key={item._id} className="truncate">
                      <a onClick={() => navigate(`/admin/conferences/edit/${item._id}`)} className="text-accent-primary hover:underline cursor-pointer">
                        {item.title}
                      </a>
                    </li>
                  ))}
                  {dashboardData.pendingConferences.length > 5 && (
                    <li><a onClick={() => navigate('/admin/conferences')} className="text-accent-primary hover:underline cursor-pointer">Ver más...</a></li>
                  )}
                </ul>
              </div>
            )}

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
            <CustomButton variant="secondary" className="w-full" onClick={() => navigate('/admin/users')}>Gestionar Usuarios</CustomButton>
            <CustomButton variant="secondary" className="w-full" onClick={() => navigate('/admin/courses')}>Gestionar Cursos</CustomButton>
            <CustomButton variant="secondary" className="w-full" onClick={() => navigate('/admin/documentation')}>Gestionar Documentos</CustomButton>
            <CustomButton variant="secondary" className="w-full" onClick={() => navigate('/admin/forums-management')}>Gestionar Foros</CustomButton>
            <CustomButton variant="secondary" className="w-full" onClick={() => navigate('/admin/conferences')}>Gestionar Congresos</CustomButton>
            <CustomButton variant="secondary" className="w-full" onClick={() => navigate('/admin/subjects')}>Gestionar Materias</CustomButton>
            <CustomButton variant="secondary" className="w-full" onClick={() => navigate('/admin/niveles')}>Gestionar Niveles</CustomButton>
            <CustomButton variant="secondary" className="w-full" onClick={() => navigate('/admin/covers')}>Gestionar Portadas</CustomButton>
            <CustomButton variant="secondary" className="w-full" onClick={() => navigate('/admin/facultades')}>Gestionar Facultades</CustomButton>
            <CustomButton variant="secondary" className="w-full" onClick={() => navigate('/admin/carreras')}>Gestionar Carreras</CustomButton>
            <CustomButton variant="secondary" className="w-full" onClick={() => navigate('/admin/subject-areas')}>Gestionar Áreas Temáticas</CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
