import {
    createDocumentation,
    getDocumentationById,
    getAllDocumentation,
    updateDocumentation,
    deleteDocumentation
} from '../services/DocumentationService.js';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Cover from '../models/Cover.js';

class DocumentationController {
    static async createDocumentation(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, description, fileType, subject, asignatura, nivel } = req.body;
            const coverImageFile = req.files?.coverImage?.[0];
            const contentFile = req.files?.content?.[0];

            if (!contentFile) {
                return res.status(400).json({ message: 'El archivo de contenido es requerido.' });
            }

            let coverId = null;
            if (coverImageFile) {
                const newCover = new Cover({
                    data: coverImageFile.buffer,
                    contentType: coverImageFile.mimetype,
                    name: coverImageFile.originalname,
                    idUser: req.user._id
                });
                const savedCover = await newCover.save();
                coverId = savedCover._id;
            }

            const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                bucketName: 'documentation_files'
            });

            const uploadStream = gfs.openUploadStream(contentFile.originalname, {
                contentType: contentFile.mimetype
            });
            uploadStream.end(contentFile.buffer);

            const documentationData = {
                title,
                description,
                fileType,
                subject,
                asignatura,
                nivel,
                uploadedBy: req.user._id,
                fileId: uploadStream.id,
                filename: contentFile.originalname,
                contentType: contentFile.mimetype,
                cover: coverId
            };

            const newDocumentation = await createDocumentation(documentationData);
            res.status(201).json(newDocumentation);
        } catch (error) {
            next(error);
        }
    }

    static async getAllDocumentation(req, res, next) {
        try {
            let query = {};
            if (req.user?.role === 'admin') {
                query = {};
            } else if (req.user) {
                query = { isPublished: true };
            } else {
                query = { isPublished: true, isGuestViewable: true };
            }

            const documentation = await getAllDocumentation(query);
            res.status(200).json(documentation);
        } catch (error) {
            next(error);
        }
    }

    static async getDocumentationById(req, res, next) {
        try {
            const documentation = await getDocumentationById(req.params.id);
            if (!documentation) {
                return res.status(404).json({ message: 'Documento no encontrado.' });
            }

            // Authorization logic
            const isAllowed = documentation.isPublished && (documentation.isGuestViewable || req.user);
            const isAdmin = req.user?.role === 'admin';

            if (!isAllowed && !isAdmin) {
                return res.status(403).json({ message: 'No tienes permiso para ver este documento.' });
            }

            res.status(200).json(documentation);
        } catch (error) {
            next(error);
        }
    }

    static async getDocumentationContent(req, res, next) {
        try {
            const doc = await getDocumentationById(req.params.id);
            if (!doc || !doc.fileId) {
                return res.status(404).json({ message: 'Contenido no encontrado.' });
            }

            const isAllowed = doc.isPublished && (doc.isGuestViewable || req.user);
            const isAdmin = req.user?.role === 'admin';

            if (!isAllowed && !isAdmin) {
                 return res.status(403).json({ message: 'No tienes permiso para ver este contenido.' });
            }

            const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                bucketName: 'documentation_files'
            });

            const downloadStream = gfs.openDownloadStream(doc.fileId);
            res.set('Content-Type', doc.contentType);
            downloadStream.pipe(res);

        } catch (error) {
            next(error);
        }
    }

    static async updateDocumentation(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const doc = await getDocumentationById(req.params.id);
            if (!doc) {
                return res.status(404).json({ message: 'Documento no encontrado.' });
            }

            if (doc.uploadedBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'No tienes permiso para editar este documento.' });
            }

            const documentationData = { ...req.body };
            const coverImageFile = req.files?.coverImage?.[0];
            const contentFile = req.files?.content?.[0];

            const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                bucketName: 'documentation_files'
            });

            if (coverImageFile) {
                if (doc.cover) await Cover.findByIdAndDelete(doc.cover);
                const newCover = new Cover({ data: coverImageFile.buffer, contentType: coverImageFile.mimetype, name: coverImageFile.originalname, idUser: req.user._id });
                const savedCover = await newCover.save();
                documentationData.cover = savedCover._id;
            }

            if (contentFile) {
                if (doc.fileId) await gfs.delete(doc.fileId);
                const uploadStream = gfs.openUploadStream(contentFile.originalname, { contentType: contentFile.mimetype });
                uploadStream.end(contentFile.buffer);
                documentationData.fileId = uploadStream.id;
                documentationData.filename = contentFile.originalname;
                documentationData.contentType = contentFile.mimetype;
            }

            const updatedDocumentation = await updateDocumentation(req.params.id, documentationData);
            res.status(200).json(updatedDocumentation);
        } catch (error) {
            next(error);
        }
    }

    static async deleteDocumentation(req, res, next) {
        try {
            const doc = await getDocumentationById(req.params.id);
            if (!doc) {
                return res.status(404).json({ message: 'Documento no encontrado.' });
            }

            if (doc.uploadedBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'No tienes permiso para eliminar este documento.' });
            }

            const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'documentation_files' });
            if (doc.fileId) await gfs.delete(doc.fileId);
            if (doc.cover) await Cover.findByIdAndDelete(doc.cover);

            await deleteDocumentation(req.params.id);
            
            res.status(200).json({ message: 'Documento eliminado exitosamente.' });
        } catch (error) {
            next(error);
        }
    }

    // --- Métodos para cambiar estado ---

    static async publishDocumentation(req, res, next) {
        try {
            const updatedDoc = await updateDocumentation(req.params.id, { isPublished: true });
            res.status(200).json(updatedDoc);
        } catch (error) {
            next(error);
        }
    }

    static async unpublishDocumentation(req, res, next) {
        try {
            const updatedDoc = await updateDocumentation(req.params.id, { isPublished: false, isGuestViewable: false }); // Also hide from guests
            res.status(200).json(updatedDoc);
        } catch (error) {
            next(error);
        }
    }

    static async toggleGuestViewable(req, res, next) {
        try {
            const doc = await getDocumentationById(req.params.id);
            if (!doc) {
                return res.status(404).json({ message: 'Documento no encontrado.' });
            }
            const updatedDoc = await updateDocumentation(req.params.id, { isGuestViewable: !doc.isGuestViewable });
            res.status(200).json(updatedDoc);
        } catch (error) {
            next(error);
        }
    }
}

export default DocumentationController;
