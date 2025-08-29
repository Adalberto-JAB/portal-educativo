import mongoose from 'mongoose';

const CarreraSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    facultad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facultad',
        required: true
    }
}, {
    timestamps: true
});

// Índice único compuesto para asegurar que no haya dos carreras con el mismo nombre en la misma facultad
CarreraSchema.index({ name: 1, facultad: 1 }, { unique: true });

export default mongoose.model('Carrera', CarreraSchema);
