import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importar componentes de página
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import GuestPage from '../pages/GuestPage';
import CoursesPage from '../pages/CoursesPage';
import CourseDetailPage from '../pages/CourseDetailPage';
import DocumentationPage from '../pages/DocumentationPage';
import DocumentationDetailPage from '../pages/DocumentationDetailPage';
import DashboardPage from '../pages/DashboardPage';
import ForumPage from '../pages/ForumPage';
import EventsPage from '../pages/EventsPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/ProfilePage';
import EditProfilePage from '../pages/EditProfilePage';
import ChangePasswordPage from '../pages/ChangePasswordPage';

// Páginas de Mantenimiento (Admin/Teacher)
import UserManagementPage from '../pages/admin/UserManagementPage';
import UserEditPage from '../pages/admin/UserEditPage';
import CourseManagementPage from '../pages/admin/CourseManagementPage';
import CourseCreatePage from '../pages/admin/CourseCreatePage';
import CourseEditPage from '../pages/admin/CourseEditPage';
import DocumentationManagementPage from '../pages/admin/DocumentationManagementPage';
import DocumentationCreatePage from '../pages/admin/DocumentationCreatePage';
import DocumentationEditPage from '../pages/admin/DocumentationEditPage';
import ForumManagementPage from '../pages/admin/ForumManagementPage';
import ForumPostEditPage from '../pages/admin/ForumPostEditPage';
import ConferenceManagementPage from '../pages/admin/ConferenceManagementPage';
import ConferenceCreatePage from '../pages/admin/ConferenceCreatePage';
import ConferenceEditPage from '../pages/admin/ConferenceEditPage';
import SubjectManagementPage from '../pages/admin/SubjectManagementPage';
import SubjectCreatePage from '../pages/admin/SubjectCreatePage';
import SubjectEditPage from '../pages/admin/SubjectEditPage';
import CoverManagementPage from '../pages/admin/CoverManagementPage';
import NivelManagementPage from '../pages/admin/NivelManagementPage';
import NivelCreatePage from '../pages/admin/NivelCreatePage';
import NivelEditPage from '../pages/admin/NivelEditPage';
import FacultadManagementPage from '../pages/admin/FacultadManagementPage';
import FacultadCreatePage from '../pages/admin/FacultadCreatePage';
import FacultadEditPage from '../pages/admin/FacultadEditPage';
import CarreraManagementPage from '../pages/admin/CarreraManagementPage';
import CarreraCreatePage from '../pages/admin/CarreraCreatePage';
import CarreraEditPage from '../pages/admin/CarreraEditPage';
import AsignaturaManagementPage from '../pages/admin/AsignaturaManagementPage';
import AsignaturaCreatePage from '../pages/admin/AsignaturaCreatePage';
import AsignaturaEditPage from '../pages/admin/AsignaturaEditPage';
import SubjectAreaManagementPage from '../pages/admin/SubjectAreaManagementPage';
import SubjectAreaCreatePage from '../pages/admin/SubjectAreaCreatePage';
import SubjectAreaEditPage from '../pages/admin/SubjectAreaEditPage';


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
      <Route path="/forums" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
      <Route path="/profile/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

      {/* Rutas de administración (solo para admin/teacher según la gestión) */}
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UserManagementPage /></ProtectedRoute>} />
      <Route path="/admin/users/edit/:id" element={<ProtectedRoute roles={['admin']}><UserEditPage /></ProtectedRoute>} />

      <Route path="/admin/courses" element={<ProtectedRoute roles={['admin', 'teacher']}><CourseManagementPage /></ProtectedRoute>} />
      <Route path="/admin/courses/create" element={<ProtectedRoute roles={['admin', 'teacher']}><CourseCreatePage /></ProtectedRoute>} />
      <Route path="/admin/courses/edit/:id" element={<ProtectedRoute roles={['admin', 'teacher']}><CourseEditPage /></ProtectedRoute>} />

      <Route path="/admin/documentation" element={<ProtectedRoute roles={['admin', 'teacher']}><DocumentationManagementPage /></ProtectedRoute>} />
      <Route path="/admin/documentation/create" element={<ProtectedRoute roles={['admin', 'teacher', 'student']}><DocumentationCreatePage /></ProtectedRoute>} />
      <Route path="/admin/documentation/edit/:id" element={<ProtectedRoute roles={['admin', 'teacher']}><DocumentationEditPage /></ProtectedRoute>} />

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
  );
};

export default AppRoutes;