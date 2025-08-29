import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return {
            bucketName: 'documentation_files', // Nombre de la colección en MongoDB
            filename: `${Date.now()}-${file.originalname}` // Nombre de archivo único
        };
    }
});

const gridfsUpload = multer({ storage });

export default gridfsUpload;
