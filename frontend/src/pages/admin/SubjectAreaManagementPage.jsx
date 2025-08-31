import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubjectAreas, deleteSubjectArea } from '../../services/subjectAreaService';
import Loader from '../../components/Loader';
import CustomButton from '../../components/CustomButton';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

const SubjectAreaManagementPage = () => {
  const navigate = useNavigate();
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasRole } = useAuth();

  const isAdmin = hasRole(['admin']);

  const fetchSubjectAreas = async () => {
    try {
      setLoading(true);
      const data = await getAllSubjectAreas();
      setSubjectAreas(data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener las áreas temáticas:', error);
      setError('No se pudieron cargar las áreas temáticas. Por favor, inténtalo de nuevo más tarde.');
      toast.error('Error al cargar las áreas temáticas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(isAdmin){
      fetchSubjectAreas();
    } else {
      setLoading(false);
      setError('No tienes permiso para ver esta página.');
    }
  }, [isAdmin]);

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await deleteSubjectArea(id);
          Swal.fire(
            '¡Eliminada!',
            'El área temática ha sido eliminada.',
            'success'
          )
          fetchSubjectAreas();
        } catch (error) {
          console.error('Error al eliminar el área temática:', error);
          Swal.fire(
            'Error',
            error.response?.data?.message || 'Error al eliminar el área temática.',
            'error'
          )
        } finally {
          setLoading(false);
        }
      }
    })
  };

  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando áreas temáticas...</p>
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
    <div className="mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <div className="max-w-[1024px] mx-auto">
        <h1 className="text-3xl font-bold text-center w-full mb-4">Gestión de Áreas Temáticas</h1>
        <div className="flex justify-end-safe mb-8">
          <CustomButton
            variant="primary"
            onClick={() => navigate("/admin/subject-areas/create")}
          >
            <FaPlus className="inline-block mr-2" /> Crear Nueva Área
          </CustomButton>
        </div>

        {subjectAreas.length === 0 ? (
          <div className="text-center text-text-secondary">
            <p>No hay áreas temáticas disponibles en este momento.</p>
          </div>
        ) : (
          <div className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-color">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Listado de Áreas Temáticas
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-color">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Descripción
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-bg-secondary divide-y divide-border-color">
                  {subjectAreas.map(sa => (
                    <tr key={sa._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-text-primary">{sa.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{sa.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => navigate(`/admin/subject-areas/edit/${sa._id}`)} className="text-accent-primary hover:text-blue-700 mr-4" title="Editar">
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(sa._id)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectAreaManagementPage;
