import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import lessonService from '../../services/lessonService';
import courseService from '../../services/courseService'; // Para verificar el autor del curso
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';

const validationSchema = yup.object().shape({
  title: yup.string().required('El título es requerido.'),
  description: yup.string().required('La descripción es requerida.'),
  order: yup.number()
    .typeError('El orden debe ser un número.')
    .required('El orden es requerido.')
    .positive('El orden debe ser un número positivo.')
    .integer('El orden debe ser un número entero.'),
  pdfFile: yup.mixed()
    .nullable()
    .test('fileType', 'Solo se permiten archivos PDF.', (value) => {
      return !value || (value && value[0] && value[0].type === 'application/pdf');
    })
    .test('fileSize', 'El archivo es demasiado grande (máx. 5MB). ', (value) => {
      return !value || (value && value[0] && value[0].size <= 5 * 1024 * 1024) // 5MB
    }),
});

const LessonEditPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPdfName, setCurrentPdfName] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const isAllowed = hasRole(['admin', 'teacher']);
  const isAdmin = hasRole(['admin']);

  const selectedFile = watch("pdfFile");

  const fetchLessonData = useCallback(async () => {
    if (!isAuthenticated || !isAllowed) {
      toast.error('No tienes permiso para editar lecciones.');
      navigate('/admin/courses');
      return;
    }

    try {
      setLoading(true);
      const fetchedLesson = await lessonService.getLessonById(lessonId);
      const fetchedCourse = await courseService.getCourseById(courseId); // Para verificar el autor del curso

      const isCourseAuthor = user && fetchedCourse.author && fetchedCourse.author._id === user.id;

      if (!isAdmin && !isCourseAuthor) {
        toast.error('No tienes permiso para editar esta lección.');
        navigate(`/admin/courses/${courseId}/edit`);
        return;
      }

      setValue('title', fetchedLesson.title || '');
      setValue('description', fetchedLesson.description || '');
      setValue('order', fetchedLesson.order);
      setCurrentPdfName(fetchedLesson.pdfOriginalName || 'N/A');

    } catch (err) {
      console.error('Error fetching lesson data:', err);
      setError(err.response?.data?.message || 'Error al cargar la lección para edición.');
      toast.error(err.response?.data?.message || 'Error al cargar la lección para edición.');
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId, navigate, user, isAuthenticated, isAllowed, isAdmin, hasRole, setValue]);

  useEffect(() => {
    fetchLessonData();
  }, [fetchLessonData]);

  const onSubmit = async (data) => {
    if (!isAuthenticated || !isAllowed) {
      toast.error('No tienes permiso para editar lecciones.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('order', data.order);
      // No se envía course ni uploadedBy en la actualización a menos que se cambien explícitamente

      if (data.pdfFile && data.pdfFile[0]) {
        formData.append('pdfFile', data.pdfFile[0]);
      }

      await lessonService.updateLesson(lessonId, formData);
      toast.success('Lección actualizada exitosamente.');
      navigate(`/admin/courses/${courseId}/edit`); // Volver a la página de edición del curso
    } catch (err) {
      console.error('Error updating lesson:', err);
      setError(err.response?.data?.message || 'Error al actualizar la lección.');
      toast.error(err.response?.data?.message || 'Error al actualizar la lección.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando lección para edición...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <h1 className="text-3xl font-bold mb-6">Editar Lección</h1>

      <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto border border-border-color">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="title">Título:</label>
            <input type="text" id="title" {...register("title")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="description">Descripción:</label>
            <textarea id="description" {...register("description")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" rows="4"></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="order">Orden:</label>
            <input type="number" id="order" {...register("order")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
            {errors.order && <p className="text-red-500 text-xs mt-1">{errors.order.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="pdfFile">Archivo PDF (actual: {currentPdfName}):</label>
            <input type="file" id="pdfFile" {...register("pdfFile")}
              accept=".pdf"
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-primary file:text-white hover:file:bg-blue-700" />
            {errors.pdfFile && <p className="text-red-500 text-xs mt-1">{errors.pdfFile.message}</p>}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <CustomButton variant="secondary" onClick={() => navigate(`/admin/courses/${courseId}/edit`)} disabled={loading}>Cancelar</CustomButton>
            <CustomButton variant="primary" type="submit" disabled={loading}>
              {loading ? <Loader /> : 'Guardar Cambios'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonEditPage;