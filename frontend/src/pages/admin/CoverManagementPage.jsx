import React, { useEffect, useState } from 'react';
import coverService from '../../services/coverService';
import Loader from '../../components/Loader';
import CustomButton from '../../components/CustomButton';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const CoverManagementPage = () => {
 const [covers, setCovers] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const { hasRole } = useAuth();

 const isAdmin = hasRole(['admin']);

 const fetchCovers = async () => {
   try {
     setLoading(true);
     const data = await coverService.getCovers();
     setCovers(data);
     setError(null);
   } catch (err) {
     console.error('Error fetching covers:', err);
     setError('No se pudieron cargar las portadas. Por favor, inténtalo de nuevo más tarde.');
     toast.error('Error al cargar las portadas.');
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   if (isAdmin) {
     fetchCovers();
   } else {
     setLoading(false);
     setError('No tienes permiso para ver esta página.');
   }
 }, [isAdmin]);

 const handleDelete = async (id) => {
   if (window.confirm('¿Estás seguro de que quieres eliminar esta portada?')) {
     try {
       setLoading(true);
       await coverService.deleteCover(id);
       toast.success('Portada eliminada exitosamente.');
       fetchCovers(); // Volver a cargar la lista de portadas
     } catch (err) {
       console.error('Error deleting cover:', err);
       toast.error(err.response?.data?.message || 'Error al eliminar la portada.');
       setLoading(false);
     }
   }
 };

 if (loading) {
   return (
     <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
       <Loader />
       <p className="mt-4">Cargando portadas...</p>
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

 if (!isAdmin) {
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
       <h1 className="text-3xl font-bold">Gestión de Portadas</h1>
       {/* La creación de portadas se hace principalmente a través de la creación de cursos/documentos */}
       {/* <Link to="/admin/covers/create">
         <CustomButton type="primary">Subir Nueva Portada</CustomButton>
       </Link> */}
     </div>

     {covers.length === 0 ? (
       <div className="text-center text-text-secondary">
         <p>No hay portadas disponibles en este momento.</p>
       </div>
     ) : (
       <div className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-color">
         <h2 className="text-xl font-semibold text-text-primary mb-4">Listado de Portadas</h2>
         <div className="overflow-x-auto">
           <table className="min-w-full divide-y divide-border-color">
             <thead className="bg-gray-50 dark:bg-gray-700">
               <tr>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                   ID
                 </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                   Nombre
                 </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                   Imagen
                 </th>
                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                   Acciones
                 </th>
               </tr>
             </thead>
             <tbody className="bg-bg-secondary divide-y divide-border-color">
               {covers.map((cover) => (
                 <tr key={cover._id}>
                   <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                     {cover._id}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                     {cover.name || 'N/A'}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <img
                       src={`${import.meta.env.VITE_BACKEND_API_URL}/covers/${cover._id}`}
                       alt={cover.name || 'Portada'}
                       className="h-16 w-16 object-cover rounded-md"
                       onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/64x64/cccccc/333333?text=No+Image'; }}
                     />
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     <button
                       onClick={() => handleDelete(cover._id)}
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

export default CoverManagementPage;
