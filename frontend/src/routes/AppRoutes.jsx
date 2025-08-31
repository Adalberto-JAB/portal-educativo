import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader'; // Asegúrate de que este componente exista y sea adecuado

// Importaciones dinámicas de componentes de página
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const GuestPage = lazy(() => import('../pages/GuestPage'));
const CoursesPage = lazy(() => import('../pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('../pages/CourseDetailPage'));
const DocumentationPage = lazy(() => import('../pages/DocumentationPage'));
const DocumentationDetailPage = lazy(() => import('../pages/DocumentationDetailPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ForumPage = lazy(() => import('../pages/ForumPage'));
const ForumPostCreatePage = lazy(() => import('../pages/ForumPostCreatePage'));
const ForumPostDetailPage = lazy(() => import('../pages/ForumPostDetailPage'));
const EventsPage = lazy(() => import('../pages/EventsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const EditProfilePage = lazy(() => import('../pages/EditProfilePage'));
const ChangePasswordPage = lazy(() => import('../pages/ChangePasswordPage'));
const DocumentationCreatePage = lazy(() => import('../pages/DocumentationCreatePage'));
const DocumentationEditPage = lazy(() => import('../pages/DocumentationEditPage'));

// Páginas de Lecciones
const LessonCreatePage = lazy(() => import('../pages/admin/LessonCreatePage'));
const LessonEditPage = lazy(() => import('../pages/admin/LessonEditPage'));
const LessonDetailPage = lazy(() => import('../pages/LessonDetailPage'));

// Páginas de Profesores
const MyCoursesPage = lazy(() => import('../pages/teacher/MyCoursesPage'));

// Páginas de Mantenimiento (Admin/Teacher)
const UserManagementPage = lazy(() => import('../pages/admin/UserManagementPage'));
const UserEditPage = lazy(() => import('../pages/admin/UserEditPage'));
const CourseManagementPage = lazy(() => import('../pages/admin/CourseManagementPage'));
const CourseCreatePage = lazy(() => import('../pages/admin/CourseCreatePage'));
const CourseEditPage = lazy(() => import('../pages/admin/CourseEditPage'));
const DocumentationManagementPage = lazy(() => import('../pages/admin/DocumentationManagementPage'));
const ForumManagementPage = lazy(() => import('../pages/admin/ForumManagementPage'));
const ForumPostEditPage = lazy(() => import('../pages/admin/ForumPostEditPage'));
const ConferenceManagementPage = lazy(() => import('../pages/admin/ConferenceManagementPage'));
const ConferenceCreatePage = lazy(() => import('../pages/admin/ConferenceCreatePage'));
const ConferenceEditPage = lazy(() => import('../pages/admin/ConferenceEditPage'));
const SubjectManagementPage = lazy(() => import('../pages/admin/SubjectManagementPage'));
const SubjectCreatePage = lazy(() => import('../pages/admin/SubjectCreatePage'));
const SubjectEditPage = lazy(() => import('../pages/admin/SubjectEditPage'));
const CoverManagementPage = lazy(() => import('../pages/admin/CoverManagementPage'));
const NivelManagementPage = lazy(() => import('../pages/admin/NivelManagementPage'));
const NivelCreatePage = lazy(() => import('../pages/admin/NivelCreatePage'));
const NivelEditPage = lazy(() => import('../pages/admin/NivelEditPage'));
const FacultadManagementPage = lazy(() => import('../pages/admin/FacultadManagementPage'));
const FacultadCreatePage = lazy(() => import('../pages/admin/FacultadCreatePage'));
const FacultadEditPage = lazy(() => import('../pages/admin/FacultadEditPage'));
const CarreraManagementPage = lazy(() => import('../pages/admin/CarreraManagementPage'));
const CarreraCreatePage = lazy(() => import('../pages/admin/CarreraCreatePage'));
const CarreraEditPage = lazy(() => import('../pages/admin/CarreraEditPage'));
const AsignaturaManagementPage = lazy(() => import('../pages/admin/AsignaturaManagementPage'));
const AsignaturaCreatePage = lazy(() => import('../pages/admin/AsignaturaCreatePage'));
const AsignaturaEditPage = lazy(() => import('../pages/admin/AsignaturaEditPage'));
const SubjectAreaManagementPage = lazy(() => import('../pages/admin/SubjectAreaManagementPage'));
const SubjectAreaCreatePage = lazy(() => import('../pages/admin/SubjectAreaCreatePage'));
const SubjectAreaEditPage = lazy(() => import('../pages/admin/SubjectAreaEditPage'));


// Componente ProtectedRoute
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return <div className="pt-20 p-8 text-center text-text-primary">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}> {/* Muestra un Loader mientras se carga el componente */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<div className="pt-20 p-8 bg-bg-primary text-text-primary"><h1 className="text-3xl font-bold mb-4">Acerca de Nosotros</h1><p className="text-lg">Somos una plataforma dedicada a ofrecer recursos educativos de alta calidad.</p></div>} />
        <Route path="/contact" element={<div className="pt-20 p-8 bg-bg-primary text-text-primary"><h1 className="text-3xl font-bold mb-4">Contacto</h1><p className="text-lg">Puedes contactarnos en info@portaleducativo.com</p></div>} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/documentation/:id" element={<DocumentationDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/guest" element={<GuestPage />} />

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/my-courses" element={<ProtectedRoute roles={['admin', 'teacher']}><MyCoursesPage /></ProtectedRoute>} />
        <Route path="/forums" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
        <Route path="/forums/create" element={<ProtectedRoute><ForumPostCreatePage /></ProtectedRoute>} />
        <Route path="/forums/:id" element={<ProtectedRoute><ForumPostDetailPage /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/profile/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
        <Route path="/documentation/create" element={<ProtectedRoute><DocumentationCreatePage /></ProtectedRoute>} />
        <Route path="/documentation/edit/:id" element={<ProtectedRoute><DocumentationEditPage /></ProtectedRoute>} />

        {/* Rutas de Lecciones */}
        <Route path="/lessons/:id" element={<LessonDetailPage />} />
        <Route path="/admin/courses/:courseId/lessons/create" element={<ProtectedRoute roles={['admin', 'teacher']}><LessonCreatePage /></ProtectedRoute>} />
        <Route path="/admin/courses/:courseId/lessons/edit/:lessonId" element={<ProtectedRoute roles={['admin', 'teacher']}><LessonEditPage /></ProtectedRoute>} />

        {/* Rutas de administración (solo para admin/teacher según la gestión) */}
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UserManagementPage /></ProtectedRoute>} />
        <Route path="/admin/users/edit/:id" element={<ProtectedRoute roles={['admin']}><UserEditPage /></ProtectedRoute>} />

        <Route path="/admin/courses" element={<ProtectedRoute roles={['admin']}><CourseManagementPage /></ProtectedRoute>} />
        <Route path="/admin/courses/create" element={<ProtectedRoute roles={['admin', 'teacher']}><CourseCreatePage /></ProtectedRoute>} />
        <Route path="/admin/courses/edit/:id" element={<ProtectedRoute roles={['admin', 'teacher']}><CourseEditPage /></ProtectedRoute>} />

        <Route path="/admin/documentation" element={<ProtectedRoute roles={['admin', 'teacher']}><DocumentationManagementPage /></ProtectedRoute>} />

        <Route path="/admin/forums-management" element={<ProtectedRoute roles={['admin', 'teacher']}><ForumManagementPage /></ProtectedRoute>} />
        <Route path="/admin/forums-management/edit/:id" element={<ProtectedRoute roles={['admin', 'teacher']}><ForumPostEditPage /></ProtectedRoute>} />

        <Route path="/admin/conferences" element={<ProtectedRoute roles={['admin', 'teacher']}><ConferenceManagementPage /></ProtectedRoute>} />
        <Route path="/admin/conferences/create" element={<ProtectedRoute roles={['admin', 'teacher']}><ConferenceCreatePage /></ProtectedRoute>} />
        <Route path="/admin/conferences/edit/:id" element={<ProtectedRoute roles={['admin', 'teacher']}><ConferenceEditPage /></ProtectedRoute>} />
        
        <Route path="/admin/subjects" element={<ProtectedRoute roles={['admin']}><SubjectManagementPage /></ProtectedRoute>} />
        <Route path="/admin/subjects/create" element={<ProtectedRoute roles={['admin']}><SubjectCreatePage /></ProtectedRoute>} />
        <Route path="/admin/subjects/edit/:id" element={<ProtectedRoute roles={['admin']}><SubjectEditPage /></ProtectedRoute>} />

        <Route path="/admin/covers" element={<ProtectedRoute roles={['admin']}><CoverManagementPage /></ProtectedRoute>} />

        <Route path="/admin/niveles" element={<ProtectedRoute roles={['admin']}><NivelManagementPage /></ProtectedRoute>} />
        <Route path="/admin/niveles/create" element={<ProtectedRoute roles={['admin']}><NivelCreatePage /></ProtectedRoute>} />
        <Route path="/admin/niveles/edit/:id" element={<ProtectedRoute roles={['admin']}><NivelEditPage /></ProtectedRoute>} />

        <Route path="/admin/facultades" element={<ProtectedRoute roles={['admin']}><FacultadManagementPage /></ProtectedRoute>} />
        <Route path="/admin/facultades/create" element={<ProtectedRoute roles={['admin']}><FacultadCreatePage /></ProtectedRoute>} />
        <Route path="/admin/facultades/edit/:id" element={<ProtectedRoute roles={['admin']}><FacultadEditPage /></ProtectedRoute>} />

        <Route path="/admin/carreras" element={<ProtectedRoute roles={['admin']}><CarreraManagementPage /></ProtectedRoute>} />
        <Route path="/admin/carreras/create" element={<ProtectedRoute roles={['admin']}><CarreraCreatePage /></ProtectedRoute>} />
        <Route path="/admin/carreras/edit/:id" element={<ProtectedRoute roles={['admin']}><CarreraEditPage /></ProtectedRoute>} />

        <Route path="/admin/asignaturas" element={<ProtectedRoute roles={['admin']}><AsignaturaManagementPage /></ProtectedRoute>} />
        <Route path="/admin/asignaturas/create" element={<ProtectedRoute roles={['admin']}><AsignaturaCreatePage /></ProtectedRoute>} />
        <Route path="/admin/asignaturas/edit/:id" element={<ProtectedRoute roles={['admin']}><AsignaturaEditPage /></ProtectedRoute>} />

        <Route path="/admin/subject-areas" element={<ProtectedRoute roles={['admin']}><SubjectAreaManagementPage /></ProtectedRoute>} />
        <Route path="/admin/subject-areas/create" element={<ProtectedRoute roles={['admin']}><SubjectAreaCreatePage /></ProtectedRoute>} />
        <Route path="/admin/subject-areas/edit/:id" element={<ProtectedRoute roles={['admin']}><SubjectAreaEditPage /></ProtectedRoute>} />

        {/* Ruta para manejar 404 - No encontrada */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
