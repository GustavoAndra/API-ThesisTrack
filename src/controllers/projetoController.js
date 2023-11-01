const projetoModel = require('../models/projetoModel');

function handleResponse(res, result) {
  if (result.success) {
    res.status(200).json(result.data || { message: result.message });
  } else {
    res.status(result.statusCode || 500).json({ error: result.error || result.message });
  }
};

async function criarProjeto(req, res) {
  const {
    titulo,
    tema,
    delimitacao,
    resumo,
    problema,
    publico,
    alunos,
    professores
  } = req.body;

  const result = await projetoModel.criarProjeto({
    titulo,
    tema,
    delimitacao,
    resumo,
    problema,
    publico,
    alunos,
    professores,
  });

  handleResponse(res, result);
};

async function listarProjetos(req, res) {
  const result = await projetoModel.listarProjetos();
  handleResponse(res, result);
};

async function listarProjetoPorId(req, res) {
  const projetoId = req.params.id;
  const result = await projetoModel.listarProjetoPorId(projetoId);
  handleResponse(res, result);
};

async function listarTodosProfessores(req, res) {
  const result = await projetoModel.listarProfessores();
  handleResponse(res, result);
};

// Controlador para listar projetos relacionados a um curso
async function listarProjetosPorCurso(req, res) {
  const id = req.params.id;

  try {
    const result = await projetoModel.listarProjetosPorCurso(id);

    if (result.success) {
      res.json(result.data);
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

async function atualizarProjeto(req, res) {
  const projetoId = req.params.id;
  const {
    titulo,
    tema,
    delimitacao,
    resumo,
    problema,
    publico,
    alunos,
    professores
  } = req.body;

  const result = await projetoModel.atualizarProjeto(projetoId, {
    titulo,
    tema,
    delimitacao,
    resumo,
    problema,
    publico,
    alunos,
    professores
  });

  handleResponse(res, result);
}

async function deletarProjeto(req, res) {
  const projetoId = req.params.id;
  const result = await projetoModel.deletarProjeto(projetoId);
  handleResponse(res, result);
}

module.exports = {
  criarProjeto,
  listarProjetos,
  listarProjetoPorId,
  listarProjetosPorCurso,
  listarTodosProfessores,
  atualizarProjeto,
  deletarProjeto
};