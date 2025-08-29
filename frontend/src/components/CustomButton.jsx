import React from 'react';
import { useTheme } from '../context/ThemeContext';

const CustomButton = ({ children, variant = 'primary', type = 'button', onClick, className = '', ...props }) => {
 const { getButtonStyles } = useTheme();
 // Usar "variant" para obtener los estilos, no "type"
 const buttonClasses = getButtonStyles(variant);

 return (
   <button
     type={type} // Pasar el "type" HTML al botón real
     onClick={onClick}
     className={`${buttonClasses} ${className}`}
     {...props}
   >
     {children}
   </button>
 );
};

export default CustomButton;
