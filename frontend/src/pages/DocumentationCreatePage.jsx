import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DocumentationForm from '../components/DocumentationForm';
import documentationService from '../services/documentationService';

const DocumentationCreatePage = () => {
    const navigate = useNavigate();

    const handleCreate = async (formData) => {
        try {
            await documentationService.create(formData);
            toast.success('Documento creado exitosamente. Queda pendiente de aprobación por un administrador.');
            // Redirect to a page where users can see their own submissions or to the homepage
            navigate('/'); 
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al crear el documento.');
            console.error('Error creating documentation:', error);
        }
    };

    return (
        <div className="mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
            <DocumentationForm onSubmit={handleCreate} />
        </div>
    );
};

export default DocumentationCreatePage;
