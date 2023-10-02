const express = require('express');
const professorController = require('../controllers/professorController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Rota para listar os professores orientadores dos projetos (protegida por autenticação JWT)
router.get(`/lista/orientador`, authMiddleware.verifyToken, professorController.listarTodosProfessores);

module.exports = router;