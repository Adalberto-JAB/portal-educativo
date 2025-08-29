import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  documentFile: yup.mixed().required('El archivo es requerido'),
});

const DocumentationCreatePage = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState([]);
  const [filePreview, setFilePreview] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const isAllowed = hasRole(['admin', 'teacher', 'student']);
  const selectedFile = watch("documentFile");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await userService.getUsers();
        const availableAuthors = fetchedUsers.filter(u => u.role === 'teacher' || u.role === 'admin' || u.role === 'student');
        setAuthors(availableAuthors);

        if (user && (user.role === 'teacher' || user.role === 'admin' || user.role === 'student')) {
          setValue('author', user.id);
        }
      } catch (err) {
        console.error('Error fetching data for documentation creation:', err);
        toast.error('Error al cargar datos necesarios para crear el documento.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, setValue]);

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
      toast.error('No tienes permiso para crear documentos.');
      return;
    }

    if (!user || !user.id) {
      toast.error('ID de usuario no disponible. Por favor, intenta recargar la página o iniciar sesión de nuevo.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const docFormData = new FormData();
      docFormData.append('file', data.documentFile[0]);
      docFormData.append('title', data.title);
      docFormData.append('description', data.description);
      docFormData.append('author', data.author);
      docFormData.append('isApproved', hasRole(['admin']) ? 'true' : 'false');

      await documentationService.createDocumentation(docFormData);
      toast.success('Documento creado exitosamente. Será visible una vez aprobado por un administrador.');
      navigate('/documentation');
    } catch (err) {
      console.error('Error creating documentation:', err);
      toast.error(err.response?.data?.message || 'Error al crear el documento.');
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

  if (!isAllowed) {
    return (
      <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Acceso Denegado</h1>
        <p className="text-lg">No tienes permiso para crear documentos.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Documento</h1>

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
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="documentFile">Archivo (Imagen, Video, PDF, TXT):</label>
            <input
              type="file"
              id="documentFile"
              {...register("documentFile")}
              accept="image/*,video/*,application/pdf,text/plain"
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-primary file:text-white hover:file:bg-blue-700"
            />
            {errors.documentFile && <p className="text-red-500 text-xs mt-1">{errors.documentFile.message}</p>}
            {filePreview && (
              <div className="mt-4">
                <p className="text-sm text-text-secondary mb-2">Previsualización del archivo:</p>
                <img src={filePreview} alt="Previsualización" className="max-w-xs h-auto rounded-md shadow-md" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <CustomButton type="secondary" onClick={() => navigate('/documentation')} disabled={loading}>Cancelar</CustomButton>
            <CustomButton type="primary" type="submit" disabled={loading}>
              {loading ? <Loader /> : 'Crear Documento'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentationCreatePage;
