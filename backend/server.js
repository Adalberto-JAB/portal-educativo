import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import expressLayouts from 'express-ejs-layouts';

// Importar configuración de la base de datos
import connectDB from './src/config/db.js';

// Importar middlewares de manejo de errores
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

// Importar rutas de la API
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import subjectRoutes from './src/routes/subjectRoutes.js';
import asignaturaRoutes from './src/routes/asignaturaRoutes.js';
import coverRoutes from './src/routes/coverRoutes.js';
import courseRoutes from './src/routes/courseRoutes.js';
import lessonRoutes from './src/routes/lessonRoutes.js';
import documentationRoutes from './src/routes/documentationRoutes.js';
import forumPostRoutes from './src/routes/forumPostRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
import enrollmentRoutes from './src/routes/enrollmentRoutes.js';
import conferenceRoutes from './src/routes/conferenceRoutes.js';
import profilePictureRoutes from './src/routes/profilePictureRoutes.js';
import nivelRoutes from './src/routes/nivelRoutes.js';
import facultadRoutes from './src/routes/facultadRoutes.js';
import carreraRoutes from './src/routes/carreraRoutes.js';
import subjectAreaRoutes from './src/routes/subjectAreaRoutes.js';
import holidayRoutes from './src/routes/holidayRoutes.js'; // New import
import historicalFactRoutes from './src/routes/historicalFactRoutes.js'; // New import

// Importar rutas de vistas
import viewRoutes from './src/routes/viewRoutes.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Obtener __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares de seguridad y parseo
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración del motor de vistas EJS
app.set('views', path.resolve('./src/views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.use(expressLayouts);

// Configuración de archivos estáticos
app.use(express.static(path.resolve('./src/public')));

// Montar rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/subject-areas', subjectAreaRoutes);
app.use('/api/asignaturas', asignaturaRoutes);
app.use('/api/covers', coverRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/documentation', documentationRoutes);
app.use('/api/forumposts', forumPostRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/conferences', conferenceRoutes);
app.use('/api/profilepictures', profilePictureRoutes);
app.use('/api/niveles', nivelRoutes);
app.use('/api/facultades', facultadRoutes);
app.use('/api/carreras', carreraRoutes);
app.use('/api/holidays', holidayRoutes); // New route
app.use('/api/history', historicalFactRoutes); // New route

// Montar rutas de vistas
app.use('/', viewRoutes);

// Middlewares para manejo de errores
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Servidor ejecutándose en el puerto ${PORT} en modo ${process.env.NODE_ENV}`);
});