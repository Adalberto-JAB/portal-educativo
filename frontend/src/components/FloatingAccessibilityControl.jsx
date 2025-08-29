import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaTextHeight, FaEye, FaRunning, FaAccessibleIcon, FaTimes, FaArrowsAlt } from 'react-icons/fa'; // Importa iconos de react-icons

const FloatingAccessibilityControl = () => {
  const { toggleTheme, toggleFontSize, toggleHighContrast, toggleAnimations, theme, fontSize, highContrast, animationsEnabled, getButtonStyles } = useTheme();

  // Estado para la posición del componente flotante
  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem('accessibilityControlPosition');
    // Posición inicial por defecto: 20px desde la derecha, 50px desde arriba
    return savedPosition ? JSON.parse(savedPosition) : { x: window.innerWidth - 70, y: 50 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Nuevo estado para controlar si el panel está abierto/cerrado
  const offset = useRef({ x: 0, y: 0 });
  const controlRef = useRef(null);
  const isDragOccurring = useRef(false); // Ref para rastrear si se está produciendo un arrastre real

  // Cargar posición y estado de apertura desde localStorage al inicio
  useEffect(() => {
    const savedPosition = localStorage.getItem('accessibilityControlPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
    const savedIsOpen = localStorage.getItem('accessibilityControlIsOpen');
    if (savedIsOpen) {
      setIsOpen(savedIsOpen === 'true'); // Convertir a booleano
    }
  }, []);

  // Persistir posición y estado de apertura en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('accessibilityControlPosition', JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    localStorage.setItem('accessibilityControlIsOpen', isOpen);
  }, [isOpen]);

  // useLayoutEffect para ajustar la posición después de que el DOM se actualice
  // Esto es crucial para reaccionar a cambios de tamaño del componente (isOpen) o de la ventana
  useLayoutEffect(() => {
    const adjustPosition = () => {
      if (controlRef.current) {
        const margin = 10;
        const currentControlWidth = controlRef.current.offsetWidth;
        const currentControlHeight = controlRef.current.offsetHeight;

        let newX = position.x;
        let newY = position.y;

        // Ajustar X para que no se desborde a la derecha
        if (newX + currentControlWidth + margin > window.innerWidth) {
          newX = window.innerWidth - currentControlWidth - margin;
        }
        // Ajustar X para que no se desborde a la izquierda
        if (newX < margin) {
          newX = margin;
        }

        // Ajustar Y para que no se desborde en la parte inferior
        if (newY + currentControlHeight + margin > window.innerHeight) {
          newY = window.innerHeight - currentControlHeight - margin;
        }
        // Ajustar Y para que no se desborde en la parte superior
        if (newY < margin) {
          newY = margin;
        }

        // Solo actualizar si la posición realmente cambió para evitar bucles infinitos
        if (newX !== position.x || newY !== position.y) {
          setPosition({ x: newX, y: newY });
        }
      }
    };

    // Ajustar posición en la carga inicial, cuando isOpen cambia o al redimensionar la ventana
    adjustPosition();

    const handleResize = () => {
      adjustPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, position.x, position.y]); // Depende de isOpen y la posición para reajustar

  // Manejadores de eventos para arrastrar
  const handleMouseDown = useCallback((e) => {
    // Solo iniciar el arrastre si el clic no es en un botón dentro del panel abierto
    if (isOpen && (e.target.tagName === 'BUTTON' || e.target.closest('button'))) {
      return;
    }
    setIsDragging(true);
    isDragOccurring.current = false; // Resetear la bandera de arrastre
    if (controlRef.current) {
      const rect = controlRef.current.getBoundingClientRect();
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }, [isOpen]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    isDragOccurring.current = true; // Se está produciendo un arrastre

    const margin = 10; // Margen desde los bordes de la ventana
    // Usamos el tamaño actual del elemento ya que useLayoutEffect lo mantendrá actualizado
    const controlWidth = controlRef.current ? controlRef.current.offsetWidth : 50;
    const controlHeight = controlRef.current ? controlRef.current.offsetHeight : 50;

    let newX = e.clientX - offset.current.x;
    let newY = e.clientY - offset.current.y;

    // Limitar el movimiento para que el componente no se salga de la pantalla
    newX = Math.min(window.innerWidth - controlWidth - margin, newX);
    newX = Math.max(margin, newX);

    newY = Math.min(window.innerHeight - controlHeight - margin, newY);
    newY = Math.max(margin, newY);

    setPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Añadir y remover listeners de eventos globales para el arrastre
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Función para alternar la visibilidad del panel
  const togglePanel = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Manejador de clic en el contenedor principal para diferenciar de arrastre
  const handleContainerClick = useCallback((e) => {
    // Si no se produjo un arrastre Y el panel está actualmente cerrado, entonces es un clic para abrir
    if (!isDragOccurring.current && !isOpen) {
      togglePanel();
    }
    isDragOccurring.current = false; // Resetear la bandera después de manejar el clic/arrastre
  }, [isDragOccurring, isOpen, togglePanel]);


  return (
    <div
      ref={controlRef}
      className={`fixed z-50 p-3 rounded-lg shadow-xl border border-accent-primary
        ${isDragging ? 'no-transition' : 'transition-all duration-300 ease-in-out'}
        ${isOpen ? 'bg-bg-primary flex flex-col gap-2' : 'bg-accent-primary flex items-center justify-center cursor-pointer'}
      `}
      
      style={{
        left: position.x, // Usar la posición ajustada directamente
        top: position.y,   // Usar la posición ajustada directamente
        cursor: isDragging ? 'grabbing' : (isOpen ? 'auto' : 'grab'),
        width: isOpen ? 'auto' : '50px', // Ancho fijo para el botón cerrado
        height: isOpen ? 'auto' : '50px', // Alto fijo para el botón cerrado
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={(e) => handleMouseDown(e.touches[0])} // Para dispositivos táctiles
      onTouchMove={(e) => handleMouseMove(e.touches[0])}
      onTouchEnd={handleMouseUp}
      onClick={handleContainerClick} // Usar el nuevo manejador de clic
    >
      {isOpen ? (
        // Contenido del panel abierto
        <>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-text-primary">Accesibilidad</h3>
            <button
              onClick={(e) => { e.stopPropagation(); togglePanel(); }} // Detener propagación para el botón de cerrar
              className="text-text-primary hover:text-accent-primary focus:outline-none"
              aria-label="Cerrar panel de accesibilidad"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={toggleTheme}
              className={`${getButtonStyles('primary')} flex items-center justify-center gap-2`}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
              <span>Tema: {theme === 'light' ? 'Oscuro' : 'Claro'}</span>
            </button>
            <button
              onClick={toggleFontSize}
              className={`${getButtonStyles('secondary')} flex items-center justify-center gap-2`}
            >
              <FaTextHeight />
              <span>Tamaño: {fontSize === 'small' ? 'Pequeño' : fontSize === 'medium' ? 'Mediano' : 'Grande'}</span>
            </button>
            <button
              onClick={toggleHighContrast}
              className={`${getButtonStyles('secondary')} flex items-center justify-center gap-2`}
            >
              <FaEye />
              <span>Contraste: {highContrast ? 'Alto' : 'Normal'}</span>
            </button>
            <button
              onClick={toggleAnimations}
              className={`${getButtonStyles('secondary')} flex items-center justify-center gap-2`}
            >
              <FaRunning />
              <span>Animaciones: {animationsEnabled ? 'Sí' : 'No'}</span>
            </button>
          </div>
          <div className="text-center text-xs text-text-primary mt-2">
            <FaArrowsAlt className="inline-block mr-1" /> Arrastrar
          </div>
        </>
      ) : (
        // Contenido del botón cerrado
        <div className="flex items-center justify-center w-full h-full text-white">
          <FaAccessibleIcon size={24} />
        </div>
      )}
    </div>
  );
};

export default FloatingAccessibilityControl;
