import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import documentationService from '../../services/documentationService';
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
  description: yup.string(),
  author: yup.string().required('El autor es requerido'),
  isApproved: yup.boolean(),
  documentFile: yup.mixed().nullable(),
});

const DocumentationEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
  const [currentFilePath, setCurrentFilePath] = useState('');
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const isAllowed = hasRole(['admin', 'teacher']);
  const isAdmin = hasRole(['admin']);

  const selectedFile = watch("documentFile");

  useEffect(() => {
    const fetchData = async () => {
      if (!isAllowed) {
        setLoading(false);
        toast.error('No tienes permiso para editar documentos.');
        return;
      }
      try {
        setLoading(true);
        const fetchedDoc = await documentationService.getDocumentationById(id);

        if (hasRole(['teacher']) && !isAdmin && fetchedDoc.author._id !== user.id) {
          toast.error('No tienes permiso para editar este documento.');
          navigate('/admin/documentation');
          return;
        }

        setValue('title', fetchedDoc.title || '');
        setValue('description', fetchedDoc.description || '');
        setValue('author', fetchedDoc.author?._id || '');
        setValue('isApproved', fetchedDoc.isApproved || false);
        setCurrentFilePath(fetchedDoc.filePath); 

        const fetchedUsers = await userService.getUsers();
        const availableAuthors = fetchedUsers.filter(u => u.role === 'teacher' || u.role === 'admin');
        setAuthors(availableAuthors);

      } catch (err) {
        console.error('Error fetching data for documentation edit:', err);
        toast.error('Error al cargar datos del documento para edición.');
        setError('No se pudo cargar el documento para edición.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAllowed, isAdmin, user, navigate, hasRole, setValue]);

  useEffect(() => {
    if (selectedFile && selectedFile[0]) {
      const file = selectedFile[0];
      const fileType = file.type;
      if (fileType.startsWith('image/') || fileType.startsWith('video/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    } else {
      setFilePreview(null);
    }
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [selectedFile, filePreview]);

  const onSubmit = async (data) => {
    if (!isAllowed) {
      toast.error('No tienes permiso para modificar documentos.');
      return;
    }

    setLoading(true);
    try {
      const docFormData = new FormData();
      docFormData.append('title', data.title);
      docFormData.append('description', data.description);
      docFormData.append('author', data.author);
      docFormData.append('isApproved', isAdmin ? data.isApproved : false);

      if (data.documentFile && data.documentFile[0]) {
        docFormData.append('file', data.documentFile[0]);
      }

      await documentationService.updateDocumentation(id, docFormData);
      toast.success('Documento actualizado exitosamente.');
      navigate('/admin/documentation');
    } catch (err) {
      console.error('Error updating documentation:', err);
      toast.error(err.response?.data?.message || 'Error al actualizar el documento.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando documento para edición...</p>
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
        <p className="text-lg">No tienes permiso para editar documentos.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <h1 className="text-3xl font-bold mb-6">Editar Documento</h1>

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
                <option key={author._id} value={author.id}>{author.name} {author.last_name}</option>
              ))}
            </select>
            {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
          </div>
          
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="documentFile">Archivo (Imagen, Video, PDF, TXT) - Opcional:</label>
            <input
              type="file"
              id="documentFile"
              {...register("documentFile")}
              accept="image/*,video/*,application/pdf,text/plain"
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-primary file:text-white hover:file:bg-blue-700"
            />
            {(filePreview || currentFilePath) && (
              <div className="mt-4">
                <p className="text-sm text-text-secondary mb-2">Archivo actual / Previsualización:</p>
                {filePreview ? (
                  <img src={filePreview} alt="Previsualización" className="max-w-xs h-auto rounded-md shadow-md" />
                ) : (
                  <p className="text-text-secondary">Archivo actual: <a href={`${import.meta.env.VITE_BACKEND_API_URL}/documentation/file/${id}`} target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">{currentFilePath.split('/').pop()}</a></p>
                )}
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isApproved" {...register("isApproved")}
                className="form-checkbox h-5 w-5 text-accent-primary rounded" />
              <label className="text-text-primary text-sm" htmlFor="isApproved">Aprobado por Admin</label>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <CustomButton type="secondary" onClick={() => navigate('/admin/documentation')} disabled={loading}>Cancelar</CustomButton>
            <CustomButton type="primary" type="submit" disabled={loading}>
              {loading ? <Loader /> : 'Guardar Cambios'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentationEditPage;
