const alunoModel = require('../models/alunoModel');

//Função para listar os alunos
async function listarTodosAlunos(req, res) {
    try {
        const result = await alunoModel.listarAlunos();
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }

}

//listar projetos de um aluno
async function listarProjetosDeAluno(req, res) {
    const alunoId = req.params.id;

    try {
        const result = await alunoModel.listarProjetosDeAluno(alunoId);
        if (result.success) {
            res.json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar projetos do aluno' });
    }
}

//Cadastrar um aluno
const cadastrarAlunoController = async (req, res) => {
    try {
      // Obtenha os dados do corpo da solicitação
      const { nome, email, senha, cursoId, matricula } = req.body;
  
      // Chame a função para cadastrar o aluno
      const resultado = await alunoModel.cadastrarAluno({nome, email, senha }, cursoId, matricula);
  
      if (resultado.success) {
        res.status(200).json({ message: resultado.message });
      } else {
        res.status(400).json({ message: resultado.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao cadastrar aluno' });
    }
};

module.exports = {listarTodosAlunos, listarProjetosDeAluno, cadastrarAlunoController};