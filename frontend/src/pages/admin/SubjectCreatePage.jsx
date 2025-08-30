import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import subjectService from '../../services/subjectService';
import { getAllSubjectAreas } from '../../services/subjectAreaService';
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  name: yup.string().required('El nombre de la materia es requerido'),
  subjectArea: yup.string().required('El área de conocimiento es requerida'),
});

const SubjectCreatePage = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [subjectAreas, setSubjectAreas] = useState([]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const isAdmin = hasRole(['admin']);

  useEffect(() => {
    const fetchSubjectAreas = async () => {
      try {
        const data = await getAllSubjectAreas();
        setSubjectAreas(data);
      } catch (error) {
        toast.error('No se pudieron cargar las áreas de conocimiento.');
        console.error('Error fetching subject areas:', error);
      }
    };
    if (isAdmin) {
      fetchSubjectAreas();
    }
  }, [isAdmin]);

  const onSubmit = async (data) => {
    if (!isAdmin) {
      toast.error('No tienes permiso para crear materias.');
      return;
    }
    try {
      setLoading(true);
      await subjectService.createSubject(data);
      toast.success('Materia creada exitosamente.');
      navigate('/admin/subjects');
    } catch (err) {
      console.error('Error creating subject:', err);
      toast.error(err.response?.data?.message || 'Error al crear la materia.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Acceso Denegado</h1>
        <p className="text-lg">No tienes permiso para crear materias.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <h1 className="text-3xl font-bold mb-6">Crear Nueva Materia</h1>

      <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-md mx-auto border border-border-color">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="name">Nombre de la Materia:</label>
            <input type="text" id="name" {...register("name")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="subjectArea">Área de Conocimiento:</label>
            <select id="subjectArea" {...register("subjectArea")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border">
              <option value="">Selecciona un área</option>
              {subjectAreas.map(area => (
                <option key={area._id} value={area._id}>{area.name}</option>
              ))}
            </select>
            {errors.subjectArea && <p className="text-red-500 text-xs mt-1">{errors.subjectArea.message}</p>}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <CustomButton variant="secondary" onClick={() => navigate('/admin/subjects')} disabled={loading}>Cancelar</CustomButton>
            <CustomButton variant="primary" type="submit" disabled={loading}>
              {loading ? <Loader /> : 'Crear Materia'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectCreatePage;