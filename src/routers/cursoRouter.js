const express = require('express');
const cursoController = require('../controllers/cursoController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Rota para listar os cursos (protegida por autenticação JWT)
router.get(`/listar/cursos`, authMiddleware.verifyToken, cursoController.listarCurso);

module.exports = router;