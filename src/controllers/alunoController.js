const alunoModel = require('../models/alunoModel');

// Função central para tratar erros
function handleError(res, errorMessage = 'Erro interno do servidor') {
    return res.status(500).json({ error: errorMessage });
}

// Função para resposta de sucesso
function sendSuccessResponse(res, message) {
    return res.status(200).json({ message });
}

// Função para resposta de erro
function sendErrorResponse(res, message, statusCode = 400) {
    return res.status(statusCode).json({ message });
}

async function listarTodosAlunos(req, res) {
    try {
        const result = await alunoModel.listarAlunos();
        if (result.success) {
            return res.status(200).json(result.data);
        } else {
            return sendErrorResponse(res, result.error);
        }
    } catch (error) {
        console.error(error);
        return handleError(res);
    }
}

async function listarProjetosDeAluno(req, res) {
    const alunoId = req.params.id;

    try {
        const result = await alunoModel.listarProjetosDeAluno(alunoId);
        if (result.success) {
            return res.json(result.data);
        } else {
            return sendErrorResponse(res, result.error);
        }
    } catch (error) {
        console.error(error);
        return handleError(res, 'Erro ao buscar projetos do aluno');
    }
}

const cadastrarAlunoController = async (req, res) => {
    try {
        const { nome, email, senha, cursoId, matricula } = req.body;
        const resultado = await alunoModel.cadastrarAluno({ nome, email, senha }, cursoId, matricula);

        if (resultado.success) {
            return sendSuccessResponse(res, resultado.message);
        } else {
            return sendErrorResponse(res, resultado.message, 400);
        }
    } catch (error) {
        console.error(error);
        return handleError(res, 'Erro ao cadastrar aluno');
    }
};

module.exports = { listarTodosAlunos, listarProjetosDeAluno, cadastrarAlunoController };