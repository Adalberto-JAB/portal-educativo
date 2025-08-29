import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import ConferenceService from '../services/ConferenceService.js';

const handleValidationErrors = (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       res.status(400);
       throw new Error(errors.array().map(err => err.msg).join(', '));
   }
};

const createConference = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res);
   const conference = await ConferenceService.createConference(req.body);
   res.status(201).json(conference);
});

const getConferences = asyncHandler(async (req, res) => {
   const conferences = await ConferenceService.getConferences();
   res.json(conferences);
});

const getConferenceById = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res);
   const conference = await ConferenceService.getConferenceById(req.params.id);
   res.json(conference);
});

const updateConference = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res);
   const updatedConference = await ConferenceService.updateConference(req.params.id, req.body);
   res.json(updatedConference);
});

const deleteConference = asyncHandler(async (req, res) => {
   handleValidationErrors(req, res);
   const message = await ConferenceService.deleteConference(req.params.id);
   res.json(message);
});

const approveConference = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isApproved } = req.body;
    const conference = await ConferenceService.approveConference(id, isApproved);
    res.json(conference);
});

export {
   createConference,
   getConferences,
   getConferenceById,
   updateConference,
   deleteConference,
   approveConference
};

