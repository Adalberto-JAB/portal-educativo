import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import subjectService from '../../services/subjectService';
import Loader from '../../components/Loader';
import CustomButton from '../../components/CustomButton';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const SubjectManagementPage = () => {
 const navigate = useNavigate();
 const [subjects, setSubjects] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const { hasRole } = useAuth();

 const isAdmin = hasRole(['admin']);

 const fetchSubjects = async () => {
   try {
     setLoading(true);
     const data = await subjectService.getSubjects();
     setSubjects(data);
     setError(null);
   } catch (err) {
     console.error('Error fetching subjects:', err);
     setError('No se pudieron cargar las materias. Por favor, inténtalo de nuevo más tarde.');
     toast.error('Error al cargar las materias.');
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   if (isAdmin) {
     fetchSubjects();
   } else {
     setLoading(false);
     setError('No tienes permiso para ver esta página.');
   }
 }, [isAdmin]);

 const handleDelete = async (id) => {
   if (window.confirm('¿Estás seguro de que quieres eliminar esta materia?')) {
     try {
       setLoading(true);
       await subjectService.deleteSubject(id);
       toast.success('Materia eliminada exitosamente.');
       fetchSubjects(); // Volver a cargar la lista de materias
     } catch (err) {
       console.error('Error deleting subject:', err);
       toast.error(err.response?.data?.message || 'Error al eliminar la materia.');
       setLoading(false);
     }
   }
 };

 if (loading) {
   return (
     <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
       <Loader />
       <p className="mt-4">Cargando materias...</p>
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
       <h1 className="text-3xl font-bold">Gestión de Materias</h1>
       <CustomButton variant="primary" onClick={() => navigate('/admin/subjects/create')}>Crear Nueva Materia</CustomButton>
     </div>

     {subjects.length === 0 ? (
       <div className="text-center text-text-secondary">
         <p>No hay materias disponibles en este momento.</p>
       </div>
     ) : (
       <div className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-color">
         <h2 className="text-xl font-semibold text-text-primary mb-4">Listado de Materias</h2>
         <div className="overflow-x-auto">
           <table className="min-w-full divide-y divide-border-color">
             <thead className="bg-gray-50 dark:bg-gray-700">
               <tr>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                   Nombre
                 </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                   Área de Conocimiento
                 </th>
                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                   Acciones
                 </th>
               </tr>
             </thead>
             <tbody className="bg-bg-secondary divide-y divide-border-color">
               {subjects.map((subject) => (
                 <tr key={subject._id}>
                   <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                     {subject.name}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                     {subject.subjectArea?.name || 'N/A'}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     <a onClick={() => navigate(`/admin/subjects/edit/${subject._id}`)} className="text-accent-primary hover:text-blue-700 mr-3 cursor-pointer">
                       Editar
                     </a>
                     <button
                       onClick={() => handleDelete(subject._id)}
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

export default SubjectManagementPage;
