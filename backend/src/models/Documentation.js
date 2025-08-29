import mongoose from 'mongoose';

const DocumentationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    fileType: {
        type: String,
        enum: ['Imagen', 'PDF', 'Video'],
        required: true
    },
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    isGuestViewable: {
        type: Boolean,
        default: false
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    asignatura: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asignatura',
        required: true
    },
    nivel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nivel',
        required: true
    },
    cover: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cover'
    }
}, {
    timestamps: true 
});

export default mongoose.model('Documentation', DocumentationSchema);
