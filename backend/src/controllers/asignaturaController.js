import AsignaturaService from '../services/AsignaturaService.js';

const createAsignatura = async (req, res) => {
    try {
        const newAsignatura = await AsignaturaService.createAsignatura(req.body);
        res.status(201).json(newAsignatura);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Ya existe una asignatura con este nombre para esta carrera.' });
        }
        res.status(500).json({ message: error.message });
    }
};

const getAllAsignaturas = async (req, res) => {
    try {
        const asignaturas = await AsignaturaService.getAllAsignaturas();
        res.status(200).json(asignaturas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAsignaturaById = async (req, res) => {
    try {
        const asignatura = await AsignaturaService.getAsignaturaById(req.params.id);
        if (!asignatura) {
            return res.status(404).json({ message: 'Asignatura no encontrada.' });
        }
        res.status(200).json(asignatura);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAsignatura = async (req, res) => {
    try {
        const updatedAsignatura = await AsignaturaService.updateAsignatura(req.params.id, req.body);
        if (!updatedAsignatura) {
            return res.status(404).json({ message: 'Asignatura no encontrada para actualizar.' });
        }
        res.status(200).json(updatedAsignatura);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Ya existe una asignatura con este nombre para esta carrera.' });
        }
        res.status(500).json({ message: error.message });
    }
};

const deleteAsignatura = async (req, res) => {
    try {
        const result = await AsignaturaService.deleteAsignatura(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAsignaturasByCarrera = async (req, res) => {
    try {
        const asignaturas = await AsignaturaService.getAsignaturasByCarrera(req.params.carreraId);
        res.status(200).json(asignaturas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createAsignatura,
    getAllAsignaturas,
    getAsignaturaById,
    updateAsignatura,
    deleteAsignatura,
    getAsignaturasByCarrera
};
