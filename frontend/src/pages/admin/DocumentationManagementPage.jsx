import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import documentationService from '../../services/documentationService';
import Loader from '../../components/Loader';
import CustomButton from '../../components/CustomButton';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const DocumentationManagementPage = () => {
    const navigate = useNavigate();
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDocs = async () => {
        try {
            setLoading(true);
            const response = await documentationService.getAll();
            setDocs(response);
        } catch (error) {
            toast.error('Error al cargar la documentación.');
            console.error('Error fetching documentation:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleView = async (id) => {
        try {
            const blob = await documentationService.getFileContent(id);
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL, '_blank');
        } catch (error) {
            toast.error('Error al visualizar el documento.');
            console.error('Error fetching document content:', error);
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await documentationService.remove(id);
                    toast.success('Documento eliminado exitosamente.');
                    fetchDocs();
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Error al eliminar el documento.');
                }
            }
        });
    };

    const handleTogglePublish = async (doc) => {
        const action = doc.isPublished ? 'despublicar' : 'publicar';
        const verb = doc.isPublished ? 'despublicado' : 'publicado';

        Swal.fire({
            title: `¿Estás seguro de que quieres ${action} este documento?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Sí, ¡${action}!`,
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    if (doc.isPublished) {
                        await documentationService.unpublish(doc._id);
                    } else {
                        await documentationService.publish(doc._id);
                    }
                    toast.success(`Documento ${verb} exitosamente.`);
                    fetchDocs();
                } catch (error) {
                    toast.error(error.response?.data?.message || `Error al ${action} el documento.`);
                }
            }
        });
    };

    const handleToggleGuestViewable = async (doc) => {
        try {
            await documentationService.toggleGuestViewable(doc._id);
            toast.success('Visibilidad para invitados actualizada.');
            fetchDocs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al actualizar la visibilidad.');
        }
    };

    if (loading) return <div className="pt-20 flex justify-center"><Loader /></div>;

    return (
        <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gestión de Documentación</h1>
                <CustomButton onClick={() => navigate('/documentation/create')}>Añadir Documento</CustomButton>
            </div>

            <div className="bg-bg-secondary p-6 rounded-lg shadow-md border border-border-color overflow-x-auto">
                <table className="w-full table-auto divide-y divide-border-color">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Autor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Asignatura</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Visible Invitados</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-bg-secondary divide-y divide-border-color">
                        {docs.map((doc) => (
                            <tr key={doc._id}>
                                <td className="px-6 py-4 text-text-primary break-words font-semibold">{doc.title}</td>
                                <td className="px-6 py-4 text-text-secondary break-words">{doc.uploadedBy?.name || 'N/A'}</td>
                                <td className="px-6 py-4 text-text-secondary break-words">{doc.asignatura?.name || 'N/A'}</td>
                                <td className="px-6 py-4 text-text-primary">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {doc.isPublished ? 'Publicado' : 'Pendiente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-text-primary">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.isGuestViewable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {doc.isGuestViewable ? 'Sí' : 'No'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    {doc.isPublished ? (
                                        <button onClick={() => handleTogglePublish(doc)} className="text-yellow-600 hover:text-yellow-900 mr-4" title="Despublicar">
                                            <FaTimesCircle size={18} />
                                        </button>
                                    ) : (
                                        <button onClick={() => handleTogglePublish(doc)} className="text-green-600 hover:text-green-900 mr-4" title="Publicar">
                                            <FaCheckCircle size={18} />
                                        </button>
                                    )}
                                    <button onClick={() => handleToggleGuestViewable(doc)} className={`mr-4 ${doc.isGuestViewable ? "text-blue-600 hover:text-blue-900" : "text-gray-400 hover:text-gray-600"}`} title="Visible para Invitados">
                                        {doc.isGuestViewable ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                                    </button>
                                    <button onClick={() => handleView(doc._id)} className="text-blue-600 hover:text-blue-900 mr-4" title="Visualizar">
                                        <FaEye size={18} />
                                    </button>
                                    <button onClick={() => navigate(`/documentation/edit/${doc._id}`)} className="text-accent-primary hover:text-blue-700 mr-4" title="Editar">
                                        <FaEdit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(doc._id)} className="text-red-600 hover:text-red-900" title="Eliminar">
                                        <FaTrash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentationManagementPage;
