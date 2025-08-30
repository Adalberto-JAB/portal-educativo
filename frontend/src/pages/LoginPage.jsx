import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';

const schema = yup.object().shape({
  email: yup.string().email('El email no es válido').required('El email es requerido'),
  password: yup.string().required('La contraseña es requerida'),
});

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const success = await login(data.email, data.password);
    if (success) {
      navigate('/dashboard'); // Redirigir al dashboard después del login exitoso
    }
  };

  return (
    <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 bg-bg-primary text-text-primary">
      <div className="bg-bg-secondary p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md border border-border-color">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-text-primary">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary bg-input-bg text-text-primary border-input-border placeholder-input-placeholder"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="password">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary bg-input-bg text-text-primary border-input-border placeholder-input-placeholder"
              placeholder="********"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {loading ? (
            <Loader />
          ) : (
            <CustomButton variant="primary" className="w-full" type="submit">
              Iniciar Sesión
            </CustomButton>
          )}
        </form>
        <p className="text-center text-text-secondary text-sm mt-4">
          ¿No tienes una cuenta?{' '}
          <a onClick={() => navigate('/register')} className="text-accent-primary hover:underline cursor-pointer">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
