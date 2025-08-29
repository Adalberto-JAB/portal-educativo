import SubjectArea from '../models/SubjectArea.js';

export const getAllSubjectAreas = async () => {
  return await SubjectArea.find();
};

export const getSubjectAreaById = async (id) => {
  return await SubjectArea.findById(id);
};

export const createSubjectArea = async (data) => {
  const subjectArea = new SubjectArea(data);
  return await subjectArea.save();
};

export const updateSubjectArea = async (id, data) => {
  return await SubjectArea.findByIdAndUpdate(id, data, { new: true });
};

export const deleteSubjectArea = async (id) => {
  return await SubjectArea.findByIdAndDelete(id);
};