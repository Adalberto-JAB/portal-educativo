import Asignatura from '../models/Asignatura.js';

class AsignaturaService {
    async createAsignatura(asignaturaData) {
        try {
            const newAsignatura = new Asignatura(asignaturaData);
            await newAsignatura.save();
            return newAsignatura;
        } catch (error) {
            throw error;
        }
    }

    async getAllAsignaturas() {
        try {
            return await Asignatura.find().populate('carrera');
        } catch (error) {
            throw error;
        }
    }

    async getAsignaturaById(id) {
        try {
            return await Asignatura.findById(id).populate('carrera');
        } catch (error) {
            throw error;
        }
    }

    async updateAsignatura(id, updateData) {
        try {
            const updatedAsignatura = await Asignatura.findByIdAndUpdate(id, updateData, { new: true });
            return updatedAsignatura;
        } catch (error) {
            throw error;
        }
    }

    async deleteAsignatura(id) {
        try {
            await Asignatura.findByIdAndDelete(id);
            return { message: 'Asignatura eliminada exitosamente.' };
        } catch (error) {
            throw error;
        }
    }

    async getAsignaturasByCarrera(carreraId) {
        try {
            return await Asignatura.find({ carrera: carreraId }).populate('carrera');
        } catch (error) {
            throw error;
        }
    }
}

export default new AsignaturaService();
