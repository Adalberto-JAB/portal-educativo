// frontend/src/utils/avatarApiUtil.js

const API_BASE_URL = 'https://api.dicebear.com/8.x';

/**
 * Genera una semilla aleatoria para los avatares.
 * @returns {string} Una cadena de texto aleatoria.
 */
const generateSeed = () => Math.random().toString(36).substring(2, 12);

/**
 * Genera una URL para un avatar por defecto, con un estilo neutral en cuanto al género.
 * Se utiliza el estilo 'bottts-neutral' que es ideal para un avatar sin identidad sexual definida.
 * @returns {string} La URL completa de la imagen del avatar por defecto.
 */
export const generateDefaultAvatar = () => {
  return `${API_BASE_URL}/bottts-neutral/svg?seed=default-avatar`;
};

/**
 * Genera un nuevo conjunto de 8 avatares aleatorios, asegurando 4 masculinos y 4 femeninos.
 * Se utiliza el estilo 'adventurer' que permite especificar el género.
 * Esta función puede ser llamada para refrescar la selección de avatares.
 * @returns {string[]} Un array con 8 URLs de imágenes de avatares.
 */
export const generateRandomAvatars = () => {
  const avatars = [];
  const style = 'adventurer'; // Estilo que soporta género

  // Generar 4 avatares masculinos
  for (let i = 0; i < 4; i++) {
    const seed = generateSeed();
    avatars.push(`${API_BASE_URL}/${style}/svg?seed=${seed}&sex=male`);
  }

  // Generar 4 avatares femeninos
  for (let i = 0; i < 4; i++) {
    const seed = generateSeed();
    avatars.push(`${API_BASE_URL}/${style}/svg?seed=${seed}&sex=female`);
  }

  return avatars;
};

/**
 * Obtiene el conjunto inicial de avatares para ser mostrados en la interfaz.
 * Incluye el avatar por defecto y un primer conjunto de avatares aleatorios.
 * @returns {{defaultAvatar: string, randomAvatars: string[]}} Un objeto con la URL del avatar por defecto y un array de URLs de avatares aleatorios.
 */
export const getInitialAvatars = () => {
  return {
    defaultAvatar: generateDefaultAvatar(),
    randomAvatars: generateRandomAvatars(),
  };
};
