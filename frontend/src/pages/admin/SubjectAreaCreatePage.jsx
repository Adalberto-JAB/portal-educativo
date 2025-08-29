import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { createSubjectArea } from '../../services/subjectAreaService';

const schema = yup.object().shape({
  name: yup.string().required('El nombre es obligatorio'),
  description: yup.string(),
});

const SubjectAreaCreatePage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await createSubjectArea(data);
      navigate('/admin/subject-areas');
    } catch (error) {
      console.error('Error al crear el área temática:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Área Temática</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Nombre</label>
          <input {...register('name')} className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Descripción</label>
          <textarea {...register('description')} className="w-full px-3 py-2 border border-gray-300"></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Crear</button>
      </form>
    </div>
  );
};

export default SubjectAreaCreatePage;
