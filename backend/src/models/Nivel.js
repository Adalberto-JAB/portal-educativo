import mongoose from 'mongoose';

// Nivel = Nivel educativo (ej: Primaria, Secundaria, etc.)
const NivelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true 
});

export default mongoose.model('Nivel', NivelSchema);
