import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { getInitialAvatars, generateRandomAvatars } from '../utils/avatarApiUtil';

// Función para barajar un array (algoritmo Fisher-Yates)
const shuffleAvatars = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Extender el esquema de validación para incluir el profilePictureURL
const validationSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
  last_name: yup.string().required('El apellido es requerido').min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: yup.string().email('Formato de email inválido').required('El email es requerido'),
  password: yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('Confirmar contraseña es requerido'),
  phoneNumber: yup.string().nullable(),
  address: yup.string().nullable(),
  profilePictureURL: yup.string().required('Debes seleccionar un avatar'), // Campo renombrado y requerido
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingAvatars, setLoadingAvatars] = useState(true);
  const [defaultAvatar, setDefaultAvatar] = useState('');
  const [randomAvatars, setRandomAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      address: '',
      profilePictureURL: '', // Campo renombrado
    },
  });

  useEffect(() => {
    const loadAvatars = async () => {
      setLoadingAvatars(true);
      const { defaultAvatar, randomAvatars } = getInitialAvatars();
      setDefaultAvatar(defaultAvatar);
      setRandomAvatars(shuffleAvatars(randomAvatars));
      setSelectedAvatar(defaultAvatar);
      setValue('profilePictureURL', defaultAvatar); // Usar el nombre de campo correcto
      setLoadingAvatars(false);
    };
    loadAvatars();
  }, [setValue]);

  const handleAvatarSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setValue('profilePictureURL', avatarUrl, { shouldValidate: true }); // Usar el nombre de campo correcto
    trigger('profilePictureURL');
  };

  const handleRegenerateAvatars = () => {
    setLoadingAvatars(true);
    const newRandomAvatars = generateRandomAvatars();
    setRandomAvatars(shuffleAvatars(newRandomAvatars));
    setLoadingAvatars(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Enviar profilePictureURL en lugar de avatar
      const userDataToRegister = {
        name: data.name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        address: data.address,
        profilePictureURL: data.profilePictureURL, 
        role: 'student',
      };

      const success = await authRegister(userDataToRegister);
      if (success) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error registering user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 p-4 sm:p-6 md:p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary flex items-center justify-center">
      <div className="bg-bg-secondary p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-2xl border border-border-color">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Registro de Usuario</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="name">Nombre:</label>
              <input type="text" id="name" {...register("name")} className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="last_name">Apellido:</label>
              <input type="text" id="last_name" {...register("last_name")} className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
            </div>
            <div>
              <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="email">Email:</label>
              <input type="email" id="email" {...register("email")} className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="password">Contraseña:</label>
              <input type="password" id="password" {...register("password")} className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="confirmPassword">Confirmar Contraseña:</label>
              <input type="password" id="confirmPassword" {...register("confirmPassword")} className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <div>
              <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="phoneNumber">Número de Teléfono (Opcional):</label>
              <input type="text" id="phoneNumber" {...register("phoneNumber")} className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="address">Dirección (Opcional):</label>
              <input type="text" id="address" {...register("address")} className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
          </div>

          {/* Sección de Selección de Avatar */}
          <div className="mt-4">
            <label className="block text-text-primary text-sm font-bold mb-2">Elige tu Avatar:</label>
            {/* Avatar por Defecto */}
            <div className="flex flex-col items-center mb-4">
              <p className="text-sm text-text-secondary mb-2">Avatar por defecto</p>
              <img
                src={defaultAvatar}
                alt="Avatar por defecto"
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full cursor-pointer p-1 bg-gray-700 ${selectedAvatar === defaultAvatar ? 'ring-4 ring-accent-primary' : ''}`}
                onClick={() => handleAvatarSelect(defaultAvatar)}
              />
            </div>

            {/* Avatares Aleatorios */}
            <div className="flex justify-center mb-4">
              <CustomButton variant="secondary  cursor-pointer" type="button" onClick={handleRegenerateAvatars} disabled={loadingAvatars}>
                {loadingAvatars ? <Loader size="sm" /> : 'Generar nuevos avatares'}
              </CustomButton>
            </div>
            {loadingAvatars ? (
              <div className="flex justify-center items-center h-32"><Loader /></div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {randomAvatars.map((avatarUrl) => (
                  <img
                    key={avatarUrl}
                    src={avatarUrl}
                    alt="Avatar aleatorio"
                    className={`w-full h-auto rounded-full cursor-pointer p-1 bg-gray-700 ${selectedAvatar === avatarUrl ? 'ring-4 ring-accent-primary' : ''}`}
                    onClick={() => handleAvatarSelect(avatarUrl)}
                  />
                ))}
              </div>
            )}
            {errors._profilePictureURL && <p className="text-red-500 text-xs mt-2 text-center">{errors.profilePictureURL.message}</p>}
          </div>
          
          <CustomButton variant="primary" type="submit" disabled={loading} className="w-full mt-4">
            {loading ? <Loader /> : 'Registrarse'}
          </CustomButton>
        </form>
        <p className="text-center text-text-secondary text-sm mt-4">
          ¿Ya tienes una cuenta? <a onClick={() => navigate('/login')} className="text-accent-primary hover:underline cursor-pointer">Inicia Sesión</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
