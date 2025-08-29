import mongoose from 'mongoose';

// Subject = Materias 
const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    subjectArea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubjectArea',
        required: true
    }
}, {
    timestamps: true
});

// Crear un índice compuesto para asegurar que el nombre de la materia sea único por área de conocimiento
SubjectSchema.index({ name: 1, subjectArea: 1 }, { unique: true });

export default mongoose.model('Subject', SubjectSchema);
