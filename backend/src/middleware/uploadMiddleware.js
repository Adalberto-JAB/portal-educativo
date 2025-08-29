import multer from 'multer';

const storage = multer.memoryStorage(); // Puedes cambiar a diskStorage si prefieres guardar en disco

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB máximo por archivo
});

export default upload;