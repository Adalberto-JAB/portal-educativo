// (Helper, aunque la lógica ya está en ThemeContext)
// Este archivo es un ejemplo de cómo podrías tener utilidades de tema.
// Para este proyecto, la lógica principal de tema se ha integrado directamente en ThemeContext.jsx
// para simplificar, ya que es un contexto relativamente pequeño.

// Si tuvieras una lógica de tema más compleja (ej. múltiples temas, sincronización con el sistema operativo),
// podrías expandir este archivo.

export const getSystemTheme = () => {
 if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
   return 'dark';
 }
 return 'light';
};

// Puedes añadir más funciones aquí si es necesario, por ejemplo:
// export const applyThemeClasses = (theme) => { ... };