import Facultad from '../models/Facultad.js';

const FacultadService = {
   /**
    * @desc Crea una nueva facultad.
    * @param {object} facultadData - Datos de la facultad (name, description).
    * @returns {object} La facultad creada.
    * @throws {Error} Si la facultad ya existe o los datos son inválidos.
    */
   createFacultad: async (facultadData) => {
       const { name, description } = facultadData;

       const facultadExists = await Facultad.findOne({ name });
       if (facultadExists) {
           throw new Error('Ya existe una facultad con este nombre.');
       }

       const facultad = await Facultad.create({ name, description });
       if (!facultad) {
           throw new Error('Datos de facultad inválidos.');
       }
       return facultad;
   },

   /**
    * @desc Obtiene todas las facultades.
    * @returns {Array<object>} Lista de facultades.
    */
   getFacultades: async () => {
       return await Facultad.find({});
   },

   /**
    * @desc Obtiene una facultad por su ID.
    * @param {string} id - ID de la facultad.
    * @returns {object} La facultad encontrada.
    * @throws {Error} Si la facultad no es encontrada.
    */
   getFacultadById: async (id) => {
       const facultad = await Facultad.findById(id);
       if (!facultad) {
           throw new Error('Facultad no encontrada.');
       }
       return facultad;
   },

   /**
    * @desc Actualiza una facultad.
    * @param {string} id - ID de la facultad a actualizar.
    * @param {object} updateData - Datos a actualizar (name, description).
    * @returns {object} La facultad actualizada.
    * @throws {Error} Si la facultad no es encontrada o el nombre ya existe.
    */
   updateFacultad: async (id, updateData) => {
       const { name, description } = updateData;
       const facultad = await Facultad.findById(id);

       if (!facultad) {
           throw new Error('Facultad no encontrada.');
       }

       if (name && name !== facultad.name) {
           const facultadExists = await Facultad.findOne({ name });
           if (facultadExists) {
               throw new Error('Ya existe otra facultad con este nombre.');
           }
       }

       facultad.name = name || facultad.name;
       facultad.description = description || facultad.description;

       const updatedFacultad = await facultad.save();
       return updatedFacultad;
   },

   /**
    * @desc Elimina una facultad.
    * @param {string} id - ID de la facultad a eliminar.
    * @returns {object} Mensaje de éxito.
    * @throws {Error} Si la facultad no es encontrada.
    */
   deleteFacultad: async (id) => {
       const facultad = await Facultad.findById(id);
       if (!facultad) {
           throw new Error('Facultad no encontrada.');
       }
       await Facultad.deleteOne({ _id: facultad._id });
       return { message: 'Facultad eliminada correctamente.' };
   }
};

export default FacultadService;
