import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import Loader from '../../components/Loader';
import { useTheme } from '../../context/ThemeContext'; // Importar useTheme

const MyCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getButtonStyles } = useTheme(); // Usar el hook de tema

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const fetchedCourses = await courseService.getMyCourses();
                setCourses(fetchedCourses);
            } catch (err) {
                setError(err.message || 'Error al cargar los cursos.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="pt-20 p-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="mt-28 p-8 bg-bg-primary text-text-primary min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Mis Cursos</h1>
                    <Link 
                        to="/admin/courses/create" 
                        className={getButtonStyles('primary')}
                    >
                        Crear Nuevo Curso
                    </Link>
                </div>

                {courses.length === 0 ? (
                    <p className="text-text-secondary">No has creado ningún curso todavía.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <div key={course._id} className="bg-bg-secondary rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-border-color">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-text-primary mb-2">{course.title}</h2>
                                    <p className={`text-sm font-medium ${course.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {course.isPublished ? 'Publicado' : 'No Publicado'}
                                    </p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <Link 
                                            to={`/admin/courses/edit/${course._id}`}
                                            className="text-accent-primary hover:underline"
                                        >
                                            Editar / Gestionar
                                        </Link>
                                        <Link 
                                            to={`/courses/${course._id}`}
                                            className={getButtonStyles('secondary')}
                                        >
                                            Ver Curso
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCoursesPage;
