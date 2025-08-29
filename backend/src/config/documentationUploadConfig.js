import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the upload directory exists
const uploadDir = path.resolve(process.cwd(), 'backend', 'src', 'public', 'uploads', 'documentation_covers');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 50 }, // Increased limit to 50MB for general files
    // Removed fileFilter to allow all types, validation will be done in controller
});

export default upload;
