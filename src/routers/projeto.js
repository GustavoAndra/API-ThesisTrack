const express = require('express');
const projetoController = require('../controllers/projetoController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Rota para criar um projeto (protegida por autenticação JWT)
router.post('/', authMiddleware.verifyToken, projetoController.criarProjeto);

// Rota para listar todos os projetos (protegida por autenticação JWT)
router.get('/', authMiddleware.verifyToken, projetoController.listarProjetos);

// Rota para listar um projeto por ID (protegida por autenticação JWT)
router.get('/:id', authMiddleware.verifyToken, projetoController.listarProjetoPorId);

// Rota para atualizar um projeto por ID (protegida por autenticação JWT)
router.put('/:id', authMiddleware.verifyToken, projetoController.atualizarProjeto);

// Rota para deletar um projeto por ID (protegida por autenticação JWT)
router.delete('/:id', authMiddleware.verifyToken, projetoController.deletarProjeto);

module.exports = router;