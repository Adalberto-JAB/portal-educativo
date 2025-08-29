import * as subjectAreaService from '../services/SubjectAreaService.js';

export const getAllSubjectAreas = async (req, res, next) => {
  try {
    const subjectAreas = await subjectAreaService.getAllSubjectAreas();
    res.json(subjectAreas);
  } catch (error) {
    next(error);
  }
};

export const getSubjectAreaById = async (req, res, next) => {
  try {
    const subjectArea = await subjectAreaService.getSubjectAreaById(req.params.id);
    if (!subjectArea) {
      return res.status(404).json({ message: 'Área temática no encontrada' });
    }
    res.json(subjectArea);
  } catch (error) {
    next(error);
  }
};

export const createSubjectArea = async (req, res, next) => {
  try {
    const newSubjectArea = await subjectAreaService.createSubjectArea(req.body);
    res.status(201).json(newSubjectArea);
  } catch (error) {
    next(error);
  }
};

export const updateSubjectArea = async (req, res, next) => {
  try {
    const updatedSubjectArea = await subjectAreaService.updateSubjectArea(req.params.id, req.body);
    if (!updatedSubjectArea) {
      return res.status(404).json({ message: 'Área temática no encontrada' });
    }
    res.json(updatedSubjectArea);
  } catch (error) {
    next(error);
  }
};

export const deleteSubjectArea = async (req, res, next) => {
  try {
    const subjectArea = await subjectAreaService.deleteSubjectArea(req.params.id);
    if (!subjectArea) {
      return res.status(404).json({ message: 'Área temática no encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};