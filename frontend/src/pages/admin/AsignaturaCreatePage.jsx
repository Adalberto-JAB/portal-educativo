import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import asignaturaService from '../../services/asignaturaService';
import carreraService from '../../services/carreraService'; // To fetch carreras
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    name: yup.string().required('El nombre de la asignatura es requerido.'),
    description: yup.string().nullable(),
    carrera: yup.string().required('La carrera es requerida.').matches(/^[0-9a-fA-F]{24}$/, 'ID de carrera inválido.') // Validate as MongoId
});

const AsignaturaCreatePage = () => {
    const navigate = useNavigate();
    const { hasRole } = useAuth();
    const [loading, setLoading] = useState(false);
    const [carreras, setCarreras] = useState([]);
    const [fetchingCarreras, setFetchingCarreras] = useState(true);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const isAdmin = hasRole(['admin']);

    useEffect(() => {
        const fetchCarreras = async () => {
            try {
                const data = await carreraService.getCarreras();
                const sortedCarreras = data.sort((a, b) => a.name.localeCompare(b.name));
                setCarreras(sortedCarreras);
            } catch (err) {
                console.error('Error fetching carreras:', err);
                toast.error('Error al cargar las carreras.');
            } finally {
                setFetchingCarreras(false);
            }
        };
        if (isAdmin) {
            fetchCarreras();
        } else {
            setFetchingCarreras(false);
        }
    }, [isAdmin]);

    const onSubmit = async (data) => {
        if (!isAdmin) {
            toast.error('No tienes permiso para crear asignaturas.');
            return;
        }
        try {
            setLoading(true);
            await asignaturaService.createAsignatura(data);
            toast.success('Asignatura creada exitosamente.');
            navigate('/admin/asignaturas'); // Redirect to asignatura management
        } catch (err) {
            console.error('Error creating asignatura:', err);
            toast.error(err.response?.data?.message || 'Error al crear la asignatura.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
                <h1 className="text-3xl font-bold mb-4 text-red-500">Acceso Denegado</h1>
                <p className="text-lg">No tienes permiso para crear asignaturas.</p>
            </div>
        );
    }

    if (fetchingCarreras) {
        return (
            <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
                <Loader />
                <p className="mt-4">Cargando carreras...</p>
            </div>
        );
    }

    return (
        <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
            <h1 className="text-3xl font-bold mb-6">Crear Nueva Asignatura</h1>

            <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-md mx-auto border border-border-color">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="name">Nombre de la Asignatura:</label>
                        <input type="text" id="name" {...register("name")}
                            className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="description">Descripción (opcional):</label>
                        <textarea id="description" {...register("description")}
                            className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" rows="3"></textarea>
                    </div>
                    <div>
                        <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="carrera">Carrera:</label>
                        <select id="carrera" {...register("carrera")}
                            className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border">
                            <option value="">Selecciona una carrera</option>
                            {carreras.map((carrera) => (
                                <option key={carrera._id} value={carrera._id}>{carrera.name}</option>
                            ))}
                        </select>
                        {errors.carrera && <p className="text-red-500 text-xs mt-1">{errors.carrera.message}</p>}
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <CustomButton variant="secondary" onClick={() => navigate('/admin/asignaturas')} disabled={loading}>Cancelar</CustomButton>
                        <CustomButton variant="primary" type="submit" disabled={loading}>
                            {loading ? <Loader /> : 'Crear Asignatura'}
                        </CustomButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AsignaturaCreatePage;
