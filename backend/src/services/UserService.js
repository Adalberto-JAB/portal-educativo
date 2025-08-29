import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const UserService = {
   /**
    * @desc Registra un nuevo usuario.
    * @param {object} userData - Datos del usuario (name, last_name, email, password, role, address, phoneNumber).
    * @returns {object} El usuario creado y un token JWT.
    * @throws {Error} Si el usuario ya existe o los datos son inválidos.
    */
   registerUser: async (userData) => {
       const { name, last_name, email, password, role, address, phoneNumber, profilePictureURL } = userData;

       const userExists = await User.findOne({ email });
       if (userExists) {
           throw new Error('El usuario con este email ya existe.');
       }

       const user = await User.create({
           name,
           last_name,
           email,
           password,
           role,
           address,
           phoneNumber,
           profilePictureURL // Añadir el campo aquí
       });

       if (user) {
           return {
               _id: user._id,
               name: user.name,
               last_name: user.last_name,
               email: user.email,
               role: user.role,
               profilePictureURL: user.profilePictureURL,
               token: generateToken(user._id, user.role),
           };
       } else {
           throw new Error('Datos de usuario inválidos.');
       }
   },

   /**
    * @desc Autentica un usuario y genera un token JWT.
    * @param {string} email - Email del usuario.
    * @param {string} password - Contraseña del usuario.
    * @returns {object} El usuario autenticado y un token JWT.
    * @throws {Error} Si el email o la contraseña son inválidos.
    */
   loginUser: async (email, password) => {
       const user = await User.findOne({ email });

       if (user && (await user.comparePassword(password))) {
           return {
               _id: user._id,
               name: user.name,
               last_name: user.last_name,
               email: user.email,
               role: user.role,
               profilePictureURL: user.profilePictureURL, // Add this line
               token: generateToken(user._id, user.role),
           };
       } else {
           throw new Error('Email o contraseña inválidos.');
       }
   },

   /**
    * @desc Obtiene todos los usuarios.
    * @returns {Array<object>} Lista de usuarios.
    */
   getUsers: async () => {
       return await User.find({}).select('-password');
   },

   /**
    * @desc Obtiene un usuario por su ID.
    * @param {string} id - ID del usuario.
    * @returns {object} El usuario encontrado.
    * @throws {Error} Si el usuario no es encontrado.
    */
   getUserById: async (id) => {
       const user = await User.findById(id).select('-password');
       if (!user) {
           throw new Error('Usuario no encontrado.');
       }
       return user;
   },

   /**
    * @desc Actualiza un usuario.
    * @param {string} id - ID del usuario a actualizar.
    * @param {object} updateData - Datos a actualizar.
    * @param {object} currentUser - Usuario que realiza la actualización (para control de roles).
    * @returns {object} El usuario actualizado.
    * @throws {Error} Si el usuario no es encontrado o no está autorizado.
    */
   updateUser: async (id, updateData, currentUser) => {
       const user = await User.findById(id);

       if (!user) {
           throw new Error('Usuario no encontrado.');
       }

       // Permitir acceso si es admin o si el usuario actualiza su propio perfil
       if (currentUser.role === 'admin' || currentUser._id.toString() === user._id.toString()) {
           // Actualizar los campos del perfil
           const fieldsToUpdate = ['name', 'last_name', 'email', 'address', 'phoneNumber', 'profilePictureURL'];
           fieldsToUpdate.forEach(field => {
               if (updateData[field] !== undefined) {
                   user[field] = updateData[field];
               }
           });

           // Actualizar isBlocked si se proporciona
           if (updateData.isBlocked !== undefined) {
               user.isBlocked = updateData.isBlocked;
           }

           // Solo un admin puede cambiar el rol
           if (currentUser.role === 'admin' && updateData.role) {
               user.role = updateData.role;
           }

           const updatedUser = await user.save({ validateModifiedOnly: true });
           return {
               _id: updatedUser._id,
               name: updatedUser.name,
               last_name: updatedUser.last_name,
               email: updatedUser.email,
               role: updatedUser.role,
               isBlocked: updatedUser.isBlocked,
               profilePictureURL: updatedUser.profilePictureURL,
               token: generateToken(updatedUser._id, updatedUser.role),
           };
       } else {
           throw new Error('No autorizado para actualizar este usuario.');
       }
   },

   /**
    * @desc Elimina un usuario.
    * @param {string} id - ID del usuario a eliminar.
    * @returns {object} Mensaje de éxito.
    * @throws {Error} Si el usuario no es encontrado.
    */
   deleteUser: async (id) => {
       const user = await User.findById(id);
       if (!user) {
           throw new Error('Usuario no encontrado.');
       }
       await User.deleteOne({ _id: user._id });
       return { message: 'Usuario eliminado correctamente.' };
   },

   /**
    * @desc Obtiene el perfil del usuario autenticado.
    * @param {string} userId - ID del usuario autenticado.
    * @returns {object} El perfil del usuario.
    * @throws {Error} Si el usuario no es encontrado.
    */
   getMe: async (userId) => {
       const user = await User.findById(userId).select('-password');
       if (!user) {
           throw new Error('Usuario no encontrado.');
       }
       return user;
   },

   /**
    * @desc Cambia la contraseña de un usuario.
    * @param {string} userId - ID del usuario.
    * @param {string} currentPassword - Contraseña actual del usuario.
    * @param {string} newPassword - Nueva contraseña del usuario.
    * @returns {object} Mensaje de éxito.
    * @throws {Error} Si el usuario no es encontrado o la contraseña actual es incorrecta.
    */
   changePassword: async (userId, currentPassword, newPassword) => {
       const user = await User.findById(userId);

       if (!user) {
           throw new Error('Usuario no encontrado.');
       }

       const isMatch = await user.comparePassword(currentPassword);
       if (!isMatch) {
           throw new Error('La contraseña actual es incorrecta.');
       }

       user.password = newPassword;
       await user.save();

       return { message: 'Contraseña actualizada correctamente.' };
   }
};

export default UserService;
