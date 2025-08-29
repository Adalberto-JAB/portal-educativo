import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Las lecciones se referencian en el modelo de lección con un campo 'curso'
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

export default mongoose.model('Course', CourseSchema);
