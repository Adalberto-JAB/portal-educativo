import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import forumService from '../../services/forumService';
import Loader from '../../components/Loader';
import CustomButton from '../../components/CustomButton';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const ForumManagementPage = () => {
 const navigate = useNavigate();
 const [forumPosts, setForumPosts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const { hasRole, user } = useAuth();

 const isAllowed = hasRole(['admin', 'teacher']); // Admin y profesores pueden gestionar posts
 const isAdmin = hasRole(['admin']); // Solo admin puede aprobar

 const fetchForumPosts = async () => {
   try {
     setLoading(true);
     const data = await forumService.getForumPosts();
     
     let filteredData = data;
     if (hasRole(['teacher']) && !isAdmin) {
       // Profesores solo ven sus propios posts y los que necesitan aprobación
       filteredData = data.filter(post => 
         (post.author && post.author._id === user.id) || !post.isApproved
       );
     }
     // Admin ve todos los posts, no necesita filtrar

     setForumPosts(filteredData);
     setError(null);
   } catch (err) {
     console.error('Error fetching forum posts:', err);
     setError('No se pudieron cargar los posts del foro. Por favor, inténtalo de nuevo más tarde.');
     toast.error('Error al cargar los posts del foro.');
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   if (isAllowed) {
     fetchForumPosts();
   } else {
     setLoading(false);
     setError('No tienes permiso para ver esta página.');
   }
 }, [isAllowed, isAdmin, user]);

 const handleDelete = async (id) => {
   if (window.confirm('¿Estás seguro de que quieres eliminar este post del foro?')) {
     try {
       setLoading(true);
       await forumService.deleteForumPost(id);
       toast.success('Post del foro eliminado exitosamente.');
       fetchForumPosts();
     } catch (err) {
       console.error('Error deleting forum post:', err);
       toast.error(err.response?.data?.message || 'Error al eliminar el post del foro.');
       setLoading(false);
     }
   }
 };

 const handleApproveToggle = async (id, currentStatus) => {
   try {
     setLoading(true);
     await forumService.approveForumPost(id, !currentStatus);
     toast.success(`Post del foro ${!currentStatus ? 'aprobado' : 'desaprobado'} exitosamente.`);
     fetchForumPosts();
   } catch (err) {
     console.error('Error toggling forum post approval:', err);
     toast.error(err.response?.data?.message || 'Error al cambiar el estado de aprobación del post.');
     setLoading(false);
   }
 };

 if (loading) {
   return (
     <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
       <Loader />
       <p className="mt-4">Cargando posts del foro...</p>
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
       <p className="text-lg">No tienes permiso para ver esta página.</p>
     </div>
   );
 }

 return (
   <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
     <div className="flex justify-between items-center mb-8">
       <h1 className="text-3xl font-bold">Gestión de Foros</h1>
       {/* Enlace a la página de creación de posts si es necesario, aunque los posts se crean desde el foro principal */}
       {/* <a onClick={() => navigate('/forums/create')}>
         <CustomButton type="primary">Crear Nuevo Post</CustomButton>
       </a> */}
     </div>

     {forumPosts.length === 0 ? (
       <div className="text-center text-text-secondary">
         <p>No hay posts de foro para gestionar en este momento.</p>
       </div>
     ) : (
       <div className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-color">
         <h2 className="text-xl font-semibold text-text-primary mb-4">Listado de Posts del Foro</h2>
         <div className="overflow-x-auto">
           <table className="min-w-full divide-y divide-border-color">
             <thead className="bg-gray-50 dark:bg-gray-700">
               <tr>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                   Título
                 </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                   Autor
                 </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                   Aprobado
                 </th>
                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                   Acciones
                 </th>
               </tr>
             </thead>
             <tbody className="bg-bg-secondary divide-y divide-border-color">
               {forumPosts.map((post) => (
                 <tr key={post._id}>
                   <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                     {post.title}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                     {post.author ? `${post.author.name} ${post.author.last_name}` : 'Desconocido'}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                       {post.isApproved ? 'Sí' : 'No'}
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     <a onClick={() => navigate(`/admin/forums-management/edit/${post._id}`)} className="text-accent-primary hover:text-blue-700 mr-3 cursor-pointer">
                       Editar
                     </a>
                     {isAdmin && (
                       <button
                         onClick={() => handleApproveToggle(post._id, post.isApproved)}
                         className={`mr-3 ${post.isApproved ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                       >
                         {post.isApproved ? 'Desaprobar' : 'Aprobar'}
                       </button>
                     )}
                     <button
                       onClick={() => handleDelete(post._id)}
                       className="text-red-600 hover:text-red-900"
                     >
                       Eliminar
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
     )}
   </div>
 );
};

export default ForumManagementPage;
