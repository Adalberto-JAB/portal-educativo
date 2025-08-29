import Carrera from '../models/Carrera.js';

const CarreraService = {
   /**
    * @desc Crea una nueva carrera.
    * @param {object} carreraData - Datos de la carrera (name, description, facultad).
    * @returns {object} La carrera creada.
    * @throws {Error} Si la carrera ya existe en la misma facultad o los datos son inválidos.
    */
   createCarrera: async (carreraData) => {
       const { name, description, facultad } = carreraData;

       const carreraExists = await Carrera.findOne({ name, facultad });
       if (carreraExists) {
           throw new Error('Ya existe una carrera con este nombre en la facultad seleccionada.');
       }

       const carrera = await Carrera.create({ name, description, facultad });
       if (!carrera) {
           throw new Error('Datos de carrera inválidos.');
       }
       return carrera;
   },

   /**
    * @desc Obtiene todas las carreras.
    * @returns {Array<object>} Lista de carreras.
    */
   getCarreras: async () => {
       return await Carrera.find({}).populate('facultad');
   },

   /**
    * @desc Obtiene una carrera por su ID.
    * @param {string} id - ID de la carrera.
    * @returns {object} La carrera encontrada.
    * @throws {Error} Si la carrera no es encontrada.
    */
   getCarreraById: async (id) => {
       const carrera = await Carrera.findById(id).populate('facultad');
       if (!carrera) {
           throw new Error('Carrera no encontrada.');
       }
       return carrera;
   },

   /**
    * @desc Actualiza una carrera.
    * @param {string} id - ID de la carrera a actualizar.
    * @param {object} updateData - Datos a actualizar (name, description, facultad).
    * @returns {object} La carrera actualizada.
    * @throws {Error} Si la carrera no es encontrada o el nombre ya existe en la misma facultad.
    */
   updateCarrera: async (id, updateData) => {
       const { name, description, facultad } = updateData;
       const carrera = await Carrera.findById(id);

       if (!carrera) {
           throw new Error('Carrera no encontrada.');
       }

       // Si el nombre o la facultad cambian, verificar unicidad
       if ((name && name !== carrera.name) || (facultad && facultad.toString() !== carrera.facultad.toString())) {
           const carreraExists = await Carrera.findOne({ name: name || carrera.name, facultad: facultad || carrera.facultad });
           if (carreraExists && carreraExists._id.toString() !== id) {
               throw new Error('Ya existe otra carrera con este nombre en la facultad seleccionada.');
           }
       }

       carrera.name = name || carrera.name;
       carrera.description = description || carrera.description;
       carrera.facultad = facultad || carrera.facultad;

       const updatedCarrera = await carrera.save();
       return updatedCarrera;
   },

   /**
    * @desc Elimina una carrera.
    * @param {string} id - ID de la carrera a eliminar.
    * @returns {object} Mensaje de éxito.
    * @throws {Error} Si la carrera no es encontrada.
    */
   deleteCarrera: async (id) => {
       const carrera = await Carrera.findById(id);
       if (!carrera) {
           throw new Error('Carrera no encontrada.');
       }
       await Carrera.deleteOne({ _id: carrera._id });
       return { message: 'Carrera eliminada correctamente.' };
   }
};

export default CarreraService;
