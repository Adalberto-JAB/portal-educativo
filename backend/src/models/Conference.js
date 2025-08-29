import mongoose from 'mongoose';

const ConferenceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    topic: {
        type: String,
        trim: true
    },
    audience: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['Presencial', 'Virtual'],
        required: true
    },
    organizer: {
        type: String,
        trim: true
    },
    speakers: [{
        type: String,  
        trim: true
    }],
    startDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // Duración en minutos, horas, etc. (definir unidad)
        required: true
    },
    cost: {
        type: Number,
        default: 0
    },
    isFree: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    cover: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cover'
    },
    url: {
        type: String, // Para conferencias virtuales
        trim: true
    },
    phoneNumber: {
        type: String, // Para cantacto de los Asistentes
        trim: true
    }
}, {
    timestamps: true 
});

export default mongoose.model('Conference', ConferenceSchema);
