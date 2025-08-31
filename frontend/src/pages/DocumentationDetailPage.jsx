import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import documentationService from '../services/documentationService';
import Loader from '../components/Loader';
import CustomButton from '../components/CustomButton';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Para el visor de PDF
import { Document, Page, pdfjs } from 'react-pdf';
// Import react-pdf styles
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

const DocumentationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, hasRole } = useAuth();
  const [documentData, setDocumentData] = useState(null);
  const [fileContentUrl, setFileContentUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados específicos para el visor de PDF
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    let currentFileContentUrl = null; // To store the URL created in this effect run

    const fetchDocDetailsAndFile = async () => {
      try {
        setLoading(true);
        const doc = await documentationService.getById(id);

        // Verificación de permisos
        const isAuthor = user && doc.author && doc.author._id === user.id;
        const isAdmin = hasRole(['admin']);

        // Si el documento no está aprobado y el usuario no es el autor ni un administrador, denegar acceso
        if (!doc.isPublished && !isAuthor && !isAdmin) {
          setError('Este documento aún no ha sido aprobado por un administrador o no tienes permiso para verlo.');
          setDocumentData(null);
          toast.error('Acceso denegado: Documento no aprobado o sin permisos.');
          return;
        }

        setDocumentData(doc);

        // Obtener el contenido del archivo (Blob)
        const fileBlob = await documentationService.getFileContent(id);
        const url = URL.createObjectURL(fileBlob);
        setFileContentUrl(url);
        currentFileContentUrl = url; // Store the URL for cleanup

      } catch (err) {
        console.error('Error al obtener detalles o archivo del documento:', err);
        setError('No se pudo cargar el documento. Por favor, inténtalo de nuevo más tarde.');
        toast.error('Error al cargar el documento.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocDetailsAndFile();

    // Función de limpieza para revocar la URL del Blob cuando el componente se desmonte
    return () => {
      if (currentFileContentUrl) { // Use the URL from this specific effect run
        URL.revokeObjectURL(currentFileContentUrl);
      }
    };
  }, [id, user, isAuthenticated, hasRole]); // Removed fileContentUrl from dependencies

  // Callback para cuando el PDF se carga exitosamente
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1); // Reiniciar a la primera página al cargar un nuevo documento
  };

  // Funciones para navegar entre páginas del PDF
  const goToPrevPage = () => setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  const goToNextPage = () => setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));

  if (loading) {
    return (
      <div className="mt-28 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando documento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-lg">{error}</p>
        <a onClick={() => navigate('/documentation')} className="text-accent-primary hover:underline mt-4 block cursor-pointer">Volver a la Documentación</a>
      </div>
    );
  }

  if (!documentData || !fileContentUrl) {
    return (
      <div className="mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4">Documento No Encontrado</h1>
        <p className="text-lg">El documento que buscas no está disponible.</p>
        <a onClick={() => navigate('/documentation')} className="text-accent-primary hover:underline mt-4 block cursor-pointer">Volver a la Documentación</a>
      </div>
    );
  }

  // Función para renderizar el visor según el tipo de archivo
  const renderFileViewer = () => {
    switch (documentData.fileType) {
      case 'Imagen':
        return (
          <div className="flex justify-center items-center p-4">
            <img src={fileContentUrl} alt={documentData.title} className="max-w-full h-auto rounded-lg shadow-md" />
          </div>
        );
      case 'Video':
        return (
          <div className="flex justify-center items-center p-4 max-h-screen overflow-hidden"> {/* Added max-h-screen and overflow-hidden */}
            <video controls className="w-full max-h-[calc(100vh-200px)] rounded-lg shadow-md aspect-video"> {/* Changed max-w-full to w-full, added object-contain */}
              <source src={fileContentUrl} type={documentData.contentType || 'video/mp4'} />
              Tu navegador no soporta la etiqueta de video.
            </video>
          </div>
        );
      case 'PDF':
        return (
          <div className="flex flex-col items-center p-4 w-full">
            <div className="pdf-viewer-controls flex flex-wrap justify-center gap-4 mb-4">
              <CustomButton onClick={goToPrevPage} disabled={pageNumber <= 1}>Página Anterior</CustomButton>
              <span className="text-text-primary text-lg font-semibold self-center">Página {pageNumber} de {numPages || '...'}</span>
              <CustomButton onClick={goToNextPage} disabled={pageNumber >= numPages}>Página Siguiente</CustomButton>
            </div>
            <div className="pdf-container w-full max-w-3xl border border-border-color rounded-lg overflow-hidden shadow-lg">
              <Document
                file={fileContentUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(err) => {
                  console.error('Error al cargar el PDF:', err);
                  toast.error('Error al cargar el PDF.');
                }}
                className="w-full"
              >
                {/* Ajusta el ancho de la página dinámicamente para que se adapte al contenedor */}
                <Page pageNumber={pageNumber} width={Math.min(800, window.innerWidth * 0.8)} />
              </Document>
            </div>
          </div>
        );
      default:
        return <p className="text-red-500 text-lg">Tipo de archivo no soportado para visualización.</p>;
    }
  };

  return (
    <div className="mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <div className="bg-bg-secondary p-8 rounded-lg shadow-lg border border-border-color max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-text-primary mb-4">{documentData.title}</h1>
        <p className="text-lg text-text-secondary mb-6">{documentData.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <p className="text-text-primary"><span className="font-semibold">Autor:</span> {documentData.author ? `${documentData.author.name} ${documentData.author.last_name}` : 'Desconocido'}</p>
          <p className="text-text-primary md:text-end md:pr-5"><span className="font-semibold">Tipo de Archivo:</span> {documentData.fileType}</p>
          <p className="text-text-primary"><span className="font-semibold">Aprobado:</span> {documentData.isPublished ? 'Sí' : 'No'}</p>
        </div>

        <h2 className="text-2xl font-bold text-text-primary mb-4 text-center">Contenido del Documento</h2>
        {renderFileViewer()}

        <div className="mt-8 text-center">
          <CustomButton variant="secondary" onClick={() => navigate('/documentation')}>Volver a la Documentación</CustomButton>
        </div>
      </div>
    </div>
  );
};

export default DocumentationDetailPage;