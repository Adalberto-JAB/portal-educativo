import Conference from '../models/Conference.js';
import Cover from '../models/Cover.js';

const ConferenceService = {
   createConference: async (conferenceData) => {
       const { title, topic, audience, type, organizer, speakers, startDate, duration, cost, isFree, cover, url, phoneNumber } = conferenceData;

       if (cover) {
           const coverExists = await Cover.findById(cover);
           if (!coverExists) {
               throw new Error('La portada especificada no existe.');
           }
       }

       const conference = await Conference.create({
           title,
           topic,
           audience,
           type,
           organizer,
           speakers,
           startDate,
           duration,
           cost,
           isFree: isFree !== undefined ? isFree : true,
           isApproved: false, // Por defecto no aprobado
           cover,
           url,
           phoneNumber
       });

       if (!conference) {
           throw new Error('Datos de conferencia inválidos.');
       }
       return conference;
   },

   getConferences: async () => {
       return await Conference.find({})
           .populate('cover', 'name contentType')
           .sort({ startDate: 1 });
   },

   getConferenceById: async (id) => {
       const conference = await Conference.findById(id)
           .populate('cover', 'name contentType');
       if (!conference) {
           throw new Error('Conferencia/Evento no encontrado.');
       }
       return conference;
   },

   updateConference: async (id, updateData) => {
       const { title, topic, audience, type, organizer, speakers, startDate, duration, cost, isFree, cover, url, phoneNumber } = updateData;
       const conference = await Conference.findById(id);

       if (!conference) {
           throw new Error('Conferencia/Evento no encontrado.');
       }

       if (cover) {
           const coverExists = await Cover.findById(cover);
           if (!coverExists) {
               throw new Error('La portada especificada no existe.');
           }
       }

       conference.title = title || conference.title;
       conference.topic = topic || conference.topic;
       conference.audience = audience || conference.audience;
       conference.type = type || conference.type;
       conference.organizer = organizer || conference.organizer;
       conference.speakers = speakers || conference.speakers;
       conference.startDate = startDate || conference.startDate;
       conference.duration = duration || conference.duration;
       conference.cost = cost !== undefined ? cost : conference.cost;
       conference.isFree = isFree !== undefined ? isFree : conference.isFree;
       conference.cover = cover || conference.cover;
       conference.url = url || conference.url;
       conference.phoneNumber = phoneNumber || conference.phoneNumber;

       const updatedConference = await conference.save();
       return updatedConference;
   },

   deleteConference: async (id) => {
       const conference = await Conference.findById(id);
       if (!conference) {
           throw new Error('Conferencia/Evento no encontrado.');
       }
       await Conference.deleteOne({ _id: conference._id });
       return { message: 'Conferencia/Evento eliminado correctamente.' };
   },

   approveConference: async (id, isApproved) => {
    const conference = await Conference.findById(id);
    if (!conference) {
        throw new Error('Conferencia/Evento no encontrado.');
    }
    conference.isApproved = isApproved;
    await conference.save();
    return conference;
   }
};

export default ConferenceService;
