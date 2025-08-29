import Nivel from '../models/Nivel.js';

const NivelService = {
   /**
    * @desc Crea un nuevo nivel.
    * @param {object} nivelData - Datos del nivel (name, description).
    * @returns {object} El nivel creado.
    * @throws {Error} Si el nivel ya existe o los datos son inválidos.
    */
   createNivel: async (nivelData) => {
       const { name, description } = nivelData;

       const nivelExists = await Nivel.findOne({ name });
       if (nivelExists) {
           throw new Error('Ya existe un nivel con este nombre.');
       }

       const nivel = await Nivel.create({ name, description });
       if (!nivel) {
           throw new Error('Datos de nivel inválidos.');
       }
       return nivel;
   },

   /**
    * @desc Obtiene todos los niveles.
    * @returns {Array<object>} Lista de niveles.
    */
   getNiveles: async () => {
       return await Nivel.find({});
   },

   /**
    * @desc Obtiene un nivel por su ID.
    * @param {string} id - ID del nivel.
    * @returns {object} El nivel encontrado.
    * @throws {Error} Si el nivel no es encontrado.
    */
   getNivelById: async (id) => {
       const nivel = await Nivel.findById(id);
       if (!nivel) {
           throw new Error('Nivel no encontrado.');
       }
       return nivel;
   },

   /**
    * @desc Actualiza un nivel.
    * @param {string} id - ID del nivel a actualizar.
    * @param {object} updateData - Datos a actualizar (name, description).
    * @returns {object} El nivel actualizado.
    * @throws {Error} Si el nivel no es encontrado o el nombre ya existe.
    */
   updateNivel: async (id, updateData) => {
       const { name, description } = updateData;
       const nivel = await Nivel.findById(id);

       if (!nivel) {
           throw new Error('Nivel no encontrado.');
       }

       if (name && name !== nivel.name) {
           const nivelExists = await Nivel.findOne({ name });
           if (nivelExists) {
               throw new Error('Ya existe otro nivel con este nombre.');
           }
       }

       nivel.name = name || nivel.name;
       nivel.description = description || nivel.description;

       const updatedNivel = await nivel.save();
       return updatedNivel;
   },

   /**
    * @desc Elimina un nivel.
    * @param {string} id - ID del nivel a eliminar.
    * @returns {object} Mensaje de éxito.
    * @throws {Error} Si el nivel no es encontrado.
    */
   deleteNivel: async (id) => {
       const nivel = await Nivel.findById(id);
       if (!nivel) {
           throw new Error('Nivel no encontrado.');
       }
       await Nivel.deleteOne({ _id: nivel._id });
       return { message: 'Nivel eliminado correctamente.' };
   }
};

export default NivelService;
