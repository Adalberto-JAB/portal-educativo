import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';

const NotFoundPage = () => {
 const navigate = useNavigate();

 return (
   <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 bg-bg-primary text-text-primary text-center">
     <h1 className="text-6xl font-extrabold text-accent-primary mb-4">404</h1>
     <h2 className="text-3xl font-bold text-text-primary mb-4">Página No Encontrada</h2>
     <p className="text-lg text-text-secondary mb-8">
       Lo sentimos, la página que buscas no existe.
     </p>
     <CustomButton variant="primary" onClick={() => navigate(-1)}>Volver al Inicio</CustomButton>
   </div>
 );
};

export default NotFoundPage;
