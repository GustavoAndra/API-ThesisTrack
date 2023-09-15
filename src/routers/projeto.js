const express = require('express');
const projetoController = require('../controllers/projetoController');
const router = express.Router();

// Rota para criar um projeto (protegida por autenticação JWT)
router.post('/',  projetoController.criarProjeto);

// Rota para listar todos os projetos (protegida por autenticação JWT)
router.get('/',  projetoController.listarProjetos);

// Rota para listar um projeto por ID (protegida por autenticação JWT)
router.get('/:id',  projetoController.listarProjetoPorId);

// Rota para atualizar um projeto por ID (protegida por autenticação JWT)
router.put('/:id',  projetoController.atualizarProjeto);

// Rota para deletar um projeto por ID (protegida por autenticação JWT)
router.delete('/:id',  projetoController.deletarProjeto);

module.exports = router;