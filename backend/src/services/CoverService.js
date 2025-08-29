import Cover from '../models/Cover.js';
import User from '../models/User.js';

const CoverService = {
   /**
    * @desc Crea una nueva portada.
    * @param {object} coverData - Datos de la portada (name, isGeneric, idUser).
    * @param {object} file - Objeto de archivo (buffer, mimetype) de Multer.
    * @returns {object} La portada creada.
    * @throws {Error} Si la portada ya existe, los datos son inválidos o el usuario no existe.
    */
   createCover: async (coverData, file) => {
       const { name, isGeneric, idUser } = coverData;
       const isGenericBool = isGeneric === 'true';

       const coverExists = await Cover.findOne({ name });
       if (coverExists) {
           throw new Error('Ya existe una portada con este nombre.');
       }

       if (!isGenericBool && !idUser) {
           throw new Error('Para portadas no genéricas, se requiere un ID de usuario.');
       }
       
       if (idUser) {
           const userExists = await User.findById(idUser);
           if (!userExists) {
               throw new Error('El ID de usuario proporcionado no existe.');
           }
       }

       const cover = await Cover.create({
           data: file.buffer,
           contentType: file.mimetype,
           name,
           isGeneric: isGenericBool,
           idUser: isGenericBool ? undefined : idUser
       });

       if (!cover) {
           throw new Error('Datos de portada inválidos.');
       }
       return {
           _id: cover._id,
           name: cover.name,
           contentType: cover.contentType,
           isGeneric: cover.isGeneric,
           idUser: cover.idUser,
           createdAt: cover.createdAt,
           updatedAt: cover.updatedAt
       };
   },

   /**
    * @desc Obtiene todas las portadas.
    * @returns {Array<object>} Lista de portadas.
    */
   getCovers: async () => {
       return await Cover.find({});
   },

   /**
    * @desc Obtiene una portada por su ID.
    * @param {string} id - ID de la portada.
    * @returns {object} La portada encontrada (incluyendo el buffer de datos).
    * @throws {Error} Si la portada no es encontrada.
    */
   getCoverById: async (id) => {
       const cover = await Cover.findById(id);
       if (!cover) {
           throw new Error('Portada no encontrada.');
       }
       return cover;
   },

   /**
    * @desc Actualiza una portada.
    * @param {string} id - ID de la portada a actualizar.
    * @param {object} updateData - Datos a actualizar (name, isGeneric, idUser).
    * @param {object} file - Nuevo archivo (buffer, mimetype) de Multer (opcional).
    * @returns {object} La portada actualizada.
    * @throws {Error} Si la portada no es encontrada, el nombre ya existe o el usuario no existe.
    */
   updateCover: async (id, updateData, file) => {
       const { name, isGeneric, idUser } = updateData;
       const cover = await Cover.findById(id);

       if (!cover) {
           throw new Error('Portada no encontrada.');
       }

       if (name && name !== cover.name) {
           const coverExists = await Cover.findOne({ name });
           if (coverExists) {
               throw new Error('Ya existe otra portada con este nombre.');
           }
       }

       cover.name = name || cover.name;
       cover.isGeneric = isGeneric !== undefined ? isGeneric : cover.isGeneric;

       if (file) {
           cover.data = file.buffer;
           cover.contentType = file.mimetype;
       }

       if (cover.isGeneric === false) {
           if (!idUser) {
               throw new Error('Para portadas no genéricas, se requiere un ID de usuario.');
           }
           const userExists = await User.findById(idUser);
           if (!userExists) {
               throw new Error('El ID de usuario proporcionado no existe.');
           }
           cover.idUser = idUser;
       } else {
           cover.idUser = undefined;
       }

       const updatedCover = await cover.save();
       return {
           _id: updatedCover._id,
           name: updatedCover.name,
           contentType: updatedCover.contentType,
           isGeneric: updatedCover.isGeneric,
           idUser: updatedCover.idUser,
           createdAt: updatedCover.createdAt,
           updatedAt: updatedCover.updatedAt
       };
   },

   /**
    * @desc Elimina una portada.
    * @param {string} id - ID de la portada a eliminar.
    * @returns {object} Mensaje de éxito.
    * @throws {Error} Si la portada no es encontrada.
    */
   deleteCover: async (id) => {
       const cover = await Cover.findById(id);
       if (!cover) {
           throw new Error('Portada no encontrada.');
       }
       await Cover.deleteOne({ _id: cover._id });
       return { message: 'Portada eliminada correctamente.' };
   }
};

export default CoverService;
