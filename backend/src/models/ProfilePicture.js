import mongoose from 'mongoose';

const ProfilePictureSchema = new mongoose.Schema({
    data: {
        type: Buffer,
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
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true 
});

export default mongoose.model('ProfilePicture', ProfilePictureSchema);
