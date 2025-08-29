import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import forumService from '../services/forumService';
import subjectService from '../services/subjectService';
import Loader from '../components/Loader';
import CustomButton from '../components/CustomButton';

const validationSchema = yup.object().shape({
  title: yup.string().required('El título es requerido').min(5, 'El título debe tener al menos 5 caracteres'),
  content: yup.string().required('El contenido es requerido').min(10, 'El contenido debe tener al menos 10 caracteres'),
  subject: yup.string().required('Debes seleccionar una materia'),
});

const ForumPostCreatePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const fetchedSubjects = await subjectService.getSubjects();
        setSubjects(fetchedSubjects);
      } catch (error) {
        toast.error('Error al cargar las materias.');
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Debes iniciar sesión para crear un post.');
      return;
    }
    setLoading(true);
    try {
      const postData = {
        ...data,
        author: user.id,
      };
      await forumService.createForumPost(postData);
      toast.success('¡Post creado! Estará visible una vez que sea aprobado por un administrador.');
      navigate('/forums');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear el post.');
      console.error('Error creating forum post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="pt-20 flex justify-center items-center min-h-screen"><Loader /></div>;
  }

  return (
    <div className="pt-20 p-8 min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-3xl mx-auto bg-bg-secondary p-8 rounded-lg shadow-lg border border-border-color">
        <h1 className="text-3xl font-bold mb-6">Crear Nuevo Post en el Foro</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-bold mb-2">Materia</label>
            <select
              id="subject"
              {...register('subject')}
              className="w-full p-3 border rounded-md bg-input-bg text-text-primary border-input-border"
            >
              <option value="">-- Selecciona una materia --</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-bold mb-2">Título del Post</label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="w-full p-3 border rounded-md bg-input-bg text-text-primary border-input-border"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-bold mb-2">Contenido</label>
            <textarea
              id="content"
              {...register('content')}
              rows="8"
              className="w-full p-3 border rounded-md bg-input-bg text-text-primary border-input-border"
            ></textarea>
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <CustomButton type="button" onClick={() => navigate('/forums')} disabled={loading}>Cancelar</CustomButton>
            <CustomButton type="submit" disabled={loading}>
              {loading ? <Loader /> : 'Crear Post'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForumPostCreatePage;
