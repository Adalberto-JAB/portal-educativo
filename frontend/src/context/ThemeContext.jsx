import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
 // Estado para el tema (light/dark)
 const [theme, setTheme] = useState(() => {
   const savedTheme = localStorage.getItem('theme');
   return savedTheme || 'light';
 });

 // Estados para la accesibilidad
 const [highContrast, setHighContrast] = useState(() => {
   const savedHighContrast = localStorage.getItem('highContrast');
   return savedHighContrast === 'true';
 });
 const [animationsEnabled, setAnimationsEnabled] = useState(() => {
   const savedAnimations = localStorage.getItem('animationsEnabled');
   return savedAnimations !== 'false'; // Por defecto, las animaciones están habilitadas
 });
 const [fontSize, setFontSize] = useState(() => {
   const savedFontSize = localStorage.getItem('fontSize');
   return savedFontSize || 'medium'; // small, medium, large
 });

 // Efecto para aplicar la clase 'dark' al <html>
 useEffect(() => {
   if (theme === 'dark') {
     document.documentElement.classList.add('dark');
   } else {
     document.documentElement.classList.remove('dark');
   }
   localStorage.setItem('theme', theme);
 }, [theme]);

 // Efecto para aplicar la clase 'high-contrast' al <html>
 useEffect(() => {
   if (highContrast) {
     document.documentElement.classList.add('high-contrast');
   } else {
     document.documentElement.classList.remove('high-contrast');
   }
   localStorage.setItem('highContrast', highContrast);
 }, [highContrast]);

 // Efecto para aplicar la clase 'no-animations' al <html>
 useEffect(() => {
   if (!animationsEnabled) {
     document.documentElement.classList.add('no-animations');
   } else {
     document.documentElement.classList.remove('no-animations');
   }
   localStorage.setItem('animationsEnabled', animationsEnabled);
 }, [animationsEnabled]);

 // Efecto para aplicar la clase de tamaño de fuente al <html>
 useEffect(() => {
   document.documentElement.classList.remove('font-small', 'font-medium', 'font-large');
   document.documentElement.classList.add(`font-${fontSize}`);
   localStorage.setItem('fontSize', fontSize);
 }, [fontSize]);


 // Funciones para alternar el tema y la accesibilidad
 const toggleTheme = useCallback(() => {
   setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
 }, []);

 const toggleHighContrast = useCallback(() => {
   setHighContrast((prev) => !prev);
 }, []);

 const toggleAnimations = useCallback(() => {
   setAnimationsEnabled((prev) => !prev);
 }, []);

 const toggleFontSize = useCallback(() => {
   setFontSize((prevSize) => {
     if (prevSize === 'small') return 'medium';
     if (prevSize === 'medium') return 'large';
     return 'small';
   });
 }, []);

 // Función para obtener estilos de botón dinámicamente
 const getButtonStyles = useCallback((type) => {
   const baseStyles = "font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 hover:bg-opacity-80";
   if (type === 'primary') {
     return `bg-accent-primary text-white ${baseStyles}`;
   }
   if (type === 'secondary') {
     // Usamos dark-gray para el texto en el botón secundario para que contraste en ambos temas
     return `bg-accent-secondary text-dark-gray ${baseStyles}`;
   }
   return baseStyles;
 }, []);

 return (
   <ThemeContext.Provider
     value={{
       theme,
       highContrast,
       animationsEnabled,
       fontSize,
       toggleTheme,
       toggleHighContrast,
       toggleAnimations,
       toggleFontSize,
       getButtonStyles,
     }}
   >
     {children}
   </ThemeContext.Provider>
 );
};

export const useTheme = () => {
 return useContext(ThemeContext);
};
