const alunoModel = require('../models/alunoModel');

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

}//listar projetos de um aluno
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

module.exports = {listarTodosAlunos, listarProjetosDeAluno};