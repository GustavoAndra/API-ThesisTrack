const express = require('express');
const projetoController = require('../controllers/projetoController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Define um caminho base para todas as rotas deste arquivo
const basePath = '/projeto';

// Rota para criar um projeto (protegida por autenticação JWT)
router.post(`${basePath}/adiciona`, authMiddleware.verifyToken, projetoController.criarProjeto);

// Rota para listar todos os projetos
router.get(`${basePath}/listar/`, projetoController.listarProjetos);

// Rota para listar um projeto por ID
router.get(`${basePath}/listar/:id`, projetoController.listarProjetoPorId);

// Rota para atualizar um projeto por ID (protegida por autenticação JWT)
router.put(`${basePath}/atualiza/:id`, authMiddleware.verifyToken, projetoController.atualizarProjeto);

// Rota para deletar um projeto por ID (protegida por autenticação JWT)
router.delete(`${basePath}/delete/:id`, authMiddleware.verifyToken, projetoController.deletarProjeto);

module.exports = router;