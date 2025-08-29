import express from 'express';

const router = express.Router();

// Ruta principal del sitio web: renderiza la vista 'index.ejs'
router.get('/', (req, res) => {
    res.render('index', { title: 'Pagina Principal' });
});

// Ruta para la página "Acerca de": renderiza 'about.ejs'
router.get('/about', (req, res) => {
    res.render('about', { title: 'Acerca de Nosotros' });
});

// Ruta para la página de contacto: renderiza 'contact.ejs'
router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contáctanos' });
});

export default router;
