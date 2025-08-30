import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import carreraService from '../../services/carreraService';
import Loader from '../../components/Loader';
import CustomButton from '../../components/CustomButton';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CarreraManagementPage = () => {
 const navigate = useNavigate();
 const [carreras, setCarreras] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const { hasRole } = useAuth();

 const isAdmin = hasRole(['admin']);

 const fetchCarreras = async () => {
   try {
     setLoading(true);
     const data = await carreraService.getCarreras();
     setCarreras(data);
     setError(null);
   } catch (err) {
     console.error('Error fetching carreras:', err);
     setError('No se pudieron cargar las carreras. Por favor, inténtalo de nuevo más tarde.');
     toast.error('Error al cargar las carreras.');
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   if (isAdmin) {
     fetchCarreras();
   } else {
     setLoading(false);
     setError('No tienes permiso para ver esta página.');
   }
 }, [isAdmin]);

 const handleDelete = async (id) => {
   if (window.confirm('¿Estás seguro de que quieres eliminar esta carrera?')) {
     try {
       setLoading(true);
       await carreraService.deleteCarrera(id);
       toast.success('Carrera eliminada exitosamente.');
       fetchCarreras(); // Volver a cargar la lista de carreras
     } catch (err) {
       console.error('Error deleting carrera:', err);
       toast.error(err.response?.data?.message || 'Error al eliminar la carrera.');
       setLoading(false);
     }
   }
 };

 if (loading) {
   return (
     <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
       <Loader />
       <p className="mt-4">Cargando carreras...</p>
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
       <h1 className="text-3xl font-bold">Gestión de Carreras</h1>
       <CustomButton variant="primary" onClick={() => navigate('/admin/carreras/create')}>Crear Nueva Carrera</CustomButton>
     </div>

     {carreras.length === 0 ? (
       <div className="text-center text-text-secondary">
         <p>No hay carreras disponibles en este momento.</p>
       </div>
     ) : (
       <div className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-color overflow-x-auto">
         <h2 className="text-xl font-semibold text-text-primary mb-4">Listado de Carreras</h2>
         <table className="w-full table-auto divide-y divide-border-color">
           <thead className="bg-gray-50 dark:bg-gray-700">
             <tr>
               <th scope="col" className="w-1/4 px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                 Nombre
               </th>
               <th scope="col" className="w-1/2 px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                 Descripción
               </th>
               <th scope="col" className="w-1/4 px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                 Facultad
               </th>
               <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                 Acciones
               </th>
             </tr>
           </thead>
           <tbody className="bg-bg-secondary divide-y divide-border-color">
             {carreras.map((carrera) => (
               <tr key={carrera._id}>
                 <td className="px-6 py-4 text-text-primary break-words">
                   {carrera.name}
                 </td>
                 <td className="px-6 py-4 text-text-secondary break-words">
                   {carrera.description || 'N/A'}
                 </td>
                 <td className="px-6 py-4 text-text-primary break-words">
                   {carrera.facultad ? carrera.facultad.name : 'N/A'}
                 </td>
                 <td className="px-6 py-4 text-right text-sm font-medium">
                   <button onClick={() => navigate(`/admin/carreras/edit/${carrera._id}`)} className="text-accent-primary hover:text-blue-700 mr-4" title="Editar">
                     <FaEdit size={18} />
                   </button>
                   <button
                     onClick={() => handleDelete(carrera._id)}
                     className="text-red-600 hover:text-red-900"
                     title="Eliminar"
                   >
                     <FaTrash size={18} />
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     )}
   </div>
 );
};

export default CarreraManagementPage;
