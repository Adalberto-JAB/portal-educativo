import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import forumService from '../services/forumService';
import commentService from '../services/commentService';
import Loader from '../components/Loader';
import CustomButton from '../components/CustomButton';
import { FaUser, FaCalendar, FaBook } from 'react-icons/fa';

// --- Componente para un solo comentario ---
const CommentItem = ({ comment }) => {
  const avatarUrl = comment.author?.profilePictureURL || 'https://api.dicebear.com/8.x/adventurer/svg?seed=default-seed&sex=male';

  return (
    <div className="flex items-start space-x-4 py-4">
      <img src={avatarUrl} alt="Avatar del autor" className="w-12 h-12 rounded-full bg-bg-tertiary" />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-text-primary">{comment.author ? `${comment.author.name} ${comment.author.last_name}` : 'Anónimo'}</span>
          <span className="text-xs text-text-secondary">{new Date(comment.createdAt).toLocaleString('es-ES')}</span>
        </div>
        <p className="text-text-secondary mt-1">{comment.text}</p>
      </div>
    </div>
  );
};

// --- Componente para el formulario de comentarios ---
const validationSchema = yup.object().shape({
  text: yup.string().required('El comentario no puede estar vacío.').min(3, 'El comentario debe tener al menos 3 caracteres.'),
});

const CommentForm = ({ postId, onCommentPosted }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Debes iniciar sesión para comentar.');
      return;
    }
    setIsSubmitting(true);
    try {
      const commentData = { ...data, author: user.id, forumPost: postId };
      await commentService.createComment(commentData);
      toast.success('Comentario enviado. Estará visible una vez aprobado.');
      reset();
      onCommentPosted(); // Llama al callback para refrescar la lista
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al enviar el comentario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <textarea
        {...register('text')}
        rows="4"
        className="w-full p-3 border rounded-md bg-input-bg text-text-primary border-input-border"
        placeholder="Escribe tu comentario..."
      />
      {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text.message}</p>}
      <div className="flex justify-end mt-4">
        <CustomButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader size="sm" /> : 'Enviar Comentario'}
        </CustomButton>
      </div>
    </form>
  );
};

// --- Página de Detalle del Post ---
const ForumPostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      const commentsData = await commentService.getComments(id);
      setComments(commentsData);
    } catch (err) {
      // No mostrar error si solo fallan los comentarios
      console.error('Error fetching comments:', err);
    }
  }, [id]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postData = await forumService.getForumPostById(id);
        setPost(postData);
        await fetchComments();
      } catch (err) {
        setError('No se pudo cargar el post. Es posible que no esté aprobado o no exista.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, fetchComments]);

  if (loading) {
    return <div className="pt-20 flex justify-center items-center min-h-screen"><Loader /></div>;
  }

  if (error) {
    return <div className="pt-20 text-center text-red-500"><p>{error}</p></div>;
  }

  if (!post) {
    return <div className="pt-20 text-center text-text-secondary">Post no encontrado.</div>;
  }

  return (
    <div className="pt-20 p-4 md:p-8 min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-4xl mx-auto bg-bg-secondary p-6 md:p-8 rounded-lg shadow-lg border border-border-color">
        
        <div className="border-b border-border-color pb-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-text-secondary gap-x-4 gap-y-2">
            <span className="flex items-center"><FaUser className="mr-2"/> {post.author ? `${post.author.name} ${post.author.last_name}` : 'Anónimo'}</span>
            <span className="flex items-center"><FaCalendar className="mr-2"/> {new Date(post.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {post.subject && <span className="flex items-center"><FaBook className="mr-2"/> <Link to={`/forums/subject/${post.subject._id}`} className="hover:underline">{post.subject.name}</Link></span>}
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-text-primary text-lg" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />

        <div className="mt-8 border-t border-border-color pt-6">
          <h2 className="text-2xl font-bold mb-4">Comentarios ({comments.length})</h2>
          
          <CommentForm postId={id} onCommentPosted={fetchComments} />

          <div className="mt-6 space-y-2 divide-y divide-border-color">
            {comments.length > 0 ? (
              comments.map(comment => <CommentItem key={comment._id} comment={comment} />)
            ) : (
              <p className="text-text-secondary py-4">No hay comentarios todavía. ¡Sé el primero en comentar!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForumPostDetailPage;
