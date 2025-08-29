import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from '../src/config/db.js';
import Carrera from '../src/models/Carrera.js';
import Asignatura from '../src/models/Asignatura.js';

// Configure dotenv to load environment variables from the backend directory
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const __dirname = path.dirname(new URL(import.meta.url).pathname.substring(1));

const seedAsignaturas = async () => {
  try {
    await connectDB();

    const dataPath = path.resolve(process.cwd(), 'backend', 'data', 'asignaturas.json');
    const asignaturasData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Clear existing asignaturas to avoid duplicates on re-run
    // You might want to comment this out if you want to add to existing data
    await Asignatura.deleteMany({});
    console.log('Asignaturas existentes eliminadas.');

    for (const item of asignaturasData) {
      const carrera = await Carrera.findOne({ name: item.carreraName });

      if (carrera) {
        const newAsignatura = new Asignatura({
          name: item.name,
          description: item.description,
          carrera: carrera._id, // Assign the ObjectId of the carrera
        });
        await newAsignatura.save();
        console.log(`Asignatura '${item.name}' creada y vinculada a la carrera '${item.carreraName}'.`);
      } else {
        console.warn(`ADVERTENCIA: No se encontró la carrera con el nombre '${item.carreraName}'. La asignatura '${item.name}' no fue creada.`);
      }
    }

    console.log('\nProceso de carga de asignaturas completado.');

  } catch (error) {
    console.error('Error durante el proceso de carga:', error);
  } finally {
    // Ensure the connection is closed
    const mongoose = await import('mongoose');
    await mongoose.connection.close();
    console.log('Conexión a la base de datos cerrada.');
    process.exit();
  }
};

seedAsignaturas();
