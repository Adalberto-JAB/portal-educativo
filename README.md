# Portal Educativo

Este repositorio contiene el código fuente completo de un **Portal Educativo**, una aplicación web diseñada para ofrecer una plataforma integral de e-learning. El proyecto está dividido en dos componentes principales: un **Frontend** (interfaz de usuario) y un **Backend** (API RESTful).

## Descripción General del Proyecto

El Portal Educativo permite a los usuarios registrarse, iniciar sesión, explorar y ver cursos, inscribirse en ellos y participar en foros de discusión. Incluye funcionalidades para la gestión de usuarios, cursos, documentación y otros recursos educativos a través de un panel de administración.

## Componentes del Proyecto

### 1. Frontend

-   **Descripción:** La interfaz de usuario del Portal Educativo, construida para ofrecer una experiencia interactiva y eficiente.
-   **Tecnologías Clave:**
    -   **Framework:** React (v18.2.0)
    -   **Bundler:** Vite
    -   **Estilos:** Tailwind CSS
    -   **Routing:** React Router DOM
    -   **Peticiones HTTP:** Axios
    -   **Formularios:** React Hook Form y Yup
    -   **Notificaciones:** React Toastify y SweetAlert2
    -   **Iconos:** React Icons
-   **URL de la Aplicación:** [Enlace a la aplicación desplegada]

### 2. Backend

-   **Descripción:** La API RESTful que soporta todas las operaciones del frontend, gestionando la lógica de negocio, la base de datos, la autenticación y el almacenamiento de archivos.
-   **Tecnologías Clave:**
    -   **Entorno:** Node.js
    -   **Framework:** Express.js
    -   **Base de Datos:** MongoDB (con Mongoose)
    -   **Autenticación:** JSON Web Tokens (JWT)
    -   **Carga de Archivos:** Multer y Multer-GridFS-Storage
    -   **Validación:** express-validator
-   **URL de la API:** `https://portal-educativo-jab.onrender.com/api`

## Cómo Contribuir

Para contribuir al proyecto, sigue los pasos de configuración para cada componente (Frontend y Backend) detallados en sus respectivos archivos `README.md`.

### Pasos Generales:

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/Adalberto-JAB/portal-educativo
    cd portal-educativo
    ```
2.  **Configurar Backend:**
    -   Navega a `cd backend`.
    -   Instala dependencias: `npm install`.
    -   Crea un archivo `.env` con `MONGO_URI` y `JWT_SECRET`.
    -   Inicia el servidor: `npm run dev`.
3.  **Configurar Frontend:**
    -   Navega a `cd frontend`.
    -   Instala dependencias: `npm install`.
    -   Crea un archivo `.env` con `VITE_BACKEND_API_URL`.
    -   Inicia el servidor de desarrollo: `npm run dev`.

## Contacto

-   **Nombre del Desarrollador:** Jesus Adalberto Borquez
-   **Email:** jesus.a.borquez@hotmail.com
-   **GitHub:** [Adalberto-JAB](https://github.com/Adalberto-JAB)
