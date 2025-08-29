import mongoose from 'mongoose';

const AsignaturaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    carrera: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrera', // Reference to the Carrera model
        required: true
    }
}, {
    timestamps: true
});

// Unique compound index to ensure that no two Asignaturas have the same name within the same Carrera
AsignaturaSchema.index({ name: 1, carrera: 1 }, { unique: true });

export default mongoose.model('Asignatura', AsignaturaSchema);
