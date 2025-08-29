import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import facultadService from '../../services/facultadService';
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  name: yup.string().required('El nombre de la facultad es requerido'),
  description: yup.string().nullable(),
});

const FacultadCreatePage = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const isAdmin = hasRole(['admin']);

  const onSubmit = async (data) => {
    if (!isAdmin) {
      toast.error('No tienes permiso para crear facultades.');
      return;
    }
    try {
      setLoading(true);
      await facultadService.createFacultad(data);
      toast.success('Facultad creada exitosamente.');
      navigate('/admin/facultades'); // Redirigir a la gestión de facultades
    } catch (err) {
      console.error('Error creating facultad:', err);
      toast.error(err.response?.data?.message || 'Error al crear la facultad.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Acceso Denegado</h1>
        <p className="text-lg">No tienes permiso para crear facultades.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <h1 className="text-3xl font-bold mb-6">Crear Nueva Facultad</h1>

      <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-md mx-auto border border-border-color">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="name">Nombre de la Facultad:</label>
            <input type="text" id="name" {...register("name")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="description">Descripción (opcional):</label>
            <textarea id="description" {...register("description")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" rows="7"></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <CustomButton variant="secondary" onClick={() => navigate('/admin/facultades')} disabled={loading}>Cancelar</CustomButton>
            <CustomButton variant="primary" type="submit" disabled={loading}>
              {loading ? <Loader /> : 'Crear Facultad'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultadCreatePage;
