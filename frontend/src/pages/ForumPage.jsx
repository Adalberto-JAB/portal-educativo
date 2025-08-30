import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import forumService from '../services/forumService';
import Loader from '../components/Loader';
import CustomButton from '../components/CustomButton';
import { FaComments, FaBook, FaUser, FaClock } from 'react-icons/fa';

const ForumPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // El servicio ya filtra los posts aprobados para usuarios no-admin
        const fetchedPosts = await forumService.getForumPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError('No se pudieron cargar los posts del foro.');
        console.error('Error fetching forum posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="pt-20 flex justify-center items-center min-h-screen"><Loader /></div>;
  }

  if (error) {
    return <div className="pt-20 text-center text-red-500"><p>{error}</p></div>;
  }

  return (
    <div className="mt-28 p-8 min-h-screen bg-bg-primary text-text-primary">
    <div className="max-w-[1024px] mx-auto">
      <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">Foros de Discusión</h1>
            <p className="text-lg text-text-secondary mb-4 text-start">Participa en discusiones, haz preguntas y comparte conocimientos.</p>
        <div className="flex justify-end-safe mb-8">
          <CustomButton variant="primary" onClick={() => navigate('/forums/create')}>
            Crear Nuevo Post
          </CustomButton>
        </div>

        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map(post => (
              <div 
                key={post._id} 
                className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-color hover:border-accent-primary transition-colors duration-300 cursor-pointer"
                onClick={() => navigate(`/forums/${post._id}`)}
              >
                <h2 className="text-2xl font-bold text-accent-primary mb-2">{post.title}</h2>
                <div className="flex flex-wrap items-center text-sm text-text-secondary gap-x-4 gap-y-1 mb-4">
                  <span className="flex items-center"><FaUser className="mr-2"/> {post.author ? `${post.author.name} ${post.author.last_name}` : 'Anónimo'}</span>
                  <span className="flex items-center"><FaBook className="mr-2"/> {post.subject?.name || 'Materia no especificada'}</span>
                  <span className="flex items-center"><FaClock className="mr-2"/> {new Date(post.createdAt).toLocaleDateString('es-ES')}</span>
                  <span className="flex items-center"><FaComments className="mr-2"/> {post.commentsCount || 0} Comentarios</span>
                </div>
                <p className="text-text-primary truncate">{post.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-text-secondary text-xl">No hay posts en el foro todavía. ¡Sé el primero en crear uno!</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ForumPage;
