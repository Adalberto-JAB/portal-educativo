import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import lessonService from '../services/lessonService';
import courseService from '../services/courseService';
import Loader from '../components/Loader';
import CustomButton from '../components/CustomButton';

// Para el visor de PDF
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configurar el worker para que apunte al archivo local en la carpeta public
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

const LessonDetailPage = () => {
  const { id } = useParams(); // lessonId
  const navigate = useNavigate();
  const { user, isAuthenticated, hasRole } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [pdfFile, setPdfFile] = useState(null); // Estado para el archivo PDF
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () => setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  const goToNextPage = () => setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));

  const fetchLessonDetails = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedLesson = await lessonService.getLessonById(id);
      if (!fetchedLesson) {
        setError('Lección no encontrada.');
        return;
      }

      const fetchedCourse = await courseService.getCourseById(fetchedLesson.course._id);
      if (!fetchedCourse) {
        setError('Curso asociado a la lección no encontrado.');
        return;
      }

      const isAuthor = user && fetchedCourse.author && fetchedCourse.author._id === user.id;
      const isAdmin = hasRole(['admin']);

      // Lógica de control de acceso
      if (!isAuthenticated) {
        if (!fetchedCourse.isGuestViewable) {
          setError('Debes iniciar sesión para ver esta lección.');
          toast.error('Debes iniciar sesión para ver esta lección.');
          return;
        }
      } else { // Usuario autenticado
        if (!fetchedCourse.isPublished && !isAuthor && !isAdmin) {
          setError('No tienes permiso para ver esta lección (curso no publicado).');
          toast.error('No tienes permiso para ver esta lección.');
          return;
        }
      }

      setLesson(fetchedLesson);

      // Descargar el PDF como blob
      const pdfBlob = await lessonService.getLessonPdf(id);
      setPdfFile(pdfBlob);

      setError(null);

    } catch (err) {
      console.error('Error fetching lesson details:', err);
      const errorMessage = err.response?.data?.message || 'No se pudo cargar la lección.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id, user, isAuthenticated, hasRole]);

  useEffect(() => {
    fetchLessonDetails();
  }, [fetchLessonDetails]);

  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando lección...</p>
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

  if (!lesson) {
    return (
      <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4">Lección No Encontrada</h1>
        <p className="text-lg">La lección que buscas no está disponible o no tienes permiso para verla.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto border border-border-color">
        <h1 className="text-3xl font-bold text-text-primary mb-4">{lesson.title}</h1>
        <p className="text-lg text-text-secondary mb-6">{lesson.description}</p>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-3">Contenido de la Lección</h2>
          <div className="flex flex-col items-center">
            {pdfFile ? (
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(err) => {
                  console.error('Error loading PDF document:', err);
                  setError(`No se pudo cargar el documento PDF: ${err.message}`);
                }}
                className="w-full max-w-full overflow-auto border border-border-color"
              >
                <Page pageNumber={pageNumber} width={Math.min(window.innerWidth * 0.8, 800)} />
              </Document>
            ) : (
              <Loader />
            )}
            {numPages && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <CustomButton onClick={goToPrevPage} disabled={pageNumber <= 1}>Página Anterior</CustomButton>
                <p className="text-text-primary">Página {pageNumber} de {numPages}</p>
                <CustomButton onClick={goToNextPage} disabled={pageNumber >= numPages}>Página Siguiente</CustomButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;
