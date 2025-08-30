import React from 'react';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GuestPage = () => {
 const { guestLogin } = useAuth();
 const navigate = useNavigate();

 const handleGuestLogin = () => {
   guestLogin();
   navigate('/'); // Redirigir a la página de inicio después del login de invitado
 };

 return (
   <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 bg-bg-primary text-text-primary">
     <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">
       Modo Invitado
     </h1>
     <p className="text-lg md:text-xl text-center mb-8">
       Puedes explorar el contenido público sin necesidad de iniciar sesión.
     </p>
     <CustomButton onClick={handleGuestLogin} variant="secondary">
       Continuar como Invitado
     </CustomButton>
   </div>
 );
};

export default GuestPage;
