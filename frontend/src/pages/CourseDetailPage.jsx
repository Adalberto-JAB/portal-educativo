import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courseService from "../services/courseService";
import lessonService from "../services/lessonService";
import enrollmentService from "../services/enrollmentService"; // Import enrollment service
import Loader from "../components/Loader";
import CustomButton from "../components/CustomButton";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, hasRole } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      const courseData = await courseService.getCourseById(id);

      const isAuthor =
        user && courseData.author && courseData.author._id === user.id;

      if (!courseData.isPublished && !isAuthor && !hasRole(["admin"])) {
        setError("No tienes permiso para ver este curso (no publicado).");
        return;
      }
      if (!courseData.isGuestViewable && !isAuthenticated) {
        setError("Debes iniciar sesión para ver este curso.");
        return;
      }

      setCourse(courseData);

      if (isAuthenticated) {
        const status = await enrollmentService.checkEnrollmentStatus(id);
        setIsEnrolled(status.isEnrolled);
      }

      const lessonsData = await lessonService.getLessons(id);
      setLessons(lessonsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching course details:", err);
      setError("No se pudo cargar la información del curso.");
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, user, hasRole]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const handleEnroll = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Debes iniciar sesión para inscribirte.");
      navigate("/login");
      return;
    }
    setEnrollmentLoading(true);
    try {
      await enrollmentService.enrollUser({ course: id, user: user.id });
      toast.success("¡Inscripción exitosa!");
      setIsEnrolled(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error en la inscripción.");
    } finally {
      setEnrollmentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando detalles del curso...</p>
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

  if (!course) {
    return null; // Or a more specific not found component
  }

  const baseUrl =
    (import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000") + "/api";
  const coverUrl = course.cover
    ? `${baseUrl}/covers/${course.cover._id}`
    : "https://via.placeholder.com/400x200";

  return (
    <div className="mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <div className="max-w-[700px] mx-auto">
        <div className="bg-bg-secondary p-8 rounded-lg shadow-lg border border-border-color">
          {course.cover && (
            <img
              src={coverUrl}
              alt={`Portada de ${course.title}`}
              className="w-full h-64 object-cover rounded-md mb-6"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/800x400/cccccc/333333?text=No+Image";
              }}
            />
          )}
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            {course.title}
          </h1>
          <p className="text-lg text-text-secondary mb-6">
            {course.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <p>
              <span className="font-semibold">Autor:</span>{" "}
              {course.author
                ? `${course.author.name} ${course.author.last_name}`
                : "Desconocido"}
            </p>
            <p>
              <span className="font-semibold">Materia:</span>{" "}
              {course.subject ? course.subject.name : "Desconocida"}
            </p>
            <p>
              <span className="font-semibold">Nivel:</span>{" "}
              {course.nivel && typeof course.nivel === 'object' ? course.nivel.name : (course.nivel || 'No especificado')}
            </p>
          </div>

          {/* Enrollment Section */}
          <div className="my-6 p-4 border border-border-color rounded-lg text-center">
            {isAuthenticated ? (
              isEnrolled ? (
                <p className="text-green-500 font-bold text-lg">
                  Ya estás inscrito en este curso.
                </p>
              ) : (
                <CustomButton
                  variant="primary"
                  onClick={handleEnroll}
                  disabled={enrollmentLoading}
                >
                  {enrollmentLoading
                    ? "Inscribiendo..."
                    : "Inscribirse al Curso"}
                </CustomButton>
              )
            ) : (
              <p className="text-text-secondary">
                Inicia sesión para inscribirte en este curso.
              </p>
            )}
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Lecciones
          </h2>
          {lessons.length === 0 ? (
            <p className="text-text-secondary">
              No hay lecciones disponibles para este curso.
            </p>
          ) : (
            <ul className="space-y-4">
              {lessons.map((lesson) => (
                <li
                  key={lesson._id}
                  className="bg-bg-primary p-4 rounded-lg shadow-sm border border-border-color flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">
                      {lesson.order}. {lesson.title}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {lesson.description}
                    </p>
                  </div>
                  {isEnrolled && (
                    <CustomButton
                      variant="secondary"
                      className="text-sm"
                      onClick={() => navigate(`/lessons/${lesson._id}`)}
                    >
                      Ver Lección
                    </CustomButton>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
