import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import userService from '../services/userService';
import Loader from '../components/Loader';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';

// Esquema de validación con Yup
const validationSchema = yup.object().shape({
  currentPassword: yup.string().required('La contraseña actual es requerida.'),
  newPassword: yup
    .string()
    .required('La nueva contraseña es requerida.')
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres.')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Debe contener una mayúscula, minúscula, un número y un carácter especial.'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Las contraseñas deben coincidir.')
    .required('Confirmar la nueva contraseña es requerido.'),
});

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setInitialLoading(false);
        return;
      }
      try {
        const fetchedProfile = await userService.getUserById(user.id);
        setProfile(fetchedProfile);
      } catch (err) {
        console.error('Error fetching profile:', err);
        toast.error('No se pudo cargar la información del perfil.');
      } finally {
        setInitialLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success(res.message || 'Contraseña actualizada exitosamente.');
      navigate('/profile');
    } catch (err) {
      console.error('Error changing password:', err);
      toast.error(err.response?.data?.message || 'Error al cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading || authLoading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-md mx-auto border border-border-color">
        {profile && (
          <div className="text-center mb-8">
            <img
              src={profile.profilePictureURL}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-accent-primary"
            />
            <h2 className="text-2xl font-bold">{profile.name} {profile.last_name}</h2>
            <p className="text-text-secondary">{profile.email}</p>
          </div>
        )}
        
        <h2 className="text-xl font-bold mb-4 text-center">Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="currentPassword">
              Contraseña Actual:
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                {...register('currentPassword')}
                className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border"
              />
              <button
                type="button"
                onMouseDown={() => setShowCurrentPassword(true)}
                onMouseUp={() => setShowCurrentPassword(false)}
                onMouseLeave={() => setShowCurrentPassword(false)}
                onTouchStart={() => setShowCurrentPassword(true)}
                onTouchEnd={() => setShowCurrentPassword(false)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-text-secondary"
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="newPassword">
              Nueva Contraseña:
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                {...register('newPassword')}
                className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border"
              />
              <button
                type="button"
                onMouseDown={() => setShowNewPassword(true)}
                onMouseUp={() => setShowNewPassword(false)}
                onMouseLeave={() => setShowNewPassword(false)}
                onTouchStart={() => setShowNewPassword(true)}
                onTouchEnd={() => setShowNewPassword(false)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-text-secondary"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirmar Nueva Contraseña:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                {...register('confirmPassword')}
                className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border"
              />
              <button
                type="button"
                onMouseDown={() => setShowConfirmPassword(true)}
                onMouseUp={() => setShowConfirmPassword(false)}
                onMouseLeave={() => setShowConfirmPassword(false)}
                onTouchStart={() => setShowConfirmPassword(true)}
                onTouchEnd={() => setShowConfirmPassword(false)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-text-secondary"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <CustomButton variant="secondary" type="button" onClick={() => navigate('/profile')}>
              Cancelar
            </CustomButton>
            <CustomButton variant="primary" type="submit" disabled={loading}>
              {loading ? <Loader size="sm" /> : 'Actualizar Contraseña'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

