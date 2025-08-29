import ProfilePicture from '../models/ProfilePicture.js';
import User from '../models/User.js';

const ProfilePictureService = {
   /**
    * @desc Sube una nueva imagen de perfil.
    * @param {object} imageData - Datos de la imagen (uploadedBy, isDefault).
    * @param {object} file - Objeto de archivo (buffer, mimetype) de Multer.
    * @returns {object} La imagen de perfil creada.
    * @throws {Error} Si los datos son inválidos o el usuario no existe.
    */
   createProfilePicture: async (imageData, file) => {
       const { uploadedBy, isDefault } = imageData;

       const userExists = await User.findById(uploadedBy);
       if (!userExists) {
           throw new Error('El usuario especificado no existe.');
       }

       if (isDefault) {
           await ProfilePicture.updateMany(
               { uploadedBy: uploadedBy, isDefault: true },
               { $set: { isDefault: false } }
           );
       }

       const profilePicture = await ProfilePicture.create({
           data: file.buffer,
           contentType: file.mimetype,
           uploadedBy,
           isDefault: isDefault || false
       });

       if (!profilePicture) {
           throw new Error('Datos de imagen de perfil inválidos.');
       }

       userExists.profilePictureURL = `/api/profilepictures/${profilePicture._id}`;
       await userExists.save();

       return {
           _id: profilePicture._id,
           contentType: profilePicture.contentType,
           uploadedBy: profilePicture.uploadedBy,
           isDefault: profilePicture.isDefault,
           createdAt: profilePicture.createdAt,
           updatedAt: profilePicture.updatedAt
       };
   },

   /**
    * @desc Obtiene una imagen de perfil por su ID.
    * @param {string} id - ID de la imagen de perfil.
    * @returns {object} La imagen de perfil encontrada (incluyendo el buffer de datos).
    * @throws {Error} Si la imagen de perfil no es encontrada.
    */
   getProfilePictureById: async (id) => {
       const profilePicture = await ProfilePicture.findById(id);
       if (!profilePicture) {
           throw new Error('Imagen de perfil no encontrada.');
       }
       return profilePicture;
   },

   /**
    * @desc Actualiza una imagen de perfil.
    * @param {string} id - ID de la imagen de perfil a actualizar.
    * @param {object} updateData - Datos a actualizar (isDefault).
    * @param {object} file - Nuevo archivo (buffer, mimetype) de Multer (opcional).
    * @param {object} currentUser - Usuario que realiza la actualización.
    * @returns {object} La imagen de perfil actualizada.
    * @throws {Error} Si la imagen no es encontrada o no está autorizado.
    */
   updateProfilePicture: async (id, updateData, file, currentUser) => {
       const { isDefault } = updateData;
       const profilePicture = await ProfilePicture.findById(id);

       if (!profilePicture) {
           throw new Error('Imagen de perfil no encontrada.');
       }

       const isAuthorized = currentUser.role === 'admin' || profilePicture.uploadedBy.toString() === currentUser._id.toString();
       if (!isAuthorized) {
           throw new Error('No autorizado para actualizar esta imagen de perfil.');
       }

       if (file) {
           profilePicture.data = file.buffer;
           profilePicture.contentType = file.mimetype;
       }

       if (isDefault !== undefined) {
           if (isDefault) {
               await ProfilePicture.updateMany(
                   { uploadedBy: profilePicture.uploadedBy, isDefault: true, _id: { $ne: profilePicture._id } },
                   { $set: { isDefault: false } }
               );
           }
           profilePicture.isDefault = isDefault;
       }

       const updatedProfilePicture = await profilePicture.save();
       return {
           _id: updatedProfilePicture._id,
           contentType: updatedProfilePicture.contentType,
           uploadedBy: updatedProfilePicture.uploadedBy,
           isDefault: updatedProfilePicture.isDefault,
           createdAt: updatedProfilePicture.createdAt,
           updatedAt: updatedProfilePicture.updatedAt
       };
   },

   /**
    * @desc Elimina una imagen de perfil.
    * @param {string} id - ID de la imagen de perfil a eliminar.
    * @param {object} currentUser - Usuario que realiza la eliminación.
    * @returns {object} Mensaje de éxito.
    * @throws {Error} Si la imagen no es encontrada o no está autorizado.
    */
   deleteProfilePicture: async (id, currentUser) => {
       const profilePicture = await ProfilePicture.findById(id);
       if (!profilePicture) {
           throw new Error('Imagen de perfil no encontrada.');
       }

       const isAuthorized = currentUser.role === 'admin' || profilePicture.uploadedBy.toString() === currentUser._id.toString();
       if (!isAuthorized) {
           throw new Error('No autorizado para eliminar esta imagen de perfil.');
       }

       const user = await User.findById(profilePicture.uploadedBy);
       if (user && user.profilePictureURL === `/api/profilepictures/${profilePicture._id}`) {
           user.profilePictureURL = '';
           await user.save();
       }

       await ProfilePicture.deleteOne({ _id: profilePicture._id });
       return { message: 'Imagen de perfil eliminada correctamente.' };
   }
};

export default ProfilePictureService;
