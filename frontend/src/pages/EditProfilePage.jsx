import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import Loader from '../components/Loader';
import CustomButton from '../components/CustomButton';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { getInitialAvatars, generateRandomAvatars } from '../utils/avatarApiUtil';

// Función para barajar un array
const shuffleAvatars = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Esquema de validación actualizado
const validationSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  last_name: yup.string().required('El apellido es requerido'),
  email: yup.string().email('Formato de email inválido').required('El email es requerido'),
  address: yup.string().nullable(),
  phoneNumber: yup.string().nullable(),
  profilePictureURL: yup.string().required('Debes seleccionar un avatar'),
});

const EditProfilePage = () => {
  const { user, loading: authLoading, updateAuthUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Estados para avatares
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
      address: '',
      phoneNumber: '',
      profilePictureURL: '',
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        setInitialLoading(false);
        return;
      }
      try {
        // Cargar avatares y perfil en paralelo
        const { defaultAvatar, randomAvatars } = getInitialAvatars();
        setDefaultAvatar(defaultAvatar);
        setRandomAvatars(shuffleAvatars(randomAvatars));
        setLoadingAvatars(false);

        const fetchedProfile = await userService.getUserById(user.id);
        
        // Poblar el formulario
        setValue('name', fetchedProfile.name || '');
        setValue('last_name', fetchedProfile.last_name || '');
        setValue('email', fetchedProfile.email || '');
        setValue('address', fetchedProfile.address || '');
        setValue('phoneNumber', fetchedProfile.phoneNumber || '');
        setValue('profilePictureURL', fetchedProfile.profilePictureURL || defaultAvatar);

        // Establecer el avatar seleccionado
        setSelectedAvatar(fetchedProfile.profilePictureURL || defaultAvatar);

      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('No se pudo cargar la información del perfil.');
        navigate('/profile');
      } finally {
        setInitialLoading(false);
      }
    };

    if (!authLoading) {
      loadData();
    }
  }, [user, authLoading, setValue, navigate]);

  const handleAvatarSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setValue('profilePictureURL', avatarUrl, { shouldValidate: true });
    trigger('profilePictureURL');
  };

  const handleRegenerateAvatars = () => {
    setLoadingAvatars(true);
    const newRandomAvatars = generateRandomAvatars();
    setRandomAvatars(shuffleAvatars(newRandomAvatars));
    setLoadingAvatars(false);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateUser(user.id, data);
      updateAuthUser(updatedUser);
      toast.success('Perfil actualizado exitosamente.');
      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading || authLoading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando editor de perfil...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <h1 className="text-3xl font-bold mb-6">Editar Perfil</h1>
      <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto border border-border-color">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Sección de Selección de Avatar */}
          <div className="mt-4">
            <label className="block text-text-primary text-sm font-bold mb-2">Elige tu Avatar:</label>
            {/* Avatar Actual */}
            <div className="flex flex-col items-center mb-4">
              <p className="text-sm text-text-secondary mb-2">Avatar Actual</p>
              <img
                src={selectedAvatar}
                alt="Avatar seleccionado"
                className="w-24 h-24 rounded-full cursor-pointer p-1 bg-gray-700 ring-2 ring-accent-primary"
              />
            </div>

            {/* Opciones de Avatares */}
            <div className="flex justify-center mb-4">
              <CustomButton variant="secondary" type="button" onClick={handleRegenerateAvatars} disabled={loadingAvatars}>
                {loadingAvatars ? <Loader size="sm" /> : 'Generar nuevos avatares'}
              </CustomButton>
            </div>
            {loadingAvatars ? (
              <div className="flex justify-center items-center h-32"><Loader /></div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                {/* Avatar por defecto */}
                <img
                  src={defaultAvatar}
                  alt="Avatar por defecto"
                  className={`w-full h-auto rounded-full cursor-pointer p-1 bg-gray-700 ${selectedAvatar === defaultAvatar ? 'ring-2 ring-accent-primary' : ''}`}
                  onClick={() => handleAvatarSelect(defaultAvatar)}
                />
                {/* Avatares aleatorios */}
                {randomAvatars.map((avatarUrl) => (
                  <img
                    key={avatarUrl}
                    src={avatarUrl}
                    alt="Avatar aleatorio"
                    className={`w-full h-auto rounded-full cursor-pointer p-1 bg-gray-700 ${selectedAvatar === avatarUrl ? 'ring-2 ring-accent-primary' : ''}`}
                    onClick={() => handleAvatarSelect(avatarUrl)}
                  />
                ))}
              </div>
            )}
            {errors.profilePictureURL && <p className="text-red-500 text-xs mt-2 text-center">{errors.profilePictureURL.message}</p>}
          </div>

          {/* Campos del formulario */}
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="name">Nombre:</label>
            <input type="text" id="name" {...register("name")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="last_name">Apellido:</label>
            <input type="text" id="last_name" {...register("last_name")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
            {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="email">Email:</label>
            <input type="email" id="email" {...register("email")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="address">Dirección:</label>
            <input type="text" id="address" {...register("address")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="phoneNumber">Teléfono:</label>
            <input type="text" id="phoneNumber" {...register("phoneNumber")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <CustomButton variant="secondary" type="button" onClick={() => navigate('/profile')}>Cancelar</CustomButton>
            <CustomButton variant="primary" type="submit" disabled={loading}>
              {loading ? <Loader size="sm" /> : 'Guardar Cambios'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
