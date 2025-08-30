import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import subjectService from '../../services/subjectService';
import nivelService from '../../services/nivelService';
import userService from '../../services/userService';
import coverService from '../../services/coverService';
import lessonService from '../../services/lessonService'; 
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'; 
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaEye, FaEdit, FaTrash, FaChalkboardTeacher } from 'react-icons/fa'; 

const validationSchema = yup.object().shape({
  title: yup.string().required('El título es requerido'),
  description: yup.string(),
  author: yup.string(), // No longer required for teachers
  subject: yup.string().required('La materia es requerida'),
  nivel: yup.string().required('El nivel es requerido'),
  isPublished: yup.boolean(),
  isGuestViewable: yup.boolean(),
  isApproved: yup.boolean(),
  coverImage: yup.mixed().nullable(),
});

const CourseEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [lessons, setLessons] = useState([]); // Added
  const [filePreview, setFilePreview] = useState(null);
  const [currentCoverUrl, setCurrentCoverUrl] = useState('');
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const isAllowed = hasRole(['admin', 'teacher']);
  const isAdmin = hasRole(['admin']);

  const selectedFile = watch("coverImage");

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedCourse = await courseService.getCourseById(id);
      const isCourseAuthor = user && fetchedCourse.author && fetchedCourse.author._id === user.id;

      if (hasRole(['teacher']) && !isAdmin && !isCourseAuthor) {
        toast.error('No tienes permiso para editar este curso.');
        navigate('/my-courses');
        return;
      }

      setValue('title', fetchedCourse.title || '');
      setValue('description', fetchedCourse.description || '');
      setValue('author', fetchedCourse.author?._id || '');
      setValue('subject', fetchedCourse.subject?._id || '');
      setValue('nivel', fetchedCourse.nivel?._id || '');
      setValue('isPublished', fetchedCourse.isPublished || false);
      setValue('isGuestViewable', fetchedCourse.isGuestViewable || false);
      setValue('isApproved', fetchedCourse.isApproved || false);

      if (fetchedCourse.cover) {
        setCurrentCoverUrl(`${import.meta.env.VITE_BACKEND_API_URL}/covers/${fetchedCourse.cover._id}`);
//        setCurrentCoverUrl(`http://localhost:5000/api/covers/${fetchedCourse.cover._id}`);
      }

      const [fetchedSubjects, fetchedNiveles] = await Promise.all([
        subjectService.getSubjects(),
        nivelService.getNiveles()
      ]);

      const sortedSubjects = [...fetchedSubjects].sort((a, b) => a.name.localeCompare(b.name));
      setSubjects(sortedSubjects);
      setNiveles(fetchedNiveles);

      if (isAdmin) {
        const fetchedUsers = await userService.getUsers();
        const availableAuthors = fetchedUsers.filter(u => u.role === 'teacher' || u.role === 'admin');
        setAuthors(availableAuthors);
      }

      const lessonsData = await lessonService.getLessons(id);
      setLessons(lessonsData);

    } catch (err) {
      console.error('Error fetching data for course edit:', err);
      toast.error('Error al cargar datos del curso para edición.');
      setError('No se pudo cargar el curso para edición.');
    } finally {
      setLoading(false);
    }
  }, [id, isAdmin, user, navigate, hasRole, setValue]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

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
    if (!isAllowed) {
      toast.error('No tienes permiso para modificar cursos.');
      return;
    }

    setLoading(true);
    try {
      let coverId = watch('cover');

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

      await courseService.updateCourse(id, courseDataToSubmit);
      toast.success('Curso actualizado exitosamente.');
      navigate('/admin/courses');
    } catch (err) {
      console.error('Error updating course:', err);
      toast.error(err.response?.data?.message || 'Error al actualizar el curso.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = useCallback((lessonId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡elimínalo!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await lessonService.deleteLesson(lessonId);
          toast.success('Lección eliminada exitosamente.');
          // Refresh lessons list
          const updatedLessons = await lessonService.getLessons(id);
          setLessons(updatedLessons);
        } catch (err) {
          toast.error(err.response?.data?.message || 'Error al eliminar la lección.');
        }
      }
    });
  }, [id]); // Added id to dependencies

  const canManageLessons = isAdmin || (user && user.id === watch('author')); // Simplified access check

  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando curso para edición...</p>
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

  if (!isAllowed) {
    return (
      <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Acceso Denegado</h1>
        <p className="text-lg">No tienes permiso para editar cursos.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <h1 className="text-3xl font-bold mb-6">Editar Curso</h1>

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
          {isAdmin && (
            <div>
              <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="author">Autor:</label>
              <select id="author" {...register("author")}
                className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border">
                <option value="">Selecciona un autor</option>
                {authors.map(author => (
                  <option key={author._id} value={author._id}>{author.name} {author.last_name}</option>
                ))}
              </select>
              {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
            </div>
          )}
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
            {(filePreview || currentCoverUrl) && (
              <div className="mt-4">
                <p className="text-sm text-text-secondary mb-2">Previsualización de la imagen:</p>
                <img src={filePreview || currentCoverUrl} alt="Previsualización de Portada" className="max-w-xs h-auto rounded-md shadow-md" />
              </div>
            )}
          </div>

          {isAdmin && (
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
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isApproved" {...register("isApproved")}
                  className="form-checkbox h-5 w-5 text-accent-primary rounded" />
                <label className="text-text-primary text-sm" htmlFor="isApproved">Aprobado por Admin</label>
              </div>
            </>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <CustomButton variant="secondary" onClick={() => navigate('/admin/courses')} disabled={loading}>Cancelar</CustomButton>
            <CustomButton variant="primary" type="submit" disabled={loading}>
              {loading ? <Loader /> : 'Guardar Cambios'}
            </CustomButton>
          </div>
        </form>

        {/* Lessons Section */}
        <div className="mt-8 border-t border-border-color pt-6">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Lecciones del Curso</h2>
          
          {canManageLessons && (
            <div className="mb-4">
              <CustomButton variant="primary" onClick={() => navigate(`/admin/courses/${id}/lessons/create`)}>
                <FaChalkboardTeacher className="mr-2" /> Añadir Nueva Lección
              </CustomButton>
            </div>
          )}

          {lessons.length === 0 ? (
            <p className="text-text-secondary">No hay lecciones para este curso aún.</p>
          ) : (
            <ul className="space-y-3">
              {lessons.map(lesson => (
                <li key={lesson._id} className="bg-bg-primary p-4 rounded-lg shadow-sm border border-border-color flex items-center justify-between">
                  <span className="text-text-primary font-medium">{lesson.order}. {lesson.title}</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate(`/lessons/${lesson._id}`)}
                      className="text-blue-500 hover:text-blue-700 text-xl"
                      title="Ver Lección"
                    >
                      <FaEye />
                    </button>
                    {canManageLessons && (
                      <>
                        <button
                          onClick={() => navigate(`/admin/courses/${id}/lessons/edit/${lesson._id}`)}
                          className="text-yellow-500 hover:text-yellow-700 text-xl"
                          title="Editar Lección"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson._id)}
                          className="text-red-500 hover:text-red-700 text-xl"
                          title="Eliminar Lección"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEditPage;