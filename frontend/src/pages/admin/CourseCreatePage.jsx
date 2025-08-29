import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import subjectService from '../../services/subjectService';
import nivelService from '../../services/nivelService'; // Importar nivelService
import userService from '../../services/userService';
import coverService from '../../services/coverService';
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  title: yup.string().required('El título es requerido'),
  description: yup.string(),
  author: yup.string().required('El autor es requerido'),
  subject: yup.string().required('La materia es requerida'),
  nivel: yup.string().required('El nivel es requerido'),
  isPublished: yup.boolean(),
  isGuestViewable: yup.boolean(),
  coverImage: yup.mixed().nullable(),
});

const CourseCreatePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [niveles, setNiveles] = useState([]); // Estado para niveles
  const [authors, setAuthors] = useState([]);
  const [filePreview, setFilePreview] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isPublished: false,
      isGuestViewable: false,
    }
  });

  const selectedFile = watch("coverImage");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedSubjects = await subjectService.getSubjects();
        const sortedSubjects = [...fetchedSubjects].sort((a, b) => a.name.localeCompare(b.name));
        setSubjects(sortedSubjects);

        const fetchedNiveles = await nivelService.getNiveles();
        setNiveles(fetchedNiveles);

        if (hasRole(['admin'])) {
          const fetchedUsers = await userService.getUsers();
          const availableAuthors = fetchedUsers.filter(u => u.role === 'teacher' || u.role === 'admin');
          setAuthors(availableAuthors);
        } else if (hasRole(['teacher'])) {
          setAuthors([user]);
        }

        if (user && (user.role === 'teacher' || user.role === 'admin')) {
          setValue('author', user.id);
        }

      } catch (err) {
        console.error('Error fetching data for course creation:', err);
        toast.error('Error al cargar datos necesarios para crear el curso.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
        fetchData();
    } else {
        setLoading(false);
    }
  }, [user, isAuthenticated, hasRole, setValue]);

  useEffect(() => {
    if (selectedFile && selectedFile[0]) {
      const file = selectedFile[0];
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [selectedFile]);

  const onSubmit = async (data) => {
    if (!isAuthenticated || !hasRole(['admin', 'teacher'])) {
      toast.error('No tienes permiso para crear cursos.');
      return;
    }

    if (!user || !user.id) {
      toast.error('ID de usuario no disponible. Por favor, intenta recargar la página o iniciar sesión de nuevo.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let coverId = null;

      if (data.coverImage && data.coverImage[0]) {
        const coverFormData = new FormData();
        coverFormData.append('image', data.coverImage[0]);
        coverFormData.append('name', `cover_${Date.now()}`);
        coverFormData.append('isGeneric', 'false');
        coverFormData.append('idUser', user.id);

        const uploadedCover = await coverService.createCover(coverFormData);
        coverId = uploadedCover._id;
      }

      const courseDataToSubmit = {
        ...data,
        cover: coverId || undefined,
      };

      await courseService.createCourse(courseDataToSubmit);
      toast.success('Curso creado exitosamente. Será visible una vez aprobado por un administrador.');
      navigate('/admin/courses');
    } catch (err) {
      console.error('Error creating course:', err);
      toast.error(err.response?.data?.message || 'Error al crear el curso.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando formulario...</p>
      </div>
    );
  }

  if (!isAuthenticated || !hasRole(['admin', 'teacher'])) {
    return (
      <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Acceso Denegado</h1>
        <p className="text-lg">No tienes permiso para crear cursos.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Curso</h1>

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
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="author">Autor:</label>
            <select id="author" {...register("author")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border">
              <option value="">Selecciona un autor</option>
              {authors.map(author => (
                <option key={author._id || author.id} value={author._id || author.id}>{author.name} {author.last_name}</option>
              ))}
            </select>
            {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="subject">Materia:</label>
            <select id="subject" {...register("subject")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border">
              <option value="">Selecciona una materia</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>{subject.name}</option>
              ))}
            </select>
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="nivel">Nivel:</label>
            <select id="nivel" {...register("nivel")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border">
              <option value="">Selecciona un nivel</option>
              {niveles.map(nivel => (
                <option key={nivel._id} value={nivel._id}>{nivel.name}</option>
              ))}
            </select>
            {errors.nivel && <p className="text-red-500 text-xs mt-1">{errors.nivel.message}</p>}
          </div>

          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="coverImage">Imagen de Portada (PNG/JPG opcional):</label>
            <input
              type="file"
              id="coverImage"
              {...register("coverImage")}
              accept=".png, .jpg, .jpeg"
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-primary file:text-white hover:file:bg-blue-700"
            />
            {filePreview && (
              <div className="mt-4">
                <p className="text-sm text-text-secondary mb-2">Previsualización de la imagen:</p>
                <img src={filePreview} alt="Previsualización de Portada" className="max-w-xs h-auto rounded-md shadow-md" />
              </div>
            )}
          </div>

          {hasRole(['admin']) && (
            <>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isPublished" {...register("isPublished")}
                  className="form-checkbox h-5 w-5 text-accent-primary rounded" />
                <label className="text-text-primary text-sm" htmlFor="isPublished">Publicado</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isGuestViewable" {...register("isGuestViewable")}
                  className="form-checkbox h-5 w-5 text-accent-primary rounded" />
                <label className="text-text-primary text-sm" htmlFor="isGuestViewable">Visible para Invitados</label>
              </div>
            </>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <CustomButton type="secondary" onClick={() => navigate('/admin/courses')} disabled={loading}>Cancelar</CustomButton>
            <CustomButton type="primary" type="submit" disabled={loading}>
              {loading ? <Loader /> : 'Crear Curso'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseCreatePage;
