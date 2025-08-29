import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
//import DocumentationForm from '../../components/DocumentationForm';
import DocumentationForm from '../components/DocumentationForm';
import documentationService from '../services/documentationService';
import Loader from '../components/Loader';

const DocumentationEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoc = async () => {
            try {
                const response = await documentationService.getById(id);
                // The form needs flat data, so we extract the IDs from populated fields
                const flatData = {
                    ...response,
                    subject: response.subject?._id,
                    asignatura: response.asignatura?._id,
                    nivel: response.nivel?._id,
                };
                setInitialData(flatData);
            } catch (error) {
                toast.error('No se pudo cargar el documento para editar.');
                navigate('/admin/documentation');
            } finally {
                setLoading(false);
            }
        };
        fetchDoc();
    }, [id, navigate]);

    const handleUpdate = async (formData) => {
        try {
            await documentationService.update(id, formData);
            toast.success('Documento actualizado exitosamente.');
            navigate('/admin/documentation');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al actualizar el documento.');
            console.error('Error updating documentation:', error);
        }
    };

    if (loading) return <div className="pt-20 flex justify-center"><Loader /></div>;

    return (
        <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
            {initialData && <DocumentationForm onSubmit={handleUpdate} initialData={initialData} isEditing={true} />}
        </div>
    );
};

export default DocumentationEditPage;
