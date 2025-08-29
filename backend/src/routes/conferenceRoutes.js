import express from 'express';
import {
   createConference,
   getConferences,
   getConferenceById,
   updateConference,
   deleteConference,
   approveConference
} from '../controllers/conferenceController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import conferenceValidationRules from '../validations/ConferenceValidationRules.js';

const router = express.Router();

router.route('/')
   .post(protect, authorizeRoles('admin', 'teacher'), conferenceValidationRules.create, createConference)
   .get(getConferences);

router.route('/:id')
   .get(conferenceValidationRules.getById, getConferenceById)
   .put(protect, authorizeRoles('admin', 'teacher'), conferenceValidationRules.update, updateConference)
   .delete(protect, authorizeRoles('admin', 'teacher'), conferenceValidationRules.delete, deleteConference);

router.route('/:id/approve')
    .put(protect, authorizeRoles('admin'), approveConference);

export default router;
