const express = require('express');
const alunoController = require('../controllers/alunoController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Rota para listar os alunos (protegida por autenticação JWT)
router.get(`/listar/alunos`, authMiddleware.verifyToken, alunoController.listarTodosAlunos);

// Rota para listar os projetos associados aos alunos que estejam públicos
router.get(`/aluno/projetos/:id`, alunoController.listarProjetosDeAluno);

// Rota para adicionar os alunos associados ao projeto 
router.post(`/adiciona/aluno/`,  alunoController.cadastrarAlunoController);

module.exports = router;