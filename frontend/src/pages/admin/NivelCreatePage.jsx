import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import nivelService from '../../services/nivelService';
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  name: yup.string().required('El nombre del nivel es requerido'),
  description: yup.string().nullable(),
});

const NivelCreatePage = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const isAdmin = hasRole(['admin']);

  const onSubmit = async (data) => {
    if (!isAdmin) {
      toast.error('No tienes permiso para crear niveles.');
      return;
    }
    try {
      setLoading(true);
      await nivelService.createNivel(data);
      toast.success('Nivel creado exitosamente.');
      navigate('/admin/niveles'); // Redirigir a la gestión de niveles
    } catch (err) {
      console.error('Error creating nivel:', err);
      toast.error(err.response?.data?.message || 'Error al crear el nivel.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Acceso Denegado</h1>
        <p className="text-lg">No tienes permiso para crear niveles.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Nivel</h1>

      <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-md mx-auto border border-border-color">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="name">Nombre del Nivel:</label>
            <input type="text" id="name" {...register("name")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="description">Descripción (opcional):</label>
            <textarea id="description" {...register("description")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" rows="3"></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <CustomButton type="secondary" onClick={() => navigate('/admin/niveles')} disabled={loading}>Cancelar</CustomButton>
            <CustomButton type="primary" type="submit" disabled={loading}>
              {loading ? <Loader /> : 'Crear Nivel'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NivelCreatePage;
