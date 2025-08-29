import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contextos
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Componentes
import FloatingAccessibilityControl from './components/FloatingAccessibilityControl';
import Navbar from './components/Navbar';

// Rutas de la aplicación
import AppRoutes from './routes/AppRoutes';

// Componente principal de la aplicación
function App() {
 return (
   // Envuelve la aplicación con los proveedores de contexto
   <ThemeProvider>
     <AuthProvider>
       <AppContent />
     </AuthProvider>
   </ThemeProvider>
 );
}

// Componente que usa el contexto del tema y renderiza el control flotante
function AppContent() {
 const { theme } = useTheme();

 return (
   <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''} bg-bg-primary text-text-primary`}>
     <Router>
       <Navbar /> {/* Renderizar el Navbar */}
       <main className="flex-grow">
         <AppRoutes /> {/* Renderizar las rutas de la aplicación */}
       </main>
       {/* Componente de control de accesibilidad flotante */}
       <FloatingAccessibilityControl />
       {/* Aquí iría un Footer */}
     </Router>
     <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
   </div>
 );
}

export default App;
