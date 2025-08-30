import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const NivelEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const isAdmin = hasRole(['admin']);

  useEffect(() => {
    const fetchNivel = async () => {
      if (!isAdmin) {
        setLoading(false);
        setError('No tienes permiso para editar niveles.');
        return;
      }
      try {
        setLoading(true);
        const nivel = await nivelService.getNivelById(id);
        setValue('name', nivel.name);
        setValue('description', nivel.description || '');
        setError(null);
      } catch (err) {
        console.error('Error fetching nivel for edit:', err);
        setError('No se pudo cargar el nivel para edición.');
        toast.error('Error al cargar el nivel.');
      } finally {
        setLoading(false);
      }
    };

    fetchNivel();
  }, [id, isAdmin, setValue]);

  const onSubmit = async (data) => {
    if (!isAdmin) {
      toast.error('No tienes permiso para modificar niveles.');
      return;
    }
    try {
      setLoading(true);
      await nivelService.updateNivel(id, data);
      toast.success('Nivel actualizado exitosamente.');
      navigate('/admin/niveles'); // Redirigir a la gestión de niveles
    } catch (err) {
      console.error('Error updating nivel:', err);
      toast.error(err.response?.data?.message || 'Error al actualizar el nivel.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando nivel para edición...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Acceso Denegado</h1>
        <p className="text-lg">No tienes permiso para editar niveles.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <h1 className="text-3xl font-bold mb-6">Editar Nivel</h1>

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
            <CustomButton variant="secondary" onClick={() => navigate('/admin/niveles')} disabled={loading}>Cancelar</CustomButton>
            <CustomButton variant="primary" type="submit" disabled={loading}>
              {loading ? <Loader /> : 'Guardar Cambios'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NivelEditPage;
