import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Asegúrate de cargar las variables de entorno aquí también si este archivo se ejecuta de forma independiente o antes de server.js

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Opciones de conexión recomendadas para Mongoose 6+
      // useNewUrlParser: true, // Ya no es necesario en Mongoose 6+
      // useUnifiedTopology: true, // Ya no es necesario en Mongoose 6+
    });
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Salir del proceso con fallo
  }
};

export default connectDB;
