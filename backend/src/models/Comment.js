import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    forumPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumPost',
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Agrega las marcas de tiempo createdAt y updatedAt
});

export default mongoose.model('Comment', CommentSchema);