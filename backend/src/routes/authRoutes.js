import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import userValidationRules from '../validations/UserValidationRules.js'; // Importar reglas de validación

const router = express.Router();

router.post('/register', userValidationRules.register, registerUser);
router.post('/login', userValidationRules.login, loginUser);

export default router;
