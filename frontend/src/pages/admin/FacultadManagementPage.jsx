import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import facultadService from "../../services/facultadService";
import Loader from "../../components/Loader";
import CustomButton from "../../components/CustomButton";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const FacultadManagementPage = () => {
  const navigate = useNavigate();
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasRole } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isAdmin = hasRole(["admin"]);

  const fetchFacultades = async () => {
    try {
      setLoading(true);
      const data = await facultadService.getFacultades();
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
      setFacultades(sortedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching facultades:", err);
      setError(
        "No se pudieron cargar las facultades. Por favor, inténtalo de nuevo más tarde."
      );
      toast.error("Error al cargar las facultades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchFacultades();
    } else {
      setLoading(false);
      setError("No tienes permiso para ver esta página.");
    }
  }, [isAdmin]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, ¡eliminar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await facultadService.deleteFacultad(id);
          Swal.fire("¡Eliminada!", "La facultad ha sido eliminada.", "success");
          fetchFacultades(); // Volver a cargar la lista de facultades
        } catch (err) {
          console.error("Error deleting facultad:", err);
          Swal.fire(
            "Error",
            err.response?.data?.message || "Error al eliminar la facultad.",
            "error"
          );
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = facultades.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(facultades.length / itemsPerPage);

  if (loading) {
    return (
      <div className="mt-28 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando facultades...</p>
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

  if (!isAdmin) {
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
          Gestión de Facultades
        </h1>
        <div className="flex justify-end-safe mb-8">
          <CustomButton
            variant="primary"
            onClick={() => navigate("/admin/facultades/create")}
          >
            <FaPlus className="inline-block mr-2" /> Crear Nueva Facultad
          </CustomButton>
        </div>

        {facultades.length === 0 ? (
          <div className="text-center text-text-secondary">
            <p>No hay facultades disponibles en este momento.</p>
          </div>
        ) : (
          <div className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-color">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-text-primary">
                Listado de Facultades
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
                  {currentItems.map((facultad) => (
                    <tr key={facultad._id}>
                      <td className="px-6 py-4 text-text-primary max-w-40 break-words">
                        {facultad.name}
                      </td>
                      <td className="px-6 py-4 text-text-secondary max-w-2xl break-words">
                        {facultad.description || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium max-w-16">
                        <a
                          onClick={() =>
                            navigate(`/admin/facultades/edit/${facultad._id}`)
                          }
                          className="text-accent-primary hover:text-blue-700 mr-3 cursor-pointer"
                        >
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
            <div className="flex justify-between items-center mt-4">
                <div>
                    <p className="text-sm text-text-secondary">
                        Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, facultades.length)} de {facultades.length} facultades
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

export default FacultadManagementPage;
