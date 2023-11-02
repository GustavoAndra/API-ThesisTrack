const express = require('express');
const projetoController = require('../controllers/projetoController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Define um caminho base para todas as rotas deste arquivo
const basePath = '/projeto';

// Rota para listar todos os projetos
router.get(`${basePath}/listar/`, projetoController.listarProjetos);

// Rota para listar um projeto por id referenciando seu criador
router.get(`${basePath}/listar/:projetoId/aluno/:id`, projetoController.listarProjetoPorId);

// Rota para listar os projetos de alunos com base no curso que essas pessoas se encontram (protegida por autenticação JWT)
router.get(`${basePath}/lista/aluno/curso/:id`, authMiddleware.verifyToken, projetoController.listarProjetosPorCurso);

// Rota para listar os projetos de alunos com base no curso que essas pessoas se encontram
router.get(`${basePath}/lista/aluno/curso/:id`, projetoController.listarProjetosPorCurso);

// Rota para criar um projeto (protegida por autenticação JWT)
router.post(`${basePath}/adiciona`, authMiddleware.verifyToken, projetoController.criarProjeto);

// Rota para atualizar um projeto por ID (protegida por autenticação JWT)
router.put(`${basePath}/atualiza/:id`, authMiddleware.verifyToken, projetoController.atualizarProjeto);

// Rota para deletar um projeto por ID (protegida por autenticação JWT)
router.delete(`${basePath}/delete/:id`, authMiddleware.verifyToken, projetoController.deletarProjeto);

module.exports = router;
