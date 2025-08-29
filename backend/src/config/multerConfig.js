import multer from 'multer';

// --- Configuración para Imágenes ---
const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no soportado. Por favor, sube una imagen.'), false);
    }
};

export const imageUpload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Límite de 5MB
    }
});

// --- Configuración para PDFs ---
const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no soportado. Por favor, sube un PDF.'), false);
    }
};

export const pdfUpload = multer({
    storage: storage,
    fileFilter: pdfFileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10 // Límite de 10MB para PDFs
    }
});