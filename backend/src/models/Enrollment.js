import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    completionDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['in_progress', 'completed', 'dropped'],
        default: 'in_progress'
    }
}, {
    timestamps: true 
});

// Índice compuesto de unicidad de inscripción de usuario a curso
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Enrollment', EnrollmentSchema);
