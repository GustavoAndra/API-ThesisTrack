const express = require('express');
const cursoController = require('../controllers/cursoController');
const router = express.Router();

// Rota para listar os cursos
router.get(`/listar/cursos`, cursoController.listarCurso);

module.exports = router;