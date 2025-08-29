import Subject from '../models/Subject.js';

const SubjectService = {
   /**
    * @desc Crea una nueva materia.
    * @param {object} subjectData - Datos de la materia (name, subjectArea).
    * @returns {object} La materia creada.
    * @throws {Error} Si la materia ya existe en el área de conocimiento o los datos son inválidos.
    */
   createSubject: async (subjectData) => {
       const { name, subjectArea } = subjectData;

       const subjectExists = await Subject.findOne({ name, subjectArea });
       if (subjectExists) {
           throw new Error('Ya existe una materia con este nombre en el área de conocimiento seleccionada.');
       }

       const newSubject = await Subject.create({ name, subjectArea });
       if (!newSubject) {
           throw new Error('Datos de materia inválidos.');
       }
       // Se elimina la populación para depurar el error 500. La creación es el paso más importante.
       return newSubject;
   },

   /**
    * @desc Obtiene todas las materias con su área de conocimiento.
    * @returns {Array<object>} Lista de materias.
    */
   getSubjects: async () => {
       return await Subject.find({}).populate('subjectArea');
   },

   /**
    * @desc Obtiene una materia por su ID con su área de conocimiento.
    * @param {string} id - ID de la materia.
    * @returns {object} La materia encontrada.
    * @throws {Error} Si la materia no es encontrada.
    */
   getSubjectById: async (id) => {
       const subject = await Subject.findById(id).populate('subjectArea');
       if (!subject) {
           throw new Error('Materia no encontrada.');
       }
       return subject;
   },

   /**
    * @desc Actualiza una materia.
    * @param {string} id - ID de la materia a actualizar.
    * @param {object} updateData - Datos a actualizar (name, subjectArea).
    * @returns {object} La materia actualizada.
    * @throws {Error} Si la materia no es encontrada o la combinación de nombre y área ya existe.
    */
   updateSubject: async (id, updateData) => {
       const { name, subjectArea } = updateData;

       // Verificar si la nueva combinación ya existe en otro documento
       if (name || subjectArea) {
           const query = { _id: { $ne: id } };
           if (name) query.name = name;
           if (subjectArea) query.subjectArea = subjectArea;

           const subjectExists = await Subject.findOne(query);
           if (subjectExists) {
               throw new Error('Ya existe otra materia con este nombre en el área de conocimiento seleccionada.');
           }
       }

       const updatedSubject = await Subject.findByIdAndUpdate(
           id,
           { $set: updateData },
           { new: true, runValidators: true }
       ).populate('subjectArea');

       if (!updatedSubject) {
           throw new Error('Materia no encontrada.');
       }

       return updatedSubject;
   },

   /**
    * @desc Elimina una materia.
    * @param {string} id - ID de la materia a eliminar.
    * @returns {object} Mensaje de éxito.
    * @throws {Error} Si la materia no es encontrada.
    */
   deleteSubject: async (id) => {
       const subject = await Subject.findById(id);
       if (!subject) {
           throw new Error('Materia no encontrada.');
       }
       await Subject.deleteOne({ _id: subject._id });
       return { message: 'Materia eliminada correctamente.' };
   }
};

export default SubjectService;