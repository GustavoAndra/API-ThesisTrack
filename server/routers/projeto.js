const express = require('express');
const projetoController = require('../controllers/projetoController');
const router = express.Router();

router.post('/', projetoController.criarProjeto);

router.get('/', projetoController.listarProjetos);

router.get('/:id', projetoController.listarProjetoPorId); // Rota para listar por ID

router.put('/:id', projetoController.atualizarProjeto);

router.delete('/:id', projetoController.deletarProjeto);

module.exports = router;