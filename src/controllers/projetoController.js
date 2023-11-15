const projetoModel = require('../models/projetoModel');

// Função para tratar a resposta e enviar a resposta HTTP adequada
function handleResponse(res, result) {
  if (result.success) {
    res.status(200).json(result.data || { message: result.message });
  } else {
    res.status(result.statusCode || 500).json({ error: result.error || result.message });
  }
}

// Controlador para criar um novo projeto
async function criarProjeto(req, res) {
  const {
    titulo, 
    tema, 
    problema, 
    resumo, 
    abstract, 
    objetivo_geral, 
    objetivo_especifico,
    url_projeto,
    arquivo,
    publico, 
    alunos,
    professores,
    ano_publicacao 
  } = req.body;

  const result = await projetoModel.criarProjeto({
    titulo, 
    tema, 
    problema, 
    resumo, 
    abstract, 
    objetivo_geral, 
    objetivo_especifico,
    url_projeto,
    arquivo,
    publico, 
    alunos,
    professores,
    ano_publicacao 
  });

  handleResponse(res, result);
}

//Controlador para buscar um projeto por título
async function buscarProjetosPorTitulo(req, res) {
  const { titulo } = req.query;
  
  try {
      const projetos = await projetoModel.buscarProjetosPublicosPorTitulo(titulo);
      
      res.status(200).json(projetos);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar projetos por título' });
  }
}

//Controlador para buscar um projeto por ano de publicação
async function buscarProjetosPublicosPorAno(req, res) {
  const { ano } = req.query;
  
  try {
      const projetos = await projetoModel.buscarProjetosPublicosPorAno(ano);
      
      res.status(200).json(projetos);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar projetos por ano específico' });
  }
}

// Controlador para listar todos os projetos
async function listarProjetos(req, res) {
  const result = await projetoModel.listarProjetos();
  handleResponse(res, result);
}

// Controlador para listar um projeto específico por ID
async function listarProjetoPorId(req, res){
const projetoId = req.params.id;

const result = await projetoModel.listarProjetoPorId(projetoId);

handleResponse(res, result);
};

// Controlador para listar um projeto específico por ID com aluno relacionado
async function listarProjetoPorIdDaPessoa(req, res) {
  const projetoId = req.params.projetoId;
  const pessoaId = req.params.id;

  const result = await projetoModel.listarProjetoPorIdDaPessoa(projetoId, pessoaId);

  handleResponse(res, result);
}


// Controlador para listar projetos relacionados a um curso
async function listarProjetosPorCurso(req, res)  {
  const cursoId = req.params.id;

  try {
    const result = await projetoModel.listarProjetosPorCurso(cursoId);

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

// Controlador para atualizar um projeto existente
async function atualizarProjeto(req, res) {
  const projetoId = req.params.id;
  const {
    titulo, 
    tema, 
    problema, 
    resumo, 
    abstract, 
    objetivo_geral, 
    objetivo_especifico,
    url_projeto,
    arquivo,
    publico, 
    alunos,
    professores
  } = req.body;

  const result = await projetoModel.atualizarProjeto(projetoId, {
    titulo, 
    tema, 
    problema, 
    resumo, 
    abstract, 
    objetivo_geral, 
    objetivo_especifico,
    url_projeto,
    arquivo,
    publico, 
    alunos,
    professores
  });

  handleResponse(res, result);
}

// Controlador para deletar um projeto
async function deletarProjeto(req, res) {
  const projetoId = req.params.id;
  const result = await projetoModel.deletarProjeto(projetoId);
  handleResponse(res, result);
}

module.exports = {
  criarProjeto,
  buscarProjetosPorTitulo,
  buscarProjetosPublicosPorAno,
  listarProjetos,
  listarProjetoPorId,
  listarProjetoPorIdDaPessoa,
  listarProjetosPorCurso,
  atualizarProjeto,
  deletarProjeto
};