const express = require('express');
const alunoController = require('../controllers/alunoController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Rota para listar os alunos(protegida por autenticação JWT)
router.get(`/listar/alunos`, authMiddleware.verifyToken, alunoController.listarTodosAlunos);

module.exports = router;