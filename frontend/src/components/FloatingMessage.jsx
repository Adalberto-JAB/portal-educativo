import React, { useState, useEffect, useCallback } from 'react';
import { FaTimesCircle, FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const FloatingMessage = ({ message, type = 'info', duration = 5000, onClose }) => {
 const [isVisible, setIsVisible] = useState(true);

 const getIcon = () => {
   switch (type) {
     case 'success': return <FaCheckCircle className="text-green-500" />;
     case 'error': return <FaTimesCircle className="text-red-500" />;
     case 'warning': return <FaExclamationTriangle className="text-yellow-500" />;
     default: return <FaInfoCircle className="text-blue-500" />;
   }
 };

 const getBackgroundColor = () => {
   switch (type) {
     case 'success': return 'bg-green-100 dark:bg-green-800';
     case 'error': return 'bg-red-100 dark:bg-red-800';
     case 'warning': return 'bg-yellow-100 dark:bg-yellow-800';
     default: return 'bg-blue-100 dark:bg-blue-800';
   }
 };

 const getTextColor = () => {
   switch (type) {
     case 'success': return 'text-green-800 dark:text-green-200';
     case 'error': return 'text-red-800 dark:text-red-200';
     case 'warning': return 'text-yellow-800 dark:text-yellow-200';
     default: return 'text-blue-800 dark:text-blue-200';
   }
 };

 const handleClose = useCallback(() => {
   setIsVisible(false);
   if (onClose) {
     onClose();
   }
 }, [onClose]);

 useEffect(() => {
   if (duration > 0) {
     const timer = setTimeout(() => {
       handleClose();
     }, duration);
     return () => clearTimeout(timer);
   }
 }, [duration, handleClose]);

 if (!isVisible) return null;

 return (
   <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3
     ${getBackgroundColor()} ${getTextColor()} transition-all duration-300 ease-in-out transform
     ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
     role="alert"
   >
     {getIcon()}
     <span className="font-medium">{message}</span>
     <button
       onClick={handleClose}
       className={`ml-auto text-current hover:opacity-75 focus:outline-none`}
       aria-label="Cerrar mensaje"
     >
       <FaTimesCircle />
     </button>
   </div>
 );
};

export default FloatingMessage;
