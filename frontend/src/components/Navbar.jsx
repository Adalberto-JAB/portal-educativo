import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaBars, FaTimes, FaCaretDown } from "react-icons/fa";

const resourcesLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/forums", label: "Foros" },
  { to: "/events", label: "Congresos" },
];

const adminLinks = [
  { to: "/admin/users", label: "Gestión de Usuarios" },
  { to: "/admin/courses", label: "Gestión de Cursos" },
  { to: "/admin/documentation", label: "Gestión de Documentación" },
  { to: "/admin/forums-management", label: "Gestión de Foros" },
  { to: "/admin/conferences", label: "Gestión de Congresos" },
  { to: "/admin/subjects", label: "Gestión de Materias" },
  { to: "/admin/covers", label: "Gestión de Portadas" },
  { to: "/admin/niveles", label: "Gestión de Niveles" },
  { to: "/admin/facultades", label: "Gestión de Facultades" },
  { to: "/admin/carreras", label: "Gestión de Carreras" },
  { to: "/admin/asignaturas", label: "Gestión de Asignaturas" },
];

const Navbar = () => {
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const { getButtonStyles } = useTheme();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [navbarBackground, setNavbarBackground] = useState("bg-bg-header");

  const resourcesRef = useRef(null);
  const adminRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (window.scrollY > 50) {
      setNavbarBackground("bg-dark-indigo shadow-md");
    } else {
      setNavbarBackground("bg-bg-header");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleClickOutside = useCallback((event) => {
    if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
      setIsResourcesDropdownOpen(false);
    }
    if (adminRef.current && !adminRef.current.contains(event.target)) {
      setIsAdminDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setIsResourcesDropdownOpen(false);
    setIsAdminDropdownOpen(false);
  };

  const toggleResourcesDropdown = () => {
    setIsResourcesDropdownOpen((prev) => !prev);
    setIsAdminDropdownOpen(false);
  };

  const toggleAdminDropdown = () => {
    setIsAdminDropdownOpen((prev) => !prev);
    setIsResourcesDropdownOpen(false);
  };

  const handleDropdownLinkClick = (to) => {
    setIsResourcesDropdownOpen(false);
    setIsAdminDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate(to);
  };

  const linkTextClass =
    navbarBackground === "bg-transparent" && !isMobileMenuOpen ? "text-text-primary" : "text-white";
  const hoverBgClass =
    navbarBackground === "bg-transparent" && !isMobileMenuOpen
      ? "hover:bg-blue-600"
      : "hover:bg-blue-700";

  const MobileNavLink = ({ to, children }) => (
    <Link
      to={to}
      className="block text-text-primary hover:bg-bg-secondary px-3 py-3 rounded-md text-lg"
      onClick={() => handleDropdownLinkClick(to)}
    >
      {children}
    </Link>
  );

  return (
    <>
      <nav
        className={`fixed w-full z-40 transition-all duration-300 ease-in-out py-4 ${
          isMobileMenuOpen ? "bg-dark-indigo shadow-md" : navbarBackground
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to="/" className={`text-2xl md:text-4xl font-bold ${linkTextClass} flex items-center`}>
            <span className="mr-2 md:text-5xl">📚</span>
            EduTec
          </Link>

          {/* Menú de escritorio */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`${linkTextClass} ${hoverBgClass} px-3 py-2 rounded-md`}
            >
              Inicio
            </Link>
            <Link
              to="/courses"
              className={`${linkTextClass} ${hoverBgClass} px-3 py-2 rounded-md`}
            >
              Cursos
            </Link>
            <Link
              to="/documentation"
              className={`${linkTextClass} ${hoverBgClass} px-3 py-2 rounded-md`}
            >
              Biblioteca
            </Link>

            {isAuthenticated && hasRole(["admin", "teacher"]) && (
              <Link
                to="/my-courses"
                className={`${linkTextClass} ${hoverBgClass} px-3 py-2 rounded-md`}
              >
                Mis Cursos
              </Link>
            )}

            {/* Menú desplegable de Recursos */}
            <div className="relative" ref={resourcesRef}>
              <button
                onClick={toggleResourcesDropdown}
                className={`flex items-center ${linkTextClass} ${hoverBgClass} px-3 py-2 rounded-md focus:outline-none`}
                aria-haspopup="true"
                aria-expanded={isResourcesDropdownOpen}
              >
                Recursos <FaCaretDown className="ml-1" />
              </button>
              {isResourcesDropdownOpen && (
                <ul className="absolute top-full left-0 mt-2 w-48 bg-bg-secondary rounded-md shadow-lg py-1 z-50">
                  {resourcesLinks.map((item) => (
                    <li key={item.to}>
                      <button
                        className="w-full text-left block px-4 py-2 text-text-primary hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => handleDropdownLinkClick(item.to)}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Menú desplegable de Mantenimiento (solo para admin) */}
            {isAuthenticated && hasRole(["admin"]) && (
              <div className="relative" ref={adminRef}>
                <button
                  onClick={toggleAdminDropdown}
                  className={`flex items-center ${linkTextClass} ${hoverBgClass} px-3 py-2 rounded-md focus:outline-none`}
                  aria-haspopup="true"
                  aria-expanded={isAdminDropdownOpen}
                >
                  Mantenimiento <FaCaretDown className="ml-1" />
                </button>
                {isAdminDropdownOpen && (
                  <ul className="absolute top-full left-0 mt-2 w-64 bg-bg-secondary rounded-md shadow-lg py-1 z-50">
                    {adminLinks.map((item) => (
                      <li key={item.to}>
                        <button
                          className="w-full text-left block px-4 py-2 text-text-primary hover:bg-gray-200 dark:hover:bg-gray-700"
                          onClick={() => handleDropdownLinkClick(item.to)}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Opciones de autenticación */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 ${linkTextClass} ${hoverBgClass} px-3 py-2 rounded-md`}
                >
                  {user.profilePictureURL ? (
                    <img
                      src={user.profilePictureURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : ''}
                    </div>
                  )}
                  <span>Hola, {user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${getButtonStyles("secondary")} px-3 py-2 cursor-pointer`}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${linkTextClass} ${hoverBgClass} px-3 py-2 rounded-md`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`${getButtonStyles("primary")} px-3 py-2`}
                >
                  Registro
                </Link>
              </>
            )}
          </div>

          {/* Botón de menú hamburguesa para móvil */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`${linkTextClass} focus:outline-none`}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menú móvil desplegable (Overlay) */}
      <div
        className={`fixed inset-0 z-30 transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden bg-bg-primary pt-24 p-4`}
      >
        <div className="flex flex-col space-y-4">
          <MobileNavLink to="/">Inicio</MobileNavLink>
          <MobileNavLink to="/courses">Cursos</MobileNavLink>
          <MobileNavLink to="/documentation">Biblioteca</MobileNavLink>

          {isAuthenticated && hasRole(["admin", "teacher"]) && (
            <MobileNavLink to="/my-courses">Mis Cursos</MobileNavLink>
          )}

          {/* Menú desplegable de Recursos para móvil */}
          <div>
            <button
              onClick={toggleResourcesDropdown}
              className="flex items-center justify-between w-full text-text-primary hover:bg-bg-secondary px-3 py-3 rounded-md text-lg"
              aria-expanded={isResourcesDropdownOpen}
            >
              Recursos
              <FaCaretDown
                className={`ml-1 transition-transform ${
                  isResourcesDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isResourcesDropdownOpen && (
              <ul className="flex flex-col pl-4 mt-2 space-y-2">
                {resourcesLinks.map((item) => (
                  <li key={item.to}>
                    <MobileNavLink to={item.to}>{item.label}</MobileNavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Menú desplegable de Mantenimiento para móvil (solo para admin) */}
          {isAuthenticated && hasRole(["admin"]) && (
            <div>
              <button
                onClick={toggleAdminDropdown}
                className="flex items-center justify-between w-full text-text-primary hover:bg-bg-secondary px-3 py-3 rounded-md text-lg"
                aria-expanded={isAdminDropdownOpen}
              >
                Mantenimiento
                <FaCaretDown
                  className={`ml-1 transition-transform ${
                    isAdminDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isAdminDropdownOpen && (
                <ul className="flex flex-col pl-4 mt-2 space-y-2">
                  {adminLinks.map((item) => (
                    <li key={item.to}>
                      <MobileNavLink to={item.to}>{item.label}</MobileNavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="border-t border-border-color my-4"></div>

          {/* Opciones de autenticación para móvil */}
          {isAuthenticated ? (
            <>
              <MobileNavLink to="/profile">Hola, {user.name}</MobileNavLink>
              <button
                onClick={handleLogout}
                className={`${getButtonStyles("secondary")} w-full text-left px-3 py-2 mt-2 cursor-pointer`}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <MobileNavLink to="/login">Login</MobileNavLink>
              <MobileNavLink to="/register">Registro</MobileNavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
