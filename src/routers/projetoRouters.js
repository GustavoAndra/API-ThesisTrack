const express = require('express');
const router = express.Router();
const projetoController = require('../controllers/projetoController');
const authMiddleware = require('../middleware/auth');

// Define um caminho base para todas as rotas deste arquivo
const basePath = '/projeto';

// Rota para listar todos os projetos
router.get(`${basePath}/listar/`, projetoController.listarProjetos);

// Rota para listar os projetos pelo seu id específico
router.get(`${basePath}/listar/:id`, projetoController.listarProjetoPorId);

// Rota para listar um projeto por id referenciando seus relacionados
router.get(`${basePath}/listar/:projetoId/pessoa/:id`, projetoController.listarProjetoPorIdDaPessoa);

// Rota para listar os projetos de alunos com base no curso que essas pessoas se encontram
router.get(`${basePath}/lista/aluno/curso/:id`, projetoController.listarProjetosPorCurso);

// Rota para criar um projeto (protegida por autenticação JWT)
router.post(`${basePath}/adiciona`, authMiddleware.verifyToken, projetoController.criarProjeto);

// Rota para atualizar um projeto por ID (protegida por autenticação JWT)
router.put(`${basePath}/atualiza/:id`, authMiddleware.verifyToken, projetoController.atualizarProjeto);

// Rota para deletar um projeto por ID (protegida por autenticação JWT)
router.delete(`${basePath}/delete/:id`, authMiddleware.verifyToken, projetoController.deletarProjeto);

//Rota para buscar um projeto pelo título dele
router.get('/buscar-projetos/', projetoController.buscarProjetosPorTitulo);

//Rota para buscar um projeto pelo título dele
router.get('/buscar-projetos/ano/', projetoController.buscarProjetosPublicosPorAno);

module.exports = router;
