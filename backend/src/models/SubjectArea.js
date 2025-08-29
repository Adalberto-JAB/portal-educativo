import mongoose from 'mongoose';

const subjectAreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
}, {
  timestamps: true,
});

const SubjectArea = mongoose.model('SubjectArea', subjectAreaSchema);

export default SubjectArea;