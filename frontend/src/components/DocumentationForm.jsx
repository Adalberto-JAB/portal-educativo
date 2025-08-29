import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomButton from './CustomButton';
import Loader from './Loader';
import subjectService from '../services/subjectService';
import asignaturaService from '../services/asignaturaService';
import nivelService from '../services/nivelService';
import coverService from '../services/coverService';

// Enum del modelo Documentation.js
const fileTypeEnum = [
    { value: 'Imagen', label: 'Imagen', mime: ['image/jpeg', 'image/png', 'image/webp'] },
    { value: 'PDF', label: 'PDF', mime: ['application/pdf'] },
    { value: 'Video', label: 'Video', mime: ['video/mp4', 'video/webm', 'video/ogg'] }
];

const DocumentationForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
    const { register, handleSubmit, watch, formState: { errors }, setError, clearErrors } = useForm({ defaultValues: initialData });
    const [loading, setLoading] = useState(false);
    const [selectData, setSelectData] = useState({ subjects: [], asignaturas: [], niveles: [], covers: [] });
    const [coverFileError, setCoverFileError] = useState('');
    const [coverPreview, setCoverPreview] = useState(null);
    const [contentFileError, setContentFileError] = useState('');

    const selectedFileType = watch('fileType');

    useEffect(() => {
        const loadSelectData = async () => {
            setLoading(true);
            try {
                const [subjects, asignaturas, niveles, covers] = await Promise.all([
                    subjectService.getSubjects(),
                    asignaturaService.getAllAsignaturas(),
                    nivelService.getNiveles(),
                    coverService.getCovers()
                ]);
                setSelectData({
                    subjects: Array.isArray(subjects) ? subjects.sort((a, b) => a.name.localeCompare(b.name)) : [],
                    asignaturas: Array.isArray(asignaturas) ? asignaturas.sort((a, b) => a.name.localeCompare(b.name)) : [],
                    niveles: Array.isArray(niveles) ? niveles.sort((a, b) => a.name.localeCompare(b.name)) : [],
                    covers: Array.isArray(covers) ? covers.sort((a, b) => a.name.localeCompare(b.name)) : []
                });
            } catch (error) {
                console.error("Error loading select data", error);
            } finally {
                setLoading(false);
            }
        };
        loadSelectData();
    }, []);

    // Vista previa de la portada
    const handleCoverFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                setCoverFileError('Solo se permiten imágenes JPG, PNG o WEBP para la portada.');
                setCoverPreview(null);
                setError('coverFile', { type: 'manual', message: 'Formato de imagen inválido.' });
            } else {
                setCoverFileError('');
                clearErrors('coverFile');
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCoverPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setCoverPreview(null);
            setCoverFileError('');
            clearErrors('coverFile');
        }
    };

    // Validación de archivo de contenido según tipo seleccionado
    const handleContentFileChange = (e) => {
        const file = e.target.files[0];
        const selectedType = fileTypeEnum.find(ft => ft.value === selectedFileType);
        if (file && selectedType) {
            if (!selectedType.mime.includes(file.type)) {
                setContentFileError(`El archivo debe ser de tipo ${selectedType.label}.`);
                setError('contentFile', { type: 'manual', message: `Formato de archivo inválido para ${selectedType.label}.` });
            } else {
                setContentFileError('');
                clearErrors('contentFile');
            }
        } else {
            setContentFileError('');
            clearErrors('contentFile');
        }
    };

    const handleFormSubmit = (data) => {
        // Validación final antes de enviar
        const coverFile = data.coverFile?.[0];
        if (coverFile && !['image/jpeg', 'image/png', 'image/webp'].includes(coverFile.type)) {
            setCoverFileError('Solo se permiten imágenes JPG, PNG o WEBP para la portada.');
            setError('coverFile', { type: 'manual', message: 'Formato de imagen inválido.' });
            return;
        }
        const contentFile = data.contentFile?.[0];
        const selectedType = fileTypeEnum.find(ft => ft.value === data.fileType);
        if (contentFile && selectedType && !selectedType.mime.includes(contentFile.type)) {
            setContentFileError(`El archivo debe ser de tipo ${selectedType.label}.`);
            setError('contentFile', { type: 'manual', message: `Formato de archivo inválido para ${selectedType.label}.` });
            return;
        }

        setCoverFileError('');
        setContentFileError('');
        clearErrors('coverFile');
        clearErrors('contentFile');

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'contentFile' && data[key]?.[0]) {
                formData.append('content', data[key][0]); // nombre esperado por el backend
            } else if (key === 'coverFile' && data[key]?.[0]) {
                formData.append('coverImage', data[key][0]); // nombre esperado por el backend
            } else {
                formData.append(key, data[key]);
            }
        });
        onSubmit(formData);
    };

    if (loading) return <Loader />;

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto border border-border-color">
            <h2 className="text-2xl font-bold mb-6 text-text-primary">{isEditing ? 'Editar' : 'Crear'} Documento</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                    <label className="block text-text-primary text-sm font-bold mb-2">Título</label>
                    <input {...register('title', { required: 'El título es requerido' })} className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-text-primary text-sm font-bold mb-2">Descripción</label>
                    <textarea {...register('description', { required: 'La descripción es requerida' })} className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" rows="4"></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                {/* Subject */}
                <div>
                    <label className="block text-text-primary text-sm font-bold mb-2">Materia</label>
                    <select {...register('subject', { required: 'La materia es requerida' })} className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border">
                        <option value="">Seleccionar Materia</option>
                        {selectData.subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>

                {/* Asignatura */}
                <div>
                    <label className="block text-text-primary text-sm font-bold mb-2">Asignatura</label>
                    <select {...register('asignatura', { required: 'La asignatura es requerida' })} className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border">
                        <option value="">Seleccionar Asignatura</option>
                        {selectData.asignaturas.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                    </select>
                    {errors.asignatura && <p className="text-red-500 text-xs mt-1">{errors.asignatura.message}</p>}
                </div>

                {/* Nivel */}
                <div>
                    <label className="block text-text-primary text-sm font-bold mb-2">Nivel</label>
                    <select {...register('nivel', { required: 'El nivel es requerido' })} className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border">
                        <option value="">Seleccionar Nivel</option>
                        {selectData.niveles.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
                    </select>
                    {errors.nivel && <p className="text-red-500 text-xs mt-1">{errors.nivel.message}</p>}
                </div>

                {/* Tipo de Archivo */}
                <div>
                    <label className="block text-text-primary text-sm font-bold mb-2">Tipo de Archivo</label>
                    <select {...register('fileType', { required: 'El tipo de archivo es requerido' })} className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border">
                        <option value="">Seleccionar Tipo</option>
                        {fileTypeEnum.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                    {errors.fileType && <p className="text-red-500 text-xs mt-1">{errors.fileType.message}</p>}
                </div>

                {/* Portada - Selección de imagen y vista previa */}
                <div>
                    <label className="block text-text-primary text-sm font-bold mb-2">Portada (Imagen JPG, PNG o WEBP)</label>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        {...register('coverFile')}
                        className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border"
                        onChange={handleCoverFileChange}
                    />
                    {coverFileError && <p className="text-red-500 text-xs mt-1">{coverFileError}</p>}
                    {coverPreview && (
                        <div className="mt-2">
                            <span className="block text-xs text-text-secondary mb-1">Vista previa:</span>
                            <img src={coverPreview} alt="Vista previa portada" className="max-h-40 rounded shadow" />
                        </div>
                    )}
                </div>

                {/* Archivo de Contenido */}
                <div className="md:col-span-2">
                    <label className="block text-text-primary text-sm font-bold mb-2">Archivo de Contenido</label>
                    <input
                        type="file"
                        {...register('contentFile', { required: isEditing ? false : 'El archivo de contenido es requerido' })}
                        className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border"
                        onChange={handleContentFileChange}
                    />
                    {contentFileError && <p className="text-red-500 text-xs mt-1">{contentFileError}</p>}
                    {errors.contentFile && <p className="text-red-500 text-xs mt-1">{errors.contentFile.message}</p>}
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
                <CustomButton type="button" variant="secondary" onClick={() => window.history.back()}>Cancelar</CustomButton>
                <CustomButton type="submit" disabled={loading}>{isEditing ? 'Actualizar' : 'Crear'}</CustomButton>
            </div>
        </form>
    );
};

export default DocumentationForm;
