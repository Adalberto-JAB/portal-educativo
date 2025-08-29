import multer from 'multer';

const storage = multer.memoryStorage();
const uploadHandler = multer({ storage: storage });

export default uploadHandler;
