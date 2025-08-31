import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import forumService from "../../services/forumService";
import Loader from "../../components/Loader";
import CustomButton from "../../components/CustomButton";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ForumManagementPage = () => {
  const navigate = useNavigate();
  const [forumPosts, setForumPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasRole, user } = useAuth();

  const isAllowed = hasRole(["admin", "teacher"]); // Admin y profesores pueden gestionar posts
  const isAdmin = hasRole(["admin"]); // Solo admin puede aprobar

  const fetchForumPosts = async () => {
    try {
      setLoading(true);
      const data = await forumService.getForumPosts();

      let filteredData = data;
      if (hasRole(["teacher"]) && !isAdmin) {
        // Profesores solo ven sus propios posts y los que necesitan aprobación
        filteredData = data.filter(
          (post) =>
            (post.author && post.author._id === user.id) || !post.isApproved
        );
      }
      // Admin ve todos los posts, no necesita filtrar

      setForumPosts(filteredData);
      setError(null);
    } catch (err) {
      console.error("Error fetching forum posts:", err);
      setError(
        "No se pudieron cargar los posts del foro. Por favor, inténtalo de nuevo más tarde."
      );
      toast.error("Error al cargar los posts del foro.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAllowed) {
      fetchForumPosts();
    } else {
      setLoading(false);
      setError("No tienes permiso para ver esta página.");
    }
  }, [isAllowed, isAdmin, user]);

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
          await forumService.deleteForumPost(id);
          Swal.fire(
            '¡Eliminado!',
            'El post del foro ha sido eliminado.',
            'success'
          )
          fetchForumPosts();
        } catch (err) {
          console.error("Error deleting forum post:", err);
          Swal.fire(
            'Error',
            err.response?.data?.message || "Error al eliminar el post del foro.",
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
      text: `¿Deseas ${currentStatus ? "desaprobar" : "aprobar"} este post?`,
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
          await forumService.approveForumPost(id, !currentStatus);
          Swal.fire(
            '¡Actualizado!',
            `El post ha sido ${!currentStatus ? "aprobado" : "desaprobado"}.`,
            'success'
          )
          fetchForumPosts();
        } catch (err) {
          console.error("Error toggling forum post approval:", err);
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
          <h1 className="text-3xl font-bold text-center w-full mb-8">Gestión de Foros</h1>
        
        {forumPosts.length === 0 ? (
          <div className="text-center text-text-secondary">
            <p>No hay posts de foro para gestionar en este momento.</p>
          </div>
        ) : (
          <div className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-color">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Listado de Posts del Foro
            </h2>
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
                      Autor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      Aprobado
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
                  {forumPosts.map((post) => (
                    <tr key={post._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                        {post.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                        {post.author
                          ? `${post.author.name} ${post.author.last_name}`
                          : "Desconocido"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.isApproved
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.isApproved ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-4">
                            <button
                                onClick={() =>
                                    navigate(
                                    `/admin/forums-management/edit/${post._id}`
                                    )
                                }
                                className="text-gray-400 hover:text-accent-primary"
                                title="Editar"
                                >
                                <FaEdit />
                            </button>
                            {isAdmin && (
                                <button
                                onClick={() =>
                                    handleApproveToggle(post._id, post.isApproved)
                                }
                                className={
                                    post.isApproved
                                    ? "text-yellow-500 hover:text-yellow-700"
                                    : "text-green-500 hover:text-green-700"
                                }
                                title={post.isApproved ? "Desaprobar" : "Aprobar"}
                                >
                                {post.isApproved ? (
                                    <FaTimesCircle />
                                ) : (
                                    <FaCheckCircle />
                                )}
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(post._id)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumManagementPage;
