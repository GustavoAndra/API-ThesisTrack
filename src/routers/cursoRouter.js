const express = require('express');
const cursoController = require('../controllers/cursoController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Rota para listar os cursos
router.get(`/listar/cursos`, cursoController.listarCurso);

module.exports = router;