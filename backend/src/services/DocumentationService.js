import Documentation from '../models/Documentation.js';

export const createDocumentation = async (data) => {
    const doc = new Documentation(data);
    return await doc.save();
};

export const getDocumentationById = async (id) => {
    return await Documentation.findById(id)
        .populate('uploadedBy subject asignatura nivel cover');
};

export const getAllDocumentation = async (query = {}) => {
    // Exclude file metadata from list view for performance
    return await Documentation.find(query)
        .select('-fileId -filename -contentType')
        .populate('uploadedBy subject asignatura nivel cover');
};

export const updateDocumentation = async (id, data) => {
    return await Documentation.findByIdAndUpdate(id, data, { new: true });
};

export const deleteDocumentation = async (id) => {
    return await Documentation.findByIdAndDelete(id);
};