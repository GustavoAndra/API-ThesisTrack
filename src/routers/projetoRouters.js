const express = require('express');
const projetoController = require('../controllers/projetoController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Rota para criar um projeto (protegida por autenticação JWT)
router.post('/projeto/adiciona',authMiddleware.verifyToken, projetoController.criarProjeto);

// Rota para listar todos os projetos (protegida por autenticação JWT)
router.get('/projeto/listar/',authMiddleware.verifyToken,  projetoController.listarProjetos);

// Rota para listar um projeto por ID (protegida por autenticação JWT)
router.get('/projeto/listar/:id',authMiddleware.verifyToken,  projetoController.listarProjetoPorId);

// Rota para atualizar um projeto por ID (protegida por autenticação JWT)
router.put('/projeto/atualiza/:id',authMiddleware.verifyToken,  projetoController.atualizarProjeto);

// Rota para deletar um projeto por ID (protegida por autenticação JWT)
router.delete('/projeto/delete/:id',authMiddleware.verifyToken,  projetoController.deletarProjeto);

module.exports = router;