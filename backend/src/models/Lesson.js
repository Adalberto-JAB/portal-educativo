import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Campos para almacenar el archivo PDF
    pdfData: {
        type: Buffer,
        required: true
    },
    pdfContentType: {
        type: String,
        required: true
    },
    pdfOriginalName: {
        type: String,
        required: true
    }
}, {
    timestamps: true 
});

// Índice compuesto de unicidad de orden dentro de un curso
LessonSchema.index({ course: 1, order: 1 }, { unique: true });

export default mongoose.model('Lesson', LessonSchema);