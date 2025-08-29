// Middleware para manejar rutas no encontradas (404)
const notFound = (req, res, next) => {
  const error = new Error(`No Encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pasa el error al siguiente middleware (errorHandler)
};

// Middleware para manejar errores generales
const errorHandler = (err, req, res, next) => {
  // Si el código de estado ya ha sido establecido por un error anterior, úsalo; de lo contrario, 500 (Error de Servidor)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // En desarrollo, proporciona el stack trace para depuración
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
