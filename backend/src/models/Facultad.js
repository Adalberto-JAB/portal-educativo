import mongoose from 'mongoose';

// Facultad = Facultad o Universidad
const FacultadSchema = new mongoose.Schema({
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

export default mongoose.model('Facultad', FacultadSchema);
