# Portal Educativo - Backend

## URL de la API

La API base se encuentra en: `https://portal-educativo-jab.onrender.com`

## Descripción

Este es el backend del Portal Educativo. Se trata de una API RESTful construida con Node.js y Express, diseñada para servir al frontend del portal. Gestiona toda la lógica de negocio, la interacción con la base de datos, la autenticación de usuarios y el almacenamiento de archivos.

## Tecnologías Utilizadas

El backend está construido con las siguientes tecnologías y librerías principales:

-   **Entorno de Ejecución:** [Node.js](https://nodejs.org/)
-   **Framework Principal:** [Express.js](https://expressjs.com/)
-   **Base de Datos:** [MongoDB](https://www.mongodb.com/)
-   **ODM (Object Data Modeling):** [Mongoose](https://mongoosejs.com/)
-   **Autenticación:** [JSON Web Tokens (JWT)](https://jwt.io/)
-   **Encriptación de Contraseñas:** [bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
-   **Gestión de Carga de Archivos:**
    -   [Multer](https://github.com/expressjs/multer)
    -   [Multer-GridFS-Storage](https://github.com/devconcept/multer-gridfs-storage) para almacenar archivos en MongoDB.
-   **Validación de Peticiones:** [express-validator](https://express-validator.github.io/docs/)
-   **Gestión de CORS:** [cors](https://github.com/expressjs/cors)
-   **Variables de Entorno:** [dotenv](https://github.com/motdotla/dotenv)
-   **Logging de Peticiones HTTP:** [morgan](https://github.com/expressjs/morgan)

## Estructura del Backend

El código fuente se encuentra en la carpeta `src/` y sigue una arquitectura por capas para separar responsabilidades:

-   **`config/`**: Contiene archivos de configuración, como la conexión a la base de datos (`db.js`) y la configuración de `multer` para la carga de archivos.
-   **`controllers/`**: Contiene los controladores que manejan la lógica de las peticiones HTTP. Reciben las peticiones desde las rutas, interactúan con los servicios y envían una respuesta al cliente.
-   **`data/`**: Almacena datos estáticos o iniciales, como archivos JSON para poblar la base de datos.
-   **`middleware/`**: Contiene los middlewares de Express, como el de autenticación (`authMiddleware.js`) que protege las rutas, y los manejadores de errores.
-   **`models/`**: Define los esquemas de Mongoose para cada una de las colecciones de la base de datos (ej: `User.js`, `Course.js`).
-   **`routes/`**: Define las rutas de la API. Cada archivo de ruta agrupa los endpoints relacionados con una entidad (ej: `userRoutes.js`, `courseRoutes.js`).
-   **`services/`**: Contiene la lógica de negocio y las interacciones con la base de datos. Los controladores llaman a los servicios para realizar operaciones de CRUD y otras lógicas más complejas.
-   **`utils/`**: Almacena funciones de utilidad, como la generación de tokens JWT.
-   **`validations/`**: Define las reglas de validación para las peticiones entrantes utilizando `express-validator`.
-   **`server.js`**: Es el punto de entrada principal del servidor, donde se inicializa la aplicación de Express, se configuran los middlewares y se conectan las rutas.

## Cómo Contribuir

Si deseas contribuir al desarrollo del backend, sigue estos pasos:

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/Adalberto-JAB/portal-educativo
    cd portal-educativo/backend
    ```

2.  **Instalar Dependencias:**
    Asegúrate de tener [Node.js](https://nodejs.org/) y [MongoDB](https://www.mongodb.com/try/download/community) instalados. Luego, instala las dependencias del proyecto con npm:
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz de la carpeta `backend/` y añade las siguientes variables de entorno:
    ```
    NODE_ENV=development
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/portal-educativo
    JWT_SECRET=tu_secreto_jwt_muy_seguro
    ```

4.  **Ejecutar el Servidor:**
    Para iniciar el servidor en modo de desarrollo (con reinicio automático ante cambios usando `nodemon`), ejecuta:
    ```bash
    npm run dev
    ```
    La API estará disponible en `http://localhost:5000`.

5.  **Poblar la Base de Datos (Opcional):**
    Si necesitas datos iniciales, puedes ejecutar los scripts de "seeding":
    ```bash
    node scripts/seedAsignaturas.js
    ```

6.  **Realizar Cambios y Enviar un Pull Request:**
    Sigue el mismo proceso que en el frontend para crear una rama, realizar tus cambios y enviar un Pull Request.

## Contacto

-   **Nombre del Desarrollador:** Jesus Adalberto Borquez
-   **Email:** jesus.a.borquez@hotmail.com
-   **GitHub:** https://github.com/Adalberto-JAB
