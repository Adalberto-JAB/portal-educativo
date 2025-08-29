import mongoose from 'mongoose';

const CoverSchema = new mongoose.Schema({
    data: {
        type: Buffer,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    isGeneric: {
        type: Boolean,
        default: false
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() { return !this.isGeneric; } // Obligatoria, o sino es genérica
    }
}, {
    timestamps: true 
});

export default mongoose.model('Cover', CoverSchema);
