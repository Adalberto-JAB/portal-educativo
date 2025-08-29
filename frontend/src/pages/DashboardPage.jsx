import React from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

// Importar los dashboards específicos de cada rol
import AdminDashboardPage from './admin/AdminDashboardPage';
import TeacherDashboardPage from './teacher/TeacherDashboardPage';
import StudentDashboardPage from './StudentDashboardPage';
import CustomButton from '../components/CustomButton';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAuthenticated, hasRole } = useAuth();

  // Muestra un loader mientras se verifica la autenticación y el rol
  if (authLoading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando...</p>
      </div>
    );
  }

  // Si no está autenticado o es un invitado, muestra un mensaje de acceso denegado
  if (!isAuthenticated || user.role === 'guest') {
    return (
      <div className="pt-20 p-4 sm:p-6 md:p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center flex flex-col items-center justify-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Acceso Denegado</h1>
        <p className="text-lg mb-6">Por favor, inicia sesión para ver tu dashboard.</p>
        <CustomButton type="primary" onClick={() => navigate('/login')} className="w-full max-w-xs">
          Iniciar Sesión
        </CustomButton>
      </div>
    );
  }

  // Renderiza el dashboard correspondiente según el rol del usuario
  if (hasRole(['admin'])) {
    return <AdminDashboardPage />;
  }

  if (hasRole(['teacher'])) {
    return <TeacherDashboardPage />;
  }

  if (hasRole(['student'])) {
    return <StudentDashboardPage />;
  }

  // Fallback por si el rol no es ninguno de los esperados
  return (
    <div className="pt-20 p-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-red-500">Error de Rol</h1>
      <p className="text-lg">Tu rol de usuario no es válido para mostrar un dashboard.</p>
    </div>
  );
};

export default DashboardPage;