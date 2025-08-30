import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import facultadService from '../../services/facultadService';
import Loader from '../../components/Loader';
import CustomButton from '../../components/CustomButton';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';

const FacultadManagementPage = () => {
 const navigate = useNavigate();
 const [facultades, setFacultades] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const { hasRole } = useAuth();

 const isAdmin = hasRole(['admin']);

 const fetchFacultades = async () => {
   try {
     setLoading(true);
     const data = await facultadService.getFacultades();
     setFacultades(data);
     setError(null);
   } catch (err) {
     console.error('Error fetching facultades:', err);
     setError('No se pudieron cargar las facultades. Por favor, inténtalo de nuevo más tarde.');
     toast.error('Error al cargar las facultades.');
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   if (isAdmin) {
     fetchFacultades();
   } else {
     setLoading(false);
     setError('No tienes permiso para ver esta página.');
   }
 }, [isAdmin]);

 const handleDelete = async (id) => {
   if (window.confirm('¿Estás seguro de que quieres eliminar esta facultad?')) {
     try {
       setLoading(true);
       await facultadService.deleteFacultad(id);
       toast.success('Facultad eliminada exitosamente.');
       fetchFacultades(); // Volver a cargar la lista de facultades
     } catch (err) {
       console.error('Error deleting facultad:', err);
       toast.error(err.response?.data?.message || 'Error al eliminar la facultad.');
       setLoading(false);
     }
   }
 };

 if (loading) {
   return (
     <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
       <Loader />
       <p className="mt-4">Cargando facultades...</p>
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
       <h1 className="text-3xl font-bold">Gestión de Facultades</h1>
       <CustomButton variant="primary" onClick={() => navigate('/admin/facultades/create')}>Crear Nueva Facultad</CustomButton>
     </div>

     {facultades.length === 0 ? (
       <div className="text-center text-text-secondary">
         <p>No hay facultades disponibles en este momento.</p>
       </div>
     ) : (
       <div className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-color">
         <h2 className="text-xl font-semibold text-text-primary mb-4">Listado de Facultades</h2>
         <div className="overflow-x-auto">
           <table className="min-w-full divide-y divide-border-color">
             <thead className="bg-gray-50 dark:bg-gray-700">
               <tr>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                   Nombre
                 </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                   Descripción
                 </th>
                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                   Acciones
                 </th>
               </tr>
             </thead>
             <tbody className="bg-bg-secondary divide-y divide-border-color">
               {facultades.map((facultad) => (
                 <tr key={facultad._id}>
                   <td className="px-6 py-4 text-text-primary max-w-40 break-words">
                     {facultad.name}
                   </td>
                   <td className="px-6 py-4 text-text-secondary max-w-2xl break-words">
                     {facultad.description || 'N/A'}
                   </td>
                   <td className="px-6 py-4 text-right text-sm font-medium max-w-16">
                     <a onClick={() => navigate(`/admin/facultades/edit/${facultad._id}`)} className="text-accent-primary hover:text-blue-700 mr-3 cursor-pointer">
                       <FaEdit className="inline-block mr-1" />
                     </a>
                     <button
                       onClick={() => handleDelete(facultad._id)}
                       className="text-red-600 hover:text-red-900"
                     >
                       <FaTrash className="inline-block mr-1" />
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

export default FacultadManagementPage;
