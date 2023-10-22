const express = require('express');
const professorController = require('../controllers/professorController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Rota para listar os professores orientadores dos projetos (protegida por autenticação JWT)
router.get(`/listar/orientador`, authMiddleware.verifyToken, professorController.listarTodosProfessores);

// Rota para listar os professores orientadores dos projetos (protegida por autenticação JWT)
router.get(`/projeto/orientador/:id`, authMiddleware.verifyToken, professorController.listarProjetosDoProfessor);

module.exports = router;