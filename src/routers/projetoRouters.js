const express = require('express');
const projetoController = require('../controllers/projetoController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const upload = multer({dest: './public/img'}); 

// Rota para criar um projeto (protegida por autenticação JWT)
router.post('/projeto/adiciona', authMiddleware.verifyToken, projetoController.criarProjeto);

// Rota para listar todos os projetos (protegida por autenticação JWT)
router.get('/projeto/listar/',upload.single('arquivo'),authMiddleware.verifyToken,  projetoController.listarProjetos);

// Rota para listar um projeto por ID (protegida por autenticação JWT)
router.get('/projeto/listar/:id',upload.single('arquivo'),authMiddleware.verifyToken,  projetoController.listarProjetoPorId);

// Rota para listar os projeto na tela de visitantes (Ainda em desenvolvimento)
router.get('/projeto/mostra',upload.single('arquivo'), projetoController.listarProjetos);

// Rota para atualizar um projeto por ID (protegida por autenticação JWT)
router.put('/projeto/atualiza/:id',upload.single('arquivo'),authMiddleware.verifyToken,  projetoController.atualizarProjeto);

// Rota para deletar um projeto por ID (protegida por autenticação JWT)
router.delete('/projeto/delete/:id',authMiddleware.verifyToken,  projetoController.deletarProjeto);

module.exports = router;