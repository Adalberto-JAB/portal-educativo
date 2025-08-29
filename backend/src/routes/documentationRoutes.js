import express from 'express';
import { protect, authorizeRoles, getAuthUser } from '../middleware/authMiddleware.js';
import uploadHandler from '../middleware/uploadHandler.js';
import { documentationValidationRules, validate } from '../middleware/validationMiddleware.js';
import DocumentationController from '../controllers/documentationController.js';

const router = express.Router();

// @route   GET /api/documentation
// @desc    Get all documentation
// @access  Public (filtered by isPublished for unauthenticated users)
router.get('/', getAuthUser, DocumentationController.getAllDocumentation);

// @route   GET /api/documentation/:id
// @desc    Get a single document by ID
// @access  Public / Private (logic handled in controller)
router.get('/:id', getAuthUser, DocumentationController.getDocumentationById);

// @route   GET /api/documentation/:id/content
// @desc    Get a document's content by ID
// @access  Public / Private (logic handled in controller)
router.get('/:id/content', getAuthUser, DocumentationController.getDocumentationContent);

// @route   POST /api/documentation
// @desc    Create new documentation
// @access  Private (any authenticated user)
router.post(
    '/',
    protect,
    uploadHandler.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'content', maxCount: 1 }
    ]),
    documentationValidationRules(),
    validate,
    DocumentationController.createDocumentation
);

// @route   PUT /api/documentation/:id
// @desc    Update a document
// @access  Private (Owner or Admin)
router.put(
    '/:id',
    protect,
    uploadHandler.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'content', maxCount: 1 }
    ]),
    documentationValidationRules(),
    validate,
    DocumentationController.updateDocumentation
);

// @route   DELETE /api/documentation/:id
// @desc    Delete a document
// @access  Private (Owner or Admin)
router.delete('/:id', protect, DocumentationController.deleteDocumentation);

// @route   PUT /api/documentation/:id/publish
// @desc    Publish a document
// @access  Private/Admin
router.put('/:id/publish', protect, authorizeRoles('admin'), DocumentationController.publishDocumentation);

// @route   PUT /api/documentation/:id/unpublish
// @desc    Unpublish a document
// @access  Private/Admin
router.put('/:id/unpublish', protect, authorizeRoles('admin'), DocumentationController.unpublishDocumentation);

// @route   PUT /api/documentation/:id/toggle-guest
// @desc    Toggle guest viewable status for a document
// @access  Private/Admin
router.put('/:id/toggle-guest', protect, authorizeRoles('admin'), DocumentationController.toggleGuestViewable);

export default router;
