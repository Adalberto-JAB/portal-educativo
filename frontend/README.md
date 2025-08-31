# Portal Educativo - Frontend

## URL de la Aplicación

[Enlace a la aplicación desplegada](https://URL_DE_TU_APLICACION.com)

## Descripción

Este es el frontend del Portal Educativo, una aplicación web diseñada para ofrecer una plataforma completa de e-learning. La aplicación permite a los usuarios registrarse, iniciar sesión, ver cursos, inscribirse en ellos, y participar en foros de discusión. También cuenta con un panel de administración para gestionar usuarios, cursos, documentación, y más.

## Tecnologías Utilizadas

El frontend está construido con un stack moderno de JavaScript, enfocado en la reactividad y la eficiencia.

-   **Framework Principal:** [React](https://reactjs.org/) (v18.2.0)
-   **Bundler y Entorno de Desarrollo:** [Vite](https://vitejs.dev/)
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
-   **Routing:** [React Router DOM](https://reactrouter.com/) (v7.8.1)
-   **Peticiones HTTP:** [Axios](https://axios-http.com/) (v1.11.0)
-   **Gestión de Formularios:** [React Hook Form](https://react-hook-form.com/) (v7.62.0)
-   **Validación de Esquemas:** [Yup](https://github.com/jquense/yup) (v1.7.0)
-   **Notificaciones:**
    -   [React Toastify](https://fkhadra.github.io/react-toastify/introduction) (v11.0.5)
    -   [SweetAlert2](https://sweetalert2.github.io/) (v11.22.4)
-   **Iconos:** [React Icons](https://react-icons.github.io/react-icons/) (v5.5.0)

## Estructura del Frontend

El código fuente se encuentra en la carpeta `src/` y está organizado de la siguiente manera para mantener una arquitectura limpia y escalable:

-   **`assets/`**: Contiene archivos estáticos como imágenes, SVGs y otros recursos multimedia.
-   **`components/`**: Almacena componentes de React reutilizables que se utilizan en varias partes de la aplicación (ej: `Navbar`, `CustomButton`, `Loader`).
-   **`context/`**: Contiene los contextos de React para la gestión del estado global, como la autenticación (`AuthContext.jsx`) y el tema (`ThemeContext.jsx`).
-   **`pages/`**: Contiene los componentes de nivel superior que representan las diferentes páginas de la aplicación (ej: `HomePage`, `LoginPage`, `CoursesPage`). Se subdivide en carpetas para las páginas de `admin` y `teacher`.
-   **`routes/`**: Define las rutas de la aplicación utilizando `react-router-dom`, mapeando las URLs a los componentes de página correspondientes.
-   **`services/`**: Contiene la lógica para interactuar con la API del backend. Cada archivo de servicio (ej: `courseService.js`, `authService.js`) encapsula las peticiones HTTP relacionadas con una entidad específica.
-   **`utils/`**: Almacena funciones de utilidad y helpers que pueden ser reutilizados en toda la aplicación.
-   **`App.jsx`**: Es el componente raíz de la aplicación, donde se configuran los contextos y el enrutador principal.
-   **`main.jsx`**: Es el punto de entrada de la aplicación, donde se renderiza el componente `App` en el DOM.

## Cómo Contribuir

Si deseas contribuir al desarrollo del frontend, sigue estos pasos:

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/Adalberto-JAB/portal-educativo
    cd portal-educativo/frontend
    ```

2.  **Instalar Dependencias:**
    Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Luego, instala las dependencias del proyecto con npm:
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz de la carpeta `frontend/` y añade las variables necesarias. Como mínimo, necesitarás la URL del backend:
    ```
    VITE_BACKEND_API_URL=http://localhost:5000
    ```

4.  **Ejecutar el Servidor de Desarrollo:**
    Para iniciar la aplicación en modo de desarrollo con hot-reloading, ejecuta:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite indique).

5.  **Realizar Cambios:**
    Crea una nueva rama para tus modificaciones:
    ```bash
    git checkout -b feature/nombre-de-tu-funcionalidad
    ```
    Realiza los cambios que consideres necesarios.

6.  **Linting:**
    Antes de confirmar tus cambios, asegúrate de que el código sigue las guías de estilo del proyecto ejecutando el linter:
    ```bash
    npm run lint
    ```

7.  **Enviar un Pull Request:**
    Una vez que hayas terminado, sube tus cambios y abre un Pull Request para que sean revisados.

## Contacto

-   **Nombre del Desarrollador:** Jesus Adalberto Borquez
-   **Email:** jesus.a.borquez@hotmail.com
-   **GitHub:** https://github.com/Adalberto-JAB
