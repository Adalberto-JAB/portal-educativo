import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import conferenceService from "../../services/conferenceService";
import Loader from "../../components/Loader";
import CustomButton from "../../components/CustomButton";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  FaEye,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus
} from "react-icons/fa";
import Swal from "sweetalert2";

const ConferenceManagementPage = () => {
  const navigate = useNavigate();
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasRole } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isAllowed = hasRole(["admin", "teacher"]);
  const isAdmin = hasRole(["admin"]);

  const fetchConferences = async () => {
    try {
      setLoading(true);
      const data = await conferenceService.getConferences();
      const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));
      setConferences(sortedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching conferences:", err);
      setError(
        "No se pudieron cargar los congresos. Por favor, inténtalo de nuevo más tarde."
      );
      toast.error("Error al cargar los congresos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAllowed) {
      fetchConferences();
    } else {
      setLoading(false);
      setError("No tienes permiso para ver esta página.");
    }
  }, [isAllowed]);

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
          await conferenceService.deleteConference(id);
          Swal.fire(
            '¡Eliminado!',
            'El congreso ha sido eliminado.',
            'success'
          )
          fetchConferences();
        } catch (err) {
          console.error("Error deleting conference:", err);
          Swal.fire(
            'Error',
            err.response?.data?.message || "Error al eliminar el congreso.",
            'error'
          )
        } finally {
          setLoading(false);
        }
      }
    })
  };

  const handleApproveToggle = (id, currentStatus) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas ${currentStatus ? "desaprobar" : "aprobar"} este congreso?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await conferenceService.approveConference(id, !currentStatus);
          Swal.fire(
            '¡Actualizado!',
            `El congreso ha sido ${!currentStatus ? "aprobado" : "desaprobado"}.`,
            'success'
          )
          fetchConferences();
        } catch (err) {
          console.error("Error toggling conference approval:", err);
          Swal.fire(
            'Error',
            err.response?.data?.message || "Error al cambiar el estado de aprobación.",
            'error'
          )
        } finally {
          setLoading(false);
        }
      }
    })
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = conferences.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(conferences.length / itemsPerPage);

  if (loading) {
    return (
      <div className="mt-28 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando congresos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
          Acceso Denegado
        </h1>
        <p className="text-lg">No tienes permiso para ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <div className="max-w-[1024px] mx-auto">
        <h1 className="text-3xl font-bold text-center w-full mb-4">
          Gestión de Congresos
        </h1>
        <div className="flex justify-end-safe mb-8">
          <CustomButton
            variant="primary"
            className="cursor-pointer"
            onClick={() => navigate("/admin/conferences/create")}
          >
            <FaPlus className="inline-block mr-2" /> Crear Nuevo Congreso
          </CustomButton>
        </div>

        {conferences.length === 0 ? (
          <div className="text-center text-text-secondary">
            <p>No hay congresos para gestionar en este momento.</p>
          </div>
        ) : (
          <div className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-color">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-text-primary">
                Listado de Congresos
                </h2>
                <div className="flex items-center">
                    <label htmlFor="itemsPerPage" className="mr-2">Items por página:</label>
                    <select
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1); // Reset to first page
                        }}
                        className="bg-bg-secondary border border-border-color rounded-md p-1"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-color">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Título
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Fecha
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Aprobado
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-bg-secondary divide-y divide-border-color">
                  {currentItems.map((conf) => (
                    <tr key={conf._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                        {conf.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                        {new Date(conf.startDate).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            conf.isApproved
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {conf.isApproved ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center space-x-4">
                          <button
                            onClick={() =>
                              navigate(`/admin/conferences/edit/${conf._id}`)
                            }
                            className="text-gray-400 hover:text-accent-primary"
                            title="Ver/Editar"
                          >
                            <FaEye />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() =>
                                handleApproveToggle(conf._id, conf.isApproved)
                              }
                              className={
                                conf.isApproved
                                  ? "text-yellow-500 hover:text-yellow-700"
                                  : "text-green-500 hover:text-green-700"
                              }
                              title={conf.isApproved ? "Desaprobar" : "Aprobar"}
                            >
                              {conf.isApproved ? (
                                <FaTimesCircle />
                              ) : (
                                <FaCheckCircle />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(conf._id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div>
                    <p className="text-sm text-text-secondary">
                        Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, conferences.length)} de {conferences.length} congresos
                    </p>
                </div>
                <div className="flex items-center">
                    <CustomButton
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        variant="secondary"
                    >
                        Anterior
                    </CustomButton>
                    <span className="mx-4">Página {currentPage} de {totalPages}</span>
                    <CustomButton
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        variant="secondary"
                    >
                        Siguiente
                    </CustomButton>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConferenceManagementPage;
