import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '', // <--- ADDED
    // El rol 'student' se establecerá por defecto en el handleSubmit
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      // Se crea una copia del formData y se le asigna el rol 'student'
      const userDataToRegister = {
        name: formData.name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        address: formData.address, // <--- ADDED
        role: 'student', // Rol por defecto
      };

      const success = await register(userDataToRegister);
      if (success) {
        navigate('/login'); // Redirigir al login después de un registro exitoso
      }
    } catch (err) {
      console.error('Error registering user:', err);
      // El toast.error ya se maneja en el AuthContext.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary flex items-center justify-center">
      <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-md border border-border-color">
        <h1 className="text-3xl font-bold mb-6 text-center">Registro de Usuario</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="name">Nombre:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" required />
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="last_name">Apellido:</label>
            <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" required />
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" required />
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" required />
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" required />
          </div>
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="phoneNumber">Número de Teléfono (Opcional):</label>
            <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
          </div>
          {/* New Address Field */}
          <div>
            <label className="block text-text-primary text-sm font-bold mb-2" htmlFor="address">Dirección (Opcional):</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border" />
          </div>
          
          <CustomButton variant="primary" type="submit" disabled={loading} className="w-full mt-4">
            {loading ? <Loader /> : 'Registrarse'}
          </CustomButton>
        </form>
        <p className="text-center text-text-secondary text-sm mt-4">
          ¿Ya tienes una cuenta? <a onClick={() => navigate('/login')} className="text-accent-primary hover:underline cursor-pointer">Inicia Sesión</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
