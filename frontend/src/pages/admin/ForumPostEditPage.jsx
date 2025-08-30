import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import forumService from '../../services/forumService';
import userService from '../../services/userService';
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  title: yup.string().required('El título es requerido'),
  content: yup.string().required('El contenido es requerido'),
  author: yup.string().required('El autor es requerido'),
  isApproved: yup.boolean(),
});

const ForumPostEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const isAllowed = hasRole(['admin', 'teacher']);
  const isAdmin = hasRole(['admin']);

  const isApproved = watch('isApproved');

  useEffect(() => {
    const fetchData = async () => {
      if (!isAllowed) {
        setLoading(false);
        toast.error('No tienes permiso para editar posts del foro.');
        return;
      }
      try {
        setLoading(true);
        const fetchedPost = await forumService.getForumPostById(id);

        if (hasRole(['teacher']) && !isAdmin && fetchedPost.author._id !== user.id) {
          toast.error('No tienes permiso para editar este post del foro.');
          navigate('/admin/forums-management');
          return;
        }

        setValue('title', fetchedPost.title || '');
        setValue('content', fetchedPost.content || '');
        setValue('author', fetchedPost.author?._id || '');
        setValue('isApproved', fetchedPost.isApproved || false);

        const fetchedUsers = await userService.getUsers();
        const availableAuthors = fetchedUsers.filter(u => u.role === 'teacher' || u.role === 'admin' || u.role === 'student');
        setAuthors(availableAuthors);

      } catch (err) {
        console.error('Error fetching data for forum post edit:', err);
        toast.error('Error al cargar datos del post para edición.');
        setError(err.response?.data?.message || 'No se pudo cargar el post para edición.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAllowed, isAdmin, user, navigate, hasRole, setValue]);

  const onSubmit = async (data) => {
    if (!isAllowed) {
      toast.error('No tienes permiso para modificar posts del foro.');
      return;
    }

    setLoading(true);
    try {
      const postDataToSubmit = {
        ...data,
        isApproved: isAdmin ? data.isApproved : false,
      };

      await forumService.updateForumPost(id, postDataToSubmit);
      toast.success('Post del foro actualizado exitosamente.');
      navigate('/admin/forums-management');
    } catch (err) {
      console.error('Error updating forum post:', err);
      toast.error(err.response?.data?.message || 'Error al actualizar el post.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando post del foro para edición...</p>
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
        <p className="text-lg">No tienes permiso para editar posts del foro.</p>
      </div>
    );
  }

  return (
    <div className="mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <h1 className="text-3xl font-bold mb-6">Editar Post del Foro</h1>

      <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto border border-border-color">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="title">Título:</label>
            <input type="text" id="title" {...register("title")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="content">Contenido:</label>
            <textarea id="content" {...register("content")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" rows="8"></textarea>
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="author">Autor:</label>
            <select id="author" {...register("author")}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border">
              <option value="">Selecciona un autor</option>
              {authors.map(author => (
                <option key={author._id} value={author.id}>{author.name} {author.last_name}</option>
              ))}
            </select>
            {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
          </div>
          
          {isAdmin && (
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isApproved" {...register("isApproved")}
                className="form-checkbox h-5 w-5 text-accent-primary rounded" />
              <label className="text-text-primary text-sm" htmlFor="isApproved">Aprobado por Admin</label>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <CustomButton variant="secondary" onClick={() => navigate('/admin/forums-management')} disabled={loading}>Cancelar</CustomButton>
            <CustomButton variant="primary" type="submit" disabled={loading}>
              {loading ? <Loader /> : 'Guardar Cambios'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForumPostEditPage;
